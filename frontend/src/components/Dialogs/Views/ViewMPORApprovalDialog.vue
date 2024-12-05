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
      <v-form ref="CoreTimeFormref" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span
              >{{ data.name }}'s MPOR for the Month of
              {{ monthSelection3[data.mnth - 1].name + " " + data.year }}
            </span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="closeD()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 700px" class="my-4">
            <v-card>
              <v-row>
                <v-col cols="8" class="flex-items mt-2">
                  <v-tabs v-model="activeTab" color="#5a67da" align-tabs="left">
                    <v-tab
                      v-for="tab in tabList"
                      :key="tab.id"
                      @click="changeTab(tab)"
                      >{{ tab.name }}</v-tab
                    >
                  </v-tabs>
                </v-col>
                <v-spacer></v-spacer>
                <!-- <v-col cols="2" class="d-flex justify-end mt-2 mr-2">
                  <v-autocomplete
                    @change="changeMPOR()"
                    v-model="selectedMonth"
                    dense
                    outlined
                    class="rounded-lg"
                    item-text="name"
                    item-value="id"
                    label="Month"
                    color="#93CB5B"
                    :items="monthsList"
                  ></v-autocomplete>
                </v-col> -->
                <v-col cols="12" class=" pt-2 px-4">
                  <v-data-table
                    :expanded.sync="expanded"
                    :headers="headers"
                    :items="dataItem"
                    :items-per-page="20"
                    show-expand
                  >
                    <template v-slot:[`item.suc_ind`]="{ item }">
                      <div class="text-justify">
                        {{ getItemSuccessIndicator(item) }}
                      </div>
                    </template>
                    <template v-slot:[`item.efficiency`]="{ item }">
                      {{ item.mpor ? getTotal("E", item) : "" }}
                    </template>
                    <template v-slot:[`item.quality`]="{ item }">
                      {{ item.mpor ? getTotal("Q", item) : "" }}
                    </template>
                    <template v-slot:[`item.timeliness`]="{ item }">
                      {{ item.mpor ? getTotal("T", item) : "" }}
                    </template>
                    <template v-slot:[`item.remarks`]="{ item }">
                      {{ item.mpor ? item.mpor.remarks : "" }}
                    </template>

                    <template v-slot:expanded-item="{ headers, item }">
                      <td :colspan="headers.length" class="pa-4">
                        <table id="tbl_expanded">
                          <tr>
                            <th
                              class="text-caption font-weight-bold"
                              colspan="5"
                              style="width:33%"
                            >
                              Efficiency
                            </th>
                            <th
                              class="text-caption font-weight-bold"
                              colspan="5"
                              style="width:33%"
                            >
                              Quality
                            </th>
                            <th
                              class="text-caption font-weight-bold"
                              colspan="5"
                              style="width:33%"
                            >
                              Timeliness
                            </th>
                          </tr>
                          <tr>
                            <td
                              align="center"
                              class="text-caption font-weight-bold "
                            >
                              Week 1
                            </td>
                            <td
                              align="center"
                              class="text-caption font-weight-bold"
                            >
                              Week 2
                            </td>
                            <td
                              align="center"
                              class="text-caption font-weight-bold"
                            >
                              Week 3
                            </td>
                            <td
                              align="center"
                              class="text-caption font-weight-bold"
                            >
                              Week 4
                            </td>
                            <td
                              align="center"
                              class="text-caption font-weight-bold"
                            >
                              Total
                            </td>
                            <td
                              align="center"
                              class="text-caption font-weight-bold"
                            >
                              Week 1
                            </td>
                            <td
                              align="center"
                              class="text-caption font-weight-bold"
                            >
                              Week 2
                            </td>
                            <td
                              align="center"
                              class="text-caption font-weight-bold"
                            >
                              Week 3
                            </td>
                            <td
                              align="center"
                              class="text-caption font-weight-bold"
                            >
                              Week 4
                            </td>
                            <td
                              align="center"
                              class="text-caption font-weight-bold"
                            >
                              Total
                            </td>
                            <td
                              align="center"
                              class="text-caption font-weight-bold"
                            >
                              Week 1
                            </td>
                            <td
                              align="center"
                              class="text-caption font-weight-bold"
                            >
                              Week 2
                            </td>
                            <td
                              align="center"
                              class="text-caption font-weight-bold"
                            >
                              Week 3
                            </td>
                            <td
                              align="center"
                              class="text-caption font-weight-bold"
                            >
                              Week 4
                            </td>
                            <td
                              align="center"
                              class="text-caption font-weight-bold"
                            >
                              Total
                            </td>
                          </tr>

                          <tbody>
                            <tr>
                              <td
                                :colspan="!item.eff_is_rated ? 5 : 1"
                                align="center"
                                class="text-caption"
                              >
                                {{
                                  !item.eff_is_rated
                                    ? "Not to be Rated"
                                    : item.mpor.e_w1
                                }}
                              </td>
                              <td
                                v-if="item.eff_is_rated"
                                align="center"
                                class="text-caption"
                              >
                                {{ item.mpor.e_w2 }}
                              </td>
                              <td
                                v-if="item.eff_is_rated"
                                align="center"
                                class="text-caption"
                              >
                                {{ item.mpor.e_w3 }}
                              </td>
                              <td
                                v-if="item.eff_is_rated"
                                align="center"
                                class="text-caption"
                              >
                                {{ item.mpor.e_w4 }}
                              </td>
                              <td
                                v-if="item.eff_is_rated"
                                align="center"
                                class="text-caption"
                              >
                                {{ getTotal("E", item) }}
                              </td>
                              <td
                                :colspan="!item.qly_is_rated ? 5 : 1"
                                align="center"
                                class="text-caption"
                              >
                                {{
                                  !item.qly_is_rated
                                    ? "Not to be Rated"
                                    : item.mpor.q_w1
                                }}
                              </td>
                              <td
                                v-if="item.qly_is_rated"
                                align="center"
                                class="text-caption"
                              >
                                {{ item.mpor.q_w2 }}
                              </td>
                              <td
                                v-if="item.qly_is_rated"
                                align="center"
                                class="text-caption"
                              >
                                {{ item.mpor.q_w3 }}
                              </td>
                              <td
                                v-if="item.qly_is_rated"
                                align="center"
                                class="text-caption"
                              >
                                {{ item.mpor.q_w4 }}
                              </td>
                              <td
                                v-if="item.qly_is_rated"
                                align="center"
                                class="text-caption"
                              >
                                {{ getTotal("Q", item) }}
                              </td>
                              <td
                                :colspan="!item.timeliness_is_rated ? 5 : 1"
                                align="center"
                                class="text-caption"
                              >
                                {{
                                  !item.timeliness_is_rated
                                    ? "Not to be Rated"
                                    : item.mpor.t_w1
                                }}
                              </td>
                              <td
                                v-if="item.timeliness_is_rated"
                                align="center"
                                class="text-caption"
                              >
                                {{ item.mpor.t_w2 }}
                              </td>
                              <td
                                v-if="item.timeliness_is_rated"
                                align="center"
                                class="text-caption"
                              >
                                {{ item.mpor.t_w3 }}
                              </td>
                              <td
                                v-if="item.timeliness_is_rated"
                                align="center"
                                class="text-caption"
                              >
                                {{ item.mpor.t_w4 }}
                              </td>
                              <td
                                v-if="item.timeliness_is_rated"
                                align="center"
                                class="text-caption"
                              >
                                {{ getTotal("T", item) }}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-card>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="pa-5">
            <v-spacer></v-spacer>
            <v-btn
              v-if="action == 'approval'"
              color="red"
              class="white--text"
              @click="pending()"
              :disabled="isloading"
              :loading="isloading"
            >
              Pending
            </v-btn>
            <v-btn
              v-if="action == 'approval'"
              color="#5a67da"
              class="white--text"
              @click="approve()"
              :disabled="isloading"
              :loading="isloading"
            >
              Approve
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <v-dialog v-model="confirmDialog" persistent max-width="390">
      <v-card color="white">
        <div class="pa-4 #3a3b3a--text">
          <div class="text-h6 mb-1">WARNING!</div>
          <div class="text-body-1 mb-1">
            <v-icon class="mt-n2" color="white">mdi-alert</v-icon> &nbsp;
            <div v-html="confirmMsg"></div>
          </div>
        </div>

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
            v-if="approvalAction == 'APPROVE'"
            :disabled="confirmBtnLoading"
            :loading="confirmBtnLoading"
            color="green"
            class="white--text"
            @click="openRemarksDialog()"
          >
            Confirm
          </v-btn>
          <v-btn
            v-if="approvalAction == 'PENDING'"
            :disabled="confirmBtnLoading"
            :loading="confirmBtnLoading"
            color="green"
            class="white--text"
            @click="openRemarksDialog()"
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
            <span
              >{{
                approvalAction == "APPROVE"
                  ? "Add Observation and Remarks"
                  : "Add Remarks"
              }}
            </span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="addRemarksDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 400px" class="my-4"> </v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-textarea
                  v-model="remarksMsg"
                  :rules="[formRules.required]"
                  dense
                  placeholder="Type remarks here..."
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
            <v-btn color="red" outlined @click="addRemarksDialog = false">
              Close
            </v-btn>
            <v-btn
              v-if="approvalAction == 'APPROVE'"
              color="green"
              class="white--text"
              @click="confirmSubmit()"
            >
              Save
            </v-btn>
            <v-btn
              v-if="approvalAction == 'PENDING'"
              color="green"
              class="white--text"
              @click="savePendingRemarks()"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <MPOROutputDialog :data="mporData" />
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
    MPOROutputDialog: () => import("../Forms/MPOROutputDialog.vue"),
  },
  props: {
    data: null,
    action: null,
  },
  data() {
    return {
      isloading: null,
      confirmDialog: false,
      confirmMsg: null,
      confirmBtnLoading: false,
      approvalAction: null,
      addRemarksDialog: false,
      remarksMsg: null,
      loading: false,
      fadeAwayMessage: {
        show: false,
        type: "success",
        header: "Successfully Added!",
        message: "",
        top: 10,
      },
      options: {},

      expanded: [],
      dialog: false,
      activeTab: { id: 1, name: "Core Functions" },
      tab: 1,
      tabList: [
        { id: 1, name: "Core Functions" },
        { id: 2, name: "Strategic Priority" },
        // { id: 3, name: "Support Functions" },
      ],
      mporData: null,
      ipcrID: null,
      mnth: null,
      year: null,
      dataItem: [],
      monthsList: [],
      monthSelection1: [
        {
          id: 1,
          name: "January",
        },
        {
          id: 2,
          name: "February",
        },
        {
          id: 3,
          name: "March",
        },
        {
          id: 4,
          name: "April",
        },
        {
          id: 5,
          name: "May",
        },
        {
          id: 6,
          name: "June",
        },
      ],
      monthSelection2: [
        {
          id: 7,
          name: "July",
        },
        {
          id: 8,
          name: "August",
        },
        {
          id: 9,
          name: "September",
        },
        {
          id: 10,
          name: "October",
        },
        {
          id: 11,
          name: "November",
        },
        {
          id: 12,
          name: "December",
        },
      ],
      monthSelection3: [
        {
          id: 1,
          name: "January",
        },
        {
          id: 2,
          name: "February",
        },
        {
          id: 3,
          name: "March",
        },
        {
          id: 4,
          name: "April",
        },
        {
          id: 5,
          name: "May",
        },
        {
          id: 6,
          name: "June",
        },
        {
          id: 7,
          name: "July",
        },
        {
          id: 8,
          name: "August",
        },
        {
          id: 9,
          name: "September",
        },
        {
          id: 10,
          name: "October",
        },
        {
          id: 11,
          name: "November",
        },
        {
          id: 12,
          name: "December",
        },
      ],
      selectedMonth: null,
      headers: [
        {
          text: "MFO",
          value: "mfo",
          align: "start",
          valign: "start",
          width: 200,
          sortable: false,
        },
        {
          text: "Success Indicators",
          value: "suc_ind",
          align: "center",
          valign: "center",
          width: 200,
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
          text: "Remarks",
          value: "remarks",
          align: "center",
          valign: "center",
          width: 200,
          sortable: false,
        },
        // {
        //   text: "Action",
        //   value: "action",
        //   align: "end",
        //   width: 100,
        //   valign: "center",
        //   sortable: false,
        // },
      ],
    };
  },
  computed: {
    getIsSubmitted() {
      let toReturn = false;
      let submit = [];
      let approval = [];
      if (this.dataItem && this.dataItem.length > 0) {
        for (let i = 0; i < this.dataItem.length; i++) {
          submit.push(this.dataItem[i].mpor.isSubmitted);
          approval.push(this.dataItem[i].mpor.head_approval_status);
        }

        if (
          submit.includes(0) &&
          (approval.includes(1) || approval.includes(3))
        ) {
          toReturn = false;
        }

        if (
          !submit.includes(0) &&
          !(approval.includes(1) || approval.includes(3))
        ) {
          toReturn = true;
        }
      } else {
        toReturn = false;
      }
      return toReturn;
    },
  },
  watch: {
    data: {
      handler(data) {
        this.approvalAction = null;
        this.remarksMsg = null;
        this.tab = 1;
        this.dialog = true;
        this.activeTab = { id: 1, name: "Core Functions" };
        this.selectedMonth = 1;
        this.ipcrID = data.ipcr_ID;
        this.mnth = data.mnth;
        this.year = data.year;

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
    this.eventHub.$on("closeViewMPORApprovalDialog", () => {
      this.initialize();
    });
  },

  beforeDestroy() {
    this.eventHub.$off("closeMPOROutputDialog");
  },
  methods: {
    initialize() {
      this.loading = true;
      this.axiosCall(
        "/ipcr-mpor/getMPORtoApprove/" +
          this.ipcrID +
          "/" +
          this.tab +
          "/" +
          this.mnth,
        "GET"
      ).then((res) => {
        if (res) {
          console.log("MPOR", res.data);
          this.dataItem = res.data;
          this.loading = false;
        }
      });
    },
    changeMPOR() {
      this.initialize();
    },
    getItemSuccessIndicator(item) {
      return item.efficiency_type == "percentage"
        ? item.efficiency +
            "%" +
            " " +
            item.mfo +
            " " +
            item.quality +
            " " +
            item.timeliness
        : item.efficiency +
            " " +
            item.mfo +
            " " +
            item.quality +
            " " +
            item.timeliness;
    },
    getTotal(field, item) {
      if (item) {
        let i = item.mpor;

        if (field == "E") {
          let total = 0;
          if (item.eff_is_rated) {
            total += i ? (i.e_w1 ? i.e_w1 : 0) : 0;
            total += i ? (i.e_w2 ? i.e_w2 : 0) : 0;
            total += i ? (i.e_w3 ? i.e_w3 : 0) : 0;
            total += i ? (i.e_w4 ? i.e_w4 : 0) : 0;
            return total;
          } else {
            return "Not to be Rated";
          }
        } else if (field == "Q") {
          let total = 0;
          if (item.qly_is_rated) {
            total += i ? (i.q_w1 ? i.q_w1 : 0) : 0;
            total += i ? (i.q_w2 ? i.q_w2 : 0) : 0;
            total += i ? (i.q_w3 ? i.q_w3 : 0) : 0;
            total += i ? (i.q_w4 ? i.q_w4 : 0) : 0;
            return total;
          } else {
            return "Not to be Rated";
          }
        } else if (field == "T") {
          let total = 0;
          if (item.timeliness_is_rated) {
            total += i ? (i.t_w1 ? i.t_w1 : 0) : 0;
            total += i ? (i.t_w2 ? i.t_w2 : 0) : 0;
            total += i ? (i.t_w3 ? i.t_w3 : 0) : 0;
            total += i ? (i.t_w4 ? i.t_w4 : 0) : 0;
            return total;
          } else {
            return "Not to be Rated";
          }
        }
      }
    },
    closeD() {
      this.addRemarksDialog = false;
      this.confirmDialog = false;
      this.dialog = false;
      this.eventHub.$emit("closeViewMPORApprovalDialog", false);
    },

    changeTab(tab) {
      this.activeTab = tab;
      this.tab = tab.id;
      this.initialize();
    },
    approve() {
      this.approvalAction = "APPROVE";
      this.confirmMsg =
        "<p>Are you sure you want to <b>APPROVE</b> this MPOR</p>";
      this.confirmDialog = true;
    },
    pending() {
      this.approvalAction = "PENDING";
      this.confirmMsg =
        "<p>Are you sure you want to <b>PENDING</b> this MPOR</p>";
      this.confirmDialog = true;
    },
    cancelConfirm() {
      this.confirmDialog = false;
    },
    openRemarksDialog() {
      this.remarksMsg = null;
      this.confirmDialog = false;
      this.addRemarksDialog = true;
    },
    confirmSubmit() {
      this.confirmDialog = false;
      if (this.$refs.RemarksFormref.validate()) {
        let data = {
          ipcrID: this.ipcrID,
          mnth: this.mnth,
          year: this.year,
          remarks: this.remarksMsg,
        };
        this.axiosCall("/ipcr-mpor/approve", "POST", data).then((res) => {
          if (res) {
            if (res.data.status == 200) {
              this.confirmDialog = false;
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
        });
      }
    },
    savePendingRemarks() {
      if (this.$refs.RemarksFormref.validate()) {
        let data = {
          ipcrID: this.ipcrID,
          mnth: this.mnth,
          year: this.year,
          remarks: this.remarksMsg,
        };
        this.axiosCall("/ipcr-mpor/pending", "POST", data).then((res) => {
          if (res) {
            if (res.data.status == 200) {
              this.confirmDialog = false;
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
        });
      }
    },
  },
};
</script>
<style scoped>
#tbl_expanded {
  border-collapse: collapse;
  width: 100%;
  padding: 5px;
}
#tbl_expanded table,
#tbl_expanded th,
#tbl_expanded td {
  border: 2px solid grey;
}
</style>
