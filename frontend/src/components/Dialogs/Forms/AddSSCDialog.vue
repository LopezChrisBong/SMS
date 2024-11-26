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
          Add Special Service Credits <v-spacer></v-spacer>
          <v-btn icon dark @click="close()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text
          style="max-height: 780px; max-width:1300px; margin: 0 auto; "
          class="mt-4"
        >
          <v-row>
            <v-col cols="12" class="d-flex justify-end">
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
                @click="addCTO()"
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
              :items="ssc_employeeList"
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
                  @click="editCTO(item, i)"
                  class="mx-1"
                  x-small
                  color="#519043"
                  outlined
                >
                  edit </v-btn
                ><v-btn
                  @click="removeCTO(i)"
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
            @click="submitSCC()"
          >
            <v-icon>mdi-check-circle</v-icon>
            SUBMIT
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="addSSCDialog"
      eager
      scrollable
      persistent
      max-width="800px"
      transition="dialog-bottom-transition"
    >
      <v-form ref="SSCFormref" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>{{ internal_action }} SPL to Employee/s </span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="addSSCDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 800px" class="my-4">
            <v-row>
              <v-col class="mt-2" cols="12">
                <v-autocomplete
                  v-model="emp_selected"
                  :rules="[formRules.required]"
                  dense
                  outlined
                  label="Employee"
                  class="rounded-lg"
                  item-text="name"
                  item-value="empID"
                  color="#93CB5B"
                  :items="employeeList"
                >
                </v-autocomplete>
              </v-col>
              <v-col class="mt-2" cols="12">
                <v-text-field
                  v-model="credits"
                  :rules="[formRules.numberRequired]"
                  dense
                  outlined
                  class="rounded-lg"
                  label="Credits to Add"
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
          value: "empID",
          align: "start",
          valign: "center",
        },
        {
          text: "Credits",
          value: "credits",
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
      loading: false,
      employeeList: [],
      ssc_employeeList: [],
      internal_action: null,
      indexToUpdate: null,
      remarks: null,
      credits: null,
      emp_selected: null,
      addSSCDialog: false,
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
        this.loadPlantillaEmployees();
      },
      deep: true,
    },
    options: {
      handler() {},
      deep: true,
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

    close() {
      this.eventHub.$emit("closeCTODialog", false);
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

    addCTO() {
      this.addSSCDialog = true;
      this.$refs.SSCFormref.reset();
      this.$refs.SSCFormref.resetValidation();
      this.internal_action = "Add";
    },

    editCTO(item, index) {
      this.indexToUpdate = index;
      this.internal_action == "Update";
      this.emp_selected = item.empID;
      this.credits = item.credits;
      this.remarks = item.remarks;
      this.addSSCDialog = true;
    },

    removeCTO(index) {
      this.ssc_employeeList.splice(index, 1);
    },

    save() {
      if (this.$refs.SSCFormref.validate()) {
        let valid = true;
        if (this.ssc_employeeList.length > 0) {
          for (let i = 0; i < this.ssc_employeeList.length; i++) {
            if (this.ssc_employeeList[i].empID == this.emp_selected) {
              valid = false;
              break;
            }
          }
        }

        if (valid) {
          this.ssc_employeeList.push({
            empID: this.emp_selected,
            remarks: this.remarks,
            credits: this.credits,
          });
          this.emp_selected = null;
          this.remarks = null;
          this.credits = null;
          this.addSSCDialog = false;
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

    submitSCC() {
      if (this.ssc_employeeList.length > 0) {
        let data = {
          employeeList: this.ssc_employeeList,
        };
        this.axiosCall("/leave-credits/addSCC", "POST", data).then((res) => {
          if (res.data.status == 201) {
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
        });
      } else {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message = "No Employee added!";
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
