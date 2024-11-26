<template>
  <div>
    <v-row class="mx-2">
      <v-col cols="12" md="8"> </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12" md="4" class="d-flex justify-space-between align-center">
        <v-text-field
          v-model="search"
          outlined
          prepend-inner-icon="search"
          label="Search"
          single-line
          hide-details
          class="rounded-lg"
          color="#6DB249"
          dense
        ></v-text-field>

        <v-btn color="#519043" class="white--text ml-2" @click="addSchedule()">
          <v-icon class="mr-2">mdi-check-circle</v-icon>
          Add
        </v-btn>
      </v-col>
    </v-row>
    <v-card class="ma-5 dt-container" elevation="0" outlined>
      <v-data-table
        :headers="headers"
        :items="data"
        :items-per-page="10"
        v-model="selected"
        :search="search"
        :options.sync="options"
        :loading="loading"
        @pagination="pagination"
        hide-default-footer
      >
        <template v-slot:[`item.user`]="{ item }">
          {{
            item.user.mname
              ? item.user.fname +
                " " +
                item.user.mname[0] +
                ". " +
                item.user.lname
              : item.user.fname + " " + item.user.lname
          }}
        </template>
        <template v-slot:[`item.date_from`]="{ item }">
          {{ formatDate(item.date_from) }}
        </template>
        <template v-slot:[`item.date_to`]="{ item }">
          {{ formatDate(item.date_to) }}
        </template>
        <template v-slot:[`item.allow_update`]="{ item }">
          {{ item.allow_update == true ? "Allowed" : "Not allowed" }}
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn x-small color="grey" outlined @click="editItem(item)">
            <v-icon size="14">mdi-pencil-outline</v-icon> Update
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
            color="#6DB249"
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

    <!-- <AllowPDSUpdateDialog :data="updateData" :action="action" /> -->
    <SchedulePDSUpdateDialog :data="updateData" :action="action" />
    <!-- <GroupAllowPDSUpdateDialog :data="groupData" /> -->

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
            color="teal darken-3"
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
    // AllowPDSUpdateDialog: () =>
    //   import("../../components/Dialogs/Forms/AllowPDSUpdateDialog.vue"),
    SchedulePDSUpdateDialog: () =>
      import("../../components/Dialogs/Forms/SchedulePDSUpdateDialog.vue"),
    // GroupAllowPDSUpdateDialog: () =>
    //   import("../../components/Dialogs/Forms/GroupAllowPDSUpdateDialog.vue"),
  },
  data: () => ({
    search: "",
    selected: [],
    status: ["Allowed", "Not allowed"],
    headers: [
      { text: "Purpose", value: "purpose", align: "start" },
      { text: "Date (from)", value: "date_from", align: "start" },
      { text: "Date (to)", value: "date_to", align: "start" },
      // { text: "Status", value: "allow_update", align: "start" },
      {
        text: "Actions",
        value: "actions",
        align: "center",
        sortable: false,
        width: 200,
      },
    ],
    data: [],
    perPageChoices: [
      { text: "5", value: 5 },
      { text: "10", value: 10 },
      { text: "20", value: 20 },
      { text: "50", value: 50 },
      { text: "100", value: 100 },
      { text: "250", value: 250 },
      { text: "500", value: 500 },
    ],
    totalCount: 0,
    groupData: null,
    updateData: null,
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
  watch: {
    options: {
      handler() {
        this.initialize();
      },
      deep: true,
    },
  },
  computed: {
    hasSelected() {
      if (this.selected == null || this.selected == []) {
        return false;
      } else {
        return this.selected.length > 0;
      }
    },
  },
  mounted() {
    this.eventHub.$on("closeSchedulePDSUpdateDialog", () => {
      this.initialize();
    });
  },
  beforeDestroy() {
    this.eventHub.$off("closeSchedulePDSUpdateDialog");
  },
  methods: {
    pagination(data) {
      this.paginationData = data;
    },
    initialize() {
      this.loading = true;
      this.selected = [];
      this.axiosCall("/allow-pds-update", "GET").then((res) => {
        if (res) {
          this.data = res.data;
          this.loading = false;
        }
      });
    },
    addSchedule() {
      this.updateData = [{ id: null }];
      this.action = "Add";
    },
    groupAllow() {
      var namesArray = [];
      var idArray = [];
      for (let i = 0; i < this.selected.length; i++) {
        const element = this.selected[i];

        idArray.push(element.id);
        if (element.user.mname) {
          namesArray.push(
            element.user.fname +
              " " +
              element.user.mname[0] +
              ". " +
              element.user.lname
          );
        } else {
          namesArray.push(element.user.fname + " " + element.user.lname);
        }
      }

      namesArray.sort();
      this.groupData = { id: null };
      setTimeout(() => {
        this.groupData = {
          namesArray: namesArray,
          idArray: idArray,
        };
      }, 100);
    },
    deleteItem(item) {
      this.dialogConfirmDelete = true;
      this.deleteData = item;
    },
    editItem(item) {
      // setTimeout(() => {
      //   this.updateData = [{ id: null }];
      // }, 100);
      this.updateData = item;
      this.action = "Update";
    },
    confirmDelete() {
      this.axiosCall("/request-type/" + this.deleteData.id, "DELETE").then(
        () => {
          this.fadeAwayMessage.show = true;
          this.itemData = null;
          this.initialize();
        }
      );
    },
  },
};
</script>
