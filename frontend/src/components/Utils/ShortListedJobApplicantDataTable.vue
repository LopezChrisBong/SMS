<template>
  <div>
    <v-row class="mx-2">
      <v-col cols="12" md="6" class="flex-items">
        <v-tabs v-model="activeTab" color="#519043" align-tabs="left">
          <v-tab v-for="tab in tabList" :key="tab.id" @click="changeTab(tab)">{{
            tab.name
          }}</v-tab>
        </v-tabs>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12" md="6" class="d-flex justify-space-between">
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
        <!-- <v-btn
          :class="tab == 3 ? 'd-none' : ''"
          class="white--text ml-2 rounded-lg"
          color="#519043"
          v-if="this.$store.state.user.user.isAdminApproved == 1"
          @click="add()"
        >
          <v-icon left> mdi-plus-box-outline </v-icon>
          Add New
        </v-btn> -->
        <!-- <v-btn
            :class="tab == 3 ? '' : 'd-none'"
            class="white--text ml-2 rounded-lg"
            color="#519043"
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
        :headers="tab == 3 ? headers1 : headers"
        :items="data"
        :items-per-page="10"
        :search="search"
        :options.sync="options"
        :loading="loading"
        @pagination="pagination"
        hide-default-footer
      >
        <template v-slot:[`item.ctType`]="{ item }">
          {{
            item.ctType == 1
              ? "Academic Year"
              : item.ctType == 2
              ? "Calendar Year"
              : ""
          }}
        </template>
        <template v-slot:[`item.SY`]="{ item }">
          {{
            item.cyFrom && item.cyTo
              ? formatDate(item.cyFrom) + " - " + formatDate(item.cyTo)
              : ""
          }}
        </template>

        <template v-slot:[`item.effectivityDate`]="{ item }">
          {{ formatDate(item.effectivityDate) }}
        </template>

        <template v-slot:[`item.sem`]="{ item }">
          {{
            item.ctType == 1
              ? item.sem == 1
                ? "First Semester"
                : item.sem == 2
                ? "Second Semester"
                : "Summer"
              : "N/A"
          }}
        </template>

        <template v-slot:[`item.isActive`]="{ item }">
          <v-chip
            class="white--text"
            :color="item.isActive == 1 ? '#519043' : 'grey'"
            x-small
          >
            {{ item.isActive == 1 ? "Active" : "Inactive" }}
          </v-chip>
        </template>

        <template v-slot:[`item.status`]="{ item }">
          <v-chip
            :color="
              item.status == 1 ? 'grey' : item.status == 2 ? '#519043' : 'red'
            "
            class="ma-2 white--text"
            x-small
          >
            {{
              item.status == 1
                ? "For Approval"
                : item.status == 2
                ? "Approved"
                : "Pending"
            }}
          </v-chip>
        </template>
        <template v-slot:[`item.education`]="{ item }">
          <div
            class="text-caption"
            v-if="item.education != null && item.education != ''"
          >
            {{ item.education }}
          </div>
          <div
            class="text-caption"
            v-else
            v-html="item.job_posting_content"
          ></div>
        </template>
        <!-- <template v-slot:[`item.switch`]="{ item }">
              <v-switch
                v-if="item.status == 2"
                :value="true"
                :input-value="item.isActive == 1 ? true : false"
                @change="switchItem(item)"
                color="#519043"
              ></v-switch>
            </template> -->
        <template v-slot:[`item.action`]="{ item }">
          <div class="text-no-wrap">
            <v-btn
              x-small
              color="orange"
              class="mx-1 my-2"
              outlined
              block
              @click="viewApplicant(item)"
            >
              <v-icon size="14">mdi-eye-outline</v-icon> Applicant
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
            color="#519043"
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
          color="#519043"
          :length="paginationData.pageCount"
        >
        </v-pagination>
      </v-col>
    </v-row>

    <ApplicantOfJobDialog :data="applicantData" :action="action" />

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
                  dense
                  class="rounded-lg"
                  item-text="type"
                  item-value="id"
                  color="#93CB5B"
                  :items="reportTypeList"
                >
                </v-autocomplete>
              </v-col>
              <!-- <v-col cols="4">
                  <v-autocomplete
                    label="Item No."
                    v-model="jobitem"
                    :rules="[formRules.required]"
                    @change="handleAllChanges"
                    dense
                    class="rounded-lg"
                    item-text="type"
                    item-value="id"
                    color="#93CB5B"
                    :items="jobitemsList"
                    :disabled="toPrint == 'All' ? true : false"
                  >
                  </v-autocomplete>
                </v-col>
  
                <v-col cols="3">
                  <v-autocomplete
                    label="Month"
                    v-model="selectedMonth"
                    @change="handleAllChanges"
                    dense
                    class="rounded-lg"
                    item-text="name"
                    item-value="id"
                    color="#93CB5B"
                    :items="monthsList"
                    :disabled="
                      jobitem == 'All' ? true : toPrint == 'All' ? true : false
                    "
                  >
                  </v-autocomplete>
                </v-col> -->
              <v-col cols="1">
                <v-autocomplete
                  label="Year"
                  v-model="selectedYear"
                  :rules="[formRules.required]"
                  dense
                  class="rounded-lg"
                  color="#93CB5B"
                  :items="yearList"
                >
                </v-autocomplete>
              </v-col>
            </v-row>
            <v-card-title>
              <!-- <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                  ></v-text-field> -->
            </v-card-title>
            <v-data-table :headers="headers3" :items="printData">
              <template v-slot:[`item.birth`]="{ item }">
                {{ formatDate(item.birth) }}
              </template>
            </v-data-table>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-5">
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="JobPostPrint = false">
            <v-icon>mdi-close-circle-outline</v-icon>
            Cancel
          </v-btn>
          <!-- <v-btn color="#519043" class="white--text" @click="printApplicants()">
              <v-icon class="mr-1">mdi-printer</v-icon>
              Print
            </v-btn> -->
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
      import(
        "../../components/Dialogs/Views/ShortListedJobApplicantDialog.vue"
      ),
  },
  data: () => ({
    search: "",
    fullname: null,
    applicantData: null,
    headers: [
      {
        text: "Position Title",
        value: "position_title",
        align: "start",
        valign: "center",
      },

      {
        text: "Plantilla Item No.",
        value: "plantilla_item",
        align: "center",
        valign: "center",
        sortable: false,
      },

      {
        text: "Salary/Job/Pay Grade",
        value: "salary_grade",
        align: "center",
        valign: "center",
        sortable: false,
      },

      {
        text: "Basic Monthly Salary",
        value: "monthly_salary",
        align: "center",
        valign: "center",
        sortable: false,
      },
      {
        text: "Education",
        value: "education",
        align: "center",
        valign: "center",
        sortable: false,
      },
      {
        text: "Training",
        value: "training",
        align: "center",
        valign: "center",
        sortable: false,
      },

      {
        text: "Experiece",
        value: "experience",
        align: "center",
        valign: "center",
        sortable: false,
      },
      {
        text: "Eligibility",
        value: "eligibility",
        align: "center",
        valign: "center",
        sortable: false,
      },
      {
        text: "Competency",
        value: "competency",
        align: "center",
        valign: "center",
        sortable: false,
      },
      {
        text: "Place of Assignment",
        value: "place_assignment",
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

    headers1: [
      {
        text: "Name",
        value: "fullname",
        align: "start",
        valign: "center",
      },
      {
        text: "Position",
        value: "position",
        align: "center",
        valign: "center",
        sortable: false,
      },

      {
        text: "Email",
        value: "email",
        align: "center",
        valign: "center",
        sortable: false,
      },
      {
        text: "Gender",
        value: "gender",
        align: "center",
        valign: "center",
        sortable: false,
      },
      {
        text: "Address",
        value: "address",
        align: "center",
        valign: "center",
        sortable: false,
      },
      {
        text: "Phone no.",
        value: "phone_number",
        align: "center",
        valign: "center",
        sortable: false,
      },

      {
        text: "Religion",
        value: "relegion",
        align: "center",
        valign: "center",
        sortable: false,
      },

      // {
      //   text: "Special Case",
      //   value: "special_case",
      //   align: "right",
      //   valign: "center",
      //   sortable: false,
      // },

      {
        text: "Action",
        value: "action",
        align: "center",
        valign: "center",
        sortable: false,
      },
    ],
    headers3: [
      {
        text: "Fullname",
        value: "fullname",
        align: "start",
        valign: "center",
      },
      {
        text: "Position",
        value: "position",
        align: "center",
        valign: "center",
        sortable: false,
      },

      {
        text: "Email",
        value: "email",
        align: "center",
        valign: "center",
        sortable: false,
      },
      {
        text: "Phone no.",
        value: "phone_number",
        align: "center",
        valign: "center",
        sortable: false,
      },
      {
        text: "Gender",
        value: "gender",
        align: "center",
        valign: "center",
        sortable: false,
      },
      {
        text: "Birth Date",
        value: "birth",
        align: "center",
        valign: "center",
        sortable: false,
      },
      {
        text: "Address",
        value: "address",
        align: "center",
        valign: "center",
        sortable: false,
      },

      {
        text: "Religion",
        value: "relegion",
        align: "center",
        valign: "center",
        sortable: false,
      },
    ],
    data: [],
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
      { id: 1, name: "List of Jobs Posted" },
      //   { id: 2, name: "Not Active-Jobs" },
      //   { id: 3, name: "Applicants" },
    ],
    coreTimeData: null,
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
    this.eventHub.$on("closeJobPostinDialog", () => {
      this.initialize();
    });
    this.eventHub.$on("closeApplicantJobList", () => {
      this.initialize();
    });
    this.eventHub.$on("closeMyJobApplicationDialog", () => {
      this.initialize();
    });
    // this.eventHub.$on("closeMyDesignationDialog", () => {
    //   this.initialize();
    // });
  },

  beforeDestroy() {
    // this.eventHub.$off("closeMyJobApplicationDialog");
    this.eventHub.$off("closeJobPostinDialog");
    this.eventHub.$off("closeApplicantJobList");
    this.eventHub.$off("closeMyJobApplicationDialog");

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
    loadYear() {
      let curYear;
      var d = new Date();
      curYear = d.getFullYear();
      for (let i = curYear; i >= 2020; i--) {
        this.yearList.push(i);
      }
    },

    pagination(data) {
      this.paginationData = data;
    },

    initialize() {
      this.loading = true;
      let user = this.$store.state.user;
      let filter = this.$store.getters.getFilterSelected;
      console.log("user", user);
      if (this.tab == 1) {
        this.axiosCall(
          "/short-list/getTaggedJobPosted/" + filter + "/" + user.id,
          "GET"
        ).then((res) => {
          if (res) {
            this.data = res.data;
            this.loading = false;
          }
        });
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

    viewApplicant(item) {
      this.applicantData = item;
      this.action = 1;
    },
  },
};
</script>
