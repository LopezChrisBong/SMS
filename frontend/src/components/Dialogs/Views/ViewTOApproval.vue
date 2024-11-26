<template>
  <div>
    <v-dialog
      v-model="dialog"
      eager
      scrollable
      persistent
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-form ref="TOApprovalFormref" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>Travel Order Approval </span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="closeD()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 800px" class="my-4">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-stepper alt-labels class="elevation-0">
                    <v-stepper-header>
                      <v-stepper-step
                        step="1"
                        class="pa-5"
                        style="cursor:pointer"
                        @click="stepper1Expand = !stepper1Expand"
                        :complete="
                          TOModel.is_recommending_approval_approved == 2
                            ? true
                            : false
                        "
                        :rules="[
                          () => TOModel.is_recommending_approval_approved != 3,
                        ]"
                        color="#6DB249"
                      >
                        <h3 class="text-gray-200 text-body-2">
                          (Click to expand)
                        </h3>
                        <small>Recommending Approval</small>
                      </v-stepper-step>

                      <v-divider></v-divider>

                      <v-stepper-step
                        step="2"
                        class="pa-5"
                        :complete="
                          TOModel.is_finance_dir_approved == 2 ? true : false
                        "
                        :rules="[() => TOModel.is_finance_dir_approved != 3]"
                        color="#6DB249"
                      >
                        <div class="d-flex justify-center" style="width:250px">
                          {{
                            TOModel.finDir_name
                              ? TOModel.finDir_name.toUpperCase()
                              : ""
                          }}
                        </div>

                        <small>Accountant</small>
                      </v-stepper-step>

                      <v-divider></v-divider>

                      <v-stepper-step
                        class="pa-5"
                        step="3"
                        :complete="
                          TOModel.is_president_approved == 2 ? true : false
                        "
                        :rules="[() => TOModel.is_president_approved != 3]"
                        color="#6DB249"
                      >
                        <div class="d-flex justify-center" style="width:250px">
                          {{
                            TOModel.president_name
                              ? TOModel.president_name.toUpperCase()
                              : ""
                          }}
                        </div>

                        <small>President</small>
                      </v-stepper-step>
                    </v-stepper-header>
                  </v-stepper>
                  <v-expand-transition>
                    <v-stepper
                      alt-labels
                      class="elevation-1"
                      v-show="stepper1Expand"
                    >
                      <v-stepper-header>
                        <template v-for="(item, i) in getRecommendingApprovals">
                          <v-stepper-step
                            class="pa-5"
                            :key="`${i}-step`"
                            :step="i + 1"
                            @click="stepper1Expand = !stepper1Expand"
                            :complete="item.approveStatus == 2 ? true : false"
                            :rules="[() => item.approveStatus != 3]"
                            color="#6DB249"
                          >
                            <h3 class="text-gray-200 text-body-2">
                              {{ item.name }}
                            </h3>
                            <small>Recommending Approval</small>
                          </v-stepper-step>

                          <v-divider
                            v-if="i !== getRecommendingApprovalListLength"
                            :key="i"
                          ></v-divider>
                        </template>
                      </v-stepper-header>
                    </v-stepper>
                  </v-expand-transition>
                </v-col>
                <!-- <v-col cols="12" class="shrink">
               
                </v-col> -->
                <v-col cols="12">
                  <v-text-field
                    v-model="TOModel.travel_order_num"
                    :rules="[formRules.required]"
                    dense
                    readonly
                    outlined
                    required
                    label="Travel Order Number"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="travelDates"
                    :rules="[formRules.required]"
                    dense
                    readonly
                    outlined
                    required
                    label="Travel Date"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>
                <!-- <v-col cols="12">
                  <v-autocomplete
                    outlined
                    dense
                    :rules="[formRules.required]"
                    label="Employee/s"
                    v-model="TOModel.selectedUsers"
                    :items="users"
                    item-text="name"
                    item-value="id"
                    required
                    class="rounded-lg"
                    color="#6DB249"
                    deletable-chips
                    multiple
                    small-chips
                  ></v-autocomplete>
                </v-col> -->
                <v-col cols="12">
                  <v-card class="card-style mb-5">
                    <v-data-table
                      :headers="headers"
                      :items="TOModel.selectedUsersData"
                      :items-per-page="10"
                      hide-default-footer
                    >
                      <template v-slot:[`item.positionID`]="{ item }">
                        <h3 class="text-caption" v-if="item.positionID == 2">
                          {{ item.inst_name }}
                        </h3>
                        <h3 class="text-caption" v-else>
                          {{ item.office }}
                        </h3>
                      </template>
                    </v-data-table>
                  </v-card>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="TOModel.travel_place"
                    :rules="[formRules.required]"
                    dense
                    readonly
                    outlined
                    required
                    label="Place/s of Travel"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="TOModel.travel_purpose"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    readonly
                    required
                    label="Purpose of Travel"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" v-if="toApproveType == 'finDir'" class="pa-0">
                  <div
                    class="d-flex align-center rounded-lg mx-3 px-3"
                    style="border:1px solid gray; height: 42px"
                  >
                    <div class="text-body-1">
                      Funds Available:
                    </div>
                    <v-checkbox
                      label="N/A"
                      class="ml-10 pa-0"
                      v-model="TOModel.is_fund_available"
                    ></v-checkbox>
                  </div>
                </v-col>

                <v-col
                  cols="12"
                  v-if="toApproveType == 'president' && tab == 1"
                >
                  <v-btn
                    small
                    outlined
                    class="mb-2"
                    :color="!addTORemarks ? '#6DB249' : 'red'"
                    @click="addTORemarks = !addTORemarks"
                  >
                    {{ !addTORemarks ? "Add" : "Close" }} Remarks</v-btn
                  >
                  <v-textarea
                    v-if="addTORemarks"
                    v-model="TOModel.president_remarks"
                    dense
                    :rules="addTORemarks ? [formRules.required] : []"
                    outlined
                    required
                    label="Remarks"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-textarea>
                </v-col>

                <v-col
                  cols="12"
                  v-if="toApproveType == 'president' && tab != 1"
                >
                  <v-textarea
                    v-model="TOModel.president_remarks"
                    dense
                    readonly
                    outlined
                    required
                    label="Remarks"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-textarea>
                </v-col>

                <v-col cols="12" class="mt-3">
                  <h3 class="text-body-1">
                    Attachments
                    <span v-if="files_to_display.length == 0"
                      ><i>: No file attachments uploaded</i></span
                    >
                  </h3>
                </v-col>
                <v-col cols="12" v-if="files_to_display.length > 0">
                  <div class="elevation-2 rounded-lg ">
                    <div
                      class="d-flex justify-space-between  elevation-1 px-2 py-2 white--text"
                      style="background-color:#519043"
                    >
                      <h3
                        class="text-subtitle-2 text-center"
                        style="width:35%;"
                      >
                        Description
                      </h3>
                      <h3
                        class="text-subtitle-2 text-center"
                        style="width:35%;"
                      >
                        File
                      </h3>
                      <h3
                        class="text-subtitle-2 text-center"
                        style="width:30%; "
                      >
                        Action
                      </h3>
                    </div>
                    <div
                      v-for="(file, i) in files_to_display"
                      :key="i"
                      class="d-flex justify-space-between px-2 mt-1"
                    >
                      <h3
                        class="text-subtitle-1 text-center"
                        style="width:35%; "
                      >
                        {{ file.description }}
                      </h3>
                      <h3
                        class="text-subtitle-1 text-center"
                        style="width:35%; "
                      >
                        {{ file.filename }}
                      </h3>
                      <div class=" text-center" style="width:30%;">
                        <v-btn
                          x-small
                          outlined
                          color="#6DB249"
                          @click="viewFile(file)"
                          ><v-icon size="14">mdi-eye-outline</v-icon>
                          View</v-btn
                        >
                      </div>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions class="pa-5">
            <v-fab-transition>
              <v-menu top>
                <template v-slot:activator="{ on }">
                  <v-btn left color="#519043" outlined v-on="on">
                    Remarks
                  </v-btn>
                </template>

                <v-card class="mx-auto" width="600" max-width="600" elevation-4>
                  <v-card-title class="dialog-header  white--text">
                    <span class="text-h6">Remarks</span>
                  </v-card-title>
                  <v-card-text
                    class="py-0"
                    style="background-color:white;  height : 300px; overflow-y:auto"
                  >
                    <v-timeline dense v-if="remarksData.length > 0">
                      <v-timeline-item
                        v-for="item in remarksData"
                        :key="item.id"
                        small
                        color="#519043"
                        icon="mdi-comment-processing-outline"
                        fill-dot
                      >
                        <v-alert :value="true">
                          <div class="text-h6">
                            {{
                              $store.getters.getUserData.id ==
                              item.remarks_maker_userID
                                ? "You"
                                : item.remarks_by
                            }}
                          </div>
                          <div class="text-body-1">
                            {{ item.message }}
                          </div>
                          <div class="text-caption">
                            <i>{{ formatDate(item.created_at) }}</i>
                          </div>
                        </v-alert>
                      </v-timeline-item>
                    </v-timeline>
                    <v-timeline dense v-if="remarksData.length == 0">
                      <v-timeline-item
                        small
                        color="#519043"
                        icon="mdi-comment-processing-outline"
                        fill-dot
                      >
                        <v-alert :value="true">
                          <div class="text-body-1">
                            No remarks found.
                          </div>
                        </v-alert>
                      </v-timeline-item>
                    </v-timeline>
                  </v-card-text>
                </v-card>
              </v-menu>
            </v-fab-transition>
            <v-spacer></v-spacer>
            <v-btn v-if="tab == 1" color="red" outlined @click="toPending()">
              <v-icon>mdi-close-circle-outline</v-icon>
              Pending
            </v-btn>

            <v-btn
              v-if="tab == 1"
              @click="confirmApproval()"
              color="#519043"
              class="white--text"
            >
              <v-icon>mdi-check-circle</v-icon>
              Approve
            </v-btn>
          </v-card-actions>
          <!-- <v-card-actions class="pa-5" v-if="tab != 1">
           
            <v-spacer></v-spacer>
          </v-card-actions> -->
        </v-card>
      </v-form>
    </v-dialog>
    <ViewTOAttachments :data="fileToView" />

    <!-- confirmation -->
    <v-dialog v-model="confirmDialog" persistent max-width="400">
      <v-card color="white">
        <div class="pa-4 #3a3b3a--text">
          <div class="text-subtitle-1 mb-1 font-weight-bold">WARNING!</div>
          <div class="text-body-1 mb-1">
            <p style="text-align: justify">
              <v-icon class="mt-n2" color="white">mdi-alert</v-icon> &nbsp; Are
              you sure you want to
              <span class="font-weight-bold">APPROVE</span> this Travel Order?
            </p>
          </div>
        </div>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="confirmDialog = false">
            Close
          </v-btn>
          <v-btn
            @click="RecommendingApprovalBtn()"
            color="#519043"
            v-if="toApproveType == 'recommending'"
            class="white--text"
          >
            <v-icon>mdi-check-circle</v-icon>
            CONFIRM
          </v-btn>
          <v-btn
            color="#519043"
            @click="FinDirApprovalBtn()"
            v-if="toApproveType == 'finDir'"
            class="white--text"
          >
            <v-icon>mdi-check-circle</v-icon>
            CONFIRM
          </v-btn>
          <v-btn
            color="#519043"
            @click="PresidentApprovalBtn()"
            v-if="toApproveType == 'president'"
            class="white--text"
          >
            <v-icon>mdi-check-circle</v-icon>
            CONFIRM
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- pending input dialog -->
    <v-dialog v-model="pendingDialog" persistent max-width="500">
      <v-form ref="pendingFormRef" @submit.prevent>
        <v-card color="white">
          <v-card-title dark>
            <span>Pending Message</span>
            <v-spacer></v-spacer>
          </v-card-title>
          <v-card-text>
            <v-textarea
              outlined
              :rules="[formRules.required]"
              dense
              color="#519043"
              v-model="pendingMsg"
              placeholder="Type here...."
              rows="5"
            ></v-textarea>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" outlined @click="pendingDialog = false">
              Close
            </v-btn>
            <v-btn
              color="green"
              class="white--text"
              @click="confirmPending(toApproveType)"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
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
  props: {
    data: null,
    action: null,
    toApproveType: null,
    tab: null,
  },
  components: {
    ViewTOAttachments: () => import("../Views/ViewTOAttachments.vue"),
  },
  data() {
    return {
      addTORemarks: false,
      dialog: false,
      confirmDialog: false,
      pendingDialog: false,
      pendingMsg: null,
      remarksData: [],
      TOModel: {
        id: null,
        userID: null,
        selectedUsers: [],
        selectedUsersData: [],
        travel_date: null,
        travel_place: null,
        travel_order_num: null,
        travel_purpose: null,
        recommending_approval_userID: null,
        is_recommending_approval_approved: null,
        is_finance_dir_approved: null,
        is_president_approved: null,
        is_fund_available: null,
        president_remarks: null,
        recommending_approval_name: null,
        finDir_name: null,
        president_name: null,
      },
      president_userID: null,
      fileToView: [],
      files_to_display: [],
      headers: [
        { text: "Employee", value: "name", align: "start" },
        { text: "Position", value: "position", align: "center" },
        {
          text: "Unit",
          value: "positionID",
          align: "center",
        },
      ],
      recommending_approval_list: [],
      users: [],
      userRoleList: [
        { id: 1, role: "Admin" },
        { id: 2, role: "Staff" },
      ],
      stepper1Expand: false,
      travelDates: null,
      usertypeList: [],
      officeList: [],
      designationList: [],
      positionList: [],
      empStatusList: [],
      instituteList: [],
      fadeAwayMessage: {
        show: false,
        type: "success",
        header: "Successfully Added!",
        message: "",
        top: 10,
      },
    };
  },
  watch: {
    data: {
      handler(data) {
        console.log(data);
        this.dialog = true;
        this.addTORemarks = false;
        this.stepper1Expand = false;
        this.initialize();
        // this.$refs.TOApprovalFormref.reset();
        // this.$refs.TOApprovalFormref.resetValidation();

        if (data.id) {
          this.TOModel.id = data.id;
          this.TOModel.userID = data.userID;
          this.TOModel.selectedUsers = JSON.parse(data.selectedUsers);
          this.TOModel.selectedUsersData = data.selectedUsersData;
          this.recommending_approval_list = data.recommending_approval_list;

          if (this.isValidJSON(data.travel_date_from)) {
            let data1 = JSON.parse(data.travel_date_from);
            let dateStr = "";
            if (data1.length > 2) {
              for (let i = 0; i < data1.length - 1; i++) {
                if (dateStr == "") {
                  dateStr = this.formatDate(data1[i]);
                } else {
                  dateStr += ", " + this.formatDate(data1[i]);
                }
              }
              dateStr += " & " + this.formatDate(data.travel_date_to);
            } else {
              dateStr =
                this.formatDate(data1[0]) +
                " - " +
                this.formatDate(data.travel_date_to);
            }

            this.travelDates = dateStr;
          } else {
            this.travelDates =
              this.formatDate(data.travel_date_from) +
              " - " +
              this.formatDate(data.travel_date_to);
          }
          // this.TOModel.travel_date =
          //   this.formatDate(data.travel_date_from) +
          //   " - " +
          //   this.formatDate(data.travel_date_to);
          this.TOModel.travel_place = data.travel_place;
          this.TOModel.travel_order_num = data.travel_order_num;
          this.TOModel.travel_purpose = data.travel_purpose;
          this.TOModel.recommending_approval_userID =
            data.recommending_approval_userID;
          this.TOModel.is_recommending_approval_approved =
            data.is_recommending_approval_approved;
          this.TOModel.is_finance_dir_approved = data.is_finance_dir_approved;
          this.TOModel.is_president_approved = data.is_president_approved;
          this.TOModel.is_fund_available = data.is_fund_available;
          this.TOModel.president_remarks = data.president_remarks;
          // this.getRecommendingApproval(data.recommending_approval_userID);
          this.getFinanceDir(data.finance_dir_userID);
          this.president_userID = data.president_userID;
          this.getCollegePres(data.president_userID);
          this.getTOAttachments(data.id);
          this.loadRemarks(data.id);
        }
      },
      deep: true,
    },
  },
  computed: {
    getRecommendingApprovalListLength() {
      return this.recommending_approval_list.length - 1;
    },

    getRecommendingApprovals() {
      let data = [];
      for (let i = 0; i < this.recommending_approval_list.length; i++) {
        if (this.recommending_approval_list[i].id != this.president_userID) {
          data.push(this.recommending_approval_list[i]);
        }
      }
      return data;
    },
  },
  methods: {
    initialize() {
      this.getUsers();

      //   this.getOffices();
      //   this.getPositions();
      //   this.getDesignations();
      //   this.getEmpStatus();
      //   this.getInstitutes();
      //   this.getUserType();
    },

    isValidJSON(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    },

    getUserType() {
      this.axiosCall("/user-type/getAllUsertype", "GET").then((res) => {
        if (res.data) {
          this.usertypeList = res.data;
        }
      });
    },

    loadRemarks(id) {
      // console.log("id", id);
      if (id) {
        this.axiosCall("/remarks/" + id + "/Travel Order", "GET").then(
          (res) => {
            if (res.data) {
              console.log("remarks", res.data);
              this.remarksData = res.data;
            }
          }
        );
      }
    },

    viewFile(file) {
      setTimeout(() => {
        this.fileToView = { id: null };
      }, 100);
      this.fileToView = file;
    },

    getTOAttachments(id) {
      this.axiosCall("/to-attachments/" + id, "GET").then((res) => {
        if (res.data) {
          this.files_to_display = res.data;
        }
      });
    },

    closeD() {
      this.eventHub.$emit("closeViewTOApproval", false);
      this.pendingDialog = false;
      this.confirmDialog = false;
      this.dialog = false;
    },

    toPending() {
      this.pendingDialog = true;
      this.$refs.pendingFormRef.reset();
    },

    pending() {
      let data = {
        TO_id: this.TOModel.id,
        approver: this.toApproveType,
        remarks: this.pendingMsg,
      };

      this.axiosCall("/travel-order/pendingTO", "POST", data).then((res) => {
        if (res.data.status == 200) {
          this.dialog = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;

          this.closeD();
        } else if (res.data.status == 400) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
        }
      });
    },

    confirmPending() {
      if (this.$refs.pendingFormRef.validate()) {
        this.pending();
      }
    },

    confirmApproval() {
      if (this.$refs.TOApprovalFormref.validate()) {
        this.confirmDialog = true;
      }
    },

    RecommendingApprovalBtn() {
      let data = {
        isApproved: 2,
        TO_id: this.TOModel.id,
      };
      this.axiosCall("/travel-order/approve/recommending", "POST", data).then(
        (res) => {
          if (res.data.status == 200) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.closeD();
          } else if (res.data.status == 400) {
            // this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;

            // this.closeD();
          }
        }
      );
    },

    FinDirApprovalBtn() {
      console.log(this.TOModel.is_fund_available);
      let data = {
        isApproved: 2,
        TO_id: this.TOModel.id,
        is_fund_available:
          this.TOModel.is_fund_available &&
          this.TOModel.is_fund_available == true
            ? true
            : false,
      };
      this.axiosCall("/travel-order/approve/finDir", "POST", data).then(
        (res) => {
          if (res.data.status == 200) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.closeD();
          } else if (res.data.status == 400) {
            // this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            // this.$refs.PositionFormref.reset();
            // this.closeD();
          }
        }
      );
    },

    PresidentApprovalBtn() {
      let data = {
        isApproved: 2,
        TO_id: this.TOModel.id,
        president_remarks: this.addTORemarks
          ? this.TOModel.president_remarks
          : null,
      };
      this.axiosCall("/travel-order/approve/president", "POST", data).then(
        (res) => {
          if (res.data.status == 200) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.closeD();
          } else if (res.data.status == 400) {
            // this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;

            // this.closeD();
          }
        }
      );
    },

    add() {
      if (this.$refs.TravelOrderFormref.validate()) {
        let data = {
          selectedUsers: this.TOModel.selectedUsers,
          travel_date: this.TOModel.travel_date,
          travel_place: this.TOModel.travel_place,
          travel_purpose: this.TOModel.travel_purpose,
          recommending_approval_userID: this.TOModel
            .recommeding_approval_userID,
        };

        this.axiosCall("/travel-order", "POST", data).then((res) => {
          if (res.data.status == 201) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.closeD();
          } else if (res.data.status == 400) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;

            this.closeD();
          }
        });
      }
    },
    getUsers() {
      this.axiosCall("/user-details/getAllUserDetail", "GET").then((res) => {
        this.users = res.data;
        // console.log(res.data);
      });
    },

    getRecommendingApproval(id) {
      this.axiosCall(
        "/my-direct-head/getRecommendingApproval/" + id,
        "GET"
      ).then((res) => {
        if (res.data) {
          console.log(res.data);
          this.TOModel.recommending_approval_name = res.data.name;
        }
      });
    },

    getFinanceDir(id) {
      this.axiosCall(
        "/my-direct-head/getRecommendingApproval/" + id,
        "GET"
      ).then((res) => {
        if (res.data) {
          this.TOModel.finDir_name = res.data.name;
        }
      });
    },

    getCollegePres(id) {
      this.axiosCall(
        "/my-direct-head/getRecommendingApproval/" + id,
        "GET"
      ).then((res) => {
        if (res.data) {
          this.TOModel.president_name = res.data.name;
        }
      });
    },

    getOffices() {
      this.axiosCall("/offices", "GET").then((res) => {
        this.officeList = res.data;
      });
    },
    getPositions() {
      this.axiosCall("/positions", "GET").then((res) => {
        this.positionList = res.data;
      });
    },
    getDesignations() {
      this.axiosCall("/designations", "GET").then((res) => {
        this.designationList = res.data;
      });
    },
    getEmpStatus() {
      this.axiosCall("/employment-status", "GET").then((res) => {
        this.empStatusList = res.data;
      });
    },
    getInstitutes() {
      this.axiosCall("/institutes", "GET").then((res) => {
        this.instituteList = res.data;
      });
    },
  },
};
</script>
