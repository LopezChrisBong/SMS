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
      <v-form ref="SupportFunctionFormref" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>Update Support Function</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="closeD()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 700px" class="my-4">
            <v-card>
              <v-row>
                <v-col cols="12" class=" pt-2 px-4">
                  <v-data-table
                    :expanded.sync="expanded"
                    :headers="headers"
                    :items="dataItem"
                    :items-per-page="20"
                    show-expand
                  >
                    <template v-slot:[`item.efficiency`]="{ item }">
                      {{
                        item.eff_is_rated ? item.efficiency : "Not to be Rated"
                      }}
                    </template>
                    <template v-slot:[`item.quality`]="{ item }">
                      {{ item.qly_is_rated ? item.quality : "Not to be Rated" }}
                    </template>
                    <template v-slot:[`item.timeliness`]="{ item }">
                      {{
                        item.timeliness_is_rated
                          ? item.timeliness
                          : "Not to be Rated"
                      }}
                    </template>
                    <template v-slot:expanded-item="{ headers, item }">
                      <td :colspan="headers.length" class="pa-4">
                        <table id="tbl_expanded">
                          <tr>
                            <th
                              class="text-caption font-weight-bold"
                              colspan="1"
                              style="width:33%"
                            >
                              Efficiency
                            </th>
                            <th
                              class="text-caption font-weight-bold"
                              colspan="2"
                              style="width:33%"
                            >
                              Quality
                            </th>
                            <th
                              class="text-caption font-weight-bold"
                              colspan="2"
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
                              Total
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
                              Avg
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
                              Avg
                            </td>
                          </tr>

                          <tbody>
                            <tr>
                              <td
                                colspan="1"
                                align="center"
                                class="text-caption"
                              >
                                {{
                                  !item.eff_is_rated
                                    ? "Not to be Rated"
                                    : item.efficiency
                                }}
                              </td>
                              <td
                                :colspan="!item.qly_is_rated ? 2 : 1"
                                align="center"
                                class="text-caption"
                              >
                                {{
                                  !item.qly_is_rated
                                    ? "Not to be Rated"
                                    : item.quality
                                }}
                              </td>
                              <td
                                v-if="item.qly_is_rated"
                                align="center"
                                class="text-caption"
                              >
                                {{
                                  item.eff_is_rated
                                    ? (item.quality / item.efficiency).toFixed(
                                        2
                                      )
                                    : item.quality
                                }}
                              </td>
                              <td
                                :colspan="!item.timeliness_is_rated ? 2 : 1"
                                align="center"
                                class="text-caption"
                              >
                                {{
                                  !item.timeliness_is_rated
                                    ? "Not to be Rated"
                                    : item.timeliness
                                }}
                              </td>
                              <td
                                v-if="item.timeliness_is_rated"
                                align="center"
                                class="text-caption"
                              >
                                {{
                                  item.eff_is_rated
                                    ? (
                                        item.timeliness / item.efficiency
                                      ).toFixed(2)
                                    : item.timeliness
                                }}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </template>
                    <template v-slot:[`item.action`]="{ item }">
                      <v-btn
                        block
                        v-if="moduleFrom == 'Admin'"
                        x-small
                        @click="updateSetting(item)"
                        outlined
                        color="green"
                        class="my-1"
                        >Update</v-btn
                      >
                      <v-btn
                        block
                        class="my-1"
                        x-small
                        @click="update(item)"
                        outlined
                        color="warning"
                        >Rate</v-btn
                      >
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-card>
          </v-card-text>
          <v-divider></v-divider>
        </v-card>
      </v-form>
    </v-dialog>
    <SupportOutputDialog :data="supportData" />
    <UpdateSFToRateSettingDialog :action="'Update'" :data="sfData" />
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
    SupportOutputDialog: () => import("../Forms/SupportOutputDialog.vue"),
    UpdateSFToRateSettingDialog: () =>
      import("../Forms/UpdateSFToRateSettingDialog.vue"),
  },
  props: {
    data: null,
    moduleFrom: null,
  },
  data() {
    return {
      action: null,
      isloading: null,
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
      sfData: null,
      supportData: null,
      ipcr: null,
      dataItem: [],

      headers: [
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
        {
          text: "Action",
          value: "action",
          align: "center",
          width: 100,
          valign: "center",
          sortable: false,
        },
      ],
    };
  },

  watch: {
    data: {
      handler(data) {
        this.tab = 1;
        this.dialog = true;
        this.ipcr = data;
        console.log(data);

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
    this.eventHub.$on("closeSupportOutputDialog", () => {
      this.initialize();
    });
    this.eventHub.$on("closeUpdateSFToRateSettingDialog", () => {
      this.initialize();
    });
  },

  beforeDestroy() {
    this.eventHub.$off("closeSupportOutputDialog");
    this.eventHub.$off("closeUpdateSFToRateSettingDialog");
  },

  methods: {
    initialize() {
      console.log("called", this.moduleFrom);
      this.loading = true;
      if (this.moduleFrom == "Admin") {
        this.axiosCall(
          "/ipcr-support/getEmployeeSFToRate/" +
            this.ipcr.id +
            "/" +
            this.ipcr.ipcrID,
          "GET"
        ).then((res) => {
          if (res) {
            console.log("suuport", res.data);
            this.dataItem = res.data;
            this.loading = false;
          }
        });
      } else {
        this.axiosCall(
          "/ipcr-target/getMyIPCRSupportTarget/" + this.ipcr.id,
          "GET"
        ).then((res) => {
          if (res) {
            // console.log("suuport", res.data);
            this.dataItem = res.data.targets;
            this.loading = false;
          }
        });
      }
    },
    changeMPOR() {
      this.initialize();
    },
    // getItemSuccessIndicator(item) {
    //   return item.efficiency_type == "percentage"
    //     ? item.efficiency +
    //         "%" +
    //         " " +
    //         item.mfo +
    //         " " +
    //         item.quality +
    //         " " +
    //         item.timeliness
    //     : item.efficiency +
    //         " " +
    //         item.mfo +
    //         " " +
    //         item.quality +
    //         " " +
    //         item.timeliness;
    // },
    // getTotal(field, item) {
    //   if (item) {
    //     let i = item.mpor;

    //     if (field == "E") {
    //       let total = 0;
    //       if (item.eff_is_rated) {
    //         total += i ? (i.e_w1 ? i.e_w1 : 0) : 0;
    //         total += i ? (i.e_w2 ? i.e_w2 : 0) : 0;
    //         total += i ? (i.e_w3 ? i.e_w3 : 0) : 0;
    //         total += i ? (i.e_w4 ? i.e_w4 : 0) : 0;
    //         return total;
    //       } else {
    //         return "Not to be Rated";
    //       }
    //     } else if (field == "Q") {
    //       let total = 0;
    //       if (item.qly_is_rated) {
    //         total += i ? (i.q_w1 ? i.q_w1 : 0) : 0;
    //         total += i ? (i.q_w2 ? i.q_w2 : 0) : 0;
    //         total += i ? (i.q_w3 ? i.q_w3 : 0) : 0;
    //         total += i ? (i.q_w4 ? i.q_w4 : 0) : 0;
    //         return total;
    //       } else {
    //         return "Not to be Rated";
    //       }
    //     } else if (field == "T") {
    //       let total = 0;
    //       if (item.timeliness_is_rated) {
    //         total += i ? (i.t_w1 ? i.t_w1 : 0) : 0;
    //         total += i ? (i.t_w2 ? i.t_w2 : 0) : 0;
    //         total += i ? (i.t_w3 ? i.t_w3 : 0) : 0;
    //         total += i ? (i.t_w4 ? i.t_w4 : 0) : 0;
    //         return total;
    //       } else {
    //         return "Not to be Rated";
    //       }
    //     }
    //   }
    // },
    closeD() {
      this.eventHub.$emit("closeIPCRSupportDialog", false);
      this.dialog = false;
    },
    AddFuncion() {
      this.ipcrData = { id: null };
      this.action = "Add";
    },
    update(item) {
      console.log(item);
      this.supportData = item;
    },

    updateSetting(item) {
      console.log(item);
      this.sfData = item;
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
