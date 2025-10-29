<template>
  <div style="margin-top: 8pt;">
    <v-row class="mx-2">
      <v-col cols="12" md="4" class="d-flex justify-space-between">
        <v-text-field
          v-model="search"
          outlined
          prepend-inner-icon="search"
          label="Search"
          single-line
          hide-details
          class="rounded-lg gboFonts" 
          color="#F5B027"
          dense
        ></v-text-field>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12" md="8" class="flex-items justify-end">
        <v-btn
          style="width: 125pt; background-color: #F5B027;"
          class="white--text ml-2 rounded-lg"
          :color="$vuetify.theme.themes.light.submitBtns"
          v-if="this.$store.state.user.user.isAdminApproved == 1"
          @click="add()"
        >
          <v-icon class="gboFonts" left> mdi-plus-box-outline </v-icon>
          Add New
        </v-btn>
      </v-col>
    </v-row>
    <v-card class="ma-5 dt-container" elevation="0" outlined>
      <v-data-table
        class="custom-table"
        :headers="headers"
        :items="data"
        :items-per-page="10"
        :search="search"
        :options.sync="options"
        :loading="loading"
        @pagination="pagination"
        hide-default-footer
      >
        <template v-slot:[`item.tracks_name`]="{ item }">
          <span>{{ item.tracks_name }}</span>
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <div class="text-no-wrap gboFontsTable" style="padding: 4px;">
            <v-btn
              small
              color="blue"
              class="my-2 mx-2 gboFontsTable"
              outlined
              @click="editItem(item)"
            >
              <v-icon size="20" class="gboFontsTable">mdi-pencil-outline</v-icon>&nbsp;Update
            </v-btn>

          </div>
        </template>
      </v-data-table>
    </v-card>
    <v-row class="mb-2 mx-5" align="center">
      <v-col cols="auto" class="mr-auto text-truncate flex-items" no-gutters>
        <span class="px-2 gboFonts">Show</span>
        <span>
          <v-select
            dense
            outlined
            color="#f5b027"
            hide-details
            :value="options.itemsPerPage"
            style="max-width: 90px"
            class="rounded-lg gboFonts"
            @change="options.itemsPerPage = parseInt($event, 10)"
            :items="perPageChoices"
          >
          </v-select>
        </span>
        <span class="px-2 gboFonts"> Entries </span>
      </v-col>

      <v-col cols="auto" class="mr-auto text-truncate gboFonts" no-gutters>
        Showing {{ paginationData.pageStart + 1 }} to
        {{ paginationData.pageStop }} of
        {{ paginationData.itemsLength }} entries
      </v-col>
      <v-col cols="auto">
        <v-pagination
          v-model="options.page"
          class="rounded-lg gboFonts"
          :total-visible="7"
          :color="$vuetify.theme.themes.light.submitBtns"
          :length="paginationData.pageCount"
        >
        </v-pagination>
      </v-col>
    </v-row>

    <AddTrackDialog :data="coreTimeData" :action="action" :grade="gradeName" />
    <v-dialog v-model="confirmDialog" persistent max-width="350">
      <v-card color="white">
        <div class="pa-4 #3a3b3a--text">
          <div class="text-h6 mb-1">WARNING!</div>
          <div class="text-body-1 mb-1">
            <p style="text-align: justify">
              <v-icon class="mt-n2" color="white">mdi-alert</v-icon> &nbsp; Are
              you sure you want to delete this information?<br /><br />
              Please note that
              <b>this action is irreversible.</b>
            </p>
          </div>
        </div>

        <!-- <v-card-title class="text-h5">
                  Are you sure you want to proceed?
                </v-card-title> -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="confirmDialog = false" class="gboFonts">
            Close
          </v-btn>
          <v-btn color="#f5b027" class="white--text gboFonts" @click="deleteItem()">
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
      :timeout="5000"
    ></fade-away-message-component>
  </div>
