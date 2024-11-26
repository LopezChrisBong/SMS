<template>
  <div>
    <v-dialog fullscreen v-model="dialog" eager scrollable max-width="900px">
      <v-form ref="JobAppFormRef" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span
              class="text-uppercase"
              :class="action == 'View' ? '' : 'd-none'"
              >view {{ lastname + " " + firstname }}
            </span>

            <span
              class="text-uppercase"
              :class="action == 'Add' ? '' : 'd-none'"
              >Add Hired Applicant
            </span>

            <span
              class="text-uppercase"
              :class="action == 'Update' ? '' : 'd-none'"
              >Update {{ lastname + " " + firstname }}
            </span>

            <v-spacer></v-spacer>
            <v-btn icon dark @click="closeD()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 700px" class="my-4">
            <v-container>
              <v-row :class="action == 'View' ? '' : 'd-none'">
                <v-col cols="12" class="pa-0 pt-2 px-4">
                  <!-- <v-select
                      v-if="action == 'Add'"
                      outlined
                      :items="position"
                      label="Position"
                      color="#93CB5B"
                      dense
                      v-model="position"
                    ></v-select> -->

                  <v-text-field
                    outlined
                    v-model="positionname"
                    dense
                    class="rounded-lg"
                    :readonly="action == 'View' ? true : false"
                    label="Position"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row :class="action == 'View' ? 'd-none' : ''">
                <v-col cols="12" lg="6" md="6" sm="12" class="pa-0 pt-2 px-4">
                  <v-text-field
                    outlined
                    v-model="positionname"
                    dense
                    class="rounded-lg"
                    :readonly="action == 'View' ? true : false"
                    label="Position"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" lg="6" md="6" sm="12" class="pa-0 pt-2 px-4">
                  <v-text-field
                    outlined
                    v-model="positionItem"
                    dense
                    class="rounded-lg"
                    :readonly="action == 'View' ? true : false"
                    label="Position Item No."
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="4" lg="4" sm="12" class="pa-0 pt-2 px-4">
                  <v-text-field
                    outlined
                    v-model="firstname"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="Firstname"
                    color="#6DB249"
                    :readonly="action == 'View' ? true : false"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="2" lg="2" sm="12" class="pa-0 pt-2 px-4">
                  <v-text-field
                    outlined
                    v-model="mi"
                    dense
                    class="rounded-lg"
                    label="Midle Initial"
                    color="#6DB249"
                    :readonly="action == 'View' ? true : false"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="4" lg="4" sm="12" class="pa-0 pt-2 px-4">
                  <v-text-field
                    outlined
                    v-model="lastname"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="Lastname"
                    color="#6DB249"
                    :readonly="action == 'View' ? true : false"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="2" lg="2" sm="12" class="pa-0 pt-2 px-4">
                  <v-text-field
                    outlined
                    v-model="suffix"
                    dense
                    class="rounded-lg"
                    label="Suffix"
                    color="#6DB249"
                    :readonly="action == 'View' ? true : false"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="6" lg="6" sm="12" class="pa-0 pt-2 px-4">
                  <v-text-field
                    outlined
                    v-model="email"
                    type="email"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="Email"
                    color="#6DB249"
                    :readonly="action == 'View' ? true : false"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="6" lg="6" sm="12" class="pa-0 pt-2 px-4">
                  <v-text-field
                    outlined
                    v-model="phone"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="Phone number"
                    color="#6DB249"
                    type="number"
                    :readonly="action == 'View' ? true : false"
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="12" md="6" lg="6" sm="12" class="pa-0 pt-2 px-4">
                  <v-text-field
                    outlined
                    v-model="relegion"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="Religion"
                    color="#6DB249"
                    :readonly="action == 'View' ? true : false"
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="12" md="6" lg="6" sm="12" class="pa-0 pt-2 px-4">
                  <v-text-field
                    outlined
                    v-model="gender"
                    dense
                    class="rounded-lg"
                    label="Sexual Orientation, Gender Identity and Expression (SOGIE)"
                    color="#6DB249"
                    :readonly="action == 'View' ? true : false"
                    :class="action == 'View' ? '' : 'd-none'"
                  >
                  </v-text-field>
                  <v-select
                    outlined
                    :items="sogieList"
                    label="Sexual Orientation, Gender Identity and Expression (SOGIE)"
                    color="#93CB5B"
                    dense
                    v-model="genderadd"
                    :class="action != 'View' ? '' : 'd-none'"
                    :selected="genderadd == getGender"
                    :value="getGender"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="6" lg="6" sm="12" class="pa-0 pt-2 px-4">
                  <v-text-field
                    outlined
                    v-model="address"
                    dense
                    class="rounded-lg"
                    label="Address"
                    color="#6DB249"
                    :readonly="action == 'View' ? true : false"
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="12" md="6" lg="6" sm="12" class="pa-0 pt-2 px-4">
                  <v-text-field
                    outlined
                    v-model="birth"
                    dense
                    class="rounded-lg"
                    label="Birth Date"
                    color="#6DB249"
                    :readonly="action == 'View' ? true : false"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="6" lg="6" sm="12" class="pa-0 pt-2 px-4">
                  <v-text-field
                    :class="action == 'View' ? '' : 'd-none'"
                    outlined
                    v-model="highest_education_attainment"
                    dense
                    class="rounded-lg "
                    label="Highest Educational Attainment"
                    color="#6DB249"
                    :readonly="action == 'View' ? true : false"
                  >
                  </v-text-field>
                  <v-select
                    :class="action == 'View' ? 'd-none' : ''"
                    outlined
                    :items="highestEducation"
                    label="Highest Educational Attainment"
                    color="#93CB5B"
                    dense
                    v-model="highestEducationData"
                    :required="action != 'View' ? true : false"
                    :selected="highestEducationData == educationAttainded"
                    :value="educationAttainded"
                    @change="education_attainded()"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="6" lg="6" sm="12"></v-col>

                <v-col cols="12" md="6" lg="6" sm="12" class="pa-0 pt-2 px-4">
                  <v-text-field
                    outlined
                    v-model="vocational_college_level"
                    dense
                    class="rounded-lg"
                    label="Course"
                    color="#6DB249"
                    :readonly="action == 'View' ? true : false"
                    :class="
                      highest_education_attainment == 'Vocational'
                        ? ''
                        : highest_education_attainment == 'College Level'
                        ? ''
                        : highestEducationData == 'Vocational'
                        ? ''
                        : highestEducationData == 'College Level'
                        ? ''
                        : 'd-none'
                    "
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="12" md="6" lg="6" sm="12" class="pa-0 pt-2 px-4">
                  <v-text-field
                    outlined
                    v-model="college_level_units"
                    dense
                    class="rounded-lg"
                    label="Earned Unit's"
                    color="#6DB249"
                    :readonly="action == 'View' ? true : false"
                    :class="
                      highest_education_attainment == 'College Level'
                        ? ''
                        : highestEducationData == 'College Level'
                        ? ''
                        : 'd-none'
                    "
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="12" md="6" lg="6" sm="12" class="pa-0 pt-2 px-4">
                  <v-text-field
                    outlined
                    v-model="college_grad_course"
                    dense
                    class="rounded-lg"
                    label="Bachelors Degree/ Course"
                    color="#6DB249"
                    :readonly="action == 'View' ? true : false"
                    :class="
                      highest_education_attainment == 'College Graduate'
                        ? ''
                        : highest_education_attainment == 'Post Graduate'
                        ? ''
                        : highestEducationData == 'College Graduate'
                        ? ''
                        : highestEducationData == 'Post Graduate'
                        ? ''
                        : 'd-none'
                    "
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="12" md="6" lg="6" sm="12" class="pa-0 pt-2 px-4">
                  <v-text-field
                    outlined
                    v-model="college_grad_year"
                    dense
                    class="rounded-lg"
                    label="Year Graduated/ Earned Unit"
                    color="#6DB249"
                    :readonly="action == 'View' ? true : false"
                    :class="
                      highest_education_attainment == 'College Graduate'
                        ? ''
                        : highest_education_attainment == 'Post Graduate'
                        ? ''
                        : highestEducationData == 'College Graduate'
                        ? ''
                        : highestEducationData == 'Post Graduate'
                        ? ''
                        : 'd-none'
                    "
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="12" md="6" lg="6" sm="12" class="pa-0 pt-2 px-4">
                  <v-text-field
                    outlined
                    v-model="master_degree"
                    dense
                    class="rounded-lg"
                    label="Master's Degree"
                    color="#6DB249"
                    :readonly="action == 'View' ? true : false"
                    :class="
                      highest_education_attainment == 'Post Graduate'
                        ? ''
                        : highestEducationData == 'Post Graduate'
                        ? ''
                        : 'd-none'
                    "
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="12" md="6" lg="6" sm="12" class="pa-0 pt-2 px-4">
                  <v-text-field
                    outlined
                    v-model="master_year_units"
                    dense
                    class="rounded-lg"
                    label="Year Graduated/ Earned Unit"
                    color="#6DB249"
                    :readonly="action == 'View' ? true : false"
                    :class="
                      highest_education_attainment == 'Post Graduate'
                        ? ''
                        : highestEducationData == 'Post Graduate'
                        ? ''
                        : 'd-none'
                    "
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="12" md="6" lg="6" sm="12" class="pa-0 pt-2 px-4">
                  <v-text-field
                    outlined
                    v-model="doctor_year_course"
                    dense
                    class="rounded-lg"
                    label="Doctorate Degree"
                    color="#6DB249"
                    :readonly="action == 'View' ? true : false"
                    :class="
                      highest_education_attainment == 'Post Graduate'
                        ? ''
                        : highestEducationData == 'Post Graduate'
                        ? ''
                        : 'd-none'
                    "
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="12" md="6" lg="6" sm="12" class="pa-0 pt-2 px-4">
                  <v-text-field
                    outlined
                    v-model="doctor_year_units"
                    dense
                    class="rounded-lg"
                    label="Year Graduated/ Earned Unit"
                    color="#6DB249"
                    :readonly="action == 'View' ? true : false"
                    :class="
                      highest_education_attainment == 'Post Graduate'
                        ? ''
                        : highestEducationData == 'Post Graduate'
                        ? ''
                        : 'd-none'
                    "
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" class="pa-0 pt-2 px-4">
                  <v-text-field
                    outlined
                    v-model="company_agency"
                    dense
                    class="rounded-lg"
                    label="Latest Company"
                    color="#6DB249"
                    :readonly="action == 'View' ? true : false"
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="12" md="6" lg="6" sm="12" class="pa-0 pt-2 px-4">
                  <v-text-field
                    outlined
                    v-model="present_position"
                    dense
                    class="rounded-lg"
                    label="Present/Latest Position"
                    color="#6DB249"
                    :readonly="action == 'View' ? true : false"
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="12" md="6" lg="6" sm="12" class="pa-0 pt-2 px-4">
                  <v-text-field
                    outlined
                    v-model="status_employment"
                    dense
                    class="rounded-lg"
                    label="Employment Status"
                    color="#6DB249"
                    :readonly="action == 'View' ? true : false"
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="12" md="6" lg="6" sm="12" class="pa-0 pt-2 px-4">
                  <v-text-field
                    outlined
                    v-model="inclusive_date_from"
                    dense
                    class="rounded-lg"
                    label="Inclusive Date From:"
                    color="#6DB249"
                    :readonly="action == 'View' ? true : false"
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="12" md="6" lg="6" sm="12" class="pa-0 pt-2 px-4">
                  <v-text-field
                    outlined
                    v-model="inclusive_date_to"
                    dense
                    class="rounded-lg"
                    label="Inclusive Date To:"
                    color="#6DB249"
                    :readonly="action == 'View' ? true : false"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" class="pa-0 pt-2 px-4">
                  <v-text-field
                    outlined
                    v-model="EligibilityAdded"
                    dense
                    class="rounded-lg"
                    label="Eligibility"
                    color="#6DB249"
                    :readonly="action == 'View' ? true : false"
                  >
                  </v-text-field>
                </v-col>

                <!--  color="red" label="red" -->
                <v-col
                  cols="12"
                  md="6"
                  lg="6"
                  sm="12"
                  class="pa-0 pt-2 px-4 rtl"
                >
                  <v-checkbox
                    v-model="pwd_check"
                    label="PWD"
                    value="checked"
                    :readonly="action == 'View' ? true : false"
                    hide-details
                  ></v-checkbox>
                </v-col>
                <v-col cols="12" md="6" lg="6" sm="12" class="pa-0 pt-2 px-4">
                  <v-text-field
                    outlined
                    v-model="pwd_value"
                    dense
                    class="rounded-lg"
                    label="PWD"
                    color="#6DB249"
                    :readonly="action == 'View' ? true : false"
                    :disabled="!pwd_check"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="6" lg="6" sm="12" class="pa-0 pt-2 px-4">
                  <v-checkbox
                    v-model="indigenous_check"
                    label="Indiginous Community"
                    value="checked"
                    hide-details
                    :readonly="action == 'View' ? true : false"
                  ></v-checkbox>
                </v-col>
                <v-col cols="12" md="6" lg="6" sm="12" class="pa-0 pt-2 px-4">
                  <v-text-field
                    outlined
                    v-model="indigenous_value"
                    dense
                    class="rounded-lg"
                    label="Indigenous Community"
                    color="#6DB249"
                    :readonly="action == 'View' ? true : false"
                    :disabled="!indigenous_check"
                  >
                  </v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                  lg="6"
                  sm="12"
                  class="pa-0 pt-2 px-4 mb-3"
                >
                  <v-checkbox
                    v-model="pregnant_check"
                    label="Pregnant"
                    value="checked"
                    :readonly="action == 'View' ? true : false"
                    hide-details
                  ></v-checkbox>
                </v-col>
                <v-col cols="12" class="pa-0 pt-2 px-4 mb-4">
                  <v-checkbox
                    v-model="fileUpdate"
                    label="Update Files Uploaded"
                    value="checked"
                    hide-details
                    :readonly="action == 'View' ? true : false"
                    :class="action != 'Update' ? 'd-none' : ''"
                  ></v-checkbox>
                </v-col>
                <!--<v-col cols="12" md="6" lg="6" sm="12" class="pa-0 pt-2 px-4">
                    <v-checkbox
                      v-model="sogie_check"
                      label="Sexual Orientation, Gender Identity and Expression (SOGIE)"
                      value="checked"
                      hide-details
                      readonly
                    ></v-checkbox>
                  </v-col>-->
                <!-- <v-col cols="12" md="6" lg="6" sm="12" class="pa-0 pt-2 px-4">
                    <v-text-field
                      outlined
                      v-model="sogie_value"
                      dense
                      class="rounded-lg"
                      label="Sexual Orientation, Gender Identity and Expression"
                      color="#6DB249"
                      readonly
                    >
                    </v-text-field>
                  </v-col> -->

                <v-row
                  v-if="!show"
                  :class="fileUpdate ? '' : action == 'Add' ? '' : 'd-none'"
                >
                  <v-col cols="12" class="pa-0 pt-2 px-4">
                    <v-file-input
                      outlined
                      v-model="applicationletter"
                      dense
                      class="rounded-lg"
                      label="Application Letter"
                      color="#6DB249"
                      accept=".pdf"
                      :readonly="action == 'View' ? true : false"
                      :clearable="action == 'Update' ? false : true"
                    >
                    </v-file-input>
                  </v-col>

                  <v-col cols="12" class="pa-0 pt-2 px-4">
                    <v-file-input
                      outlined
                      v-model="pds"
                      dense
                      class="rounded-lg"
                      label="Personal Data Sheet"
                      color="#6DB249"
                      :readonly="action == 'View' ? true : false"
                      accept=".pdf"
                      :clearable="action == 'Update' ? false : true"
                    >
                    </v-file-input>
                  </v-col>

                  <v-col cols="12" class="pa-0 pt-2 px-4">
                    <v-file-input
                      outlined
                      v-model="performance"
                      dense
                      class="rounded-lg"
                      label="Performance Rating"
                      color="#6DB249"
                      :readonly="action == 'View' ? true : false"
                      accept=".pdf"
                      :clearable="action == 'Update' ? false : true"
                    >
                    </v-file-input>
                  </v-col>

                  <v-col cols="12" class="pa-0 pt-2 px-4">
                    <v-file-input
                      outlined
                      v-model="eligibility"
                      dense
                      class="rounded-lg"
                      label="Certificate of Eligibility"
                      color="#6DB249"
                      :readonly="action == 'View' ? true : false"
                      accept=".pdf"
                      :clearable="action == 'Update' ? false : true"
                    >
                    </v-file-input>
                  </v-col>

                  <v-col cols="12" class="pa-0 pt-2 px-4">
                    <v-file-input
                      outlined
                      v-model="tor"
                      :readonly="action == 'View' ? true : false"
                      dense
                      class="rounded-lg"
                      label="Transcript of Records"
                      color="#6DB249"
                      accept=".pdf"
                      :clearable="action == 'Update' ? false : true"
                    >
                    </v-file-input>
                  </v-col>

                  <v-col cols="12" class="pa-0 pt-2 px-4">
                    <v-file-input
                      outlined
                      v-model="employment"
                      class="rounded-lg"
                      label="Certificate of Employment"
                      color="#6DB249"
                      :readonly="action == 'View' ? true : false"
                      accept=".pdf"
                      :clearable="action == 'Update' ? false : true"
                    >
                    </v-file-input>
                  </v-col>
                  <v-col cols="12" class="pa-0 pt-2 px-4">
                    <v-file-input
                      outlined
                      v-model="seminars"
                      dense
                      class="rounded-lg"
                      label="Certificate of training and seminars"
                      color="#6DB249"
                      :readonly="action == 'View' ? true : false"
                      accept=".pdf"
                      :clearable="action == 'Update' ? false : true"
                    >
                    </v-file-input>
                  </v-col>
                </v-row>

                <v-row v-else style="display: flex; justify-content: center;">
                  <v-col cols="10">
                    <v-btn
                      class="text-caption text-md-subtitle-1"
                      block
                      @click="viewApplicationLetter()"
                      >Application Letter</v-btn
                    >
                  </v-col>
                  <v-col cols="10">
                    <!-- :class="postedJob.personal_data == required ? 'd-none' : ''" -->
                    <v-btn
                      class="text-caption text-md-subtitle-1"
                      block
                      @click="viewPDS(postedJob)"
                      >Personal Data Sheet</v-btn
                    >
                  </v-col>
                  <v-col cols="10">
                    <!-- :class="postedJob.performance_rating == required ? 'd-none' : '' " -->
                    <v-btn
                      class="text-caption text-md-subtitle-1"
                      block
                      @click="viewPerformance()"
                      >Performance Rating</v-btn
                    >
                  </v-col>
                  <v-col cols="10">
                    <!-- :class="postedJob.certificate_eligibility == required? 'd-none': ''" -->
                    <v-btn
                      class="text-caption text-md-subtitle-1"
                      block
                      @click="viewEligibility()"
                      >Certificate of Eligibility</v-btn
                    >
                  </v-col>
                  <v-col cols="10">
                    <!-- :class="postedJob.transcript_record == required ? 'd-none' : ''" -->
                    <v-btn
                      class="text-caption text-md-subtitle-1"
                      block
                      @click="viewTOR()"
                      >Transcript of Records</v-btn
                    >
                  </v-col>
                  <v-col cols="10">
                    <!-- :class="postedJob.certificate_employment == required? 'd-none': ''" -->
                    <v-btn
                      class="text-caption text-md-subtitle-1"
                      block
                      @click="viewEmployment()"
                      >Certificate of Employment</v-btn
                    >
                  </v-col>
                  <v-col cols="10">
                    <!-- :class="postedJob.certificate_training == required ? 'd-none' : ''" -->
                    <v-btn
                      class="text-caption text-md-subtitle-1"
                      block
                      @click="viewSeminar()"
                      >Certificate of Training and Seminars</v-btn
                    >
                  </v-col>
                </v-row>
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
              color="red"
              class="white--text"
              v-if="action == 'Update'"
              @click="declined()"
            >
              <v-icon>mdi-check-circle</v-icon>
              Decline
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
    <v-dialog fullscreen v-model="dialog2" eager scrollable max-width="900px">
      <v-card>
        <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
          <span>{{ action }} Applicant</span>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="closeD1()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text style="max-height: 700px" class="my-4">
          <v-container>
            <v-row>
              <v-col cols="12" class="pa-0 pt-2 px-4">
                <iframe :src="text"></iframe>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <ShortListViewFile :data="fileToView" :action="action" />

    <fade-away-message-component
      displayType="variation2"
      v-model="fadeAwayMessage.show"
      :message="fadeAwayMessage.message"
      :header="fadeAwayMessage.header"
      :top="fadeAwayMessage.top"
      :type="fadeAwayMessage.type"
      :timeout="3000"
    ></fade-away-message-component>
  </div>
