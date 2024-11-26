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
          Deduct Force Leave <v-spacer></v-spacer>
          <v-btn icon dark @click="close()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text
          style="max-height: 780px; max-width:1300px; margin: 0 auto; "
          class="mt-4"
        >
          <v-row class="mt-4">
            <v-col cols="12" class="d-flex justify-end">
              <v-select
                @change="loadPlantillaEmployees()"
                label="Year"
                outlined
                class="rounded-lg"
                color="#519043"
                dense
                :items="years"
                v-model="selectedYear"
              ></v-select>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                outlined
                prepend-inner-icon="search"
                label="Search"
                single-line
                hide-details
                class="rounded-lg"
                color="#519043"
                dense
              ></v-text-field>
            </v-col>
          </v-row>

          <v-card class="my-5 dt-container" elevation="0" outlined>
            <v-data-table
              v-model="selectedEmployee"
              :headers="headers"
              :items="selectableEmployees"
              :items-per-page="10"
              item-key="empID"
              :search="search"
              :options.sync="options"
              :loading="loading"
              @pagination="pagination"
              hide-default-footer
              show-select
            >
              <template
                v-slot:[`item.data-table-select`]="{ item, isSelected, select }"
              >
                <v-simple-checkbox
                  :ripple="false"
                  :value="isSelected"
                  :readonly="
                    item.employee_status == 'Cannot be deducted' ||
                      item.usedFL == 5
                  "
                  :disabled="
                    item.employee_status == 'Cannot be deducted' ||
                      item.usedFL == 5
                  "
                  @input="select($event)"
                ></v-simple-checkbox>
              </template>
              <template v-slot:[`item.totalBal`]="{ item }">
                {{ formatNumberValue(item.totalBal, 3) }}
              </template>
              <template v-slot:[`item.deductFL`]="{ item }">
                {{ 5 - item.usedFL }}
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
                color="#519043"
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
            @click="deductFL()"
          >
            <v-icon>mdi-check-circle</v-icon>
            SUBMIT
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
      years: [],
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
          text: "Status",
          value: "employee_status",
          align: "center",
          valign: "center",
        },
        {
          text: "Credit Balance",
          value: "totalBal",
          align: "center",
          valign: "center",
        },
        {
          text: "Used Force Leave",
          value: "usedFL",
          align: "center",
          valign: "center",
        },

        {
          text: "Force Leave to Deduct",
          value: "deductFL",
          align: "center",
          valign: "center",
        },
        // {
        //   text: "Credits to Deduct",
        //   value: "credits_to_deduct",
        //   align: "center",
        //   valign: "center",
        // },
      ],

      selectedEmployee: [],
      loading: false,
      employeeList: [],
      credits: null,
      selectedYear: null,
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
        this.employeeList = [];
        this.selectedEmployee = [];
        this.initialize();

        this.dialog = true;
      },
      deep: true,
    },
    options: {
      handler() {},
      deep: true,
    },
  },
  computed: {
    selectableEmployees() {
      return this.employeeList.map((x) => ({
        ...x,
        isSelectable: x.usedFL < 5 && x.employee_status != "Cannot be deducted",
      }));
    },
  },
  methods: {
    pagination(data) {
      this.paginationData = data;
    },
    initialize() {
      let d = new Date();
      let curYear = d.getFullYear();
      this.selectedYear = curYear;
      for (let i = curYear; i >= 2020; i--) {
        this.years.push(i);
      }
      this.loadPlantillaEmployees();
    },

    loadPlantillaEmployees() {
      this.axiosCall(
        "/employee/getAllPlantillaEmployeesToDeductFL/" + this.selectedYear,
        "GET"
      ).then((res) => {
        console.log(res.data);
        this.employeeList = res.data;
      });
    },

    close() {
      this.eventHub.$emit("closeDeductFLDialog", false);
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

    getItemText(item) {
      if (item.subdescription) {
        return `${item.description}  (${item.subdescription})`;
      }
      return `${item.description} `;
    },

    deductFL() {
      if (this.selectedEmployee.length == 0) {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message = "No employee/s selected!";
      } else {
        let data = [];
        // console.log(this.selectedEmployee);
        for (let i = 0; i < this.selectedEmployee.length; i++) {
          data.push({
            empID: this.selectedEmployee[i].id,
            user_detailID: this.selectedEmployee[i].user_detailID,
            credits_to_deduct: 5 - parseInt(this.selectedEmployee[i].usedFL),
          });
        }
        console.log("selected employees", data);

        // this.axiosCall("/leave-credits/deduct-fl/", "POST", {
        //   employeeList: data,
        //   year: this.selectedYear,
        // }).then((res) => {
        //   if (res.data.status == 200) {
        //     this.dialog = false;
        //     this.fadeAwayMessage.show = true;
        //     this.fadeAwayMessage.type = "success";
        //     this.fadeAwayMessage.header = "System Message";
        //     this.fadeAwayMessage.message = res.data.msg;
        //     this.close();
        //   } else if (res.data.status == 400) {
        //     this.dialog = false;
        //     this.fadeAwayMessage.show = true;
        //     this.fadeAwayMessage.type = "error";
        //     this.fadeAwayMessage.header = "System Message";
        //     this.fadeAwayMessage.message = res.data.msg;
        //     this.$refs.Formref.reset();
        //   }
        // });
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

    // updateUserDetail() {
    //   if (this.$refs.Formref.validate()) {
    //     this.employeeDetModel.positionID = parseInt(
    //       this.employeeDetModel.positionID
    //     );
    //     console.log(this.employeeDetModel);
    //     let data = {
    //       user_detailID: this.employeeDetModel.id,
    //       positionID: this.employeeDetModel.positionID,
    //       designationID: this.employeeDetModel.isDesignated
    //         ? this.employeeDetModel.designationID
    //         : null,
    //       officeID: this.employeeDetModel.officeID,
    //       empStatusID: this.employeeDetModel.empStatusID,
    //       date_hired: this.employeeDetModel.date_hired,
    //       instituteID: this.employeeDetModel.instituteID,
    //       empID: this.employeeDetModel.empID,
    //       wfh: this.employeeDetModel.noWfh ? null : this.employeeDetModel.wfh,
    //       isActive: this.employeeDetModel.isActive == "Active" ? true : false,
    //     };
    //     this.axiosCall("/employee/updateEmploymentDetail/", "POST", data).then(
    //       (res) => {
    //         if (res.data.status == 200) {
    //           this.dialog = false;
    //           this.fadeAwayMessage.show = true;
    //           this.fadeAwayMessage.type = "success";
    //           this.fadeAwayMessage.header = "System Message";
    //           this.fadeAwayMessage.message = res.data.msg;
    //           this.close();
    //         } else if (res.data.status == 400) {
    //           this.dialog = false;
    //           this.fadeAwayMessage.show = true;
    //           this.fadeAwayMessage.type = "error";
    //           this.fadeAwayMessage.header = "System Message";
    //           this.fadeAwayMessage.message = res.data.msg;
    //           this.$refs.Formref.reset();
    //         }
    //       }
    //     );
    //   }
    // },
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
