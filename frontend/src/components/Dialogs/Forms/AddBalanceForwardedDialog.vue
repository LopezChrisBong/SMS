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
          Add Balance Forwarded <v-spacer></v-spacer>
          <v-btn icon dark @click="close()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text
          style="max-height: 780px; max-width:1300px; margin: 0 auto; "
          class="mt-4"
        >
          <v-row>
            <v-col cols="6" class="">
              <div class="text-h6 d-flex item-center">
                <div class="mx-2"></div>
                <!-- <span>{{ formatDate(dateToSave) }}</span> -->
                <v-select
                  class=" mt-2"
                  label="Year"
                  color="#519043"
                  dense
                  @change="filterPlantillaEmployees()"
                  outlined
                  v-model="yearSelected"
                  :items="years"
                ></v-select>
              </div>
            </v-col>
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
                <v-icon>mdi-plus</v-icon>
                add
              </v-btn>
            </v-col>
          </v-row>

          <v-card class="my-5 dt-container" elevation="0" outlined>
            <v-data-table
              :headers="headers"
              :items="addedEmployees"
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
                  @click="edit(item, index)"
                  class="mx-1"
                  x-small
                  color="#519043"
                  outlined
                >
                  edit </v-btn
                ><v-btn
                  @click="remove(index)"
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
          <v-row class="mb-2 mx-5" align="center">
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
                :color="$vuetify.theme.themes.light.submitBtns"
                :length="paginationData.pageCount"
              >
              </v-pagination>
            </v-col>
          </v-row>
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
      <v-form ref="BFFormref" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>{{ internal_action }} Balance Forwarded to Employee</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="addBFDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 800px" class="my-4">
            <v-row>
              <v-col v-if="internal_action == 'Add'" class="mt-2" cols="12">
                <v-autocomplete
                  v-model="emp_selected"
                  :rules="internal_action == 'Add' ? [formRules.required] : []"
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
                <v-autocomplete
                  v-model="selectedCredit"
                  :rules="[formRules.required]"
                  dense
                  outlined
                  label="Type of Credit to Add"
                  class="rounded-lg"
                  item-text="description"
                  item-value="id"
                  color="#93CB5B"
                  :items="creditsToAdd"
                >
                </v-autocomplete>
              </v-col>
              <v-col v-if="selectedCredit == 1" class="mt-2" cols="12">
                <v-text-field
                  v-model="vl_credits"
                  :rules="selectedCredit == 1 ? [formRules.numberRequired] : []"
                  dense
                  outlined
                  class="rounded-lg"
                  label="VL Credits "
                  color="#93CB5B"
                >
                </v-text-field>
              </v-col>
              <v-col v-if="selectedCredit" class="mt-2" cols="12">
                <v-text-field
                  v-model="sl_credits"
                  :rules="selectedCredit ? [formRules.numberRequired] : []"
                  dense
                  outlined
                  class="rounded-lg"
                  label="SL Credits"
                  color="#93CB5B"
                >
                </v-text-field>
              </v-col>
              <v-col class="mt-2" cols="12">
                <v-textarea
                  rows="5"
                  v-model="remarks"
                  :rules="[formRules.required]"
                  dense
                  outlined
                  class="rounded-lg"
                  label="Remarks"
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
              v-if="internal_action == 'Add'"
              @click="save()"
              :color="$vuetify.theme.themes.light.submitBtns"
              class="white--text"
            >
              Add
            </v-btn>
            <v-btn
              @click="update()"
              v-if="internal_action == 'Update'"
              :color="$vuetify.theme.themes.light.submitBtns"
              class="white--text"
            >
              Update
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <!-- namelist -->
    <v-dialog
      v-model="nameListDialog"
      eager
      persistent
      max-width="800px"
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-card-title>Employees</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 300px;">
          <div class="text-body-1">
            Employee/s who added credit balance already exist
          </div>
          <div v-for="item in nameList" :key="item">{{ item }}</div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="nameListDialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
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
      nameListDialog: false,
      nameList: [],
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
          value: "empID",
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
        {
          text: "Remarks",
          value: "remarks",
          align: "center",
          valign: "center",
        },
        {
          text: "Action",
          value: "action",
          align: "center",
          valign: "center",
        },
      ],
      years: ["2023"],
      yearSelected: "2023",
      dateToSave: "2021-12-31",
      creditsToAdd: [
        {
          id: 1,
          description: "Vacation Leave and Sick Leave",
        },
        {
          id: 2,
          description: "Sick Leave only",
        },
      ],
      selectedCredit: null,
      loading: false,
      employeeList: [],
      addedEmployees: [],
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
        this.yearSelected = "2023";
        this.filterPlantillaEmployees();
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
        this.employeeList = res.data;
      });
    },

    filterPlantillaEmployees() {
      this.axiosCall(
        "/employee/filterPlantillaEmployees/" + this.yearSelected,
        "GET"
      ).then((res) => {
        this.employeeList = res.data;
      });
    },

    close() {
      this.eventHub.$emit("closeBalanceForwardedDialog", false);
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
      this.addBFDialog = true;
      this.$refs.BFFormref.reset();
      this.$refs.BFFormref.resetValidation();
      this.internal_action = "Add";
    },

    edit(item, index) {
      this.indexToUpdate = index;
      this.internal_action = "Update";
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

    update() {
      if (this.$refs.BFFormref.validate()) {
        this.addedEmployees[this.indexToUpdate].remarks = this.remarks;
        this.addedEmployees[
          this.indexToUpdate
        ].selectedCredit = this.selectedCredit;
        this.addedEmployees[this.indexToUpdate].vl_credits = this.vl_credits;
        this.addedEmployees[this.indexToUpdate].sl_credits = this.sl_credits;
        this.indexToUpdate = null;
        this.addBFDialog = false;
      }
    },

    save() {
      if (this.$refs.BFFormref.validate()) {
        let valid = true;
        if (this.addedEmployees.length > 0) {
          for (let i = 0; i < this.addedEmployees.length; i++) {
            if (this.addedEmployees[i].empID == this.emp_selected) {
              valid = false;
              break;
            }
          }
        }

        if (valid) {
          this.addedEmployees.push({
            empID: this.emp_selected,
            remarks: this.remarks,
            selectedCredit: this.selectedCredit,
            vl_credits: this.formatNumberValue(this.vl_credits, 3),
            sl_credits: this.formatNumberValue(this.sl_credits, 3),
          });
          this.emp_selected = null;
          this.remarks = null;
          this.sl_credits = null;
          this.vl_credits = null;
          this.remarks = null;
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
      if (this.addedEmployees.length > 0) {
        let date = this.yearSelected + "-12-31";
        let data = {
          employeeList: this.addedEmployees,
          dateToSave: date,
        };
        this.axiosCall("/leave-credits/addBalanceForwarded", "POST", data).then(
          (res) => {
            if (res.data.status == 201) {
              // if (res.data.nameList.length > 0) {
              //   this.nameList = res.data.nameList;
              //   this.nameListDialog = true;
              // } else {
              this.dialog = false;
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "success";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
              this.close();
              // }
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
