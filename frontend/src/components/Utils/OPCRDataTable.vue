<template>
  <div>
    <v-row class="mx-2">
      <!-- <v-col cols="12" md="6" class="flex-items">
        <v-tabs v-model="activeTab" color="#5a67da" align-tabs="left">
          <v-tab v-for="tab in tabList" :key="tab.id" @click="changeTab(tab)">{{
            tab.name
          }}</v-tab>
        </v-tabs>
      </v-col> -->
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
          class="white--text ml-2 rounded-lg"
          :color="$vuetify.theme.themes.light.submitBtns"
          v-if="tab == 1"
          @click="add()"
        >
          <v-icon left> mdi-plus-box-outline </v-icon>
          Add New
        </v-btn>
      </v-col>
    </v-row>
    <v-card class="ma-5 dt-container" elevation="0" outlined>
      <v-data-table
        :headers="tab == 2 ? headers2 : headers"
        :items="data"
        :items-per-page="10"
        :search="search"
        :options.sync="options"
        :loading="loading"
        @pagination="pagination"
        hide-default-footer
      >
        <!-- <template v-slot:[`item.period`]="{ item }">
          {{ getPeriodDescription(item.period) }}
        </template> -->
        <template v-slot:[`item.assesed_by_status`]="{ item }">
          <v-chip
            x-small
            class="pa-1"
            :class="
              getStatus('assess', item) == 'For Submission' ||
              getStatus('assess', item) == 'For Approval'
                ? ''
                : 'white--text'
            "
            :color="
              getStatus('assess', item) == 'For Submission' ||
              getStatus('assess', item) == 'For Approval'
                ? ''
                : getStatus('assess', item) == 'Approved'
                ? 'green'
                : 'red'
            "
          >
            {{ getStatus("assess", item) }}
          </v-chip>
        </template>
        <template v-slot:[`item.final_rating_by_status`]="{ item }">
          <v-chip x-small class="pa-1">
            {{ getStatus("final_rating", item) }}
          </v-chip>
        </template>

        <template v-slot:[`item.action`]="{ item }">
          <!-- <v-btn
              x-small
              color="orange"
              class="mx-1"
              v-if="tab == 1"
              outlined
              @click="tag(item)"
            >
              <v-icon size="14">mdi-tag-multiple-outline</v-icon>Tag
            </v-btn>
            <v-btn
              x-small
              color="blue"
              class="mx-1"
              outlined
              @click="viewItem(item)"
            >
              <v-icon size="14">mdi-eye-outline</v-icon>View
            </v-btn> -->
          <v-btn
            class="my-1"
            block
            x-small
            color="green"
            outlined
            @click="viewItem(item)"
          >
            targets
          </v-btn>
          <v-btn
            class="my-1"
            block
            x-small
            @click="viewMPOR(item)"
            outlined
            color="warning"
          >
            MPOR</v-btn
          >

          <v-btn
            class="my-1"
            block
            x-small
            @click="viewSupport(item)"
            outlined
            color="warning"
            >Support Function</v-btn
          >
          <v-btn
            class="my-1"
            block
            x-small
            @click="viewMPORSummary(item)"
            outlined
            color="warning"
          >
            Summary</v-btn
          >
          <v-btn
            class="my-1"
            block
            x-small
            @click="viewIPCR(item)"
            outlined
            color="warning"
            >IPCR</v-btn
          >
          <!-- <v-btn
            class="my-1"
            block
            x-small
            @click="deleteItem(item)"
            outlined
            color="red"
            >Delete</v-btn
          > -->
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
            color="#5a67da"
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

    <!-- delete dialog -->
    <v-dialog v-model="confirmDialog" persistent max-width="390">
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
          <v-btn color="red" outlined @click="cancelDelete()">
            Close
          </v-btn>
          <v-btn color="green" class="white--text" @click="confirmDelete()">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <PerformanceEvaluationDialog :data="itemData" :action="action" />
    <ViewIPCRFunctionDialog :data="ipcrData" :action="action" />
    <MPORDialog :data="mporData" />
    <MPORSummaryDialog :data="mporSumData" />
    <IPCRSupportDialog :data="supportData" />
    <ViewIPCRDialog :data="ipcr" />

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
    MPORSummaryDialog: () =>
      import("../../components/Dialogs/Forms/MPORSummaryDialog.vue"),
    PerformanceEvaluationDialog: () =>
      import("../../components/Dialogs/Forms/PerformanceEvaluationDialog.vue"),
    ViewIPCRFunctionDialog: () =>
      import("../Dialogs/Views/ViewIPCRFunctionDialog.vue"),

    MPORDialog: () => import("../../components/Dialogs/Forms/MPORDialog.vue"),
    IPCRSupportDialog: () =>
      import("../../components/Dialogs/Forms/IPCRSupportDialog.vue"),
    ViewIPCRDialog: () =>
      import("../../components/Dialogs/Views/ViewIPCRDialog.vue"),
  },
  data: () => ({
    confirmDialog: false,
    itemToDelete: null,
    search: "",
    fullname: null,
    applicantData: null,
    itemData: null,
    taggingData: null,
    ipcrData: null,
    supportData: null,
    headers: [
      {
        text: "Year",
        value: "year",
        align: "start",
        valign: "center",
        sortable: false,
      },
      {
        text: "Period",
        value: "period",
        align: "center",
        valign: "center",
        sortable: false,
      },
      {
        text: "Assess",
        value: "assesed_by_status",
        align: "center",
        valign: "center",
        sortable: false,
      },
      {
        text: "Final Rater",
        value: "final_rating_by_status",
        align: "center",
        valign: "center",
        sortable: false,
      },
      {
        text: "Action",
        value: "action",
        align: "center",
        width: 100,
        valign: "center",
        sortable: false,
      },
    ],

    data: [],
    periodList: [
      {
        id: 1,
        description: "January to June",
      },
      {
        id: 2,
        description: "July to December",
      },
      {
        id: 3,
        description: "January to December",
      },
    ],

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
      //   { id: 1, name: "Target" },
      //   { id: 2, name: "Tagged Employees" },
      //   { id: 3, name: "Applicants" },
    ],
    mporData: null,
    ipcr: null,
    mporSumData: null,
    loading: false,
    options: {},
    action: null,
    paginationData: {},
    fadeAwayMessage: {
      show: false,
      type: "success",
      header: "Successfully Deleted!",
      message: "",
      top: 10,
    },
    yearList: [],
  }),

  mounted() {
    this.eventHub.$on("closeViewIPCRFunctionDialog", () => {
      this.initialize();
    });
    this.eventHub.$on("closePerformanceEvaluationDialog", () => {
      this.initialize();
    });

    this.eventHub.$on("closeMPORDialog", () => {
      this.initialize();
    });
    this.eventHub.$on("closeMPORSummaryDialog", () => {
      this.initialize();
    });
    this.eventHub.$on("closeIPCRSupportDialog", () => {
      this.initialize();
    });
    this.eventHub.$on("closeViewIPCRDialog", () => {
      this.initialize();
    });
  },

  beforeDestroy() {
    this.eventHub.$off("closePerformanceEvaluationDialog");
    this.eventHub.$off("closeViewIPCRFunctionDialog");
    this.eventHub.$off("closeMPORDialog");
    this.eventHub.$off("closeMPORSummaryDialog");
    this.eventHub.$off("closeIPCRSupportDialog");
    this.eventHub.$off("closeViewIPCRDialog");
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
  },
  methods: {
    getPeriodDescription(id) {
      for (let i = 0; i < this.periodList.length; i++) {
        if (this.periodList[i].id == id) {
          return this.periodList[i].description;
        }
      }
    },
    pagination(data) {
      this.paginationData = data;
    },

    initialize() {
      this.axiosCall("/ipcr/getMyIPCR", "GET").then((res) => {
        if (res) {
          console.log("IP", res.data);
          this.data = res.data;
          this.loading = false;
        }
      });
    },

    getStatus(type, item) {
      let toReturn = "";
      if (type == "assess") {
        if (item.isSubmitted == 0) {
          toReturn = "For Submission";
        } else {
          if (item.assesed_by_status == 1) {
            toReturn = "For Approval";
          } else if (item.assesed_by_status == 2) {
            toReturn = "Approved";
          } else if (item.assesed_by_status == 3) {
            toReturn = "Pending";
          }
        }
      } else if (type == "final_rating") {
        if (item.isSubmitted == 0) {
          toReturn = "For Submission";
        } else {
          if (item.final_rating_by_status == null) {
            toReturn = "For Submission";
          } else if (item.final_rating_by_status == 1) {
            toReturn = "For Approval";
          } else if (item.final_rating_by_status == 2) {
            toReturn = "Approved";
          } else if (item.final_rating_by_status == 3) {
            toReturn = "Pending";
          }
        }
      }
      return toReturn;
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
      this.itemData = { id: null };
      this.action = "Add";
    },

    viewMPOR(item) {
      if (item.targetCount > 0) {
        this.mporData = item;
      } else {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message = "No Targets Found!";
      }

      // this.action = "Update";
    },
    viewMPORSummary(item) {
      this.mporSumData = item;
    },

    viewIPCR(item) {
      this.ipcr = item;
    },
    viewItem(item) {
      this.ipcrData = item;
      // this.action = "Update";
    },

    viewSupport(item) {
      this.supportData = item;
    },
    deleteItem(item) {
      this.itemToDelete = item;
      this.confirmDialog = true;
    },
    confirmDelete() {
      this.axiosCall("/ipcr/" + this.itemToDelete.id, "DELETE").then((res) => {
        if (res.data.status == 200) {
          this.confirmDialog = false;
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
      });
    },
    cancelDelete() {
      this.itemToDelete = null;
      this.confirmDialog = false;
    },
  },
};
</script>
