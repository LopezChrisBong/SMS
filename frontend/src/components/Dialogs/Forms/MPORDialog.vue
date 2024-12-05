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
            <span>MPOR - MONTHLY PERFORMANCE OUTPUT REPORT </span>
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
                <v-col cols="2" class="d-flex justify-end mt-2 mr-2">
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
                </v-col>
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
                    <template v-slot:[`item.approval_status`]="{ item }">
                      <v-chip
                        x-small
                        class="pa-2"
                        v-if="item.mpor.isSubmitted == 0"
                        >For submission</v-chip
                      >
                      <v-chip
                        x-small
                        class="pa-2"
                        v-if="
                          item.mpor.isSubmitted == 1 &&
                            item.mpor.head_approval_status == 1
                        "
                        >For approval</v-chip
                      >
                      <v-chip
                        x-small
                        color="green"
                        class="pa-2 white--text"
                        v-if="
                          item.mpor.isSubmitted == 1 &&
                            item.mpor.head_approval_status == 2
                        "
                        >Approved</v-chip
                      >
                      <v-chip
                        x-small
                        color="red"
                        class="pa-2 white--text"
                        v-if="
                          item.mpor.isSubmitted == 1 &&
                            item.mpor.head_approval_status == 3
                        "
                        >Pending</v-chip
                      >
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
                    <template v-slot:[`item.action`]="{ item }">
                      <v-btn
                        v-if="!getIsSubmitted"
                        x-small
                        @click="update(item)"
                        outlined
                        color="warning"
                        >Update Output
                      </v-btn>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
              <v-row
                v-if="
                  dataItem[0].mpor.isSubmitted == 1 &&
                    dataItem[0].mpor.head_approval_status == 2
                "
              >
                <v-col cols="12">
                  <v-divider></v-divider>
                  <div class="pa-3">
                    <div class="text-h6">
                      Comments and Recommendations for Development Purposes:
                    </div>
                    <div class="text-justify text-subtitle-1">
                      {{ dataItem[0].mpor.observation_and_remarks }}
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="pa-5">
            <v-fab-transition>
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
              v-if="!getIsSubmitted"
              color="#5a67da"
              class="white--text"
              @click="submit()"
              :disabled="isloading"
              :loading="isloading"
            >
              Submit
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <!-- delete dialog -->
    <v-dialog
      v-if="confirmSubmitDialog"
      v-model="confirmSubmitDialog"
      persistent
      max-width="390"
    >
      <v-card color="white">
        <div class="pa-4 #3a3b3a--text">
          <div class="text-h6 mb-1">WARNING!</div>
          <div class="text-body-1 mb-1">
            <p style="text-align: justify">
              <v-icon class="mt-n2" color="white">mdi-alert</v-icon> &nbsp; Are
              you sure you want to submit this <b>MOPR</b> for the month of
              <b>{{ getSelectedMonthName }} {{ ipcr ? ipcr.year : "" }}</b>
              ?<br />
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
  },
  data() {
    return {
      action: null,
      isloading: null,
      confirmSubmitDialog: false,
      confirmBtnLoading: false,
      loading: false,
      remarksData: [],
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
      ipcr: null,
      ipcrID: null,
      curData: null,
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
          text: "Status",
          value: "approval_status",
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
        {
          text: "Action",
          value: "action",
          align: "end",
          width: 100,
          valign: "center",
          sortable: false,
        },
      ],
    };
  },
  computed: {
    getIsSubmitted() {
      let toReturn = false;
      var submit = [];
      var approval = [];
      if (this.curData) {
        for (let i = 0; i < this.curData.length; i++) {
          let tempData = this.curData[i];
          for (let j = 0; j < tempData.length; j++) {
            submit.push(tempData[j].mpor.isSubmitted);
            approval.push(tempData[j].mpor.head_approval_status);
          }
        }

        if (submit.includes(0)) {
          if (approval.includes(1) || approval.includes(3)) {
            return false;
          } else {
            return true;
          }
        } else {
          if (approval.includes(3)) {
            return false;
          } else {
            return true;
          }
        }
      } else {
        toReturn = false;
      }
      return toReturn;
    },

    getSelectedMonthName() {
      let name = "";
      for (let i = 0; i < this.monthsList.length; i++) {
        if (this.monthsList[i].id == this.selectedMonth) {
          name = this.monthsList[i].name;
        }
      }
      return name;
    },
  },
  watch: {
    data: {
      handler(data) {
        this.tab = 1;
        this.dialog = true;
        this.activeTab = { id: 1, name: "Core Functions" };
        this.selectedMonth = 1;
        this.ipcr = data;
        this.ipcrID = data.id;
        console.log("this is data", data);
        this.loadMonthList(data.periodFrom, data.periodTo);
        // if (data.period == 1) {
        //   this.selectedMonth = this.monthSelection1[0].id;
        //   this.monthsList = this.monthSelection1;
        // } else if (data.period == 2) {
        //   this.selectedMonth = this.monthSelection2[0].id;
        //   this.monthsList = this.monthSelection2;
        // } else if (data.period == 3) {
        //   this.selectedMonth = this.monthSelection3[0].id;
        //   this.monthsList = this.monthSelection3;
        // }
        this.loadRemarks(data.id);
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
    loadMonthList(from, to) {
      let mnth = [
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
      ];
      this.monthsList = [];
      this.selectedMonth = null;

      for (let i = from - 1; i < to; i++) {
        this.monthsList.push(mnth[i]);
      }
      this.selectedMonth = this.monthsList[0].id;
      console.log(this.monthsList);
    },

    loadRemarks(id) {
      if (id) {
        this.axiosCall("/remarks/" + id + "/MPOR", "GET").then((res) => {
          if (res.data) {
            console.log("remarks", res.data);
            this.remarksData = res.data;
          }
        });
      }
    },
    initialize() {
      this.loading = true;

      this.axiosCall(
        "/ipcr-target/getMyIPCRTargetMPOR/" +
          this.ipcrID +
          "/" +
          this.selectedMonth,
        "GET"
      ).then((res) => {
        if (res) {
          console.log("RESPONSE", res.data);
          this.curData = res.data;
          this.dataItem = res.data[this.tab - 1];

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
            if (
              i.e_w1 != null &&
              i.e_w2 != null &&
              i.e_w3 != null &&
              i.e_w4 != null
            ) {
              total += i ? (i.e_w1 ? i.e_w1 : 0) : 0;
              total += i ? (i.e_w2 ? i.e_w2 : 0) : 0;
              total += i ? (i.e_w3 ? i.e_w3 : 0) : 0;
              total += i ? (i.e_w4 ? i.e_w4 : 0) : 0;
              return total;
            } else {
              return "To be rated";
            }
          } else {
            return "Not to be Rated";
          }
        } else if (field == "Q") {
          let total = 0;
          if (item.qly_is_rated) {
            if (
              i.q_w1 != null &&
              i.q_w2 != null &&
              i.q_w3 != null &&
              i.q_w4 != null
            ) {
              total += i ? (i.q_w1 ? i.q_w1 : 0) : 0;
              total += i ? (i.q_w2 ? i.q_w2 : 0) : 0;
              total += i ? (i.q_w3 ? i.q_w3 : 0) : 0;
              total += i ? (i.q_w4 ? i.q_w4 : 0) : 0;
              return total;
            } else {
              return "To be rated";
            }
          } else {
            return "Not to be Rated";
          }
        } else if (field == "T") {
          let total = 0;
          if (item.timeliness_is_rated) {
            if (
              i.t_w1 != null &&
              i.t_w2 != null &&
              i.t_w3 != null &&
              i.t_w4 != null
            ) {
              total += i ? (i.t_w1 ? i.t_w1 : 0) : 0;
              total += i ? (i.t_w2 ? i.t_w2 : 0) : 0;
              total += i ? (i.t_w3 ? i.t_w3 : 0) : 0;
              total += i ? (i.t_w4 ? i.t_w4 : 0) : 0;
              return total;
            } else {
              return "To be rated";
            }
          } else {
            return "Not to be Rated";
          }
        }
      }
    },
    closeD() {
      this.eventHub.$emit("closeMPORDialog", false);
      this.dialog = false;
    },
    AddFuncion() {
      this.ipcrData = { id: null };
      this.action = "Add";
    },
    update(item) {
      this.mporData = item;
    },
    changeTab(tab) {
      this.activeTab = tab;
      this.tab = tab.id;
      this.initialize();
    },
    submit() {
      this.confirmSubmitDialog = true;
    },
    cancelConfirm() {
      this.confirmSubmitDialog = false;
    },
    confirmSubmit() {
      this.confirmBtnLoading = true;
      let data = {
        ipcrID: this.ipcr.id,
        selectedMonth: this.selectedMonth,
      };
      this.axiosCall("/ipcr-mpor/submitMPOR", "POST", data).then((res) => {
        if (res) {
          this.confirmBtnLoading = false;

          if (res.data.status == 200) {
            this.confirmSubmitDialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.initialize();
          } else if (res.data.status == 400) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
          }
        }
      });
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
