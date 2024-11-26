<template>
  <div>
    <v-dialog
      v-model="dialog"
      fullscreen
      persistent
      eager
      scrollable
      max-width="1000px"
    >
      <v-form ref="StratPlanTargets" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>{{ action }} Strat Plan Target</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="closeD()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 700px" class="my-4">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-textarea
                    label="Strategic Planning Target Description"
                    outlined
                    readonly
                    v-model="target_desc"
                    dense
                    :rules="[formRules.required]"
                    class="rounded-lg "
                    color="#6DB249"
                    rows="3"
                  ></v-textarea>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="target_accomplishment"
                    :rules="[formRules.required]"
                    dense
                    readonly
                    type="number"
                    outlined
                    required
                    label="Strategic Planning Target Accomplishment"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-data-table
                    :expanded.sync="expanded"
                    :headers="headers1"
                    :items="dataItem"
                    :items-per-page="20"
                    show-expand
                  >
                    <template v-slot:expanded-item="{ headers, item }">
                      <td :colspan="headers.length" class="pa-4">
                        <table id="tbl_expanded">
                          <tr>
                            <th
                              class="text-caption font-weight-bold"
                              :colspan="e_span"
                              style="width:33%"
                            >
                              Employee Name
                            </th>
                            <th
                              class="text-caption font-weight-bold"
                              :colspan="e_span"
                              style="width:33%"
                            >
                              MFO
                            </th>
                            <th
                              class="text-caption font-weight-bold"
                              :colspan="qt_span"
                              style="width:33%"
                            >
                              Success Indicator
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
                            <tr
                              v-for="(employees, i) in item.employees"
                              :key="i"
                            >
                              <td align="center" class="text-caption">
                                {{ employees.empName }}
                              </td>
                              <td align="center" class="text-caption">
                                {{ employees.mfo }}
                              </td>
                              <td align="center" class="text-caption">
                                {{ employees.success_indicator }}
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
            </v-container>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions class="pa-5">
            <v-spacer></v-spacer>

            <v-btn color="red" outlined @click="closeD()">
              <v-icon>mdi-close-circle-outline</v-icon>
              Close
            </v-btn>

            <v-btn
              v-if="action == 'Add'"
              color="#519043"
              class="white--text"
              @click="addnew()"
              :disabled="isSubmitLoading"
              :loading="isSubmitLoading"
            >
              <v-icon>mdi-check-circle</v-icon>
              Save
            </v-btn>
            <v-btn
              v-if="action == 'Update'"
              color="#519043"
              class="white--text"
              @click="update()"
              :disabled="isSubmitLoading"
              :loading="isSubmitLoading"
            >
              <v-icon>mdi-check-circle</v-icon>
              Update
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
      :timeout="3000"
    ></fade-away-message-component>
  </div>
</template>

<script>
export default {
  props: {
    data: null,
    action: null,
  },

  data() {
    return {
      id: null,
      spID: null,
      target_desc: null,
      target_accomplishment: null,
      linked: null,
      dialog: false,
      isSubmitLoading: false,
      fadeAwayMessage: {
        show: false,
        type: "success",
        header: "Successfully Added!",
        message: "",
        top: 10,
      },

      headers1: [
        {
          text: "Name",
          value: "office_head",
          align: "start",
          valign: "start",
          sortable: false,
        },
        {
          text: "Office",
          value: "office_name",
          align: "end",
          valign: "end",
          sortable: false,
        },
      ],
    };
  },
  watch: {
    data: {
      handler(data) {
        this.dialog = true;
        console.log("Data", data);
        if (data.id) {
          this.id = data.id;
          this.linked = data.linked;
          this.target_desc = data.target_desc;
          this.target_accomplishment = data.target_accomplishment;
          this.dataItem = [
            {
              id: 1,
              office_head: "Mark",
              office_name: "IC",
              employees: [
                {
                  empName: "employee1",
                  mfo: "sample mfo 1",
                  success_indicator: "sample success indicator 1",
                },
                {
                  empName: "employee2",
                  mfo: "sample mfo 2",
                  success_indicator: "sample success indicator 2",
                },
                {
                  empName: "employee3",
                  mfo: "sample mfo 3",
                  success_indicator: "sample success indicator 3",
                },
              ],
            },
            { id: 2, office_head: "Mark", office_name: "IC" },
            { id: 3, office_head: "Mark", office_name: "IC" },
          ];
          this.spID = data.spID;
        } else {
          this.id = null;
          this.spID = data.spID;
          this.target_desc = null;
          this.linked = null;
          this.target_accomplishment = null;
        }
      },

      deep: true,
    },
  },

  methods: {
    initialize() {},

    closeD() {
      this.eventHub.$emit("closeStratPlanTargets", false);
      this.isSubmitLoading = false;
      this.dialog = false;
    },

    addnew() {
      if (this.$refs.StratPlanTargets.validate()) {
        this.isSubmitLoading = true;
        let data = {
          spID: this.spID,
          target_desc: this.target_desc,
          target_accomplishment: this.target_accomplishment,
        };
        // console.log(data);
        this.axiosCall(
          "/strategic-planning/stratPlanTargets",
          "POST",
          data
        ).then((res) => {
          console.log(res);
          if (res.data.status == 201) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;

            this.closeD();
          } else {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
          }
        });
      }
    },

    update() {
      console.log("Update Data");
      if (this.$refs.StratPlanTargets.validate()) {
        this.isSubmitLoading = true;
        let data = {
          target_desc: this.target_desc,
          target_accomplishment: this.target_accomplishment,
        };
        // console.log(data);
        this.axiosCall(
          "/strategic-planning/updateStratPlanTarget/" + this.id,
          "PATCH",
          data
        ).then((res) => {
          if (res.data.status == 200) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.closeD();
          } else {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
          }
        });
      }
    },

    getEmpDetails() {
      this.axiosCall("/employee/my-details", "GET").then((res) => {
        console.log(res.data);
        this.assigned_office = res.data.officeID;
      });
    },

    getOffices() {
      this.axiosCall("/offices", "GET").then((res) => {
        this.officeList = res.data;
      });
    },

    getDesignations() {
      this.axiosCall("/designations", "GET").then((res) => {
        this.designationList = res.data;
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
