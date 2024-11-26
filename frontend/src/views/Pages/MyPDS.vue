<template>
  <div class="mx-2">
    <!-- <div
    class="pl-2 pt-2 pr-2 mx-2 fill-height"
    style="background-color: white; overflow-y: hidden; overflow-x: hidden"
  > -->
    <v-card class="">
      <v-form ref="myPdsForm">
        <v-row class="mb-2">
          <v-col cols="12" sm="6" md="6" lg="6" xl="6">
            <!-- <v-toolbar flat class="rounded-xl"> -->
            <!-- <v-toolbar-title
                > -->
            <strong class="text-h6 text-gray-100 font-weight-bold ml-6"
              >{{ $route.meta.title }}
              <span
                :class="
                  formdata.status == 2
                    ? 'notifBadgeGreen'
                    : formdata.status == 3
                    ? 'notifBadgeOrange'
                    : ''
                "
                >{{
                  formdata.status == 2
                    ? "APPROVED"
                    : formdata.status == 3
                    ? "RETURNED"
                    : ""
                }}</span
              >
            </strong>

            <br />
            <p class="text-subtitle-2 ml-6">
              Please put N/A for fields if not applicable.
            </p>
          </v-col>
          <v-col
            cols="12"
            sm="6"
            md="6"
            lg="6"
            xl="6"
            :class="$vuetify.breakpoint.xs ? '' : 'd-flex justify-end  pr-6'"
            class="white--text rounded-lg mt-3"
          >
            <!-- <v-btn
              class="mx-2"
              dense
              v-if="isAllowPrint"
              outlined
              color="#519043"
              @click="print(false)"
            >
              <v-icon left> mdi-printer-outline</v-icon>
              print
            </v-btn>

            <v-btn
              class="mx-2"
              dense
              v-if="isAllowPrint"
              outlined
              color="#519043"
              @click="print(true)"
            >
              <v-icon left> mdi-printer-outline</v-icon>
              print with picture
            </v-btn> -->
            <v-btn
              color="#519043"
              @click="sheet = !sheet"
              dense
              class="mx-2 white--text"
            >
              Actions
            </v-btn>
            <!-- <v-btn
              color="warning"
              outlined
              dense
              class="mx-2"
              @click="viewRemarks = true"
            >
              <v-icon left> mdi-eye</v-icon>
              Remarks
            </v-btn> -->

            <v-dialog v-model="viewRemarks" width="500" scrollable>
              <v-card
                class="mx-auto"
                style="top: 0; position: sticky; z-index: 99"
              >
                <v-card-title class="dialog-header white--text">
                  <span class="text-h6">Remarks</span>
                  <v-spacer></v-spacer>
                  <v-btn icon dark @click="viewRemarks = false">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-card-title>
                <v-card-text
                  class="py-0"
                  style="height: 50vh; overflow-y: auto"
                >
                  <v-timeline dense v-if="remarksData.length > 0">
                    <v-timeline-item
                      v-for="item in remarksData"
                      :key="item.id"
                      color="#519043"
                      icon="mdi-comment-processing-outline"
                      fill-dot
                    >
                      <div style="font-weight: 800" class="me-3">
                        {{
                          $store.getters.getUserData.id ==
                          item.remarks_maker_userID
                            ? "You"
                            : item.remarks_by
                        }}
                      </div>
                      <div class="text-body-2">
                        {{ item.message }}
                      </div>
                      <div style="font-size: 10px">
                        <i>{{ formatDate(item.created_at) }}</i>
                      </div>
                    </v-timeline-item>
                  </v-timeline>
                  <v-timeline dense v-if="remarksData.length == 0">
                    <v-timeline-item
                      color="#519043"
                      icon="mdi-comment-processing-outline"
                      fill-dot
                    >
                      <div class="me-3" style="margin-top: 7px">
                        No remarks found.
                      </div>
                    </v-timeline-item>
                  </v-timeline>
                </v-card-text>
              </v-card>
            </v-dialog>

            <!-- <v-btn
              :class="$vuetify.breakpoint.xs ? 'mt-4' : ''"
              class="white--text rounded-lg mx-2"
              dense
              color="#519043"
              :disabled="!isUpdateAllowed"
              v-if="!isUpdate"
              @click="isUpdate = true"
            >
              <v-icon left> mdi-pencil</v-icon>
              Update
            </v-btn>
            <v-btn
              :class="$vuetify.breakpoint.xs ? 'mt-4' : ''"
              class="white--text rounded-lg mx-2"
              dense
              color="#519043"
              v-if="isUpdate"
              @click="confirmSave()"
            >
              <v-icon left> mdi-check </v-icon>
              Save
            </v-btn>
            <v-btn
              :class="$vuetify.breakpoint.xs ? 'mt-4' : ''"
              class="white--text rounded-lg mx-2"
              dense
              @click="confirmCancel()"
              color="warning"
              v-if="isUpdate"
            >
              <v-icon left> mdi-cancel </v-icon>
              Cancel
            </v-btn> -->
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="px-6 pb-8">
            <v-tabs
              v-model="activeTab"
              :center-active="true"
              show-arrows
              color="#43A047"
              height="40"
              class="mt-n8 rounded-lg"
            >
              <v-tab
                v-for="tab in tabList"
                :key="tab.id"
                @click="changeTab(tab)"
                >{{ tab.name }}</v-tab
              >
            </v-tabs>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="mt-2 px-8" cols="12">
            <div v-if="tab.id == 1">
              <v-row>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.fname"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="First Name"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.mname"
                    dense
                    class="rounded-lg"
                    label="Middle Name"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.lname"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="Last Name"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.suffix"
                    dense
                    class="rounded-lg"
                    label="Suffix"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-menu
                    ref="menu"
                    :close-on-content-click="false"
                    :return-value.sync="formdata.bdate"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :disabled="!isUpdate"
                        dense
                        v-model="formdata.bdate"
                        :rules="[formRules.bdateAgeAllowed, formRules.required]"
                        chips
                        small-chips
                        color="#6DB249"
                        label="Date of Birth"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      color="#6DB249"
                      v-model="formdata.bdate"
                      no-title
                      scrollable
                    >
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        color="#6DB249"
                        @click="$refs.menu.save(formdata.bdate)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.birth_place"
                    dense
                    class="rounded-lg"
                    label="Place of Birth"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-select
                    :disabled="!isUpdate"
                    :items="sexItem"
                    label="Sex"
                    color="#6DB249"
                    dense
                    v-model="formdata.sex"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-select
                    :disabled="!isUpdate"
                    :items="cvl_statusItem"
                    label="Civil Status"
                    color="#6DB249"
                    dense
                    v-model="formdata.civil_status"
                  ></v-select>
                  <v-text-field
                    :disabled="!isUpdate"
                    v-if="formdata.civil_status == 'Others'"
                    v-model="formdata.civil_status1"
                    dense
                    class="rounded-lg"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.height"
                    :rules="[formRules.hgtInMtrFormat]"
                    dense
                    class="rounded-lg"
                    label="Height (m)"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.weight"
                    :rules="[formRules.numberRequired]"
                    dense
                    class="rounded-lg"
                    label="Weight (kg)"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.blood_type"
                    :rules="[]"
                    dense
                    class="rounded-lg"
                    label="Blood Type"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-select
                    :disabled="!isUpdate"
                    :items="dualCtznItem"
                    label="Citizenship (Filipino)"
                    dense
                    color="#6DB249"
                    v-model="formdata.isFilipino"
                  ></v-select>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-select
                    :disabled="!isUpdate"
                    :items="dualCtznItem"
                    label="Is dual citizen"
                    color="#6DB249"
                    dense
                    v-model="formdata.is_dual_citizen"
                  ></v-select>
                  <v-autocomplete
                    :disabled="!isUpdate"
                    v-if="formdata.is_dual_citizen == 'Yes'"
                    v-model="formdata.citizenship_type"
                    :rules="
                      formdata.is_dual_citizen == 'Yes'
                        ? [formRules.required]
                        : []
                    "
                    dense
                    class="rounded-lg"
                    item-text="type"
                    item-value="id"
                    label="Citizenship type"
                    color="#6DB249"
                    :items="ctznTypeList"
                  >
                  </v-autocomplete>

                  <v-autocomplete
                    :disabled="!isUpdate"
                    v-if="formdata.is_dual_citizen == 'Yes'"
                    v-model="formdata.country"
                    :rules="
                      formdata.is_dual_citizen == 'Yes'
                        ? [formRules.required]
                        : []
                    "
                    dense
                    class="rounded-lg"
                    item-text="name"
                    item-value="id"
                    label="Country"
                    color="#6DB249"
                    :items="countryList"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.GSIS"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="GSIS ID Number"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.PAGIBIG"
                    dense
                    class="rounded-lg"
                    label="PAG-IBIG ID number"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.PHILHEALTH"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="PHILHEALTH"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.SSS"
                    dense
                    class="rounded-lg"
                    label="SSS number"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.TIN"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="TIN Number"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.tel_no"
                    dense
                    class="rounded-lg"
                    label="Telephone number"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.mobile_no"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="Mobile number"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.agency_employee_num"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="Agency Employee number"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.email"
                    dense
                    class="rounded-lg"
                    label="Email address"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                  <strong>Residential Address</strong>

                  <v-divider></v-divider>
                </v-col>

                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.residential_house_no"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="House Number"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.residential_street"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="Street"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.residential_subd"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="Subdivision / Village"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.residential_brgy"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="Barangay"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="12" sm="4" md="4" lg="4" xl="4">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.residential_city"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="Municipality / City"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="12" sm="4" md="4" lg="4" xl="4">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.residential_prov"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="Province"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4" lg="4" xl="4">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.residential_zip"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="Zip Code"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                  <strong>Permanent Address</strong>
                  <v-checkbox
                    :disabled="!isUpdate"
                    v-model="computedSameAddress"
                    label="Is Same Address"
                    dense
                  ></v-checkbox>
                </v-col>

                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.permanent_house_no"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="House Number"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.permanent_street"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="Street"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.permanent_subd"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="Subdivision / Village"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.permanent_brgy"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="Barangay"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="12" sm="4" md="4" lg="4" xl="4">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.permanent_city"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="Municipality / City"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="12" sm="4" md="4" lg="4" xl="4">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.permanent_prov"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="Province"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="12" sm="4" md="4" lg="4" xl="4">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="formdata.permanent_zip"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="Zip Code"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
            </div>
            <div v-if="tab.id == 2">
              <v-row>
                <v-col cols="12"
                  ><strong>Father</strong><v-divider></v-divider
                ></v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="family_background.father_fname"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="First Name"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="family_background.father_mname"
                    dense
                    class="rounded-lg"
                    label="Middle Name"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="family_background.father_lname"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="Last Name"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="family_background.father_suffix"
                    dense
                    class="rounded-lg"
                    label="Suffix"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12"
                  ><strong>Mother's Maiden Name</strong><v-divider></v-divider
                ></v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="family_background.mother_fname"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="First Name"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="family_background.mother_mname"
                    dense
                    class="rounded-lg"
                    label="Middle Name"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="family_background.mother_lname"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="Last Name"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12"
                  ><strong>Spouse</strong>
                  <v-checkbox
                    :disabled="!isUpdate"
                    v-model="computedNoSpouse"
                    label="No Spouse"
                    dense
                  ></v-checkbox
                  ><v-divider></v-divider
                ></v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="family_background.spouse_fname"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="First Name"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="family_background.spouse_mname"
                    dense
                    class="rounded-lg"
                    label="Middle Name"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="family_background.spouse_lname"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="Last Name"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="family_background.spouse_suffix"
                    dense
                    class="rounded-lg"
                    label="Suffix"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="family_background.occupation"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="Occupation"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="family_background.employer_name"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="Employer / Business Name"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="family_background.employer_address"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="Business Address"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="family_background.tel_no"
                    dense
                    class="rounded-lg"
                    label="Telephone Number"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12"
                  ><strong>Children</strong><v-divider></v-divider
                ></v-col>
                <v-col cols="12" class="d-flex justify-end">
                  <v-btn
                    depressed
                    elevation="4"
                    color="#519043"
                    class="white--text"
                    v-if="isUpdate && isUpdateAllowed"
                    @click="addChild()"
                  >
                    <v-icon>mdi-plus</v-icon>
                    Add Children
                  </v-btn>
                </v-col>
                <v-col cols="12" class="mb-6 samp">
                  <v-data-table
                    class="elevation-4 pb-4"
                    :headers="childTableHeaders"
                    :items="children"
                    :fixed-header="true"
                    :items-per-page="-1"
                  >
                    <template v-slot:[`item.bdate`]="{ item }">
                      {{ formatDate(item.bdate) }}
                    </template>

                    <template v-slot:[`item.action`]="{ item, index }">
                      <div class="d-flex justify-center">
                        <v-btn
                          x-small
                          color="grey"
                          outlined
                          class="mx-1"
                          v-if="isUpdate"
                          @click="editChild(item)"
                        >
                          edit
                        </v-btn>
                        <v-btn
                          x-small
                          color="red"
                          outlined
                          class="mx-1"
                          v-if="isUpdate"
                          @click="deleteChild(item, index)"
                        >
                          Remove
                        </v-btn>
                      </div>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </div>
            <div v-if="tab.id == 3">
              <v-row>
                <v-col cols="12" class="d-flex justify-end">
                  <v-btn
                    v-if="isUpdate && isUpdateAllowed"
                    depressed
                    elevation="4"
                    color="#519043"
                    class="white--text"
                    @click="addEducBg()"
                  >
                    <v-icon>mdi-plus</v-icon>
                    Add
                  </v-btn>
                </v-col>
                <v-col class="mb-6">
                  <v-data-table
                    class="elevation-4 pb-4"
                    :headers="educTableHeaders"
                    :items-per-page="-1"
                    :items="educ_background"
                  >
                    <template v-slot:[`item.level`]="{ item }">
                      {{
                        item.level == "Vocational"
                          ? item.level.toUpperCase() + "/TRADE COURSE"
                          : item.level.toUpperCase()
                      }}
                    </template>
                    <template v-slot:[`item.educ_to`]="{ item }">
                      {{ item.educ_to == null ? "Present" : item.educ_to }}
                    </template>
                    <template v-slot:[`item.action`]="{ item, index }">
                      <div class="d-flex">
                        <v-btn
                          x-small
                          color="grey"
                          outlined
                          class="mx-1"
                          v-if="isUpdate"
                          @click="editEduc(item)"
                        >
                          edit
                        </v-btn>
                        <v-btn
                          x-small
                          color="red"
                          outlined
                          class="mx-1"
                          v-if="isUpdate"
                          @click="deleteEduc(item, index)"
                        >
                          Remove
                        </v-btn>
                      </div>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </div>

            <div v-if="tab.id == 4">
              <v-row cols="12">
                <v-col cols="12" class="d-flex justify-end">
                  <v-btn
                    depressed
                    elevation="4"
                    v-if="isUpdate && isUpdateAllowed"
                    color="#519043"
                    class="white--text"
                    @click="addCSElig()"
                  >
                    <v-icon>mdi-plus</v-icon>
                    Add
                  </v-btn>
                </v-col>
                <v-col class="mb-6">
                  <v-data-table
                    class="elevation-4 pb-4"
                    :headers="csEligTableHeaders"
                    :items="cs_eligibility"
                    :items-per-page="-1"
                  >
                    <template v-slot:[`item.validity`]="{ item }">
                      {{
                        item.validity == "N/A"
                          ? "N/A"
                          : formatDate(item.validity)
                      }}
                    </template>

                    <template v-slot:[`item.conferment_date`]="{ item }">
                      {{
                        item.conferment_date_to == null
                          ? formatDate(item.conferment_date)
                          : formatDate(item.conferment_date) +
                            " to " +
                            formatDate(item.conferment_date_to)
                      }}
                    </template>
                    <template v-slot:[`item.action`]="{ item, index }">
                      <div class="d-flex">
                        <v-btn
                          v-if="isUpdate"
                          x-small
                          outlined
                          color="grey"
                          class="mr-2"
                          @click="editCSElig(item)"
                        >
                          edit
                        </v-btn>
                        <v-btn
                          x-small
                          color="red"
                          outlined
                          class="mx-1"
                          v-if="isUpdate"
                          @click="deleteCS(item, index)"
                        >
                          Remove
                        </v-btn>
                      </div>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </div>
            <div v-if="tab.id == 5">
              <v-row cols="12">
                <v-col cols="12" class="d-flex justify-end">
                  <v-btn
                    depressed
                    elevation="4"
                    color="#519043"
                    class="white--text"
                    v-if="isUpdate && isUpdateAllowed"
                    @click="addWorkExp()"
                  >
                    <v-icon>mdi-plus</v-icon>
                    Add
                  </v-btn>
                </v-col>
                <v-col class="mb-6">
                  <v-data-table
                    class="elevation-4 pb-4"
                    :headers="workExpTableHeaders"
                    :items-per-page="-1"
                    :items="work_exp"
                  >
                    <template v-slot:[`item.date_from`]="{ item }">
                      {{ formatDate(item.date_from) }} -
                      {{
                        item.is_present_date_to == true
                          ? "Present"
                          : formatDate(item.date_to)
                      }}
                    </template>
                    <template v-slot:[`item.company`]="{ item }">
                      {{ item.company }}
                    </template>
                    <template v-slot:[`item.month_salary`]="{ item }">
                      {{
                        item.appointment_status == "Permanent" ||
                        item.appointment_status == "Temporary" ||
                        item.appointment_status == "Coterminous" ||
                        item.appointment_status == "Contract of Service" ||
                        item.appointment_status == "Contractual"
                          ? numberFormatter(item.month_salary)
                          : item.rate_per_day + " / day"
                      }}
                    </template>
                    <template v-slot:[`item.salary_grade`]="{ item }">
                      {{
                        item.salary_grade && item.salary_grade_step
                          ? item.salary_grade + "-" + item.salary_grade_step
                          : ""
                      }}
                    </template>
                    <template v-slot:[`item.action`]="{ item, index }">
                      <div class="d-flex">
                        <v-btn
                          v-if="isUpdate"
                          x-small
                          outlined
                          color="grey"
                          class="mr-2"
                          @click="editWorkExp(item, index)"
                        >
                          edit
                        </v-btn>
                        <v-btn
                          x-small
                          color="red"
                          outlined
                          class="mx-1"
                          v-if="isUpdate"
                          @click="deleteWorkExp(item, index)"
                        >
                          Remove
                        </v-btn>
                      </div>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </div>
            <div v-if="tab.id == 6">
              <v-row cols="12">
                <v-col cols="12" class="d-flex justify-end">
                  <v-btn
                    depressed
                    elevation="4"
                    color="#519043"
                    class="white--text"
                    v-if="isUpdate && isUpdateAllowed"
                    @click="addVolWork()"
                  >
                    <v-icon>mdi-plus</v-icon>
                    Add
                  </v-btn>
                </v-col>
                <v-col class="mb-6">
                  <v-data-table
                    class="elevation-4 pb-4"
                    :headers="volWorkTableHeaders"
                    :items-per-page="-1"
                    :items="voluntary_work"
                  >
                    <template v-slot:[`item.date_from`]="{ item }">
                      {{ formatDate(item.date_from) }}
                    </template>
                    <template v-slot:[`item.date_to`]="{ item }">
                      {{ formatDate(item.date_to) }}
                    </template>
                    <template v-slot:[`item.action`]="{ item, index }">
                      <div class="d-flex">
                        <v-btn
                          v-if="isUpdate"
                          x-small
                          outlined
                          color="grey"
                          class="mr-2"
                          @click="editVolWork(item)"
                        >
                          edit
                        </v-btn>
                        <v-btn
                          x-small
                          color="red"
                          outlined
                          class="mx-1"
                          v-if="isUpdate"
                          @click="deleteVolWork(item, index)"
                        >
                          Remove
                        </v-btn>
                      </div>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </div>
            <div v-if="tab.id == 7">
              <v-row cols="12">
                <v-col cols="12" class="d-flex justify-end">
                  <v-btn
                    depressed
                    elevation="4"
                    color="#519043"
                    class="white--text"
                    v-if="isUpdate && isUpdateAllowed"
                    @click="addLND()"
                  >
                    <v-icon>mdi-plus</v-icon>
                    Add
                  </v-btn>
                </v-col>
                <v-col class="mb-6">
                  <v-data-table
                    class="elevation-4 pb-4"
                    :items-per-page="-1"
                    :headers="lndTableHeaders"
                    :items="learning_and_development"
                  >
                    <template v-slot:[`item.date_from`]="{ item }">
                      <!-- <div v-for="(data, i) in item.inclusiveDate" :key="i"> -->
                      {{ formatDate(item.date_from) }}
                      <!-- </div> -->
                    </template>
                    <template v-slot:[`item.date_to`]="{ item }">
                      <!-- <div v-for="(data, i) in item.inclusiveDate" :key="i"> -->
                      {{ formatDate(item.date_to) }}
                      <!-- </div> -->
                    </template>
                    <template v-slot:[`item.action`]="{ item, index }">
                      <div class="d-flex">
                        <v-btn
                          v-if="isUpdate"
                          x-small
                          outlined
                          color="grey"
                          class="mr-2"
                          @click="editLND(item, index)"
                        >
                          edit
                        </v-btn>
                        <v-btn
                          x-small
                          color="red"
                          outlined
                          class="mx-1"
                          v-if="isUpdate"
                          @click="deleteLND(item, index)"
                        >
                          Remove
                        </v-btn>
                      </div>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </div>
            <div v-if="tab.id == 8">
              <v-row cols="12">
                <!-- <v-col cols="12" class="d-flex justify-end">
                  <v-btn
                    depressed
                    elevation="4"
                    color="#519043"
                    class="white--text"
                    v-if="isUpdate && isUpdateAllowed"
                    @click="addOtherInfo()"
                  >
                    <v-icon>mdi-plus</v-icon>
                    Add
                  </v-btn>
                </v-col> -->
                <v-col class="mb-6" cols="12" sm="4" md="4" lg="4" xl="4">
                  <div class="d-flex justify-end mb-5">
                    <v-btn
                      depressed
                      elevation="4"
                      color="#519043"
                      class="white--text"
                      v-if="isUpdate && isUpdateAllowed"
                      @click="addOtherInfoSkill()"
                    >
                      <v-icon>mdi-plus</v-icon>
                      Add
                    </v-btn>
                  </div>
                  <v-data-table
                    class="elevation-4 pb-4"
                    :headers="otherInfoSpecialSkillsTableHeaders"
                    :items-per-page="-1"
                    :items="other_infosSpecialSkills"
                  >
                    <template v-slot:[`item.action`]="{ item, index }">
                      <div class="d-flex">
                        <v-btn
                          v-if="isUpdate"
                          x-small
                          outlined
                          color="grey"
                          class="mr-2"
                          @click="editOtherInfoSpecialSkill(item)"
                        >
                          edit
                        </v-btn>
                        <v-btn
                          x-small
                          color="red"
                          outlined
                          class="mx-1"
                          v-if="isUpdate"
                          @click="deleteInfoSpecialSkill(item, index)"
                        >
                          Remove
                        </v-btn>
                      </div>
                    </template>
                  </v-data-table>
                </v-col>
                <v-col class="mb-6" cols="12" sm="4" md="4" lg="4" xl="4">
                  <div class="d-flex justify-end mb-5">
                    <v-btn
                      depressed
                      elevation="4"
                      color="#519043"
                      class="white--text"
                      v-if="isUpdate && isUpdateAllowed"
                      @click="addOtherInfoNonAcad()"
                    >
                      <v-icon>mdi-plus</v-icon>
                      Add
                    </v-btn>
                  </div>
                  <v-data-table
                    class="elevation-4 pb-4"
                    :headers="otherInfoNonAcadTableHeaders"
                    :items-per-page="-1"
                    :items="other_infosNonAcad"
                  >
                    <template v-slot:[`item.action`]="{ item, index }">
                      <div class="d-flex">
                        <v-btn
                          v-if="isUpdate"
                          x-small
                          outlined
                          color="grey"
                          class="mr-2"
                          @click="editOtherInfoNonAcad(item)"
                        >
                          edit
                        </v-btn>
                        <v-btn
                          x-small
                          color="red"
                          outlined
                          class="mx-1"
                          v-if="isUpdate"
                          @click="deleteInfoNonAcad(item, index)"
                        >
                          Remove
                        </v-btn>
                      </div>
                    </template>
                  </v-data-table>
                </v-col>
                <v-col class="mb-6" cols="12" sm="4" md="4" lg="4" xl="4">
                  <div class="d-flex justify-end mb-5">
                    <v-btn
                      depressed
                      elevation="4"
                      color="#519043"
                      class="white--text"
                      v-if="isUpdate && isUpdateAllowed"
                      @click="addOtherInfoAssocMembership()"
                    >
                      <v-icon>mdi-plus</v-icon>
                      Add
                    </v-btn>
                  </div>
                  <v-data-table
                    class="elevation-4 pb-4"
                    :headers="otherInfoAssocMembershipTableHeaders"
                    :items-per-page="-1"
                    :items="other_infosAssocMembership"
                  >
                    <template v-slot:[`item.action`]="{ item, index }">
                      <div class="d-flex">
                        <v-btn
                          v-if="isUpdate"
                          x-small
                          outlined
                          color="grey"
                          class="mr-2"
                          @click="editOtherInfoAssocMembership(item)"
                        >
                          edit
                        </v-btn>
                        <v-btn
                          x-small
                          color="red"
                          outlined
                          class="mx-1"
                          v-if="isUpdate"
                          @click="deleteInfoAssocMember(item, index)"
                        >
                          Remove
                        </v-btn>
                      </div>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </div>
            <div v-if="tab.id == 9">
              <v-row>
                <!-- 1st question -->
                <v-col cols="12">
                  <strong>
                    Are you related by consanguinity or affinity to te
                    appointing or recommending authority, or to the chief of
                    bureau or office or to the person who has immediate
                    supervision oer you in the Office, Bureau or Department
                    where you will be appointed,
                  </strong>
                </v-col>
                <v-col cols="8">
                  <strong>within the third grade?</strong>
                </v-col>
                <v-col cols="4">
                  <v-select
                    :disabled="!isUpdate"
                    dense
                    color="#6DB249"
                    class="rounded-lg"
                    :items="pqChoices"
                    v-model="personal_question_answer._1a.answer"
                  >
                  </v-select>
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="personal_question_answer._1a.details"
                    :rules="
                      personal_question_answer._1a.answer == 'Yes'
                        ? [formRules.required]
                        : []
                    "
                    dense
                    class="rounded-lg"
                    label="If Yes, give details"
                    color="#6DB249"
                    v-if="personal_question_answer._1a.answer == 'Yes'"
                  ></v-text-field>
                </v-col>

                <v-col cols="8">
                  <strong
                    >within the fourth degree (for Local Governament Unit -
                    Career Employees)?</strong
                  >
                </v-col>
                <v-col cols="4">
                  <v-select
                    :disabled="!isUpdate"
                    dense
                    color="#6DB249"
                    class="rounded-lg"
                    :items="pqChoices"
                    v-model="personal_question_answer._1b.answer"
                  >
                  </v-select>
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="personal_question_answer._1b.details"
                    :rules="
                      personal_question_answer._1b.answer == 'Yes'
                        ? [formRules.required]
                        : []
                    "
                    dense
                    class="rounded-lg"
                    label="If Yes, give details"
                    color="#6DB249"
                    v-if="personal_question_answer._1b.answer == 'Yes'"
                  ></v-text-field>
                </v-col>
                <!-- end of 1st question -->
                <!-- 2nd question -->
                <v-col cols="12">
                  <v-divider class="mb-5"></v-divider>
                </v-col>

                <v-col cols="8">
                  <strong
                    >Have you ever found guilty of any administrative
                    offense?</strong
                  >
                </v-col>
                <v-col cols="4">
                  <v-select
                    :disabled="!isUpdate"
                    dense
                    color="#6DB249"
                    class="rounded-lg"
                    :items="pqChoices"
                    v-model="personal_question_answer._2a.answer"
                  >
                  </v-select>
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="personal_question_answer._2a.details"
                    :rules="
                      personal_question_answer._1a.answer == 'Yes'
                        ? [formRules.required]
                        : []
                    "
                    dense
                    class="rounded-lg"
                    label="If Yes, give details"
                    color="#6DB249"
                    v-if="personal_question_answer._2a.answer == 'Yes'"
                  ></v-text-field>
                </v-col>

                <v-col cols="8">
                  <strong
                    >Have you been criminally charged before any court?</strong
                  >
                </v-col>
                <v-col cols="4">
                  <v-select
                    :disabled="!isUpdate"
                    dense
                    color="#6DB249"
                    class="rounded-lg"
                    :items="pqChoices"
                    v-model="personal_question_answer._2b.answer"
                  >
                  </v-select>
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="personal_question_answer._2b.details"
                    dense
                    class="rounded-lg"
                    label="If Yes, give details"
                    color="#6DB249"
                    v-if="personal_question_answer._2b.answer == 'Yes'"
                  ></v-text-field>

                  <v-menu
                    :disabled="!isUpdate"
                    v-if="personal_question_answer._2b.answer == 'Yes'"
                    ref="caseDateFiled"
                    :close-on-content-click="false"
                    :return-value.sync="formdata.bdate"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        color="#6DB249"
                        :disabled="!isUpdate"
                        dense
                        v-model="personal_question_answer._2b.date_filed"
                        :rules="
                          personal_question_answer._2b.answer == 'Yes'
                            ? [formRules.required]
                            : []
                        "
                        chips
                        small-chips
                        label="Date Filed"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      color="#6DB249"
                      :disabled="!isUpdate"
                      v-model="personal_question_answer._2b.date_filed"
                      no-title
                      scrollable
                    >
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        color="#6DB249"
                        @click="
                          $refs.caseDateFiled.save(
                            personal_question_answer._2b.date_filed
                          )
                        "
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>

                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="personal_question_answer._2b.case_status"
                    dense
                    class="rounded-lg"
                    label="Status of Case"
                    color="#6DB249"
                    v-if="personal_question_answer._2b.answer == 'Yes'"
                  ></v-text-field>
                </v-col>
                <!-- end of 2nd question -->
                <!-- 3rd question -->
                <v-col cols="12">
                  <v-divider></v-divider>
                </v-col>

                <v-col cols="8">
                  <strong
                    >Have you ever been convicted of any crime or violation of
                    any law, decree, ordinance or regulation by any court or
                    tribunal?</strong
                  >
                </v-col>
                <v-col cols="4">
                  <v-select
                    :disabled="!isUpdate"
                    dense
                    color="#6DB249"
                    class="rounded-lg"
                    :items="pqChoices"
                    v-model="personal_question_answer._3a.answer"
                  >
                  </v-select>
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="personal_question_answer._3a.details"
                    :rules="
                      personal_question_answer._3a.answer == 'Yes'
                        ? [formRules.required]
                        : []
                    "
                    dense
                    class="rounded-lg"
                    label="If Yes, give details"
                    color="#6DB249"
                    v-if="personal_question_answer._3a.answer == 'Yes'"
                  ></v-text-field>
                </v-col>
                <!-- end of 3rd question -->
                <!-- 4th question -->
                <v-col cols="12">
                  <v-divider></v-divider>
                </v-col>

                <v-col cols="8">
                  <strong
                    >Have you ever been separated from the service in any of the
                    following modes: resignation, retirement, dropped from the
                    rolls, dismissal, termination, end of term, finished
                    contract or phased out (abolition) in public or private
                    sector?</strong
                  >
                </v-col>
                <v-col cols="4">
                  <v-select
                    :disabled="!isUpdate"
                    dense
                    color="#6DB249"
                    class="rounded-lg"
                    :items="pqChoices"
                    v-model="personal_question_answer._4a.answer"
                  >
                  </v-select>
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="personal_question_answer._4a.details"
                    :rules="
                      personal_question_answer._4a.answer == 'Yes'
                        ? [formRules.required]
                        : []
                    "
                    dense
                    class="rounded-lg"
                    label="If Yes, give details"
                    color="#6DB249"
                    v-if="personal_question_answer._4a.answer == 'Yes'"
                  ></v-text-field>
                </v-col>
                <!-- end of 4th question -->
                <!-- 5th question -->
                <v-col cols="12">
                  <v-divider></v-divider>
                </v-col>

                <v-col cols="8">
                  <strong
                    >Have you ever been a candidate in a national or local
                    election held within the last year (except Barangay
                    election)?</strong
                  >
                </v-col>
                <v-col cols="4">
                  <v-select
                    :disabled="!isUpdate"
                    dense
                    color="#6DB249"
                    class="rounded-lg"
                    :items="pqChoices"
                    v-model="personal_question_answer._5a.answer"
                  >
                  </v-select>
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="personal_question_answer._5a.details"
                    :rules="
                      personal_question_answer._5a.answer == 'Yes'
                        ? [formRules.required]
                        : []
                    "
                    dense
                    class="rounded-lg"
                    label="If Yes, give details"
                    color="#6DB249"
                    v-if="personal_question_answer._5a.answer == 'Yes'"
                  ></v-text-field>
                </v-col>

                <v-col cols="8">
                  <strong
                    >Have you resigned from the government service during the
                    three (3)-month period before the last election to
                    promote/actively campaign for a national or local
                    candidate?</strong
                  >
                </v-col>
                <v-col cols="4">
                  <v-select
                    :disabled="!isUpdate"
                    dense
                    color="#6DB249"
                    class="rounded-lg"
                    :items="pqChoices"
                    v-model="personal_question_answer._5b.answer"
                  >
                  </v-select>
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="personal_question_answer._5b.details"
                    :rules="
                      personal_question_answer._5b.answer == 'Yes'
                        ? [formRules.required]
                        : []
                    "
                    dense
                    class="rounded-lg"
                    label="If Yes, give details"
                    color="#6DB249"
                    v-if="personal_question_answer._5b.answer == 'Yes'"
                  ></v-text-field>
                </v-col>
                <!-- end of 5th question -->
                <!-- 6th question -->
                <v-col cols="12">
                  <v-divider></v-divider>
                </v-col>

                <v-col cols="8">
                  <strong
                    >Have you ever acquired the status of an immigrant or
                    permanent resident of another country?</strong
                  >
                </v-col>
                <v-col cols="4">
                  <v-select
                    :disabled="!isUpdate"
                    dense
                    color="#6DB249"
                    class="rounded-lg"
                    :items="pqChoices"
                    v-model="personal_question_answer._6a.answer"
                  >
                  </v-select>
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="personal_question_answer._6a.details"
                    :rules="
                      personal_question_answer._6a.answer == 'Yes'
                        ? [formRules.required]
                        : []
                    "
                    dense
                    class="rounded-lg"
                    label="If Yes, give details"
                    color="#6DB249"
                    v-if="personal_question_answer._6a.answer == 'Yes'"
                  ></v-text-field>
                </v-col>
                <!-- end of 6th question -->
                <!-- 7th question -->
                <v-col cols="12">
                  <v-divider class="mb-5"></v-divider>
                  <strong>
                    Pursuant to: (a) Indigenous People's Act(RA 8371); (b) Magna
                    Carta for Disabled Persons (RA 7277); (c) Solo Parents
                    Welfare Act of 2000 (RA 8971), please answer the following
                    items:
                  </strong>
                </v-col>

                <v-col cols="8">
                  <strong>Are you a member of any indigenous group?</strong>
                </v-col>
                <v-col cols="4">
                  <v-select
                    :disabled="!isUpdate"
                    dense
                    color="#6DB249"
                    class="rounded-lg"
                    :items="pqChoices"
                    v-model="personal_question_answer._7a.answer"
                  >
                  </v-select>
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="personal_question_answer._7a.details"
                    :rules="
                      personal_question_answer._7a.answer == 'Yes'
                        ? [formRules.required]
                        : []
                    "
                    dense
                    class="rounded-lg"
                    label="If Yes, please specify"
                    color="#6DB249"
                    v-if="personal_question_answer._7a.answer == 'Yes'"
                  ></v-text-field>
                </v-col>

                <v-col cols="8">
                  <strong>Are you a person with disabilty?</strong>
                </v-col>
                <v-col cols="4">
                  <v-select
                    :disabled="!isUpdate"
                    dense
                    color="#6DB249"
                    class="rounded-lg"
                    :items="pqChoices"
                    v-model="personal_question_answer._7b.answer"
                  >
                  </v-select>
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="personal_question_answer._7b.details"
                    :rules="
                      personal_question_answer._7b.answer == 'Yes'
                        ? [formRules.required]
                        : []
                    "
                    dense
                    class="rounded-lg"
                    label="If Yes, please specify ID No."
                    color="#6DB249"
                    v-if="personal_question_answer._7b.answer == 'Yes'"
                  ></v-text-field>
                </v-col>

                <v-col cols="8">
                  <strong>Are you a solo parent?</strong>
                </v-col>
                <v-col cols="4">
                  <v-select
                    :disabled="!isUpdate"
                    dense
                    color="#6DB249"
                    class="rounded-lg"
                    :items="pqChoices"
                    v-model="personal_question_answer._7c.answer"
                  >
                  </v-select>
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="personal_question_answer._7c.details"
                    :rules="
                      personal_question_answer._7c.answer == 'Yes'
                        ? [formRules.required]
                        : []
                    "
                    dense
                    class="rounded-lg"
                    label="If Yes, please specify ID No."
                    color="#6DB249"
                    v-if="personal_question_answer._7c.answer == 'Yes'"
                  ></v-text-field>
                </v-col>
                <!-- end of 7th question -->
              </v-row>
            </div>
            <div v-if="tab.id == 10">
              <v-row cols="12">
                <v-col cols="12" class="d-flex justify-end">
                  <v-btn
                    depressed
                    elevation="4"
                    color="#519043"
                    class="white--text"
                    v-if="isUpdate && isUpdateAllowed"
                    :disabled="computedRefences == 3"
                    @click="addReferences()"
                  >
                    <v-icon>mdi-plus</v-icon>
                    Add
                  </v-btn>
                </v-col>
                <v-col class="mb-6">
                  <v-data-table
                    class="elevation-4 pb-4"
                    :headers="referencesTableHeaders"
                    :items-per-page="-1"
                    :items="references"
                  >
                    <template v-slot:[`item.action`]="{ item, index }">
                      <div class="d-flex">
                        <v-btn
                          v-if="isUpdate"
                          x-small
                          outlined
                          color="grey"
                          class="mr-2"
                          @click="editReferences(item)"
                        >
                          edit
                        </v-btn>
                        <v-btn
                          x-small
                          color="red"
                          outlined
                          class="mx-1"
                          v-if="isUpdate"
                          @click="deleteReference(item, index)"
                        >
                          Remove
                        </v-btn>
                      </div>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </div>
            <div v-if="tab.id == 11">
              <v-row>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="gov_issued_id.gov_id"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="Government Issued ID"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    :disabled="!isUpdate"
                    v-model="gov_issued_id.gov_id_no"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="ID/License/Passport Number"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-menu
                    v-if="!no_gov_date_issued_id"
                    ref="dmenu"
                    :close-on-content-click="false"
                    :return-value.sync="gov_issued_id.date_issued"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :disabled="!isUpdate"
                        dense
                        v-model="gov_issued_id.date_issued"
                        :rules="
                          no_gov_date_issued_id ? [] : [formRules.required]
                        "
                        chips
                        small-chips
                        color="#6DB249"
                        label="Date of Issuance"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="gov_issued_id.date_issued"
                      no-title
                      color="#6DB249"
                      scrollable
                    >
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        color="#6DB249"
                        @click="$refs.dmenu.save(gov_issued_id.date_issued)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                  <v-checkbox
                    v-model="no_gov_date_issued_id"
                    :disabled="!isUpdate"
                    :checked="no_gov_date_issued_id == true ? true : false"
                    label="No Date of Issuance on ID?"
                  ></v-checkbox>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                  <v-text-field
                    v-if="!no_gov_place_issued_id"
                    :disabled="!isUpdate"
                    v-model="gov_issued_id.place_issued"
                    :rules="no_gov_place_issued_id ? [] : [formRules.required]"
                    dense
                    class="rounded-lg"
                    label="Place of Issuance"
                    color="#6DB249"
                  >
                  </v-text-field>
                  <v-checkbox
                    v-model="no_gov_place_issued_id"
                    :disabled="!isUpdate"
                    :checked="no_gov_place_issued_id == true ? true : false"
                    label="No Place of Issuance on ID?"
                  ></v-checkbox>
                </v-col>
              </v-row>
            </div>
          </v-col>
        </v-row>
      </v-form>
    </v-card>

    <!-- bottom sheet -->
    <v-bottom-sheet v-model="sheet">
      <v-card class="text-center" height="100">
        <v-card-text class="pa-6">
          <!-- <v-btn variant="text" @click="sheet = !sheet">
            close
          </v-btn> -->

          <div class="d-flex justify-space-between">
            <div>
              <v-btn
                color="#519043"
                outlined
                dense
                class="mx-2"
                @click="viewRemarks = true"
              >
                <v-icon left> mdi-eye</v-icon>
                Remarks
              </v-btn>
            </div>
            <div>
              <v-btn
                class="mx-2"
                dense
                v-if="isAllowPrint"
                outlined
                color="#519043"
                @click="print(false)"
              >
                <v-icon left> mdi-printer-outline</v-icon>
                print
              </v-btn>

              <v-btn
                class="mx-2"
                dense
                v-if="isAllowPrint"
                outlined
                color="#519043"
                @click="print(true)"
              >
                <v-icon left> mdi-printer-outline</v-icon>
                print with picture
              </v-btn>
            </div>

            <div>
              <v-btn
                :class="$vuetify.breakpoint.xs ? 'mt-4' : ''"
                class="white--text rounded-lg mx-2"
                dense
                color="#519043"
                :disabled="!isUpdateAllowed || status != 0"
                v-if="!isUpdate"
                @click="submitDialog = true"
              >
                <v-icon left> mdi-upload-outline</v-icon>
                {{ status != 0 ? "Submitted" : "Submit" }}
              </v-btn>
              <v-btn
                :class="$vuetify.breakpoint.xs ? 'mt-4' : ''"
                class="white--text rounded-lg mx-2"
                dense
                color="#519043"
                :disabled="!isUpdateAllowed || (status != 0 && status != 3)"
                v-if="!isUpdate"
                @click="
                  isUpdate = true;
                  sheet = !sheet;
                "
              >
                <v-icon left> mdi-pencil</v-icon>
                Update
              </v-btn>
              <v-btn
                :class="$vuetify.breakpoint.xs ? 'mt-4' : ''"
                class="white--text rounded-lg mx-2"
                dense
                color="#519043"
                v-if="isUpdate"
                @click="confirmSave()"
              >
                <v-icon left> mdi-check </v-icon>
                Save
              </v-btn>
              <v-btn
                :class="$vuetify.breakpoint.xs ? 'mt-4' : ''"
                class="white--text rounded-lg mx-2"
                dense
                @click="confirmCancel()"
                color="red"
                v-if="isUpdate"
              >
                <v-icon left> mdi-cancel </v-icon>
                Cancel
              </v-btn>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
    <!-- bttom sheet -->

    <!-- saving confirmation -->
    <v-dialog v-model="confirmDialog" persistent max-width="390">
      <v-card color="white">
        <div class="pa-4 #3a3b3a--text">
          <div class="text-overline mb-1">WARNING!</div>
          <div class="text-body-1 mb-1" v-if="confirmAction == 'SAVE'">
            <p style="text-align: justify">
              <v-icon class="mt-n2" color="white">mdi-alert</v-icon> &nbsp; Are
              you sure you wish to save your changes?
            </p>
          </div>
          <div class="text-body-1 mb-1" v-if="confirmAction == 'CANCEL'">
            <p style="text-align: justify">
              <v-icon class="mt-n2" color="white">mdi-alert</v-icon> &nbsp; Are
              you sure you want to discard your changes without saving?
            </p>

            <p>
              <v-icon class="mt-n2" color="white">mdi-alert</v-icon> &nbsp;Any
              unsaved changes will be lost if you click <b>YES</b>.
            </p>
          </div>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="confirmDialog = false">
            Close
          </v-btn>
          <v-btn
            v-if="confirmAction == 'SAVE'"
            color="green"
            class="white--text"
            @click="saveUpdate()"
          >
            Confirm
          </v-btn>
          <v-btn
            v-if="confirmAction == 'CANCEL'"
            color="green"
            class="white--text"
            @click="cancelSaving()"
          >
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- saving confirmation -->
    <v-dialog v-model="deleteConfirmDialog" persistent max-width="300">
      <v-card>
        <v-card-title class="text-h6 red white--text">
          Warning!
        </v-card-title>
        <div class="pa-4 #3a3b3a--text">
          <div class="text-body-1 mb-1">
            <p style="text-align: justify">
              <v-icon class="mt-n2" color="white">mdi-alert</v-icon> &nbsp; Are
              you sure you want to <b>REMOVE</b> this data?
            </p>
          </div>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="deleteConfirmDialog = false">
            Close
          </v-btn>
          <v-btn color="green" class="white--text" @click="proceedRemove()">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- submit dialog -->
    <v-dialog v-model="submitDialog" persistent max-width="300">
      <v-card>
        <v-card-title class="text-h6 green white--text">
          Warning!
        </v-card-title>
        <div class="pa-4 #3a3b3a--text">
          <div class="text-body-1 mb-1">
            <p style="text-align: justify">
              <v-icon class="mt-n2" color="white">mdi-alert</v-icon> &nbsp; Are
              you sure you want to <b>SUBMIT FOR APPROVAL</b>?
            </p>
          </div>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="submitDialog = false">
            No
          </v-btn>
          <v-btn color="green" class="white--text" @click="submitPDS()">
            Yes
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

    <ChildrenDialog :data="child" :action="action" v-on:addChild="pushChild" />
    <EducBackgroundDialog
      :data="educBG"
      :action="action"
      v-on:addEducBg="pushEducBg"
    />
    <CSEligibilityDialog
      :data="csElig"
      :action="action"
      v-on:addCSElig="pushCSElig"
    />

    <WorkExpDialog
      :data="workExp"
      :action="action"
      v-on:addWorkExp="pushWorkExp"
      v-on:updateWorkExp="updateWorkExp"
    />
    <!-- <WorkExperienceDialog
      :data="workExp"
      :action="action"
      v-on:addWorkExp="pushWorkExp"
    /> -->

    <VoluntaryWorkDialog
      :data="volWork"
      :action="action"
      v-on:addVolWork="pushVolWork"
    />

    <LNDDialog
      :data="lnd"
      :action="action"
      v-on:addLND="pushLND"
      v-on:updateLND="updateLND"
    />
    <!-- <OtherInfosDialog
      :data="otherInfo"
      :action="action"
      v-on:addOtherInfo="pushOtherInfo"
    /> -->
    <OtherInfosSpecialSkillsDialog
      :data="otherInfoSpecialSkills"
      :action="action"
      v-on:addOtherInfoSpecialSkill="pushOtherInfoSpecialSkill"
    />
    <OtherInfosNonAcadDialog
      :data="otherInfoNonAcad"
      :action="action"
      v-on:addOtherInfoNonAcad="pushOtherInfoNonAcad"
    />
    <OtherInfosAssocMembershipDialog
      :data="otherInfoAssocMembership"
      :action="action"
      v-on:addOtherInfoAssocMembership="pushOtherInfoAssocMembership"
    />

    <ReferencesDialog
      :data="refers"
      :action="action"
      v-on:addReferences="pushReferences"
    />
  </div>
