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
      <v-form ref="MPORSummary" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span
              >Summary of Accomplishment ({{ monthRange }})
              {{ isSubmitted }}</span
            >
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

                <v-col cols="12" class=" pt-2 px-4">
                  <v-data-table
                    :expanded.sync="expanded"
                    :headers="tab != 3 ? headers : headers1"
                    :items="dataItem"
                    :items-per-page="20"
                    show-expand
                  >
                    <template
                      v-if="tab != 3"
                      v-slot:[`item.suc_ind`]="{ item }"
                    >
                      {{ getItemSuccessIndicator(item) }}
                    </template>
                    <template
                      v-if="tab != 3"
                      v-slot:[`item.efficiency`]="{ item }"
                    >
                      {{ item.eff_is_rated ? item.e_total : "Not to be Rated" }}
                    </template>
                    <template
                      v-if="tab != 3"
                      v-slot:[`item.quality`]="{ item }"
                    >
                      {{
                        item.qly_is_rated
                          ? item.q_total + " | " + item.q_avg
                          : "Not to be Rated"
                      }}
                    </template>
                    <template
                      v-if="tab != 3"
                      v-slot:[`item.timeliness`]="{ item }"
                    >
                      {{
                        item.timeliness_is_rated
                          ? item.t_total + " | " + item.t_avg
                          : "Not to be Rated"
                      }}
                    </template>
                    <template
                      v-if="tab == 3"
                      v-slot:[`item.success_indicator`]="{ item }"
                    >
                      {{ item.success_indicator }}
                    </template>
                    <template
                      v-if="tab == 3"
                      v-slot:[`item.supp_efficiency`]="{ item }"
                    >
                      {{
                        item.eff_is_rated ? item.efficiency : "Not to be Rated"
                      }}
                    </template>
                    <template
                      v-if="tab == 3"
                      v-slot:[`item.supp_quality`]="{ item }"
                    >
                      {{
                        item.qly_is_rated
                          ? item.quality
                            ? item.quality
                            : "" + " | " + item.q_avg
                            ? item.q_avg
                            : ""
                          : "Not to be Rated"
                      }}
                    </template>
                    <template
                      v-if="tab == 3"
                      v-slot:[`item.supp_timeliness`]="{ item }"
                    >
                      {{
                        item.timeliness_is_rated
                          ? item.timeliness
                            ? +item.timeliness
                            : "" + " | " + item.t_avg
                            ? item.t_avg
                            : ""
                          : "Not to be Rated"
                      }}
                    </template>
                    <template v-slot:expanded-item="{ headers, item }">
                      <td :colspan="headers.length" class="pa-4">
                        <table id="tbl_expanded">
                          <tr>
                            <th
                              class="text-caption font-weight-bold"
                              :colspan="e_span"
                              style="width:33%"
                            >
                              Efficiency
                            </th>
                            <th
                              class="text-caption font-weight-bold"
                              :colspan="qt_span"
                              style="width:33%"
                            >
                              Quality
                            </th>
                            <th
                              class="text-caption font-weight-bold"
                              :colspan="qt_span"
                              style="width:33%"
                            >
                              Timeliness
                            </th>
                          </tr>
                          <tr>
                            <td
                              v-for="(ii, i) in expandHeaders"
                              :key="i"
                              align="center"
                              class="text-caption font-weight-bold "
                            >
                              {{ ii }}
                            </td>
                          </tr>

                          <tbody>
                            <tr v-if="tab != 3">
                              <td
                                v-for="(summary, i) in item.mporSummary"
                                :key="i"
                                :colspan="summary.colspan"
                                align="center"
                                class="text-caption"
                              >
                                {{ summary.value }}
                              </td>
                            </tr>

                            <tr v-if="tab == 3">
                              <td
                                v-for="(summary, i) in item.supportSummary"
                                :key="i"
                                :colspan="summary.colspan"
                                align="center"
                                class="text-caption"
                              >
                                {{ summary.value }}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </template>
                    <!-- <template v-slot:[`item.action`]="{ item }">
                      <v-btn
                        x-small
                        @click="update(item)"
                        outlined
                        color="warning"
                        >Update</v-btn
                      >
                    </template> -->
                  </v-data-table>
                </v-col>
              </v-row>
              <v-row v-if="isSubmitted && assessed_by_status == 2">
                <v-col cols="12">
                  <v-divider></v-divider>
                  <div class="pa-3">
                    <div class="text-h6">
                      Observation and Remarks:
                    </div>
                    <div class="text-justify text-subtitle-1">
                      {{ summary.comments }}
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
                  <v-btn color="#5a67da" left outlined v-on="on">
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
                        color="#5a67da"
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
                        color="#5a67da"
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
            <v-btn
              v-if="shouldSubmit()"
              color="#5a67da"
              class="white--text"
              @click="submitSummary()"
            >
              <v-icon>mdi-check-circle</v-icon>
              Submit
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <v-dialog v-model="confirmSubmitDialog" persistent max-width="390">
      <v-card color="white">
        <div class="pa-4 #3a3b3a--text">
          <div class="text-h6 mb-1">WARNING!</div>
          <div class="text-body-1 mb-1">
            <p style="text-align: justify">
              <v-icon class="mt-n2" color="white">mdi-alert</v-icon> &nbsp; Are
              you sure you want to submit this
              <b>Summary for Approval</b>?<br />
            </p>
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
    <!-- <MPOROutputDialog :data="mporData" /> -->
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
    // MPOROutputDialog: () => import("../Forms/MPOROutputDialog.vue"),
  },
  props: {
    data: null,
  },
  data() {
    return {
      summary: null,
      remarksData: [],
      confirmBtnLoading: false,
      confirmSubmitDialog: false,
      confirmDialog: false,
      assesed_by_status: null,
      action: null,
      isloading: null,
      isSubmitted: null,
      targetRating: null,
      isSubmitLoading: false,
      assessed_by: null,
      assessed_by_status: null,
      final_rating_by: null,
      final_rating_by_status: null,
      fadeAwayMessage: {
        show: false,
        type: "success",
        header: "Successfully Added!",
        message: "",
        top: 10,
      },
      options: {},
      period: null,
      expanded: [],
      dialog: false,
      activeTab: { id: 1, name: "Core Functions" },
      tab: 1,
      tabList: [
        { id: 1, name: "Core Functions" },
        { id: 2, name: "Strategic Priority" },
        { id: 3, name: "Support Functions" },
      ],
      mporData: null,
      ipcr: null,
      expandHeaders: [],
      dataItem: [],
      monthsList: [],
      e_span: null,
      qt_span: null,
      monthSelection1: [
        {
          id: 1,
          name: "Jan",
        },
        {
          id: 2,
          name: "Feb",
        },
        {
          id: 3,
          name: "Mar",
        },
        {
          id: 4,
          name: "Apr",
        },
        {
          id: 5,
          name: "May",
        },
        {
          id: 6,
          name: "Jun",
        },
      ],
      monthSelection2: [
        {
          id: 7,
          name: "Jul",
        },
        {
          id: 8,
          name: "Aug",
        },
        {
          id: 9,
          name: "Sep",
        },
        {
          id: 10,
          name: "Oct",
        },
        {
          id: 11,
          name: "Nov",
        },
        {
          id: 12,
          name: "Dec",
        },
      ],
      monthSelection3: [
        {
          id: 1,
          name: "Jan",
        },
        {
          id: 2,
          name: "Feb",
        },
        {
          id: 3,
          name: "Mar",
        },
        {
          id: 4,
          name: "Apr",
        },
        {
          id: 5,
          name: "May",
        },
        {
          id: 6,
          name: "Jun",
        },
        {
          id: 7,
          name: "Jul",
        },
        {
          id: 8,
          name: "Aug",
        },
        {
          id: 9,
          name: "Sep",
        },
        {
          id: 10,
          name: "Oct",
        },
        {
          id: 11,
          name: "Nov",
        },
        {
          id: 12,
          name: "Dec",
        },
      ],
      monthRange: null,
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
          text: "E Total",
          value: "efficiency",
          align: "center",
          valign: "center",
          sortable: false,
        },
        {
          text: "Q Total | Avg",
          value: "quality",
          align: "center",
          valign: "center",
          sortable: false,
        },
        {
          text: "T Total | Avg",
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
      headers1: [
        {
          text: "MFO",
          value: "type",
          align: "start",
          valign: "start",
          width: 200,
          sortable: false,
        },
        {
          text: "Success Indicators",
          value: "success_indicator",
          align: "center",
          valign: "center",
          width: 200,
          sortable: false,
        },
        {
          text: "E Total",
          value: "supp_efficiency",
          align: "center",
          valign: "center",
          sortable: false,
        },
        {
          text: "Q Total | Avg",
          value: "supp_quality",
          align: "center",
          valign: "center",
          sortable: false,
        },
        {
          text: "T Total | Avg",
          value: "supp_timeliness",
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
      ],
    };
  },

  watch: {
    data: {
      handler(data) {
        // console.log("Data Summary", data);
        this.dialog = true;
        this.activeTab = { id: 1, name: "Core Functions" };
        this.expandHeaders = [];
        this.tab = 1;
        this.period = data.period;
        this.ipcr = data;
        if (data.period == 1) {
          this.monthRange =
            this.monthSelection1[0].name +
            " to " +
            this.monthSelection1[this.monthSelection1.length - 1].name +
            " " +
            data.year;
          this.e_span = this.monthSelection1.length + 1;
          this.qt_span = this.monthSelection1.length + 2;
          this.loadExpandHeaders(data.period);
        } else if (data.period == 2) {
          this.monthRange =
            this.monthSelection2[0].name +
            " to " +
            this.monthSelection2[this.monthSelection2.length - 1].name +
            " " +
            data.year;
          this.e_span = this.monthSelection2.length + 1;
          this.qt_span = this.monthSelection2.length + 2;
          this.loadExpandHeaders(data.period);
        } else if (data.period == 3) {
          this.monthRange =
            this.monthSelection3[0].name +
            " to " +
            this.monthSelection3[this.monthSelection3.length - 1].name +
            " " +
            data.year;
          this.e_span = this.monthSelection3.length + 1;
          this.qt_span = this.monthSelection3.length + 2;
          this.loadExpandHeaders(data.period);
        }

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
    this.eventHub.$on("closeMPOROutputDialog", () => {
      this.initialize();
    });
  },

  beforeDestroy() {
    this.eventHub.$off("closeMPOROutputDialog");
  },
  methods: {
    initialize() {
      this.loading = true;
      this.loadRemarks(this.ipcr.id);
      if (this.tab != 3) {
        if (this.ipcr) {
          this.axiosCall(
            "/ipcr-target/getMyIPCRTargetMPORSummary/" +
              this.ipcr.id +
              "/" +
              this.tab,
            "GET"
          ).then((res) => {
            if (res) {
              console.log("MPOR", res.data);
              this.dataItem = res.data.data;
              this.isSubmitted = res.data.summary.isSubmitted;
              this.summary = res.data.summary;
              this.loading = false;
            }
          });
        }
      } else {
        if (this.ipcr) {
          this.axiosCall(
            "/ipcr-target/getMyIPCRSupportSummary/" + this.ipcr.id,
            "GET"
          ).then((res) => {
            if (res) {
              console.log("MPOR SUPPORT", res.data);
              this.dataItem = res.data.data;
              this.isSubmitted = res.data.summary.isSubmitted;
              this.summary = res.data.summary;
              this.loading = false;
            }
          });
        }
      }

      //load signatory
      this.axiosCall(
        "/ipcr/getIPCRApproverNames/" + this.ipcr.id + "/SUMMARY",
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
    submitSummary() {
      this.confirmSubmitDialog = true;
    },
    changeMPOR() {
      this.initialize();
    },
    loadRemarks(id) {
      if (id) {
        this.axiosCall("/remarks/" + id + "/IPCR_SUMMARY", "GET").then(
          (res) => {
            if (res.data) {
              console.log("remarks", res.data);
              this.remarksData = res.data;
            }
          }
        );
      }
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
    cancelConfirm() {
      this.confirmSubmitDialog = false;
    },
    confirmSubmit() {
      this.confirmBtnLoading = true;
      // this.isSubmitLoading = true;
      this.axiosCall("/ipcr/submitMySummary/" + this.ipcr.id, "PATCH").then(
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

    loadExpandHeaders(period) {
      this.expandHeaders = [];
      if (this.tab != 3) {
        for (let i = 0; i < 3; i++) {
          if (period == 1) {
            this.e_span = this.monthSelection1.length + 1;
            this.qt_span = this.monthSelection1.length + 2;
            for (let j = 0; j < this.monthSelection1.length; j++) {
              this.expandHeaders.push(this.monthSelection1[j].name);
            }
            if (i == 0) {
              this.expandHeaders.push("Total");
            } else if (i > 0) {
              this.expandHeaders.push("Total");
              this.expandHeaders.push("AVE");
            }
          } else if (period == 2) {
            this.e_span = this.monthSelection2.length + 1;
            this.qt_span = this.monthSelection2.length + 2;
            for (let j = 0; j < this.monthSelection2.length; j++) {
              this.expandHeaders.push(this.monthSelection2[j].name);
            }
            if (i == 0) {
              this.expandHeaders.push("Total");
            } else if (i > 0) {
              this.expandHeaders.push("Total");
              this.expandHeaders.push("AVE");
            }
          } else if (period == 3) {
            this.e_span = this.monthSelection3.length + 1;
            this.qt_span = this.monthSelection3.length + 2;
            for (let j = 0; j < this.monthSelection3.length; j++) {
              this.expandHeaders.push(this.monthSelection3[j].name);
            }
            if (i == 0) {
              this.expandHeaders.push("Total");
            } else if (i > 0) {
              this.expandHeaders.push("Total");
              this.expandHeaders.push("AVE");
            }
          }
        }
      } else {
        for (let i = 0; i < 3; i++) {
          this.e_span = 1;
          this.qt_span = 2;
          if (period == 1) {
            if (i == 0) {
              this.expandHeaders.push("Total");
            } else if (i > 0) {
              this.expandHeaders.push("Total");
              this.expandHeaders.push("AVE");
            }
          } else if (period == 2) {
            if (i == 0) {
              this.expandHeaders.push("Total");
            } else if (i > 0) {
              this.expandHeaders.push("Total");
              this.expandHeaders.push("AVE");
            }
          } else if (period == 3) {
            if (i == 0) {
              this.expandHeaders.push("Total");
            } else if (i > 0) {
              this.expandHeaders.push("Total");
              this.expandHeaders.push("AVE");
            }
          }
        }
      }

      console.log(this.expandHeaders);
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
            total += i ? (i.e_w1 ? i.e_w1 : 0) : "";
            total += i ? (i.e_w1 ? i.e_w2 : 0) : "";
            total += i ? (i.e_w1 ? i.e_w3 : 0) : "";
            total += i ? (i.e_w1 ? i.e_w4 : 0) : "";
            return total;
          } else {
            return "Not to be Rated";
          }
        } else if (field == "Q") {
          let total = 0;
          if (item.qly_is_rated) {
            total += i ? (i.q_w1 ? i.q_w1 : 0) : "";
            total += i ? (i.q_w1 ? i.q_w2 : 0) : "";
            total += i ? (i.q_w1 ? i.q_w3 : 0) : "";
            total += i ? (i.q_w1 ? i.q_w4 : 0) : "";
            return total;
          } else {
            return "Not to be Rated";
          }
        } else if (field == "T") {
          let total = 0;
          if (item.timeliness_is_rated) {
            total += i ? (i.t_w1 ? i.t_w1 : 0) : "";
            total += i ? (i.t_w1 ? i.t_w2 : 0) : "";
            total += i ? (i.t_w1 ? i.t_w3 : 0) : "";
            total += i ? (i.t_w1 ? i.t_w4 : 0) : "";
            return total;
          } else {
            return "Not to be Rated";
          }
        }
      }
    },
    closeD() {
      this.eventHub.$emit("closeMPORSummaryDialog", false);
      this.confirmSubmitDialog = false;
      this.dialog = false;
    },

    update(item) {
      console.log(item);
      this.mporData = item;
    },
    changeTab(tab) {
      this.activeTab = tab;
      this.tab = tab.id;
      this.loadExpandHeaders(this.period);
      this.initialize();
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
