<template>
  <div>
    <v-row class="mx-2">
      <v-col cols="12" md="8" class="pa-0">
        <v-tabs v-model="activeTab" color="#5a67da" align-tabs="left">
          <v-tab v-for="tab in tabList" :key="tab.id" @click="changeTab(tab)">{{
            tab.name
          }}</v-tab>
        </v-tabs>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12" md="4" class="d-flex justify-space-between">
        <v-text-field
          v-if="tab == 2"
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
        <v-btn
          :color="$vuetify.theme.themes.light.submitBtns"
          @click="apply()"
          class="mx-2 white--text"
          v-if="tab == 2"
          >apply</v-btn
        >
      </v-col>
    </v-row>
    <v-row v-if="tab == 1" class="px-6 pb-4">
      <v-col cols="6" class="">
        <div class="elevation-4 text-center rounded-lg">
          <div
            class=" pa-2 "
            :class="$vuetify.breakpoint.mdAndDown ? 'text-h4' : 'text-h1'"
            style="color:grey"
          >
            {{ formatNumberValue(leave_data ? leave_data.VL_TOTAL : 0, 3) }}
          </div>
          <v-divider></v-divider>
          <div
            class="text-body-2 pa-2 white--text rounded-b-lg"
            style="background-color:#5a67da"
          >
            Vacation Leave
          </div>
        </div>
      </v-col>
      <v-col cols="6" class="">
        <div class="elevation-4 text-center rounded-lg">
          <div
            class=" pa-2 "
            :class="$vuetify.breakpoint.mdAndDown ? 'text-h4' : 'text-h1'"
            style="color:grey"
          >
            {{ formatNumberValue(leave_data ? leave_data.SL_TOTAL : 0, 3) }}
          </div>
          <v-divider></v-divider>

          <div
            class="text-body-2 pa-2 white--text rounded-b-lg"
            style="background-color:#5a67da"
          >
            Sick Leave
          </div>
        </div>
      </v-col>
      <v-col cols="6" class="">
        <div class="elevation-4 text-center rounded-lg">
          <div
            class=" pa-2 "
            :class="$vuetify.breakpoint.mdAndDown ? 'text-h4' : 'text-h1'"
            style="color:grey"
          >
            {{ leave_data ? formatNumberValue(leave_data.CURRENT_CTO, 3) : 0 }}
          </div>
          <v-divider></v-divider>

          <div
            class="text-body-2 pa-2 white--text rounded-b-lg"
            style="background-color:#5a67da"
          >
            CTO (In Hours)
          </div>
        </div>
      </v-col>

      <v-col cols="6" class="">
        <div class="elevation-4 text-center rounded-lg">
          <div
            class=" pa-2 "
            :class="$vuetify.breakpoint.mdAndDown ? 'text-h4' : 'text-h1'"
            style="color:grey"
          >
            {{ leave_data ? 3 - leave_data.CURRENT_SPL_TOTAL_DEDUCT : 3 }}
          </div>
          <v-divider></v-divider>

          <div
            class="text-body-2 pa-2 white--text rounded-b-lg"
            style="background-color:#5a67da"
          >
            SPL
          </div>
        </div>
      </v-col>

      <v-col cols="6" class="">
        <div class="elevation-4 text-center rounded-lg">
          <div
            class=" pa-2 "
            :class="$vuetify.breakpoint.mdAndDown ? 'text-h4' : 'text-h1'"
            style="color:grey"
          >
            {{ leave_data ? 5 - leave_data.CURRENT_FL_TOTAL_DEDUCT : 5 }}
          </div>
          <v-divider></v-divider>

          <div
            class="text-body-2 pa-2 white--text rounded-b-lg"
            style="background-color:#5a67da"
          >
            FL
          </div>
        </div>
      </v-col>
    </v-row>

    <v-card v-show="tab == 2" class="ma-5 dt-container" elevation="0" outlined>
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
        <template v-slot:[`item.createdAt`]="{ item }">
          {{
            item.date_filed
              ? formatDate(item.date_filed)
              : formatDate(item.createdAt)
          }}
        </template>
        <template v-slot:[`item.hr_status`]="{ item }">
          <v-chip
            v-if="
              (item.certifying_hr_status == 1 ||
                item.certifying_hr_status == null ||
                item.certifying_hr_status == 2) &&
                (item.hr_status == 1 || item.hr_status == null)
            "
            class="ma-2"
            x-small
          >
            For Approval
          </v-chip>

          <v-icon
            color="#5a67da"
            v-if="item.hr_status == 2 && item.certifying_hr_status == 2"
            >mdi-check</v-icon
          >
          <v-icon
            color="red"
            v-if="item.hr_status == 3 || item.certifying_hr_status == 3"
            >mdi-comment-alert</v-icon
          >
        </template>

        <template v-slot:[`item.recommending_status`]="{ item }">
          <div
            v-if="
              item.recommending_user_detailID != null &&
                item.recommending_user_detailID !=
                  item.final_approval_user_detailID
            "
          >
            <div
              v-if="
                item.type_of_leave_ID == 14 &&
                  item.selected_details_of_leave == 1
              "
            >
              -
            </div>
            <div v-else>
              <v-chip
                v-if="item.recommending_status == null"
                class="ma-2"
                x-small
              >
                For Approval
              </v-chip>
              <v-icon color="#5a67da" v-if="item.recommending_status == 1"
                >mdi-check</v-icon
              >

              <v-icon color="error" v-if="item.recommending_status == 2"
                >mdi-comment-alert</v-icon
              >
            </div>
          </div>
          <div
            v-if="
              item.recommending_user_detailID != null &&
                item.recommending_user_detailID ==
                  item.final_approval_user_detailID
            "
          >
            <div
              v-if="
                item.type_of_leave_ID == 14 &&
                  item.selected_details_of_leave == 1
              "
            >
              -
            </div>
            <div v-else>
              <v-chip
                v-if="item.recommending_status == null"
                class="ma-2"
                x-small
              >
                For Approval
              </v-chip>
              <v-icon color="#5a67da" v-if="item.recommending_status == 1"
                >mdi-check</v-icon
              >

              <v-icon color="error" v-if="item.recommending_status == 2"
                >mdi-comment-alert</v-icon
              >
            </div>
          </div>
          <div v-if="item.recommending_user_detailID == null">
            -
          </div>
        </template>

        <template v-slot:[`item.is_final_approval_disapproved`]="{ item }">
          <v-chip
            v-if="
              item.is_final_approval_disapproved == null &&
                item.is_final_approval_pending == 0
            "
            class="ma-2"
            x-small
          >
            For Approval
          </v-chip>
          <v-icon color="#5a67da" v-if="item.is_final_approval_disapproved == 0"
            >mdi-check</v-icon
          >

          <v-icon
            color="error"
            v-if="
              item.is_final_approval_disapproved == 1 ||
                item.is_final_approval_pending == 1
            "
            >mdi-comment-alert</v-icon
          >
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            elevation="2"
            color="#17C800"
            class="white--text mx-1"
            x-small
            @click="viewItem('View', item)"
          >
            <v-icon size="14">mdi-eye</v-icon>
            view</v-btn
          >
          <v-btn
            color="grey"
            outlined
            class=" mx-1"
            x-small
            v-if="item.certifying_hr_status != 2"
            @click="viewItem('Update', item)"
          >
            <v-icon size="14">mdi-pencil</v-icon>
            Update</v-btn
          >

          <v-chip
            small
            v-if="item.leaveCredit && item.leaveCredit.isRestored == 1"
            class="ma-2"
            color="warning"
            text-color="white"
            >LEAVE CREDIT RESTORED</v-chip
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
      </v-data-table>
    </v-card>
    <v-row v-if="tab == 2" class="mb-2 mx-5" align="center">
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

    <!-- leave card -->
    <v-row class="px-6 pb-4 " v-if="tab == 3" style="overflow:auto">
      <table class="table mt-5 mx-2">
        <thead>
          <tr>
            <th
              align="center"
              class="text-caption px-4 font-weight-bold py-2"
              rowspan="2"
              colspan="2"
            >
              Period
            </th>
            <th
              align="center"
              class="text-caption font-weight-bold py-2"
              colspan="2"
            >
              Particulars
            </th>
            <th
              align="center"
              class="text-caption font-weight-bold py-2"
              colspan="4"
            >
              Vacation Leave
            </th>
            <th
              align="center"
              class="text-caption font-weight-bold py-2"
              colspan="4"
            >
              Sick Leave
            </th>
            <th
              align="center"
              class="text-caption font-weight-bold py-2"
              rowspan="2"
            >
              Total
            </th>
            <th
              align="center"
              class="text-caption font-weight-bold py-2"
              rowspan="2"
            >
              Date Filed
            </th>
            <th
              align="center"
              class="text-caption font-weight-bold py-2"
              rowspan="2"
            >
              Remarks
            </th>
          </tr>
          <tr>
            <th align="center" class="text-caption font-weight-bold py-1">
              Type
            </th>
            <th align="center" class="text-caption font-weight-bold py-1">
              Days
            </th>
            <th align="center" class="text-caption font-weight-bold py-1">
              Earned
            </th>
            <th align="center" class="text-caption font-weight-bold py-1">
              Abs.<br />
              W/P
            </th>
            <th align="center" class="text-caption font-weight-bold py-1">
              Bal.
            </th>
            <th align="center" class="text-caption font-weight-bold py-1">
              Abs.<br />
              W/OP
            </th>
            <th align="center" class="text-caption font-weight-bold py-1">
              Earned
            </th>
            <th align="center" class="text-caption font-weight-bold py-1">
              Abs.<br />
              W/P
            </th>
            <th align="center" class="text-caption font-weight-bold py-1">
              Bal.
            </th>

            <th align="center" class="text-caption font-weight-bold py-1">
              Abs.<br />
              W/OP
            </th>
          </tr>
        </thead>
        <tbody v-if="hasLeaveCardData">
          <tr v-for="(item, i) in leave_card_data" :key="i">
            <td align="left" class="text-caption pa-2 ">
              {{ item.period_earned }}
            </td>
            <td align="left" class="text-caption pa-2 ">{{ item.period }}</td>
            <td
              :colspan="item.type == 'Balance Forwarded' ? 2 : 1"
              align="center"
              class="text-caption py-2"
            >
              {{ item.type }}
            </td>
            <td
              v-if="item.type != 'Balance Forwarded'"
              align="center"
              class="text-caption py-2"
            >
              {{ item.days }}
            </td>
            <td align="center" class="text-caption py-2">
              {{
                item.vl_earned
                  ? formatNumberValue(item.vl_earned, 3)
                  : item.vl_earned
              }}
            </td>
            <td align="center" class="text-caption py-2">{{ item.vl_auwp }}</td>
            <td align="center" class="text-caption py-2">
              {{
                item.vl_bal ? formatNumberValue(item.vl_bal, 3) : item.vl_bal
              }}
            </td>
            <td align="center" class="text-caption py-2">
              {{ item.vl_auwop }}
            </td>
            <td align="center" class="text-caption py-2">
              {{
                item.sl_earned
                  ? formatNumberValue(item.sl_earned, 3)
                  : item.sl_earned
              }}
            </td>
            <td align="center" class="text-caption py-2">{{ item.sl_auwp }}</td>
            <td align="center" class="text-caption py-2">
              {{
                item.sl_bal ? formatNumberValue(item.sl_bal, 3) : item.sl_bal
              }}
            </td>
            <td align="center" class="text-caption py-2">
              {{ item.sl_auwop }}
            </td>
            <td align="center" class="text-caption py-2">
              {{ item.total ? formatNumberValue(item.total, 3) : item.total }}
            </td>
            <td align="center" class="text-caption py-2">
              {{ item.date_filed ? formatDate(item.date_filed) : "" }}
            </td>
            <td align="center" class="text-caption py-2">
              <div style="width:100px" class="text-wrap text-justify">
                {{ item.remarks }}
              </div>
            </td>
          </tr>
        </tbody>
        <tbody v-if="!hasLeaveCardData">
          <tr>
            <td
              colspan="14"
              align="center"
              class="text-caption pa-4 grey--text"
            >
              No data available.
            </td>
          </tr>
        </tbody>
      </table>
    </v-row>
    <!-- end leave card -->
    <!-- CTO -->
    <v-row class="px-6 pb-4 " v-if="tab == 4">
      <v-col cols="12">
        <v-alert
          v-model="underDevtoDisplay"
          type="warning"
          icon="mdi-alert-circle-outline"
          dense
        >
          <p class="text-subtitle-2">
            This module is still under development. Thank you
          </p>
        </v-alert>
      </v-col>

      <table v-if="!underDevtoDisplay" class="table mt-5 mx-2">
        <thead>
          <tr>
            <th align="left" class="text-caption px-4 font-weight-bold py-2">
              Date Earned
            </th>
            <th align="center" class="text-caption font-weight-bold py-2">
              No. of Hours<br />
              Earned COCs
            </th>
            <th align="center" class="text-caption font-weight-bold py-2">
              Equivalent No. of Hours<br />
              for CTO
            </th>
            <th align="center" class="text-caption font-weight-bold py-2">
              Date of CTO
            </th>
            <th align="center" class="text-caption font-weight-bold py-2">
              Used COCs<br />(in hours)
            </th>
            <th align="center" class="text-caption font-weight-bold py-2">
              Remaining COCs <br />(in hours)
            </th>
            <th align="center" class="text-caption font-weight-bold py-2">
              Remarks
            </th>
          </tr>
        </thead>
        <tbody v-if="hasCTOCardData">
          <tr v-for="(item, i) in cto_card_data" :key="i">
            <td align="left" class="text-caption pa-2 ">
              {{ item.date_earned }}
            </td>
            <td align="center" class="text-caption py-2">
              {{ item.coc_hours }}
            </td>
            <td align="center" class="text-caption py-2">
              {{ item.cto_hours }}
            </td>
            <td align="center" class="text-caption py-2">
              {{ item.cto_date }}
            </td>
            <td align="center" class="text-caption py-2">
              {{ item.cto_used }}
            </td>
            <td align="center" class="text-caption py-2">{{ item.cto_rem }}</td>
            <td align="center" class="text-caption py-2">
              {{ item.remarks }}
            </td>
          </tr>
        </tbody>
        <tbody v-if="!hasCTOCardData">
          <tr>
            <td colspan="7" align="center" class="text-caption pa-4 grey--text">
              No data available
            </td>
          </tr>
        </tbody>
      </table>
    </v-row>
    <!-- end CTO -->
    <MyLeaveDialog :data="viewData" :action="action" />
    <ViewLeaveDataDialog :data="viewInForm" />

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
          <v-btn
            v-if="confirmAction == 'approve'"
            color="green"
            class="white--text"
            @click="approve()"
          >
            Confirm
          </v-btn>
          <v-btn
            v-if="confirmAction == 'deny'"
            color="green"
            class="white--text"
            @click="deny()"
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
    MyLeaveDialog: () =>
      import("../../components/Dialogs/Forms/MyLeaveDialog.vue"),
    ViewLeaveDataDialog: () =>
      import("../../components/Dialogs/Views/ViewLeaveDataDialog.vue"),
  },

  data: () => ({
    search: "",
    underDevtoDisplay: false,
    headers: [
      {
        text: "Date Filed",
        value: "createdAt",
        align: "start",
        valign: "center",
      },
      {
        text: "Leave Type",
        value: "types.description",
        align: "center",
        valign: "center",
      },

      {
        text: "Leave Credit Certification",
        value: "hr_status",
        align: "center",
        valign: "center",
      },

      {
        text: "Recommendation",
        value: "recommending_status",
        align: "center",
        valign: "center",
      },

      {
        text: "Approval",
        value: "is_final_approval_disapproved",
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
    leave_card_data: [],
    leave_data: [],
    cto_card_data: [],
    perPageChoices: [
      { text: "5", value: 5 },
      { text: "10", value: 10 },
      { text: "20", value: 20 },
      { text: "50", value: 50 },
      { text: "100", value: 100 },
      { text: "250", value: 250 },
      { text: "500", value: 500 },
    ],
    activeTab: { id: 1, name: "My Leave Credits" },
    tab: 1,
    tabList: [
      { id: 1, name: "My Leave Credits" },
      { id: 2, name: "My Leave Application" },
      { id: 3, name: "My Leave Card" },
      { id: 4, name: "My CTO" },
    ],

    canAvailLeave: null,
    cto: null,

    confirmDialog: false,
    confirmAction: null,
    confirmApprovalID: null,
    viewData: null,
    viewInForm: null,
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
        // console.log(this.activeTab);
        this.initialize(this.tab);
      },
      deep: true,
    },
    filterYear: {
      handler(newData, oldData) {
        if (oldData != newData) {
          console.log(oldData, newData);
          this.initialize(this.tab);
        }
      },
      deep: true,
    },
  },
  computed: {
    filterYear() {
      return this.$store.getters.getFilterSelected;
    },
    hasLeaveCardData() {
      return this.leave_card_data.length > 0;
    },
    hasCTOCardData() {
      return this.cto_card_data.length > 0;
    },
  },
  mounted() {
    // this.loadLeaveCredits();
    this.eventHub.$on("closeMyLeaveDialog", () => {
      this.initialize(this.tab);
    });
    this.eventHub.$on("closeViewLeaveDataDialog", () => {
      this.initialize(this.tab);
    });
  },
  beforeDestroy() {
    this.eventHub.$off("closeMyLeaveDialog");
    this.eventHub.$off("closeViewLeaveDataDialog");
  },

  methods: {
    pagination(data) {
      this.paginationData = data;
    },

    changeTab(tab) {
      this.activeTab = tab;
      this.tab = tab.id;
      this.initialize(tab.id);
    },

    initialize(tab) {
      let filter = this.$store.getters.getFilterSelected;
      this.loading = true;
      if (tab == 1) {
        this.axiosCall("/employee-accum-leaves/getMyLeaveCredits", "GET").then(
          (res) => {
            if (res) {
              // console.log("credits", res.data);
              this.leave_data = res.data;
              this.data = [];
              this.loading = false;
            }
          }
        );
      } else if (tab == 2) {
        this.axiosCall("/leaves/getMyLeaveApplications/" + filter, "GET").then(
          (res) => {
            if (res) {
              this.data = res.data;
              this.loading = false;
            }
          }
        );
      } else if (tab == 3) {
        this.axiosCall("/leave-credits/getMyLeaveCard/" + filter, "GET").then(
          (res) => {
            if (res) {
              this.leave_card_data = res.data;
            }
          }
        );
      } else if (tab == 4) {
        this.cto_card_data = [];
        this.axiosCall("/leave-credits/getMyCTOCard/" + filter, "GET").then(
          (res) => {
            if (res) {
              this.cto_card_data = res.data;
            }
          }
        );
      }
    },

    apply() {
      this.viewData = { id: null };
      this.action = "Apply";
    },

    viewItem(action, item) {
      if (item.certifying_hr_status != 2 || item.hr_status != 2) {
        this.viewData = item;
        this.action = action;
      } else {
        this.viewInForm = item;
      }
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
.table {
  width: 100%;
  border-collapse: collapse;
}
table,
td {
  border-bottom: 1px solid rgb(206, 202, 202);
}
tr:first-child th:first-child {
  border-top-left-radius: 10px;
}
tr:first-child th:last-child {
  border-top-right-radius: 10px;
}

tr:last-child td:first-child {
  border-bottom-left-radius: 10px;
}
tr:last-child td:last-child {
  border-bottom-right-radius: 10px;
}

/* tr:nth-child(2) th:first-child {
  border-top-left-radius: none;
}
tr:nth-child(2) th:last-child {
  border-top-right-radius: none;
} */

tr td:first-child {
  border-left: 1px solid rgb(206, 202, 202);
}
tr td:last-child {
  border-right: 1px solid rgb(206, 202, 202);
}
</style>
