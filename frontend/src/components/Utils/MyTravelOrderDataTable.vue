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
        <v-btn
          class="white--text ml-2 rounded-lg"
          :color="$vuetify.theme.themes.light.submitBtns"
          @click="add()"
          v-if="this.$store.state.user.user.isAdminApproved == 1"
        >
          <v-icon left> mdi-plus-box-outline </v-icon>
          Add New
        </v-btn>
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
        <template v-slot:[`item.travel_date`]="{ item }">
          {{
            isValidJSON(item.travel_date_from)
              ? formatDate(getFirstDate(item.travel_date_from))
              : formatDate(item.travel_date_from)
          }}
          -
          {{ formatDate(item.travel_date_to) }}
        </template>
        <template v-slot:[`item.recommending_approval_list`]="{ item }">
          <div
            v-for="i in item.recommending_approval_list"
            :key="i.id"
            :class="
              item.recommending_approval_list.length > 1
                ? 'd-flex justify-space-between'
                : ''
            "
          >
            <div v-if="i.id != item.president_userID">
              {{ toTitleCase(i.name) }}
              <v-chip v-if="i.approveStatus == 1" class="ma-2" x-small>
                For Approval
              </v-chip>
              <v-icon color="#519043" v-if="i.approveStatus == 2"
                >mdi-check-bold</v-icon
              >

              <v-icon color="#E65100" v-if="i.approveStatus == 3"
                >mdi-timer-refresh-outline</v-icon
              >
            </div>
          </div>
        </template>

        <template v-slot:[`item.is_finance_dir_approved`]="{ item }">
          <v-chip v-if="item.is_finance_dir_approved == 1" class="ma-2" x-small>
            For Approval
          </v-chip>
          <v-icon color="#519043" v-if="item.is_finance_dir_approved == 2"
            >mdi-check-bold</v-icon
          >

          <v-icon color="error" v-if="item.is_finance_dir_approved == 3"
            >mdi-timer-refresh-outline</v-icon
          >
        </template>

        <template v-slot:[`item.is_president_approved`]="{ item }">
          <v-chip v-if="item.is_president_approved == 1" class="ma-2" x-small>
            For Approval
          </v-chip>
          <v-icon color="#519043" v-if="item.is_president_approved == 2"
            >mdi-check-bold</v-icon
          >

          <v-icon color="error" v-if="item.is_president_approved == 3"
            >mdi-timer-refresh-outline</v-icon
          >
        </template>
        <template v-slot:[`item.isHrReceived`]="{ item }">
          <v-chip v-if="item.isHrReceived == 0" class="ma-2" x-small>
            To Receive
          </v-chip>
          <v-chip
            v-if="item.isHrReceived == 1"
            class="ma-2 white--text"
            color="#519043"
            x-small
          >
            Received
          </v-chip>
        </template>
        <template v-slot:[`item.isArchived`]="{ item }">
          <div v-if="item.isArchived == 0">
            <v-chip
              v-if="item.isPending == 1"
              :color="item.isPending == 1 ? 'red' : ''"
              class="ma-2 white--text"
              x-small
            >
              {{ item.isPending == 1 ? "Pending" : "" }}
            </v-chip>
          </div>
          <div v-if="item.isArchived == 1">
            <v-chip class="ma-2  white--text" color="#519043" x-small>
              Archived
            </v-chip>
          </div>
        </template>

        <template v-slot:[`item.deadline_for_tar`]="{ item }">
          {{
            item.isDeadlineExtended
              ? formatDate(item.deadline_extension_for_tar)
              : formatDate(item.deadline_for_tar)
          }}
        </template>

        <template v-slot:[`item.tar`]="{ item }">
          <div v-if="item.tar">
            <v-chip
              :color="
                getTarStatus(item.tar) == 'For Approval'
                  ? ''
                  : getTarStatus(item.tar) == 'Approved'
                  ? '#519043'
                  : getTarStatus(item.tar) == 'Pending'
                  ? 'red'
                  : ''
              "
              class="ma-2 "
              :class="
                getTarStatus(item.tar) == 'For Approval' ? '' : 'white--text'
              "
              x-small
            >
              {{ item.tar ? getTarStatus(item.tar) : "" }}
            </v-chip>
          </div>

          <!-- <div v-if="item.tar.tarType == 1">
            <v-chip
              v-if="
                item.tar.immHead_approval_status == 2 &&
                  item.tar.hr_approval_status == 2
              "
              :color="item.isPending == 1 ? 'red' : ''"
              class="ma-2 white--text"
              x-small
            >
              {{ item.isPending == 1 ? "Pending" : "" }}
            </v-chip>
          </div>
          <div v-if="item.tar.tarType == 2"></div>
          <div v-if="item.tar.immHead_approval_status == 1">
            <v-chip
              v-if="item.isPending == 1"
              :color="item.isPending == 1 ? 'red' : ''"
              class="ma-2 white--text"
              x-small
            >
              {{ item.isPending == 1 ? "Pending" : "" }}
            </v-chip>
          </div>
          <div v-if="item.isArchived == 1">
            <v-chip class="ma-2" x-small>
              Archived
            </v-chip>
          </div> -->
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <div v-if="item.is_cancelled == 1">
            <v-chip class="white--text" small color="red">CANCELLED</v-chip>
          </div>
          <div v-if="item.is_cancelled == 0 && tab == 1" class="d-flex   ga-10">
            <v-btn
              x-small
              class="white--text mx-1"
              color="green"
              v-if="
                !item.tar &&
                  !item.isPending &&
                  item.isHrReceived == 1 &&
                  item.travel_type == 1 &&
                  item.travel_subtype == 2 &&
                  isNotDeadlineToday(
                    item.isDeadlineExtended
                      ? item.deadline_extension_for_tar
                      : item.deadline_for_tar
                  ) == true
              "
              @click="addTAR(item)"
            >
              Add TAR
            </v-btn>

            <v-btn
              x-small
              class="white--text  mx-1"
              color="green"
              v-if="
                item.tar &&
                  isValidToUpdate(item.tar) == false &&
                  !item.isPending &&
                  item.isHrReceived == 1 &&
                  item.travel_type == 1 &&
                  item.travel_subtype == 2 &&
                  (isNotDeadlineToday(
                    item.isDeadlineExtended
                      ? item.deadline_extension_for_tar
                      : item.deadline_for_tar
                  ) == false ||
                    getTarStatus(item.tar) == 'Approved')
              "
              @click="viewTAR(item.tar)"
            >
              View TAR
            </v-btn>
            <v-btn
              x-small
              class="white--text  mx-1"
              color="green"
              v-if="
                item.tar &&
                  isValidToUpdate(item.tar) == true &&
                  !item.isPending &&
                  item.isHrReceived == 1 &&
                  item.travel_type == 1 &&
                  item.travel_subtype == 2 &&
                  (isNotDeadlineToday(
                    item.isDeadlineExtended
                      ? item.deadline_extension_for_tar
                      : item.deadline_for_tar
                  ) == false ||
                    getTarStatus(item.tar) != 'Approved')
              "
              @click="updateTAR(item.tar)"
            >
              Update TAR
            </v-btn>
            <v-btn
              x-small
              color="grey"
              class=" mx-1"
              v-if="
                (!(
                  item.is_recommending_approval_approved == 2 &&
                  item.is_finance_dir_approved == 2 &&
                  item.is_president_approved == 2
                ) ||
                  item.isPending) &&
                  item.isHrReceived == 0
              "
              outlined
              @click="editItem(item)"
            >
              <v-icon size="14">mdi-pencil-outline</v-icon> Update
            </v-btn>

            <v-btn
              x-small
              class=" mx-1"
              color="grey"
              outlined
              @click="viewItem(item)"
            >
              <v-icon size="14">mdi-eye</v-icon> View
            </v-btn>
            <v-btn
              v-if="
                item.is_recommending_approval_approved == 2 &&
                  item.is_finance_dir_approved == 2 &&
                  item.is_president_approved == 2
              "
              x-small
              outlined
              color="green"
              class=" mx-1"
              @click="printItem(item)"
            >
              <v-icon size="14">mdi-printer</v-icon>Print
            </v-btn>
            <!-- <v-btn
              v-if="
                !isNotDeadlineToday(item.travel_date_to) &&
                  item.is_recommending_approval_approved == 2 &&
                  item.is_finance_dir_approved != 2 &&
                  item.is_president_approved != 2
              "
              x-small
              class=" mx-1"
              color="red"
              outlined
              @click="cancelTO(item)"
            >
              <v-icon size="14">mdi-cancel</v-icon> Cancel
            </v-btn> -->
          </div>
          <div
            v-if="item.is_cancelled == 0 && tab == 2"
            class="d-flex flex-wrap ga-10"
          >
            <v-btn
              x-small
              class="white--text mx-1"
              color="green"
              v-if="
                !item.tar &&
                  !item.isPending &&
                  item.isHrReceived == 1 &&
                  item.travel_type == 1 &&
                  item.travel_subtype == 2 &&
                  isNotDeadlineToday(
                    item.isDeadlineExtended
                      ? item.deadline_extension_for_tar
                      : item.deadline_for_tar
                  ) == true
              "
              @click="addTAR(item)"
            >
              Add TAR
            </v-btn>

            <v-btn
              x-small
              class="white--text  mx-1"
              color="green"
              v-if="
                item.tar &&
                  isValidToUpdate(item.tar) == false &&
                  !item.isPending &&
                  item.isHrReceived == 1 &&
                  item.travel_type == 1 &&
                  item.travel_subtype == 2 &&
                  (isNotDeadlineToday(
                    item.isDeadlineExtended
                      ? item.deadline_extension_for_tar
                      : item.deadline_for_tar
                  ) == false ||
                    getTarStatus(item.tar) == 'Approved')
              "
              @click="viewTAR(item.tar)"
            >
              View TAR
            </v-btn>
            <v-btn
              x-small
              class="white--text  mx-1"
              color="green"
              v-if="
                item.tar &&
                  isValidToUpdate(item.tar) == true &&
                  !item.isPending &&
                  item.isHrReceived == 1 &&
                  item.travel_type == 1 &&
                  item.travel_subtype == 2 &&
                  (isNotDeadlineToday(
                    item.isDeadlineExtended
                      ? item.deadline_extension_for_tar
                      : item.deadline_for_tar
                  ) == false ||
                    getTarStatus(item.tar) != 'Approved')
              "
              @click="updateTAR(item.tar)"
            >
              Update TAR
            </v-btn>
            <v-btn
              x-small
              color="grey"
              class=" mx-1"
              outlined
              @click="viewItem(item)"
            >
              <v-icon size="14">mdi-eye</v-icon> View
            </v-btn>
            <v-btn
              x-small
              v-if="
                item.is_recommending_approval_approved == 2 &&
                  item.is_finance_dir_approved == 2 &&
                  item.is_president_approved == 2
              "
              color="green"
              class=" mx-1"
              outlined
              @click="printItem(item)"
            >
              <v-icon size="14">mdi-printer</v-icon> Print
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
          :color="$vuetify.theme.themes.light.submitBtns"
          :length="paginationData.pageCount"
        >
        </v-pagination>
      </v-col>
    </v-row>

    <MyTravelOrderDialog :data="updateData" :action="action" />
    <AddTARDialog :data="dataToAddTAR" :action="action" />

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

    <v-dialog v-model="cancelTravelOrderDialog" persistent max-width="450">
      <v-card color="white">
        <div class="pa-4 #3a3b3a--text">
          <div class="text-h6 mb-1">WARNING!</div>

          <!-- error message-->
          <div class="text-body-1 mb-1">
            <p style="text-align: justify">
              <v-icon class="mt-n2" color="white">mdi-alert</v-icon> &nbsp; Are
              you sure you want to <b>CANCEL</b> this Travel Order?
            </p>
          </div>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="cancelTravelOrderDialog = false">
            Close
          </v-btn>
          <v-btn color="#519043" class="white--text" @click="confirmCancel()">
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
    MyTravelOrderDialog: () =>
      import("../../components/Dialogs/Forms/MyTravelOrderDialog.vue"),
    AddTARDialog: () => import("../Dialogs/Forms/AddTARDialog.vue"),
  },
  data: () => ({
    search: "",
    headers: [
      { text: "TO #", value: "travel_order_num", align: "start" },
      { text: "Date of Travel", value: "travel_date", align: "start" },
      { text: "Place/s of Travel", value: "travel_place", align: "start" },
      { text: "Purpose", value: "travel_purpose", align: "start" },
      {
        text: "Recommending Approval",
        value: "recommending_approval_list",
        align: "center",
      },
      {
        text: "Accountant",
        value: "is_finance_dir_approved",
        align: "center",
      },
      { text: "President", value: "is_president_approved", align: "center" },
      {
        text: "Received by HR",
        value: "isHrReceived",
        align: "center",
      },
      {
        text: "Status",
        value: "isArchived",
        align: "center",
      },
      {
        text: "TAR Deadline",
        value: "deadline_for_tar",
        align: "center",
      },
      {
        text: "TAR Status",
        value: "tar",
        align: "center",
      },
      {
        text: "Actions",
        value: "actions",
        align: "center",
        sortable: false,
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
    activeTab: { id: 1, name: "My TO" },
    tab: 1,
    tabList: [
      { id: 1, name: "My To" },
      { id: 2, name: "Tagged" },
    ],
    totalCount: 0,
    deleteData: null,
    updateData: null,
    dataToAddTAR: null,
    isHrReceived: null,
    loading: false,
    options: {},
    action: null,
    paginationData: {},
    formdata: [],
    work_dates_menu: false,
    dialogConfirmDelete: false,
    cancelTravelOrderDialog: false,
    itemToCancel: null,
    fadeAwayMessage: {
      show: false,
      type: "success",
      header: "Successfully Deleted!",
      message: "",
      top: 10,
    },
  }),

  mounted() {
    this.eventHub.$on("closeMyTravelOrderDialog", () => {
      this.initialize(this.tab);
    });
    this.eventHub.$on("closeAddTARDialog", () => {
      this.initialize(this.tab);
    });
  },
  beforeDestroy() {
    this.eventHub.$off("closeMyTravelOrderDialog");
    this.eventHub.$off("closeAddTARDialog");
  },

  watch: {
    options: {
      handler() {
        this.initialize(this.tab);
      },
      deep: true,
    },
  },

  methods: {
    pagination(data) {
      this.paginationData = data;
    },
    getFirstDate(data) {
      let dump = JSON.parse(data);
      return dump[0];
    },

    isValidJSON(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    },

    // check if date today is less than or equal to deadline date
    isNotDeadlineToday(date) {
      let today = new Date();
      let deadline = new Date(date);
      // console.log(
      //   "is today less than the deadline",
      //   today.setHours(0, 0, 0, 0) <= deadline.setHours(0, 0, 0, 0)
      // );
      if (today.setHours(0, 0, 0, 0) <= deadline.setHours(0, 0, 0, 0)) {
        return true;
      } else {
        return false;
      }
    },

    prependZero(val) {
      if (val <= 9) {
        return "0" + val;
      }
      return val;
    },

    initialize(id) {
      this.loading = true;
      if (id == 1) {
        this.axiosCall("/travel-order/getMyTravelOrders", "GET").then((res) => {
          if (res) {
            console.log("my", res.data);
            this.data = res.data;
            this.loading = false;
          }
        });
      } else {
        this.axiosCall("/travel-order/getTaggedTravelOrders", "GET").then(
          (res) => {
            if (res) {
              // console.log(res.data);
              this.data = res.data;
              this.loading = false;
            }
          }
        );
      }
    },

    isValidToUpdate(tar) {
      let approvals = [];
      if (tar.tarType == 1) {
        approvals.push(tar.hr_approval_status);
        approvals.push(tar.immHead_approval_status);
      } else {
        approvals.push(tar.hr_approval_status);
        approvals.push(tar.immHead_approval_status);
        approvals.push(tar.REPDir_approval_status);
        approvals.push(tar.HRM_approval_status);
      }

      if (approvals.includes(3)) {
        return true;
      } else if (!approvals.includes(3) && approvals.includes(1)) {
        return true;
      } else {
        return false;
      }
    },

    getTarStatus(tar) {
      // console.log(tar);
      let statuses = [];
      if (tar.tarType == 1) {
        statuses.push(tar.immHead_approval_status);
        statuses.push(tar.hr_approval_status);
        if (statuses.includes(3)) {
          return "Pending";
        } else if (!statuses.includes(3) && statuses.includes(1)) {
          return "For Approval";
        } else {
          return "Approved";
        }
      } else if (tar.tarType == 2) {
        statuses.push(tar.immHead_approval_status);
        statuses.push(tar.HRM_approval_status);
        statuses.push(tar.REPDir_approval_status);
        statuses.push(tar.hr_approval_status);

        if (statuses.includes(3)) {
          return "Pending";
        } else if (!statuses.includes(3) && statuses.includes(1)) {
          return "For Approval";
        } else {
          return "Approved";
        }
      }
    },

    changeTab(tab) {
      this.activeTab = tab;

      this.initialize(tab.id);
      this.tab = tab.id;
    },
    add() {
      this.updateData = [{ id: null }];
      this.action = "Add";
    },

    addTAR(item) {
      let data = { toID: item.id, tar: null };
      this.dataToAddTAR = data;

      this.action = "Add";
    },

    cancelTO(item) {
      this.itemToCancel = item;
      this.cancelTravelOrderDialog = true;
    },

    confirmCancel() {
      this.axiosCall(
        "/travel-order/cancelTO/" + this.itemToCancel.id,
        "PATCH"
      ).then((res) => {
        if (res.data.status == 200) {
          this.cancelTravelOrderDialog = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
          this.initialize(this.tab);
        } else if (res.data.status == 400) {
          this.cancelTravelOrderDialog = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
        }
      });
    },

    viewTAR(item) {
      let data = { toID: item.id, tar: item };
      this.dataToAddTAR = data;
      this.action = "View";
    },

    updateTAR(item) {
      let data = { toID: item.id, tar: item };
      this.dataToAddTAR = data;
      this.action = "Update";
    },
    editItem(item) {
      this.updateData = item;
      this.action = "Update";
    },
    viewItem(item) {
      this.updateData = item;
      this.action = "View";
    },
    printItem(item) {
      const url =
        process.env.VUE_APP_SERVER +
        "/pdf-generator/printTravelOrder/" +
        item.id;
      window.open(url);
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
