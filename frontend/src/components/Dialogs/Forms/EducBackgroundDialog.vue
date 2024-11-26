<template>
  <div>
    <v-dialog v-model="dialog" eager persistent scrollable max-width="600px">
      <v-form ref="EducBgFormref" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span v-if="action == 'Add'"> Add Educational background</span>
            <span v-if="action == 'Update'">Update Educational background</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-col> </v-col>

          <v-card-text style="max-height: 700px" class="">
            <v-container>
              <v-row>
                <v-col cols="12" class="py-1">
                  <v-select
                    ref="firstInput"
                    :items="levelList"
                    @change="changeLevel()"
                    :rules="[formRules.required]"
                    label="Level"
                    color="#6DB249"
                    outlined
                    dense
                    v-model="educBgModel.level"
                  ></v-select>
                </v-col>
                <v-col
                  cols="12"
                  class="py-1"
                  v-if="educBgModel.level == 'Graduate Studies'"
                >
                  <v-select
                    :items="gradStudyTypeList"
                    :rules="
                      educBgModel.level == 'Graduate Studies'
                        ? [formRules.required]
                        : []
                    "
                    label="Graduate Study Type"
                    outlined
                    color="#6DB249"
                    dense
                    v-model="educBgModel.grad_study_type"
                  ></v-select>
                </v-col>
                <v-col
                  cols="12"
                  class="py-1"
                  v-if="educBgModel.level == 'Graduate Studies'"
                >
                  <v-select
                    :items="gradStatusList"
                    :rules="
                      educBgModel.level == 'Graduate Studies'
                        ? [formRules.required]
                        : []
                    "
                    label="Status"
                    outlined
                    color="#6DB249"
                    dense
                    @change="changeGradStatus()"
                    v-model="educBgModel.grad_status"
                  ></v-select>
                </v-col>

                <v-col cols="12" class="py-1">
                  <v-text-field
                    v-model="educBgModel.school_name"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="Name of School"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" class="py-1">
                  <v-text-field
                    v-model="educBgModel.educ_course"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="Basic education/degree/course"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" class="py-1">
                  <v-text-field
                    outlined
                    dense
                    v-model="educBgModel.educ_from"
                    :rules="[formRules.required, formRules.isValidYear]"
                    chips
                    color="#6DB249"
                    small-chips
                    label="Period of Attendance (from) (year only)"
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="12" class="mt-n2">
                  <!-- <v-checkbox
                    @change="changePresentTo()"
                    v-model="educBgModel.educ_to_present"
                    label="Period of Attendance (Present date)"
                  ></v-checkbox> -->
                  <v-text-field
                    v-model="educBgModel.educ_to"
                    outlined
                    dense
                    :rules="[formRules.required, formRules.isValidYear]"
                    chips
                    color="#6DB249"
                    small-chips
                    label="Period of Attendance (to) (year only)"
                  >
                  </v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  :class="
                    !hideGraduatedCheckBox && !hideGraduatedCheckBox1
                      ? 'mt-n8'
                      : 'mt-n4'
                  "
                >
                  <v-checkbox
                    @change="changeIsGraduated()"
                    v-model="educBgModel.isGraduated"
                    v-if="!hideGraduatedCheckBox && !hideGraduatedCheckBox1"
                    label="Graduated"
                  ></v-checkbox>
                  <v-text-field
                    v-if="
                      (hideGraduatedCheckBox && !hideGraduatedCheckBox1) ||
                        educBgModel.isGraduated
                    "
                    v-model="educBgModel.year_graduated"
                    :rules="
                      educBgModel.isGraduated ||
                      educBgModel.grad_status == 'Graduated'
                        ? [formRules.required]
                        : []
                    "
                    dense
                    outlined
                    required
                    label="Year Graduated (year only)"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>

                <v-col
                  cols="12"
                  class="py-1"
                  v-if="
                    (educBgModel.level != 'Elementary' ||
                      educBgModel.level != 'Secondary') &&
                      (educBgModel.isGraduated == false ||
                        educBgModel.isGraduated == null)
                  "
                >
                  <v-text-field
                    v-model="educBgModel.units_earned"
                    :rules="
                      (educBgModel.level != 'Elementary' ||
                        educBgModel.level != 'Secondary') &&
                      (educBgModel.isGraduated == false ||
                        educBgModel.isGraduated == null)
                        ? [formRules.required]
                        : []
                    "
                    dense
                    outlined
                    color="#6DB249"
                    required
                    label="Highest level / Units earned (if not graduated)"
                    class="rounded-lg"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" class="py-1">
                  <v-text-field
                    v-model="educBgModel.honors_received"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="Scholarship / Academic honors received"
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
            <v-btn color="#519043" class="white--text" @click="addEducBG()">
              <v-icon>mdi-check-circle</v-icon>
              Save Details
            </v-btn>
          </v-card-actions>

          <v-card-actions v-if="action == 'Update'" class="pa-5">
            <v-spacer></v-spacer>
            <v-btn color="red" outlined @click="dialog = false">
              <v-icon>mdi-close-circle-outline</v-icon>
              Cancel
            </v-btn>
            <v-btn color="#519043" class="white--text" @click="updateEducBG()">
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
      levelList: [
        "Elementary",
        "Secondary",
        "College",
        "Graduate Studies",
        "Vocational",
      ],
      gradStudyTypeList: ["Masteral", "Doctorate"],
      gradStatusList: ["CAR", "On-going", "Graduated", "Stopped"],
      educBgModel: {
        level: null,
        grad_study_type: null,
        grad_status: null,
        school_name: null,
        educ_course: null,
        educ_from: null,
        educ_to: null,
        // educ_to_present: false,
        units_earned: null,
        isGraduated: true,
        year_graduated: null,
        honors_received: null,
      },
      isPresentDateTo: true,
      hideGraduatedCheckBox: null,
      hideGraduatedCheckBox1: null,
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
        this.$refs.EducBgFormref.resetValidation();
        // if (data.id == null) {
        //   this.$refs.EducBgFormref.reset();
        // }
        this.educBgModel = data;
        this.changeGradStatus();

        // this.educBgModel.educ_to_present = data.educ_to ? false : true;
      },
      deep: true,
    },
    action: {
      handler() {},
    },
    index: {
      handler() {},
      deep: true,
    },
  },
  methods: {
    // changePresentTo() {
    //   this.isPresentDateTo = !this.isPresentDateTo;
    // },
    changeLevel() {
      this.educBgModel.grad_study_type = null;
      this.educBgModel.grad_status = null;
      this.hideGraduatedCheckBox = false;
    },

    changeGradStatus() {
      if (this.educBgModel.grad_status == "Graduated") {
        this.hideGraduatedCheckBox = true;
        this.hideGraduatedCheckBox1 = false;
      } else if (
        this.educBgModel.grad_status == "CAR" ||
        this.educBgModel.grad_status == "On-going"
      ) {
        this.hideGraduatedCheckBox1 = true;
        this.hideGraduatedCheckBox = false;
      }
      //  else {
      //   this.hideGraduatedCheckBox = false;
      //   this.hideGraduatedCheckBox1 = false;
      // }
    },

    changeIsGraduated() {
      if (this.educBgModel.isGraduated == false) {
        this.educBgModel.units_earned = null;
      }
    },

    closeD() {
      this.dialog = false;
      this.$refs.EducBgFormref.reset();
    },
    addEducBG() {
      if (this.$refs.EducBgFormref.validate()) {
        this.educBgModel.year_graduated =
          this.educBgModel.grad_status == "Graduated" ||
          this.educBgModel.isGraduated
            ? this.educBgModel.year_graduated
            : null;
        if (
          this.educBgModel.level == "Graduate Studies" &&
          this.educBgModel.grad_status == "Graduated"
        ) {
          this.educBgModel.isGraduated = true;
        }

        if (
          (this.educBgModel.level == "Elementary" ||
            this.educBgModel.level == "Secondary") &&
          this.educBgModel.isGraduated == true
        ) {
          this.educBgModel.units_earned = "N/A";
        }
        console.log(this.educBgModel);
        this.$emit("addEducBg", this.educBgModel);
        this.dialog = false;
        // this.closeD();
      }
    },
    updateEducTo() {
      // this.educBgModel.educ_to_present = !this.educBgModel.educ_to_present;
      // if (this.educBgModel.educ_to) {
      //   this.educBgModel.educ_to = null;
      // }
    },

    updateEducBG() {
      if (this.$refs.EducBgFormref.validate()) {
        // this.educBgModel.educ_to = this.isPresentDateTo
        //   ? null
        //   : this.educBgModel.educ_to;

        this.educBgModel.year_graduated =
          this.educBgModel.isGraduated ||
          this.educBgModel.grad_status == "Graduated"
            ? this.educBgModel.year_graduated
            : null;

        // this.educBgModel.year_graduated =
        //   this.educBgModel.grad_status == "Graduated"
        //     ? this.educBgModel.year_graduated
        //     : null;
        if (
          this.educBgModel.level == "Graduate Studies" &&
          this.educBgModel.grad_status == "Graduated"
        ) {
          this.educBgModel.isGraduated = true;
        }

        if (
          (this.educBgModel.level == "Elementary" ||
            this.educBgModel.level == "Secondary") &&
          this.educBgModel.isGraduated == true
        ) {
          this.educBgModel.units_earned = "N/A";
        }
        // console.log(this.educBgModel);

        // this.$emit("indexToUpdate", this.index);
        this.dialog = false;
        this.dialog = false;
      }
    },
  },
};
</script>
