<template>
  <div>
    <v-row class="mx-2">
      <v-col cols="12" md="8" class="flex-items">
        <v-tabs v-model="activeTab" color="#147452" align-tabs="left">
          <v-tab v-for="tab in tabList" :key="tab.id" @click="changeTab(tab)">{{
            tab.name
          }}</v-tab>
        </v-tabs>
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
          v-if="this.$store.state.user.user.isAdminApproved == 1"
          @click="add()"
        >
          <v-icon left> mdi-plus-box-outline </v-icon>
          Add New
        </v-btn>
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
        :rows="items"
      >
        <template v-slot:[`item.action`]="{ item }">
          <div class="text-no-wrap" style="padding: 4px;">
            <v-btn
              x-small
              color="blue"
              class="my-2 mx-2"
              outlined
              @click="editItem(item)"
            >
              <v-icon size="14">mdi-pencil-outline</v-icon>Update
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

    <MyJobPosting :data="coreTimeData" :action="action" :grade="gradeName" />
    <MyJobApplication :data="designationData" :action="action" />
    <ApplicantOfJobDialog :data="applicantData" :action="action" />
    <ShortListedtagging :data="taggingData" :action="action" />

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
          <v-btn color="red" outlined @click="confirmDialog = false">
            Close
          </v-btn>
          <v-btn color="#147452" class="white--text" @click="deleteItem()">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog fullscreen scrollable persistent v-model="JobPostPrint">
      <v-card>
        <v-card-title dark class="dialog-header">
          <span>Type of Report</span>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="JobPostPrint = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form ref="PrintFormref">
            <v-row class="mt-4">
              <v-col cols="4">
                <v-autocomplete
                  label="Position"
                  v-model="toPrint"
                  :rules="[formRules.required]"
                  @change="handleAllChanges"
                  dense
                  class="rounded-lg"
                  item-text="type"
                  item-value="id"
                  color="#93CB5B"
                  :items="reportTypeList"
                >
                </v-autocomplete>
              </v-col>
              <v-col cols="1">
                <v-autocomplete
                  label="Year"
                  v-model="selectedYear"
                  :rules="[formRules.required]"
                  @change="handleAllChanges"
                  dense
                  class="rounded-lg"
                  color="#93CB5B"
                  :items="yearList"
                >
                </v-autocomplete>
              </v-col>
            </v-row>
            <v-card-title> </v-card-title>
            <!-- <v-data-table :headers="headers3" :items="printData">
                <template v-slot:[`item.birth`]="{ item }">
                  {{ formatDate(item.birth) }}
                </template>
              </v-data-table> -->
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-5">
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="JobPostPrint = false">
            <v-icon>mdi-close-circle-outline</v-icon>
            Cancel
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
    ApplicantOfJobDialog: () =>
      import("../../components/Dialogs/Forms/ApplicantOfJobDialog.vue"),
    MyJobApplication: () =>
      import("../../components/Dialogs/Forms/MyJobApplicationDialog.vue"),
    MyJobPosting: () =>
      import("../../components/Dialogs/Forms/AddRoomSectionDialog.vue"),
    ShortListedtagging: () =>
      import("../../components/Dialogs/Forms/ShortListedtaggingDialog.vue"),
  },
  data: () => ({
    search: "",
    taggingData: null,
    fullname: null,
    applicantData: null,
    headers: [
      {
        text: "Room Name",
        value: "room_section",
        align: "start",
        valign: "start",
        sortable: false,
      },

      {
        text: "Grade Level",
        value: "grade_level",
        align: "center",
        valign: "center",
        sortable: false,
      },

      {
        text: "Action",
        value: "action",
        align: "center",
        valign: "center",
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
    activeTab: { id: 1, name: "Active-Jobs" },
    tab: 1,
    tabList: [
      { id: 1, name: "Grade 7" },
      { id: 2, name: "Grade 8" },
      { id: 3, name: "Grade 9" },
      { id: 4, name: "Grade 10" },
      { id: 5, name: "Grade 11" },
      { id: 6, name: "Grade 12" },
    ],
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
    this.loadYear();

    // this.eventHub.$on("closeMyJobApplicationDialog", () => {
    //   this.initialize();
    // });
    this.eventHub.$on("closeAddSubjectDialog", () => {
      this.initialize();
    });
    this.eventHub.$on("closeApplicantJobList", () => {
      this.initialize();
    });
    this.eventHub.$on("closeMyJobApplicationDialog", () => {
      this.initialize();
    });
    this.eventHub.$on("closeShortListDialog", () => {
      this.initialize();
    });

    // this.eventHub.$on("closeMyDesignationDialog", () => {
    //   this.initialize();
    // });
  },

  beforeDestroy() {
    // this.eventHub.$off("closeMyJobApplicationDialog");
    this.eventHub.$off("closeAddSubjectDialog");
    this.eventHub.$off("closeApplicantJobList");
    this.eventHub.$off("closeMyJobApplicationDialog");
    this.eventHub.$off("closeShortListDialog");

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
    printApplicants(item) {
      console.log("Item Print Report", item.id);
      let data = this.printData;
      let filter = this.$store.getters.getFilterSelected;
      console.log("Print Data", data);
      window.open(
        process.env.VUE_APP_SERVER +
          "/pdf-generator/generateJobApplicant/" +
          item.id +
          "/" +
          filter +
          "",
        "_blank" // <- This is what makes it open in a new window.
      );
    },
    handleAllChanges() {
      // Logic to handle changes for all three selects
      // let output = `Selected value A: ${this.toPrint}, Selected value B: ${this.selectedMonth}, Selected value C: ${this.selectedYear}`;
      console.log("Job Item", this.jobitem);
      if (this.toPrint == "All") {
        console.log("initial position", this.toPrint);
        this.axiosCall("/job-applicant/" + this.selectedYear, "GET").then(
          (res) => {
            if (res) {
              this.printData = res.data;
            }
          }
        );
      } else {
        this.axiosCall(
          "/job-applicant/findToPrint/" +
            this.toPrint +
            "/" +
            this.jobitem +
            "/" +
            this.selectedMonth +
            "/" +
            this.selectedYear +
            "",
          "GET"
        ).then((res) => {
          console.log("onchangeData", res.data);
          this.printData = res.data;
        });
      }

      // console.log("three onchange", output);
    },
    getAllposition() {
      this.axiosCall("/job-posting", "GET").then((res) => {
        let arr = [];
        let jobitem = [];
        for (let index = 0; index < res.data.length; index++) {
          // const element = res.data[index].position_title;
          const element = res.data[index];
          const items = res.data[index].plantilla_item;
          jobitem.push(items);
          arr.push(element);
        }
        console.log("JobPosted", arr);
        arr.unshift("All");
        jobitem.unshift("All");
        this.toPrint = arr[0];
        this.jobitem = jobitem[0];
        this.selectedMonth = this.monthsList[0].id;
        this.selectedYear = this.yearList[0];
        this.reportTypeList = arr;
        this.jobitemsList = jobitem;
      });
    },

    loadYear() {
      let curYear;
      var d = new Date();
      curYear = d.getFullYear();
      for (let i = curYear; i >= 2020; i--) {
        this.yearList.push(i);
      }
    },
    printJobApplicants() {
      this.JobPostPrint = true;

      this.handleAllChanges();
    },
    pagination(data) {
      this.paginationData = data;
    },

    initialize() {
      // this.handleAllChanges();
      this.loading = true;
      let filter = this.$store.getters.getFilterSelected;
      console.log("Filted", filter);

      if (this.tab == 1) {
        this.gradeName = "Grade 7";
        this.axiosCall("/rooms-section/" + "Grade 7", "GET").then((res) => {
          if (res) {
            console.log("Love", res.data);
            this.data = res.data;
            this.loading = false;
          }
        });
      } else if (this.tab == 2) {
        this.gradeName = "Grade 8";

        this.axiosCall("/rooms-section/" + "Grade 8", "GET").then((res) => {
          if (res) {
            console.log("Love", res.data);
            this.data = res.data;
            this.loading = false;
          }
        });
      } else if (this.tab == 3) {
        this.gradeName = "Grade 9";

        this.axiosCall("/rooms-section/" + "Grade 9", "GET").then((res) => {
          if (res) {
            console.log("Love", res.data);
            this.data = res.data;
            this.loading = false;
          }
        });
      } else if (this.tab == 4) {
        this.gradeName = "Grade 10";

        this.axiosCall("/rooms-section/" + "Grade 10", "GET").then((res) => {
          if (res) {
            console.log("Love", res.data);
            this.data = res.data;
            this.loading = false;
          }
        });
      } else if (this.tab == 5) {
        this.gradeName = "Grade 11";

        this.axiosCall("/rooms-section/" + "Grade 11", "GET").then((res) => {
          if (res) {
            console.log("Love", res.data);
            this.data = res.data;
            this.loading = false;
          }
        });
      } else if (this.tab == 6) {
        this.gradeName = "Grade 12";

        this.axiosCall("/rooms-section/" + "Grade 12", "GET").then((res) => {
          if (res) {
            console.log("Love", res.data);
            this.data = res.data;
            this.loading = false;
          }
        });
      }
    },

    switchItem(item) {
      if (this.tab == 1) {
        this.axiosCall("/my-core-time/toggleActive/" + item.id, "PATCH").then(
          (res) => {
            if (res) {
              if (res.data.status == 200) {
                this.fadeAwayMessage.show = true;
                this.fadeAwayMessage.type = "success";
                this.fadeAwayMessage.header = "System Message";
                this.fadeAwayMessage.message = res.data.msg;
                this.initialize();
              } else {
                this.fadeAwayMessage.show = true;
                this.fadeAwayMessage.type = "error";
                this.fadeAwayMessage.header = "System Message";
                this.fadeAwayMessage.message = res.data.msg;
              }
            }
          }
        );
      } else if (this.tab == 2) {
        this.axiosCall("/my-designation/toggleActive/" + item.id, "PATCH").then(
          (res) => {
            if (res) {
              if (res.data.status == 200) {
                this.fadeAwayMessage.show = true;
                this.fadeAwayMessage.type = "success";
                this.fadeAwayMessage.header = "System Message";
                this.fadeAwayMessage.message = res.data.msg;
                this.initialize();
              } else {
                this.fadeAwayMessage.show = true;
                this.fadeAwayMessage.type = "error";
                this.fadeAwayMessage.header = "System Message";
                this.fadeAwayMessage.message = res.data.msg;
              }
            }
          }
        );
      }
    },

    // getVerifiedUsers() {
    //   this.loading = true;

    //   this.axiosCall("/user-details/getAllVerifiedUser", "GET").then((res) => {
    //     if (res) {
    //       this.data = [];

    //       this.data = res.data;
    //       this.loading = false;
    //     }
    //   });
    // },

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
      if (this.tab == 3) {
        this.designationData = [{ id: null }];
        this.action = "Add";
      } else {
        this.coreTimeData = [{ id: null }];
        this.action = "Add";
      }
    },
    editItem(item) {
      console.log(this.tab, item);
      this.coreTimeData = item;
      this.action = "Update";
    },
    viewApplicant(item) {
      this.applicantData = item;
      this.action = 1;
    },
    viewHiredApplicant(item) {
      this.applicantData = item;
      this.action = 2;
    },
    viewItem(item) {
      if (this.tab == 1) {
        this.coreTimeData = item;
        this.action = "View";
      } else {
        this.designationData = item;
        this.action = "View";
      }
    },

    deleteItem() {
      this.axiosCall("/rooms-section/" + this.deleteData.id, "DELETE").then(
        (res) => {
          if (res.data.status == 200) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.confirmDialog = false;
            this.initialize();
          } else if (res.data.status == 400) {
            this.confirmDialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
          }
        }
      );
    },
    confirmDelete(item) {
      this.confirmDialog = true;
      this.deleteData = item;
    },
  },
};
</script>
