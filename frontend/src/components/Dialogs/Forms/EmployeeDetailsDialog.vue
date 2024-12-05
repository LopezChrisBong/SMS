<template>
  <div>
    <v-dialog v-model="dialog" scrollable max-width="600px">
      <v-card>
        <v-card-title dark class="dialog-header">
          <span v-if="action == 'Add'"> Add New Employee Type</span>
          <span v-if="action == 'Update'">Employment Details</span>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="close()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-col> </v-col>
        <v-card-text style="max-height: 700px" class="my-4">
          <v-form ref="Formref" @submit.prevent>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="employeeDetModel.name"
                    dense
                    readonly
                    required
                    label="Employee Name"
                    color="#93CB5B"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="employeeDetModel.empID"
                    dense
                    required
                    label="Employee ID"
                    color="#93CB5B"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-menu
                    ref="dateHiredMenu"
                    :close-on-content-click="false"
                    :return-value.sync="employeeDetModel.date_hired"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        label="Date hired"
                        dense
                        v-model="employeeDetModel.date_hired"
                        :rules="[formRules.required]"
                        chips
                        readonly
                        small-chips
                        color="#6DB249"
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="employeeDetModel.date_hired"
                      no-title
                      color="#6DB249"
                      scrollable
                    >
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        color="#6DB249"
                        @click="
                          $refs.dateHiredMenu.save(employeeDetModel.date_hired)
                        "
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>

                <v-col cols="12">
                  <v-autocomplete
                    v-model="employeeDetModel.empStatusID"
                    :rules="[formRules.required]"
                    dense
                    label="Employment Status"
                    class="rounded-lg"
                    item-text="description"
                    item-value="id"
                    color="#93CB5B"
                    :items="empStatusList"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    label="Position"
                    v-model="employeeDetModel.positionID"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    item-text="description"
                    item-value="id"
                    color="#93CB5B"
                    :items="positionList"
                  >
                  </v-autocomplete>
                </v-col>

                <v-col
                  cols="12"
                  v-if="
                    employeeDetModel.positionID == 2 ||
                      employeeDetModel.positionID == 3 ||
                      employeeDetModel.positionID == 20 ||
                      employeeDetModel.positionID == 21 ||
                      employeeDetModel.positionID == 22 ||
                      employeeDetModel.positionID == 23 ||
                      employeeDetModel.positionID == 24 ||
                      employeeDetModel.positionID == 25 ||
                      employeeDetModel.positionID == 26 ||
                      employeeDetModel.positionID == 27 ||
                      employeeDetModel.positionID == 28 ||
                      employeeDetModel.positionID == 29 ||
                      employeeDetModel.positionID == 30 ||
                      employeeDetModel.positionID == 31 ||
                      employeeDetModel.positionID == 32 ||
                      employeeDetModel.positionID == 33 ||
                      employeeDetModel.positionID == 34 ||
                      employeeDetModel.positionID == 35
                  "
                >
                  <v-autocomplete
                    label="Institute"
                    v-model="employeeDetModel.instituteID"
                    :rules="
                      employeeDetModel.positionID == 3 ||
                      employeeDetModel.positionID == 20 ||
                      employeeDetModel.positionID == 21 ||
                      employeeDetModel.positionID == 22 ||
                      employeeDetModel.positionID == 23 ||
                      employeeDetModel.positionID == 24 ||
                      employeeDetModel.positionID == 25 ||
                      employeeDetModel.positionID == 26 ||
                      employeeDetModel.positionID == 27 ||
                      employeeDetModel.positionID == 28 ||
                      employeeDetModel.positionID == 29 ||
                      employeeDetModel.positionID == 30 ||
                      employeeDetModel.positionID == 31 ||
                      employeeDetModel.positionID == 32 ||
                      employeeDetModel.positionID == 33 ||
                      employeeDetModel.positionID == 34 ||
                      employeeDetModel.positionID == 35
                        ? [formRules.required]
                        : []
                    "
                    dense
                    class="rounded-lg"
                    item-text="name"
                    item-value="id"
                    color="#93CB5B"
                    :items="instituteList"
                  >
                  </v-autocomplete>
                </v-col>
                <!-- <v-col cols="12">
                  <v-checkbox
                    class="mt-n4"
                    v-model="employeeDetModel.isDesignated"
                    label="Is Designated"
                  ></v-checkbox>
                  <v-autocomplete
                    label="Designation"
                    v-model="employeeDetModel.designationID"
                    :rules="[formRules.required]"
                    v-if="employeeDetModel.isDesignated"
                    dense
                    class="rounded-lg"
                    item-text="description"
                    item-value="id"
                    color="#93CB5B"
                    :items="designationList"
                  >
                  </v-autocomplete>
                </v-col> -->

                <v-col cols="12">
                  <v-autocomplete
                    label="Office"
                    v-model="employeeDetModel.officeID"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    item-text="name"
                    item-value="id"
                    color="#93CB5B"
                    :items="officeList"
                  >
                  </v-autocomplete>
                </v-col>

                <!-- <v-col cols="12">
                  <v-select
                    v-if="!employeeDetModel.noWfh"
                    :items="weekList"
                    label="Work From Home"
                    color="#93CB5B"
                    dense
                    v-model="employeeDetModel.wfh"
                  ></v-select>
                  <v-checkbox
                    v-model="employeeDetModel.noWfh"
                    label="No Work From Home"
                  ></v-checkbox>
                </v-col> -->
                <v-col cols="12">
                  <v-select
                    :items="statusList"
                    label="Status"
                    color="#93CB5B"
                    dense
                    v-model="employeeDetModel.isActive"
                  ></v-select>
                </v-col>
                <v-col cols="12" v-if="employeeDetModel.isActive == 'Inactive'">
                  <v-autocomplete
                    :items="inActiveStatusList"
                    label="Inactive type"
                    item-text="type"
                    item-value="id"
                    :rules="
                      employeeDetModel.isActive == 'Inactive'
                        ? [formRules.required]
                        : []
                    "
                    color="#93CB5B"
                    dense
                    v-model="employeeDetModel.inactive_type"
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions v-if="action == 'Add'" class="pa-5">
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
          <v-btn color="#5a67da" class="white--text" @click="addUserDetail()">
            <v-icon>mdi-check-circle</v-icon>
            Save Details
          </v-btn>
        </v-card-actions>

        <v-card-actions v-if="action == 'Update'" class="pa-5">
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="close()">
            <v-icon>mdi-close-circle-outline</v-icon>
            Cancel
          </v-btn>
          <v-btn
            color="#5a67da"
            class="white--text"
            @click="updateUserDetail()"
          >
            <v-icon>mdi-check-circle</v-icon>
            Update Details
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
      employeeDetModel: {
        id: null,
        name: null,
        positionID: null,
        officeID: null,
        designationID: null,
        isDesignated: false,
        empStatusID: null,
        instituteID: null,
        empID: null,
        date_hired: null,
        wfh: null,
        noWfh: false,
        isActive: null,
        inactive_type: null,
      },
      weekList: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      statusList: ["Active", "Inactive"],
      inActiveStatusList: [
        { id: 1, type: "Resigned" },
        { id: 2, type: "Retired" },
        { id: 3, type: "End of Contract" },
      ],
      designationList: [],
      officeList: [],
      positionList: [],
      empStatusList: [],
      instituteList: [],
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
        if (data) {
          this.dialog = true;
          if (data.id != null) {
            this.getEmploymentDetail(data);
            this.getOffices();
            this.getPositions();
            this.getDesignations();
            this.getEmpStatus();
            this.getInstitutes();
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    close() {
      this.eventHub.$emit("closeEmployeeDetailDialog", false);
      this.dialog = false;
    },
    getEmploymentDetail(data) {
      this.axiosCall("/employee/user/" + data.id, "GET").then((res) => {
        this.employeeDetModel.id = data.id;
        this.employeeDetModel.name = data.mname
          ? data.fname + " " + data.mname[0] + ". " + data.lname
          : data.fname + " " + data.lname;
        this.employeeDetModel.officeID = res.data.officeID;
        this.employeeDetModel.designationID = res.data.designationID;
        this.employeeDetModel.isDesignated = res.data.designationID
          ? true
          : false;

        this.employeeDetModel.empStatusID = res.data.empStatusID;
        this.employeeDetModel.instituteID = res.data.instituteID;
        this.employeeDetModel.positionID = res.data.positionID.toString();
        this.employeeDetModel.empID = res.data.empID;
        this.employeeDetModel.date_hired = res.data.date_hired;
        this.employeeDetModel.wfh = res.data.wfh;
        this.employeeDetModel.inactive_type = res.data.inactive_type;
        this.employeeDetModel.noWfh = res.data.wfh == null ? true : false;
        this.employeeDetModel.isActive = res.data.isActive
          ? "Active"
          : "Inactive";
      });
    },

    getOffices() {
      this.axiosCall("/offices", "GET").then((res) => {
        this.officeList = res.data;
      });
    },
    getPositions() {
      this.axiosCall("/positions", "GET").then((res) => {
        this.positionList = res.data;
      });
    },
    getDesignations() {
      this.axiosCall("/designations", "GET").then((res) => {
        this.designationList = res.data;
      });
    },
    getEmpStatus() {
      this.axiosCall("/employment-status", "GET").then((res) => {
        this.empStatusList = res.data;
      });
    },
    getInstitutes() {
      this.axiosCall("/institutes", "GET").then((res) => {
        this.instituteList = res.data;
      });
    },
    // addUserDetail() {
    //   if (this.$refs.Formref.validate()) {
    //     this.axiosCall(
    //       "/employment-status",
    //       "POST",
    //       this.employeeDetModel
    //     ).then((res) => {
    //       if (res.data.status == 201) {
    //         this.dialog = false;
    //         this.fadeAwayMessage.show = true;
    //         this.fadeAwayMessage.type = "success";
    //         this.fadeAwayMessage.message = res.data.msg;
    //         this.fadeAwayMessage.header = "System Message";
    //         this.$refs.Formref.reset();
    //         this.closeDialog();
    //       } else if (res.data.status == 400) {
    //         this.dialog = false;
    //         this.fadeAwayMessage.show = true;
    //         this.fadeAwayMessage.type = "error";
    //         this.fadeAwayMessage.header = "System Message";
    //         this.fadeAwayMessage.message = res.data.msg;
    //         this.$refs.Formref.reset();
    //         this.closeDialog();
    //       }
    //     });
    //   }
    // },
    updateUserDetail() {
      if (this.$refs.Formref.validate()) {
        this.employeeDetModel.positionID = parseInt(
          this.employeeDetModel.positionID
        );
        console.log(this.employeeDetModel);
        let data = {
          user_detailID: this.employeeDetModel.id,
          positionID: this.employeeDetModel.positionID,
          designationID: this.employeeDetModel.isDesignated
            ? this.employeeDetModel.designationID
            : null,
          officeID: this.employeeDetModel.officeID,
          empStatusID: this.employeeDetModel.empStatusID,
          date_hired: this.employeeDetModel.date_hired,
          instituteID: this.employeeDetModel.instituteID,
          empID: this.employeeDetModel.empID,
          wfh: this.employeeDetModel.noWfh ? null : this.employeeDetModel.wfh,
          isActive: this.employeeDetModel.isActive == "Active" ? true : false,
          inactive_type: this.employeeDetModel.inactive_type,
        };
        this.axiosCall("/employee/updateEmploymentDetail/", "POST", data).then(
          (res) => {
            if (res.data.status == 200) {
              this.dialog = false;
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "success";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
              this.close();
              this.$emit("refreshTable");
            } else if (res.data.status == 400) {
              this.dialog = false;
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "error";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
              this.$refs.Formref.reset();
              this.close();
            }
          }
        );
      }
    },
  },
};
</script>
