<template>
  <div>
    <v-row class="mx-2">
      <v-col cols="12" md="6" class="flex-items">
        <!-- <v-tabs v-model="activeTab" color="#147452" align-tabs="left">
          <v-tab v-for="tab in tabList" :key="tab.id" @click="changeTab(tab)">{{
            tab.name
          }}</v-tab>
        </v-tabs> -->
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
        <v-btn
          :class="tab == 3 ? 'd-none' : ''"
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
      >
        <template v-slot:[`item.action`]="{ item }">
          <div class="text-no-wrap" style="padding: 4px;">
            <!-- <v-btn
              x-small
              color="#147452"
              class="my-2"
              :class="tab == 2 ? 'd-none' : ''"
              outlined
              block
              @click="viewHiredApplicant(item)"
            >
              <v-icon size="14">mdi-eye-outline</v-icon> Load
            </v-btn> -->
            <!-- <v-btn
              x-small
              color="red"
              class="my-2"
              :class="tab == 2 ? 'd-none' : ''"
              outlined
              block
              @click="tag(item)"
            >
              <v-icon size="14">mdi-tag-multiple-outline</v-icon>Tag
            </v-btn> -->

            <!-- <v-btn
              x-small
              color="orange"
              class="my-2"
              :class="tab == 2 ? 'd-none' : ''"
              outlined
              block
              @click="viewApplicant(item)"
            >
              <v-icon size="14">mdi-eye-outline</v-icon> Applicant
            </v-btn> -->
            <v-btn
              x-small
              color="blue"
              class="my-2"
              outlined
              @click="editItem(item)"
            >
              <v-icon size="14">mdi-pencil-outline</v-icon>Update
            </v-btn>
            <!-- <v-btn
              x-small
              color="blue"
              class="my-2"
              :class="tab == 2 ? '' : 'd-none'"
              v-if="item.status != 2"
              outlined
              block
              @click="printApplicants(item)"
            >
              <v-icon size="14">mdi-printer-outline</v-icon>Print
            </v-btn> -->
            <!-- <v-btn
              x-small
              color="#147452"
              class="my-2"
              :class="
                tab == 2 ? 'd-none' : ''
              "
              outlined
              block
              @click="viewItem(item)"
            >
              <v-icon size="14">mdi-eye-outline</v-icon>View
            </v-btn> -->
            <!-- <v-btn
                x-small
                color="#C62828"
                class="white--text mx-1"
                :class="tab == 3 ? '' : 'd-none'"
                @click="confirmDelete(item)"
              >
                <v-icon size="14">mdi-trash-can-outline</v-icon> Delete
              </v-btn> -->
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

    <CreateSubjectDialog
      :data="designationData"
      :action="action"
      :filter="filter"
    />

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
    CreateSubjectDialog: () =>
      import("../../components/Dialogs/Forms/CreateSubjectDialog.vue"),
  },
  data: () => ({
    search: "",
    taggingData: null,
    fullname: null,
    applicantData: null,
    headers: [
      {
        text: "Subject Title",
        value: "subject_title",
        align: "start",
        valign: "center",
      },

      // {
      //   text: "Senior / Junior",
      //   value: "seniorJunior",
      //   align: "center",
      //   valign: "center",
      //   sortable: false,
      // },

      {
        text: "Action",
        value: "action",
        align: "end",
        valign: "end",
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
      { id: 1, name: "Active-Jobs" },
      // { id: 2, name: "Primary" },
      // { id: 2, name: "Junior High" },
      // { id: 2, name: "Senior High" },
      //   { id: 3, name: "Applicants" },
    ],
    filter: null,
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
    this.eventHub.$on("closeAddSubjectDialog", () => {
      this.initialize();
    });
  },

  beforeDestroy() {
    // this.eventHub.$off("closeMyJobApplicationDialog");
    this.eventHub.$off("closeAddSubjectDialog");

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

    // loadYear() {
    //   let curYear;
    //   var d = new Date();
    //   curYear = d.getFullYear();
    //   for (let i = curYear; i >= 2020; i--) {
    //     this.yearList.push(i);
    //   }
    // },

    pagination(data) {
      this.paginationData = data;
    },

    initialize() {
      // let filter = this.$store.getters.getFilterSelected;
      this.loading = true;
      // alert(filter);
      if (this.tab == 1) {
        this.axiosCall("/subjects/getSubject/active", "GET").then((res) => {
          if (res) {
            console.log("Love", res.data);
            this.data = res.data;
            this.loading = false;
          }
        });
      } else if (this.tab == 2) {
        this.axiosCall("/subjects/CreateSubject/notActive", "GET").then(
          (res) => {
            if (res) {
              console.log("LoveNot", res.data);
              this.data = res.data;
              this.loading = false;
            }
          }
        );
      }
    },

    changeTab(tab) {
      this.activeTab = tab;

      this.tab = tab.id;
      this.initialize();
    },
    add() {
      let filter = this.$store.getters.getFilterSelected;
      this.designationData = [{ id: null }];
      this.action = "Add";
      this.filter = filter;
    },
    editItem(item) {
      console.log(this.tab, item);
      let filter = this.$store.getters.getFilterSelected;
      this.designationData = item;
      this.action = "Update";
      this.filter = filter;
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
      this.axiosCall("/job-applicant/" + this.deleteData.id, "DELETE").then(
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
