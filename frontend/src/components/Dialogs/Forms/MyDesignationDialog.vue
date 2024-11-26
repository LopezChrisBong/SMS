<template>
  <div>
    <v-dialog v-model="dialog" eager scrollable max-width="900px">
      <v-form ref="MyDesignationFormref" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>{{ action }} Designation</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="closeD()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 700px" class="my-4">
            <v-container>
              <v-row>
                <v-col cols="12" class="pa-0 pt-2 px-4">
                  <v-autocomplete
                    outlined
                    v-model="assigned_office"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="Assigned Office"
                    color="#6DB249"
                    item-text="name"
                    item-value="id"
                    :items="officeList"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" class="pa-0 pt-2 px-4">
                  <v-autocomplete
                    outlined
                    v-model="designationID"
                    :rules="[formRules.required]"
                    item-text="description"
                    item-value="id"
                    :items="designationList"
                    dense
                    class="rounded-lg"
                    label="Designation"
                    color="#6DB249"
                  >
                  </v-autocomplete>
                </v-col>

                <v-col cols="12" class="pa-0 pt-2 px-4">
                  <v-text-field
                    outlined
                    v-model="units"
                    :rules="[formRules.zeroAllowed]"
                    dense
                    required
                    label="Units Deload"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" class="pa-0 pt-2 px-4">
                  <v-text-field
                    outlined
                    v-model="specialOrderNo"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="Special Order"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="12" class="pa-0 pt-2 px-4">
                  <v-menu
                    ref="effectivityDateMenu"
                    :close-on-content-click="false"
                    :return-value.sync="effectivityDate"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        dense
                        v-model="effectivityDate"
                        :rules="[formRules.required]"
                        chips
                        small-chips
                        label="Effectivity Date"
                        color="#6DB249"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      color="#6DB249"
                      v-model="effectivityDate"
                      no-title
                      scrollable
                    >
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        color="#6DB249"
                        @click="$refs.effectivityDateMenu.save(effectivityDate)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <!-- 
                <v-col cols="12" class="pa-0 pt-2 px-4">
                  <v-autocomplete
                    outlined
                    small-chips
                    required
                    deletable-chips
                    v-model="ctdModel.syID"
                    :rules="[formRules.required]"
                    :items="syList"
                    item-value="id"
                    :item-text="getSYItemText"
                    dense
                    class="rounded-lg"
                    label="School Year"
                    color="#6DB249"
                  >
                  </v-autocomplete>
                </v-col>

                <v-col xs="12" sm="6" md="6" xl="6" class="pa-0 pt-2 px-4">
                  <v-autocomplete
                    outlined
                    v-model="ctdModel.sem"
                    :rules="[formRules.required]"
                    dense
                    :items="semList"
                    class="rounded-lg"
                    label="Semester"
                    item-text="title"
                    item-value="id"
                    color="#6DB249"
                  ></v-autocomplete>
                </v-col> -->
                <v-col cols="12" class="pa-0 pt-2 px-4">
                  <v-select
                    outlined
                    :rules="[formRules.required]"
                    :items="statusList"
                    label="Status"
                    color="#93CB5B"
                    dense
                    v-model="isActive"
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions class="pa-5">
            <v-spacer></v-spacer>
            <v-btn color="red" outlined @click="closeD()">
              <v-icon>mdi-close-circle-outline</v-icon>
              Cancel
            </v-btn>
            <v-btn
              color="#519043"
              class="white--text"
              v-if="action == 'Add'"
              @click="addnew()"
            >
              <v-icon>mdi-check-circle</v-icon>
              Add
            </v-btn>
            <v-btn
              color="#519043"
              class="white--text"
              v-if="action == 'Update'"
              @click="update()"
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
      dialog: false,
      empID: null,
      designationID: null,
      units: null,
      effectivityDate: null,
      specialOrderNo: null,
      assigned_office: null,

      schoolYearFrom: null,
      schoolYearTo: null,
      sem: null,
      isActive: null,

      syList: [],

      statusList: ["Active", "Inactive"],
      semList: [
        { id: 1, title: "First Semester" },
        { id: 2, title: "Second Semester" },
        { id: 3, title: "Summer" },
      ],

      tapTimeList: [
        { id: 1, title: "First Part" },
        { id: 2, title: "Second Part" },
        { id: 3, title: "Overtime" },
      ],
      tapTimePartID: null,
      designationList: [],
      officeList: [],

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
        this.dialog = true;

        if (data.id) {
          this.initialize();
          this.id = data.id;
          this.designationID = parseInt(data.designationID);
          this.getEmpDetails();
          this.units = data.units == 0 ? "0" : data.units;
          this.effectivityDate = data.effectivityDate;
          this.specialOrderNo = data.specialOrderNo;
          this.assigned_office = data.assigned_office;
          this.isActive = data.isActive ? "Active" : "Inactive";
        } else {
          this.initialize();
          this.getEmpDetails();
          this.units = 0;
          this.empID = data.empID;
          this.effectivityDate = null;
          this.specialOrderNo = null;
          this.designationID = null;
          this.sem = null;
          this.isActive = null;
        }
      },
      deep: true,
    },
  },

  methods: {
    initialize() {
      this.getOffices();
      this.getSchoolYear();
      this.getDesignations();
      //   this.getEmpStatus();
      //   this.getInstitutes();
      //   this.getUserType();
    },
    getSYItemText(item) {
      return `${item.syFrom} - ${item.syTo}`;
    },
    getPart(id) {
      let prt;
      for (let i = 0; i < this.tapTimeList.length; i++) {
        if (this.tapTimeList[i].id == id) {
          prt = this.tapTimeList[i].title;
        }
      }
      return prt;
    },

    computeDaylist() {
      let days = [];
      for (let i = 0; i < this.schedList.length; i++) {
        let el = this.schedList[i].workSched;
        for (let j = 0; j < el.length; j++) {
          days.push(el[j]);
        }
      }

      // setting disabled property
      if (days.length > 0) {
        for (let i = 0; i < days.length; i++) {
          for (let j = 0; j < this.dayList.length; j++) {
            let dayListName = this.dayList[j].name;
            if (days[i] == dayListName) {
              this.dayList[j].disabled = true;
            }
          }
        }
      } else {
        for (let i = 0; i < this.dayList.length; i++) {
          this.dayList[i].disabled = false;
        }
      }
    },

    closeSchedDialog() {
      this.$refs.schedDialogRef.resetValidation();
      this.schedDialog = false;
    },

    // closeSchedTimeDialog() {
    //   this.$refs.schedTimeDialogRef.resetValidation();
    //   this.schedTimeDialog = false;
    // },

    // addSched() {
    //   this.schedDialog = true;
    //   this.schedTimeList = [];
    //   this.schedAction = "Add";
    //   this.$refs.schedDialogRef.resetValidation();
    //   this.computeDaylist();
    //   this.schedWfh = null;
    // },
    // editSched(item, index) {
    //   this.schedIndexToUpdate = index;
    //   this.schedWfh = item.workSched;
    //   this.schedTimeList = item.schedTimeList;
    //   for (let i = 0; i < item.workSched.length; i++) {
    //     let el = item.workSched[i];
    //     for (let j = 0; j < this.dayList.length; j++) {
    //       if (el == this.dayList[j].name) {
    //         this.dayList[j].disabled = false;
    //       }
    //     }
    //   }

    //   this.timePicker1 = item.timeIn;
    //   this.timePicker2 = item.timeOut;
    //   this.schedAction = "Update";
    //   this.schedDialog = true;
    // },

    // updateSched() {
    //   if (this.$refs.schedDialogRef.validate()) {
    //     this.schedList[this.schedIndexToUpdate].workSched = this.schedWfh;
    //     this.schedList[this.schedIndexToUpdate].timeIn = this.timePicker1;
    //     this.schedList[this.schedIndexToUpdate].timeOut = this.timePicker2;
    //     this.computeDaylist();
    //     this.schedDialog = false;
    //   } else {
    //     this.fadeAwayMessage.show = true;
    //     this.fadeAwayMessage.type = "error";
    //     this.fadeAwayMessage.header = "System Message";
    //     this.fadeAwayMessage.message = "Please fill up all fields!";
    //   }
    // },

    // addSchedTime() {
    //   this.schedTimeDialog = true;
    //   this.timePicker1 = "08:00";
    //   this.timePicker2 = "12:00";
    //   this.schedTimeAction = "Add";
    //   this.$refs.schedTimeDialogRef.resetValidation();
    // },
    // editSchedTime(time, index) {
    //   console.log(time, index);
    //   this.schedIndexToUpdate = index;

    //   this.timePicker1 = time.timeFrom;
    //   this.timePicker2 = time.timeTo;
    //   this.schedTimeAction = "Update";
    //   this.schedTimeDialog = true;
    // },

    // saveSchedTime() {
    //   if (this.$refs.schedTimeDialogRef.validate()) {
    //     this.schedTimeList.push({
    //       tapTimePartID: this.tapTimePartID,
    //       timeFrom: this.timePicker1,
    //       timeTo: this.timePicker2,
    //     });
    //     console.log(this.schedTimeList);
    //     this.schedTimeDialog = false;
    //   } else {
    //     this.fadeAwayMessage.show = true;
    //     this.fadeAwayMessage.type = "error";
    //     this.fadeAwayMessage.header = "System Message";
    //     this.fadeAwayMessage.message = "Please fill up all fields!";
    //   }
    // },

    // updateSchedTime() {
    //   if (this.$refs.schedTimeDialogRef.validate()) {
    //     this.schedTimeList[
    //       this.schedIndexToUpdate
    //     ].tapTimePartID = this.tapTimePartID;
    //     this.schedTimeList[this.schedIndexToUpdate].timeFrom = this.timePicker1;
    //     this.schedTimeList[this.schedIndexToUpdate].timeTo = this.timePicker2;
    //     this.schedIndexToUpdate = null;
    //     this.schedTimeDialog = false;
    //   } else {
    //     this.fadeAwayMessage.show = true;
    //     this.fadeAwayMessage.type = "error";
    //     this.fadeAwayMessage.header = "System Message";
    //     this.fadeAwayMessage.message = "Please fill up all fields!";
    //   }
    // },

    saveSched() {
      if (this.$refs.schedDialogRef.validate()) {
        if (this.schedTimeList.length > 0) {
          this.schedList.push({
            workSched: this.schedWfh,
            schedTimeList: this.schedTimeList,
            // timeIn: this.timePicker1,
            // timeOut: this.timePicker2,
          });
          this.schedTimeList = [];
          this.schedDialog = false;
          this.computeDaylist();
        } else {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "Please add time schedule/s!";
        }
      } else {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message = "Please fill up all fields!";
      }
    },

    getUserType() {
      this.axiosCall("/user-type/getAllUsertype", "GET").then((res) => {
        if (res.data) {
          this.usertypeList = res.data;
        }
      });
    },
    closeD() {
      this.eventHub.$emit("closeMyDesignationDialog", false);
      this.dialog = false;
    },
    addnew() {
      if (this.$refs.MyDesignationFormref.validate()) {
        let data = {
          designationID: this.designationID,
          effectivityDate: this.effectivityDate,
          specialOrderNo: this.specialOrderNo,
          assigned_office: this.assigned_office,

          units: this.units,
          isActive: this.isActive == "Active" ? true : false,
        };

        this.axiosCall("/my-designation", "POST", data).then((res) => {
          if (res.data.status == 201) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.$refs.MyDesignationFormref.reset();
            this.closeD();
          } else if (res.data.status == 400) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
          }
        });
      }
    },

    update() {
      if (this.$refs.MyDesignationFormref.validate()) {
        let data = {
          designationID: this.designationID,
          effectivityDate: this.effectivityDate,
          specialOrderNo: this.specialOrderNo,
          assigned_office: this.assigned_office,
          units: this.units,
          isActive: this.isActive == "Active" ? true : false,
        };

        this.axiosCall("/my-designation/" + this.id, "PATCH", data).then(
          (res) => {
            if (res.data.status == 200) {
              this.dialog = false;
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "success";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
              this.$refs.MyDesignationFormref.reset();
              this.closeD();
            } else if (res.data.status == 400) {
              this.dialog = false;
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "error";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
            }
          }
        );
      }
    },

    getSchoolYear() {
      this.axiosCall("/school-year", "GET").then((res) => {
        console.log(res.data);
        this.syList = res.data;
      });
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
