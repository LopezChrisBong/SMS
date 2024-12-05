<template>
  <div>
    <v-row class="mx-2">
      <v-col cols="12" md="8" class="pa-0">
        <v-tabs
          v-model="activeTab"
          show-arrows
          color="#5a67da"
          align-tabs="left"
        >
          <v-tab v-for="tab in tabList" :key="tab.id" @click="changeTab(tab)">{{
            tab.name
          }}</v-tab>
        </v-tabs>
      </v-col>
      <v-spacer></v-spacer>
      <v-col
        cols="12"
        md="4"
        class="d-flex justify-space-between"
        style="column-gap: 5px;"
      >
        <v-text-field
          v-if="tab != 5"
          v-model="search"
          outlined
          prepend-inner-icon="search"
          label="Search"
          single-line
          hide-details
          class="rounded-lg"
          color="#5a67da"
          dense
        ></v-text-field>
        <v-text-field
          v-if="tab == 5"
          v-model="searchKey"
          @keyup="searchTable()"
          outlined
          prepend-inner-icon="search"
          label="Search"
          single-line
          hide-details
          class="rounded-lg"
          color="#5a67da"
          dense
        ></v-text-field>
        <v-btn
          icon
          v-if="tab == 5 && !showSideBtn"
          large
          @click="showSideBtn = !showSideBtn"
          ><v-icon
            >{{ showSideBtn ? "mdi-arrow-right" : "mdi-arrow-left" }}
          </v-icon></v-btn
        >
        <v-expand-x-transition>
          <div class="d-flex " v-if="showSideBtn">
            <v-btn
              v-if="tab == 5"
              :color="$vuetify.theme.themes.light.submitBtns"
              @click="
                addCreditsDialog = true;
                showSideBtn = !showSideBtn;
              "
              class="white--text mr-1"
              >Add credits</v-btn
            >
            <v-btn
              v-if="tab == 5"
              @click="
                deduct_FL();
                showSideBtn = !showSideBtn;
              "
              color="warning"
              class="white--text"
              >Deduct FL</v-btn
            >
          </div>
        </v-expand-x-transition>
      </v-col>
    </v-row>

    <v-card class="ma-5 dt-container" elevation="0" outlined>
      <v-data-table
        :headers="tab != 5 ? headers : leave_credit_headers"
        :items="data"
        :items-per-page="10"
        :search="search"
        :options.sync="options"
        :loading="loading"
        @pagination="pagination"
        hide-default-footer
      >
        <template v-slot:[`item.name`]="{ item }">
          {{ item.name }}
        </template>
        <template v-slot:[`item.applicant_name`]="{ item }">
          {{ item.applicant_name }}
        </template>
        <template v-if="tab != 5" v-slot:[`item.created_at`]="{ item }">
          {{
            item.date_filed
              ? formatDate(item.date_filed)
              : formatDate(item.created_at)
          }}
        </template>

        <template v-if="!loading" v-slot:[`item.actions`]="{ item }">
          <v-btn
            elevation="2"
            color="#17C800"
            class="white--text mx-1"
            x-small
            @click="
              viewItem(
                tab == 1
                  ? 'Certify'
                  : tab == 2
                  ? 'Certified'
                  : tab == 3
                  ? 'Approved'
                  : '',
                item
              )
            "
          >
            <v-icon size="14">mdi-eye</v-icon>
            view</v-btn
          >
          <!-- <v-btn
            class="mx-1"
            color="#17C800"
            outlined
            x-small
            @click="printItem(item)"
          >
            <v-icon size="14">mdi-printer</v-icon>
            print</v-btn
          > -->
        </template>

        <template v-if="tab == 5" v-slot:[`item.VL_TOTAL`]="{ item }">
          {{
            loading
              ? ""
              : !item.VL_TOTAL
              ? 0
              : formatNumberValue(item.VL_TOTAL, 3)
          }}
        </template>

        <template v-if="tab == 5" v-slot:[`item.SL_TOTAL`]="{ item }">
          {{
            loading
              ? ""
              : !item.SL_TOTAL
              ? 0
              : formatNumberValue(item.SL_TOTAL, 3)
          }}
        </template>

        <template v-if="tab == 5" v-slot:[`item.CURRENT_SPL_TOTAL`]="{ item }">
          {{ item.CURRENT_SPL_TOTAL }}
        </template>

        <template v-if="tab == 5" v-slot:[`item.CURRENT_CTO`]="{ item }">
          {{ item.CURRENT_CTO }}
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
            hide-details
            :value="options.itemsPerPage"
            style="max-width: 90px"
            class="rounded-lg"
            color="#5a67da"
            @change="options.itemsPerPage = parseInt($event, 10)"
            :items="perPageChoices"
          >
          </v-select>
        </span>
        <span class="px-2"> Entries </span>
      </v-col>
      <v-col
        v-if="tab != 5"
        cols="auto"
        class="mr-auto text-truncate"
        no-gutters
      >
        Showing {{ paginationData.pageStart + 1 }} to
        {{ paginationData.pageStop }} of
        {{ paginationData.itemsLength }} entries
      </v-col>
      <v-col v-if="tab != 5" cols="auto">
        <v-pagination
          v-model="options.page"
          class="rounded-lg"
          :total-visible="7"
          :color="$vuetify.theme.themes.light.submitBtns"
          :length="paginationData.pageCount"
        >
        </v-pagination>
      </v-col>
      <v-col
        v-if="tab == 5"
        cols="auto"
        class="mr-auto text-truncate"
        no-gutters
      >
        Showing {{ paginationData1.pageStart + 1 }} to
        {{ paginationData1.pageStop }} of
        {{ paginationData1.itemsLength }} entries
      </v-col>
      <v-col v-if="tab == 5" cols="auto">
        <v-pagination
          v-model="options.page"
          class="rounded-lg"
          :total-visible="7"
          :color="$vuetify.theme.themes.light.submitBtns"
          :length="paginationData1.pageCount"
        >
        </v-pagination>
      </v-col>
    </v-row>

    <!-- <AddLeaveCreditsDialog :data="viewData" :action="action" /> -->
    <AddVLSLDialog :data="viewData" />
    <AddSPLDialog :data="viewSplData" />
    <AddCTODialog :data="viewCtoData" />
    <AddSSCDialog :data="viewSSC" />
    <AddLeaveWorkbackDialog :data="viewWorkback" />
    <AddBalanceForwardedDialog :data="viewBalanceForwared" />
    <DeductForceLeaveDialog :data="viewFL" />
    <ConvertVLToSLDialog :data="viewConvertVLToSL" />

    <ViewApplicationForLeaveDialog
      :data="viewApplicationData"
      :action="action"
      :tab="tab"
    />

    <ViewApprovedLeaveDialog :data="viewApprovedData" />
    <ViewEmployeeLeaveCardDialog :data="viewLeaveCardData" />

    <v-dialog v-model="confirmDialog" persistent max-width="290">
      <v-card color="white">
        <div class="pa-4 #3a3b3a--text">
          <div class="text-overline mb-1">WARNING!</div>
          <div class="text-body-1 mb-1">
            <p style="text-align: justify">
              <v-icon class="mt-n2" color="white">mdi-alert</v-icon> &nbsp; Are
              you sure you want to {{ confirmAction }} this locator slip?
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
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="addCreditsDialog" persistent max-width="800">
      <v-card color="white">
        <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
          <span>Select Action</span>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="addCreditsDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <div class="d-flex justify-space-evenly pa-4 #3a3b3a--text box_wrapper">
          <div @click="add_vlsl()" class="box ma-2">VL/SL</div>
          <!-- <div class="box ma-2">CTO</div> -->
          <div @click="add_cto()" class="box ma-2">CTO</div>
          <div @click="add_servCredit()" class="box ma-2">
            Special Service Credit
          </div>
          <div @click="add_prevCredit()" class="box ma-2">
            Balance Forwarded
          </div>
          <div @click="convertVLToSL()" class="box ma-2 text-center">
            VL to SL<br />
            Conversion
          </div>
          <!-- <div class="box ma-2"> -->
          <div @click="addWorkBack()" class="box ma-2">
            Leave Workback
          </div>
        </div>
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
    // AddLeaveCreditsDialog: () =>
    //   import("../../components/Dialogs/Forms/AddLeaveCreditsDialog.vue"),
    AddVLSLDialog: () =>
      import("../../components/Dialogs/Forms/AddVLSLDialog.vue"),
    AddSSCDialog: () =>
      import("../../components/Dialogs/Forms/AddSSCDialog.vue"),
    AddCTODialog: () =>
      import("../../components/Dialogs/Forms/AddCTODialog.vue"),
    AddSPLDialog: () =>
      import("../../components/Dialogs/Forms/AddSPLDialog.vue"),
    AddBalanceForwardedDialog: () =>
      import("../../components/Dialogs/Forms/AddBalanceForwardedDialog.vue"),
    AddLeaveWorkbackDialog: () =>
      import("../../components/Dialogs/Forms/AddLeaveWorkbackDialog.vue"),
    ConvertVLToSLDialog: () =>
      import("../../components/Dialogs/Forms/ConvertVLToSLDialog.vue"),
    DeductForceLeaveDialog: () =>
      import("../../components/Dialogs/Forms/DeductForceLeaveDialog.vue"),
    ViewApplicationForLeaveDialog: () =>
      import(
        "../../components/Dialogs/Views/ViewApplicationForLeaveDialog.vue"
      ),
    ViewApprovedLeaveDialog: () =>
      import("../../components/Dialogs/Views/ViewApprovedLeaveDialog.vue"),
    ViewEmployeeLeaveCardDialog: () =>
      import("../../components/Dialogs/Views/ViewEmployeeLeaveCardDialog.vue"),
  },
  data: () => ({
    showSideBtn: false,
    search: "",
    addCreditsDialog: false,
    headers: [
      {
        text: "Name",
        value: "applicant_name",
        align: "start",
        valign: "center",
      },
      {
        text: "Position",
        value: "position",
        align: "center",
        valign: "center",
      },
      {
        text: "Office",
        value: "office",
        align: "center",
        valign: "center",
      },
      {
        text: "Date Filed",
        value: "created_at",
        align: "center",
        valign: "center",
      },
      {
        text: "Type of Leave",
        value: "tl_desc",
        align: "center",
        valign: "center",
      },

      {
        text: "Actions",
        value: "actions",
        align: "center",
        valign: "center",
        sortable: false,
      },
    ],
    leave_credit_headers: [
      { text: "Name", value: "name", align: "start", valign: "center" },
      {
        text: "Vacation Leave",
        value: "VL_TOTAL",
        align: "center",
        valign: "center",
      },
      {
        text: "Sick Leave",
        value: "SL_TOTAL",
        align: "center",
        valign: "center",
      },
      {
        text: "SPL",
        value: "CURRENT_SPL_TOTAL",
        align: "center",
        valign: "center",
      },
      {
        text: "CTO",
        value: "CURRENT_CTO",
        align: "center",
        valign: "center",
      },

      {
        text: "Actions",
        value: "actions",
        align: "center",
        valign: "center",
        sortable: false,
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
    activeTab: { id: 1, name: "For Certification" },
    tab: 1,
    tabList: [
      { id: 1, name: "For Certification" },
      { id: 2, name: "Certified" },
      { id: 3, name: "Pending" },
      { id: 4, name: "Approved Leave" },
      { id: 5, name: "Leave Credits" },
    ],
    totalCount: 0,
    confirmDialog: false,
    confirmAction: null,
    confirmApprovalID: null,
    viewApprovedData: null,
    viewData: null,
    viewSplData: null,
    viewCtoData: null,
    viewSSC: null,
    viewFL: null,
    viewBalanceForwared: null,
    viewApplicationData: null,
    viewLeaveCardData: null,
    viewConvertVLToSL: null,
    viewWorkback: null,

    loading: false,
    options: {},
    action: null,
    paginationData: {},
    paginationData1: {},
    searchKey: null,
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

  computed: {
    filterYear() {
      return this.$store.getters.getFilterSelected;
    },
  },
  watch: {
    options: {
      handler() {
        this.initialize();
        // this.initialize(this.tab);
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
  mounted() {
    this.eventHub.$on("closeAddLeaveCreditsDialog", () => {
      this.initialize();
    });
    this.eventHub.$on("closeAddVLSLDialog", () => {
      this.initialize();
    });
    this.eventHub.$on("closeAddSPLDialog", () => {
      this.initialize();
    });
    this.eventHub.$on("closeCTODialog", () => {
      this.initialize();
    });
    this.eventHub.$on("closeSSCDialog", () => {
      this.initialize();
    });
    this.eventHub.$on("closeDeductFLDialog", () => {
      this.initialize();
    });
    this.eventHub.$on("closeLeaveWorkbackDialog", () => {
      this.initialize();
    });
    this.eventHub.$on("closeBalanceForwardedDialog", () => {
      this.initialize();
    });
    this.eventHub.$on("closeConvertVLToSLDialog", () => {
      this.initialize();
    });

    this.eventHub.$on("closeViewApplicationForLeaveDialog", () => {
      this.initialize();
    });
    this.eventHub.$on("closeViewEmployeeLeaveCardDialog", () => {
      this.initialize();
    });
    this.eventHub.$on("closeViewApprovedLeaveDialog", () => {
      this.initialize();
    });
  },
  beforeDestroy() {
    this.eventHub.$off("closeAddLeaveCreditsDialog");
    this.eventHub.$off("closeViewApplicationForLeaveDialog");
    this.eventHub.$off("closeAddVLSLDialog");
    this.eventHub.$off("closeAddSPLDialog");
    this.eventHub.$off("closeCTODialog");
    this.eventHub.$off("closeSSCDialog");
    this.eventHub.$off("closeLeaveWorkbackDialog");

    this.eventHub.$off("closeDeductFLDialog");
    this.eventHub.$off("closeConvertVLToSLDialog");
    this.eventHub.$off("closeViewEmployeeLeaveCardDialog");
    this.eventHub.$off("closeViewApprovedLeaveDialog");
  },

  methods: {
    formatTextCase(str) {
      return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    },
    pagination(data) {
      this.paginationData = data;
    },

    changeTab(tab) {
      this.activeTab = tab;
      this.tab = tab.id;
      this.initialize();
      // this.initialize(tab.id);
    },

    initialize() {
      //  initialize(status) {

      let filter = this.$store.getters.getFilterSelected;
      // this.data = [];
      this.loading = true;

      if (this.tab == 1 || this.tab == 2 || this.tab == 3) {
        this.axiosCall(
          "/leaves/getLeaveApplications/" + this.tab + "/" + filter,
          "GET"
        ).then((res) => {
          if (res) {
            let data = res.data;
            // console.log(res.data);
            data.forEach((element, i) => {
              data[i].applicant_name = this.toTitleCase(element.applicant_name);
            });
            this.data = data;
            this.loading = false;
          }
        });
      } else if (this.tab == 4) {
        this.axiosCall("/leaves/getApprovedLeaves/" + filter, "GET").then(
          (res) => {
            if (res) {
              let data = res.data;
              data.forEach((element, i) => {
                data[i].applicant_name = this.toTitleCase(
                  element.applicant_name
                );
              });
              this.data = data;
              this.loading = false;
            }
          }
        );
      } else if (this.tab == 5) {
        // this.axiosCall("/employee-accum-leaves/" + filter, "GET")
        if (this.searchKey && this.searchKey != "") {
          this.axiosCall(
            "/employee-accum-leaves/" +
              filter +
              "/?page=" +
              this.options.page +
              "&itemPerPage=" +
              this.options.itemsPerPage +
              "&searchKey=" +
              this.searchKey,
            "GET"
          ).then((res) => {
            if (res) {
              this.paginationData1 = {
                page: this.options.page,
                pageStart:
                  (res.data.pagination.currentPage - 1) *
                  this.options.itemsPerPage,
                pageStop: res.data.pagination.pageStop,
                pageCount: res.data.pagination.pageCount,
                itemsPerPage: this.options.itemsPerPage,
                itemsLength: res.data.pagination.count,
              };

              let data = res.data.data;
              data.forEach((element, i) => {
                data[i].name = this.toTitleCase(element.name);
              });
              this.data = data;

              this.loading = false;
            }
          });
        } else {
          this.axiosCall(
            "/employee-accum-leaves/" +
              filter +
              "/?page=" +
              this.options.page +
              "&itemPerPage=" +
              this.options.itemsPerPage,
            "GET"
          ).then((res) => {
            if (res) {
              this.paginationData1 = {
                page: this.options.page,
                pageStart:
                  (res.data.pagination.currentPage - 1) *
                  this.options.itemsPerPage,
                pageStop: res.data.pagination.pageStop,
                pageCount: res.data.pagination.pageCount,
                itemsPerPage: this.options.itemsPerPage,
                itemsLength: res.data.pagination.count,
              };

              let data = res.data.data;
              data.forEach((element, i) => {
                data[i].name = this.toTitleCase(element.name);
              });
              this.data = data;

              this.loading = false;
            }
          });
        }
      }
    },

    searchTable() {
      this.initialize();
    },

    add_vlsl() {
      this.viewData = { id: null };
      this.addCreditsDialog = false;
    },
    add_servCredit() {
      this.viewSSC = { id: null };
      this.addCreditsDialog = false;
    },
    add_cto() {
      this.viewCtoData = { id: null };
      this.addCreditsDialog = false;
    },
    add_spl() {
      this.viewSplData = { id: null };
      this.addCreditsDialog = false;
    },

    add_prevCredit() {
      this.viewBalanceForwared = { id: null };
      this.addCreditsDialog = false;
    },

    convertVLToSL() {
      this.viewConvertVLToSL = { id: null };
      this.addCreditsDialog = false;
    },

    addWorkBack() {
      this.viewWorkback = { id: null };
      this.addCreditsDialog = false;
    },

    deduct_FL() {
      this.viewFL = { id: null };
    },

    apply() {
      this.viewData = { id: null };
      this.action = "Apply";
    },

    viewItem(action, item) {
      if (this.tab == 4) {
        this.viewApprovedData = item;
      } else if (this.tab == 5) {
        this.viewLeaveCardData = item;
      } else {
        this.viewApplicationData = item;
        this.action = action;
      }
    },

    viewLeaveCredit(item) {
      console.log(item);
    },

    printItem(item) {
      const url =
        process.env.VUE_APP_SERVER +
        "/pdf-generator/print-employee-assessment/" +
        item.EA_id;
      window.open(url);
    },

    approve() {
      let data = {
        id: this.confirmApprovalID,
        status: 2,
      };
      // console.log(data);
      this.axiosCall("/my-locator-slip/approve-locator", "POST", data).then(
        (res) => {
          if (res.data.status == 200) {
            this.confirmDialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.message = res.data.msg;
            this.fadeAwayMessage.header = "System Message";
            this.initialize(this.tab);
          } else if (res.data.status == 400) {
            this.confirmDialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.initialize(this.tab);
          }
        }
      );
    },
    deleteItem(item) {
      this.dialogConfirmDelete = true;
      this.deleteData = item;
    },
    editItem(item) {
      this.updateData = [{ id: null }];
      setTimeout(() => {
        this.updateData = item;
        this.action = "Update";
      }, 100);
    },
    confirm(action, item) {
      // console.log(item);
      this.confirmAction = action;
      this.confirmDialog = true;
      this.confirmApprovalID = item.id;
    },
  },
};
</script>
<style scoped>
.box_wrapper {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}
.box {
  width: 30%;
  border: 1px solid #c0c0c0;
  height: 200px;
  align-items: center;
  justify-content: center;
  display: flex;
  border-radius: 10px;
  font-size: 20px;
}
.box:hover {
  cursor: pointer;
  background-color: #5a67da;
  color: white;
}
</style>
