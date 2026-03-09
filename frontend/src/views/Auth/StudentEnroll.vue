<template>
  <v-container fluid class="py-8">
    <v-form ref="myEnrollForm">
      <v-card class="pa-6 elevation-3 rounded-xl">
        <!-- TITLE -->
        <v-row class="align-center mb-6">
          <!-- LEFT SIDE -->
          <v-col cols="12" md="6">
            <div class="d-flex align-center">
              <v-icon left color="orange">mdi-school</v-icon>
              <h2 class="mb-0 font-weight-bold">Student Enrollment Form</h2>
            </div>
          </v-col>

          <!-- RIGHT SIDE -->
          <v-col
            cols="12"
            md="6"
            class="d-flex justify-end align-center flex-wrap"
          >
            <div
              class="d-flex align-center"
              style="gap: 12px; width: 100%; max-width: 800px"
            >
              <!-- LRN -->
              <v-text-field
                v-model="formdata.lrn"
                :rules="[formRules.required]"
                outlined
                maxlength="12"
                hide-details
                class="rounded-lg"
                label="* LRN ID"
                color="orange"
              />

              <!-- Code -->
              <v-text-field
                v-model="code"
                outlined
                hide-details
                label="Code"
                color="orange"
                class="rounded-lg"
              />

              <!-- Search Button -->
              <v-btn
                min-height="45"
                color="orange"
                class="white--text rounded-lg"
                @click="searchStudent()"
              >
                <v-icon left small>mdi-magnify</v-icon>
                Search
              </v-btn>
            </div>
          </v-col>
        </v-row>
        <!-- ================= ACADEMIC INFORMATION ================= -->
        <v-card outlined class="pa-4 mb-6 rounded-lg">
          <div class="section-title">
            <v-icon left small color="orange">mdi-school-outline</v-icon>
            Academic Information
          </div>
          <v-divider class="mb-6 mt-2"></v-divider>

          <v-row dense>
            <v-col cols="12" md="4">
              <v-select
                :items="schooYearList"
                outlined
                label="School Year"
                color="orange"
                class="rounded-lg"
                item-text="school_year"
                item-value="id"
                v-model="selectedFiter"
              ></v-select>
            </v-col>

            <v-col cols="12" md="4">
              <v-select
                :items="
                  levelCheck == 'Elementary'
                    ? seniorJuniorList1
                    : seniorJuniorList
                "
                label="* Grade Level"
                :rules="[formRules.required]"
                color="orange"
                class="rounded-lg"
                outlined
                v-model="formdata.seniorJunior"
              ></v-select>
            </v-col>

            <v-col cols="12" md="4">
              <v-select
                :rules="[formRules.required]"
                :items="
                  formdata.seniorJunior == 'Elementary'
                    ? elementaryList
                    : formdata.seniorJunior == 'Primary'
                    ? primaryList
                    : formdata.seniorJunior == 'Junior High'
                    ? juniorList
                    : formdata.seniorJunior == 'Senior High'
                    ? seniorList
                    : []
                "
                label="* Grades"
                color="orange"
                class="rounded-lg"
                outlined
                v-model="grade_level"
              ></v-select>
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                :items="semesterList"
                v-if="formdata.seniorJunior == 'Senior High'"
                :rules="
                  formdata.seniorJunior == 'Senior High'
                    ? [formRules.required]
                    : []
                "
                label="* Semester"
                color="orange"
                outlined
                v-model="transfer.semester"
              ></v-select>
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                :items="trackList"
                v-if="formdata.seniorJunior == 'Senior High'"
                :rules="
                  formdata.seniorJunior == 'Senior High'
                    ? [formRules.required]
                    : []
                "
                label="* Tracks"
                color="orange"
                item-text="tracks_name"
                item-value="id"
                outlined
                v-model="transfer.track"
                @change="changeTrackData($event)"
              ></v-select>
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                :items="strandList"
                v-if="formdata.seniorJunior == 'Senior High'"
                :rules="
                  formdata.seniorJunior == 'Senior High'
                    ? [formRules.required]
                    : []
                "
                label="* Strand"
                color="orange"
                item-text="strand_name"
                item-value="id"
                outlined
                v-model="transfer.strand"
              ></v-select>
            </v-col>
          </v-row>
        </v-card>

        <!-- ================= STUDENT INFORMATION ================= -->
        <v-card outlined class="pa-4 mb-6 rounded-lg">
          <div class="section-title">
            <v-icon left small color="orange">mdi-account</v-icon>
            Student Information
          </div>
          <v-divider class="mb-6 mt-2"></v-divider>

          <v-row dense>
            <v-col cols="12" md="3">
              <v-text-field
                class="rounded-lg"
                v-model="formdata.fname"
                label="* First Name"
                :rules="[formRules.required]"
                outlined
                required
              />
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                class="rounded-lg"
                v-model="formdata.mname"
                label="Middle Name"
                outlined
              />
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                class="rounded-lg"
                v-model="formdata.lname"
                label="* Last Name"
                :rules="[formRules.required]"
                outlined
                required
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="formdata.suffix"
                outlined
                class="rounded-lg"
                label="Suffix"
                color="orange"
              >
              </v-text-field>
            </v-col>

            <v-col cols="12" md="3">
              <!-- <v-text-field
                v-model="displayDate"
                label="* Birthdate"
                placeholder="MM/DD/YYYY"
                outlined
                class="rounded-lg"
                @blur="convertDate"
              /> -->
              <v-text-field
                class="rounded-lg"
                v-model="formdata.bdate"
                label="* Birthdate"
                :rules="[formRules.required]"
                type="date"
                outlined
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="formdata.birth_place"
                outlined
                class="rounded-lg"
                label="* Place of Birth"
                :rules="[formRules.required]"
                color="orange"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                class="rounded-lg"
                v-model="formdata.sex"
                :items="['Male', 'Female']"
                label="* Sex"
                outlined
              />
            </v-col>
            <v-col
              cols="12"
              md="3"
              v-if="levelCheck == 'High School' ? 'd-none' : ''"
            >
              <v-select
                :items="cvl_statusItem"
                label="Civil Status"
                color="orange"
                outlined
                v-model="formdata.civil_status"
              ></v-select>
              <v-text-field
                v-if="formdata.civil_status == 'Others'"
                v-model="formdata.civil_status1"
                outlined
                class="rounded-lg"
                color="orange"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="formdata.height"
                outlined
                class="rounded-lg"
                label="Height (m)"
                color="orange"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="formdata.weight"
                outlined
                class="rounded-lg"
                label="Weight (kg)"
                color="orange"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                :items="bloodTypeList"
                label="Blood Type"
                outlined
                class="rounded-lg"
                color="orange"
                v-model="formdata.blood_type"
              ></v-select>
            </v-col>

            <v-col cols="12" md="3">
              <v-select
                :items="dualCtznItem"
                label="Citizenship (Filipino)"
                outlined
                class="rounded-lg"
                color="orange"
                v-model="formdata.isFilipino"
              ></v-select>
            </v-col>

            <v-col cols="12" md="3">
              <v-select
                :items="dualCtznItem"
                label="IP's Member"
                color="orange"
                outlined
                class="rounded-lg"
                v-model="formdata.is_IP"
              ></v-select>
              <v-text-field
                v-if="formdata.is_IP == 'Yes'"
                v-model="formdata.ip_Name"
                :rules="formdata.is_IP == 'Yes' ? [formRules.required] : []"
                outlined
                class="rounded-lg"
                item-text="type"
                item-value="id"
                label="Tribe/Group Name"
                color="orange"
              >
              </v-text-field>
            </v-col>

            <v-col cols="12" md="3">
              <v-select
                :items="dualCtznItem"
                label="4P's Beneficiary"
                color="orange"
                outlined
                class="rounded-lg"
                v-model="formdata.fourPs"
              ></v-select>
              <v-text-field
                v-if="formdata.fourPs == 'Yes'"
                v-model="formdata.fourpis"
                :rules="formdata.fourPs == 'Yes' ? [formRules.required] : []"
                outlined
                class="rounded-lg"
                item-text="type"
                item-value="id"
                label="* Household ID number"
                color="orange"
              >
              </v-text-field>
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                v-model="formdata.mobile_no"
                label="Mobile Number"
                outlined
                class="rounded-lg"
                color="orange"
                type="tel"
                @keypress="onlyDigits"
                :maxlength="11"
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="formdata.email"
                outlined
                class="rounded-lg"
                label="Email address"
                color="orange"
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <strong>Is the child a Learner with Disability?</strong>
              <v-divider class="mb-6 mt-2"></v-divider
            ></v-col>
            <v-col cols="12" sm="6" md="6" lg="6" xl="6">
              <v-select
                :items="dualCtznItem"
                label="Yes / No:"
                color="orange"
                outlined
                class="rounded-lg"
                v-model="formdata.disability"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="6" lg="6" xl="6">
              <v-text-field
                v-model="transfer.disability_desc"
                v-if="formdata.disability == 'Yes'"
                :rules="
                  formdata.disability == 'Yes' ? [formRules.required] : []
                "
                outlined
                class="rounded-lg"
                label="If Yes, specify the type of disability:"
                color="orange"
              >
              </v-text-field>
            </v-col>
          </v-row>
        </v-card>

        <!-- ================= ADDRESS INFORMATION ================= -->
        <v-card outlined class="pa-4 mb-6 rounded-lg">
          <div class="section-title">
            <v-icon left small color="orange">mdi-map-marker</v-icon>
            Address Information
          </div>
          <v-divider class="mb-6 mt-2"></v-divider>

          <v-row dense>
            <v-col cols="12" sm="12" md="12" lg="12" xl="12">
              <strong>Residential Address</strong>

              <v-divider class="mb-6 mt-2"></v-divider>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="formdata.residential_house_no"
                outlined
                class="rounded-lg"
                label="House Number"
                color="orange"
              >
              </v-text-field>
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                v-model="formdata.residential_street"
                outlined
                class="rounded-lg"
                label="Street/Purok"
                color="orange"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="formdata.residential_subd"
                outlined
                class="rounded-lg"
                label="Subdivision / Village"
                color="orange"
              >
              </v-text-field>
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                v-model="formdata.residential_brgy"
                outlined
                :rules="[formRules.required]"
                class="rounded-lg"
                label="* Barangay"
                color="orange"
              >
              </v-text-field>
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                v-model="formdata.residential_city"
                outlined
                class="rounded-lg"
                :rules="[formRules.required]"
                label="* Municipality / City"
                color="orange"
              >
              </v-text-field>
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                v-model="formdata.residential_prov"
                outlined
                class="rounded-lg"
                :rules="[formRules.required]"
                label="* Province"
                color="orange"
              >
              </v-text-field>
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                v-model="formdata.residential_zip"
                :rules="[(v) => v.length === 4 || 'Must be 4 digits']"
                outlined
                class="rounded-lg"
                type="tel"
                @keypress="onlyDigits"
                :maxlength="4"
                label="* Zip Code"
                color="orange"
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="12" md="12" lg="12" xl="12">
              <strong>Permanent Address</strong>
              <v-divider class="mb-6 mt-2"></v-divider>
              <v-checkbox
                v-model="computedSameAddress"
                label="Is Same Address"
                dense
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="formdata.permanent_house_no"
                outlined
                class="rounded-lg"
                label="House Number"
                color="orange"
              >
              </v-text-field>
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                v-model="formdata.permanent_street"
                outlined
                class="rounded-lg"
                label="Street/Purok"
                color="orange"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="formdata.permanent_subd"
                outlined
                class="rounded-lg"
                label="Subdivision / Village"
                color="orange"
              >
              </v-text-field>
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                v-model="formdata.permanent_brgy"
                outlined
                :rules="[formRules.required]"
                class="rounded-lg"
                label="* Barangay"
                color="orange"
              >
              </v-text-field>
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                v-model="formdata.permanent_city"
                outlined
                class="rounded-lg"
                :rules="[formRules.required]"
                label="* Municipality / City"
                color="orange"
              >
              </v-text-field>
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                v-model="formdata.permanent_prov"
                outlined
                class="rounded-lg"
                :rules="[formRules.required]"
                label="* Province"
                color="orange"
              >
              </v-text-field>
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                v-model="formdata.permanent_zip"
                :rules="[(v) => v.length === 4 || 'Must be 4 digits']"
                outlined
                class="rounded-lg"
                type="tel"
                @keypress="onlyDigits"
                :maxlength="4"
                label="* Zip Code"
                color="orange"
              >
              </v-text-field>
            </v-col>
          </v-row>
        </v-card>

        <!-- ================= FAMILY INFORMATION ================= -->
        <v-card outlined class="pa-4 mb-6 rounded-lg">
          <div class="section-title">
            <v-icon left small color="orange">mdi-account-group</v-icon>
            Family Background
          </div>
          <v-divider class="mb-6 mt-2"></v-divider>
          <v-row dense>
            <v-col cols="12" sm="12" md="12" lg="12" xl="12">
              <strong>Father</strong>

              <v-divider class="mb-6 mt-2"></v-divider>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="family_background.father_fname"
                outlined
                @keyup="changeGuardian()"
                class="rounded-lg"
                label="First Name"
                color="orange"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="family_background.father_mname"
                outlined
                class="rounded-lg"
                label="Middle Name"
                color="orange"
              >
              </v-text-field>
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                v-model="family_background.father_lname"
                outlined
                class="rounded-lg"
                label="Last Name"
                color="orange"
              >
              </v-text-field>
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                v-model="family_background.father_number"
                outlined
                class="rounded-lg"
                label="Phone Number"
                color="orange"
                type="tel"
                @keypress="onlyDigits"
                maxlength="11"
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="12" md="12" lg="12" xl="12">
              <strong>Mother's Maiden Name</strong>

              <v-divider class="mb-6 mt-2"></v-divider>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="family_background.mother_fname"
                @keyup="changeGuardian()"
                outlined
                class="rounded-lg"
                label="First Name"
                color="orange"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="family_background.mother_mname"
                outlined
                class="rounded-lg"
                label="Middle Name"
                color="orange"
              >
              </v-text-field>
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                v-model="family_background.mother_lname"
                outlined
                class="rounded-lg"
                label="Last Name"
                color="orange"
              >
              </v-text-field>
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                v-model="family_background.mother_number"
                outlined
                class="rounded-lg"
                label="Phone Number"
                color="orange"
                type="tel"
                @keypress="onlyDigits"
                maxlength="11"
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row v-if="guardianNeed">
            <v-col cols="12"
              ><strong>Legal Guardian's Name</strong>

              <v-divider></v-divider
            ></v-col>
            <v-col cols="12" sm="3" md="3" lg="3" xl="3">
              <v-text-field
                v-model="family_background.guardian_fname"
                outlined
                class="rounded-lg"
                label="First Name"
                color="orange"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="3" md="3" lg="3" xl="3">
              <v-text-field
                v-model="family_background.guardian_mname"
                outlined
                class="rounded-lg"
                label="Middle Name"
                color="orange"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="3" md="3" lg="3" xl="3">
              <v-text-field
                v-model="family_background.guardian_lname"
                outlined
                class="rounded-lg"
                label="Last Name"
                color="orange"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="3" md="3" lg="3" xl="3">
              <v-text-field
                v-model="family_background.guardian_number"
                label="Phone Number"
                type="tel"
                maxlength="11"
                outlined
                class="rounded-lg"
                color="orange"
                @keypress="onlyDigits"
              />
            </v-col>
          </v-row>
        </v-card>

        <!-- ================= TRANSFER INFORMATION ================= -->
        <v-card outlined class="pa-4 mb-6 rounded-lg">
          <div class="section-title">
            <v-icon left small color="orange">mdi-swap-horizontal</v-icon>
            Transfer Information
          </div>
          <v-divider class="mb-6 mt-2"></v-divider>

          <v-row dense>
            <v-col cols="12" md="6">
              <v-select
                class="rounded-lg"
                v-model="formdata.transfered"
                :items="['Yes', 'No']"
                label="Transferee?"
                outlined
              />
            </v-col>

            <v-col cols="12" md="6"> </v-col>

            <v-col cols="12" md="3" v-if="formdata.transfered === 'Yes'">
              <v-select
                v-if="formdata.transfered == 'Yes'"
                :rules="
                  formdata.transfered == 'Yes' ? [formRules.required] : []
                "
                :items="
                  formdata.seniorJunior == 'Elementary'
                    ? [
                        'Kinder 1',
                        'Kinder 2',
                        'Grade 1',
                        'Grade 2',
                        'Grade 3',
                        'Grade 4',
                        'Grade 5',
                      ]
                    : formdata.seniorJunior == 'Primary'
                    ? primaryList
                    : formdata.seniorJunior == 'Junior High'
                    ? ['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9']
                    : formdata.seniorJunior == 'Senior High'
                    ? ['Grade 10', 'Grade 11']
                    : []
                "
                label="Last Grade Level Completed"
                color="orange"
                outlined
                class="rounded-lg"
                v-model="transfer.last_grade_completed"
              ></v-select>
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-if="formdata.transfered == 'Yes'"
                :rules="
                  formdata.transfered == 'Yes' ? [formRules.required] : []
                "
                :items="schooYearList"
                label="Last School Year Level Completed"
                color="orange"
                item-text="school_year"
                item-value="id"
                outlined
                class="rounded-lg"
                v-model="transfer.last_year_completed"
              ></v-select> </v-col
            ><v-col cols="12" md="3"
              ><v-text-field
                v-model="transfer.last_school_attended"
                v-if="formdata.transfered == 'Yes'"
                :rules="
                  formdata.transfered == 'Yes' ? [formRules.required] : []
                "
                outlined
                class="rounded-lg"
                label="Last School Attended"
                color="orange"
              >
              </v-text-field
            ></v-col>
            <v-col cols="12" md="3"
              ><v-text-field
                v-model="transfer.last_school_ID"
                v-if="formdata.transfered == 'Yes'"
                :rules="
                  formdata.transfered == 'Yes' ? [formRules.required] : []
                "
                outlined
                class="rounded-lg"
                label="School ID"
                color="orange"
              >
              </v-text-field
            ></v-col>
          </v-row>
        </v-card>

        <!-- ================= FILE UPLOADS ================= -->
        <!-- <v-card
          outlined
          class="pa-4 mb-6 rounded-lg"
          v-if="
            grade_level == 'Grade 7' ||
            grade_level == 'Grade 1' ||
            formdata.transfered == 'Yes'
          "
        > -->
        <v-card outlined class="pa-4 mb-6 rounded-lg">
          <div class="section-title">
            <v-icon left small color="orange">mdi-file-document</v-icon>
            Required Documents
          </div>
          <v-divider class="mb-6 mt-2"></v-divider>

          <v-row dense>
            <v-col cols="12" md="6">
              <v-file-input
                outlined
                v-model="GoodMoral"
                :rules="
                  formdata.transfered == 'Yes' ? [formRules.required] : []
                "
                class="rounded-lg"
                label="Good Moral"
                color="orange"
                accept=".pdf, .png, .jpg, .jpeg"
                :clearable="false"
              >
              </v-file-input>
            </v-col>

            <v-col cols="12" md="6">
              <v-file-input
                outlined
                v-model="SchoolCard"
                :rules="
                  formdata.transfered == 'Yes' ? [formRules.required] : []
                "
                class="rounded-lg"
                label="School Card/Form137"
                color="orange"
                accept=".pdf, .png, .jpg, .jpeg"
                :clearable="false"
              >
              </v-file-input>
            </v-col>

            <v-col cols="12" md="6">
              <v-file-input
                outlined
                v-model="PSA"
                :rules="
                  formdata.transfered == 'Yes' ? [formRules.required] : []
                "
                class="rounded-lg"
                label="Birth Certificate (PSA)"
                color="orange"
                accept=".pdf, .png, .jpg, .jpeg"
                :clearable="false"
              >
              </v-file-input>
            </v-col>

            <v-col cols="12" md="6">
              <v-file-input
                outlined
                v-model="Picture"
                class="rounded-lg"
                label="2x2 Picture"
                color="orange"
                accept=".pdf, .png, .jpg, .jpeg"
                :clearable="false"
              >
              </v-file-input>
            </v-col>
          </v-row>
        </v-card>

        <!-- ================= ACTION BUTTONS ================= -->
        <v-row class="mt-10" justify="center" no-gutters>
          <v-col cols="auto" class="mr-2" v-if="action !== 'Update'">
            <v-btn
              width="200"
              height="40"
              size="large"
              color="grey"
              flat
              prepend-icon="mdi-content-save-outline"
              class="white--text rounded-lg"
              @click="confirmSave(1)"
            >
              Save Draft
            </v-btn>
          </v-col>

          <v-col cols="auto">
            <v-btn
              width="200"
              height="40"
              size="large"
              color="#f5b027"
              flat
              prepend-icon="mdi-send"
              elevation="3"
              class="white--text font-weight-bold rounded-lg"
              @click="confirmSave(2)"
            >
              {{
                action === "Update" ? "Update Enrollment" : "Submit Enrollment"
              }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-form>
    <!-- ================= CONFIRMATION DIALOG ================= -->
    <v-dialog v-model="confirmDialog" persistent max-width="380">
      <v-card class="rounded-xl elevation-3">
        <!-- ICON + TITLE -->
        <div class="text-center pt-6 px-6">
          <v-avatar size="56" color="#e8f5e9">
            <v-icon color="#4caf50" size="32">mdi-check-circle-outline</v-icon>
          </v-avatar>

          <div class="text-h6 font-weight-bold mt-3">
            {{
              action == "Update"
                ? "Update Confirmation"
                : confirmAction + " Confirmation"
            }}
          </div>

          <p
            v-if="confirmAction == 'Submit'"
            class="text-body-2 grey--text text--darken-1 mt-2"
          >
            Are you sure you want to submit this enrollment?
          </p>

          <p v-else class="text-body-2 grey--text text--darken-1 mt-2">
            Please click <strong>Save</strong> to partially save your input.
          </p>
        </div>

        <!-- ACTION BUTTONS -->
        <v-card-actions class="justify-end px-6 pb-5">
          <v-btn
            outlined
            color="grey darken-1"
            class="rounded-lg"
            @click="confirmDialog = false"
          >
            Cancel
          </v-btn>

          <v-btn
            color="#4caf50"
            class="white--text rounded-lg ml-2"
            elevation="1"
            @click="saveUpdate"
          >
            <v-icon left small>mdi-check</v-icon>
            {{ action == "Update" ? "Update" : confirmAction }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="saveConfirmation" persistent max-width="500">
      <v-card class="rounded-xl pa-2">
        <v-card-title class="d-flex align-center gap-2 pb-2">
          <span class="text-h6 font-weight-bold"> Saved Success </span>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="text-center py-6">
          <div class="text-body-1 mb-4">
            Please take a screenshot or photo of the code below. You will use
            this code to update your details later.
          </div>

          <v-sheet
            class="pa-4 mx-auto"
            max-width="320"
            rounded="lg"
            elevation="2"
            color="orange"
          >
            <div class="text-caption white--text mb-1">Your Code</div>
            <div class="text-h5 font-weight-bold white--text">
              {{ savedData.CODE }}
            </div>
          </v-sheet>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="px-6 py-4">
          <v-btn @click="copyCode()" outlined color="orange"
            ><v-icon>mdi-content-copy</v-icon>Copy</v-btn
          >
          <v-spacer></v-spacer>

          <v-btn @click="proceedLandingPage()" color="orange" outlined>
            Confirm Save
          </v-btn>
        </v-card-actions>
      </v-card> </v-dialog
    ><v-dialog>
      <template v-slot:activator="{ on, attrs }">
        <!-- Add Contribution Button -->
        <v-btn
          color="orange"
          fab
          dark
          md
          fixed
          left
          bottom
          v-bind="attrs"
          v-on="on"
          @click="goLanding()"
        >
          <v-icon dark>mdi-arrow-collapse-left</v-icon>
        </v-btn>
      </template>
    </v-dialog>
    <!-- Loading Overlay -->
    <div v-if="loadingState" class="loading-overlay">
      <div class="spinner"></div>
      <p>Loading, please wait...</p>
    </div>
    <fade-away-message-component
      displayType="variation2"
      v-model="fadeAwayMessage.show"
      :message="fadeAwayMessage.message"
      :header="fadeAwayMessage.header"
      :top="fadeAwayMessage.top"
      :type="fadeAwayMessage.type"
    ></fade-away-message-component>
  </v-container>
</template>

<script>
export default {
  name: "Enroll",
  components: {},
  data: () => ({
    juniorList: ["Grade 7", "Grade 8", "Grade 9", "Grade 10"],
    savedData: [],
    elementaryList: [
      "Kinder 1",
      "Kinder 2",
      "Grade 1",
      "Grade 2",
      "Grade 3",
      "Grade 4",
      "Grade 5",
      "Grade 6",
    ],
    seniorList: ["Grade 11", "Grade 12"],
    sheet: false,
    guardianNeed: true,
    viewRemarks: false,
    submitDialog: false,
    mobile: "",
    isUpdate: true,
    isUpdateAllowed: false,
    confirmAction: null,
    confirmDialog: false,
    saveConfirmation: false,
    itemData: null,
    indexToRemove: null,
    arrToRemove: null,
    semesterList: ["1st Semester", "2nd Semester"],
    empData: [],
    tab: { id: 1, name: "Personal Information" },
    activeTab: { id: 1, name: "Personal Information" },
    tabList: [{ id: 1, name: "Learner Information" }],
    sexItem: ["Male", "Female"],
    cvl_statusItem: ["Single", "Married", "Widowed", "Separated", "Others"],
    dualCtznItem: ["Yes", "No"],
    ctznTypeList: [
      { id: 1, type: "By birth" },
      { id: 2, type: "By naturalization" },
    ],
    countryList: [],
    seniorJuniorList: ["Junior High", "Senior High"],
    seniorJuniorList1: ["Elementary"],
    status: null,
    code: null,
    bloodTypeList: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    displayDate: "",
    formdata: {
      id: null,
      fname: "",
      lname: "",
      mname: "",
      suffix: "",
      fourPs: "No",
      fourpis: "",
      seniorJunior: "",
      transfered: "No",
      email: "",
      bdate: "",
      is_IP: "No",
      ip_Name: "",
      birth_place: "",
      lrn: "",
      sex: "",
      civil_status: "Single",
      civil_status1: "Single",
      height: "",
      weight: "",
      blood_type: "",
      last_grade_completed: "",
      last_year_completed: "",
      last_school_attended: "",
      last_school_ID: "",
      citizenship: "",
      isFilipino: "Yes",
      disability: "No",
      disability_desc: "",
      country: "",
      tel_no: "",
      mobile_no: "",
      residential_zip: "",
      residential_house_no: "",
      residential_street: "",
      residential_subd: "",
      residential_brgy: "",
      residential_city: "",
      residential_prov: "",
      permanent_zip: "",
      permanent_house_no: "",
      permanent_street: "",
      permanent_subd: "",
      permanent_brgy: "",
      permanent_city: "",
      permanent_prov: "",
      isSameAddress: false,
    },
    transfer: {
      id: null,
      last_grade_completed: null,
      last_year_completed: null,
      last_school_attended: null,
      last_school_ID: null,
      track: null,
      semester: null,
      strand: null,
    },
    grade_level: null,
    schooYearList: [],
    selectedFiter: null,
    family_background: {
      id: null,
      father_fname: null,
      father_mname: null,
      father_lname: null,
      father_number: null,
      mother_fname: null,
      mother_mname: null,
      mother_lname: null,
      mother_number: null,
      guardian_fname: null,
      guardian_mname: null,
      guardian_lname: null,
      guardian_number: null,
    },

    GoodMoral: null,
    loadingState: false,
    levelCheck: null,
    PSA: null,
    SchoolCard: null,
    Picture: null,
    updateData: null,
    isAllowPrint: false,
    trackList: [],
    strandList: [],
    action: "Add",

    fadeAwayMessage: {
      show: false,
      type: "success",
      header: "Successfully Added!",
      message: "",
      top: 10,
    },
    workExpIndexToUpdate: null,
    lndToUpdate: null,
    remarksData: [],
  }),
  mounted() {
    this.levelCheck = localStorage.getItem("level");
    if (this.levelCheck == "Elementary") {
      this.formdata.seniorJunior = "Elementary";
    } else {
      this.formdata.seniorJunior = "Junior High";
    }
    this.initialize();
  },

  computed: {
    computedSameAddress: {
      get: function () {
        return this.formdata.isSameAddress;
      },
      set: function (val) {
        this.formdata.isSameAddress = val ? true : false;

        this.formdata.permanent_zip = val
          ? this.formdata.residential_zip
          : null;
        this.formdata.permanent_house_no = val
          ? this.formdata.residential_house_no
          : null;
        this.formdata.permanent_street = val
          ? this.formdata.residential_street
          : null;
        this.formdata.permanent_subd = val
          ? this.formdata.residential_subd
          : null;
        this.formdata.permanent_brgy = val
          ? this.formdata.residential_brgy
          : null;
        this.formdata.permanent_city = val
          ? this.formdata.residential_city
          : null;
        this.formdata.permanent_prov = val
          ? this.formdata.residential_prov
          : null;
      },
    },

    computedRefences() {
      return this.references.length;
    },

    computedNoSpouse: {
      get: function () {
        return this.family_background.noSpouse;
      },
    },
  },
  methods: {
    convertDate() {
      if (!this.displayDate) return;

      const [month, day, year] = this.displayDate.split("/");

      if (month && day && year) {
        this.formdata.bdate = `${year}-${month.padStart(2, "0")}-${day.padStart(
          2,
          "0",
        )}`;
      }
    },
    copyCode() {
      navigator.clipboard.writeText(this.savedData.CODE);
      alert("saved");
    },
    changeGuardian() {
      console.log("");
      // if (
      //   (this.family_background.father_fname == null ||
      //     this.family_background.father_fname == "") &&
      //   (this.family_background.mother_fname == null ||
      //     this.family_background.mother_fname == "")
      // ) {
      //   this.guardianNeed = true;
      // } else {
      //   this.guardianNeed = false;
      // }
    },
    onlyDigits(event) {
      const char = String.fromCharCode(event.keyCode);
      if (!/[0-9]/.test(char)) {
        event.preventDefault(); //  block letter from appearing
      }
    },
    prependData(val, arr) {
      var dumpArr = arr.slice();
      dumpArr.unshift(val);
      return dumpArr;
    },
    changeTab(i) {
      this.tab = i;
    },
    dispatch() {
      this.empData = [{ id: null }];
    },
    initialize() {
      this.getAllTracks();
      this.getSchoolYear();
    },

    changeTrackData(data) {
      this.axiosCall("/rooms-section/AllStrand/Enroll/" + data, "GET").then(
        (res) => {
          if (res) {
            console.log("All Strand", res.data);
            this.strandList = res.data;
          }
        },
      );
    },

    confirmSave(item) {
      if (item == 1) {
        if (this.grade_level && this.formdata.LRN) {
          this.confirmAction = item == 1 ? "Save" : "Submit";
          this.confirmDialog = true;
        } else {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message!";
          this.fadeAwayMessage.message =
            "Please select a grade level and enter the LRN before saving the draft.!";
        }
      } else {
        if (this.$refs.myEnrollForm.validate()) {
          if (!this.PSA || !this.SchoolCard) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message!";
            this.fadeAwayMessage.message =
              "You are required to submit the School Card, and PSA/Birth Certificate!";
          } else {
            this.confirmAction = item == 1 ? "Save" : "Submit";
            this.confirmDialog = true;
          }
        } else {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message!";
          this.fadeAwayMessage.message =
            "Please fill in the fields marked in red!";
        }
      }
    },

    saveUpdate() {
      this.confirmDialog = false;
      const fd = new FormData();
      let file = new File(["default content"], "default.pdf", {
        type: "application/pdf",
      });

      let goodMoral;
      if (this.GoodMoral == null) {
        goodMoral = file;
      } else {
        goodMoral = this.GoodMoral;
      }

      let birthPSA;
      if (this.PSA == null) {
        birthPSA = file;
      } else {
        birthPSA = this.PSA;
      }

      let schoolCard;
      if (this.SchoolCard == null) {
        schoolCard = file;
      } else {
        schoolCard = this.SchoolCard;
      }

      let picture;
      if (this.Picture == null) {
        picture = file;
      } else {
        picture = this.Picture;
      }

      let arrFile = [goodMoral, birthPSA, schoolCard, picture];

      for (let i = 0; i < arrFile.length; i++) {
        const element = arrFile[i];
        fd.append("file", element);
      }

      let data = {
        fname: this.formdata.fname,
        lname: this.formdata.lname,
        mname: this.formdata.mname,
        suffix: this.formdata.suffix,
        email: this.formdata.email,
        bdate: this.formdata.bdate,
        birth_place: this.formdata.birth_place,
        grade_level: this.grade_level,
        sex: this.formdata.sex,
        civil_status: this.formdata.civil_status,
        seniorJunior: this.formdata.seniorJunior,
        transfered: this.formdata.transfered == "No" ? false : true,
        height: this.formdata.height,
        weight: this.formdata.weight,
        is_IP: this.formdata.is_IP == "No" ? false : true,
        ip_Name: this.formdata.ip_Name,
        fourPs: this.formdata.fourPs == "No" ? false : true,
        fourpis: this.formdata.fourpis,
        disability: this.formdata.disability == "No" ? false : true,
        disability_desc: this.formdata.disability_desc,
        blood_type: this.formdata.blood_type,
        isFilipino: this.formdata.isFilipino == "Yes" ? "Filipino" : null,
        mobile_no: this.formdata.mobile_no,
        residential_zip: this.formdata.residential_zip,
        residential_house_no: this.formdata.residential_house_no,
        residential_street: this.formdata.residential_street,
        residential_subd: this.formdata.residential_subd,
        residential_brgy: this.formdata.residential_brgy,
        residential_city: this.formdata.residential_city,
        residential_prov: this.formdata.residential_prov,
        permanent_zip: this.formdata.permanent_zip,
        permanent_house_no: this.formdata.permanent_house_no,
        permanent_street: this.formdata.permanent_street,
        permanent_subd: this.formdata.permanent_subd,
        permanent_brgy: this.formdata.permanent_brgy,
        permanent_city: this.formdata.permanent_city,
        permanent_prov: this.formdata.permanent_prov,
        isSameAddress: this.formdata.isSameAddress,

        father_fname: this.family_background.father_fname,
        father_mname: this.family_background.father_mname,
        father_lname: this.family_background.father_lname,
        father_number: this.family_background.father_number,
        mother_fname: this.family_background.mother_fname,
        mother_mname: this.family_background.mother_mname,
        mother_lname: this.family_background.mother_lname,
        mother_number: this.family_background.mother_number,
        guardian_fname: this.family_background.guardian_fname,
        guardian_mname: this.family_background.guardian_mname,
        guardian_lname: this.family_background.guardian_lname,
        guardian_number: this.family_background.guardian_number,

        last_grade_completed: this.transfer.last_grade_completed,
        last_year_completed: this.transfer.last_year_completed,
        last_school_attended: this.transfer.last_school_attended,
        last_school_ID: this.transfer.last_school_ID,
        track: this.transfer.track,
        semester: this.transfer.semester,
        strand: this.transfer.strand,
        school_yearId:
          this.action == "Add" ? this.selectedFiter : this.selectedFiter.id,
        LRN: this.formdata.lrn,
        confirmAction: this.confirmAction,
      };
      this.loadingState = true;
      fd.append("body", JSON.stringify(data));
      console.log("FD", fd);
      if (this.action == "Add") {
        this.axiosCall(
          "/enroll-student/enrollStudentWithFile",
          "POST",
          fd,
        ).then((res) => {
          console.log(res.data.savedData);
          if (res.data.status == 201) {
            if (this.confirmAction == "Save") {
              setTimeout(() => {
                this.loadingState = false;
                this.savedData = res.data.savedData;
                this.saveConfirmation = true;
              }, 1500);
            } else {
              setTimeout(() => {
                this.fadeAwayMessage.show = true;
                this.fadeAwayMessage.type = "success";
                this.fadeAwayMessage.header = "System Message Enrollment";
                this.fadeAwayMessage.message = res.data.msg;
                this.initialize();
                this.$router.push("/enroll-success");
              }, 1500);
            }
          } else {
            this.loadingState = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
          }
        });
      } else if (this.action == "Update") {
        // alert(this.updateData.id);
        // console.log(arrFile, this.updateData.schoolCard, this.updateData.birthPSA,this.updateData.goodMoral,this.updateData.picture, );
        let files = [
          {
            fileName: this.updateData.goodMoral,
          },
          { fileName: this.updateData.schoolCard },
          { fileName: this.updateData.picture },
          { fileName: this.updateData.birthPSA },
        ];
        this.axiosCall(
          "/enroll-student/updateStudentWithFile/" + this.updateData.id,
          "PATCH",
          fd,
        ).then((res) => {
          if (res.data.status == 200 || res.data.status == 201) {
            setTimeout(() => {
              this.loadingState = false;
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "success";
              this.fadeAwayMessage.header = "System Message Enrollment";
              this.fadeAwayMessage.message = res.data.msg;
            }, 1500);
            for (let index = 0; index < files.length; index++) {
              this.axiosCall(
                "/enroll-student/deleteApplicantsFile/" + files[index].fileName,
                "DELETE",
              ).then((resp) => {
                if (resp) {
                  setTimeout(() => {
                    this.initialize();
                    this.$router.push("/enroll-success");
                  }, 1500);
                }
              });
            }
          } else {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
          }
        });
      }
    },

    proceedLandingPage() {
      setTimeout(() => {
        this.loadingState = false;
        this.initialize();
        this.$router.push("/landing");
      }, 1500);
    },

    getAllTracks() {
      this.axiosCall("/rooms-section/getAlltracks/Data/tracks", "GET").then(
        (res) => {
          if (res) {
            console.log("Tracks", res.data);
            this.trackList = res.data;
            this.loading = false;
          }
        },
      );
    },
    goLanding() {
      this.$router.push("/landing");
    },

    getSchoolYear() {
      this.axiosCall("/enroll-student/getSchoolYear", "GET").then((res) => {
        if (res) {
          this.schooYearList = res.data;
          const currentDate = new Date();
          // Filter rows where the current date is between start_date and end_date
          const filteredData = res.data.filter((item) => {
            const startDate = new Date(item.startDate);
            const endDate = new Date(item.endDate);
            return currentDate >= startDate && currentDate <= endDate;
          });
          console.log("Filtered", filteredData[0].id);
          this.selectedFiter = filteredData[0];
        }
      });
    },
    searchStudent() {
      this.axiosCall(
        "/enroll-student/getStudentDataByCode/" +
          this.selectedFiter.id +
          "/" +
          this.code +
          "/" +
          this.levelCheck,
        "GET",
      ).then((res) => {
        if (res.data) {
          const data = res.data;
          this.updateData = res.data;
          this.formdata = {
            ...this.formdata,
            ...data,

            lrn: data.LRN,

            fourPs: data.fourPs == 1 ? "Yes" : "No",
            transfered: data.transfered == 1 ? "Yes" : "No",
            is_IP: data.is_IP == 1 ? "Yes" : "No",
            disability: data.disability == 1 ? "Yes" : "No",

            bdate: data.bdate ? data.bdate.substr(0, 10) : null,
          };
          this.family_background = {
            ...this.family_background,
            ...data,
          };

          this.transfer = {
            ...this.transfer,
            ...data,
          };
          this.grade_level = data.grade_level;
          this.action = "Update";
          console.log("Mapped StudentData", this.formdata);
        } else {
          alert(
            "Your code is not correct, or wrong portal this is Enrollment for " +
              this.levelCheck +
              "!",
          );
        }
      });
    },
  },
};
</script>

<style>
.notifBadgeYellow {
  background-color: rgba(255, 255, 34, 0.5);
  /* border: 1px solid rgb(255, 217, 0); */
  padding: 5px 10px 5px 10px;
  border-radius: 6px;
  font-size: 12px;
  color: rgb(140, 140, 14);
  margin: 0 0 0 7px;
  font-weight: 500;
}

.notifBadgeOrange {
  background-color: rgba(255, 122, 34, 0.546);
  /* border: 1px solid rgb(255, 217, 0); */
  padding: 5px 10px 5px 10px;
  border-radius: 6px;
  font-size: 12px;
  color: rgb(147, 65, 1);
  margin: 0 0 0 7px;
  font-weight: 500;
}

.notifBadgePurple {
  background-color: rgba(255, 138, 255, 0.5);
  /* border: 1px solid rgb(255, 217, 0); */
  padding: 5px 10px 5px 10px;
  border-radius: 6px;
  font-size: 12px;
  color: purple;
  margin: 0 0 0 7px;
  font-weight: 500;
}

.notifBadgeBlue {
  background-color: rgba(138, 210, 255, 0.5);
  /* border: 1px solid rgb(255, 217, 0); */
  padding: 5px 10px 5px 10px;
  border-radius: 6px;
  font-size: 12px;
  color: rgb(0, 75, 128);
  margin: 0 0 0 7px;
  font-weight: 500;
}

.notifBadgeGreen {
  background-color: rgba(47, 199, 17, 0.5);
  /* border: 1px solid rgb(255, 217, 0); */
  padding: 5px 10px 5px 10px;
  border-radius: 6px;
  font-size: 12px;
  color: rgb(21, 128, 0);
  margin: 0 0 0 7px;
  font-weight: 500;
}

thead th {
  background-color: #f5b027 !important;
  color: white !important;
}
thead th:first-child {
  border-radius: 5px 0 0 0;
}
thead th:last-child {
  border-radius: 0 5px 0 0;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 6px solid #ccc;
  border-top: 6px solid #1976d2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
</style>
