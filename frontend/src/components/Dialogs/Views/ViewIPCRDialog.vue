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
          <span>IPCR - Individual Performance Commitment and Review</span>
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
                      :complete="assesed_by_status == 2 ? true : false"
                      :rules="[() => assesed_by_status != 3]"
                      color="#6DB249"
                    >
                      {{ assessed_by }}
                      <small>Assessed By<br /> </small>
                    </v-stepper-step>
                    <v-divider></v-divider>
                    <v-stepper-step
                      step="2"
                      class="pa-5"
                      :complete="final_rating_by_status == 2 ? true : false"
                      :rules="[() => final_rating_by_status != 3]"
                      color="#6DB249"
                    >
                      {{ final_rating_by }}
                      <small>Final Rating <br /> </small>
                    </v-stepper-step>
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
                <table v-if="tab != 4" id="ipcrTable">
                  <tr>
                    <td
                      colspan="2"
                      style="width:20%"
                      rowspan="2"
                      class="font-weight-bold text-caption"
                      align="center"
                    >
                      Major Final Output(MFO)
                    </td>
                    <td
                      style="width:20%"
                      rowspan="2"
                      class="font-weight-bold text-caption"
                      align="center"
                    >
                      Success Indicators<br />Target + Measure
                    </td>
                    <td
                      style="width:20%"
                      rowspan="2"
                      class="font-weight-bold text-caption"
                      align="center"
                    >
                      Actual Accomplishments
                    </td>
                    <td
                      style="width:20%"
                      colspan="4"
                      class="font-weight-bold text-caption"
                      align="center"
                    >
                      Rating
                    </td>
                    <td
                      style="width:20%"
                      rowspan="2"
                      class="font-weight-bold text-caption"
                      align="center"
                    >
                      Remarks
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="width: 5%"
                      class="font-weight-bold text-caption"
                      align="center"
                    >
                      E
                    </td>
                    <td
                      style="width: 5%"
                      class="font-weight-bold text-caption"
                      align="center"
                    >
                      Q
                    </td>
                    <td
                      style="width: 5%"
                      class="font-weight-bold text-caption"
                      align="center"
                    >
                      T
                    </td>
                    <td
                      style="width: 5%"
                      class="font-weight-bold text-caption"
                      align="center"
                    >
                      A
                    </td>
                  </tr>
                  <tbody
                    v-if="
                      ipcrToView && ipcrToView.func_type != 'Support Function'
                    "
                  >
                    <tr>
                      <td
                        colspan="9"
                        class="text-subtitle-1 text-justify font-weight-bold"
                        style="text-indent:10px"
                      >
                        {{ ipcrToView.func_type }}

                        ({{
                          ipcrToView.func_type == "Core Function"
                            ? ipcrData[1].data.length > 0
                              ? "60%"
                              : "90%"
                            : ipcrToView.func_type == "Strategic Priority"
                            ? ipcrData[1].data.length > 0
                              ? "30%"
                              : "0%"
                            : "10%"
                        }})
                      </td>
                    </tr>

                    <tr v-for="(item, i) in ipcrToView.data" :key="i">
                      <td class=" text-caption pa-1" align="center">
                        {{
                          ipcrToView.func_type == "Core Function"
                            ? "CF" + (i + 1)
                            : ipcrToView.func_type == "Strategic Priority"
                            ? "SP" + (i + 1)
                            : "SF" + (i + 1)
                        }}
                      </td>
                      <td class=" text-caption pa-1" align="left">
                        {{ item.mfo }}
                      </td>
                      <td class=" text-caption pa-1" align="left">
                        {{ item.success_indicator }}
                      </td>
                      <td class=" text-caption" align="center">
                        {{ item.actual_accomplishment }}
                      </td>
                      <td class=" text-caption" align="center">
                        {{ item.e_avg }}
                      </td>
                      <td class=" text-caption" align="center">
                        {{ item.q_avg }}
                      </td>
                      <td class=" text-caption" align="center">
                        {{ item.t_avg }}
                      </td>
                      <td class=" text-caption" align="center">
                        {{ item.a_avg }}
                      </td>
                      <td class=" text-caption" align="center"></td>
                    </tr>

                    <tr>
                      <td colspan="7" align="right" class=" text-caption  pa-2">
                        Total {{ ipcrToView.func_type }}
                      </td>
                      <td align="center" class=" text-caption">
                        {{ ipcrToView.total }}
                      </td>
                      <td class=" text-caption"></td>
                    </tr>
                  </tbody>
                  <tbody v-else>
                    <tr>
                      <td
                        colspan="9"
                        class="text-subtitle-1 text-justify font-weight-bold"
                        style="text-indent:10px"
                      >
                        {{ ipcrToView.func_type }} (10%)
                      </td>
                    </tr>
                    <!-- sf1 -->
                    <tr v-for="(item, i) in ipcrToView.data.sf1.data" :key="i">
                      <td
                        v-if="i == 0"
                        :rowspan="ipcrToView.data.sf1.data.length"
                        class=" text-caption pa-1"
                        align="center"
                      >
                        SF1
                      </td>
                      <td
                        v-if="i == 0"
                        :rowspan="ipcrToView.data.sf1.data.length"
                        class=" text-caption pa-1"
                        align="left"
                      >
                        {{ item.mfo }}
                      </td>
                      <td class=" text-caption pa-1" align="left">
                        {{ item.success_indicator }}
                      </td>
                      <td class=" text-caption" align="center">
                        {{ item.actual_accomplishment }}
                      </td>
                      <td class=" text-caption" align="center">
                        {{ item.e_avg }}
                      </td>
                      <td class=" text-caption" align="center">
                        {{ item.q_avg }}
                      </td>
                      <td class=" text-caption" align="center">
                        {{ item.t_avg }}
                      </td>
                      <td class=" text-caption" align="center">
                        {{ item.a_avg }}
                      </td>
                      <td class=" text-caption" align="center"></td>
                    </tr>

                    <tr>
                      <td colspan="4" align="right" class=" text-caption  pa-2">
                        Total {{ ipcrToView.data.sf1.data[0].mfo }} /
                        {{ ipcrToView.data.sf1.data.length + " X " }}
                        {{
                          ipcrToView.data.sf2.data.length == 0 ? "100%" : "60%"
                        }}
                      </td>
                      <td colspan="4" align="center" class=" text-caption">
                        {{ ipcrToView.data.sf1.sftotal }}
                      </td>
                      <td class=" text-caption"></td>
                    </tr>

                    <!-- sf2 -->
                    <tr v-for="(item, i) in ipcrToView.data.sf2.data" :key="i">
                      <td
                        v-if="i == 0"
                        :rowspan="ipcrToView.data.sf2.data.length"
                        class=" text-caption pa-1"
                        align="center"
                      >
                        SF2
                      </td>
                      <td
                        v-if="i == 0"
                        :rowspan="ipcrToView.data.sf2.data.length"
                        class=" text-caption pa-1"
                        align="left"
                      >
                        {{ item.mfo }}
                      </td>
                      <td class=" text-caption pa-1" align="left">
                        {{ item.success_indicator }}
                      </td>
                      <td class=" text-caption" align="center">
                        {{ item.actual_accomplishment }}
                      </td>
                      <td class=" text-caption" align="center">
                        {{ item.e_avg }}
                      </td>
                      <td class=" text-caption" align="center">
                        {{ item.q_avg }}
                      </td>
                      <td class=" text-caption" align="center">
                        {{ item.t_avg }}
                      </td>
                      <td class=" text-caption" align="center">
                        {{ item.a_avg }}
                      </td>
                      <td class=" text-caption" align="center"></td>
                    </tr>

                    <tr v-if="ipcrToView.data.sf2.data.length > 0">
                      <td colspan="4" align="right" class=" text-caption  pa-2">
                        Total {{ ipcrToView.data.sf2.data[0].mfo }}
                        {{
                          ipcrToView.data.sf2.data.length > 1
                            ? " / " + ipcrToView.data.sf2.data.length + " X 40%"
                            : " X 40%"
                        }}
                      </td>
                      <td colspan="4" align="center" class=" text-caption ">
                        {{ ipcrToView.data.sf2.sftotal }}
                      </td>
                      <td class=" text-caption"></td>
                    </tr>

                    <tr>
                      <td align="center" colspan="7" class="pa-1 text-caption">
                        Total {{ ipcrToView.func_type }}
                      </td>
                      <td align="center" class=" text-caption">
                        {{ ipcrToView.total }}
                      </td>
                      <td align="center" class=" text-caption"></td>
                    </tr>
                  </tbody>
                </table>
                <table v-else id="categoryTable">
                  <tr>
                    <td
                      style="width:20%"
                      class="font-weight-bold text-caption pa-1"
                      align="center"
                    >
                      Category
                    </td>
                    <td
                      style="width:20%"
                      class="font-weight-bold text-caption"
                      align="center"
                    >
                      Total
                    </td>
                    <td
                      style="width:20%"
                      class="font-weight-bold text-caption"
                      align="center"
                    >
                      Number of MFO's
                    </td>
                    <td
                      style="width:20%"
                      class="font-weight-bold text-caption"
                      align="center"
                    >
                      Percentage(%)
                    </td>
                    <td
                      style="width:20%"
                      class="font-weight-bold text-caption"
                      align="center"
                    >
                      General Average
                    </td>
                  </tr>
                  <tr v-for="(item, i) in ipcrData" :key="i">
                    <td
                      align="left"
                      style="text-indent:10px"
                      class="text-caption pa-1"
                    >
                      {{ item.func_type }}
                    </td>
                    <td align="center" class="text-caption">
                      {{ item.total }}
                    </td>
                    <td align="center" class="text-caption">
                      {{
                        item.func_type != "Support Function"
                          ? item.data.length
                          : ""
                      }}
                    </td>
                    <td align="center" class="text-caption">
                      {{
                        item.func_type != "Support Function"
                          ? item.func_type == "Core Function"
                            ? ipcrData[1].data.length > 0
                              ? "60%"
                              : "90%"
                            : ipcrData[1].data.length > 0
                            ? "30%"
                            : "0%"
                          : "10%"
                      }}
                    </td>
                    <td align="center" class="text-caption">
                      {{
                        computeGeneralAve(
                          item,
                          item.func_type != "Support Function"
                            ? item.func_type == "Core Function"
                              ? ipcrData[1].data.length > 0
                                ? 0.6
                                : 0.9
                              : ipcrData[1].data.length > 0
                              ? 0.3
                              : 0
                            : 0.1
                        )
                      }}
                    </td>
                  </tr>
                  <tr>
                    <td
                      colspan="4"
                      align="left"
                      style="text-indent:10px"
                      class="text-caption pa-1"
                    >
                      Total/Final Overall Rating
                    </td>
                    <td align="center" class="text-caption">
                      {{ getOverAllrating() }}
                    </td>
                  </tr>
                  <tr>
                    <td
                      colspan="4"
                      align="left"
                      style="text-indent:10px"
                      class="text-caption pa-1"
                    >
                      Final Average Rating
                    </td>
                    <td align="center" class="text-caption"></td>
                  </tr>
                </table>
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
            color="#519043"
            class="white--text"
            v-if="!isSubmitted"
            @click="submitIPCR()"
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
              you sure you want to submit this <b>IPCR</b>?<br />
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
  },
  data() {
    return {
      remarksData: [],
      confirmSubmitDialog: false,
      confirmDialog: false,
      itemToDelete: null,
      confirmBtnLoading: false,
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
        { id: 4, name: "Category" },
      ],
      ipcrData: null,
      ipcrToView: null,
      id: null,
      isSubmitted: null,
      dataItem: [],
      isButtonLoading: false,
      assessed_by: null,
      assessed_by_status: null,
      final_rating_by: null,
      final_rating_by_status: null,
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
          align: "start",
          valign: "start",
          sortable: false,
        },
        {
          text: "Success Indicator",
          value: "success_indicator",
          align: "center",
          width: 250,
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
        console.log("asdasd", data);
        this.id = data.id;
        this.isSubmitted = data.isSubmitted;
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
  },

  beforeDestroy() {
    this.eventHub.$off("closeIPCRFunctionDialog");
    this.eventHub.$off("closePerformanceEvaluationDialog");
    this.eventHub.$off("closeMPORDialog");
    this.eventHub.$off("closeUpdateSupportFunctionDialog");
  },

  methods: {
    initialize() {
      this.loadRemarks(this.id);
      this.loading = true;
      this.axiosCall("/ipcr/getIPCR/" + this.id, "GET").then((res) => {
        if (res) {
          console.log("IPCR", res.data);
          this.ipcrData = res.data;
          if (this.tab != 4) {
            this.ipcrToView = res.data[this.tab - 1];
          }

          this.loading = false;
        }
      });
      this.axiosCall(
        "/ipcr/getIPCRApproverNames/" + this.id + "/IPCR",
        "GET"
      ).then((res) => {
        if (res) {
          console.log("signatorues", res.data);
          this.assessed_by = this.toTitleCase(res.data.assessed_by_name);
          this.assessed_by_status = res.data.assesed_by_status;
          this.final_rating_by = this.toTitleCase(
            res.data.final_rating_by_name
          );
          this.final_rating_by_status = res.data.final_rating_by_status;
        }
      });
    },

    submitIPCR() {
      this.confirmSubmitDialog = true;
    },

    cancelConfirm() {
      this.confirmSubmitDialog = false;
    },

    confirmSubmit() {
      this.confirmBtnLoading = true;
      this.axiosCall("/ipcr/submitMyIPCR/" + this.id, "PATCH").then((res) => {
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
      });
    },

    loadRemarks(id) {
      if (id) {
        this.axiosCall("/remarks/" + id + "/IPCR", "GET").then((res) => {
          if (res.data) {
            console.log("remarks", res.data);
            this.remarksData = res.data;
          }
        });
      }
    },
    closeD() {
      this.eventHub.$emit("closeViewIPCRDialog", false);
      this.confirmSubmitDialog = false;
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

    computeGeneralAve(data, percentage) {
      let avg = 0;
      if (percentage != 0) {
        if (data.data.length) {
          avg = ((data.total / data.data.length) * percentage).toFixed(2);
        } else {
          avg = (data.total * percentage).toFixed(2);
        }
        return avg;
      } else {
        return 0.0;
      }
    },

    getOverAllrating() {
      let total = 0;
      for (let i = 0; i < this.ipcrData.length; i++) {
        let d = this.computeGeneralAve(
          this.ipcrData[i],
          this.ipcrData[i].func_type != "Support Function"
            ? this.ipcrData[i].func_type == "Core Function"
              ? this.ipcrData[1].data.length > 0
                ? 0.6
                : 0.9
              : this.ipcrData[1].data.length > 0
              ? 0.3
              : 0
            : 0.1
        );
        total += parseFloat(d);
      }
      return total.toFixed(2);
    },

    changeTab(tab) {
      this.activeTab = tab;
      this.tab = tab.id;
      this.initialize();
    },
  },
};
</script>
<style scoped>
#ipcrTable,
#categoryTable {
  width: 100%;
  border-collapse: collapse;
}
#ipcrTable td,
#ipcrTable th,
#categoryTable td,
#categoryTable th {
  border: 1px solid grey;
}
</style>
