<template>
  <div>
    <v-dialog
      v-model="dialog"
      fullscreen
      eager
      persistent
      scrollable
      max-width="900px"
    >
      <v-card>
        <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
          <span>IPCR Targets Approval</span>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="closeD()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text style="max-height: 700px" class="my-4">
          <v-card>
            <v-row>
              <v-col cols="12" v-if="isSubmitted">
                <v-stepper alt-labels class="elevation-0">
                  <v-stepper-header>
                    <v-stepper-step
                      step="1"
                      class="pa-5"
                      :complete="assessed_by_status == 2 ? true : false"
                      :rules="[() => assessed_by_status != 3]"
                      color="#6DB249"
                    >
                      {{ assessed_by }}
                      <small>Assessed By<br /> </small>
                    </v-stepper-step>
                    <!-- <v-divider></v-divider>
                    <v-stepper-step
                      step="2"
                      class="pa-5"
                      :complete="final_rating_by_status == 2 ? true : false"
                      :rules="[() => final_rating_by_status != 3]"
                      color="#6DB249"
                    >
                      {{ final_rating_by }}
                      <small>Final Rating <br /> </small>
                    </v-stepper-step> -->
                  </v-stepper-header>
                </v-stepper>
              </v-col>
              <v-col cols="8" class="flex-items mt-2">
                <v-tabs v-model="activeTab" color="#519043" align-tabs="left">
                  <v-tab
                    v-for="tab in tabList"
                    :key="tab.id"
                    @click="changeTab(tab)"
                    >{{ tab.name }}</v-tab
                  >
                </v-tabs>
              </v-col>
              <v-spacer></v-spacer>

              <v-col cols="12" class=" pt-2 px-4">
                <v-data-table
                  :headers="tab != 3 ? headers : support_headers"
                  :items="dataItem"
                  :items-per-page="10"
                >
                  <template v-slot:[`item.efficiency`]="{ item }">
                    {{
                      item.efficiency_type == "percentage"
                        ? item.efficiency + "%"
                        : item.efficiency
                    }}
                  </template>
                  <template v-slot:[`item.success_indicator`]="{ item }">
                    <div class="text-justify">
                      {{ item.success_indicator }}
                    </div>
                  </template>
                  <template v-slot:[`item.eqt`]="{ item }">
                    <div class="text-center">
                      <div class="d-flex align-center justify-center">
                        <div class="text-caption">E -</div>
                        <div class="align-self-center">
                          <v-icon color="#519043" v-if="item.eff_is_rated"
                            >mdi-check</v-icon
                          >
                          <v-chip x-small class="pa-1" v-if="!item.eff_is_rated"
                            >NR</v-chip
                          >
                        </div>
                      </div>
                      <div class="d-flex align-center justify-center">
                        <div class="text-caption">Q -</div>
                        <div class="align-self-center">
                          <v-icon color="#519043" v-if="item.qly_is_rated"
                            >mdi-check</v-icon
                          >
                          <v-chip x-small class="pa-1" v-if="!item.qly_is_rated"
                            >NR</v-chip
                          >
                        </div>
                      </div>
                      <div class="d-flex align-center justify-center">
                        <div class="text-caption">T -</div>
                        <div class="align-self-center">
                          <v-icon
                            color="#519043"
                            v-if="item.timeliness_is_rated"
                            >mdi-check</v-icon
                          >
                          <v-chip
                            x-small
                            class="pa-1"
                            v-if="!item.timeliness_is_rated"
                            >NR</v-chip
                          >
                        </div>
                      </div>
                    </div>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-card>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-5" v-if="approval == 1">
          <v-spacer></v-spacer>

          <v-btn color="red" outlined @click="pending()">
            pending
          </v-btn>

          <v-btn color="#519043" class="white--text" @click="approve()">
            approve
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="confirmSubmitDialog" persistent max-width="390">
      <v-card color="white">
        <div class="pa-4 #3a3b3a--text">
          <div class="text-h6 mb-1">WARNING!</div>
          <div class="text-body-1 mb-1">
            <p style="text-align: justify">
              <v-icon class="mt-n2" color="white">mdi-alert</v-icon> &nbsp; Are
              you sure you want to <b>{{ approvalAction }}</b> this
              <b>IPCR Targets </b>?<br />
              <!-- Please note that
              <b>this action is irreversible.</b> -->
            </p>
          </div>
        </div>

        <!-- <v-card-title class="text-h5">
          Are you sure you want to proceed?
        </v-card-title> -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="confirmBtnLoading"
            color="red"
            outlined
            @click="cancelConfirm()"
          >
            Close
          </v-btn>
          <v-btn
            :disabled="confirmBtnLoading"
            :loading="confirmBtnLoading"
            color="green"
            class="white--text"
            @click="confirmSubmit()"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- remarks dialog -->
    <v-dialog v-model="addRemarksDialog" persistent max-width="600">
      <v-card color="white">
        <v-form ref="RemarksFormref" @submit.prevent>
          <v-card-title dark class="dialog-header pt-2 pb-2 pl-6">
            <span> </span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="closeRemarksDialog()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 400px" class="my-4"> </v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <div class="text-h6">
                  {{
                    approvalAction == "APPROVE"
                      ? "Add Comments and Recommendations for Development Purposes"
                      : "Add Remarks"
                  }}
                </div>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="remarksMsg"
                  :rules="[formRules.required]"
                  dense
                  placeholder="Type here..."
                  outlined
                  rows="5"
                  required
                  class="rounded-lg"
                  color="#6DB249"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" outlined @click="closeRemarksDialog()">
              Close
            </v-btn>
            <v-btn
              v-if="approvalAction == 'APPROVE'"
              color="green"
              :disabled="isSubmitLoading"
              :loading="isSubmitLoading"
              class="white--text"
              @click="saveApprovalRemarks()"
            >
              Save
            </v-btn>
            <v-btn
              v-if="approvalAction == 'PENDING'"
              color="green"
              :disabled="isSubmitLoading"
              :loading="isSubmitLoading"
              class="white--text"
              @click="savePendingRemarks()"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- <MPORDialog :data="mporData" :action="action" /> -->
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
  components: {},
  props: {
    data: null,
    approval: null,
  },
  data() {
    return {
      remarksData: [],
      confirmBtnLoading: false,
      confirmSubmitDialog: false,
      confirmDialog: false,
      user_detailID: null,
      approvalAction: null,
      assesed_by_status: null,
      remarksMsg: null,
      addRemarksDialog: false,
      itemToDelete: null,
      options: {},
      action: null,
      fadeAwayMessage: {
        show: false,
        type: "success",
        header: "Successfully Added!",
        message: "",
        top: 10,
      },
      mporData: [],
      dialog: false,
      activeTab: { id: 1, name: "Core Functions" },
      tab: 1,
      tabList: [
        { id: 1, name: "Core Functions" },
        { id: 2, name: "Strategic Priority" },
        { id: 3, name: "Support Functions" },
      ],
      target_rating: null,
      ipcrData: null,
      ipcrSupData: null,
      isSubmitted: null,
      isSubmitLoading: false,
      assessed_by: null,
      assessed_by_status: null,
      final_rating_by: null,
      final_rating_by_status: null,
      id: null,
      dataItem: [],
      isButtonLoading: false,
      headers: [
        {
          text: "MFO",
          value: "mfo",
          align: "start",
          valign: "start",
          sortable: false,
        },
        {
          text: "Success Indicator",
          value: "success_indicator",
          align: "start",
          valign: "start",
          sortable: false,
        },
      ],
      support_headers: [
        {
          text: "Type",
          value: "type",

          align: "start",
          valign: "start",
          sortable: false,
        },
        {
          text: "Success Indicator",
          value: "success_indicator",
          align: "start",

          valign: "center",
          sortable: false,
        },
        {
          text: "Actual Accomplishment",
          value: "actual_accom",
          align: "start",

          valign: "center",
          sortable: false,
        },
      ],
    };
  },
  watch: {
    data: {
      handler(data) {
        console.log("ss", data);
        this.dialog = true;
        this.user_detailID = data.user_detailID;
        this.activeTab = { id: 1, name: "Core Functions" };
        this.target_rating = data;
        this.tab = 1;
        this.initialize();
      },
      deep: true,
    },
    options: {
      handler() {
        this.initialize();
      },
      deep: true,
    },
  },

  methods: {
    initialize() {
      this.loading = true;

      if (this.tab != 3) {
        this.axiosCall(
          "/ipcr-target/getMyIPCRTarget/" +
            this.target_rating.ipcr_ID +
            "/" +
            this.tab,
          "GET"
        ).then((res) => {
          if (res) {
            this.isSubmitted = res.data.target_rating.isSubmitted;
            this.dataItem = res.data.targets;
            this.loading = false;
          }
        });
      } else {
        this.axiosCall(
          "/ipcr-target/getEmployeeIPCRSupportTarget/" +
            this.target_rating.ipcr_ID +
            "/" +
            this.user_detailID,
          "GET"
        ).then((res) => {
          if (res) {
            if (res.data.status == 200) {
              console.log("hehehe", res.data.targets);
              this.dataItem = res.data.targets;
            } else {
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "error";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
            }

            this.loading = false;
          }
        });
      }

      //load signatory
      this.axiosCall(
        "/ipcr/getIPCRApproverNames/" + this.target_rating.ipcr_ID + "/TARGET",
        "GET"
      ).then((res) => {
        if (res) {
          this.assessed_by = this.toTitleCase(res.data.assessed_by_name);
          this.assessed_by_status = res.data.assesed_by_status;
          // this.final_rating_by = this.toTitleCase(
          //   res.data.final_rating_by_name
          // );
          // this.final_rating_by_status = res.data.final_rating_by_status;
        }
      });
    },

    closeRemarksDialog() {
      this.confirmBtnLoading = false;
      this.addRemarksDialog = false;
    },

    approve() {
      this.approvalAction = "APPROVE";
      this.confirmSubmitDialog = true;
    },

    pending() {
      this.approvalAction = "PENDING";
      this.confirmSubmitDialog = true;
    },

    closeD() {
      this.eventHub.$emit("closeViewIPCRTargetApprovalDialog", false);
      this.addRemarksDialog = false;
      this.confirmSubmitDialog = false;
      this.confirmBtnLoading = false;
      this.isSubmitLoading = false;
      this.dialog = false;
    },
    edit(item) {
      if (this.tab != 3) {
        this.ipcrData = item;
        this.action = "Update";
      } else {
        this.ipcrSupData = item;
        this.action = "Update";
      }
    },
    submitTarget() {
      this.confirmSubmitDialog = true;
    },

    confirmSubmit() {
      this.confirmBtnLoading = true;
      this.addRemarksDialog = true;
    },

    saveApprovalRemarks() {
      this.confirmSubmitDialog = false;
      this.confirmBtnLoading = true;
      this.isSubmitLoading = true;
      if (this.$refs.RemarksFormref.validate()) {
        let data = {
          remarks: this.remarksMsg,
          targetRatingID: this.target_rating.id,
        };
        this.axiosCall("/ipcr-target/approveTargets", "POST", data).then(
          (res) => {
            if (res.data.status == 200) {
              this.confirmBtnLoading = false;
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
          }
        );
      }
    },

    savePendingRemarks() {
      this.confirmSubmitDialog = false;
      this.confirmBtnLoading = true;
      // this.isSubmitLoading = true;
      if (this.$refs.RemarksFormref.validate()) {
        let data = {
          remarks: this.remarksMsg,
          targetRatingID: this.target_rating.id,
        };
        this.axiosCall("/ipcr-target/pendingTargets", "POST", data).then(
          (res) => {
            if (res.data.status == 200) {
              this.confirmBtnLoading = false;
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
          }
        );
      }
    },

    cancelConfirm() {
      this.approvalAction = null;
      this.confirmSubmitDialog = false;
    },

    changeTab(tab) {
      this.activeTab = tab;
      this.tab = tab.id;
      this.initialize();
    },

    cancelDelete() {
      this.itemToDelete = null;
      this.confirmDialog = false;
    },
  },
};
</script>
<style scoped></style>
