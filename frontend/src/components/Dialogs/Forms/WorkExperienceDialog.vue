<template>
  <div>
    <v-dialog v-model="dialog" eager scrollable max-width="600px">
      <v-form ref="WorkExpFormref" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span v-if="action == 'Add'"> Add Work Experience</span>
            <span v-if="action == 'Update'">Update Work Experience</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="closeD()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-col> </v-col>
          <v-card-text style="max-height: 700px">
            <v-container>
              <v-row no-gutters>
                <v-col cols="12">
                  <v-menu
                    ref="wExpDateFrom"
                    :close-on-content-click="false"
                    :return-value.sync="workExpModel.date_from"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        color="#6DB249"
                        dense
                        v-model="workExpModel.date_from"
                        :rules="[formRules.required]"
                        chips
                        small-chips
                        label="Date from"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="workExpModel.date_from"
                      no-title
                      scrollable
                      color="#6DB249"
                    >
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        color="#6DB249"
                        @click="$refs.wExpDateFrom.save(workExpModel.date_from)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" class="mb-4">
                  <v-checkbox
                    v-model="workExpModel.is_present_date_to"
                    label="Present date"
                    dense
                    color="#6DB249"
                    class="ma-0 pa-0"
                    hide-details
                  ></v-checkbox>
                </v-col>
                <v-col cols="12" v-if="!workExpModel.is_present_date_to">
                  <v-menu
                    ref="wExpDateTo"
                    :close-on-content-click="false"
                    :return-value.sync="workExpModel.date_to"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        dense
                        v-model="workExpModel.date_to"
                        :rules="
                          workExpModel.is_present_date_to
                            ? []
                            : [formRules.required]
                        "
                        chips
                        small-chips
                        label="Date to"
                        color="#6DB249"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      color="#6DB249"
                      v-model="workExpModel.date_to"
                      no-title
                      scrollable
                    >
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        color="#6DB249"
                        @click="$refs.wExpDateTo.save(workExpModel.date_to)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="workExpModel.position"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="Position Title"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="workExpModel.company"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="Department/Agency/Office/Company"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-autocomplete
                    @change="changeSalaryGrade()"
                    v-model="workExpModel.salary_grade"
                    :rules="[]"
                    :items="sgList"
                    dense
                    outlined
                    required
                    label="Salary Grade"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-autocomplete>
                </v-col>

                <v-col cols="12">
                  <v-autocomplete
                    @change="changeSalaryGrade()"
                    v-model="workExpModel.salary_grade_step"
                    :items="sgStepList"
                    :rules="[]"
                    dense
                    outlined
                    required
                    label="Salary Grade Step"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-autocomplete>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="workExpModel.month_salary"
                    :rules="[formRules.numberRequired]"
                    dense
                    outlined
                    required
                    label="Monthly Salary"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="workExpModel.appointment_status"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="Status of Appointment"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-select
                    v-model="workExpModel.gov_service"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    label="Government Service"
                    :items="govServiceAns"
                    class="rounded-lg"
                    color="#6DB249"
                  >
                  </v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions v-if="action == 'Add'" class="pa-5">
            <v-spacer></v-spacer>
            <v-btn color="red" outlined @click="closeD()">
              <v-icon>mdi-close-circle-outline</v-icon>
              Cancel
            </v-btn>
            <v-btn color="#5a67da" class="white--text" @click="addWorkExp()">
              <v-icon>mdi-check-circle</v-icon>
              Save Details
            </v-btn>
          </v-card-actions>

          <v-card-actions v-if="action == 'Update'" class="pa-5">
            <v-spacer></v-spacer>
            <v-btn color="red" outlined @click="closeD()">
              <v-icon>mdi-close-circle-outline</v-icon>
              Cancel
            </v-btn>
            <v-btn color="#5a67da" class="white--text" @click="updateWorkExp()">
              <v-icon>mdi-check-circle</v-icon>
              Update Details
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
      govServiceAns: ["Yes", "No"],
      month_salary: null,
      sgList: [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
        32,
        33,
      ],
      sgStepList: [1, 2, 3, 4, 5, 6, 7, 8],
      // is_date_to_present: false,
      workExpModel: {
        id: null,
        is_present_date_to: null,
        date_from: null,
        date_to: null,
        position: null,
        company: null,
        month_salary: null,
        salary_grade: null,
        salary_grade_step: null,
        appointment_status: null,
        gov_service: "No",
      },
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
        this.$refs.WorkExpFormref.resetValidation();
        if (data.id) {
          // this.workExpModel.id = data.id;
          this.workExpModel = data;
          this.workExpModel.salary_grade = parseInt(data.salary_grade);
          this.workExpModel.salary_grade_step = parseInt(
            data.salary_grade_step
          );
          this.month_salary = data.month_salary;
          this.workExpModel.month_salary = data.month_salary;
          this.workExpModel.gov_service = data.gov_service ? "Yes" : "No";
        } else {
          this.$refs.WorkExpFormref.reset();
        }

        // else {
        //   this.workExpModel.id = null;
        //   this.workExpModel.is_present_date_to = null;
        //   this.workExpModel.date_from = null;
        //   this.workExpModel.date_to = null;
        //   this.workExpModel.position = null;
        //   this.workExpModel.company = null;
        //   this.workExpModel.month_salary = null;
        //   this.workExpModel.salary_grade = null;
        //   this.workExpModel.salary_grade_step = null;
        //   this.workExpModel.appointment_status = null;
        //   this.workExpModel.gov_service = "No";
        // }

        // this.is_date_to_present = data.date_to == null ? true : false;
      },
      deep: true,
    },
  },

  methods: {
    closeD() {
      this.eventHub.$emit("closeWorkDialog", false);
      this.dialog = false;
    },

    changeSalaryGrade() {
      if (
        this.workExpModel.salary_grade &&
        this.workExpModel.salary_grade_step
      ) {
        this.axiosCall(
          "/salary-grade/findBySgStep/" +
            this.workExpModel.salary_grade +
            "/" +
            this.workExpModel.salary_grade_step,
          "GET"
        ).then((res) => {
          if (res.data) {
            console.log("sal ", res.data.monthly_salary);
            this.month_salary = parseInt(res.data.monthly_salary);
            this.workExpModel.month_salary = parseInt(res.data.monthly_salary);
          }
        });
      }
      //  else {
      //   this.month_salary = null;
      // }
    },

    addWorkExp() {
      if (this.$refs.WorkExpFormref.validate()) {
        // this.workExpModel.date_to = this.is_date_to_present
        //   ? null
        //   : this.workExpModel.date_to;
        this.workExpModel.month_salary = this.month_salary;

        this.$emit("addWorkExp", this.workExpModel);
        this.closeD();
      }
    },
    updateWorkExp() {
      if (this.$refs.WorkExpFormref.validate()) {
        this.workExpModel.month_salary = this.month_salary;

        // this.workExpModel.date_to = this.is_date_to_present
        //   ? null
        //   : this.workExpModel.date_to;
        // this.workExpModel.month_salary = this.month_salary;

        this.$emit("updateWorkExp", this.workExpModel);
        this.closeD();
      }
    },
  },
};
</script>