</template>

<script>
export default {
  components: {
    ChildrenDialog: () =>
      import("../../components/Dialogs/Forms/ChildrenDialog.vue"),
    EducBackgroundDialog: () =>
      import("../../components/Dialogs/Forms/EducBackgroundDialog.vue"),
    CSEligibilityDialog: () =>
      import("../../components/Dialogs/Forms/CSEligibilityDialog.vue"),
    WorkExpDialog: () =>
      import("../../components/Dialogs/Forms/WorkExpDialog.vue"),
    //  WorkExperienceDialog: () =>
    // import("../../components/Dialogs/Forms/WorkExperienceDialog.vue"),
    VoluntaryWorkDialog: () =>
      import("../../components/Dialogs/Forms/VoluntaryWorkDialog.vue"),
    LNDDialog: () => import("../../components/Dialogs/Forms/LNDDialog.vue"),
    // OtherInfosDialog: () =>
    //   import("../../components/Dialogs/Forms/OtherInfosDialog.vue"),
    OtherInfosSpecialSkillsDialog: () =>
      import(
        "../../components/Dialogs/Forms/OtherInfosSpecialSkillsDialog.vue"
      ),
    OtherInfosNonAcadDialog: () =>
      import("../../components/Dialogs/Forms/OtherInfosNonAcadDialog.vue"),
    OtherInfosAssocMembershipDialog: () =>
      import(
        "../../components/Dialogs/Forms/OtherInfosAssocMembershipDialog.vue"
      ),
    ReferencesDialog: () =>
      import("../../components/Dialogs/Forms/ReferencesDialog.vue"),
  },
  data: () => ({
    sheet: false,
    viewRemarks: false,
    submitDialog: false,
    isUpdate: false,
    isUpdateAllowed: false,
    confirmAction: null,
    confirmDialog: false,
    deleteConfirmDialog: false,
    itemData: null,
    indexToRemove: null,
    arrToRemove: null,
    empData: [],
    tab: { id: 1, name: "Personal Information" },
    activeTab: { id: 1, name: "Personal Information" },
    tabList: [
      { id: 1, name: "Personal Information" },
      { id: 2, name: "Family Background" },
      { id: 3, name: "Educational Background" },
      { id: 4, name: "Civil Service Eligibility" },
      { id: 5, name: "Work Experience" },
      { id: 6, name: "Voluntary Work Involvement" },
      { id: 7, name: "L & D Intervention" },
      { id: 8, name: "Other Information" },
      { id: 9, name: "Questions" },
      { id: 10, name: "References" },
      { id: 11, name: "Government Issued ID" },
    ],
    childTableHeaders: [
      { text: "Name", value: "name" },
      {
        text: "Birthdate",
        value: "bdate",
        color: "#828282",
        align: "center",
      },
      { text: "Action", value: "action", align: "center" },
    ],
    educTableHeaders: [
      { text: "Level", value: "level" },
      {
        text: "Name of School",
        value: "school_name",
        color: "#828282",
        align: "center",
      },

      {
        text: "Basic Education/ Degree/Course",
        value: "educ_course",
        color: "#828282",
        align: "center",
      },

      {
        text: "Period of Attendance (From)",
        value: "educ_from",
        color: "#828282",
        align: "center",
      },
      {
        text: "Period of Attendance (To)",
        value: "educ_to",
        color: "#828282",
        align: "center",
      },
      {
        text: "Highest Level / Units Earned",
        value: "units_earned",
        color: "#828282",
        align: "center",
      },
      {
        text: "Year Graduated",
        value: "year_graduated",
        color: "#828282",
        align: "center",
      },
      {
        text: "Scholarship / Academics Honors Received",
        value: "honors_received",
        color: "#828282",
        align: "center",
      },
      { text: "Action", value: "action", align: "center" },
    ],
    csEligTableHeaders: [
      {
        text:
          "Career service/ RA 1080 (Board/Bar) Under Special Laws/CSEE Barangay Eligibility / Driver's License",
        value: "eligibility_type",
      },
      {
        text: "Rating",
        value: "rating",
        color: "#828282",
        align: "center",
      },
      {
        text: "Date of Examination / Conferment",
        value: "conferment_date",
        color: "#828282",
        align: "center",
      },
      {
        text: "Place of Examination / Conferment",
        value: "conferment_place",
        color: "#828282",
        align: "center",
      },
      {
        text: "License number (if applicable)",
        value: "license_num",
        color: "#828282",
        align: "center",
      },
      {
        text: "License validity (if applicable)",
        value: "validity",
        color: "#828282",
        align: "center",
      },

      { text: "Action", value: "action", align: "center" },
    ],
    workExpTableHeaders: [
      {
        text: "Date(from - to)",
        value: "date_from",
      },

      {
        text: "Position Title",
        value: "position",
        color: "#828282",
        width: 200,
        align: "center",
      },
      {
        text: "Dept/Agency/Office/Company",
        value: "company",
        color: "#828282",
        align: "center",
      },
      {
        text: "Monthly Salary",
        value: "month_salary",
        color: "#828282",
        align: "center",
      },
      {
        text: "Salary/Job/Pay Grade",
        value: "salary_grade",
        color: "#828282",
        align: "center",
      },
      {
        text: "Status of Appointment",
        value: "appointment_status",
        color: "#828282",
        align: "center",
      },
      {
        text: "Gov't Service",
        value: "gov_service",
        color: "#828282",
        align: "center",
      },

      { text: "Action", value: "action", align: "center" },
    ],
    volWorkTableHeaders: [
      {
        text: "Name & Address of Organization",
        value: "org_name",
        color: "#828282",
        align: "center",
      },
      {
        text: "Inclusive Date (From)",
        value: "date_from",
      },
      {
        text: "Inclusive Date (To)",
        value: "date_to",
        color: "#828282",
        align: "center",
      },

      {
        text: "Number of hours",
        value: "num_hours",
        color: "#828282",
        align: "center",
      },
      {
        text: "Position / Nature of work",
        value: "position",
        color: "#828282",
        align: "center",
      },

      { text: "Action", value: "action", align: "center" },
    ],
    lndTableHeaders: [
      {
        text:
          "Title of Learning and Development Intervention/Training Programs",
        value: "title",
        color: "#828282",
        align: "center",
      },
      {
        text: "Inclusive Dates of Attendance (From)",
        value: "date_from",
      },
      {
        text: "Inclusive Date of Attendance  (To)",
        value: "date_to",
        color: "#828282",
        align: "center",
      },

      {
        text: "Number of hours",
        value: "num_hours",
        color: "#828282",
        align: "center",
      },
      {
        text: "Type of LD (Managerial/Supervisory/Techniques/etc)",
        value: "type",
        color: "#828282",
        align: "center",
      },
      {
        text: "Conducted/Sponsored By",
        value: "conducted_by",
        color: "#828282",
        align: "center",
      },

      { text: "Action", value: "action", align: "center" },
    ],
    otherInfoTableHeaders: [
      {
        text: "Special Skills and Hobbies",
        value: "hobbies",
        color: "#828282",
        align: "center",
      },
      {
        text: "Non Academic Distinction / Recognition",
        value: "non_acad_distinction",
        color: "#828282",
        align: "center",
      },

      {
        text: "Membership in Association/Organization",
        value: "org_membership",
        color: "#828282",
        align: "center",
      },

      { text: "Action", value: "action", align: "center" },
    ],
    otherInfoSpecialSkillsTableHeaders: [
      {
        text: "Special Skills and Hobbies",
        value: "hobbies",
        color: "#828282",
        align: "center",
      },
      { text: "Action", value: "action", align: "right" },
    ],
    otherInfoNonAcadTableHeaders: [
      {
        text: "Non Academic Distinction / Recognition",
        value: "non_acad_distinction",
        color: "#828282",
        align: "center",
      },

      { text: "Action", value: "action", align: "right" },
    ],
    otherInfoAssocMembershipTableHeaders: [
      {
        text: "Membership in Association/Organization",
        value: "org_membership",
        color: "#828282",
        align: "center",
      },

      { text: "Action", value: "action", align: "center" },
    ],
    referencesTableHeaders: [
      {
        text: "Name",
        value: "name",
        color: "#828282",
        align: "center",
      },
      {
        text: "Address",
        value: "address",
        color: "#828282",
        align: "center",
      },
      {
        text: "Telephone Number",
        value: "tel_no",
        color: "#828282",
        align: "center",
      },
      { text: "Action", value: "action", align: "center" },
    ],
    removedChild: [],
    removedEduc: [],
    removedCS: [],
    removedWorkExp: [],
    removedVolWork: [],
    removedLND: [],
    removedInfoSpecialSkill: [],
    removedInfononAcad: [],
    removedInfoAssocMember: [],
    removedReferences: [],

    sexItem: ["Male", "Female"],
    cvl_statusItem: ["Single", "Married", "Widowed", "Separated", "Others"],
    dualCtznItem: ["Yes", "No"],
    ctznTypeList: [
      { id: 1, type: "By birth" },
      { id: 2, type: "By naturalization" },
    ],
    countryList: [],
    pqChoices: ["Yes", "No"],
    no_gov_date_issued_id: null,
    no_gov_place_issued_id: null,
    status: null,
    formdata: {
      id: null,
      fname: null,
      lname: null,
      mname: null,
      suffix: null,
      email: null,
      bdate: null,
      birth_place: null,
      sex: null,
      civil_status: null,
      civil_status1: null,
      height: null,
      weight: null,
      blood_type: null,
      GSIS: null,
      PAGIBIG: null,
      SSS: null,
      PHILHEALTH: null,
      TIN: null,
      agency_employee_num: null,
      citizenship: null,
      isFilipino: "Yes",
      is_dual_citizen: null,
      citizenship_type: null,
      country: null,
      tel_no: null,
      mobile_no: null,
      residential_zip: null,
      residential_house_no: null,
      residential_street: null,
      residential_subd: null,
      residential_brgy: null,
      residential_city: null,
      residential_prov: null,
      permanent_zip: null,
      permanent_house_no: null,
      permanent_street: null,
      permanent_subd: null,
      permanent_brgy: null,
      permanent_city: null,
      permanent_prov: null,
      isSameAddress: false,
    },
    family_background: {
      id: null,
      noSpouse: false,
      father_fname: null,
      father_mname: null,
      father_lname: null,
      father_suffix: null,
      mother_fname: null,
      mother_mname: null,
      mother_lname: null,
      spouse_fname: null,
      spouse_mname: null,
      spouse_lname: null,
      spouse_suffix: null,
      occupation: null,
      employer_name: null,
      employer_address: null,
      tel_no: null,
    },
    children: [],
    educ_background: [],
    cs_eligibility: [],
    work_exp: [],
    voluntary_work: [],
    learning_and_development: [],
    other_infos: [],
    other_infosSpecialSkills: [],
    other_infosNonAcad: [],
    other_infosAssocMembership: [],
    personal_question_answer: {
      _1a: { answer: "No", details: null },
      _1b: { answer: "No", details: null },
      _2a: { answer: "No", details: null },
      _2b: {
        answer: "No",
        details: null,
        date_filed: null,
        case_status: null,
      },
      _3a: { answer: "No", details: null },
      _4a: { answer: "No", details: null },
      _5a: { answer: "No", details: null },
      _5b: { answer: "No", details: null },
      _6a: { answer: "No", details: null },
      _7a: { answer: "No", details: null },
      _7b: { answer: "No", details: null },
      _7c: { answer: "No", details: null },
    },
    references: [],
    gov_issued_id: {
      id: null,
      gov_id: null,
      gov_id_no: null,
      date_issued: null,
      place_issued: null,
    },
    isAllowPrint: false,
    action: "Add",
    csElig: [],
    child: [],
    workExp: [],
    volWork: [],
    lnd: [],
    refers: [],
    otherInfo: [],
    otherInfoSpecialSkills: [],
    otherInfoNonAcad: [],
    otherInfoAssocMembership: [],
    educBG: [],
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
    this.initialize();
    this.getInPDSUpdateActive();
    this.getCountry();
    this.eventHub.$on("closeWorkExpDialog", () => {});
  },
  created() {
    this.eventHub.$on("closeWorkExpDialog", () => {});

    // console.log("created");
    if (this.$store.state.expiryDate < Date.now()) {
      this.$store.dispatch("setUser", null);
      this.$store.dispatch("setIsAuthenticated", 0);
      this.render = true;
      this.$router.push("/");
    }
  },
  // watch: {
  //   formdata: {
  //     handler(old_data, new_data) {
  //       if (old_data != new_data) {
  //         this.hasDataChanged = false;
  //         console.log("walay changes");
  //       } else {
  //         this.hasDataChanged = false;
  //         console.log("naay changes");
  //       }
  //     },
  //     deep: true,
  //   },
  // },

  beforeDestroy() {
    this.eventHub.$off("closeWorkExpDialog");
  },
  computed: {
    computedSameAddress: {
      get: function() {
        return this.formdata.isSameAddress;
      },
      set: function(val) {
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
      get: function() {
        return this.family_background.noSpouse;
      },
      set: function(val) {
        this.family_background.noSpouse = val ? true : false;
        this.family_background.spouse_fname = val ? "N/A" : null;
        this.family_background.spouse_mname = val ? "N/A" : null;
        this.family_background.spouse_lname = val ? "N/A" : null;
        this.family_background.spouse_suffix = val ? "N/A" : null;
        this.family_background.occupation = val ? "N/A" : null;
        this.family_background.employer_name = val ? "N/A" : null;
        this.family_background.employer_address = val ? "N/A" : null;
        this.family_background.tel_no = val ? "N/A" : null;
      },
    },
  },
  methods: {
    loadRemarks(id) {
      this.axiosCall("/remarks/" + id + "/PDS", "GET").then((res) => {
        if (res.data) {
          this.remarksData = res.data;
        }
      });
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
      this.removedChild = [];
      this.removedEduc = [];
      this.removedCS = [];
      this.removedWorkExp = [];
      this.removedVolWork = [];
      this.removedInfoSpecialSkill = [];
      this.removedInfononAcad = [];
      this.removedInfoAssocMember = [];
      this.removedReferences = [];
      this.getCountry();
      this.axiosCall("/user-details/getMyPDS", "GET").then((res) => {
        // console.log("asdasd", res.data);
        this.loadRemarks(res.data.id);
        this.isAllowPrint = res.data.status == 2 ? true : false;
        this.status = res.data.status;
        this.formdata = res.data;
        this.formdata.isFilipino =
          res.data.citizenship == "Filipino" ? "Yes" : "No";
        this.formdata.is_dual_citizen =
          res.data.is_dual_citizen == 1 ? "Yes" : "No";
        this.formdata = res.data;
        if (res.data.family_background) {
          this.family_background = res.data.family_background;
        } else {
          this.family_background.id = null;
          this.family_background.noSpouse = false;
          this.family_background.father_fname = null;
          this.family_background.father_mname = null;
          this.family_background.father_lname = null;
          this.family_background.father_suffix = null;
          this.family_background.mother_fname = null;
          this.family_background.mother_mname = null;
          this.family_background.mother_lname = null;
          this.family_background.spouse_fname = null;
          this.family_background.spouse_mname = null;
          this.family_background.spouse_lname = null;
          this.family_background.spouse_suffix = null;
          this.family_background.occupation = null;
          this.family_background.employer_name = null;
          this.family_background.employer_address = null;
          this.family_background.tel_no = null;
        }

        this.children = res.data.children;
        this.educ_background = res.data.educ_background;
        this.cs_eligibility = res.data.cs_eligibility;
        this.work_exp = res.data.work_exp;
        this.voluntary_work = res.data.voluntary_work;
        this.learning_and_development = res.data.learning_and_development;
        // this.other_infos = res.data.other_infos;

        this.other_infosSpecialSkills = res.data.other_infos.specialSkill;
        this.other_infosNonAcad = res.data.other_infos.nonAcad;
        this.other_infosAssocMembership = res.data.other_infos.assocMembership;
        // console.log(data.personal_question_answer[0]);
        if (res.data.personal_question_answer.length != 0) {
          this.personal_question_answer._1a =
            res.data.personal_question_answer[0];
          this.personal_question_answer._1a.answer =
            res.data.personal_question_answer[0].answer == 1 ? "Yes" : "No";

          this.personal_question_answer._1b =
            res.data.personal_question_answer[1];
          this.personal_question_answer._1b.answer =
            res.data.personal_question_answer[1].answer == 1 ? "Yes" : "No";

          this.personal_question_answer._2a =
            res.data.personal_question_answer[2];
          this.personal_question_answer._2a.answer =
            res.data.personal_question_answer[2].answer == 1 ? "Yes" : "No";

          this.personal_question_answer._2b =
            res.data.personal_question_answer[3];

          this.personal_question_answer._2b.answer =
            res.data.personal_question_answer[3].answer == 1 ? "Yes" : "No";

          this.personal_question_answer._3a =
            res.data.personal_question_answer[4];
          this.personal_question_answer._3a.answer =
            res.data.personal_question_answer[4].answer == 1 ? "Yes" : "No";

          this.personal_question_answer._4a =
            res.data.personal_question_answer[5];
          this.personal_question_answer._4a.answer =
            res.data.personal_question_answer[5].answer == 1 ? "Yes" : "No";

          this.personal_question_answer._5a =
            res.data.personal_question_answer[6];
          this.personal_question_answer._5a.answer =
            res.data.personal_question_answer[6].answer == 1 ? "Yes" : "No";

          this.personal_question_answer._5b =
            res.data.personal_question_answer[7];
          this.personal_question_answer._5b.answer =
            res.data.personal_question_answer[7].answer == 1 ? "Yes" : "No";

          this.personal_question_answer._6a =
            res.data.personal_question_answer[8];
          this.personal_question_answer._6a.answer =
            res.data.personal_question_answer[8].answer == 1 ? "Yes" : "No";

          this.personal_question_answer._7a =
            res.data.personal_question_answer[9];
          this.personal_question_answer._7a.answer =
            res.data.personal_question_answer[9].answer == 1 ? "Yes" : "No";

          this.personal_question_answer._7b =
            res.data.personal_question_answer[10];
          this.personal_question_answer._7b.answer =
            res.data.personal_question_answer[10].answer == 1 ? "Yes" : "No";

          this.personal_question_answer._7c =
            res.data.personal_question_answer[11];
          this.personal_question_answer._7c.answer =
            res.data.personal_question_answer[11].answer == 1 ? "Yes" : "No";
        }

        // personal_question_answer: this.personal_question_answer,
        this.references = res.data.references;
        this.gov_issued_id.id = res.data.gov_issued_id
          ? res.data.gov_issued_id.id
          : null;
        this.gov_issued_id.gov_id = res.data.gov_issued_id
          ? res.data.gov_issued_id.gov_id
          : null;
        this.gov_issued_id.gov_id_no = res.data.gov_issued_id
          ? res.data.gov_issued_id.gov_id_no
          : null;
        if (res.data.gov_issued_id) {
          this.splitDateAndPlace(res.data.gov_issued_id.date_issued);
        } else {
          this.gov_issued_id.date_issued = null;
          this.gov_issued_id.place_issued = null;
          this.no_gov_date_issued_id = true;
          this.no_gov_place_issued_id = true;
        }

        // this.gov_issued_id.date_issued = res.data.gov_issued_id
        //   ? res.data.gov_issued_id.date_issued
        //   : null;
      });
    },

    splitDateAndPlace(str) {
      if (str) {
        const dump = str.split("/");

        this.gov_issued_id.date_issued =
          dump[0] == null || dump[0] == "null" ? null : dump[0];
        this.gov_issued_id.place_issued =
          dump[1] == null || dump[1] == "null" ? null : dump[1];
        this.no_gov_date_issued_id = !dump[0] || dump[0] == null ? true : false;
        this.no_gov_place_issued_id =
          !dump[1] || dump[1] == null ? true : false;
      } else {
        this.gov_issued_id.date_issued = null;
        this.gov_issued_id.place_issued = null;
        this.no_gov_date_issued_id = true;
        this.no_gov_place_issued_id = true;
      }
    },

    getInPDSUpdateActive() {
      this.axiosCall("/allow-pds-update/isPDSUpdateActive", "GET").then(
        (res) => {
          if (res.data.isAllowed) {
            this.isUpdateAllowed = true;
          } else {
            this.isUpdateAllowed = false;
          }
        }
      );
    },
    getCountry() {
      this.axiosCall("/country", "GET").then((res) => {
        this.countryList = res.data;
      });
    },

    addChild() {
      this.child = { id: null };
      this.action = "Add";
    },

    editChild(item) {
      this.child = { id: null };
      setTimeout(() => {
        this.action = "Update";
        this.child = item;
      }, 100);
    },

    pushChild(data) {
      this.children.push({ name: data.name, bdate: data.bdate });
    },

    addEducBg() {
      this.educBG = { id: null };
      this.action = "Add";
    },

    editEduc(item) {
      this.educBG = { id: null };
      setTimeout(() => {
        this.action = "Update";
        this.educBG = item;
      }, 100);
    },

    deleteChild(item, index) {
      this.itemData = item;
      this.indexToRemove = index;
      this.arrToRemove = "CHILD";
      this.deleteConfirmDialog = true;
    },

    deleteEduc(item, index) {
      this.itemData = item;
      this.indexToRemove = index;
      this.arrToRemove = "EDUCATION";
      this.deleteConfirmDialog = true;
    },

    pushEducBg(data) {
      this.educ_background.push({
        level: data.level,
        grad_study_type: data.grad_study_type,
        grad_status: data.grad_status,
        school_name: data.school_name,
        isGraduated: data.isGraduated,
        educ_course: data.educ_course,
        educ_from: data.educ_from,
        educ_to: data.educ_to_present ? null : data.educ_to,
        units_earned: data.units_earned,
        year_graduated: data.year_graduated,
        honors_received: data.honors_received,
      });
    },

    addCSElig() {
      this.csElig = { id: null };
      this.action = "Add";
    },

    editCSElig(item) {
      this.csElig = { id: null };
      setTimeout(() => {
        this.action = "Update";
        this.csElig = item;
      }, 100);
    },

    deleteCS(item, index) {
      this.itemData = item;
      this.indexToRemove = index;
      this.arrToRemove = "CIVIL_SERVICE";
      this.deleteConfirmDialog = true;
    },

    pushCSElig(data) {
      this.cs_eligibility.push({
        eligibility_type: data.eligibility_type,
        rating: data.rating,
        conferment_date: data.conferment_date,
        conferment_date_to: data.conferment_date_to,
        conferment_place: data.conferment_place,
        license_num: data.license_num,
        validity: data.validity,
      });
    },

    addWorkExp() {
      this.action = "Add";
      this.workExp = { id: null };
    },

    editWorkExp(item, index) {
      this.workExpIndexToUpdate = index;
      // console.log(index);
      this.workExp = { id: null };
      setTimeout(() => {
        this.action = "Update";
        this.workExp = item;
      }, 100);
    },

    deleteWorkExp(item, index) {
      this.itemData = item;
      this.indexToRemove = index;
      this.arrToRemove = "WORK_EXP";
      this.deleteConfirmDialog = true;
    },

    updateWorkExp(data) {
      console.log(data);
      this.work_exp[this.workExpIndexToUpdate].date_from = data.date_from;
      this.work_exp[this.workExpIndexToUpdate].date_to = data.date_to;
      this.work_exp[this.workExpIndexToUpdate].is_present_date_to =
        data.is_present_date_to;
      this.work_exp[this.workExpIndexToUpdate].is_in_DNSC = data.is_in_DNSC;
      this.work_exp[this.workExpIndexToUpdate].position = data.position;
      this.work_exp[this.workExpIndexToUpdate].company = data.company;
      this.work_exp[this.workExpIndexToUpdate].month_salary =
        data.monthly_salary;
      this.work_exp[this.workExpIndexToUpdate].rate_per_day = data.rate_per_day;
      this.work_exp[this.workExpIndexToUpdate].salary_grade = data.salary_grade;
      this.work_exp[this.workExpIndexToUpdate].salary_grade_step =
        data.salary_grade_step;
      this.work_exp[this.workExpIndexToUpdate].pay_grade = data.pay_grade;
      this.work_exp[this.workExpIndexToUpdate].appointment_status =
        data.appointment_status;
      this.work_exp[this.workExpIndexToUpdate].gov_service = data.gov_service;
    },

    pushWorkExp(data) {
      // console.log("workdata", data);
      // this.work_exp.push({
      let datas = {
        date_from: data.date_from,
        date_to: data.date_to,
        is_present_date_to: data.is_present_date_to,
        is_in_DNSC: data.is_in_DNSC,
        position: data.position,
        company: data.company,
        month_salary: data.monthly_salary,
        rate_per_day: data.rate_per_day,
        salary_grade: data.salary_grade,
        salary_grade_step: data.salary_grade_step,
        pay_grade: data.pay_grade,
        appointment_status: data.appointment_status,
        gov_service: data.gov_service,
      };
      this.work_exp = this.prependData(datas, this.work_exp);
    },

    addVolWork() {
      this.volWork = { id: null };
      this.action = "Add";
    },

    editVolWork(item) {
      this.volWork = { id: null };
      setTimeout(() => {
        this.action = "Update";
        this.volWork = item;
      }, 100);
    },

    deleteVolWork(item, index) {
      this.itemData = item;
      this.indexToRemove = index;
      this.arrToRemove = "VOL_WORK";
      this.deleteConfirmDialog = true;
    },

    pushVolWork(data) {
      this.voluntary_work.push({
        date_from: data.date_from,
        date_to: data.date_to,
        org_name: data.org_name,
        num_hours: data.num_hours,
        position: data.position,
      });
    },
    // otherInfo
    addOtherInfo() {
      this.otherInfo = { id: null };
      this.action = "Add";
    },

    editOtherInfo(item) {
      this.otherInfo = { id: null };
      setTimeout(() => {
        this.action = "Update";
        this.otherInfo = item;
      }, 100);
    },

    pushOtherInfo(data) {
      this.other_infos.push({
        hobbies: data.hobbies,
        non_acad_distinction: data.non_acad_distinction,
        org_membership: data.org_membership,
      });
    },
    //end of otherInfo

    // otherInfoSpecialSkill
    addOtherInfoSkill() {
      this.otherInfoSpecialSkills = { id: null };
      this.action = "Add";
    },

    editOtherInfoSpecialSkill(item) {
      this.otherInfoSpecialSkills = { id: null };
      setTimeout(() => {
        this.action = "Update";
        this.otherInfoSpecialSkills = item;
      }, 100);
    },

    deleteInfoSpecialSkill(item, index) {
      this.itemData = item;
      this.indexToRemove = index;
      this.arrToRemove = "INFO_SPECIAL_SKILL";
      this.deleteConfirmDialog = true;
    },

    pushOtherInfoSpecialSkill(data) {
      this.other_infosSpecialSkills.push({
        hobbies: data.hobbies,
      });
    },
    // end of otherinfoSpecialSkill

    // otherInfoNonAcad
    addOtherInfoNonAcad() {
      this.otherInfoNonAcad = { id: null };
      this.action = "Add";
    },

    editOtherInfoNonAcad(item) {
      this.otherInfoNonAcad = { id: null };
      setTimeout(() => {
        this.action = "Update";
        this.otherInfoNonAcad = item;
      }, 100);
    },

    deleteInfoNonAcad(item, index) {
      this.itemData = item;
      this.indexToRemove = index;
      this.arrToRemove = "INFO_NON_ACAD";
      this.deleteConfirmDialog = true;
    },

    pushOtherInfoNonAcad(data) {
      this.other_infosNonAcad.push({
        non_acad_distinction: data.non_acad_distinction,
      });
    },
    // end of otherInfoNonAcad

    // otherInfoAssocMembership
    addOtherInfoAssocMembership() {
      this.otherInfoAssocMembership = { id: null };
      this.action = "Add";
    },

    editOtherInfoAssocMembership(item) {
      this.otherInfoAssocMembership = { id: null };
      setTimeout(() => {
        this.action = "Update";
        this.otherInfoAssocMembership = item;
      }, 100);
    },

    deleteInfoAssocMember(item, index) {
      this.itemData = item;
      this.indexToRemove = index;
      this.arrToRemove = "INFO_ASSOC_MEMBER";
      this.deleteConfirmDialog = true;
    },

    pushOtherInfoAssocMembership(data) {
      this.other_infosAssocMembership.push({
        org_membership: data.org_membership,
      });
    },
    // end of otherInfoNonAcad

    addReferences() {
      this.refers = { id: null };
      this.action = "Add";
    },

    editReferences(item) {
      this.refers = { id: null };
      setTimeout(() => {
        this.action = "Update";
        this.refers = item;
      }, 100);
    },

    deleteReference(item, index) {
      this.itemData = item;
      this.indexToRemove = index;
      this.arrToRemove = "REFERENCE";
      this.deleteConfirmDialog = true;
    },

    pushReferences(data) {
      this.references.push({
        name: data.name,
        address: data.address,
        tel_no: data.tel_no,
      });
    },

    addLND() {
      this.lnd = { id: null };
      this.action = "Add";
    },

    editLND(item, index) {
      this.lndToUpdate = index;
      this.lnd = { id: null };
      setTimeout(() => {
        this.action = "Update";
        this.lnd = item;
      }, 100);
    },

    deleteLND(item, index) {
      this.itemData = item;
      this.indexToRemove = index;
      this.arrToRemove = "LND";
      this.deleteConfirmDialog = true;
    },

    pushLND(data) {
      this.learning_and_development.push({
        date_from: data.date_from,
        date_to: data.date_to,
        // inclusiveDate: data.inclusiveDate,
        title: data.title,
        num_hours: data.num_hours,
        type: data.type,
        conducted_by: data.conducted_by,
      });
    },

    updateLND(data) {
      this.learning_and_development[this.lndToUpdate].title = data.title;
      this.learning_and_development[this.lndToUpdate].num_hours =
        data.num_hours;
      this.learning_and_development[this.lndToUpdate].type = data.type;
      this.learning_and_development[this.lndToUpdate].conducted_by =
        data.conducted_by;

      // this.learning_and_development[this.lndToUpdate].inclusiveDate =
      //   data.inclusiveDate;
      this.learning_and_development[this.lndToUpdate].date_from =
        data.date_from;
      this.learning_and_development[this.lndToUpdate].date_to = data.date_to;
    },

    print(withPic) {
      if (withPic) {
        this.axiosCall("/user-details/getUser", "GET").then((res) => {
          window.open(
            process.env.VUE_APP_SERVER +
              "/pdf-generator/generateMyPDS/" +
              res.data +
              "/true"
          );
        });
      } else {
        this.axiosCall("/user-details/getUser", "GET").then((res) => {
          window.open(
            process.env.VUE_APP_SERVER +
              "/pdf-generator/generateMyPDS/" +
              res.data +
              "/false"
          );
        });
      }
    },

    confirmSave() {
      if (this.$refs.myPdsForm.validate()) {
        this.confirmAction = "SAVE";
        this.confirmDialog = true;
        this.sheet = !this.sheet;
      } else {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header = "System Message!";
        this.fadeAwayMessage.message = "Please fill all required fields";
      }
    },
    confirmCancel() {
      if (this.$refs.myPdsForm.validate()) {
        this.confirmAction = "CANCEL";
        this.confirmDialog = true;
        this.sheet = !this.sheet;
      } else {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header = "System Message!";
        this.fadeAwayMessage.message = "Please fill all required fields";
      }
    },

    cancelSaving() {
      this.confirmDialog = false;
      this.confirmAction = null;
      this.isUpdate = false;
      this.sheet = !this.sheet;
      this.initialize();
      this.getInPDSUpdateActive();
      this.isUpdateAllowed = false;
    },

    submitPDS() {
      this.axiosCall("/user-details/submitMyPDS", "POST").then((res) => {
        if (res.data.status == 200) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
          this.isUpdate = false;
          this.submitDialog = false;
          this.initialize();
          this.getInPDSUpdateActive();
          this.isUpdateAllowed = false;
        } else {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
        }
      });
    },

    saveUpdate() {
      this.confirmDialog = false;
      this.confirmAction = null;
      let GovIDIssued;

      if (!this.no_gov_date_issued_id && !this.no_gov_place_issued_id) {
        GovIDIssued =
          this.gov_issued_id.date_issued +
          "/" +
          this.gov_issued_id.place_issued;
      } else if (!this.no_gov_date_issued_id && this.no_gov_place_issued_id) {
        GovIDIssued = this.gov_issued_id.date_issued + "/";
      } else if (this.no_gov_date_issued_id && !this.no_gov_place_issued_id) {
        GovIDIssued = "/" + this.gov_issued_id.place_issued;
      } else if (this.no_gov_date_issued_id && this.no_gov_place_issued_id) {
        GovIDIssued = null;
      }

      let data = {
        fname: this.formdata.fname,
        lname: this.formdata.lname,
        mname: this.formdata.mname,
        suffix: this.formdata.suffix,
        email: this.formdata.email,
        bdate: this.formdata.bdate,
        birth_place: this.formdata.birth_place,
        sex: this.formdata.sex,
        civil_status: this.formdata.civil_status,
        civil_status_others:
          this.formdata.civil_status == "Others"
            ? this.formdata.civil_status1
            : null,
        height: this.formdata.height,
        weight: this.formdata.weight,
        blood_type: this.formdata.blood_type,
        GSIS: this.formdata.GSIS,
        PAGIBIG: this.formdata.PAGIBIG,
        SSS: this.formdata.SSS,
        PHILHEALTH: this.formdata.PHILHEALTH,
        TIN: this.formdata.TIN,
        agency_employee_num: this.formdata.agency_employee_num,
        citizenship: this.formdata.isFilipino == "Yes" ? "Filipino" : null,
        is_dual_citizen: this.formdata.is_dual_citizen,
        citizenship_type: this.formdata.citizenship_type,
        country: this.formdata.country,
        tel_no: this.formdata.tel_no,
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
        family_background: {
          id: this.family_background.id,
          noSpouse: this.family_background.noSpouse,
          father_fname: this.family_background.father_fname,
          father_mname: this.family_background.father_mname,
          father_lname: this.family_background.father_lname,
          father_suffix: this.family_background.father_suffix,
          mother_fname: this.family_background.mother_fname,
          mother_mname: this.family_background.mother_mname,
          mother_lname: this.family_background.mother_lname,
          spouse_fname: this.family_background.spouse_fname,
          spouse_mname: this.family_background.spouse_mname,
          spouse_lname: this.family_background.spouse_lname,
          spouse_suffix: this.family_background.spouse_suffix,

          occupation: this.family_background.occupation,
          employer_name: this.family_background.employer_name,
          employer_address: this.family_background.employer_address,
          tel_no: this.family_background.tel_no,
        },
        children: this.children,
        educ_background: this.educ_background,
        cs_eligibility: this.cs_eligibility,
        work_exp: this.work_exp,
        voluntary_work: this.voluntary_work,
        learning_and_development: this.learning_and_development,
        other_infos: {
          specialSkill: this.other_infosSpecialSkills,
          nonAcad: this.other_infosNonAcad,
          assocMembership: this.other_infosAssocMembership,
        },
        personal_question_answer: this.personal_question_answer,
        references: this.references,
        gov_issued_id: {
          id: this.gov_issued_id.id,
          gov_id: this.gov_issued_id.gov_id,
          gov_id_no: this.gov_issued_id.gov_id_no,
          date_issued: GovIDIssued,
          // date_issued:
          //   !this.no_gov_date_issued_id && !this.no_gov_place_issued_id
          //     ? null
          //     : !this.no_gov_date_issued_id && this.no_gov_place_issued_id
          //     ? this.gov_issued_id.date_issued + "/"
          //     : this.no_gov_date_issued_id && !this.no_gov_place_issued_id
          //     ? "/" + this.gov_issued_id.place_issued
          //     : this.no_gov_date_issued_id && this.no_gov_place_issued_id
          //     ? this.gov_issued_id.date_issued +
          //       "/" +
          //       this.gov_issued_id.place_issued
          //     : "",
        },
        removedChild: this.removedChild,
        removedEduc: this.removedEduc,
        removedCS: this.removedCS,
        removedWorkExp: this.removedWorkExp,
        removedVolWork: this.removedVolWork,
        removedLND: this.removedLND,
        removedInfoSpecialSkill: this.removedInfoSpecialSkill,
        removedInfononAcad: this.removedInfononAcad,
        removedInfoAssocMember: this.removedInfoAssocMember,
        removedReferences: this.removedReferences,
      };
      // console.log(data);
      this.axiosCall("/user-details/updateMyPDS", "POST", data).then((res) => {
        if (res.data.status == 200) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
          this.isUpdate = false;
          this.initialize();
          this.getInPDSUpdateActive();
          this.isUpdateAllowed = false;
        } else {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
        }
      });
    },

    proceedRemove() {
      if (this.arrToRemove == "CHILD") {
        if (this.itemData.id) {
          this.removedChild.push(this.itemData);
          this.children.splice(this.indexToRemove, 1);
        } else {
          this.children.splice(this.indexToRemove, 1);
        }
      }

      if (this.arrToRemove == "EDUCATION") {
        if (this.itemData.id) {
          this.removedEduc.push(this.itemData);
          this.educ_background.splice(this.indexToRemove, 1);
        } else {
          this.educ_background.splice(this.indexToRemove, 1);
        }
      }

      if (this.arrToRemove == "CIVIL_SERVICE") {
        if (this.itemData.id) {
          this.removedCS.push(this.itemData);
          this.cs_eligibility.splice(this.indexToRemove, 1);
        } else {
          this.cs_eligibility.splice(this.indexToRemove, 1);
        }
      }

      if (this.arrToRemove == "WORK_EXP") {
        if (this.itemData.id) {
          this.removedWorkExp.push(this.itemData);
          this.work_exp.splice(this.indexToRemove, 1);
        } else {
          this.work_exp.splice(this.indexToRemove, 1);
        }
      }

      if (this.arrToRemove == "VOL_WORK") {
        if (this.itemData.id) {
          this.removedVolWork.push(this.itemData);
          this.voluntary_work.splice(this.indexToRemove, 1);
        } else {
          this.voluntary_work.splice(this.indexToRemove, 1);
        }
      }

      if (this.arrToRemove == "LND") {
        if (this.itemData.id) {
          this.removedLND.push(this.itemData);
          this.learning_and_development.splice(this.indexToRemove, 1);
        } else {
          this.learning_and_development.splice(this.indexToRemove, 1);
        }
      }

      if (this.arrToRemove == "INFO_SPECIAL_SKILL") {
        if (this.itemData.id) {
          this.removedInfoSpecialSkill.push(this.itemData);
          this.other_infosSpecialSkills.splice(this.indexToRemove, 1);
        } else {
          this.other_infosSpecialSkills.splice(this.indexToRemove, 1);
        }
      }

      if (this.arrToRemove == "INFO_NON_ACAD") {
        if (this.itemData.id) {
          this.removedInfononAcad.push(this.itemData);
          this.other_infosNonAcad.splice(this.indexToRemove, 1);
        } else {
          this.other_infosNonAcad.splice(this.indexToRemove, 1);
        }
      }

      if (this.arrToRemove == "INFO_ASSOC_MEMBER") {
        if (this.itemData.id) {
          this.removedInfoAssocMember.push(this.itemData);
          this.other_infosAssocMembership.splice(this.indexToRemove, 1);
        } else {
          this.other_infosAssocMembership.splice(this.indexToRemove, 1);
        }
      }

      if (this.arrToRemove == "REFERENCE") {
        if (this.itemData.id) {
          this.removedReferences.push(this.itemData);
          this.references.splice(this.indexToRemove, 1);
        } else {
          this.references.splice(this.indexToRemove, 1);
        }
      }

      this.itemData = null;
      this.indexToRemove = null;
      this.arrToRemove = null;
      this.deleteConfirmDialog = false;
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
  background-color: #519043 !important;
  color: white !important;
}
thead th:first-child {
  border-radius: 5px 0 0 0;
}
thead th:last-child {
  border-radius: 0 5px 0 0;
}
</style>