</template>
<script>
export default {
  components: {
    // CoreTimeDesignationDialog: () =>
    //   import("../../components/Dialogs/Forms/CoreTimeDesignationDialog.vue"),
    AddTrackDialog: () =>
      import("../../components/Dialogs/Forms/AddTrackDialog.vue"),
  },
  data: () => ({
    search: "",
    taggingData: null,
    fullname: null,
    applicantData: null,
    headers: [
      {
        text: "Track Name",
        value: "tracks_name",
        align: "start",
        valign: "start",
        sortable: false,
      },

      {
        text: "Action",
        value: "action",
        align: "end",
        valign: "end",
        sortable: false,
      },
    ],

    data: [],
    gradeName: null,
    printData: [],
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
    activeTab: { id: 1, name: "Tracks" },
    tab: 1,
    tabList: [{ id: 1, name: "Tracks" }],
    coreTimeData: null,
    designationData: null,
    totalCount: 0,
    deleteData: null,
    updateData: null,
    loading: false,
    options: {},
    action: null,
    toPrint: null,
    reportTypeList: [],
    jobitem: null,
    jobitemsList: [],
    selectedYear: null,
    selectedMonth: null,
    paginationData: {},
    formdata: [],
    work_dates_menu: false,
    confirmDialog: false,
    JobPostPrint: false,
    fadeAwayMessage: {
      show: false,
      type: "success",
      header: "Successfully Deleted!",
      message: "",
      top: 10,
    },
    yearList: [],
    monthsList: [
      { id: 0, name: "All" },
      { id: 1, name: "January" },
      { id: 2, name: "February" },
      { id: 3, name: "March" },
      { id: 4, name: "April" },
      { id: 5, name: "May" },
      { id: 6, name: "June" },
      { id: 7, name: "July" },
      { id: 8, name: "August" },
      { id: 9, name: "September" },
      { id: 10, name: "October" },
      { id: 11, name: "November" },
      { id: 12, name: "December" },
    ],
  }),

  mounted() {
    // this.eventHub.$on("closeMyJobApplicationDialog", () => {
    //   this.initialize();
    // });
    this.eventHub.$on("closeAddTrackDialog", () => {
      this.initialize();
    });

    // this.eventHub.$on("closeMyDesignationDialog", () => {
    //   this.initialize();
    // });
  },

  beforeDestroy() {
    // this.eventHub.$off("closeMyJobApplicationDialog");
    this.eventHub.$off("closeAddTrackDialog");

    // this.eventHub.$off("closeMyDesignationDialog");
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
  computed: {
    filterYear() {
      return this.$store.getters.getFilterSelected;
    },

    // filterPrintData() {
    //   return this.paginate(
    //     this.data.filter((data) =>
    //       data.employee.toLowerCase().match(this.search.toLowerCase())
    //     )
    //   );
    // },
  },
  methods: {
    tag(item) {
      this.taggingData = item;
      this.action = "Tag";
    },

    printJobApplicants() {
      this.JobPostPrint = true;

      // this.handleAllChanges();
    },
    pagination(data) {
      this.paginationData = data;
    },

    initialize() {
      // this.handleAllChanges();
      this.loading = true;
      this.axiosCall("/rooms-section/getAlltracks/Data/tracks", "GET").then(
        (res) => {
          if (res) {
            this.data = res.data;
            this.loading = false;
          }
        }
      );
    },

    changeTab(tab) {
      this.activeTab = tab;

      // if (tab.id == 1) {

      this.tab = tab.id;
      this.initialize();
      // } else if (tab.id == 2) {
      //   this.getVerifiedUsers();
      //   this.tab = tab.id;
      // }
    },
    add() {
      this.coreTimeData = [{ id: null }];
      this.action = "Add";
    },
    editItem(item) {
      console.log(this.tab, item);
      this.coreTimeData = item;
      this.action = "Update";
    },

    // deleteItem() {
    //   this.axiosCall("/rooms-section/" + this.deleteData.id, "DELETE").then(
    //     (res) => {
    //       if (res.data.status == 200) {
    //         this.dialog = false;
    //         this.fadeAwayMessage.show = true;
    //         this.fadeAwayMessage.type = "success";
    //         this.fadeAwayMessage.header = "System Message";
    //         this.fadeAwayMessage.message = res.data.msg;
    //         this.confirmDialog = false;
    //         this.initialize();
    //       } else if (res.data.status == 400) {
    //         this.confirmDialog = false;
    //         this.fadeAwayMessage.show = true;
    //         this.fadeAwayMessage.type = "error";
    //         this.fadeAwayMessage.header = "System Message";
    //         this.fadeAwayMessage.message = res.data.msg;
    //       }
    //     }
    //   );
    // },
    // confirmDelete(item) {
    //   this.confirmDialog = true;
    //   this.deleteData = item;
    // },
  },
};
</script>

<style scoped>

.gboFonts{
  font-family: 'Segoe UI', !important;
  font-size: 11pt;
}

.gboFontsTab{
  font-family: 'Segoe UI', !important;
  font-size: 12pt;
}

.gboFontsTable{
  font-family: 'Segoe UI', !important;
  font-size: 10.5pt;
}

.custom-table :deep(th) { 
  font-size: 11pt !important; 
  line-height: 1.5;
} 

</style>