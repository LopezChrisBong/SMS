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
          <span>Targets </span>
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
              <v-col cols="2" class="d-flex justify-end mt-2 mr-2">
                <v-btn
                  v-if="shouldSubmit()"
                  @click="tab != 3 ? AddFunction() : AddSupportFunction()"
                  class="white--text rounded-lg"
                  color="#519043"
                >
                  Add
                </v-btn>
              </v-col>
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

                  <template
                    v-if="shouldSubmit()"
                    v-slot:[`item.action`]="{ item }"
                  >
                    <v-btn
                      v-if="
                        tab != 3 ||
                          (item.type && item.type == 'Intervening Function')
                      "
                      block
                      x-small
                      @click="edit(item)"
                      outlined
                      color="#519043"
                      >Update</v-btn
                    >
                    <v-btn
                      v-if="
                        tab != 3 ||
                          (item.type && item.type == 'Intervening Function')
                      "
                      x-small
                      class="mt-1"
                      @click="deleteItem(item)"
                      outlined
                      color="red"
                      block
                      >Delete</v-btn
                    >
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
            <v-row v-if="isSubmitted && assessed_by_status == 2">
              <v-col cols="12">
                <v-divider></v-divider>
                <div class="pa-3">
                  <div class="text-h6">
                    Comments and Recommendations for Development Purposes:
                  </div>
                  <div class="text-justify text-subtitle-1">
                    {{ targetRating.comments }}
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-5">
          <v-fab-transition v-if="isSubmitted">
            <v-menu top>
              <template v-slot:activator="{ on }">
                <v-btn color="#519043" left outlined v-on="on">
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

          <v-btn color="red" outlined @click="closeD()">
            <v-icon>mdi-close-circle-outline</v-icon>
            Close
          </v-btn>

          <v-btn
            v-if="shouldSubmit()"
            color="#519043"
            class="white--text"
            @click="submitTarget()"
          >
            <v-icon>mdi-check-circle</v-icon>
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
          <v-btn
            :disabled="isButtonLoading"
            :loading="isButtonLoading"
            color="green"
            class="white--text"
            @click="confirmDelete()"
          >
            Confirm
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
              you sure you want to submit this
              <b>Targets for Approval</b>?<br />
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
    <IPCRFunctionDialog
      :data="ipcrData"
      :action="action"
      :target_type="tab"
      :ipcrID="id"
    />
    <UpdateSupportFunctionDialog
      :data="ipcrSupData"
      :action="action"
      :ipcrID="id"
    />

    <AddIPCRSupportUtilDialog
      :moduleFrom="'Employee'"
      :data="ipcrSupport"
      :action="action"
      :ipcrID="id"
    />

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
  components: {
    // CoreTimeDesignationDialog: () =>
    //   import("../../components/Dialogs/Forms/CoreTimeDesignationDialog.vue"),
    IPCRFunctionDialog: () => import("../Forms/IPCRFunctionDialog.vue"),
    UpdateSupportFunctionDialog: () =>
      import("../Forms/UpdateSupportFunctionDialog.vue"),
    AddIPCRSupportUtilDialog: () =>
      import("../Forms/AddIPCRSupportUtilDialog.vue"),
  },
  props: {
    data: null,
  },
  data() {
    return {
      remarksData: [],
      confirmBtnLoading: false,
      confirmSubmitDialog: false,
      confirmDialog: false,
      itemToDelete: null,
      assesed_by_status: null,
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
      ipcrData: null,
      ipcrSupData: null,
      isSubmitted: null,
      targetRating: null,
      isSubmitLoading: false,
      assessed_by: null,
      assessed_by_status: null,
      final_rating_by: null,
      final_rating_by_status: null,
      id: null,
      ipcrSupport: null,
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
          text: "Efficiency",
          value: "efficiency",
          align: "center",
          valign: "center",
          sortable: false,
        },
        {
          text: "Quality",
          value: "quality",
          align: "center",
          valign: "center",
          sortable: false,
        },
        {
          text: "Timeliness",
          value: "timeliness",
          align: "center",
          valign: "center",
          sortable: false,
        },

        {
          text: "To be Rated",
          value: "eqt",
          align: "center",
          valign: "center",
          sortable: false,
        },
        {
          text: "Action",
          value: "action",
          align: "end",
        },
      ],
      support_headers: [
        {
          text: "Type",
          value: "type",
          width: 200,
          align: "start",
          valign: "start",
          sortable: false,
        },
        {
          text: "Success Indicator",
          value: "success_indicator",
          align: "center",
          width: 300,
          valign: "center",
          sortable: false,
        },
        {
          text: "Actual Accomplishment",
          value: "actual_accom",
          align: "center",

          valign: "center",
          sortable: false,
        },

        {
          text: "To be Rated",
          value: "eqt",
          align: "center",
          valign: "center",
          sortable: false,
        },
        {
          text: "Action",
          value: "action",
          align: "end",
        },
      ],
    };
  },

  watch: {
    data: {
      handler(data) {
        this.dialog = true;
        this.activeTab = { id: 1, name: "Core Functions" };
        console.log(data);
        this.id = data.id;
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
  mounted() {
    this.eventHub.$on("closeIPCRFunctionDialog", () => {
      this.initialize();
    });
    this.eventHub.$on("closePerformanceEvaluationDialog", () => {
      this.initialize();
    });
    this.eventHub.$on("closeMPORDialog", () => {
      this.initialize();
    });
    this.eventHub.$on("closeUpdateSupportFunctionDialog", () => {
      this.initialize();
    });
    this.eventHub.$on("closeAddIPCRSupportUtilDialog", () => {
      this.initialize();
    });
  },

  beforeDestroy() {
    this.eventHub.$off("closeIPCRFunctionDialog");
    this.eventHub.$off("closeAddIPCRSupportUtilDialog");
    this.eventHub.$off("closePerformanceEvaluationDialog");
    this.eventHub.$off("closeMPORDialog");
    this.eventHub.$off("closeUpdateSupportFunctionDialog");
  },

  methods: {
    initialize() {
      this.loading = true;
      this.loadRemarks(this.id);
      console.log("TAB", this.tab);
      if (this.tab != 3) {
        this.axiosCall(
          "/ipcr-target/getMyIPCRTarget/" + this.id + "/" + this.tab,
          "GET"
        ).then((res) => {
          if (res) {
            console.log("TTTTT", res.data);
            this.targetRating = res.data.target_rating;
            this.isSubmitted = res.data.target_rating.isSubmitted;
            this.dataItem = res.data.targets;
            this.loading = false;
          }
        });
      } else {
        this.axiosCall(
          "/ipcr-target/getMyIPCRSupportInterveningFunctionTarget/" + this.id,
          "GET"
        ).then((res) => {
          if (res) {
            console.log("asdsss", res.data);
            if (res.data.status == 200) {
              this.targetRating = res.data.target_rating;
              this.isSubmitted = res.data.target_rating
                ? res.data.target_rating.isSubmitted
                : null;
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
        "/ipcr/getIPCRApproverNames/" + this.id + "/TARGET",
        "GET"
      ).then((res) => {
        if (res) {
          console.log("earas", res.data);
          this.assessed_by = this.toTitleCase(res.data.assessed_by_name);
          this.assessed_by_status = res.data.assesed_by_status;
          // this.final_rating_by = this.toTitleCase(
          //   res.data.final_rating_by_name
          // );
          // this.final_rating_by_status = res.data.final_rating_by_status;
        }
      });
    },

    shouldSubmit() {
      if (this.isSubmitted == 0) {
        return true;
      } else {
        if (this.assessed_by_status == 1 || this.assessed_by_status == 2) {
          return false;
        } else {
          return true;
        }
      }
    },

    loadRemarks(id) {
      if (id) {
        this.axiosCall("/remarks/" + id + "/IPCR_TARGET", "GET").then((res) => {
          if (res.data) {
            console.log("remarks", res.data);
            this.remarksData = res.data;
          }
        });
      }
    },
    closeD() {
      this.eventHub.$emit("closeViewIPCRFunctionDialog", false);
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
      // this.isSubmitLoading = true;
      this.axiosCall("/ipcr-target/submitMyTargets/" + this.id, "PATCH").then(
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
    },

    cancelConfirm() {
      this.confirmSubmitDialog = false;
    },

    AddFunction() {
      this.ipcrData = { id: null };
      this.action = "Add";
    },

    AddSupportFunction() {
      this.ipcrSupport = { id: null };
      this.action = "Add";
    },

    changeTab(tab) {
      this.activeTab = tab;
      this.tab = tab.id;
      this.initialize();
    },
    deleteItem(item) {
      this.itemToDelete = item;
      this.confirmDialog = true;
    },
    cancelDelete() {
      this.itemToDelete = null;
      this.confirmDialog = false;
    },

    confirmDelete() {
      this.isButtonLoading = true;
      this.axiosCall(
        "/ipcr-target/deleteTarget/" + this.itemToDelete.id,
        "DELETE"
      ).then((res) => {
        if (res.data.status == 200) {
          this.confirmDialog = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
          this.isButtonLoading = false;
          this.itemToDelete = null;
          this.confirmDialog = false;

          this.initialize();
        } else {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
          this.isButtonLoading = false;
        }
      });
    },
  },
};
</script>
<style scoped></style>
