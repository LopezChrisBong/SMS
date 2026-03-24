<template>
  <div>
    <v-card v-if="!applicationForm">
      <v-card-title
        class="d-flex justify-center"
        style="background: linear-gradient(135deg, #f8f8f8, #bbb8b8)"
      >
        <span> {{ data ? data.position_title : "" }}</span>
        <!-- <v-spacer></v-spacer> -->
        <!-- <v-btn icon dark @click="close()">
          <v-icon>mdi-close</v-icon>
        </v-btn> -->
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text style="max-height: 2000px">
        <v-container fluid class="pa-0">
          <v-row dense>
            <v-col
              cols="12"
              md="6"
              class="px-5"
              style="border: #009e08 1px solid; border-radius: 10px"
            >
              <div class="info-row">
                <span class="info-label">Item No.</span>
                <span class="info-value">{{
                  data.plantilla_item || "N/A"
                }}</span>
              </div>

              <div class="info-row">
                <span class="info-label">Salary Grade</span>
                <v-chip
                  x-small
                  :color="data.salary_grade == 0 ? 'grey lighten-1' : 'green'"
                  dark
                >
                  {{
                    data.salary_grade == 0 ? "N/A" : "SG " + data.salary_grade
                  }}
                </v-chip>
              </div>

              <div class="info-row">
                <span class="info-label">
                  {{ data.salary_grade == 0 ? "Salary" : "Monthly Salary" }}
                </span>
                <span class="info-value">₱{{ data.monthly_salary }}</span>
              </div>

              <div class="info-row">
                <span class="info-label">Department</span>
                <span class="info-value">{{ data.unit_department }}</span>
              </div>
            </v-col>

            <v-col
              cols="12"
              md="6"
              class="px-5"
              style="border: #009e08 1px solid; border-radius: 10px"
            >
              <div class="info-row">
                <span class="info-label">Assignment</span>
                <span class="info-value">{{ data.place_assignment }}</span>
              </div>

              <div class="info-row">
                <span class="info-label">Eligibility</span>
                <span class="info-value">{{ data.eligibility }}</span>
              </div>

              <div class="info-row">
                <span class="info-label">Competency</span>
                <span class="info-value">{{ data.competency }}</span>
              </div>
            </v-col>
          </v-row>

          <v-divider class="my-4"></v-divider>

          <!-- EXPERIENCE -->
          <div class="section-title">Experience</div>
          <div class="section-content" v-html="data.experience"></div>

          <!-- EDUCATION -->
          <div class="section-title mt-4">Education</div>
          <div class="section-content" v-html="data.job_posting_content"></div>

          <!-- TRAINING -->
          <div class="section-title mt-4">Training</div>
          <div class="section-content" v-html="data.training"></div>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions
        class="pa-5"
        style="background: linear-gradient(135deg, #f8f8f8, #bbb8b8)"
      >
        <v-spacer></v-spacer>
        <v-btn
          style="background: linear-gradient(135deg, #f8f8f8, #bbb8b8)"
          outlined
          @click="close()"
        >
          <!-- <v-icon>mdi-close-circle-outline</v-icon> -->
          Return
        </v-btn>
        <v-btn color="#006d14" class="white--text" @click="apply()">
          <!-- <v-icon>mdi-check-circle</v-icon> -->
          Apply
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-else>
      <v-card-title
        class="d-flex justify-center text-center"
        style="background: linear-gradient(135deg, #f8f8f8, #bbb8b8)"
      >
        <strong
          ><span
            style="text-transform: uppercase"
            :class="$vuetify.breakpoint.smAndUp ? 'text-title' : 'text-caption'"
            >Application for {{ data ? data.position_title : "" }}</span
          ></strong
        >
        <!-- <v-spacer></v-spacer> -->
        <!-- <v-btn icon dark @click="close()">
          <v-icon>mdi-close</v-icon>
        </v-btn> -->
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text style="max-height: 2000px">
        <v-form ref="ApplicationForm" @submit.prevent>
          <v-stepper v-model="step" alt-labels>
            <!-- HEADER -->
            <v-stepper-header v-if="$vuetify.breakpoint.smAndUp">
              <v-stepper-step :complete="step > 1" step="1" color="green">
                Personal Info
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="step > 2" step="2" color="green">
                Education
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="step > 3" step="3" color="green">
                Employment
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="step > 4" step="4" color="green">
                Upload Files
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step step="5" color="green"> Review </v-stepper-step>
            </v-stepper-header>
            <v-stepper-header v-else>
              <div class="pa-5">
                Step {{ step }} of 5
                {{
                  step == 1
                    ? " - Personal Information"
                    : step == 2
                    ? " - Education"
                    : step == 3
                    ? " - Employment"
                    : step == 4
                    ? " - File Upload"
                    : " - Review"
                }}
              </div>
            </v-stepper-header>
            <v-stepper-items>
              <div class="pa-5">
                <strong>Instruction:</strong> Please enter "N/A" in any required
                field that does not apply to you.
              </div>
              <v-stepper-content step="1">
                <v-container>
                  <v-form ref="form1">
                    <v-row dense>
                      <!-- NAME -->
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="form.firstname"
                          label="Firstname"
                          outlined
                          color="green"
                          dense
                          :rules="[formRules.required]"
                        />
                      </v-col>

                      <v-col cols="12" md="2">
                        <v-text-field
                          v-model="form.mi"
                          label="M.I"
                          outlined
                          dense
                          color="green"
                        />
                      </v-col>

                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="form.lastname"
                          label="Lastname"
                          outlined
                          color="green"
                          dense
                          :rules="[formRules.required]"
                        />
                      </v-col>

                      <v-col cols="12" md="2">
                        <v-text-field
                          v-model="form.suffix"
                          label="Suffix"
                          outlined
                          color="green"
                          dense
                        />
                      </v-col>

                      <!-- CONTACT -->
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="form.email"
                          label="Email"
                          outlined
                          dense
                          color="green"
                          type="email"
                          :rules="[formRules.required, formRules.email]"
                        />
                      </v-col>

                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="form.number"
                          label="Phone Number"
                          color="green"
                          type="text"
                          maxlength="11"
                          @keypress="onlyDigits"
                          @input="cleanDigits"
                          :rules="[contactNoRule]"
                          outlined
                          dense
                        />
                      </v-col>

                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="form.religion"
                          color="green"
                          label="Religion"
                          outlined
                          dense
                          :rules="[formRules.required]"
                        />
                      </v-col>

                      <!-- SOGIE -->
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="form.gender"
                          color="green"
                          :items="genderOptions"
                          label="SOGIE"
                          outlined
                          dense
                          :rules="[formRules.required]"
                        />
                      </v-col>

                      <!-- BIRTHDATE -->
                      <v-col cols="12" md="6">
                        <v-text-field
                          outlined
                          label="*Birth Date"
                          v-model="form.birth"
                          :rules="[formRules.required]"
                          dense
                          required
                          type="date"
                          :max="BdaymaxDate"
                          class="text-uppercase"
                          @input="calculateAge(form.birth)"
                        />
                        <!-- <v-menu
                          v-model="menu"
                          :close-on-content-click="false"
                          transition="scale-transition"
                          offset-y
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="form.birth"
                              label="Birth Date"
                              color="green"
                              readonly
                              outlined
                              dense
                              v-bind="attrs"
                              v-on="on"
                            />
                          </template>

                          <v-date-picker
                            v-model="form.birth"
                            @input="menu = false"
                          />
                        </v-menu> -->
                      </v-col>

                      <!-- ADDRESS -->
                      <v-col cols="12">
                        <v-text-field
                          v-model="form.address"
                          label="Address (Prk./Brgy./City/Municipality)"
                          outlined
                          color="green"
                          dense
                          :rules="[formRules.required]"
                        />
                      </v-col> </v-row
                  ></v-form>
                </v-container>
              </v-stepper-content>

              <v-stepper-content step="2">
                <v-container>
                  <v-form ref="form2">
                    <v-row dense>
                      <!-- EDUCATION -->

                      <v-col cols="12" md="6">
                        <v-select
                          v-model="form.educQualification"
                          :items="educationOptions"
                          label="Highest Educational Attainment"
                          color="green"
                          outlined
                          dense
                          :rules="[formRules.required]"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-row>
                          <v-col
                            cols="12"
                            md="6"
                            v-if="
                              form.educQualification == 'Vocational' ||
                              form.educQualification == 'College Level'
                            "
                          >
                            <v-text-field
                              v-model="form.educQualificationGrad"
                              label="Course"
                              color="green"
                              outlined
                              :rules="
                                form.educQualification == 'Vocational' ||
                                form.educQualification == 'College Level'
                                  ? [formRules.required]
                                  : []
                              "
                              dense
                            />
                          </v-col>
                          <v-col
                            cols="12"
                            md="6"
                            v-if="form.educQualification == 'College Level'"
                          >
                            <v-text-field
                              v-model="form.earnedUnits"
                              label="Earned Units"
                              color="green"
                              :rules="
                                form.educQualification == 'College Level'
                                  ? [formRules.required]
                                  : []
                              "
                              outlined
                              dense
                            />
                          </v-col>
                          <v-col
                            cols="12"
                            md="6"
                            v-if="
                              form.educQualification == 'College Graduate' ||
                              form.educQualification == 'Post Graduate'
                            "
                          >
                            <v-text-field
                              v-model="form.collegeGradCourse"
                              label="Bachelors Degree/ Course"
                              outlined
                              :rules="
                                form.educQualification == 'College Graduate' ||
                                form.educQualification == 'Post Graduate'
                                  ? [formRules.required]
                                  : []
                              "
                              dense
                              color="green"
                            />
                          </v-col>
                          <v-col
                            cols="12"
                            md="6"
                            v-if="
                              form.educQualification == 'College Graduate' ||
                              form.educQualification == 'Post Graduate'
                            "
                          >
                            <v-text-field
                              v-model="form.yearGraduated"
                              label="Year Graduated/ Earned Unit"
                              outlined
                              color="green"
                              :rules="
                                form.educQualification == 'College Graduate' ||
                                form.educQualification == 'Post Graduate'
                                  ? [formRules.required]
                                  : []
                              "
                              dense
                            />
                          </v-col>
                          <v-col
                            cols="12"
                            md="6"
                            v-if="form.educQualification == 'Post Graduate'"
                          >
                            <v-text-field
                              v-model="form.masterGradCourse"
                              label="Master's Degree"
                              outlined
                              color="green"
                              :rules="
                                form.educQualification == 'Post Graduate'
                                  ? [formRules.required]
                                  : []
                              "
                              dense
                            />
                          </v-col>
                          <v-col
                            cols="12"
                            md="6"
                            v-if="form.educQualification == 'Post Graduate'"
                          >
                            <v-text-field
                              v-model="form.yearGraduatedMasteral"
                              label="Year Graduated/ Earned Unit 'N/A if not applicable'"
                              outlined
                              color="green"
                              :rules="
                                form.educQualification == 'Post Graduate'
                                  ? [formRules.required]
                                  : []
                              "
                              dense
                            />
                          </v-col>
                          <v-col
                            cols="12"
                            md="6"
                            v-if="form.educQualification == 'Post Graduate'"
                          >
                            <v-text-field
                              v-model="form.doctoralGradCourse"
                              label="Doctorate Degree 'N/A if not applicable'"
                              color="green"
                              outlined
                              dense
                              :rules="
                                form.educQualification == 'Post Graduate'
                                  ? [formRules.required]
                                  : []
                              "
                            />
                          </v-col>
                          <v-col
                            cols="12"
                            md="6"
                            v-if="form.educQualification == 'Post Graduate'"
                          >
                            <v-text-field
                              v-model="form.yearGraduatedDoctoral"
                              label="Year Graduated/ Earned Unit"
                              outlined
                              dense
                              color="green"
                              :rules="
                                form.educQualification == 'Post Graduate'
                                  ? [formRules.required]
                                  : []
                              "
                            />
                          </v-col>
                        </v-row>
                      </v-col> </v-row
                  ></v-form>
                </v-container>
              </v-stepper-content>

              <v-stepper-content step="3">
                <v-container>
                  <v-form ref="form3">
                    <v-row dense>
                      <!-- EMPLOYMENT -->
                      <v-col cols="12">
                        <v-text-field
                          v-model="form.companyAgency"
                          label="Latest Company/Agency"
                          color="green"
                          outlined
                          dense
                          :rules="[formRules.required]"
                        />
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="form.presentposition"
                          label="Present/Latest Position"
                          color="green"
                          outlined
                          dense
                          :rules="[formRules.required]"
                        />
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="form.statusEmployment"
                          label="Status of Employment"
                          color="green"
                          outlined
                          dense
                          :rules="[formRules.required]"
                        />
                      </v-col>

                      <!-- ELIGIBILITY -->
                      <v-col cols="12">
                        <v-text-field
                          v-model="form.eligibilityForm"
                          color="green"
                          label="Eligibility"
                          outlined
                          dense
                          :rules="[formRules.required]"
                        />
                      </v-col>

                      <!-- CHECKBOX SECTION -->
                      <v-col cols="12">
                        <div class="text-info font-weight-bold">
                          Instruction: Kindly check if you belong to any of the
                          following:
                        </div>
                      </v-col>

                      <v-col cols="12">
                        <v-checkbox
                          v-model="form.pwdChecked"
                          label="Person with Disability - if yes, specify"
                        />
                        <v-text-field
                          v-model="form.pwd"
                          placeholder="Please specify"
                          outlined
                          color="green"
                          dense
                          :disabled="!form.pwdChecked"
                        />
                      </v-col>

                      <v-col cols="12">
                        <v-checkbox v-model="form.pregnant" label="Pregnant" />
                      </v-col>

                      <v-col cols="12">
                        <v-checkbox
                          v-model="form.indigenousChecked"
                          label="Indigenous community - if yes, specify"
                        />
                        <v-text-field
                          v-model="form.indigenous"
                          placeholder="Specify Indigenous community"
                          outlined
                          color="green"
                          dense
                          :disabled="!form.indigenousChecked"
                        />
                      </v-col> </v-row
                  ></v-form>
                </v-container>
              </v-stepper-content>

              <v-stepper-content step="4">
                <v-container>
                  <v-form ref="form4">
                    <v-row dense>
                      <!-- FILE UPLOAD SECTION -->
                      <v-col cols="12">
                        <div class="text-uppercase font-weight-bold red--text">
                          Instruction: Upload file in PDF format. If multiple
                          pages, merge into ONE (1) PDF file.
                        </div>
                      </v-col>

                      <v-col cols="12">
                        <v-file-input
                          v-model="form.application"
                          :rules="[formRules.required]"
                          color="green"
                          label="Application Letter .*Required"
                          counter
                          dense
                          prepend-icon="mdi-paperclip"
                          accept="application/pdf"
                          outlined
                          show-size
                          @change="fileChange()"
                        >
                          <template v-slot:selection="{ index, text }">
                            <v-chip
                              v-if="index < 2"
                              color="green"
                              dark
                              label
                              small
                            >
                              {{ text }}
                            </v-chip>

                            <span
                              v-else-if="index === 2"
                              class="text-overline grey--text text--darken-3 mx-2"
                            >
                              +{{ files.length - 2 }} File(s)
                            </span>
                          </template>
                        </v-file-input>
                      </v-col>

                      <v-col cols="12">
                        <v-file-input
                          v-model="form.pds"
                          label="Personal Data Sheet (PDS).*Required"
                          outlined
                          color="green"
                          dense
                          :rules="[formRules.required]"
                          counter
                          prepend-icon="mdi-paperclip"
                          accept="application/pdf"
                          show-size
                          @change="fileChange()"
                        >
                          <template v-slot:selection="{ index, text }">
                            <v-chip
                              v-if="index < 2"
                              color="green"
                              dark
                              label
                              small
                            >
                              {{ text }}
                            </v-chip>

                            <span
                              v-else-if="index === 2"
                              class="text-overline grey--text text--darken-3 mx-2"
                            >
                              +{{ files.length - 2 }} File(s)
                            </span>
                          </template>
                        </v-file-input>
                      </v-col>

                      <v-col cols="12">
                        <v-file-input
                          v-model="form.performance"
                          :label="`Performance Rating${
                            data.performance_rating === 'required'
                              ? '.*Require'
                              : ''
                          }`"
                          outlined
                          color="green"
                          dense
                          counter
                          prepend-icon="mdi-paperclip"
                          accept="application/pdf"
                          show-size
                          @change="fileChange()"
                          :rules="
                            data.performance_rating === 'required'
                              ? [formRules.required]
                              : []
                          "
                        >
                          <template v-slot:selection="{ index, text }">
                            <v-chip
                              v-if="index < 2"
                              color="green"
                              dark
                              label
                              small
                            >
                              {{ text }}
                            </v-chip>

                            <span
                              v-else-if="index === 2"
                              class="text-overline grey--text text--darken-3 mx-2"
                            >
                              +{{ files.length - 2 }} File(s)
                            </span>
                          </template>
                        </v-file-input>
                      </v-col>

                      <v-col cols="12">
                        <v-file-input
                          v-model="form.eligibility"
                          :label="`Certificate of Eligibility/Rating${
                            data.certificate_eligibility === 'required'
                              ? '.*Require'
                              : ''
                          }`"
                          outlined
                          color="green"
                          dense
                          counter
                          prepend-icon="mdi-paperclip"
                          accept="application/pdf"
                          show-size
                          @change="fileChange()"
                          :rules="
                            data.certificate_eligibility === 'required'
                              ? [formRules.required]
                              : []
                          "
                        >
                          <template v-slot:selection="{ index, text }">
                            <v-chip
                              v-if="index < 2"
                              color="green"
                              dark
                              label
                              small
                            >
                              {{ text }}
                            </v-chip>

                            <span
                              v-else-if="index === 2"
                              class="text-overline grey--text text--darken-3 mx-2"
                            >
                              +{{ files.length - 2 }} File(s)
                            </span>
                          </template>
                        </v-file-input>
                      </v-col>

                      <v-col cols="12">
                        <v-file-input
                          v-model="form.TOR"
                          :label="`Transcript of Records${
                            data.transcript_record === 'required'
                              ? '.*Require'
                              : ''
                          }`"
                          outlined
                          color="green"
                          dense
                          counter
                          prepend-icon="mdi-paperclip"
                          accept="application/pdf"
                          show-size
                          @change="fileChange()"
                          :rules="
                            data.transcript_record === 'required'
                              ? [formRules.required]
                              : []
                          "
                        >
                          <template v-slot:selection="{ index, text }">
                            <v-chip
                              v-if="index < 2"
                              color="green"
                              dark
                              label
                              small
                            >
                              {{ text }}
                            </v-chip>

                            <span
                              v-else-if="index === 2"
                              class="text-overline grey--text text--darken-3 mx-2"
                            >
                              +{{ files.length - 2 }} File(s)
                            </span>
                          </template>
                        </v-file-input>
                      </v-col>
                      <v-col cols="12">
                        <v-file-input
                          v-model="form.employment"
                          :label="`Certificate of Employment${
                            data.certificate_employment === 'required'
                              ? '.*Require'
                              : ''
                          }`"
                          outlined
                          color="green"
                          dense
                          counter
                          prepend-icon="mdi-paperclip"
                          accept="application/pdf"
                          show-size
                          @change="fileChange()"
                          :rules="
                            data.certificate_employment === 'required'
                              ? [formRules.required]
                              : []
                          "
                        >
                          <template v-slot:selection="{ index, text }">
                            <v-chip
                              v-if="index < 2"
                              color="green"
                              dark
                              label
                              small
                            >
                              {{ text }}
                            </v-chip>

                            <span
                              v-else-if="index === 2"
                              class="text-overline grey--text text--darken-3 mx-2"
                            >
                              +{{ files.length - 2 }} File(s)
                            </span>
                          </template>
                        </v-file-input>
                      </v-col>
                      <v-col cols="12">
                        <v-file-input
                          v-model="form.seminars"
                          :label="`Certificate/s of Training${
                            data.certificate_training === 'required'
                              ? '.*Require'
                              : ''
                          }`"
                          outlined
                          color="green"
                          dense
                          counter
                          prepend-icon="mdi-paperclip"
                          accept="application/pdf"
                          show-size
                          @change="fileChange()"
                          :rules="
                            data.certificate_training === 'required'
                              ? [formRules.required]
                              : []
                          "
                        >
                          <template v-slot:selection="{ index, text }">
                            <v-chip
                              v-if="index < 2"
                              color="green"
                              dark
                              label
                              small
                            >
                              {{ text }}
                            </v-chip>

                            <span
                              v-else-if="index === 2"
                              class="text-overline grey--text text--darken-3 mx-2"
                            >
                              +{{ files.length - 2 }} File(s)
                            </span>
                          </template>
                        </v-file-input>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-stepper-content>

              <v-stepper-content step="5">
                <v-container>
                  <h3 class="mb-4">Review Your Application</h3>

                  <v-alert type="info" outlined>
                    Please review your information before submitting.
                  </v-alert>
                  <div>
                    <strong>Name:</strong> {{ form.firstname }}
                    {{ form.lastname }}
                  </div>
                  <div><strong>Email:</strong> {{ form.email }}</div>
                  <div>
                    <strong>Present Position:</strong>
                    {{ form.presentposition }}
                  </div>
                  <div>
                    <strong>Eligibility:</strong>
                    {{ form.eligibilityForm }}
                  </div>
                </v-container>

                <!-- <v-btn color="#006d14" class="white--text" @click="submit()">
                  Submit Application
                </v-btn> -->
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions
        class="pa-5"
        style="background: linear-gradient(135deg, #f8f8f8, #bbb8b8)"
      >
        <v-btn
          style="background: linear-gradient(135deg, #f8f8f8, #bbb8b8)"
          outlined
          @click="returnCareer()"
          v-if="step == 1"
        >
          <!-- <v-icon>mdi-close-circle-outline</v-icon> -->
          Return
        </v-btn>
        <v-btn
          style="background: linear-gradient(135deg, #f8f8f8, #bbb8b8)"
          outlined
          @click="backStep()"
          v-if="step != 1"
        >
          <!-- <v-icon>mdi-close-circle-outline</v-icon> -->
          Back
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn
          color="#006d14"
          class="white--text"
          @click="submit()"
          v-if="step == 5"
          :loading="BTNloading"
        >
          <!-- <v-icon>mdi-check-circle</v-icon> -->
          Submit
        </v-btn>
        <v-btn
          color="#006d14"
          class="white--text"
          @click="nextStep()"
          v-if="step != 5"
        >
          <!-- <v-icon>mdi-check-circle</v-icon> -->
          Next
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="dialog" max-width="600" scrollable>
      <v-card>
        <v-card-title
          class="white--text"
          style="
            background-image: linear-gradient(
              to bottom right,
              #013d1f,
              #009e08
            );
          "
        >
          Data Privacy Consent
          <v-spacer></v-spacer>
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text style="text-align: justify; font-size: 14px">
          <p><strong>Data Privacy Statement</strong></p>

          <p>
            <strong>Davao del Norte State College (DNSC)</strong> will gather
            your name, email address, contact numbers, and other personal
            details. These details are collected for the purpose of your
            application for a vacant position.
          </p>

          <p>
            The personal information and other requested credentials will be
            kept for as long as necessary to fulfill the intended purpose. DNSC
            ensures that this information and documents remain secure and
            accessible solely to authorized individuals.
          </p>

          <p>
            When it comes time for disposal, it will be done securely to prevent
            further processing, unauthorized access, or disclosure to any third
            party or the public.
          </p>

          <p>
            All actions are taken in strict adherence to the provisions of
            <strong>RA 10173</strong>, also known as the
            <strong>Data Privacy Act of 2012</strong>, and its implementing
            rules.
          </p>

          <p>
            By continuing, you express your consent for DNSC to collect,
            process, store, and dispose of your personal information in
            accordance with <strong>RA 10173</strong> and its regulations.
          </p>

          <p>
            All provided information and uploaded credentials will be handled
            with the utmost confidentiality. Thank you.
          </p>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="red" dark @click="disagree"> Disagree </v-btn>

          <v-btn
            style="
              background-image: linear-gradient(
                to bottom right,
                #013d1f,
                #009e08
              );
            "
            dark
            @click="agree"
          >
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="returnDialog" max-width="600" scrollable>
      <v-card>
        <v-card-title
          class="white--text"
          style="
            background-image: linear-gradient(
              to bottom right,
              #013d1f,
              #009e08
            );
          "
        >
          Return Confirmation
          <v-spacer></v-spacer>
          <v-btn icon dark @click="returnDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text style="text-align: justify; font-size: 14px">
          <v-alert type="warning" outlined class="mt-4">
            You have made changes into this form! do you want to return? all
            changes will be reset.
          </v-alert>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="red" dark @click="returnDialog = false"> close </v-btn>

          <v-btn
            style="
              background-image: linear-gradient(
                to bottom right,
                #013d1f,
                #009e08
              );
            "
            dark
            @click="close()"
          >
            confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="successSubmitDialog"
      max-width="600"
      scrollable
      persistent
    >
      <v-card>
        <v-card-title
          class="white--text"
          style="
            background-image: linear-gradient(
              to bottom right,
              #013d1f,
              #009e08
            );
          "
        >
          Successfully submitted
          <v-spacer></v-spacer>
          <!-- <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn> -->
        </v-card-title>

        <v-card-text style="text-align: justify; font-size: 14px">
          <v-alert type="info" outlined class="mt-4"
            >An email has been sent to the email address provided in your
            application. Please check your spam or junk folder in case the
            message was filtered.
          </v-alert>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>

          <!-- <v-btn color="red" dark @click="returnDialog = false">
            close
          </v-btn> -->

          <v-btn
            style="
              background-image: linear-gradient(
                to bottom right,
                #013d1f,
                #009e08
              );
            "
            dark
            @click="close()"
          >
            Ok
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
      successSubmitDialog: false,
      id: null,
      dialog: false,
      applicationForm: false,
      BTNloading: false,
      returnDialog: false,
      step: 1,
      form: {
        firstname: "",
        mi: "",
        lastname: "",
        suffix: "",
        email: "",
        number: "",
        religion: "",
        gender: null,
        birth: null,
        address: "",
        educQualification: null,
        educQualificationGrad: "",
        companyAgency: "",
        presentposition: "",
        statusEmployment: "",
        eligibilityForm: "",
        pwdChecked: false,
        pwd: "",
        pregnant: false,
        indigenousChecked: false,
        indigenous: "",
        application: null,
        pds: null,
        performance: null,
        eligibility: null,
        TOR: null,
        employment: null,
        seminars: null,
        earnedUnits: null,
        collegeGradCourse: null,
        yearGraduated: null,
        masterGradCourse: null,
        yearGraduatedMasteral: null,
        doctoralGradCourse: null,
        yearGraduatedDoctoral: null,
      },
      valid: false,
      menu: false,
      filesCheckApplication: true,
      filesCheckPDS: true,
      filesCheckTOR: true,
      filesCheckPerformance: true,
      filesCheckEligibility: true,
      filesCheckEmployment: true,
      filesCheckSeminar: true,
      toReturn: true,
      genderOptions: ["Man", "Woman", "Non-binary", "Prefer not to say"],

      educationOptions: [
        "Elementary Level",
        "Elementary Graduate",
        "High School Level",
        "High School Graduate",
        "Vocational",
        "College Level",
        "College Graduate",
        "Post Graduate",
      ],
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
    form: {
      handler(newVal, oldVal) {
        console.log("Form changed", newVal, oldVal);
        this.toReturn = false;
      },
      deep: true,
    },
  },
  computed: {
    BdaymaxDate() {
      return new Date().toISOString().split("T")[0];
    },
    contactNoRule() {
      return (v) => {
        if (!v || v.length !== 11) return "Contact number must be 11 digits";
        if (!/^0/.test(v)) return "Contact number must start with 0.";
        return true;
      };
    },
  },
  methods: {
    close() {
      this.eventHub.$emit("closeJobPostApplicationForm", false);
      this.dialog = false;
    },
    returnCareer() {
      if (this.toReturn) {
        this.close();
      } else {
        this.returnDialog = true;
      }
    },
    apply() {
      this.dialog = true;
    },
    submit() {
      if (this.$refs.form4.validate()) {
        this.BTNloading = true;
        this.checkFileHaveValue();
        const fd = new FormData();
        let application = this.form.application;
        let pds = this.form.pds;
        let performance = this.form.performance;
        let eligibility = this.form.eligibility;
        let tor = this.form.TOR;
        let employment = this.form.employment;
        let seminars = this.form.seminars;
        const arrayData = [
          application,
          pds,
          performance,
          eligibility,
          tor,
          employment,
          seminars,
        ];
        for (let i = 0; i < arrayData.length; i++) {
          const element = arrayData[i];
          fd.append("file", element);
        }
        let data = {
          firstname: this.form.firstname,
          position: this.data.position_title,
          positionID: this.data.id,
          mi: this.form.mi,
          lastname: this.form.lastname,
          suffix: this.form.suffix,
          email: this.form.email,
          phone_number: this.form.number,
          relegion: this.form.religion,
          sogie_value: this.form.gender,
          birth: this.form.birth,
          education: this.data.education
            ? this.data.education
            : this.data.job_posting_content,
          address: this.form.address,
          educ_qualification: this.form.educQualification,
          educ_qualification_grad: this.form.educQualificationGrad,
          company_agency: this.form.companyAgency,
          present_position: this.form.presentposition,
          status_employment: this.form.statusEmployment,
          eligibility_form: this.form.eligibilityForm,
          pwd_check: this.form.pwdChecked == false ? "" : "checked",
          pwd_value: this.form.pwd,
          pregnant_check: this.form.pregnant == false ? "" : "checked",
          indigenous_check:
            this.form.indigenousChecked == false ? "" : "checked",
          indigenous_value: this.form.indigenous,
          earned_Units: this.form.earnedUnits,
          college_grad_course: this.form.collegeGradCourse,
          year_graduated: this.form.yearGraduated,
          master_grad_course: this.form.masterGradCourse,
          year_graduated_masteral: this.form.yearGraduatedMasteral,
          doctoral_grad_course: this.form.doctoralGradCourse,
          year_graduated_doctoral: this.form.yearGraduatedDoctoral,
          work_experience: this.data.experience,
          work_eligibility: this.data.eligibility,
          work_training: this.data.training,
          item: this.data.plantilla_item,
          unit_department: this.data.unit_department,
          inclusive_from: this.data.date_from,
          inclusive_to: this.data.date_to,
        };
        fd.append("body", JSON.stringify(data));
        console.log(data, fd);

        this.axiosCall("/job-applicant/multiple", "POST", fd).then((res) => {
          if (res.data.status == 200 || res.data.status == 201) {
            // this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.message = res.data.msg;
            this.fadeAwayMessage.header = "System Message";
            // this.$refs.ApplicationForm.reset();
            setTimeout(() => {
              this.successSubmitDialog = true;
            }, 2000);
          } else {
            this.dialog = false;
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
        this.fadeAwayMessage.message = "Please fill all required fields!";
      }
    },
    checkFileHaveValue() {
      if (this.form.application) {
        let originalFile = null;

        if (this.form.application) {
          originalFile = this.form.application;
        }

        if (originalFile) {
          const cleanLastName = this.form.lastname
            .replace(/\s/g, "")
            .replace(/%20/g, "");

          const renamedFile = new File(
            [originalFile],
            `ApplicationLetter_${cleanLastName}.pdf`,
            {
              type: originalFile.type,
              lastModified: originalFile.lastModified,
            },
          );

          renamedFile.file_type_uploaded = "application";

          this.form.application = renamedFile;
        }
      } else {
        const cleanLastName = this.form.lastname
          .replace(/\s/g, "")
          .replace(/%20/g, "");
        this.form.application = new File(
          ["default content"],
          `defaultApplication_${cleanLastName}.pdf`,
          {
            type: "application/pdf",
          },
        );
      }
      if (this.form.pds) {
        let originalFile = null;

        if (this.form.pds) {
          originalFile = this.form.pds;
        }

        if (originalFile) {
          const cleanLastName = this.form.lastname
            .replace(/\s/g, "")
            .replace(/%20/g, "");

          const renamedFile = new File(
            [originalFile],
            `PdsLetter_${cleanLastName}.pdf`,
            {
              type: originalFile.type,
              lastModified: originalFile.lastModified,
            },
          );

          renamedFile.file_type_uploaded = "application";

          this.form.pds = renamedFile;
        }
      } else {
        const cleanLastName = this.form.lastname
          .replace(/\s/g, "")
          .replace(/%20/g, "");
        this.form.pds = new File(
          ["default content"],
          `defaultPds_${cleanLastName}.pdf`,
          {
            type: "application/pdf",
          },
        );
      }
      if (this.form.performance) {
        let originalFile = null;

        if (this.form.performance) {
          originalFile = this.form.performance;
        }

        if (originalFile) {
          const cleanLastName = this.form.lastname
            .replace(/\s/g, "")
            .replace(/%20/g, "");

          const renamedFile = new File(
            [originalFile],
            `PerformanceLetter_${cleanLastName}.pdf`,
            {
              type: originalFile.type,
              lastModified: originalFile.lastModified,
            },
          );

          renamedFile.file_type_uploaded = "application";

          this.form.performance = renamedFile;
        }
      } else {
        const cleanLastName = this.form.lastname
          .replace(/\s/g, "")
          .replace(/%20/g, "");
        this.form.performance = new File(
          ["default content"],
          `defaultPerformance_${cleanLastName}.pdf`,
          {
            type: "application/pdf",
          },
        );
      }
      if (this.form.eligibility) {
        let originalFile = null;

        if (this.form.eligibility) {
          originalFile = this.form.eligibility;
        }

        if (originalFile) {
          const cleanLastName = this.form.lastname
            .replace(/\s/g, "")
            .replace(/%20/g, "");

          const renamedFile = new File(
            [originalFile],
            `EligibilityLetter_${cleanLastName}.pdf`,
            {
              type: originalFile.type,
              lastModified: originalFile.lastModified,
            },
          );

          renamedFile.file_type_uploaded = "application";

          this.form.eligibility = renamedFile;
        }
      } else {
        const cleanLastName = this.form.lastname
          .replace(/\s/g, "")
          .replace(/%20/g, "");
        this.form.eligibility = new File(
          ["default content"],
          `defaultEligibility_${cleanLastName}.pdf`,
          {
            type: "application/pdf",
          },
        );
      }
      if (this.form.TOR) {
        let originalFile = null;

        if (this.form.TOR) {
          originalFile = this.form.TOR;
        }

        if (originalFile) {
          const cleanLastName = this.form.lastname
            .replace(/\s/g, "")
            .replace(/%20/g, "");

          const renamedFile = new File(
            [originalFile],
            `TORLetter_${cleanLastName}.pdf`,
            {
              type: originalFile.type,
              lastModified: originalFile.lastModified,
            },
          );

          renamedFile.file_type_uploaded = "application";

          this.form.TOR = renamedFile;
        }
      } else {
        const cleanLastName = this.form.lastname
          .replace(/\s/g, "")
          .replace(/%20/g, "");
        this.form.TOR = new File(
          ["default content"],
          `defaultTOR_${cleanLastName}.pdf`,
          {
            type: "application/pdf",
          },
        );
      }
      if (this.form.employment) {
        let originalFile = null;

        if (this.form.employment) {
          originalFile = this.form.employment;
        }

        if (originalFile) {
          const cleanLastName = this.form.lastname
            .replace(/\s/g, "")
            .replace(/%20/g, "");

          const renamedFile = new File(
            [originalFile],
            `EmploymentLetter_${cleanLastName}.pdf`,
            {
              type: originalFile.type,
              lastModified: originalFile.lastModified,
            },
          );

          renamedFile.file_type_uploaded = "application";

          this.form.employment = renamedFile;
        }
      } else {
        const cleanLastName = this.form.lastname
          .replace(/\s/g, "")
          .replace(/%20/g, "");
        this.form.employment = new File(
          ["default content"],
          `defaultEmployment_${cleanLastName}.pdf`,
          {
            type: "application/pdf",
          },
        );
      }
      if (this.form.seminars) {
        let originalFile = null;

        if (this.form.seminars) {
          originalFile = this.form.seminars;
        }

        if (originalFile) {
          const cleanLastName = this.form.lastname
            .replace(/\s/g, "")
            .replace(/%20/g, "");

          const renamedFile = new File(
            [originalFile],
            `SeminarLetter_${cleanLastName}.pdf`,
            {
              type: originalFile.type,
              lastModified: originalFile.lastModified,
            },
          );

          renamedFile.file_type_uploaded = "application";

          this.form.seminars = renamedFile;
        }
      } else {
        const cleanLastName = this.form.lastname
          .replace(/\s/g, "")
          .replace(/%20/g, "");
        this.form.seminars = new File(
          ["default content"],
          `defaultSeminar_${cleanLastName}.pdf`,
          {
            type: "application/pdf",
          },
        );
      }
    },
    agree() {
      this.applicationForm = true;
      this.dialog = false;
    },
    disagree() {
      location.reload();
    },

    nextStep() {
      if (this.step == 1) {
        if (this.$refs.form1.validate()) {
          this.step = 2;
        }
      } else if (this.step == 2) {
        if (this.$refs.form2.validate()) {
          this.step = 3;
        }
      } else if (this.step == 3) {
        if (this.$refs.form3.validate()) {
          this.step = 4;
        }
      } else if (this.step == 4) {
        if (
          !this.filesCheckApplication ||
          !this.filesCheckPDS ||
          !this.filesCheckPerformance ||
          !this.filesCheckEligibility ||
          !this.filesCheckSeminar ||
          !this.filesCheckEmployment ||
          !this.filesCheckTOR
        ) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message =
            "All files must be PDF format, please update file format!";
          return;
        }
        if (this.$refs.form4.validate()) {
          this.step = 5;
        }
      }
    },
    backStep() {
      if (this.step == 5) {
        this.step = 4;
      } else if (this.step == 4) {
        this.step = 3;
      } else if (this.step == 3) {
        this.step = 2;
      } else if (this.step == 2) {
        this.step = 1;
      }
    },
    fileChange() {
      if (this.form.application) {
        this.filesCheckApplication = true;
        let filename = this.form.application.name.split(".")[0];
        if (filename.length > 150) {
          this.form.application = null;
          this.filesCheckApplication = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "Filename too long!";
        }

        let filesize = this.form.application.size;
        if (filesize == 0) {
          this.form.application = null;
          this.filesCheckApplication = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "File is corrupted!!";
        } else if (filesize == 10000000) {
          this.form.application = null;
          this.filesCheckApplication = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "File size to big, 10MB maximum!";
        }

        let application_file_accepted =
          this.form.application.name.split(".")[
            this.form.application.name.split(".").length - 1
          ];

        if (application_file_accepted !== "pdf") {
          this.form.application = null;
          this.filesCheckApplication = false;
          this.$nextTick(() => {
            this.form.application = null;
          });
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message =
            "File format not allowed! Only PDF allowed.";
        }
      }
      if (this.form.pds) {
        this.filesCheckPDS = true;
        let filename = this.form.pds.name.split(".")[0];
        if (filename.length > 150) {
          this.form.pds = null;
          this.filesCheckPDS = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "Filename too long!";
        }

        let filesize = this.form.pds.size;
        if (filesize == 0) {
          this.form.pds = null;
          this.filesCheckPDS = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "File is corrupted!!";
        } else if (filesize == 10000000) {
          this.form.pds = null;
          this.filesCheckPDS = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "File size to big, 10MB maximum!";
        }

        let pds_file_accepted =
          this.form.pds.name.split(".")[
            this.form.pds.name.split(".").length - 1
          ];

        if (pds_file_accepted !== "pdf") {
          this.form.pds = null;
          this.filesCheckPDS = false;
          this.$nextTick(() => {
            this.form.pds = null;
          });
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message =
            "File format not allowed! Only PDF allowed.";
        }
      }
      if (this.form.performance) {
        this.filesCheckPerformance = true;
        let filename = this.form.performance.name.split(".")[0];
        if (filename.length > 150) {
          this.form.performance = null;
          this.filesCheckPerformance = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "Filename too long!";
        }

        let filesize = this.form.performance.size;
        if (filesize == 0) {
          this.form.performance = null;
          this.filesCheckPerformance = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "File is corrupted!!";
        } else if (filesize == 10000000) {
          this.form.performance = null;
          this.filesCheckPerformance = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "File size to big, 10MB maximum!";
        }

        let performance_file_accepted =
          this.form.performance.name.split(".")[
            this.form.performance.name.split(".").length - 1
          ];

        if (performance_file_accepted !== "pdf") {
          this.form.performance = null;
          this.filesCheckPerformance = false;
          this.$nextTick(() => {
            this.form.performance = null;
          });
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message =
            "File format not allowed! Only PDF allowed.";
        }
      }
      if (this.form.eligibility) {
        this.filesCheckEligibility = true;
        let filename = this.form.eligibility.name.split(".")[0];
        if (filename.length > 150) {
          this.form.eligibility = null;
          this.filesCheckEligibility = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "Filename too long!";
        }

        let filesize = this.form.eligibility.size;
        if (filesize == 0) {
          this.form.eligibility = null;
          this.filesCheckEligibility = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "File is corrupted!!";
        } else if (filesize == 10000000) {
          this.form.eligibility = null;
          this.filesCheckEligibility = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "File size to big, 10MB maximum!";
        }

        let eligibility_file_accepted =
          this.form.eligibility.name.split(".")[
            this.form.eligibility.name.split(".").length - 1
          ];

        if (eligibility_file_accepted !== "pdf") {
          this.form.eligibility = null;
          this.filesCheckEligibility = false;
          this.$nextTick(() => {
            this.form.eligibility = null;
          });
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message =
            "File format not allowed! Only PDF allowed.";
        }
      }
      if (this.form.TOR) {
        this.filesCheckTOR = true;
        let filename = this.form.TOR.name.split(".")[0];
        if (filename.length > 150) {
          this.form.TOR = null;
          this.filesCheckTOR = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "Filename too long!";
        }

        let filesize = this.form.TOR.size;
        if (filesize == 0) {
          this.form.TOR = null;
          this.filesCheckTOR = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "File is corrupted!!";
        } else if (filesize == 10000000) {
          this.form.TOR = null;
          this.filesCheckTOR = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "File size to big, 10MB maximum!";
        }

        let TOR_file_accepted =
          this.form.TOR.name.split(".")[
            this.form.TOR.name.split(".").length - 1
          ];

        if (TOR_file_accepted !== "pdf") {
          this.form.TOR = null;
          this.filesCheckTOR = false;
          this.$nextTick(() => {
            this.form.TOR = null;
          });
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message =
            "File format not allowed! Only PDF allowed.";
        }
      }
      if (this.form.employment) {
        this.filesCheckEmployment = true;
        let filename = this.form.employment.name.split(".")[0];
        if (filename.length > 150) {
          this.form.employmentEmplo = null;
          this.filesCheckEmployment = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "Filename too long!";
        }

        let filesize = this.form.employment.size;
        if (filesize == 0) {
          this.form.employment = null;
          this.filesCheckEmployment = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "File is corrupted!!";
        } else if (filesize == 10000000) {
          this.form.employment = null;
          this.filesCheckEmployment = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "File size to big, 10MB maximum!";
        }

        let employment_file_accepted =
          this.form.employment.name.split(".")[
            this.form.employment.name.split(".").length - 1
          ];

        if (employment_file_accepted !== "pdf") {
          this.form.employment = null;
          this.filesCheckEmployment = false;
          this.$nextTick(() => {
            this.form.employment = null;
          });
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message =
            "File format not allowed! Only PDF allowed.";
        }
      }
      if (this.form.seminars) {
        this.filesCheckSeminar = true;
        let filename = this.form.seminars.name.split(".")[0];
        if (filename.length > 150) {
          this.form.seminars = null;
          this.filesCheckSeminar = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "Filename too long!";
        }

        let filesize = this.form.seminars.size;
        if (filesize == 0) {
          this.form.seminars = null;
          this.filesCheckSeminar = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "File is corrupted!!";
        } else if (filesize == 10000000) {
          this.form.seminars = null;
          this.filesCheckSeminar = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "File size to big, 10MB maximum!";
        }

        let seminars_file_accepted =
          this.form.seminars.name.split(".")[
            this.form.seminars.name.split(".").length - 1
          ];

        if (seminars_file_accepted !== "pdf") {
          this.form.seminars = null;
          this.filesCheckSeminar = false;
          this.$nextTick(() => {
            this.form.seminars = null;
          });
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message =
            "File format not allowed! Only PDF allowed.";
        }
      }
    },
    onlyDigits(event) {
      if (!/^\d$/.test(event.key)) {
        event.preventDefault();
      }
    },
    cleanDigits(event) {
      event.target.value = event.target.value.replace(/\D/g, "");
    },
    calculateAge(birthDate) {
      if (!birthDate) return;

      const currentDate = new Date();
      if (new Date(birthDate) > currentDate) {
        this.form.birth = null;
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message = "Invalid Input. Check your date entry";
      }

      const diffTime = currentDate - new Date(birthDate);
      const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      this.form.age = Math.floor(totalDays / 365.25);
      // this.months = Math.floor((totalDays % 365.25) / 30.4375);
      // this.days = Math.floor((totalDays % 365.25) % 30.4375);
    },
  },
};
</script>
<style scoped>
.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
}

.info-label {
  font-size: 13px;
  color: #6c757d;
  font-weight: 500;
}

.info-value {
  font-size: 12px;
  font-weight: 600;
  text-align: right;
  max-width: 60%;
}

.section-title {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 6px;
}

.section-content {
  font-size: 14px;
  text-align: justify;
  line-height: 1.6;
}
</style>
