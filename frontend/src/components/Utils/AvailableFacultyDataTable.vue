<template>
  <div>
    <v-row class="mx-2">
      <v-col cols="12" md="8" class="flex-items">
        <!-- <v-tabs v-model="activeTab" color="#147452" align-tabs="left">
            <v-tab v-for="tab in tabList" :key="tab.id" @click="changeTab(tab)">{{
              tab.name
            }}</v-tab>
          </v-tabs> -->
        <v-btn
          class="white--text ml-2 rounded-lg"
          :color="$vuetify.theme.themes.light.submitBtns"
          v-if="this.$store.state.user.user.isAdminApproved == 1"
          @click="underLoad()"
        >
          <v-icon left> mdi-clipboard-list-outline </v-icon>
          List of Underload/Overloaded Teachers
        </v-btn>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12" md="4" class="d-flex justify-space-between">
        <v-text-field
          v-model="search"
          outlined
          prepend-inner-icon="search"
          label="Search"
          single-line
          hide-details
          class="rounded-lg"
          color="#239FAB"
          dense
        ></v-text-field>
        <v-btn
          class="white--text ml-2 rounded-lg"
          :color="$vuetify.theme.themes.light.submitBtns"
          @click="printDialog = true"
        >
          <v-icon left> mdi-printer-outline </v-icon>
          Print
        </v-btn>
        <!-- <v-btn
          class="white--text ml-2 rounded-lg"
          :color="$vuetify.theme.themes.light.submitBtns"
          v-if="this.$store.state.user.user.isAdminApproved == 1"
          @click="add()"
        >
          <v-icon left> mdi-plus-box-outline </v-icon>
          Add New
        </v-btn> -->
        <!-- <v-btn
                  :class="tab == 3 ? '' : 'd-none'"
                  class="white--text ml-2 rounded-lg"
                  color="#147452"
                  v-if="this.$store.state.user.user.isAdminApproved == 1"
                  @click="printJobApplicants()"
                >
                  <v-icon left> mdi-printer-outline </v-icon>
                  Print
                </v-btn> -->
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
        <!--   <template v-slot:[`item.action`]="{ item }">
          <div class="text-no-wrap" style="padding: 4px;">
            <v-btn
              x-small
              color="blue"
              class="my-2 mx-2"
              outlined
              @click="print(item)"
            >
              <v-icon size="14">mdi-printer-outline</v-icon>Print
            </v-btn>
            <v-btn
                x-small
                color="red"
                class="my-2"
                outlined
                @click="confirmDelete(item)"
              >
                <v-icon size="14">mdi-delete-off</v-icon>Delete
              </v-btn> 
          </div>
        </template>-->
      </v-data-table>
    </v-card>
    <v-row class="mb-2 mx-5" align="center">
      <v-col cols="auto" class="mr-auto text-truncate flex-items" no-gutters>
        <span class="px-2">Show</span>
        <span>
          <v-select
            dense
            outlined
            color="#147452"
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

    <AddTrackDialog :data="coreTimeData" :action="action" :grade="gradeName" />

    <v-dialog v-model="printDialog" persistent max-width="550">
      <v-card color="white">
        <div class="pa-4 #3a3b3a--text">
          <div class="text-h6 mb-1">Please select faculty to print!</div>
          <div class="text-body-1 mb-1 mt-5">
            <v-autocomplete
              v-model="teacher"
              :rules="[formRules.required]"
              dense
              outlined
              class="rounded-lg"
              item-text="name"
              item-value="id"
              label="Teacher to assign"
              color="#93CB5B"
              :items="TeachersList"
            >
            </v-autocomplete>
          </div>
        </div>

        <!-- <v-card-title class="text-h5">
                    Are you sure you want to proceed?
                  </v-card-title> -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="printDialog = false">
            Close
          </v-btn>
          <v-btn color="#147452" class="white--text" @click="printMySched()">
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
    TeachersList: [],
    teacher: null,
    headers: [
      {
        text: "Time",
        value: "time",
        align: "start",
        valign: "start",
        sortable: false,
      },
      {
        text: "Faculty Name",
        value: "name",
        align: "start",
        valign: "start",
        sortable: false,
      },
      {
        text: "Monday",
        value: "Monday",
        align: "center",
        valign: "center",
        sortable: false,
      },
      {
        text: "Tuesday",
        value: "Tuesday",
        align: "center",
        valign: "center",
        sortable: false,
      },
      {
        text: "Wednesday",
        value: "Wednesday",
        align: "center",
        valign: "center",
        sortable: false,
      },
      {
        text: "Thursday",
        value: "Thursday",
        align: "center",
        valign: "center",
        sortable: false,
      },
      {
        text: "Friday",
        value: "Friday",
        align: "center",
        valign: "center",
        sortable: false,
      },
      // {
      //   text: "Saturday",
      //   value: "Saturday",
      //   align: "center",
      //   valign: "center",
      //   sortable: false,
      // },

      // {
      //   text: "Action",
      //   value: "action",
      //   align: "end",
      //   valign: "end",
      //   sortable: false,
      // },
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
    printDialog: false,
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
      this.getRoleTeachers();
      this.loading = true;
      let filter = this.$store.getters.getFilterSelected;
      this.axiosCall("/enroll-student/FacultySchedule/" + filter, "GET").then(
        (res) => {
          if (res) {
            this.data = res.data;
            this.loading = false;
          }
        }
      );
    },
    underLoad() {
      // alert("underload faculty");
      let filter = this.$store.getters.getFilterSelected;
      window.open(
        process.env.VUE_APP_SERVER +
          "/pdf-generator/getAllUnderLoadFaculty/" +
          filter +
          "",
        "_blank"
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

    getRoleTeachers() {
      this.axiosCall(
        "/user-details/getAllVerifiedUser/TeachingRoleSched",
        "GET"
      ).then((res) => {
        console.log("Teacher Role", res.data);
        this.TeachersList = res.data;
      });
    },

    printMySched() {
      console.log("User", this.teacher);
      if (this.teacher == null) {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message = "Please select teacher to generate!";
      } else {
        this.printDialog = false;
        let filter = this.$store.getters.getFilterSelected;
        window.open(
          process.env.VUE_APP_SERVER +
            "/pdf-generator/getMySchedule/" +
            this.teacher +
            "/" +
            filter +
            "",
          "_blank" // <- This is what makes it open in a new window.
        );
      }
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
    //         this.printDialog = false;
    //         this.initialize();
    //       } else if (res.data.status == 400) {
    //         this.printDialog = false;
    //         this.fadeAwayMessage.show = true;
    //         this.fadeAwayMessage.type = "error";
    //         this.fadeAwayMessage.header = "System Message";
    //         this.fadeAwayMessage.message = res.data.msg;
    //       }
    //     }
    //   );
    // },
    // confirmDelete(item) {
    //   this.printDialog = true;
    //   this.deleteData = item;
    // },
  },
};
</script>
