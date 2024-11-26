<template>
  <div>
    <v-dialog
      v-model="dialog"
      fullscreen
      persistent
      scrollable
      max-width="800px"
    >
      <v-card>
        <v-card-title dark class="dialog-header">
          Convert VL to SL <v-spacer></v-spacer>
          <v-btn icon dark @click="close()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text
          style="max-height: 780px; max-width:1300px; margin: 0 auto; "
          class="mt-4"
        >
          <v-row>
            <v-col cols="6" class=""> </v-col>
            <v-col cols="6" class="d-flex justify-end">
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                outlined
                prepend-inner-icon="search"
                label="Search"
                single-line
                hide-details
                class="mx-1 rounded-lg"
                color="#519043"
                dense
              ></v-text-field>
              <v-btn
                @click="addData()"
                :color="$vuetify.theme.themes.light.submitBtns"
                class="mx-1 white--text"
              >
                Select Employee
              </v-btn>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6">
              <div>FROM</div>
              <v-card class="my-5 dt-container" elevation="0" outlined>
                <v-data-table
                  :headers="headers"
                  :items="selectedEmployees"
                  :items-per-page="10"
                  :search="search"
                  :options.sync="options"
                  :loading="loading"
                  @pagination="pagination"
                  hide-default-footer
                >
                  <template v-slot:[`item.empID`]="{ item }">
                    {{ getName(item.empID) }}
                  </template>
                  <template v-slot:[`item.action`]="{ item, index }">
                    <v-btn
                      @click="convert(item, index)"
                      class="mx-1"
                      x-small
                      color="#519043"
                      outlined
                    >
                      Convert
                    </v-btn>
                  </template>
                </v-data-table>
              </v-card>
            </v-col>
            <v-col cols="6">
              <div>TO</div>
              <v-card class="my-5 dt-container" elevation="0" outlined>
                <v-data-table
                  :headers="headers1"
                  :items="convertedSelectedEmployee"
                  :items-per-page="10"
                  :search="search"
                  :options.sync="options"
                  :loading="loading"
                  @pagination="pagination"
                  hide-default-footer
                >
                  <template v-slot:[`item.empID`]="{ item }">
                    {{ getName(item.empID) }}
                  </template>
                  <template v-slot:[`item.action`]="{ item }">
                    <v-btn
                      @click="revert(item, i)"
                      class="mx-1"
                      x-small
                      color="warning"
                      outlined
                    >
                      Revert </v-btn
                    ><v-btn
                      @click="remove(i)"
                      class="mx-1"
                      x-small
                      color="red"
                      outlined
                    >
                      Remove
                    </v-btn>
                  </template>
                </v-data-table>
              </v-card>
            </v-col>
          </v-row>

          <!-- <v-row class="mb-2 mx-5" align="center">
            <v-col
              cols="auto"
              class="mr-auto text-truncate flex-items"
              no-gutters
            >
              <span class="px-2">Show</span>
              <span>
                <v-select
                  dense
                  outlined
                  hide-details
                  :value="options.itemsPerPage"
                  style="max-width: 90px"
                  class="rounded-lg"
                  color="#519043"
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
                color="#519043"
                :length="paginationData.pageCount"
              >
              </v-pagination>
            </v-col>
          </v-row> -->
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-5">
          <v-spacer></v-spacer>
          <v-btn
            color="red"
            outlined
            @click="
              close();
              dialog = false;
            "
          >
            <v-icon>mdi-close-circle-outline</v-icon>
            Cancel
          </v-btn>
          <v-btn
            :color="$vuetify.theme.themes.light.submitBtns"
            class="white--text"
            @click="submit()"
          >
            <v-icon>mdi-check-circle</v-icon>
            SUBMIT
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="addBFDialog"
      eager
      scrollable
      persistent
      max-width="800px"
      transition="dialog-bottom-transition"
    >
      <v-form ref="CVLSLFormref" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>Select Employee</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="addBFDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 800px" class="my-4">
            <v-row>
              <v-col class="mt-2" cols="12">
                <v-autocomplete
                  v-model="emp_selected"
                  @change="getEmployeeVLSL()"
                  :rules="[formRules.required]"
                  dense
                  outlined
                  label="Employee"
                  class="rounded-lg"
                  item-text="name"
                  item-value="empID"
                  color="#93CB5B"
                  :items="formatEmployeeNameList"
                >
                </v-autocomplete>
              </v-col>
              <v-col class="mt-2" cols="12">
                <v-text-field
                  v-model="vl_credits"
                  readonly
                  dense
                  outlined
                  class="rounded-lg"
                  label="VL Credits "
                  color="#93CB5B"
                >
                </v-text-field>
              </v-col>
              <v-col class="mt-2" cols="12">
                <v-text-field
                  v-model="sl_credits"
                  readonly
                  dense
                  outlined
                  class="rounded-lg"
                  label="SL Credits "
                  color="#93CB5B"
                >
                </v-text-field>
              </v-col>
              <v-col class="mt-2" cols="12">
                <v-autocomplete
                  v-model="selectedConvertion"
                  :rules="[formRules.required]"
                  dense
                  outlined
                  label="Select Convertion"
                  class="rounded-lg"
                  item-text="description"
                  item-value="id"
                  color="#93CB5B"
                  :items="convertionSelection"
                >
                </v-autocomplete>
              </v-col>

              <v-col class="mt-2" cols="12">
                <v-textarea
                  v-model="remarks"
                  :rules="[formRules.required]"
                  dense
                  outlined
                  label="Remarks"
                  class="rounded-lg"
                  color="#93CB5B"
                >
                </v-textarea>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions class="pa-5">
            <v-spacer></v-spacer>
            <v-btn color="red" outlined>
              Close
            </v-btn>
            <v-btn
              @click="addEmployee()"
              :color="$vuetify.theme.themes.light.submitBtns"
              class="white--text"
            >
              Select
            </v-btn>
            <!-- <v-btn
              v-if="internal_action == 'Update'"
              color="#519043"
              class="white--text"
            >
              Update
            </v-btn> -->
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
  },
  data() {
    return {
      dialog: false,
      options: {},
      search: "",
      paginationData: {},

      perPageChoices: [
        { text: "5", value: 5 },
        { text: "10", value: 10 },
        { text: "20", value: 20 },
        { text: "50", value: 50 },
        { text: "100", value: 100 },
        { text: "250", value: 250 },
        { text: "500", value: 500 },
      ],
      headers: [
        {
          text: "Name",
          value: "name",
          align: "start",
          valign: "center",
        },
        {
          text: "VL Credits",
          value: "vl_credits",
          align: "center",
          valign: "center",
        },
        {
          text: "SL Credits",
          value: "sl_credits",
          align: "center",
          valign: "center",
        },
      ],
      headers1: [
        {
          text: "Name",
          value: "name",
          align: "start",
          valign: "center",
        },
        {
          text: "VL Credits",
          value: "new_vl_credits",
          align: "center",
          valign: "center",
        },
        {
          text: "SL Credits",
          value: "new_sl_credits",
          align: "center",
          valign: "center",
        },
        {
          text: "Remarks",
          value: "remarks",
          align: "center",
          valign: "center",
        },
        // {
        //   text: "Action",
        //   value: "action",
        //   align: "center",
        //   valign: "center",
        // },
      ],
      convertionSelection: [
        { id: 1, description: "Vacation Leave to Sick Leave" },
        { id: 2, description: "Sick Leave/Vacation Leave" },
      ],
      selectedConvertion: null,
      selectedCredit: null,
      loading: false,
      employeeList: [],
      selectedEmployees: [],
      convertedSelectedEmployee: [],
      internal_action: null,
      indexToUpdate: null,
      remarks: null,
      vl_credits: null,
      sl_credits: null,
      emp_selected: null,
      addBFDialog: false,
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
        // if (data) {
        console.log(data);
        this.dialog = true;
        this.addedEmployees = [];
        this.selectedEmployees = [];
        this.convertedSelectedEmployee = [];
        this.emp_selected = null;
        this.loadPlantillaEmployees();
      },
      deep: true,
    },
    options: {
      handler() {},
      deep: true,
    },
  },
  computed: {
    formatEmployeeNameList() {
      let toReturn = this.employeeList;
      for (let i = 0; i < toReturn.length; i++) {
        toReturn[i].name = this.toTitleCase(toReturn[i].name);
      }
      return toReturn;
    },
  },
  methods: {
    pagination(data) {
      this.paginationData = data;
    },
    initialize() {},

    loadPlantillaEmployees() {
      this.axiosCall(
        "/employee/getAllPlantillandDesignatedEmployees",
        "GET"
      ).then((res) => {
        console.log(res.data);
        this.employeeList = res.data;
      });
    },

    getEmployeeVLSL() {
      this.axiosCall(
        "/employee-accum-leaves/getEmployeeLeaveCredits/" + this.emp_selected,
        "GET"
      ).then((res) => {
        console.log("leave credits", res.data);

        let vl = this.formatNumberValue(parseFloat(res.data.VL_TOTAL), 3);
        let sl = this.formatNumberValue(parseFloat(res.data.SL_TOTAL), 3);
        this.vl_credits = vl;
        this.sl_credits = sl;
      });
    },

    close() {
      this.eventHub.$emit("closeConvertVLToSLDialog", false);
      this.dialog = false;
    },

    getName(id) {
      let name;
      for (let i = 0; i < this.employeeList.length; i++) {
        if (this.employeeList[i].empID == id) {
          name = this.employeeList[i].name;
        }
      }
      return name;
    },

    addData() {
      this.CVLSLFormref = true;
      this.selectedConvertion = null;
      this.vl_credits = null;
      this.sl_credits = null;
      this.addBFDialog = true;
      this.internal_action = "Add";
    },

    edit(item, index) {
      this.indexToUpdate = index;
      this.internal_action == "Update";
      this.emp_selected = item.empID;
      this.sl_credits = item.sl_credits;
      this.vl_credits = item.vl_credits;
      this.selectedCredit = item.selectedCredit;
      this.remarks = item.remarks;
      this.addBFDialog = true;
    },

    remove(index) {
      this.addedEmployees.splice(index, 1);
    },

    addEmployee() {
      if (this.$refs.CVLSLFormref.validate()) {
        let valid = true;
        if (this.selectedEmployees.length > 0) {
          for (let i = 0; i < this.selectedEmployees.length; i++) {
            if (this.selectedEmployees[i].empID == this.emp_selected) {
              valid = false;
              break;
            }
          }
        }

        if (valid) {
          this.selectedEmployees.push({
            empID: this.emp_selected,
            name: this.getName(this.emp_selected),
            vl_credits: this.vl_credits,
            sl_credits: this.sl_credits,
          });
          //   convertion
          if (this.selectedConvertion == 1) {
            // Vacation Leave to Sick Leave
            this.convertedSelectedEmployee.push({
              empID: this.emp_selected,
              name: this.getName(this.emp_selected),
              old_vl_value: this.vl_credits,
              old_sl_value: this.sl_credits,
              convertion: this.selectedConvertion,
              new_vl_credits: 0,
              new_sl_credits: this.formatNumberValue(
                (parseFloat(this.vl_credits) + parseFloat(this.sl_credits)) *
                  2.3,
                3
              ),
              remarks: this.remarks,
            });
          } else {
            // Vacation Leave and Sick Leave
            let divideCredit = (parseFloat(this.sl_credits) / 2.3) * 0.5;

            this.convertedSelectedEmployee.push({
              empID: this.emp_selected,
              name: this.getName(this.emp_selected),
              old_sl_value: this.sl_credits,
              convertion: this.selectedConvertion,
              new_vl_credits: this.formatNumberValue(divideCredit, 3),
              new_sl_credits: this.formatNumberValue(divideCredit, 3),
              remarks: this.remarks,
            });
          }

          this.emp_selected = null;
          this.sl_credits = null;
          this.vl_credits = null;
          this.remarks = null;
          this.selectedConvertion = null;
          this.addBFDialog = false;
        } else {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "Employee already added!";
        }
      }
    },

    getItemText(item) {
      if (item.subdescription) {
        return `${item.description}  (${item.subdescription})`;
      }
      return `${item.description} `;
    },

    submit() {
      if (this.convertedSelectedEmployee.length > 0) {
        let data = {
          employeeList: this.convertedSelectedEmployee,
        };
        this.axiosCall("/leave-credits/convertVLToSL", "POST", data).then(
          (res) => {
            if (res.data.status == 200) {
              this.dialog = false;
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "success";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
              this.close();
            } else if (res.data.status == 400) {
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "error";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
            }
          }
        );
      } else {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message = "No employee added!";
      }
    },

    getOffices() {
      this.axiosCall("/offices", "GET").then((res) => {
        this.officeList = res.data;
      });
    },

    getTypeOfLeaves() {
      this.axiosCall("/types-of-leave", "GET").then((res) => {
        this.type_of_leave_list = res.data;
      });
    },
  },
};
</script>
<style scoped>
table {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
}
table tr th,
table tr td {
  border-right: 1px solid #bbb;
  border-bottom: 1px solid #bbb;
  padding: 5px;
}

table tr th:first-child,
table tr td:first-child {
  border-left: 1px solid #bbb;
}
table tr th {
  background: #eee;

  border-top: solid 1px #bbb;
}

/* top-left border-radius */
table tr:first-child th:first-child {
  border-top-left-radius: 6px;
}

/* top-right border-radius */
table tr:first-child th:last-child {
  border-top-right-radius: 6px;
}

/* bottom-left border-radius */
table tr:last-child td:first-child {
  border-bottom-left-radius: 6px;
}

/* bottom-right border-radius */
table tr:last-child td:last-child {
  border-bottom-right-radius: 6px;
}
</style>
