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
          Add Leave Credits <v-spacer></v-spacer>
          <v-btn icon dark @click="close()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text
          style="max-height: 780px; max-width:1300px; margin: 0 auto; "
          class="mt-4"
        >
          <v-form class="mt-5" ref="MyLeaveFormref" @submit.prevent>
            <v-row>
              <v-col cols="12" class="pa-0">
                <v-tabs v-model="activeTab" color="#5a67da" align-tabs="left">
                  <v-tab
                    v-for="tab in tabList"
                    :key="tab.id"
                    @click="changeTab(tab)"
                    >{{ tab.name }}</v-tab
                  >
                </v-tabs>
                <v-divider></v-divider>
              </v-col>
              <v-col cols="12" v-if="tab == 1">
                <div class="text-h5">
                  Plantilla / Designated Faculty Employees
                </div>
                <v-divider></v-divider>
                <div
                  class="text-subtitle-1"
                  v-for="(item, i) in employeeList"
                  :key="i"
                >
                  {{ item.name }}
                </div>
              </v-col>
              <v-col cols="12" v-if="tab == 2">
                <div class="mb-4 d-flex justify-space-between">
                  <div class="text-h5">
                    Employee/s to add CTO
                  </div>
                  <v-btn @click="addCTO()" color="#5a67da" class="white--text">
                    <v-icon>mdi-plus</v-icon>
                    add
                  </v-btn>
                </div>
                <table v-if="cto_employeeList.length > 0">
                  <tr>
                    <th align="center">NAME</th>
                    <th align="center">CREDITS</th>
                    <th align="center">REMARKS</th>
                    <th align="center">ACTION</th>
                  </tr>

                  <tr v-for="(item, i) in cto_employeeList" :key="i">
                    <td align="center">{{ getName(item.empID) }}</td>
                    <td align="center">{{ item.credits }}</td>
                    <td align="center">{{ item.remarks }}</td>
                    <td align="center">
                      <v-btn
                        @click="editCTO(item, i)"
                        class="mx-1"
                        x-small
                        color="#5a67da"
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
                    </td>
                  </tr>
                </table>

                <table v-if="cto_employeeList.length == 0">
                  <tr>
                    <th align="center">NAME</th>
                    <th align="center">CREDITS</th>
                    <th align="center">REMARKS</th>
                    <th align="center">ACTION</th>
                  </tr>

                  <tr>
                    <td align="center" colspan="4" class="text-caption">
                      <i>No data found.</i>
                    </td>
                  </tr>
                </table>
              </v-col>
              <v-col cols="12" v-if="tab == 3">
                <div class="mb-4 d-flex justify-space-between">
                  <div class="text-h5">
                    Employee/s to Service Credits
                  </div>
                  <v-btn @click="addSR()" color="#5a67da" class="white--text">
                    <v-icon>mdi-plus</v-icon>
                    add
                  </v-btn>
                </div>
                <table v-if="sr_employeeList.length > 0">
                  <tr>
                    <th align="center">NAME</th>
                    <th align="center">CREDITS</th>
                    <th align="center">REMARKS</th>
                    <th align="center">ACTION</th>
                  </tr>

                  <tr v-for="(item, i) in sr_employeeList" :key="i">
                    <td align="center">{{ getName(item.empID) }}</td>
                    <td align="center">{{ item.credits }}</td>
                    <td align="center">{{ item.remarks }}</td>
                    <td align="center">
                      <v-btn
                        @click="editCTO(item, i)"
                        class="mx-1"
                        x-small
                        color="#5a67da"
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
                    </td>
                  </tr>
                </table>

                <table v-if="sr_employeeList.length == 0">
                  <tr>
                    <th align="center">NAME</th>
                    <th align="center">CREDITS</th>
                    <th align="center">REMARKS</th>
                    <th align="center">ACTION</th>
                  </tr>

                  <tr>
                    <td align="center" colspan="4" class="text-caption">
                      <i>No data found.</i>
                    </td>
                  </tr>
                </table>
              </v-col>
              <v-col cols="12" v-if="tab == 4">
                <div class="text-h5">
                  Plantilla / Designated Faculty Employees
                </div>
                <v-divider></v-divider>

                <table>
                  <tr>
                    <th>Name</th>
                    <th>SPL Added</th>
                  </tr>
                  <tr v-for="(item, i) in spl_employeeList" :key="i">
                    <td>{{ item.name }}</td>
                    <td align="center">
                      <v-icon color="#5a67da" v-if="item.SPL">mdi-check</v-icon
                      ><v-icon color="red" v-if="!item.SPL">mdi-close</v-icon>
                    </td>
                  </tr>
                </table>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-5">
          <v-spacer></v-spacer>
          <v-btn
            color="red"
            outlined
            @click="
              closeDialog();
              dialog = false;
            "
          >
            <v-icon>mdi-close-circle-outline</v-icon>
            Cancel
          </v-btn>
          <v-btn
            v-if="tab == 1"
            :color="$vuetify.theme.themes.light.submitBtns"
            class="white--text"
            @click="addCredits()"
          >
            <v-icon>mdi-check-circle</v-icon>
            SUBMIT
          </v-btn>
          <v-btn
            @click="submitCTO()"
            v-if="tab == 2"
            :color="$vuetify.theme.themes.light.submitBtns"
            class="white--text"
          >
            <v-icon>mdi-check-circle</v-icon>
            SUBMIT
          </v-btn>
          <v-btn
            @click="submitSR()"
            v-if="tab == 3"
            :color="$vuetify.theme.themes.light.submitBtns"
            class="white--text"
          >
            <v-icon>mdi-check-circle</v-icon>
            SUBMIT
          </v-btn>
          <v-btn
            @click="submitSPL()"
            v-if="tab == 4"
            :color="$vuetify.theme.themes.light.submitBtns"
            class="white--text"
          >
            <v-icon>mdi-check-circle</v-icon>
            SUBMIT
          </v-btn>
        </v-card-actions>

        <v-card-actions v-if="action == 'Update'" class="pa-5">
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="close()">
            <v-icon>mdi-close-circle-outline</v-icon>
            Cancel
          </v-btn>
          <v-btn
            :color="$vuetify.theme.themes.light.submitBtns"
            class="white--text"
            @click="updateUserDetail()"
          >
            <v-icon>mdi-check-circle</v-icon>
            Update Details
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="addCTODialog"
      eager
      scrollable
      persistent
      max-width="800px"
      transition="dialog-bottom-transition"
    >
      <v-form ref="CTOFormref" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>{{ internal_action }} Employee/s</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="addCTODialog = false">
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
      activeTab: { id: 1, name: "Add VL/SL Credits" },
      tab: 1,
      tabList: [
        { id: 1, name: "Add VL/SL Credits" },
        { id: 2, name: "Add CTO" },
        { id: 3, name: "Add Service Credits" },
        { id: 4, name: "Add SPL Credits" },
      ],
      employeeList: [],
      cto_employeeList: [],
      sr_employeeList: [],
      spl_employeeList: [],
      internal_action: null,
      indexToUpdate: null,
      remarks: null,
      credits: null,
      emp_selected: null,
      addCTODialog: false,
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
        console.log(data);
        // if (data) {
        this.activeTab = { id: 1, name: "VL/SL Credits" };
        this.tab = 1;
        this.dialog = true;
        this.loadPlantillaEmployees();

        this.getTypeOfLeaves();
      },
      deep: true,
    },
  },
  methods: {
    changeTab(tab) {
      this.activeTab = tab;
      this.tab = tab.id;
      if (this.tab != 4) {
        this.loadPlantillaEmployees();
      } else {
        this.loadEmployeesToAddSPL();
      }
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

    loadEmployeesToAddSPL() {
      this.axiosCall("/employee-accum-leaves/getEmployeesSPL", "GET").then(
        (res) => {
          this.spl_employeeList = res.data;
        }
      );
    },

    close() {
      this.eventHub.$emit("closeAddLeaveCreditsDialog", false);
      this.dialog = false;
    },

    addCTO() {
      this.addCTODialog = true;
      this.$refs.CTOFormref.reset();
      this.$refs.CTOFormref.resetValidation();
      this.internal_action = "Add";
    },
    addSR() {
      this.addCTODialog = true;
      this.$refs.CTOFormref.reset();
      this.$refs.CTOFormref.resetValidation();
      this.internal_action = "Add";
    },

    submitSPL() {
      let data = {
        employeeList: this.cto_employeeList,
      };
      this.axiosCall("/leave-credits/addSPL", "POST", data).then((res) => {
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

    editCTO(item, index) {
      this.indexToUpdate = index;
      this.internal_action == "Update";
      this.emp_selected = item.empID;
      this.credits = item.credits;
      this.remarks = item.remarks;
      this.addCTODialog = true;
    },

    removeCTO(index) {
      this.cto_employeeList.splice(index, 1);
    },
    save() {
      if (this.$refs.CTOFormref.validate()) {
        if (this.tab == 2) {
          let valid = true;
          if (this.cto_employeeList.length > 0) {
            for (let i = 0; i < this.cto_employeeList.length; i++) {
              if (this.cto_employeeList[i].empID == this.emp_selected) {
                valid = false;
                break;
              }
            }
          }

          if (valid) {
            this.cto_employeeList.push({
              empID: this.emp_selected,
              remarks: this.remarks,
              credits: this.credits,
            });
            this.emp_selected = null;
            this.remarks = null;
            this.credits = null;
            this.addCTODialog = false;
          } else {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = "Employee already added!";
          }
        } else if (this.tab == 3) {
          let valid = true;
          if (this.sr_employeeList.length > 0) {
            for (let i = 0; i < this.sr_employeeList.length; i++) {
              if (this.sr_employeeList[i].empID == this.emp_selected) {
                valid = false;
                break;
              }
            }
          }

          if (valid) {
            this.sr_employeeList.push({
              empID: this.emp_selected,
              remarks: this.remarks,
              credits: this.credits,
            });
            this.emp_selected = null;
            this.remarks = null;
            this.credits = null;
            this.addCTODialog = false;
          } else {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = "Employee already added!";
          }
        }
      }
    },

    getItemText(item) {
      if (item.subdescription) {
        return `${item.description}  (${item.subdescription})`;
      }
      return `${item.description} `;
    },
    addCredits() {
      if (this.employeeList.length > 0) {
        let data = {
          employeeList: this.employeeList,
        };
        this.axiosCall("/leave-credits/", "POST", data).then((res) => {
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
        this.fadeAwayMessage.message = "Employee list is empty!";
      }
    },

    submitCTO() {
      if (this.cto_employeeList.length > 0) {
        let data = {
          employeeList: this.cto_employeeList,
        };
        this.axiosCall("/leave-credits/addCTO", "POST", data).then((res) => {
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
        this.fadeAwayMessage.message = "No employee added!";
      }
    },

    submitSR() {
      if (this.sr_employeeList.length > 0) {
        let data = {
          employeeList: this.sr_employeeList,
        };
        this.axiosCall("/leave-credits/addSR", "POST", data).then((res) => {
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