</template>

<script>
export default {
  props: {
    data: null,
    action: null,
  },
  components: {
    ShortListViewFile: () => import("../Views/ShortListViewFile.vue"),
  },

  data() {
    return {
      shortlistfile: null,
      EligibilityAdded: null,
      genderadd: null,
      fileUpdate: false,
      sogieList: ["Man", "Woman", "Non-binary", "Prefer not to say"],
      highestEducation: [
        "Elementary Level",
        "Elementary Graduate",
        "High School Level",
        "High School Graduate",
        "Vocational",
        "College Level",
        "College Graduate",
        "Post Graduate",
      ],
      educationAttainded: null,
      getGender: null,
      position: [],
      postedJob: [],
      highest_education_attainment: null,
      vocational_college_level: null,
      college_level_units: null,
      college_grad_course: null,
      college_grad_year: null,
      master_degree: null,
      master_year_units: null,
      doctor_year_course: null,
      doctor_year_units: null,
      positionID: null,
      mi: null,
      suffix: null,
      text: "",
      type: "office",
      urls: null,
      show: false,
      firstname: null,
      lastname: null,
      email: null,
      phone: null,
      gender: null,
      address: null,
      present_position: null,
      relegion: null,
      pregnant_check: null,
      sogie_check: null,
      sogie_value: null,
      pwd_check: null,
      indigenous_check: null,
      pwd_value: null,
      indigenous_value: null,
      status_employment: null,
      applicationletter: null,
      pds: null,
      inclusive_date_from: null,
      inclusive_date_to: null,
      performance: null,
      eligibility: null,
      tor: null,
      employment: null,
      seminars: null,
      id: null,
      dialog: false,
      dialog2: false,
      birth: null,
      empID: null,
      designationID: null,
      units: null,
      effectivityDate: null,
      specialOrderNo: null,
      assigned_office: null,
      schoolYearFrom: null,
      schoolYearTo: null,
      positionname: null,
      sem: null,
      isActive: null,
      syList: [],
      company_agency: null,
      statusList: [
        "Afghanistan",
        "Åland Islands",
        "Albania",
        "Algeria",
        "American Samoa",
        "Andorra",
        "Angola",
        "Anguilla",
        "Antigua and Barbuda",
        "Argentina",
        "Armenia",
        "Aruba",
        "Australia",
        "Austria",
        "Azerbaijan",
        "Bangladesh",
        "Barbados",
        "Bahamas",
        "Bahrain",
        "Belarus",
        "Belgium",
        "Belize",
        "Benin",
        "Bermuda",
        "Bhutan",
        "Bolivia",
        "Bosnia and Herzegovina",
        "Botswana",
        "Brazil",
        "British Indian Ocean Territory",
        "British Virgin Islands",
        "Brunei Darussalam",
        "Bulgaria",
        "Burkina Faso",
        "Burma",
        "Burundi",
        "Cambodia",
        "Cameroon",
        "Canada",
        "Cape Verde",
        "Cayman Islands",
        "Central African Republic",
        "Chad",
        "Chile",
        "China",
        "Christmas Island",
        "Cocos (Keeling) Islands",
        "Colombia",
        "Comoros",
        "Congo-Brazzaville",
        "Congo-Kinshasa",
        "Cook Islands",
        "Costa Rica",
        "$_[",
        "Croatia",
        "Curaçao",
        "Cyprus",
        "Czech Republic",
        "Denmark",
        "Djibouti",
        "Dominica",
        "Dominican Republic",
        "East Timor",
        "Ecuador",
        "El Salvador",
        "Egypt",
        "Equatorial Guinea",
        "Eritrea",
        "Estonia",
        "Ethiopia",
        "Falkland Islands",
        "Faroe Islands",
        "Federated States of Micronesia",
        "Fiji",
        "Finland",
        "France",
        "French Guiana",
        "French Polynesia",
        "French Southern Lands",
        "Gabon",
        "Gambia",
        "Georgia",
        "Germany",
        "Ghana",
        "Gibraltar",
        "Greece",
        "Greenland",
        "Grenada",
        "Guadeloupe",
        "Guam",
        "Guatemala",
        "Guernsey",
        "Guinea",
        "Guinea-Bissau",
        "Guyana",
        "Haiti",
        "Heard and McDonald Islands",
        "Honduras",
        "Hong Kong",
        "Hungary",
        "Iceland",
        "India",
        "Indonesia",
        "Iraq",
        "Ireland",
        "Isle of Man",
        "Israel",
        "Italy",
        "Jamaica",
        "Japan",
        "Jersey",
        "Jordan",
        "Kazakhstan",
        "Kenya",
        "Kiribati",
        "Kuwait",
        "Kyrgyzstan",
        "Laos",
        "Latvia",
        "Lebanon",
        "Lesotho",
        "Liberia",
        "Libya",
        "Liechtenstein",
        "Lithuania",
        "Luxembourg",
        "Macau",
        "Macedonia",
        "Madagascar",
        "Malawi",
        "Malaysia",
        "Maldives",
        "Mali",
        "Malta",
        "Marshall Islands",
        "Martinique",
        "Mauritania",
        "Mauritius",
        "Mayotte",
        "Mexico",
        "Moldova",
        "Monaco",
        "Mongolia",
        "Montenegro",
        "Montserrat",
        "Morocco",
        "Mozambique",
        "Namibia",
        "Nauru",
        "Nepal",
        "Netherlands",
        "New Caledonia",
        "New Zealand",
        "Nicaragua",
        "Niger",
        "Nigeria",
        "Niue",
        "Norfolk Island",
        "Northern Mariana Islands",
        "Norway",
        "Oman",
        "Pakistan",
        "Palau",
        "Panama",
        "Papua New Guinea",
        "Paraguay",
        "Peru",
        "Philippines",
        "Pitcairn Islands",
        "Poland",
        "Portugal",
        "Puerto Rico",
        "Qatar",
        "Réunion",
        "Romania",
        "Russia",
        "Rwanda",
        "Saint Barthélemy",
        "Saint Helena",
        "Saint Kitts and Nevis",
        "Saint Lucia",
        "Saint Martin",
        "Saint Pierre and Miquelon",
        "Saint Vincent",
        "Samoa",
        "San Marino",
        "São Tomé and Príncipe",
        "Saudi Arabia",
        "Senegal",
        "Serbia",
        "Seychelles",
        "Sierra Leone",
        "Singapore",
        "Sint Maarten",
        "Slovakia",
        "Slovenia",
        "Solomon Islands",
        "Somalia",
        "South Africa",
        "South Georgia",
        "South Korea",
        "Spain",
        "Sri Lanka",
        "Sudan",
        "Suriname",
        "Svalbard and Jan Mayen",
        "Sweden",
        "Swaziland",
        "Switzerland",
        "Syria",
        "Taiwan",
        "Tajikistan",
        "Tanzania",
        "Thailand",
        "Togo",
        "Tokelau",
        "Tonga",
        "Trinidad and Tobago",
        "Tunisia",
        "Turkey",
        "Turkmenistan",
        "Turks and Caicos Islands",
        "Tuvalu",
        "Uganda",
        "Ukraine",
        "United Arab Emirates",
        "United Kingdom",
        "United States",
        "Uruguay",
        "Uzbekistan",
        "Vanuatu",
        "Vatican City",
        "Vietnam",
        "Venezuela",
        "Wallis and Futuna",
        "Western Sahara",
        "Yemen",
        "Zambia",
        "Zimbabwe",
      ],

      positionItem: null,
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
      highestEducationData: null,
      deleteFileArray: [],
      newUploadFileArray: [],
      changeApplicationLetter: null,
      changeTor: null,
      changePds: null,
      changePerformance: null,
      changeSeminar: null,
      changeEligibility: null,
      changeEmployment: null,
      ApplicationLetterOldValue: null,
      TorLetterOldValue: null,
      PdsLetterOldValue: null,
      PerformanceLetterOldValue: null,
      SeminarLetterOldValue: null,
      EligibilityLetterOldValue: null,
      EmploymentLetterOldValue: null,
      updateApplicationLetter: null,
      updatePds: null,
      updateTor: null,
      updatePerformance: null,
      updateSeminars: null,
      updateEligibility: null,
      updateEmployment: null,
      arrayFileIndex: new Array(7).fill(),
      fileToView: null,
      fadeAwayMessage: {
        show: false,
        type: "success",
        header: "Successfully Added!",
        message: "",
        top: 10,
      },
    };
  },

  mounted() {
    this.eventHub.$on("CloseShortFileView", () => {
      this.initialize();
    });
  },
  beforeDestroy() {
    this.eventHub.$off("CloseShortFileView");
  },

  watch: {
    data: {
      handler(data) {
        this.dialog = true;
        // console.log("DATA", data);
        if (data.id) {
          this.EligibilityAdded = data.eligibility_form;
          this.positionItem = data.item;
          this.id = data.id;
          this.company_agency = data.company_agency;
          this.designationID = parseInt(data.designationID);
          this.getEmpDetails();
          this.units = data.units == 0 ? "0" : data.units;
          this.effectivityDate = data.effectivityDate;
          this.specialOrderNo = data.specialOrderNo;
          this.assigned_office = data.assigned_office;
          this.isActive = data.isActive ? "Active" : "Inactive";
          this.firstname = data.firstname;
          this.lastname = data.lastname;
          this.email = data.email;
          this.birth = this.formatDate(data.birth);
          // this.inclusive_date_from = this.formatDate(data.inclusive_from);
          // this.inclusive_date_to = this.formatDate(data.inclusive_to);
          this.inclusive_date_from = data.inclusive_from;
          this.inclusive_date_to = data.inclusive_to;
          this.positionID = data.positionID;
          this.phone = data.phone_number;
          this.mi = data.mi;
          this.positionname = data.position;
          this.vocational_college_level = data.educ_qualification_grad;
          this.college_level_units = data.earned_Units;
          this.college_grad_course = data.college_grad_course;
          this.college_grad_year = data.year_graduated;
          this.master_degree = data.master_grad_course;
          this.master_year_units = data.year_graduated_masteral;
          this.doctor_year_course = data.doctoral_grad_course;
          this.doctor_year_units = data.year_graduated_doctoral;
          this.status_employment = data.status_employment;

          this.suffix = data.suffix;
          this.relegion = data.relegion;
          this.pregnant_check = data.pregnant_check;
          this.sogie_check = data.sogie_check;
          this.sogie_value = data.sogie_value;
          this.indigenous_check = data.indigenous_check;
          this.pwd_value = data.pwd_value;
          this.indigenous_value = data.indigenous_value;
          this.pwd_check = data.pwd_check;
          this.applicationletter = data.application_letter;
          this.pds = data.personal_data_sheet;
          this.performance = data.performance_rating;
          this.gender = data.gender;
          this.genderadd = data.gender;
          this.address = data.address;
          this.present_position = data.present_position;
          if (this.action == "View") {
            this.highest_education_attainment = data.educ_qualification;
          } else if (this.action == "Update") {
            if (data.educ_qualification) {
              this.highestEducationData = data.educ_qualification;
            } else {
              this.highestEducationData = "Elementary Level";
            }
          }
          this.eligibility = data.proof_eligibility;
          this.tor = data.certificate_authority;
          this.employment = data.employment_experience;
          this.seminars = data.training_seminar;
          this.initialize();
        } else {
          this.$refs.JobAppFormRef.reset();
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

    applicationletter(newValue, oldValue) {
      if (newValue) {
        if (newValue.name != oldValue) {
          if (!this.ApplicationLetterOldValue) {
            this.deleteFileArray.push(oldValue);
            this.$set(this.arrayFileIndex, 0, newValue);
            console.log("Update Application", this.arrayFileIndex);
            console.log("deleteFileArray", this.deleteFileArray);
            this.ApplicationLetterOldValue = oldValue;
            this.changeApplicationLetter = newValue;
          } else {
            this.arrayFileIndex.forEach((element) => {
              // console.log("OLD NEW DATA", element, oldValue);
              if (element === oldValue) {
                this.changeApplicationLetter = newValue;
                this.arrayFileIndex[0] = newValue;
                this.deleteFileArray.indexOf(this.ApplicationLetterOldValue) ===
                -1
                  ? this.deleteFileArray.push(this.ApplicationLetterOldValue)
                  : console.log("This item already exists");
                // console.log("deleteFileArray", this.deleteFileArray);

                console.log(this.arrayFileIndex);
              }
            });
          }
        }
      } else {
        this.arrayFileIndex.splice(
          this.arrayFileIndex.indexOf(this.changeApplicationLetter),
          1
        );
        this.deleteFileArray.splice(
          this.deleteFileArray.indexOf(this.ApplicationLetterOldValue),
          1
        );
        console.log("deleteFileArray", this.deleteFileArray);
      }
    },
    pds(newValue, oldValue) {
      if (newValue) {
        if (newValue.name != oldValue) {
          if (!this.PdsLetterOldValue) {
            this.deleteFileArray.push(oldValue);
            this.$set(this.arrayFileIndex, 1, newValue);
            console.log("Update PDS", this.arrayFileIndex);
            console.log("deleteFileArray", this.deleteFileArray);
            this.PdsLetterOldValue = oldValue;
            this.changePds = newValue;
          } else {
            this.arrayFileIndex.forEach((element) => {
              // console.log("OLD NEW DATA", element, oldValue);
              if (element === oldValue) {
                this.changePds = newValue;
                this.arrayFileIndex[1] = newValue;
                this.deleteFileArray.indexOf(this.PdsLetterOldValue) === -1
                  ? this.deleteFileArray.push(this.PdsLetterOldValue)
                  : console.log("This item already exists");
                // console.log("deleteFileArray", this.deleteFileArray);
                // console.log(this.arrayFileIndex);
              }
            });
          }
        }
      } else {
        this.arrayFileIndex.splice(
          this.arrayFileIndex.indexOf(this.changePds),
          1
        );
        this.deleteFileArray.splice(
          this.deleteFileArray.indexOf(this.PdsLetterOldValue),
          1
        );
        console.log("deleteFileArray", this.deleteFileArray);
      }
    },
    performance(newValue, oldValue) {
      if (newValue) {
        if (newValue.name != oldValue) {
          if (!this.PerformanceLetterOldValue) {
            this.deleteFileArray.push(oldValue);
            this.$set(this.arrayFileIndex, 2, newValue);
            console.log("Update Performance", this.arrayFileIndex);
            console.log("deleteFileArray", this.deleteFileArray);
            this.PerformanceLetterOldValue = oldValue;
            this.changePerformance = newValue;
          } else {
            this.arrayFileIndex.forEach((element) => {
              // console.log("OLD NEW DATA", element, oldValue);
              if (element === oldValue) {
                this.changePerformance = newValue;

                this.arrayFileIndex[2] = newValue;
                this.deleteFileArray.indexOf(this.PerformanceLetterOldValue) ===
                -1
                  ? this.deleteFileArray.push(this.PerformanceLetterOldValue)
                  : console.log("This item already exists");
                // console.log("deleteFileArray", this.deleteFileArray);
                // console.log(this.arrayFileIndex);
              }
            });
          }
        }
      } else {
        this.arrayFileIndex.splice(
          this.arrayFileIndex.indexOf(this.changePerformance),
          1
        );
        this.deleteFileArray.splice(
          this.deleteFileArray.indexOf(this.PerformanceLetterOldValue),
          1
        );
        console.log("deleteFileArray", this.deleteFileArray);
      }
    },
    eligibility(newValue, oldValue) {
      if (newValue) {
        if (newValue.name != oldValue) {
          if (!this.EligibilityLetterOldValue) {
            this.deleteFileArray.push(oldValue);
            this.$set(this.arrayFileIndex, 3, newValue);
            console.log("Update Eligibility", this.arrayFileIndex);
            console.log("deleteFileArray", this.deleteFileArray);
            this.EligibilityLetterOldValue = oldValue;
            this.changeEligibility = newValue;
          } else {
            this.arrayFileIndex.forEach((element) => {
              // console.log("OLD NEW DATA", element, oldValue);
              if (element === oldValue) {
                this.changeEligibility = newValue;

                this.arrayFileIndex[3] = newValue;
                this.deleteFileArray.indexOf(this.EligibilityLetterOldValue) ===
                -1
                  ? this.deleteFileArray.push(this.EligibilityLetterOldValue)
                  : console.log("This item already exists");
                // console.log("deleteFileArray", this.deleteFileArray);
                // console.log(this.arrayFileIndex);
              }
            });
          }
        }
      } else {
        this.arrayFileIndex.splice(
          this.arrayFileIndex.indexOf(this.changeEligibility),
          1
        );
        this.deleteFileArray.splice(
          this.deleteFileArray.indexOf(this.EligibilityLetterOldValue),
          1
        );
        console.log("deleteFileArray", this.deleteFileArray);
      }
    },
    tor(newValue, oldValue) {
      if (newValue) {
        if (newValue.name != oldValue) {
          if (!this.TorLetterOldValue) {
            this.deleteFileArray.push(oldValue);
            this.$set(this.arrayFileIndex, 4, newValue);
            console.log("Update TOR", this.arrayFileIndex);
            console.log("deleteFileArray", this.deleteFileArray);
            this.TorLetterOldValue = oldValue;
            this.changeTor = newValue;
          } else {
            this.arrayFileIndex.forEach((element) => {
              // console.log("OLD NEW DATA", element, oldValue);
              if (element === oldValue) {
                this.changeTor = newValue;

                this.arrayFileIndex[4] = newValue;
                this.deleteFileArray.indexOf(this.TorLetterOldValue) === -1
                  ? this.deleteFileArray.push(this.TorLetterOldValue)
                  : console.log("This item already exists");
                // console.log("deleteFileArray", this.deleteFileArray);
                // console.log(this.arrayFileIndex);
              }
            });
          }
        }
      } else {
        this.arrayFileIndex.splice(
          this.arrayFileIndex.indexOf(this.changeTor),
          1
        );
        this.deleteFileArray.splice(
          this.deleteFileArray.indexOf(this.TorLetterOldValue),
          1
        );
        console.log("deleteFileArray", this.deleteFileArray);
      }
    },
    employment(newValue, oldValue) {
      if (newValue) {
        if (newValue.name != oldValue) {
          if (!this.EmploymentLetterOldValue) {
            this.deleteFileArray.push(oldValue);
            this.$set(this.arrayFileIndex, 5, newValue);
            console.log("Update PDS", this.arrayFileIndex);
            console.log("deleteFileArray", this.deleteFileArray);
            this.EmploymentLetterOldValue = oldValue;
            this.changeEmployment = newValue;
          } else {
            this.arrayFileIndex.forEach((element) => {
              // console.log("OLD NEW DATA", element, oldValue);
              if (element === oldValue) {
                this.changeEmployment = newValue;

                this.arrayFileIndex[5] = newValue;
                this.deleteFileArray.indexOf(this.EmploymentLetterOldValue) ===
                -1
                  ? this.deleteFileArray.push(this.EmploymentLetterOldValue)
                  : console.log("This item already exists");
                // console.log("deleteFileArray", this.deleteFileArray);
                // console.log(this.arrayFileIndex);
              }
            });
          }
        }
      } else {
        this.arrayFileIndex.splice(
          this.arrayFileIndex.indexOf(this.changeEmployment),
          1
        );
        this.deleteFileArray.splice(
          this.deleteFileArray.indexOf(this.EmploymentLetterOldValue),
          1
        );
        console.log("deleteFileArray", this.deleteFileArray);
      }
    },
    seminars(newValue, oldValue) {
      if (newValue) {
        if (newValue.name != oldValue) {
          if (!this.SeminarLetterOldValue) {
            this.deleteFileArray.push(oldValue);
            this.$set(this.arrayFileIndex, 6, newValue);
            console.log("Update PDS", this.arrayFileIndex);
            console.log("deleteFileArray", this.deleteFileArray);
            this.SeminarLetterOldValue = oldValue;
            this.changeSeminar = newValue;
          } else {
            this.arrayFileIndex.forEach((element) => {
              // console.log("OLD NEW DATA", element, oldValue);
              if (element === oldValue) {
                this.changeSeminar = newValue;

                this.arrayFileIndex[6] = newValue;
                this.deleteFileArray.indexOf(this.SeminarLetterOldValue) === -1
                  ? this.deleteFileArray.push(this.SeminarLetterOldValue)
                  : console.log("This item already exists");
                // console.log("deleteFileArray", this.deleteFileArray);
                // console.log(this.arrayFileIndex);
              }
            });
          }
        }
      } else {
        this.arrayFileIndex.splice(
          this.arrayFileIndex.indexOf(this.changeSeminar),
          1
        );
        this.deleteFileArray.splice(
          this.deleteFileArray.indexOf(this.SeminarLetterOldValue),
          1
        );
        console.log("deleteFileArray", this.deleteFileArray);
      }
    },
  },

  methods: {
    education_attainded() {
      console.log("Highest Education", this.highestEducationData);
    },
    getJobPostId() {
      if (this.positionID == null) {
        console.log("Walay ID sa position");
      } else {
        this.axiosCall("/job-posting/fromHis/" + this.positionID, "GET").then(
          (res) => {
            console.log("POSTED JOB", res.data);
            this.postedJob = res.data;
          }
        );
      }
    },

    viewApplicationLetter() {
      let datastring = this.applicationletter.substring(7, 0);
      console.log("Substring", datastring);
      if (datastring == "default") {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "info";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message =
          "No file Uploaded, This file is not required";
      } else {
        let data = null;
        setTimeout(() => {
          data = null;
        }, 100);
        data = {
          filedesc: "Application Letter",
          filename: this.applicationletter,
        };
        this.fileToView = data;
      }
    },
    viewPDS() {
      let datastring = this.pds.substring(7, 0);
      console.log("Substring", datastring);
      if (datastring == "default") {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "info";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message =
          "No file Uploaded, This file is not required";
      } else {
        let data = null;
        setTimeout(() => {
          data = null;
        }, 100);
        data = {
          filedesc: "Personal Data Sheet",
          filename: this.pds,
        };
        this.fileToView = data;
      }
    },

    viewPerformance() {
      let datastring = this.performance.substring(7, 0);
      console.log("Substring", datastring);
      if (datastring == "default") {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "info";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message =
          "No file Uploaded, This file is not required";
      } else {
        let data = null;
        setTimeout(() => {
          data = null;
        }, 100);
        data = {
          filedesc: "Performance Rating",
          filename: this.performance,
        };
        this.fileToView = data;
      }
    },

    viewEligibility() {
      let datastring = this.eligibility.substring(7, 0);
      console.log("Substring", datastring);
      if (datastring == "default") {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "info";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message =
          "No file Uploaded, This file is not required";
      } else {
        let data = null;
        setTimeout(() => {
          data = null;
        }, 100);
        data = {
          filedesc: "Eligibility",
          filename: this.eligibility,
        };
        this.fileToView = data;
      }
    },

    viewTOR() {
      let datastring = this.tor.substring(7, 0);
      console.log("Substring", datastring);
      if (datastring == "default") {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "info";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message =
          "No file Uploaded, This file is not required";
      } else {
        let data = null;
        setTimeout(() => {
          data = null;
        }, 100);
        data = {
          filedesc: "Transcript Of Records",
          filename: this.tor,
        };
        this.fileToView = data;
      }
    },

    viewEmployment() {
      let datastring = this.employment.substring(7, 0);
      console.log("Substring", datastring);
      if (datastring == "default") {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "info";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message =
          "No file Uploaded, This file is not required";
      } else {
        let data = null;
        setTimeout(() => {
          data = null;
        }, 100);
        data = {
          filedesc: "Certificate of Employment",
          filename: this.employment,
        };
        this.fileToView = data;
      }
    },
    viewSeminar() {
      let datastring = this.seminars.substring(7, 0);
      console.log("Substring", datastring);
      if (datastring == "default") {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "info";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message =
          "No file Uploaded, This file is not required";
      } else {
        let data = null;
        setTimeout(() => {
          data = null;
        }, 100);
        data = {
          filedesc: "Certificate of Seminars",
          filename: this.seminars,
        };
        this.fileToView = data;
      }
    },

    initialize() {
      if (this.action != "Add") {
        console.log("Appplication Letter", this.application_letter);
        this.getOffices();
        this.getSchoolYear();
        this.getDesignations();
        this.getJobPostId();
      }
      if (this.action == "View") {
        this.show = true;
      }
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
      this.eventHub.$emit("closeMyJobApplicationDialog", false);
      this.initialize();
      this.dialog = false;
      this.dialog2 = false;
      this.show = false;
    },
    closeD1() {
      this.dialog2 = false;
    },
    addnew() {
      if (this.firstname == null || this.lastname == null) {
        // alert("Please fill up basic informations!");
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message = "Please fill up basic informations!";
      } else {
        const fd = new FormData();
        let file = new File(["default content"], "default.pdf", {
          type: "application/pdf",
        });
        // console.log("Default File", file);
        let letter;
        if (this.applicationletter == null) {
          letter = file;
        } else {
          letter = this.applicationletter;
        }

        let pds;
        if (this.pds == null) {
          pds = file;
        } else {
          pds = this.pds;
        }

        let performance;
        if (this.performance == null) {
          performance = file;
        } else {
          performance = this.performance;
        }

        let eligibility;
        if (this.eligibility == null) {
          eligibility = file;
        } else {
          eligibility = this.eligibility;
        }

        let tor;
        if (this.tor == null) {
          tor = file;
        } else {
          tor = this.tor;
        }

        let employment;
        if (this.employment == null) {
          employment = file;
        } else {
          employment = this.employment;
        }

        let seminars;
        if (this.seminars == null) {
          seminars = file;
        } else {
          seminars = this.seminars;
        }

        const arraaay = [
          letter,
          pds,
          performance,
          eligibility,
          tor,
          employment,
          seminars,
        ];
        console.log("arraaay", arraaay);

        for (let i = 0; i < arraaay.length; i++) {
          const element = arraaay[i];
          fd.append("file", element);
        }
        console.log(fd);

        const data = {
          firstname: this.firstname,
          position: this.positionname,
          item: this.positionItem,
          mi: this.mi,
          suffix: this.suffix,
          lastname: this.lastname,
          email: this.email,
          phone_number: this.phone,
          relegion: this.relegion,
          gender: this.genderadd,
          address: this.address,
          birth: this.birth,
          educ_qualification: this.highestEducationData,
          educ_qualification_grad: this.vocational_college_level,
          earned_Units: this.college_level_units,
          college_grad_course: this.college_grad_course,
          year_graduated: this.college_grad_year,
          master_grad_course: this.master_degree,
          year_graduated_masteral: this.master_year_units,
          doctoral_grad_course: this.doctor_year_course,
          year_graduated_doctoral: this.doctor_year_units,
          company_agency: this.company_agency,
          present_position: this.present_position,
          status_employment: this.status_employment,
          inclusive_from: this.inclusive_date_from,
          inclusive_date_to: this.inclusive_date_to,
          eligibility_form: this.EligibilityAdded,
        };
        console.log("Added Employee Data", data);
        fd.append("body", JSON.stringify(data));
        console.log("FD", fd);
        this.axiosCall(
          "/job-applicant/add-applicant-from-hris",
          "POST",
          fd
        ).then((resp) => {
          console.log(resp);
          if (resp.status == 201) {
            // alert("Succesfully Added:", );
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = resp.data.msg;
            this.closeD();
          } else if (resp.status == 401) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = resp.data.msg;
          }
        });
      }
    },

    update() {
      this.$emit("input", this.applicationletter);
      this.$emit("input", this.pds);
      this.$emit("input", this.performance);
      this.$emit("input", this.eligibility);
      this.$emit("input", this.tor);
      this.$emit("input", this.seminars);
      this.$emit("input", this.employment);
      console.log("Delete File Array", this.deleteFileArray);
      // console.log("New File Array", this.newUploadFileArray)
      if (this.arrayFileIndex[0]) {
        this.updateApplicationLetter = this.arrayFileIndex[0].name;
        console.log("naay data", this.arrayFileIndex[0].name);
      } else if (this.ApplicationLetterOldValue) {
        this.updateApplicationLetter = this.ApplicationLetterOldValue;
      } else {
        this.updateApplicationLetter = this.applicationletter;
      }
      if (this.arrayFileIndex[1]) {
        this.updatePds = this.arrayFileIndex[1].name;
        console.log("naay data", this.arrayFileIndex[1].name);
      } else if (this.PdsLetterOldValue) {
        this.updatePds = this.ApplicationLetterOldValue;
      } else {
        this.updatePds = this.pds;
      }
      if (this.arrayFileIndex[2]) {
        this.updatePerformance = this.arrayFileIndex[2].name;
        console.log("naay data", this.arrayFileIndex[2].name);
      } else if (this.PerformanceLetterOldValue) {
        this.updatePerformance = this.PerformanceLetterOldValue;
      } else {
        this.updatePerformance = this.performance;
      }

      if (this.arrayFileIndex[3]) {
        this.updateEligibility = this.arrayFileIndex[3].name;
        console.log("naay data", this.arrayFileIndex[3].name);
      } else if (this.EligibilityLetterOldValue) {
        this.updateEligibility = this.EligibilityLetterOldValue;
      } else {
        this.updateEligibility = this.eligibility;
      }
      if (this.arrayFileIndex[4]) {
        this.updateTor = this.arrayFileIndex[4].name;
        console.log("naay data", this.arrayFileIndex[4].name);
      } else if (this.TorLetterOldValue) {
        this.updateTor = this.TorLetterOldValue;
      } else {
        this.updateTor = this.tor;
      }
      if (this.arrayFileIndex[5]) {
        this.updateEmployment = this.arrayFileIndex[5].name;
        console.log("naay data", this.arrayFileIndex[5].name);
      } else if (this.EmploymentLetterOldValue) {
        this.updateEmployment = this.EmploymentLetterOldValue;
      } else {
        this.updateEmployment = this.employment;
      }
      if (this.arrayFileIndex[6]) {
        this.updateSeminars = this.arrayFileIndex[6].name;
        console.log("naay data", this.arrayFileIndex[6].name);
      } else if (this.SeminarLetterOldValue) {
        this.updateSeminars = this.SeminarLetterOldValue;
      } else {
        this.updateSeminars = this.seminars;
      }
      let data = {
        id: this.id,
        firstname: this.firstname,
        position: this.positionname,
        item: this.positionItem,
        mi: this.mi,
        suffix: this.suffix,
        lastname: this.lastname,
        email: this.email,
        phone_number: this.phone,
        relegion: this.relegion,
        gender: this.genderadd,
        address: this.address,
        birth: this.birth,
        educ_qualification: this.highestEducationData,
        educ_qualification_grad: this.vocational_college_level,
        earned_Units: this.college_level_units,
        college_grad_course: this.college_grad_course,
        year_graduated: this.college_grad_year,
        master_grad_course: this.master_degree,
        year_graduated_masteral: this.master_year_units,
        doctoral_grad_course: this.doctor_year_course,
        year_graduated_doctoral: this.doctor_year_units,
        company_agency: this.company_agency,
        present_position: this.present_position,
        status_employment: this.status_employment,
        inclusive_from: this.inclusive_date_from,
        inclusive_to: this.inclusive_date_to,
        eligibility_form: this.EligibilityAdded,
        application_letter: this.updateApplicationLetter,
        personal_data_sheet: this.updatePds,
        performance_rating: this.updatePerformance,
        proof_eligibility: this.updateEligibility,
        certificate_authority: this.updateTor,
        employment_experience: this.updateEmployment,
        training_seminar: this.updateSeminars,
      };
      console.log("Updated Data", data);

      // console.log(this.arrayFileIndex[0]);
      const fd = new FormData();
      for (let i = 0; i < this.arrayFileIndex.length; i++) {
        const element = this.arrayFileIndex[i];
        fd.append("file", element);
      }
      fd.append("body", JSON.stringify(data));
      this.axiosCall("/job-applicant/update-applicants-file/", "POST", fd).then(
        (res) => {
          console.log("Uploaded File", res.data);
          if (res.data.status == 201) {
            try {
              this.dialog = false;
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "success";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = "Successfully Updated!";
              this.closeD();
              // if (this.deleteFileArray) {
              //   const items = this.deleteFileArray;
              //   console.log(items);
              //   try {
              //     this.axiosCall(
              //       "/job-applicant/getArrayFile/",
              //       "POST",
              //       items
              //     ).then((res) => {
              //       console.log(res.data);
              //       // this.closeD();
              //     });
              //   } catch (error) {
              //     console.error("Error sending data:", error);
              //   }
              // }
            } catch (error) {
              console.error("Error sending data:", error);
            }
          } else if (res.data.status == 401) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
          }
        }
      );

      // console.log(this.changeApplicationLetter);
      // if (this.changeApplicationLetter == true) {
      //   console.log("true");
      //   this.newUploadFileArray.splice(
      //     this.newUploadFileArray.indexOf(this.updateApplicationLetter),
      //     1
      //   );
      // } else {
      //   if (this.newUploadFileArray) {
      //     const items = this.newUploadFileArray;
      //     try {
      //       this.axiosCall("/job-applicant/getArrayFile/", "POST", items).then(
      //         (res) => {
      //           console.log(res.data);
      //         }
      //       );
      //     } catch (error) {
      //       console.error("Error sending data:", error);
      //     }
      //   }
      //   console.log("File Application", this.applicationletter);
      //   this.updateApplicationLetter = this.applicationletter;
      // }

      // if (this.deleteFileArray) {
      //   const items = this.deleteFileArray;
      //   try {
      //     this.axiosCall("/job-applicant/getArrayFile/", "POST", items).then(
      //       (res) => {
      //         console.log(res.data);
      //       }
      //     );
      //   } catch (error) {
      //     console.error("Error sending data:", error);
      //   }
      // }

      // this.axiosCall(
      //   "/job-applicant/updatedApplicantData/" + this.id,
      //   "PATCH",
      //   data
      // ).then((res) => {
      //   console.log("Updated Data", res.data);
      //   //     if (res.data.status == 200) {
      //   //       this.dialog = false;
      //   //       this.fadeAwayMessage.show = true;
      //   //       this.fadeAwayMessage.type = "success";
      //   //       this.fadeAwayMessage.header = "System Message";
      //   //       this.fadeAwayMessage.message = res.data.msg;
      //   //       this.$refs.MyDesignationFormref.reset();
      //   //       this.closeD();
      //   //     } else if (res.data.status == 400) {
      //   //       this.dialog = false;
      //   //       this.fadeAwayMessage.show = true;
      //   //       this.fadeAwayMessage.type = "error";
      //   //       this.fadeAwayMessage.header = "System Message";
      //   //       this.fadeAwayMessage.message = res.data.msg;
      //   //     }
      // });
    },
    declined() {
      this.axiosCall(
        "/job-applicant/declinedApplicantData/" + this.id,
        "PATCH"
      ).then((res) => {
        console.log(res.data.status);
        if (res.data.status == 200) {
          this.axiosCall(
            "/job-posting/updateFromDeclineApplicant/" + this.positionID,
            "PATCH"
          ).then((res) => {
            console.log(res.data);
            this.closeD();
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "danger";
            this.fadeAwayMessage.header =
              "The applicant has been added to the declined list!";
            this.fadeAwayMessage.message = res.data.msg;
          });
        } else if (res.data.status == 400) {
          this.closeD();
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
        }
      });
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
