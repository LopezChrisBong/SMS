<template>
  <div>
    <v-dialog v-model="dialog" eager persistent scrollable max-width="600px">
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
                      :min="
                        workExpModel.date_from ? workExpModel.date_from : ''
                      "
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
                  <v-select
                    v-model="workExpModel.gov_service"
                    :rules="[formRules.required]"
                    dense
                    @change="changeGovService()"
                    outlined
                    label="Government Service"
                    :items="govServiceAns"
                    class="rounded-lg"
                    color="#6DB249"
                  >
                  </v-select>
                </v-col>

                <v-col
                  cols="12"
                  v-if="workExpModel.gov_service == 'Yes'"
                  class="mb-4"
                >
                  <v-checkbox
                    @change="setDept()"
                    v-model="workExpModel.is_in_DNSC"
                    label="Work is in DNSC"
                    dense
                    color="#6DB249"
                    hide-details
                  ></v-checkbox>
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
                    v-model="workExpModel.appointment_status"
                    :items="appointmentStatusList"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="Status of Appointment"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-autocomplete>
                  <v-text-field
                    v-model="temp_appointment_status"
                    v-if="workExpModel.appointment_status == 'Others'"
                    :rules="
                      workExpModel.appointment_status == 'Others'
                        ? [formRules.required]
                        : []
                    "
                    dense
                    outlined
                    required
                    label="Appointment"
                    class="rounded-lg mt-2"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>
                <!-- on going, update now -->
                <!-- v-if="
                      workExpModel.appointment_status == 'Permanent' ||
                        workExpModel.appointment_status == 'Temporary' ||
                        workExpModel.appointment_status == 'Coterminous' ||
                        workExpModel.appointment_status == 'Contract of Service'
                    " -->
                <v-col
                  cols="12"
                  v-if="
                    workExpModel.gov_service == 'Yes' &&
                      workExpModel.appointment_status != 'Job Order' &&
                      workExpModel.appointment_status != 'Casual' &&
                      workExpModel.appointment_status != 'Others' &&
                      workExpModel.appointment_status != 'Contract of Service'
                  "
                >
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

                <v-col
                  cols="12"
                  v-if="
                    workExpModel.gov_service == 'Yes' &&
                      workExpModel.appointment_status != 'Job Order' &&
                      workExpModel.appointment_status != 'Casual' &&
                      workExpModel.appointment_status != 'Others' &&
                      workExpModel.appointment_status != 'Contract of Service'
                  "
                >
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

                <v-col
                  v-if="
                    workExpModel.appointment_status == 'Permanent' ||
                      workExpModel.appointment_status == 'Temporary' ||
                      workExpModel.appointment_status == 'Coterminous' ||
                      workExpModel.appointment_status ==
                        'Contract of Service' ||
                      workExpModel.appointment_status == 'Contractual'
                  "
                  cols="12"
                >
                  <v-text-field
                    v-model="workExpModel.monthly_salary"
                    :rules="
                      workExpModel.appointment_status == 'Permanent' ||
                      workExpModel.appointment_status == 'Temporary' ||
                      workExpModel.appointment_status == 'Coterminous' ||
                      workExpModel.appointment_status ==
                        'Contract of Service' ||
                      workExpModel.appointment_status == 'Contractual'
                        ? [formRules.numberRequired]
                        : []
                    "
                    dense
                    outlined
                    required
                    label="Monthly Salary"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>

                <v-col
                  cols="12"
                  v-if="
                    workExpModel.appointment_status == 'Job Order' ||
                      workExpModel.appointment_status == 'Casual' ||
                      workExpModel.appointment_status == 'Others'
                  "
                >
                  <v-text-field
                    v-model="workExpModel.rate_per_day"
                    :rules="
                      workExpModel.appointment_status == 'Job Order' ||
                      workExpModel.appointment_status == 'Casual' ||
                      workExpModel.appointment_status == 'Others'
                        ? [formRules.numberRequired]
                        : []
                    "
                    dense
                    outlined
                    required
                    label="Rate per day"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
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
            <v-btn color="#519043" class="white--text" @click="addWorkExp()">
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
            <v-btn color="#519043" class="white--text" @click="updateWorkExp()">
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
      appointmentStatusList: [
        "Permanent",
        "Temporary",
        "Casual",
        "Contract of Service",
        "Job Order",
        "Coterminous",
        "Contractual",
        "Others",
      ],
      // is_date_to_present: false,
      workExpModel: {
        id: null,
        is_present_date_to: null,
        is_in_DNSC: null,
        date_from: null,
        date_to: null,
        position: null,
        company: null,
        monthly_salary: null,
        rate_per_day: null,
        salary_grade: null,
        salary_grade_step: null,
        appointment_status: null,
        gov_service: "No",
      },
      temp_appointment_status: null,

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
        // this.workExpModel = data;
        if (data.id) {
          this.workExpModel.id = data.id;
        }
        this.workExpModel.is_present_date_to =
          data.is_present_date_to == 1 ? true : false;
        this.workExpModel.is_in_DNSC = data.is_in_DNSC;
        this.workExpModel.date_from = data.date_from;
        this.workExpModel.date_to = data.date_to;
        this.workExpModel.position = data.position;
        this.workExpModel.company = data.company;
        this.workExpModel.rate_per_day = data.rate_per_day;
        this.workExpModel.appointment_status = data.appointment_status;
        let copyArr = this.appointmentStatusList.map((element) => {
          return element.toLowerCase();
        });
        // console.log(copyArr);
        if (
          data.appointment_status &&
          data.appointment_status.toLowerCase() != "others"
        ) {
          let isExist = copyArr.indexOf(data.appointment_status.toLowerCase());
          if (isExist == -1) {
            this.workExpModel.appointment_status = "Others";
            this.temp_appointment_status = data.appointment_status;
          } else {
            this.workExpModel.appointment_status = data.appointment_status;
          }
        } else {
          this.workExpModel.appointment_status = "Others";
          this.temp_appointment_status = data.appointment_status;
        }

        this.workExpModel.gov_service = data.gov_service;

        this.workExpModel.salary_grade = parseInt(data.salary_grade);
        this.workExpModel.salary_grade_step = parseInt(data.salary_grade_step);
        this.workExpModel.monthly_salary = data.month_salary
          ? parseInt(data.month_salary)
          : "";

        // this.volWorkModel = data;
      },
      deep: true,
    },
  },

  methods: {
    setDept() {
      if (this.workExpModel.is_in_DNSC) {
        this.workExpModel.company = "Davao del Norte State College";
        this.workExpModel.appointment_status = null;
        this.workExpModel.monthly_salary = null;
        this.workExpModel.rate_per_day = null;
      } else {
        this.workExpModel.company = null;
        this.workExpModel.appointment_status = null;
        this.workExpModel.monthly_salary = null;
        this.workExpModel.rate_per_day = null;
      }
    },
    changeGovService() {
      this.workExpModel.is_in_DNSC = null;
      this.workExpModel.company = null;
      this.workExpModel.appointment_status = null;
      this.salary_grade = null;
      this.salary_grade_step = null;
      this.workExpModel.monthly_salary = null;
      this.workExpModel.rate_per_day = null;
    },
    closeD() {
      //  this.$refs.VolWorkFormref.reset();
      this.eventHub.$emit("closeWorkExpDialog", false);
      this.dialog = false;
    },
    changeSalaryGrade() {
      const monthArr = [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
      ];
      if (
        this.workExpModel.salary_grade &&
        this.workExpModel.salary_grade_step
      ) {
        let from;
        let to;

        if (this.workExpModel.is_present_date_to == 1) {
          let d = new Date();
          from = this.workExpModel.date_from;
          to =
            d.getFullYear() + "-" + monthArr[d.getMonth()] + "-" + d.getDate();
        } else {
          from = this.workExpModel.date_from;
          to = this.workExpModel.date_to;
        }

        this.axiosCall(
          "/salary-grade/findByDateFromToAndSgStep/" +
            from +
            "/" +
            to +
            "/" +
            this.workExpModel.salary_grade +
            "/" +
            this.workExpModel.salary_grade_step,
          "GET"
        ).then((res) => {
          if (res.data) {
            this.month_salary = parseInt(res.data.monthly_salary);

            this.workExpModel.monthly_salary = parseInt(
              res.data.monthly_salary
            );
          }
        });
      } else {
        this.month_salary = null;
      }
    },
    addWorkExp() {
      console.log("daaaa", this.workExpModel);
      if (this.$refs.WorkExpFormref.validate()) {
        // this.workExpModel.date_to = this.is_date_to_present
        //   ? null
        //   : this.workExpModel.date_to;
        // this.workExpModel.month_salary = this.month_salary;
        this.workExpModel.appointment_status =
          this.workExpModel.appointment_status == "Others"
            ? this.temp_appointment_status
            : this.workExpModel.appointment_status;
        this.workExpModel.is_in_DNSC =
          this.workExpModel.is_in_DNSC == null ||
          this.workExpModel.is_in_DNSC == false
            ? false
            : true;
        this.$emit("addWorkExp", this.workExpModel);
        this.closeD();
      } else {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message = "Please fill all required fields.";
      }
    },
    updateWorkExp() {
      console.log("daaaa", this.workExpModel);
      if (this.$refs.WorkExpFormref.validate()) {
        this.workExpModel.appointment_status =
          this.workExpModel.appointment_status == "Others"
            ? this.temp_appointment_status
            : this.workExpModel.appointment_status;
        this.workExpModel.is_in_DNSC =
          this.workExpModel.is_in_DNSC == null ||
          this.workExpModel.is_in_DNSC == false
            ? false
            : true;
        this.$emit("updateWorkExp", this.workExpModel);
        this.closeD();
        setTimeout(() => {
          this.closeD();
        }, 100);
      } else {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message = "Please fill all required fields.";
      }
    },
  },
};
</script>
