e<template>
  <div>
    <v-row class="mx-2">
      <v-col cols="12" md="5" class="pa-0">
        <v-tabs v-model="activeTab" color="#EA7142" align-tabs="left">
          <v-tab v-for="tab in tabList" :key="tab.id" @click="changeTab(tab)">{{
            tab.subject_title
          }}</v-tab>
        </v-tabs>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12" md="3">
        <v-text-field
          v-model="search"
          outlined
          prepend-inner-icon="search"
          label="Search"
          single-line
          hide-details
          class="rounded-lg"
          color="#EA7142"
          dense
        ></v-text-field>
      </v-col>
    </v-row>
    <v-card class="ma-5 dt-container" elevation="0" outlined>
      <v-data-table
        :headers="headers"
        :items="data"
        :items-per-page="10"
        :search="search"
        :options.sync="options"
        :loading="loading"
        @pagination="pagination"
        hide-default-footer
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            class="mx-2"
            x-small
            color="green"
            outlined
            @click="viewItem(item)"
          >
            <v-icon size="14">mdi-pencil</v-icon>
            Attendance
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    <v-row class="mb-2 mx-5" align="center">
      <v-col cols="auto" class="mr-auto text-truncate flex-items" no-gutters>
        <span class="px-2">Show</span>
        <span>
          <v-select
            dense
            outlined
            color="#EA7142"
            hide-details
            :value="options.itemsPerPage"
            style="max-width: 90px"
            class="rounded-lg"
            @change="options.itemsPerPage = parseInt($event, 10)"
            :items="perPageChoices"
          >
          </v-select>
        </span>
        <span class="px-2"> Entries </span>
      </v-col>

      <v-col cols="auto" class="mr-auto text-truncate" no-gutters>
        Showing {{ paginationData.pageStart + 1 }} to
        {{ paginationData.pageStop }} of
        {{ paginationData.itemsLength }} entries
      </v-col>
      <v-col cols="auto">
        <v-pagination
          v-model="options.page"
          class="rounded-lg"
          :total-visible="7"
          :color="$vuetify.theme.themes.light.submitBtns"
          :length="paginationData.pageCount"
        >
        </v-pagination>
      </v-col>
    </v-row>

    <ViewStudentAttendanceDialog :data="viewData" :action="action" />

    <v-dialog v-model="dialogConfirmDelete" max-width="500">
      <v-card>
        <v-card-title class="text-h5"> Confirmation </v-card-title>

        <v-card-text style="font-size: 17px">
          Are you sure you want to delete this item ?
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="teal darken-3"
            outlined
            @click="dialogConfirmDelete = false"
          >
            Cancel
          </v-btn>

          <v-btn
            :color="$vuetify.theme.themes.light.submitBtns"
            class="white--text"
            @click="
              confirmDelete();
              dialogConfirmDelete = false;
            "
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <fade-away-message-component
      displayType="variation2"
      v-model="fadeAwayMessage.show"
      :message="fadeAwayMessage.message"
      :header="fadeAwayMessage.header"
      :top="fadeAwayMessage.top"
      :type="fadeAwayMessage.type"
    ></fade-away-message-component>
  </div>
</template>
<script>
export default {
  components: {
    ViewStudentAttendanceDialog: () =>
      import("../Dialogs/Views/ViewStudentAttendanceDialog.vue"),
  },
  data: () => ({
    search: "",
    headers: [
      { text: "Class name", value: "room_section", align: "start" },
      {
        text: "Actions",
        value: "actions",
        align: "center",
        sortable: false,
        width: 200,
      },
    ],
    data: [],
    verified: [],
    perPageChoices: [
      { text: "5", value: 5 },
      { text: "10", value: 10 },
      { text: "20", value: 20 },
      { text: "50", value: 50 },
      { text: "100", value: 100 },
      { text: "250", value: 250 },
      { text: "500", value: 500 },
    ],
    activeTab: {},
    tab: 1,
    tabList: [],
    totalCount: 0,
    deleteData: null,
    viewData: null,
    loading: false,
    options: {},
    action: null,
    paginationData: {},
    formdata: [],
    work_dates_menu: false,
    dialogConfirmDelete: false,
    fadeAwayMessage: {
      show: false,
      type: "success",
      header: "Successfully Deleted!",
      message: "",
      top: 10,
    },
  }),

  mounted() {
    this.eventHub.$on("closeStudentAttendanceDialog", () => {
      this.initialize();
    });
  },
  beforeDestroy() {
    this.eventHub.$off("closeStudentAttendanceDialog");
  },
  computed: {
    filterYear() {
      return this.$store.getters.getFilterSelected;
    },
  },
  watch: {
    options: {
      handler() {
        this.initialize();
      },
      deep: true,
    },
    filterYear: {
      handler(newData, oldData) {
        if (oldData != newData) {
          this.initialize();
        }
      },
      deep: true,
    },
  },

  methods: {
    pagination(data) {
      this.paginationData = data;
    },

    initialize() {
      this.getMySubjectList();
    },
    async getMySubjectList() {
      const res = await this.axiosCall("/subjects/getMySubjects", "GET");

      if (res.data && res.data.length > 0) {
        let data = res.data;

        // Flatten if needed
        if (Array.isArray(data[0])) {
          data = data[0];
        }

        // Format titles + mark first as active
        data = data.map((item, index) => ({
          ...item,
          subject_title: this.toTitleCase(item.subject_title),
          active: index === 0, // ✅ mark first as active
        }));

        // ✅ Set first tab values
        this.tab = data[0].id;
        this.activeTab = data[0];
        this.tabList = data;
        this.getMyClassRecord();
      }
    },
    getMyClassRecord() {
      let filter = this.$store.getters.getFilterSelected;
      // alert(filter);
      this.axiosCall(
        "/subjects/getMyClassRecord/" + filter + "/" + this.tab,
        "GET"
      ).then((res) => {
        if (res.data.status != 500 && Array.isArray(res.data)) {
          // res.data.forEach((element, i) => {
          //   res.data[i].room_section = this.toUpperCase(
          //     element.room_section || ""
          //   );
          // });
          this.data = res.data;
        } else {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message =
            "Please set your prefered subject in profile tab!";
        }
      });
    },

    changeTab(tab) {
      this.activeTab = tab;
      this.tab = tab.id;
      this.getMyClassRecord();
    },
    // deleteItem(item) {
    //   this.dialogConfirmDelete = true;
    //   this.deleteData = item;
    // },

    viewItem(item) {
      console.log(item);
      this.viewData = item;
      this.action = "View";
    },
    // confirmDelete() {
    //   this.axiosCall("/request-type/" + this.deleteData.id, "DELETE").then(
    //     () => {
    //       this.fadeAwayMessage.show = true;
    //       this.itemData = null;
    //       this.initialize();
    //     }
    //   );
    // },
  },
};
</script>
