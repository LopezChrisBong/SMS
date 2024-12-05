<template>
  <div>
    <v-row class="mx-2">
      <v-col cols="12" md="6" class="pa-0">
        <v-tabs v-model="activeTab" color="#5a67da" align-tabs="left">
          <v-tab v-for="tab in tabList" :key="tab.id" @click="changeTab(tab)">{{
            tab.name
          }}</v-tab>
        </v-tabs>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12" md="3" class="d-flex justify-space-between">
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
          class="white--text ml-2 rounded-lg"
          color="#5a67da"
          @click="add()"
        >
          <v-icon left> mdi-plus-box-outline </v-icon>
          Add New
        </v-btn> -->
      </v-col>
    </v-row>
    <v-card class="ma-5 dt-container" elevation="0" outlined>
      <v-data-table
        :headers="tab != 2 && tab != 3 ? headers : headers1"
        :items="data"
        :items-per-page="10"
        :search="search"
        :options.sync="options"
        :loading="loading"
        @pagination="pagination"
        hide-default-footer
      >
        <template v-slot:[`item.to_names`]="{ item }">
          <div :inner-html.prop="item.to_names | highlight(search)"></div>
        </template>
        <template v-slot:[`item.travel_date_from`]="{ item }">
          {{
            isValidJSON(item.travel_date_from)
              ? formatDate(getFirstDate(item.travel_date_from))
              : formatDate(item.travel_date_from)
          }}
          -
          {{ formatDate(item.travel_date_to) }}
        </template>
        <template v-slot:[`item.is_recommending_approval_approved`]="{ item }">
          <v-chip
            v-if="item.is_recommending_approval_approved == 1"
            class="ma-2"
            x-small
          >
            For Approval
          </v-chip>
          <v-icon
            color="#5a67da"
            v-if="item.is_recommending_approval_approved == 2"
            >mdi-check-bold</v-icon
          >

          <v-icon
            color="error"
            v-if="item.is_recommending_approval_approved == 3"
            >mdi-timer-refresh-outline</v-icon
          >
        </template>

        <template v-slot:[`item.is_finance_dir_approved`]="{ item }">
          <v-chip v-if="item.is_finance_dir_approved == 1" class="ma-2" x-small>
            For Approval
          </v-chip>
          <v-icon color="#5a67da" v-if="item.is_finance_dir_approved == 2"
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
          <v-icon color="#5a67da" v-if="item.is_president_approved == 2"
            >mdi-check-bold</v-icon
          >

          <v-icon color="error" v-if="item.is_president_approved == 3"
            >mdi-timer-refresh-outline</v-icon
          >
        </template>
        <template v-slot:[`item.tar_deadline`]="{ item }">
          {{ formatDate(item.deadline_for_tar) }}
        </template>

        <template v-slot:[`item.tar_status`]="{ item }">
          <div
            v-for="(i, a) in item.tarSubmitter"
            :key="a"
            class="d-flex justify-space-between align-start"
          >
            <div class="text-caption text-left align-center">
              {{ i.name }}
            </div>
            <div class="d-flex ">
              <v-chip
                v-if="i.status == null"
                color=" "
                class="align-self-center"
                x-small
              >
                For Submission
              </v-chip>
              <v-chip
                v-if="i.status == 1"
                color="blue"
                class="white--text align-self-center"
                x-small
              >
                For Approval
              </v-chip>
              <v-chip
                v-if="i.status == 2"
                color="#5a67da"
                class="white--text align-self-center"
                x-small
              >
                Approved
              </v-chip>
              <v-chip
                v-if="i.status == 3"
                color="error"
                class=" white--text align-self-center"
                x-small
              >
                Pending
              </v-chip>
            </div>
          </div>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <div class="">
            <!-- <div class="d-flex justify-space-evenly">  -->
            <v-btn
              block
              class="ma-1"
              v-if="item.travel_subtype != 1 && tab != 1"
              x-small
              color="grey"
              outlined
              @click="resetDeadLine(item)"
            >
              <v-icon size="14">mdi-pencil</v-icon> Reset TAR deadline
            </v-btn>
            <v-btn
              block
              class="ma-1"
              v-if="tab != 5"
              x-small
              color="grey"
              outlined
              @click="updateItem(item)"
            >
              <v-icon size="14">mdi-pencil</v-icon> Edit
            </v-btn>
            <v-btn
              block
              class="ma-1"
              x-small
              color="grey"
              outlined
              @click="editItem(item)"
            >
              <v-icon size="14">mdi-eye</v-icon> View
            </v-btn>
            <v-btn
              v-if="tab != 5"
              x-small
              block
              class=" mx-1"
              color="red"
              outlined
              @click="cancelTO(item)"
            >
              <v-icon size="14">mdi-cancel</v-icon> Cancel
            </v-btn>
            <v-btn
              block
              class="ma-1"
              v-if="tab != 5"
              x-small
              color="#5a67da"
              outlined
              @click="printItem(item)"
            >
              <v-icon size="14">mdi-printer</v-icon> Print TO
            </v-btn>
            <v-btn
              block
              class="ma-1"
              v-if="tab != 5"
              x-small
              color="#5a67da"
              outlined
              @click="openTARSubmitters(item)"
            >
              <v-icon size="14">mdi-printer</v-icon> Print TAR
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

    <ViewTravelOrderAttachments
      :data="updateData"
      :action="action"
      :tab="tab"
    />
    <ViewTravelOrderToUpdateDialog :data="viewData" :action="action" />
    <!-- reset deadline -->
    <v-dialog v-model="resetDeadlineDialog" persistent max-width="500">
      <v-card color="white">
        <v-form ref="resetDeadlineDialogFormref" @submit.prevent>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>Reset deadline</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="resetDeadlineDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col class="mt-2" cols="12">
                  <v-menu
                    ref="deadlineDateFromRef"
                    :close-on-content-click="false"
                    :return-value.sync="deadline_date"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        dense
                        v-model="deadline_date"
                        :rules="[formRules.required]"
                        chips
                        readonly
                        small-chips
                        color="#6DB249"
                        label="New Deadline for adding TAR"
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="deadline_date"
                      :min="
                        new Date(travel_date_to).toISOString().substr(0, 10)
                      "
                      no-title
                      color="#6DB249"
                      scrollable
                    >
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        color="#6DB249"
                        @click="$refs.deadlineDateFromRef.save(deadline_date)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" outlined @click="deadlineToAddTARDialog = false">
              Close
            </v-btn>
            <v-btn
              color="green"
              class="white--text"
              @click="saveDeadlineDate()"
            >
              Confirm
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
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

    <!-- cancellation of TO dialog -->
    <v-dialog v-model="cancelTravelOrderDialog" persistent max-width="450">
      <v-card color="white">
        <div class="pa-4 #3a3b3a--text">
          <div class="text-h6 mb-1">WARNING!</div>

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
          <v-btn color="#5a67da" class="white--text" @click="confirmCancel()">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- TAR submitters -->
    <v-dialog
      v-model="tarSubmitterDialog"
      scrollable
      persistent
      max-width="700"
    >
      <v-card>
        <v-card-title dark class="dialog-header">
          <span>Please select employee's TAR to print</span>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="tarSubmitterDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-col> </v-col>
        <v-card-text style="max-height: 700px" class="my-4">
          <v-row>
            <v-col cols="12">
              <v-data-table
                :headers="tarDialogHeaders"
                :items="tarSubmitters"
                :items-per-page="10"
              >
                <template v-slot:[`item.status`]="{ item }">
                  <v-chip
                    v-if="item.status == null"
                    color=" "
                    class="align-self-center"
                    x-small
                  >
                    For Submission
                  </v-chip>
                  <v-chip
                    v-if="item.status == 1"
                    color="blue"
                    class="white--text align-self-center"
                    x-small
                  >
                    For Approval
                  </v-chip>
                  <v-chip
                    v-if="item.status == 2"
                    color="#5a67da"
                    class="white--text align-self-center"
                    x-small
                  >
                    Approved
                  </v-chip>
                  <v-chip
                    v-if="item.status == 3"
                    color="error"
                    class=" white--text align-self-center"
                    x-small
                  >
                    Pending
                  </v-chip>
                </template>
                <template v-slot:[`item.action`]="{ item }">
                  <v-btn
                    outlined
                    color="green"
                    class=" mx-1"
                    x-small
                    :disabled="item.tarID == null"
                    @click="viewTarAttachment(item.tarID)"
                    ><v-icon size="14">mdi-eye</v-icon>View TAR
                    Attachment</v-btn
                  >
                  <v-btn
                    @click="printTAR(item.id)"
                    outlined
                    :color="item.status == 2 ? 'green' : '#5a67da'"
                    class="white--text"
                    :disabled="item.status != 2"
                    x-small
                    ><v-icon size="14">mdi-printer</v-icon>Print</v-btn
                  >
                </template></v-data-table
              >
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
      </v-card>
    </v-dialog>

    <!-- TAR ATTACHMENT SELECTION dialog -->
    <v-dialog v-model="tarAttachSelectionDialog" persistent max-width="700">
      <v-card color="white">
        <div class="pa-10 #3a3b3a--text">
          <div class="text-body-1 mb-1 d-flex justify-space-around">
            <div
              class="elevation-2 text-center"
              style="width:200px; height:200px;cursor:pointer"
              v-for="(item, i) in files_to_display"
              :key="i"
              @click="openAttachment(item.filename)"
            >
              <v-icon color="green" size="100">mdi-file</v-icon>
              <br />
              <div class="text-caption mt-2">
                {{ item.description }}
              </div>
            </div>
          </div>
        </div>
      </v-card>
    </v-dialog>

    <ViewAttachment :data="tarFileName" :moduleFrom="'TAR'" />
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
    ViewTravelOrderAttachments: () =>
      import("../../components/Dialogs/Views/ViewTravelOrderAttachments.vue"),
    ViewTravelOrderToUpdateDialog: () =>
      import(
        "../../components/Dialogs/Views/ViewTravelOrderToUpdateDialog.vue"
      ),
    ViewAttachment: () =>
      import("../../components/Dialogs/Views/ViewAttachment.vue"),
  },
  filters: {
    highlight: function(value, query) {
      return value.replace(
        new RegExp(query, ""),
        "<span class='blue'>" + query + "</span>"
      );
    },
  },
  data: () => ({
    search: "",
    deadline_date: null,
    resetDeadlineDialog: false,
    travel_date_to: null,
    to_ID: null,
    files_to_display: [],
    tarAttachSelectionDialog: false,
    headers: [
      { text: "TO Number", value: "travel_order_num", align: "start" },
      // { text: "Created By", value: "name", align: "start" },
      { text: "Employee/s", value: "to_names", align: "start", width: 180 },
      {
        text: "Date of Travel",
        value: "travel_date_from",
        align: "start",
        width: 100,
      },
      {
        text: "Place/s of Travel",
        value: "travel_place",
        align: "start",
        width: 180,
      },
      { text: "Purpose", value: "travel_purpose", align: "start", width: 180 },
      {
        text: "Recommending Approval",
        value: "is_recommending_approval_approved",
        align: "center",
      },
      {
        text: "Accountant",
        value: "is_finance_dir_approved",
        align: "center",
      },
      { text: "President", value: "is_president_approved", align: "center" },

      {
        text: "Action",
        value: "actions",
        align: "center",
        width: 100,
        sortable: false,
      },
    ],
    headers1: [
      { text: "TO Number", value: "travel_order_num", align: "start" },
      // { text: "Created By", value: "name", align: "start" },
      { text: "Employee/s", value: "to_names", align: "start", width: 180 },
      {
        text: "Date of Travel",
        value: "travel_date_from",
        align: "start",
        width: 100,
      },
      {
        text: "Place/s of Travel",
        value: "travel_place",
        align: "start",
        width: 180,
      },
      { text: "Purpose", value: "travel_purpose", align: "start", width: 180 },
      {
        text: "Recommending Approval",
        value: "is_recommending_approval_approved",
        align: "center",
      },
      {
        text: "Accountant",
        value: "is_finance_dir_approved",
        align: "center",
      },
      { text: "President", value: "is_president_approved", align: "center" },
      {
        text: "TAR Deadline",
        value: "tar_deadline",
        align: "center",
      },
      {
        text: "TAR Status",
        value: "tar_status",
        width: 250,
        align: "center",
      },
      {
        text: "Action",
        value: "actions",
        align: "center",
        width: 100,
        sortable: false,
      },
    ],
    tarFileName: null,
    tarDialogHeaders: [
      {
        text: "Name",
        value: "name",
        align: "start",
      },
      {
        text: "TAR Status",
        value: "status",

        align: "center",
      },
      {
        text: "Action",
        value: "action",
        align: "end",
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
    activeTab: { id: 1, name: "For Verification" },
    tab: 1,
    tabList: [
      { id: 1, name: "To receive" },
      { id: 2, name: "Received" },
      { id: 3, name: "Archived" },
      { id: 4, name: "Pending" },
      { id: 5, name: "Cancelled" },
    ],
    totalCount: 0,
    deleteData: null,
    updateData: null,
    viewData: null,
    loading: false,
    options: {},
    action: null,
    tarSubmitters: [],
    tarSubmitterDialog: false,
    tar_toID: null,
    paginationData: {},
    formdata: [],
    cancelTravelOrderDialog: false,
    itemToCancel: null,
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

  mounted() {
    this.eventHub.$on("closeMyTravelOrderDialog", () => {
      this.initialize(this.tab);
    });
    this.eventHub.$on("closeViewTravelOrderAttachments", () => {
      this.initialize(this.tab);
    });
    this.eventHub.$on("ViewTravelOrderToUpdateDialog", () => {
      this.initialize(this.tab);
    });
    this.eventHub.$on("closeViewAttachmentDialog", () => {
      this.initialize(this.tab);
    });
  },
  beforeDestroy() {
    this.eventHub.$off("closeMyTravelOrderDialog");
    this.eventHub.$off("ViewTravelOrderToUpdateDialog");
    this.eventHub.$off("closeViewTravelOrderAttachments");
    this.eventHub.$off("closeViewAttachmentDialog");
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

    isNotDeadlineToday(date) {
      let today = new Date();
      let deadline = new Date(date);

      if (today.setHours(0, 0, 0, 0) <= deadline.setHours(0, 0, 0, 0)) {
        return true;
      } else {
        return false;
      }
    },

    changeTab(tab) {
      this.activeTab = tab;
      this.initialize(tab.id);
      this.tab = tab.id;
    },

    initialize(status) {
      this.loading = true;
      if (status == 3) {
        this.axiosCall("/travel-order/archived", "GET").then((res) => {
          if (res) {
            let data = res.data;
            data.forEach((element, i) => {
              data[i].name = this.toTitleCase(element.name);
            });
            this.data = data;
            this.loading = false;
          }
        });
      } else if (status == 4) {
        this.axiosCall("/travel-order/pending", "GET").then((res) => {
          if (res) {
            let data = res.data;
            data.forEach((element, i) => {
              data[i].name = this.toTitleCase(element.name);
            });
            this.data = data;
            this.loading = false;
          }
        });
      } else if (status == 5) {
        this.axiosCall("/travel-order/cancelled", "GET").then((res) => {
          if (res) {
            let data = res.data;
            data.forEach((element, i) => {
              data[i].name = this.toTitleCase(element.name);
            });
            this.data = data;
            this.loading = false;
          }
        });
      } else {
        this.axiosCall("/travel-order/receive/" + status, "GET").then((res) => {
          if (res) {
            let data = res.data;
            data.forEach((element, i) => {
              data[i].name = this.toTitleCase(element.name);
            });
            this.data = data;
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
    openTARSubmitters(item) {
      this.tar_toID = item.id;
      this.tarSubmitters = item.tarSubmitter;
      this.tarSubmitterDialog = true;
    },

    viewTarAttachment(id) {
      this.axiosCall("/tar/getAttachments/" + id, "GET").then((res) => {
        if (res.data) {
          // console.log("files", res.data);
          this.files_to_display = res.data;
          this.tarAttachSelectionDialog = true;
        }
      });
    },

    openAttachment(file) {
      this.tarAttachSelectionDialog = false;
      this.files_to_display = [];
      this.tarFileName = null;
      setTimeout(() => {
        this.tarFileName = file;
      }, 100);
    },

    printTAR(id) {
      let url =
        process.env.VUE_APP_SERVER +
        "/pdf-generator/printEmployeeTAR/" +
        id +
        "/" +
        this.tar_toID;
      window.open(url);
    },

    add() {
      this.updateData = [{ id: null }];
      this.action = "Add";
    },
    editItem(item) {
      this.updateData = item;
      this.action = "Update";
    },
    updateItem(item) {
      this.viewData = item;
      this.action = "Update";
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

    printItem(item) {
      const url =
        process.env.VUE_APP_SERVER +
        "/pdf-generator/printTravelOrder/" +
        item.id;
      window.open(url);
    },
    resetDeadLine(item) {
      console.log(item);
      this.travel_date_to = item.travel_date_to;
      this.to_ID = item.id;
      this.resetDeadlineDialog = true;
    },
    saveDeadlineDate() {
      if (this.$refs.resetDeadlineDialogFormref.validate()) {
        let data = {
          to_ID: this.to_ID,
          deadline_date: this.deadline_date,
        };
        this.axiosCall("/travel-order/reset-deadline", "POST", data).then(
          (res) => {
            if (res.data.status == 200) {
              this.dialog = false;
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "success";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
              this.resetDeadlineDialog = false;
            } else if (res.data.status == 400) {
              this.dialog = false;
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "error";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
              this.resetDeadlineDialog = false;
            }
          }
        );
      }
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
