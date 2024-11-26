<template>
  <div>
    <v-dialog
      v-model="dialog"
      scrollable
      persistent
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card class="overflow-x-hidden">
        <v-card-title dark class="dialog-header"
          >Employee Details
          <v-spacer></v-spacer>
          <v-btn icon dark @click="close()">
            <v-icon>mdi-close</v-icon>
          </v-btn>

          <v-tabs
            v-model="dumpTab"
            :center-active="true"
            show-arrows
            color="#519043"
            height="40"
            class="mb-n4 elevation-4 rounded-lg"
          >
            <v-tab
              v-for="tab in tabList"
              :key="tab.id"
              @click="changeTab(tab)"
              >{{ tab.name }}</v-tab
            >
          </v-tabs>
        </v-card-title>

        <v-card-text class="mt-7">
          <v-row>
            <v-col cols="12" class="mt-5">
              <v-form ref="employee_detail_form">
                <div v-show="tab.id == 1">
                  <v-row cols="12">
                    <!-- FIRST NAME -->
                    <v-col cols="3">
                      <v-text-field
                        v-model="formdata.fname"
                        dense
                        readonly
                        outlined
                        @click="openRemarkModal('First Name')"
                        class="rounded-lg"
                        label="First Name"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>
                    <!-- MIDDLE NAME -->
                    <v-col cols="3">
                      <v-text-field
                        v-model="formdata.mname"
                        dense
                        readonly
                        outlined
                        @click="openRemarkModal('Middle Name')"
                        class="rounded-lg"
                        label="Middle Name"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>
                    <!-- LAST NAME -->
                    <v-col cols="3">
                      <v-text-field
                        v-model="formdata.lname"
                        dense
                        readonly
                        outlined
                        @click="openRemarkModal('Last Name')"
                        class="rounded-lg"
                        label="Last Name"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>
                    <!-- SUFFIX -->
                    <v-col cols="3">
                      <v-text-field
                        v-model="formdata.suffix"
                        dense
                        outlined
                        readonly
                        @click="openRemarkModal('Suffix')"
                        class="rounded-lg"
                        label="Suffix"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>

                  <v-row cols="12">
                    <v-col cols="3">
                      <v-text-field
                        outlined
                        dense
                        v-model="formdata.bdate"
                        chips
                        color="#6DB249"
                        small-chips
                        label="Date of Birth"
                        readonly
                        @click="openRemarkModal('Date of Birth')"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        v-model="formdata.birth_place"
                        dense
                        readonly
                        outlined
                        @click="openRemarkModal('Place of Birth')"
                        class="rounded-lg"
                        label="Place of Birth"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>
                    <!-- SEX / GENDER -->
                    <v-col cols="3">
                      <div @click="openRemarkModal('Sex/Gender')">
                        <v-select
                          :items="sexItem"
                          readonly
                          label="Sex"
                          outlined
                          color="#6DB249"
                          dense
                          v-model="formdata.sex"
                        ></v-select>
                      </div>
                    </v-col>
                    <!-- CIVIL STATUS -->
                    <v-col cols="3">
                      <div @click="openRemarkModal('Civil Status')">
                        <v-select
                          :items="cvl_statusItem"
                          readonly
                          label="Civil Status"
                          color="#6DB249"
                          outlined
                          dense
                          v-model="formdata.civil_status"
                        ></v-select>
                        <v-text-field
                          v-if="formdata.civil_status == 'Others'"
                          readonly
                          v-model="formdata.civil_status1"
                          dense
                          outlined
                          color="#6DB249"
                        >
                        </v-text-field>
                      </div>
                    </v-col>
                  </v-row>

                  <v-row cols="12">
                    <v-col cols="3">
                      <v-text-field
                        @click="openRemarkModal('Height')"
                        v-model="formdata.height"
                        readonly
                        dense
                        outlined
                        class="rounded-lg"
                        label="Height (m)"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>
                    <!-- WEIGHT -->
                    <v-col cols="3">
                      <v-text-field
                        @click="openRemarkModal('Weight')"
                        v-model="formdata.weight"
                        readonly
                        dense
                        outlined
                        class="rounded-lg"
                        label="Weight (kg)"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>
                    <!-- BLOOD TYPE -->
                    <v-col cols="3">
                      <v-text-field
                        v-model="formdata.blood_type"
                        readonly
                        dense
                        outlined
                        @click="openRemarkModal('Blood Type')"
                        class="rounded-lg"
                        label="Blood Type"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <div @click="openRemarkModal('Citizenship')">
                        <v-select
                          :items="dualCtznItem"
                          label="Citizenship (Filipino)"
                          readonly
                          outlined
                          color="#6DB249"
                          dense
                          v-model="formdata.isFilipino"
                        ></v-select>
                      </div>
                    </v-col>
                  </v-row>

                  <v-row cols="12">
                    <v-col cols="3">
                      <div @click="openRemarkModal('Is dual citizen')">
                        <v-select
                          :items="dualCtznItem"
                          readonly
                          label="Is dual citizen"
                          outlined
                          color="#6DB249"
                          dense
                          v-model="formdata.is_dual_citizen"
                        ></v-select>
                        <v-autocomplete
                          readonly
                          v-if="formdata.is_dual_citizen == 'Yes'"
                          v-model="formdata.citizenship_type"
                          dense
                          outlined
                          class="rounded-lg"
                          item-text="type"
                          item-value="id"
                          label="Citizenship type"
                          color="#6DB249"
                          :items="ctznTypeList"
                        >
                        </v-autocomplete>

                        <v-autocomplete
                          readonly
                          v-if="formdata.is_dual_citizen == 'Yes'"
                          v-model="formdata.country"
                          dense
                          outlined
                          class="rounded-lg"
                          item-text="name"
                          item-value="id"
                          label="Country"
                          color="#6DB249"
                          :items="countryList"
                        >
                        </v-autocomplete>
                      </div>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        readonly
                        v-model="formdata.GSIS"
                        dense
                        outlined
                        @click="openRemarkModal('GSID ID Number')"
                        class="rounded-lg"
                        label="GSID ID Number"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        readonly
                        v-model="formdata.PAGIBIG"
                        dense
                        outlined
                        @click="openRemarkModal('PAG-IBIG ID number')"
                        class="rounded-lg"
                        label="PAG-IBIG ID number"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        v-model="formdata.PHILHEALTH"
                        readonly
                        dense
                        outlined
                        @click="openRemarkModal('PHILHEALTH')"
                        class="rounded-lg"
                        label="PHILHEALTH"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>

                  <v-row cols="12">
                    <v-col cols="3">
                      <v-text-field
                        readonly
                        dense
                        outlined
                        v-model="formdata.TIN"
                        class="rounded-lg"
                        label="TIN
                       Number"
                        @click="openRemarkModal('TIN Number')"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        v-model="formdata.SSS"
                        readonly
                        dense
                        outlined
                        @click="openRemarkModal('SSS number')"
                        class="rounded-lg"
                        label="SSS number"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        v-model="formdata.tel_no"
                        readonly
                        dense
                        outlined
                        @click="openRemarkModal('Telephone number')"
                        class="rounded-lg"
                        label="Telephone number"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        v-model="formdata.mobile_no"
                        readonly
                        dense
                        @click="openRemarkModal('Mobile number')"
                        outlined
                        class="rounded-lg"
                        label="Mobile number"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>

                  <v-row cols="12">
                    <v-col cols="3">
                      <v-text-field
                        @click="openRemarkModal('Agency Employee number')"
                        v-model="formdata.agency_employee_num"
                        readonly
                        dense
                        outlined
                        class="rounded-lg"
                        label="Agency Employee number"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        @click="openRemarkModal('Email address')"
                        v-model="formdata.email"
                        readonly
                        dense
                        outlined
                        class="rounded-lg"
                        label="Email address"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>

                  <v-row cols="12">
                    <v-col cols="12">
                      <strong>Residential Address</strong>
                      <v-divider></v-divider>
                    </v-col>

                    <v-col cols="3">
                      <v-text-field
                        @click="openRemarkModal('Residential - House Number')"
                        v-model="formdata.residential_house_no"
                        readonly
                        dense
                        outlined
                        class="rounded-lg"
                        label="House Number"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>

                    <v-col cols="3">
                      <v-text-field
                        @click="openRemarkModal('Residential - Street')"
                        v-model="formdata.residential_street"
                        readonly
                        dense
                        outlined
                        class="rounded-lg"
                        label="Street"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>

                    <v-col cols="3">
                      <v-text-field
                        @click="
                          openRemarkModal('Residential - Subdivision / Village')
                        "
                        v-model="formdata.residential_subd"
                        readonly
                        dense
                        outlined
                        class="rounded-lg"
                        label="Subdivision / Village"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>

                    <v-col cols="3">
                      <v-text-field
                        @click="openRemarkModal('Residential - Barangay')"
                        v-model="formdata.residential_brgy"
                        readonly
                        dense
                        outlined
                        class="rounded-lg"
                        label="Barangay"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>

                    <v-col cols="4">
                      <v-text-field
                        @click="
                          openRemarkModal('Residential - Municipality / City')
                        "
                        v-model="formdata.residential_city"
                        readonly
                        dense
                        outlined
                        class="rounded-lg"
                        label="Municipality / City"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>

                    <v-col cols="4">
                      <v-text-field
                        @click="openRemarkModal('Residential - Province')"
                        v-model="formdata.residential_prov"
                        readonly
                        dense
                        outlined
                        class="rounded-lg"
                        label="Province"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="4">
                      <v-text-field
                        @click="openRemarkModal('Residential - Zip Code')"
                        v-model="formdata.residential_zip"
                        readonly
                        dense
                        outlined
                        class="rounded-lg"
                        label="Zip Code"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>

                  <v-row cols="12">
                    <v-col cols="12">
                      <strong>Permanent Address</strong>
                      <v-divider></v-divider>
                    </v-col>

                    <v-col cols="3">
                      <v-text-field
                        @click="openRemarkModal('Permanent - House Number')"
                        v-model="formdata.permanent_house_no"
                        readonly
                        dense
                        outlined
                        class="rounded-lg"
                        label="House Number"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>

                    <v-col cols="3">
                      <v-text-field
                        @click="openRemarkModal('Permanent - Street')"
                        v-model="formdata.permanent_street"
                        readonly
                        dense
                        outlined
                        class="rounded-lg"
                        label="Street"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>

                    <v-col cols="3">
                      <v-text-field
                        @click="
                          openRemarkModal('Permanent - Subdivision / Village')
                        "
                        v-model="formdata.permanent_subd"
                        readonly
                        dense
                        outlined
                        class="rounded-lg"
                        label="Subdivision / Village"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>

                    <v-col cols="3">
                      <v-text-field
                        @click="openRemarkModal('Permanent - Barangay')"
                        v-model="formdata.permanent_brgy"
                        readonly
                        dense
                        outlined
                        class="rounded-lg"
                        label="Barangay"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>

                    <v-col cols="4">
                      <v-text-field
                        @click="
                          openRemarkModal('Permanent - Municipality / City')
                        "
                        v-model="formdata.permanent_city"
                        readonly
                        dense
                        outlined
                        class="rounded-lg"
                        label="Municipality / City"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>

                    <v-col cols="4">
                      <v-text-field
                        @click="openRemarkModal('Permanent - Province')"
                        v-model="formdata.permanent_prov"
                        readonly
                        dense
                        outlined
                        class="rounded-lg"
                        label="Province"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>

                    <v-col cols="4">
                      <v-text-field
                        @click="openRemarkModal('Permanent - Zip Code')"
                        v-model="formdata.permanent_zip"
                        readonly
                        dense
                        outlined
                        class="rounded-lg"
                        label="Zip Code"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                </div>
                <div v-show="tab.id == 2">
                  <v-row cols="12">
                    <v-col cols="12"
                      ><strong>Spouse</strong><v-divider></v-divider
                    ></v-col>
                    <v-col cols="3">
                      <v-text-field
                        @click="
                          openRemarkModal(
                            'Family Background - Spouse - First Name'
                          )
                        "
                        v-model="family_background.spouse_fname"
                        readonly
                        dense
                        outlined
                        class="rounded-lg"
                        label="First Name"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        @click="
                          openRemarkModal(
                            'Family Background - Spouse - Middle Name'
                          )
                        "
                        v-model="family_background.spouse_mname"
                        readonly
                        dense
                        outlined
                        class="rounded-lg"
                        label="Middle Name"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        @click="
                          openRemarkModal(
                            'Family Background - Spouse - Last Name'
                          )
                        "
                        v-model="family_background.spouse_lname"
                        readonly
                        dense
                        outlined
                        class="rounded-lg"
                        label="Last Name"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        @click="
                          openRemarkModal('Family Background - Spouse - Suffix')
                        "
                        v-model="family_background.spouse_suffix"
                        readonly
                        dense
                        outlined
                        class="rounded-lg"
                        label="Suffix"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row cols="12">
                    <v-col cols="3">
                      <v-text-field
                        @click="
                          openRemarkModal(
                            'Family Background - Spouse - Occupation'
                          )
                        "
                        v-model="family_background.occupation"
                        readonly
                        dense
                        outlined
                        class="rounded-lg"
                        label="Occupation"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        @click="
                          openRemarkModal(
                            'Family Background - Spouse - Employer / Business Name'
                          )
                        "
                        v-model="family_background.employer_name"
                        readonly
                        dense
                        outlined
                        class="rounded-lg"
                        label="Employer / Business Name"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        @click="
                          openRemarkModal(
                            'Family Background - Spouse - Employer/Business Address'
                          )
                        "
                        v-model="family_background.employer_address"
                        readonly
                        dense
                        outlined
                        class="rounded-lg"
                        label="Business Address"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        @click="
                          openRemarkModal(
                            'Family Background - Spouse - Employer/Business Telephone Number'
                          )
                        "
                        v-model="family_background.tel_no"
                        readonly
                        dense
                        outlined
                        class="rounded-lg"
                        label="Telephone Number"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>

                  <v-row cols="12">
                    <v-col cols="12"
                      ><strong
                        style="cursor: pointer"
                        @click="openRemarkModal('Family Background - Children')"
                        >Children</strong
                      ><v-divider></v-divider
                    ></v-col>

                    <v-col class="mb-6">
                      <v-data-table
                        class="elevation-4 pb-4"
                        :headers="childTableHeaders"
                        :items="children"
                        :items-per-page="-1"
                        hide-default-footer
                      >
                        <template v-slot:[`item.action`]="{ item }">
                          <v-btn
                            small
                            color="grey"
                            icon
                            class="mr-2"
                            @click="editChild(item)"
                          >
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn>
                        </template>
                      </v-data-table>
                    </v-col>
                  </v-row>

                  <v-row cols="12">
                    <v-col cols="12"
                      ><strong>Father</strong><v-divider></v-divider
                    ></v-col>
                    <v-col cols="3">
                      <v-text-field
                        @click="
                          openRemarkModal(
                            'Family Background - Father - First Name'
                          )
                        "
                        v-model="family_background.father_fname"
                        readonly
                        dense
                        outlined
                        class="rounded-lg"
                        label="First Name"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        @click="
                          openRemarkModal(
                            'Family Background - Father - Middle Name'
                          )
                        "
                        v-model="family_background.father_mname"
                        readonly
                        dense
                        outlined
                        class="rounded-lg"
                        label="Middle Name"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        @click="
                          openRemarkModal(
                            'Family Background - Father - Last Name'
                          )
                        "
                        v-model="family_background.father_lname"
                        readonly
                        dense
                        outlined
                        class="rounded-lg"
                        label="Last Name"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        @click="
                          openRemarkModal('Family Background - Father - Suffix')
                        "
                        v-model="family_background.father_suffix"
                        readonly
                        dense
                        outlined
                        class="rounded-lg"
                        label="Suffix"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>

                  <v-row cols="12">
                    <v-col cols="12"
                      ><strong>Mother's Maiden Name</strong
                      ><v-divider></v-divider
                    ></v-col>
                    <v-col cols="3">
                      <v-text-field
                        @click="
                          openRemarkModal(
                            'Family Background - Mother`s Maiden Name - First Name'
                          )
                        "
                        v-model="family_background.mother_fname"
                        readonly
                        dense
                        outlined
                        class="rounded-lg"
                        label="First Name"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        @click="
                          openRemarkModal(
                            'Family Background - Mother`s Maiden Name - Middle Name'
                          )
                        "
                        v-model="family_background.mother_mname"
                        readonly
                        dense
                        outlined
                        class="rounded-lg"
                        label="Middle Name"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        @click="
                          openRemarkModal(
                            'Family Background - Mother`s Maiden Name - Last Name'
                          )
                        "
                        v-model="family_background.mother_lname"
                        readonly
                        dense
                        outlined
                        class="rounded-lg"
                        label="Last Name"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                </div>
                <div v-show="tab.id == 3">
                  <v-row>
                    <v-col class="mb-6">
                      <v-btn
                        color="red"
                        outlined
                        class="mb-2"
                        @click="openRemarkModal('Educational Background')"
                        >Add remarks</v-btn
                      >
                      <v-data-table
                        class="elevation-4 pb-4"
                        :headers="educTableHeaders"
                        :items="educ_background"
                        :items-per-page="-1"
                        hide-default-footer
                      >
                        <template v-slot:[`item.level`]="{ item }">
                          {{
                            item.level == "Vocational"
                              ? item.level.toUpperCase() + "/TRADE COURSE"
                              : item.level.toUpperCase()
                          }}
                        </template>
                        <template v-slot:[`item.action`]="{ item }">
                          <v-btn
                            small
                            color="grey"
                            icon
                            class="mr-2"
                            @click="editEduc(item)"
                          >
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn>
                        </template>
                      </v-data-table>
                    </v-col>
                  </v-row>
                </div>

                <div v-show="tab.id == 4">
                  <v-row cols="12">
                    <v-col class="mb-6">
                      <v-btn
                        color="red"
                        outlined
                        class="mb-2"
                        @click="openRemarkModal('Civil Service Eligibility')"
                        >Add remarks</v-btn
                      >
                      <v-data-table
                        class="elevation-4 pb-4"
                        :headers="csEligTableHeaders"
                        :items="cs_eligibility"
                        :items-per-page="-1"
                        hide-default-footer
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
                        <template v-slot:[`item.action`]="{ item }">
                          <v-btn
                            small
                            color="grey"
                            icon
                            class="mr-2"
                            @click="editCSElig(item)"
                          >
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn>
                        </template>
                      </v-data-table>
                    </v-col>
                  </v-row>
                </div>
                <div v-show="tab.id == 5">
                  <v-row cols="12">
                    <v-col class="mb-6">
                      <v-btn
                        color="red"
                        outlined
                        class="mb-2"
                        @click="openRemarkModal('Work Experience')"
                        >Add remarks</v-btn
                      >
                      <v-data-table
                        class="elevation-4 pb-4"
                        :headers="workExpTableHeaders"
                        :items="work_exp"
                        :items-per-page="-1"
                        hide-default-footer
                      >
                        <template v-slot:[`item.date_from`]="{ item }">
                          {{ formatDate(item.date_from) }} -
                          {{
                            item.is_present_date_to == true
                              ? "Present"
                              : formatDate(item.date_to)
                          }}
                        </template>
                        <template v-slot:[`item.salary_grade`]="{ item }">
                          {{
                            item.salary_grade && item.salary_grade_step
                              ? item.salary_grade + "-" + item.salary_grade_step
                              : ""
                          }}
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
                        <template v-slot:[`item.action`]="{ item }">
                          <v-btn
                            small
                            color="grey"
                            icon
                            class="mr-2"
                            @click="editWorkExp(item)"
                          >
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn>
                        </template>
                      </v-data-table>
                    </v-col>
                  </v-row>
                </div>
                <div v-show="tab.id == 6">
                  <v-row cols="12">
                    <v-col class="mb-6">
                      <v-btn
                        color="red"
                        outlined
                        class="mb-2"
                        @click="openRemarkModal('Voluntary Work Involvement')"
                        >Add remarks</v-btn
                      >
                      <v-data-table
                        class="elevation-4 pb-4"
                        :headers="volWorkTableHeaders"
                        :items="voluntary_work"
                        :items-per-page="-1"
                        hide-default-footer
                      >
                        <template v-slot:[`item.date_from`]="{ item }">
                          {{ formatDate(item.date_from) }}
                        </template>
                        <template v-slot:[`item.date_to`]="{ item }">
                          {{ formatDate(item.date_to) }}
                        </template>
                        <template v-slot:[`item.action`]="{ item }">
                          <v-btn
                            small
                            color="grey"
                            icon
                            class="mr-2"
                            @click="editVolWork(item)"
                          >
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn>
                        </template>
                      </v-data-table>
                    </v-col>
                  </v-row>
                </div>
                <div v-show="tab.id == 7">
                  <v-row cols="12">
                    <v-col class="mb-6">
                      <v-btn
                        color="red"
                        outlined
                        class="mb-2"
                        @click="openRemarkModal('L & D Intervention')"
                        >Add remarks</v-btn
                      >
                      <v-data-table
                        class="elevation-4 pb-4"
                        :headers="lndTableHeaders"
                        :items="learning_and_development"
                        :items-per-page="-1"
                        hide-default-footer
                      >
                        <template v-slot:[`item.date_from`]="{ item }">
                          {{ formatDate(item.date_from) }}
                          <!-- <div v-for="(data, i) in item.inclusiveDate" :key="i">
                            {{ formatDate(data.date_from) }}
                          </div> -->
                        </template>
                        <template v-slot:[`item.date_to`]="{ item }">
                          {{ formatDate(item.date_to) }}
                          <!-- <div v-for="(data, i) in item.inclusiveDate" :key="i">
                            {{ formatDate(data.date_to) }}
                          </div> -->
                        </template>
                        <template v-slot:[`item.action`]="{ item }">
                          <v-btn
                            small
                            color="grey"
                            icon
                            class="mr-2"
                            @click="editLND(item)"
                          >
                            <v-icon>mdi-pencil </v-icon>
                          </v-btn>
                        </template>
                      </v-data-table>
                    </v-col>
                  </v-row>
                </div>
                <div v-show="tab.id == 8">
                  <v-row cols="12">
                    <v-col class="mb-6" cols="4">
                      <v-btn
                        color="red"
                        outlined
                        class="mb-2"
                        @click="
                          openRemarkModal(
                            'Other Information - Special Skills and Hobbies'
                          )
                        "
                        >Add remarks</v-btn
                      >
                      <!-- <div class="d-flex justify-end mb-5">
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
                  </div> -->
                      <v-data-table
                        class="elevation-4 pb-4"
                        :headers="otherInfoSpecialSkillsTableHeaders"
                        :items-per-page="-1"
                        :items="other_infosSpecialSkills"
                        hide-default-footer
                      >
                        <template v-slot:[`item.action`]="{ item }">
                          <v-btn
                            small
                            color="grey"
                            icon
                            v-if="isUpdate"
                            class="mr-2"
                            @click="editOtherInfoSpecialSkill(item)"
                          >
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn>
                        </template>
                      </v-data-table>
                    </v-col>
                    <v-col class="mb-6" cols="4">
                      <v-btn
                        color="red"
                        outlined
                        class="mb-2"
                        @click="
                          openRemarkModal(
                            'Other Information - Non Academic Distinction / Recognition'
                          )
                        "
                        >Add remarks</v-btn
                      >
                      <!-- <div class="d-flex justify-end mb-5">
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
                  </div> -->
                      <v-data-table
                        class="elevation-4 pb-4"
                        :headers="otherInfoNonAcadTableHeaders"
                        :items-per-page="-1"
                        :items="other_infosNonAcad"
                        hide-default-footer
                      >
                        <template v-slot:[`item.action`]="{ item }">
                          <v-btn
                            small
                            color="grey"
                            icon
                            v-if="isUpdate"
                            class="mr-2"
                            @click="editOtherInfoNonAcad(item)"
                          >
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn>
                        </template>
                      </v-data-table>
                    </v-col>
                    <v-col class="mb-6" cols="4">
                      <v-spacer></v-spacer>
                      <v-btn
                        color="red"
                        outlined
                        class="mb-2"
                        @click="
                          openRemarkModal(
                            'Other Information - Membership in Association / Organization'
                          )
                        "
                        >Add remarks</v-btn
                      >
                      <!-- <div class="d-flex justify-end mb-5">
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
                  </div> -->
                      <v-data-table
                        class="elevation-4 pb-4"
                        :headers="otherInfoAssocMembershipTableHeaders"
                        :items-per-page="-1"
                        :items="other_infosAssocMembership"
                        hide-default-footer
                      >
                        <template v-slot:[`item.action`]="{ item }">
                          <v-btn
                            small
                            color="grey"
                            icon
                            v-if="isUpdate"
                            class="mr-2"
                            @click="editOtherInfoAssocMembership(item)"
                          >
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn>
                        </template>
                      </v-data-table>
                    </v-col>
                    <!-- <v-col class="mb-6">
                      <v-data-table
                        class="elevation-4 pb-4"
                        :headers="otherInfoTableHeaders"
                        :items="other_infos"
                        hide-default-footer
                      >
                        <template v-slot:[`item.action`]="{ item }">
                          <v-btn
                            small
                            color="grey"
                            icon
                            class="mr-2"
                            @click="editOtherInfo(item)"
                          >
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn>
                        </template>
                      </v-data-table>
                    </v-col> -->
                  </v-row>
                </div>
                <div v-show="tab.id == 9">
                  <v-row>
                    <!-- 1st question -->
                    <v-spacer></v-spacer>
                    <v-btn
                      color="red"
                      outlined
                      class="mb-2 mr-4"
                      @click="openRemarkModal('Questions')"
                      >Add remarks</v-btn
                    >
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
                        dense
                        outlined
                        color="#6DB249"
                        class="rounded-lg"
                        :items="pqChoices"
                        readonly
                        v-model="personal_question_answer._1a.answer"
                      >
                      </v-select>
                      <v-text-field
                        v-model="personal_question_answer._1a.details"
                        readonly
                        dense
                        outlined
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
                        readonly
                        dense
                        outlined
                        color="#6DB249"
                        class="rounded-lg"
                        :items="pqChoices"
                        v-model="personal_question_answer._1b.answer"
                      >
                      </v-select>
                      <v-text-field
                        readonly
                        v-model="personal_question_answer._1b.details"
                        dense
                        outlined
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
                        dense
                        readonly
                        outlined
                        color="#6DB249"
                        class="rounded-lg"
                        :items="pqChoices"
                        v-model="personal_question_answer._2a.answer"
                      >
                      </v-select>
                      <v-text-field
                        readonly
                        v-model="personal_question_answer._2a.details"
                        dense
                        outlined
                        class="rounded-lg"
                        label="If Yes, give details"
                        color="#6DB249"
                        v-if="personal_question_answer._2a.answer == 'Yes'"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="8">
                      <strong
                        >Have you been criminally charged before any
                        court?</strong
                      >
                    </v-col>
                    <v-col cols="4">
                      <v-select
                        readonly
                        dense
                        outlined
                        color="#6DB249"
                        class="rounded-lg"
                        :items="pqChoices"
                        v-model="personal_question_answer._2b.answer"
                      >
                      </v-select>
                      <v-text-field
                        readonly
                        v-model="personal_question_answer._2b.details"
                        dense
                        outlined
                        class="rounded-lg"
                        label="If Yes, give details"
                        color="#6DB249"
                        v-if="personal_question_answer._2b.answer == 'Yes'"
                      ></v-text-field>

                      <v-menu
                        readonly
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
                            outlined
                            dense
                            color="#6DB249"
                            v-model="personal_question_answer._2b.date_filed"
                            chips
                            small-chips
                            label="Date Filed"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          readonly
                          v-model="personal_question_answer._2b.date_filed"
                          no-title
                          color="#6DB249"
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
                        readonly
                        v-model="personal_question_answer._2b.case_status"
                        dense
                        outlined
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
                        >Have you ever been convicted of any crime or violation
                        of any law, decree, ordinance or regulation by any court
                        or tribunal?</strong
                      >
                    </v-col>
                    <v-col cols="4">
                      <v-select
                        dense
                        readonly
                        outlined
                        class="rounded-lg"
                        :items="pqChoices"
                        color="#6DB249"
                        v-model="personal_question_answer._3a.answer"
                      >
                      </v-select>
                      <v-text-field
                        readonly
                        v-model="personal_question_answer._3a.details"
                        dense
                        outlined
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
                        >Have you ever been separated from the service in any of
                        the following modes: resignation, retirement, dropped
                        from the rolls, dismissal, termination, end of term,
                        finished contract or phased out (abolition) in public or
                        private sector?</strong
                      >
                    </v-col>
                    <v-col cols="4">
                      <v-select
                        dense
                        outlined
                        readonly
                        class="rounded-lg"
                        color="#6DB249"
                        :items="pqChoices"
                        v-model="personal_question_answer._4a.answer"
                      >
                      </v-select>
                      <v-text-field
                        readonly
                        v-model="personal_question_answer._4a.details"
                        dense
                        outlined
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
                        dense
                        readonly
                        outlined
                        class="rounded-lg"
                        color="#6DB249"
                        :items="pqChoices"
                        v-model="personal_question_answer._5a.answer"
                      >
                      </v-select>
                      <v-text-field
                        v-model="personal_question_answer._5a.details"
                        dense
                        readonly
                        outlined
                        class="rounded-lg"
                        label="If Yes, give details"
                        color="#6DB249"
                        v-if="personal_question_answer._5a.answer == 'Yes'"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="8">
                      <strong
                        >Have you resigned from the government service during
                        the three (3)-month period before the last election to
                        promote/actively campaign for a national or local
                        candidate?</strong
                      >
                    </v-col>
                    <v-col cols="4">
                      <v-select
                        dense
                        outlined
                        readonly
                        class="rounded-lg"
                        color="#6DB249"
                        :items="pqChoices"
                        v-model="personal_question_answer._5b.answer"
                      >
                      </v-select>
                      <v-text-field
                        v-model="personal_question_answer._5b.details"
                        dense
                        outlined
                        readonly
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
                        >Have you ever acquired the status of an immagrant or
                        permanent resident of another country?</strong
                      >
                    </v-col>
                    <v-col cols="4">
                      <v-select
                        dense
                        outlined
                        readonly
                        class="rounded-lg"
                        :items="pqChoices"
                        color="#6DB249"
                        v-model="personal_question_answer._6a.answer"
                      >
                      </v-select>
                      <v-text-field
                        readonly
                        v-model="personal_question_answer._6a.details"
                        dense
                        outlined
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
                        Pursuant to: (a) Indigenous People's Act(RA 8371); (b)
                        magna Carta for Disabled Persons (RA 7277); (c) Solo
                        Parents Welfare Act of 2000 (RA 8971), please answer the
                        following items:
                      </strong>
                    </v-col>

                    <v-col cols="8">
                      <strong>Are you a member of any indigenous group?</strong>
                    </v-col>
                    <v-col cols="4">
                      <v-select
                        readonly
                        dense
                        outlined
                        class="rounded-lg"
                        color="#6DB249"
                        :items="pqChoices"
                        v-model="personal_question_answer._7a.answer"
                      >
                      </v-select>
                      <v-text-field
                        readonly
                        v-model="personal_question_answer._7a.details"
                        dense
                        outlined
                        class="rounded-lg"
                        label="If Yes, specify"
                        color="#6DB249"
                        v-if="personal_question_answer._7a.answer == 'Yes'"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="8">
                      <strong>Are you a person with disabilty?</strong>
                    </v-col>
                    <v-col cols="4">
                      <v-select
                        dense
                        readonly
                        outlined
                        color="#6DB249"
                        class="rounded-lg"
                        :items="pqChoices"
                        v-model="personal_question_answer._7b.answer"
                      >
                      </v-select>
                      <v-text-field
                        readonly
                        v-model="personal_question_answer._7b.details"
                        dense
                        outlined
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
                        dense
                        outlined
                        color="#6DB249"
                        class="rounded-lg"
                        :items="pqChoices"
                        v-model="personal_question_answer._7c.answer"
                      >
                      </v-select>
                      <v-text-field
                        v-model="personal_question_answer._7c.details"
                        dense
                        readonly
                        outlined
                        class="rounded-lg"
                        label="If Yes, please specify ID No."
                        color="#6DB249"
                        v-if="personal_question_answer._7c.answer == 'Yes'"
                      ></v-text-field>
                    </v-col>
                    <!-- end of 7th question -->
                  </v-row>
                </div>
                <div v-show="tab.id == 10">
                  <v-row cols="12">
                    <v-col class="mb-6">
                      <v-btn
                        color="red"
                        outlined
                        class="mb-2 mr-4"
                        @click="openRemarkModal('References')"
                        >Add remarks</v-btn
                      >
                      <v-data-table
                        class="elevation-4 pb-4"
                        :headers="referencesTableHeaders"
                        :items="references"
                        :items-per-page="-1"
                        hide-default-footer
                      >
                        <template v-slot:[`item.action`]="{ item }">
                          <v-btn
                            small
                            color="grey"
                            icon
                            class="mr-2"
                            @click="editReferences(item)"
                          >
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn>
                        </template>
                      </v-data-table>
                    </v-col>
                  </v-row>
                </div>
                <div v-show="tab.id == 11">
                  <v-row cols="12">
                    <v-col cols="4">
                      <v-text-field
                        v-model="gov_issued_id.gov_id"
                        dense
                        outlined
                        @click="openRemarkModal('Government Issued ID')"
                        readonly
                        class="rounded-lg"
                        label="Government Issued ID"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="4">
                      <v-text-field
                        v-model="gov_issued_id.gov_id_no"
                        readonly
                        dense
                        outlined
                        class="rounded-lg"
                        @click="
                          openRemarkModal(
                            'Government Issued ID - ID/License/Passport Number'
                          )
                        "
                        label="ID/License/Passport Number"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="4">
                      <v-text-field
                        v-model="gov_issued_id.date_issued"
                        readonly
                        dense
                        outlined
                        class="rounded-lg"
                        @click="
                          openRemarkModal(
                            'Government Issued ID - Date/Place of Issuance'
                          )
                        "
                        label="Date/Place of Issuance"
                        color="#6DB249"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                </div>
              </v-form>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <!-- <v-card-actions class="pa-5">
          <v-spacer></v-spacer>
          <v-btn color="#D50000" outlined @click="closeDialog()">
            <v-icon>mdi-close-circle-outline</v-icon>
            Cancel
          </v-btn>
          <v-btn
            color="#519043"
            class="white--text"
            @click="updateDetails()"
            v-if="data.id"
          >
            <v-icon>mdi-check-circle</v-icon>
            Update Details
          </v-btn>
          <v-btn
            color="#519043"
            class="white--text"
            @click="confirmAdd()"
            v-if="!data.id"
          >
            <v-icon>mdi-check-circle</v-icon>
            Save Details
          </v-btn>
        </v-card-actions> -->
        <v-card-actions class="pa-5">
          <v-menu top v-if="data.id && statusType == 3">
            <template v-slot:activator="{ on }">
              <v-btn
                color="#519043"
                fab
                dark
                left
                small
                class="v-btn--example"
                v-on="on"
              >
                <v-icon>mdi-comment-processing-outline</v-icon>
              </v-btn>
            </template>

            <v-card
              class="mx-auto"
              width="600"
              max-width="600"
              max-height="600"
            >
              <v-card-title class="dialog-header white--text">
                <span class="text-h6">Remarks</span>
              </v-card-title>
              <v-card-text class="py-0">
                <v-timeline dense v-if="remarksData.length > 0">
                  <v-timeline-item
                    v-for="item in remarksData"
                    :key="item.id"
                    color="#519043"
                    icon="mdi-comment-processing-outline"
                    fill-dot
                  >
                    <!-- <template v-slot:opposite> Opposite </template>
                    Content -->
                    <v-alert :value="true">
                      <div class="text-h6">
                        {{
                          $store.getters.getUserData.id ==
                          item.remarks_maker_userID
                            ? "You"
                            : item.remarks_by
                        }}
                      </div>
                      <div class="text-body-1">
                        {{ item.message }}
                      </div>
                      <div class="text-caption">
                        <i>{{ formatDate(item.created_at) }}</i>
                      </div>
                    </v-alert>
                  </v-timeline-item>
                </v-timeline>
                <v-timeline dense v-if="remarksData.length == 0">
                  <v-timeline-item
                    color="#519043"
                    icon="mdi-comment-processing-outline"
                    fill-dot
                  >
                    <v-alert :value="true">
                      <div class="text-body-1">No remarks found.</div>
                    </v-alert>
                  </v-timeline-item>
                </v-timeline>
              </v-card-text>
            </v-card>
          </v-menu>
          <v-spacer></v-spacer>

          <v-btn @click="close()" v-if="statusType != 1">
            <!-- <v-icon>mdi-close-circle-outline</v-icon> -->
            Close
          </v-btn>
          <v-btn
            color="#D50000"
            outlined
            @click="openDialog('return')"
            v-if="data.id && statusType == 1"
          >
            <!-- @click="pending()" -->
            <v-icon>mdi-check-circle</v-icon>
            Pending
          </v-btn>
          <v-btn
            color="#519043"
            class="white--text"
            @click="openDialog('approve')"
            v-if="data.id && statusType == 1"
          >
            <!-- @click="approve()" -->
            <v-icon>mdi-check-circle</v-icon>
            Approve
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog width="800" v-model="isApprove">
      <v-card>
        <div
          :class="actionText == 'approve' ? 'bgGreen' : 'bgRed'"
          style="width: 100%; padding: 15px; color: white"
        >
          <span style="padding-left: 10px; letter-spacing: 1px">{{
            actionHeader
          }}</span>
        </div>
        <v-card-text
          v-if="!showRemarkField"
          style="
            font-size: 20px;
            text-align: center;
            vertical-align: middle;
            line-height: auto;
            margin-top: 20px;
          "
        >
          Are you sure you want to {{ actionText }} this PDS?
        </v-card-text>
        <v-card-text v-if="showRemarkField" style="overflow-y: auto">
          <v-list density="compact">
            <div v-if="allRemarks.length > 0">
              Please review your remarks/comments:
            </div>

            <v-list-item
              v-for="(item, i) in allRemarks"
              :key="i"
              :value="item"
              color="primary"
              style="
                border: 1px solid rgb(200, 200, 200);
                border-radius: 10px;
                margin-top: 5px;
                margin-bottom: 10px;
              "
            >
              <v-list-item-title> {{ item.fieldName }}:</v-list-item-title>
              <v-list-item-subtitle> {{ item.fieldVal }}</v-list-item-subtitle>
              <v-icon @click="editRemarksFunc(item)">mdi-pencil</v-icon>
              <v-icon @click="removeRemarks(item)">mdi-close</v-icon>
            </v-list-item>
          </v-list>
          <v-textarea
            style="padding: 0 -10px 0 -10px; margin-bottom: -30px"
            v-model="remarks"
            rows="6"
            label="Leave a remarks/comments"
            outlined
            dense
            color="#519043"
            variant="solo-inverted"
          ></v-textarea>

          <!-- <v-textarea
            style="margin-top: 15px; margin-bottom: -30px"
            v-model="remarks"
            label="Leave a remarks/comments"
            outlined
            dense
            color="#519043"
            variant="solo-inverted"
          ></v-textarea> -->
        </v-card-text>

        <v-card-actions
          style="
            border-top: 1px solid rgb(209, 208, 208);
            background-color: white;
          "
        >
          <v-btn
            v-if="undoRemarkData.length > 0 && showRemarkField == true"
            color="gray"
            outlined
            @click="undo"
            >Undo</v-btn
          >
          <v-spacer></v-spacer>

          <v-btn @click="(isApprove = false), (showRemarkField = false)"
            >Close</v-btn
          >
          <v-btn
            v-if="actionText == 'approve'"
            color="green"
            class="white--text"
            @click="approve()"
            >Proceed</v-btn
          >
          <v-btn
            v-if="actionText == 'return' && !showRemarkField"
            color="red"
            class="white--text"
            @click="showRemarkField = true"
            >Proceed</v-btn
          >
          <v-btn
            v-if="actionText == 'return' && showRemarkField"
            color="red"
            class="white--text"
            @click="pending()"
            >Proceed</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="editRemarks" width="250">
      <v-card>
        <div
          :class="actionText == 'approve' ? 'bgGreen' : 'bgRed'"
          style="width: 100%; padding: 15px; color: white"
        >
          <span style="padding-left: 10px; letter-spacing: 1px"
            >EDIT REMARKS</span
          >
        </div>
        <v-card-text style="margin-top: 15px; margin-bottom: -28px">
          <v-textarea
            v-model="editRemarksValue"
            outlined
            dense
            color="#519043"
            variant="solo-inverted"
          ></v-textarea>
        </v-card-text>
        <v-card-actions style="border-top: 1px solid rgb(209, 208, 208)">
          <v-spacer></v-spacer>

          <v-btn @click="editRemarks = false">Close</v-btn>
          <v-btn color="green" class="white--text" @click="saveEditRem()"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="confirmDialog" persistent max-width="290">
      <v-card>
        <v-card-title class="text-h5">
          Are you sure you want to proceed?
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="confirmDialog = false">
            Close
          </v-btn>
          <v-btn color="green darken-1" text @click="addDetails()">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog width="500" v-model="addRemarkGlobal">
      <v-card>
        <v-card-text style="padding: 20px">
          <v-form @submit.prevent ref="remarksDialogRef">
            <v-textarea
              :label="remarkLabelGlobal"
              :rules="[formRules.required]"
              v-model="remarkMsgGlobal"
              outlined
              dense
              color="#519043"
              variant="solo-inverted"
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions
          style="margin-top: -50px; padding: 20px; justify-content: end"
        >
          <v-btn @click="addRemarkGlobal = false">Close</v-btn>
          <v-btn color="green" left @click="saveRemarksFunc()">Saved</v-btn>
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
// import ChildrenDialog from "./ChildrenDialog.vue";
export default {
  props: {
    data: null,
    statusType: null,
  },
  components: {},

  data() {
    return {
      remarkLabelGlobal: null,
      remarkMsgGlobal: null,
      addRemarkGlobal: false,
      undoRemarkData: [],
      editRemarksData: [],
      editRemarksValue: null,
      editRemarks: false,
      addRemFirstName: false,
      addRemMiddleName: false,
      addRemLastName: false,
      addRemSuffix: false,
      addRemDateOfBirth: false,
      addRemPlaceOfBirth: false,
      addRemSex: false,
      addRemCivilStatus: false,
      addRemHeight: false,
      addRemWeight: false,
      addRemBloodType: false,
      addRemCitizenship: false,
      addRemDualCitizen: false,
      addRemGSIS: false,
      addRemPagIbig: false,
      addRemPhilhealth: false,
      addRemTin: false,
      addRemSSS: false,
      addRemTelNum: false,
      addRemMobNum: false,
      addRemAgencyEmployeeNum: false,
      addRemEmailAddress: false,
      remarks: null,
      remarksData: [],
      showRemarkField: false,
      actionText: "approve",
      actionHeader: "APPROVE PDS",
      childTableHeaders: [
        { text: "Name", value: "name" },
        {
          text: "Birthdate",
          value: "bdate",
          color: "#828282",
          align: "center",
        },
        { text: "Action", value: "action", align: "right" },
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
          text: "Scholarship / Academics honors received",
          value: "honors_received",
          color: "#828282",
          align: "center",
        },
        { text: "Action", value: "action", align: "right" },
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
          text: "Date of Conferment",
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

        { text: "Action", value: "action", align: "right" },
      ],
      workExpTableHeaders: [
        {
          text: "Inclusive Date (from - to)",
          value: "date_from",
          width: 250,
        },

        {
          text: "Position Title (Do not abbeviate)",
          value: "position",
          color: "#828282",
          width: 200,
          align: "center",
        },
        {
          text: "Department/Agency/Office/Company (Do not abbreviate)",
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

        { text: "Action", value: "action", align: "right" },
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

        { text: "Action", value: "action", align: "right" },
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

        { text: "Action", value: "action", align: "right" },
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

        { text: "Action", value: "action", align: "right" },
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

        { text: "Action", value: "action", align: "right" },
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
        { text: "Action", value: "action", align: "right" },
      ],
      sexItem: ["Male", "Female"],
      cvl_statusItem: ["Single", "Married", "Widowed", "Separated", "Others"],
      dualCtznItem: ["Yes", "No"],
      ctznTypeList: [
        { id: 1, type: "By birth" },
        { id: 2, type: "By naturalization" },
      ],
      pqChoices: ["Yes", "No"],
      isApprove: false,
      dialog: false,
      confirmDialog: false,
      child: [],
      isUpdate: false,
      action: "Add",

      csElig: [],
      workExp: [],
      volWork: [],
      lnd: [],
      refers: [],
      otherInfo: [],
      tab: { id: 1, name: "Personal Information" },
      dumpTab: { id: 1, name: "Personal Information" },
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
      allRemarks: [],
      // allRemarks: {
      //   firstName: null,
      //   middleName: null,
      //   lastName: null,
      //   suffix: null,
      //   dateOfBirth: null,
      //   placeOfBirth: null,
      //   sex: null,
      //   civilStatus: null,
      //   height: null,
      //   weight: null,
      //   bloodType: null,
      //   citizenship: null,
      //   isFilipino: null,
      //   gsisNum: null,
      //   pagibigNum: null,
      // },

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
      },
      family_background: {
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
      educBG: [],
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
      },
      fadeAwayMessage: {
        show: false,
        type: "success",
        header: "Successfully Added!",
        message: "",
        top: 10,
      },
      countryList: [],
      user_types: [],
      emp_types: [],
      status: [],
    };
  },
  created() {
    this.getUserTypes();
    this.getEmployeeTypes();
    this.getStatus();
    this.getCountry();
  },
  watch: {
    data: {
      handler(data) {
        if (data) {
          this.allRemarks = [];
          this.undoRemarkData = [];
          if (data.id) {
            this.getSpecificPDS(data.id);
            this.loadRemarks(data.id);
          } else {
            this.initialize();
            this.dialog = true;
          }
        }
      },
      // deep: true,
    },
    activeTab: {
      handler() {},
    },
  },

  methods: {
    openRemarkModal(label) {
      this.addRemarkGlobal = true;
      this.remarkLabelGlobal = label;
      this.remarkMsgGlobal = null;
      this.$refs.remarksDialogRef.resetValidation();
    },

    saveRemarksFunc() {
      if (this.$refs.remarksDialogRef.validate()) {
        this.allRemarks.push({
          fieldName: this.remarkLabelGlobal,
          fieldVal: this.remarkMsgGlobal,
        });
        this.addRemarkGlobal = false;
      }
    },

    undo() {
      console.log(this.undoRemarkData);
      for (var i = 0; i < this.undoRemarkData.length; i++) {
        this.allRemarks.push(this.undoRemarkData[i]);
        this.undoRemarkData.splice(
          this.undoRemarkData.findIndex(
            (v) => v.fieldName === this.undoRemarkData[i].fieldName
          ),
          1
        );
      }

      console.log(this.allRemarks);
    },
    saveEditRem() {
      this.allRemarks.splice(
        this.allRemarks.findIndex(
          (v) => v.fieldName === this.editRemarksData.fieldName
        ),
        1,
        {
          fieldName: this.editRemarksData.fieldName,
          fieldText: this.editRemarksData.fieldText,
          fieldVal: this.editRemarksValue,
        }
      );
      this.editRemarks = false;
      console.log(this.allRemarks);
    },

    editRemarksFunc(item) {
      this.editRemarks = true;
      this.editRemarksData = item;
      this.editRemarksValue = item.fieldVal;
    },

    removeRemarks(item) {
      this.allRemarks.splice(
        this.allRemarks.findIndex((v) => v.fieldName === item.fieldName),
        1
      );
      this.undoRemarkData.push(item);
    },

    addRemarkFunc(field, fieldText) {
      let fieldValue = document.getElementById(field).value;
      this.allRemarks.push({
        fieldName: field,
        fieldText: fieldText,
        fieldVal: fieldValue,
      });
    },

    loadRemarks(id) {
      this.axiosCall("/remarks/" + id + "/PDS", "GET").then((res) => {
        if (res.data) {
          this.remarksData = res.data;
        }
      });
    },

    openDialog(action) {
      if (action == "approve") {
        this.actionHeader = "APPROVE PDS";
        this.actionText = action;
        this.isApprove = true;
      } else {
        this.actionHeader = "RETURN PDS";
        this.actionText = action;
        this.isApprove = true;
        console.log(this.allRemarks);
      }
    },
    close() {
      this.dialog = false;
      this.eventHub.$emit("closeViewEmployeePDSDialog", false);
    },
    initialize() {
      this.dumpTab = { id: 1, name: "Personal Information" };
      this.tab = { id: 1, name: "Personal Information" };
      this.getUserTypes();
      this.getEmployeeTypes();
      this.getStatus();
      this.getCountry();
    },

    getSpecificPDS(id) {
      this.axiosCall("/user-details/getSpecificPDS/" + id, "GET").then(
        (res) => {
          if (res) {
            // console.log("PDS", res.data);
            this.tab = { id: 1, name: "Personal Information" };
            this.dumpTab = { id: 1, name: "Personal Information" };
            this.dialog = true;

            let data = res.data;

            this.formdata = data;
            this.formdata.is_dual_citizen =
              data.is_dual_citizen == 1 ? "Yes" : "No";
            this.formdata.isFilipino =
              data.citizenship == "Filipino" ? "Yes" : "No";
            this.formdata = data;
            if (data.family_background) {
              this.family_background = data.family_background;
            } else {
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

            this.children = data.children;
            this.educ_background = data.educ_background;
            this.cs_eligibility = data.cs_eligibility;
            this.work_exp = data.work_exp;
            this.voluntary_work = data.voluntary_work;
            this.learning_and_development = data.learning_and_development;
            // this.other_infos = data.other_infos;
            this.other_infosSpecialSkills = res.data.other_infos.specialSkill;
            this.other_infosNonAcad = res.data.other_infos.nonAcad;
            this.other_infosAssocMembership =
              res.data.other_infos.assocMembership;
            // console.log(data.personal_question_answer[0]);
            if (data.personal_question_answer.length > 0) {
              this.personal_question_answer._1a =
                data.personal_question_answer[0];
              this.personal_question_answer._1a.answer =
                data.personal_question_answer[0].answer == 1 ? "Yes" : "No";

              this.personal_question_answer._1b =
                data.personal_question_answer[1];
              this.personal_question_answer._1b.answer =
                data.personal_question_answer[1].answer == 1 ? "Yes" : "No";

              this.personal_question_answer._2a =
                data.personal_question_answer[2];
              this.personal_question_answer._2a.answer =
                data.personal_question_answer[2].answer == 1 ? "Yes" : "No";

              this.personal_question_answer._2b =
                data.personal_question_answer[3];
              this.personal_question_answer._2b.answer =
                data.personal_question_answer[3].answer == 1 ? "Yes" : "No";

              this.personal_question_answer._3a =
                data.personal_question_answer[4];
              this.personal_question_answer._3a.answer =
                data.personal_question_answer[4].answer == 1 ? "Yes" : "No";

              this.personal_question_answer._4a =
                data.personal_question_answer[5];
              this.personal_question_answer._4a.answer =
                data.personal_question_answer[5].answer == 1 ? "Yes" : "No";

              this.personal_question_answer._5a =
                data.personal_question_answer[6];
              this.personal_question_answer._5a.answer =
                data.personal_question_answer[6].answer == 1 ? "Yes" : "No";

              this.personal_question_answer._5b =
                data.personal_question_answer[7];
              this.personal_question_answer._5b.answer =
                data.personal_question_answer[7].answer == 1 ? "Yes" : "No";

              this.personal_question_answer._6a =
                data.personal_question_answer[8];
              this.personal_question_answer._6a.answer =
                data.personal_question_answer[8].answer == 1 ? "Yes" : "No";

              this.personal_question_answer._7a =
                data.personal_question_answer[9];
              this.personal_question_answer._7a.answer =
                data.personal_question_answer[9].answer == 1 ? "Yes" : "No";

              this.personal_question_answer._7b =
                data.personal_question_answer[10];
              this.personal_question_answer._7b.answer =
                data.personal_question_answer[10].answer == 1 ? "Yes" : "No";

              this.personal_question_answer._7c =
                data.personal_question_answer[11];
              this.personal_question_answer._7c.answer =
                data.personal_question_answer[11].answer == 1 ? "Yes" : "No";
            }
            // personal_question_answer: this.personal_question_answer,
            this.references = data.references;
            this.gov_issued_id.id = data.gov_issued_id
              ? data.gov_issued_id.id
              : null;
            this.gov_issued_id.gov_id = data.gov_issued_id
              ? data.gov_issued_id.gov_id
              : null;
            this.gov_issued_id.gov_id_no = data.gov_issued_id
              ? data.gov_issued_id.gov_id_no
              : null;
            this.splitDateAndPlace(data.gov_issued_id.date_issued);
            // this.gov_issued_id.date_issued = data.gov_issued_id
            //   ? data.gov_issued_id.date_issued
            //   : "N/A";
          }
        }
      );
    },

    splitDateAndPlace(str) {
      if (str) {
        const dump = str.split("/");
        let str1;
        let str2;
        str1 = dump[0] == null || dump[0] == "null" ? null : dump[0];
        str2 = dump[1] == null || dump[1] == "null" ? null : dump[1];
        if (str1 && str2) {
          this.gov_issued_id.date_issued = str1 + "/" + str2;
        } else if (str1 && !str2) {
          this.gov_issued_id.date_issued = str1;
        } else if (!str1 && str2) {
          this.gov_issued_id.date_issued = str2;
        } else if (!str1 && !str2) {
          this.gov_issued_id.date_issued = "N/A";
        }
      } else {
        this.gov_issued_id.date_issued = "N/A";
      }
    },

    changeTab(i) {
      this.tab = i;
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

    pushEducBg(data) {
      this.educ_background.push({
        level: data.level,
        grad_study_type: data.grad_study_type,
        school_name: data.school_name,
        educ_course: data.educ_course,
        educ_from: data.educ_from,
        educ_to: data.educ_to,
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

    pushCSElig(data) {
      this.cs_eligibility.push({
        eligibility_type: data.eligibility_type,
        rating: data.rating,
        conferment_date: data.conferment_date,
        conferment_place: data.conferment_place,
        license_num: data.license_num,
        validity: data.validity,
      });
    },

    addWorkExp() {
      this.workExp = { id: null };
      this.action = "Add";
    },

    editWorkExp(item) {
      this.workExp = { id: null };
      setTimeout(() => {
        this.action = "Update";
        this.workExp = item;
      }, 100);
    },

    pushWorkExp(data) {
      let datas = {
        date_from: data.date_from,
        date_to: data.date_to,
        position: data.position,
        company: data.company,
        month_salary: data.month_salary,
        pay_grade: data.pay_grade,
        appointment_status: data.appointment_status,
        gov_service: data.gov_service,
      };
      this.work_exp = this.prependData(datas, this.work_exp);
    },

    prependData(val, arr) {
      var dumpArr = arr.slice();
      dumpArr.unshift(val);
      return dumpArr;
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

    pushVolWork(data) {
      this.voluntary_work.push({
        date_from: data.date_from,
        date_to: data.date_to,
        org_name: data.org_name,
        num_hours: data.num_hours,
        position: data.num_hours,
      });
    },

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

    editLND(item) {
      this.lnd = { id: null };
      setTimeout(() => {
        this.action = "Update";
        this.lnd = item;
      }, 100);
    },

    pushLND(data) {
      this.learning_and_development.push({
        date_from: data.date_from,
        date_to: data.date_to,
        title: data.title,
        num_hours: data.num_hours,
        type: data.type,
        conducted_by: data.conducted_by,
      });
    },

    getUserTypes() {
      this.axiosCall("/user-type/getAllUsertype", "GET").then((res) => {
        if (res) {
          this.user_types = res.data;
        }
      });
    },

    getEmployeeTypes() {
      this.axiosCall("/employment-status", "GET").then((res) => {
        if (res) {
          this.emp_types = res.data;
        }
      });
    },

    getCountry() {
      this.axiosCall("/country", "GET").then((res) => {
        if (res) {
          this.countryList = res.data;
        }
      });
    },

    getStatus() {
      this.axiosCall("/status", "GET").then((res) => {
        if (res) {
          this.status = res.data;
        }
      });
    },

    approve() {
      const id = this.formdata.id;
      let data = {
        remarks: this.remarks,
      };

      this.axiosCall(
        "/user-details/updatePDSStatus/" + id + "/2",
        "PATCH",
        data
      ).then((res) => {
        if (res.data.status == 200) {
          this.isApprove = false;
          this.showRemarkField = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
          this.$refs.employee_detail_form.reset();
          // this.$emit("reloadTable");
          this.close();
        } else {
          this.isApprove = false;
          this.showRemarkField = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
        }
      });
    },
    pending() {
      const id = this.formdata.id;
      let data = {
        remarks: this.remarks,
        allRemarks: this.allRemarks,
      };
      this.axiosCall(
        "/user-details/updatePDSStatus/" + id + "/3",
        "PATCH",
        data
      ).then((res) => {
        if (res.data.status == 200) {
          this.isApprove = false;
          this.showRemarkField = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
          this.$refs.employee_detail_form.reset();
          // this.$emit("reloadTable");
          this.close();
        } else {
          this.isApprove = false;
          this.showRemarkField = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
        }
      });
      // if (this.remarks == null || this.allRemarks.length == 0) {
      //   this.fadeAwayMessage.show = true;
      //   this.fadeAwayMessage.type = "warning";
      //   this.fadeAwayMessage.header = "System Message";
      //   this.fadeAwayMessage.message = "Remarks is required.";
      // } else if (this.remarks == null || this.allRemarks.length > 0) {

      // }
    },

    confirmAdd() {
      if (this.$refs.employee_detail_form.validate()) {
        this.confirmDialog = true;
      } else {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header = "System Message!";
        this.fadeAwayMessage.message = "Please fill all required fields";
      }
    },

    addDetails() {
      this.confirmDialog = false;
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
        residential_city: this.formdata.residential_prov,
        residential_prov: this.formdata.residential_prov,
        permanent_zip: this.formdata.permanent_zip,
        permanent_house_no: this.formdata.permanent_house_no,
        permanent_street: this.formdata.permanent_street,
        permanent_subd: this.formdata.permanent_subd,
        permanent_brgy: this.formdata.permanent_brgy,
        permanent_city: this.formdata.permanent_city,
        permanent_prov: this.formdata.permanent_prov,
        family_background: {
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
        other_infos: this.other_infos,
        personal_question_answer: this.personal_question_answer,
        references: this.references,
        gov_issued_id: {
          gov_id: this.gov_issued_id.gov_id,
          gov_id_no: this.gov_issued_id.gov_id_no,
          date_issued: this.gov_issued_id.date_issued,
        },
      };

      this.axiosCall("/user-details/createPDS", "POST", data).then((res) => {
        if (res.data.status == 201) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
          this.$refs.employee_detail_form.reset();
          this.closeDialog();
        } else {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
        }
      });
    },

    updateDetails() {
      if (this.$refs.employee_detail_form.validate()) {
        this.confirmDialog = false;
        let data = {
          id: this.formdata.id,
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
          residential_city: this.formdata.residential_prov,
          residential_prov: this.formdata.residential_prov,
          permanent_zip: this.formdata.permanent_zip,
          permanent_house_no: this.formdata.permanent_house_no,
          permanent_street: this.formdata.permanent_street,
          permanent_subd: this.formdata.permanent_subd,
          permanent_brgy: this.formdata.permanent_brgy,
          permanent_city: this.formdata.permanent_city,
          permanent_prov: this.formdata.permanent_prov,
          family_background: {
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
          other_infos: this.other_infos,
          personal_question_answer: this.personal_question_answer,
          references: this.references,
          gov_issued_id: {
            id: this.gov_issued_id.id,
            gov_id: this.gov_issued_id.gov_id,
            gov_id_no: this.gov_issued_id.gov_id_no,
            date_issued: this.gov_issued_id.date_issued,
          },
        };
        this.axiosCall("/user-details/updatePDS", "POST", data).then((res) => {
          if (res.data.status == 200) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.closeDialog();
          } else {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
          }
        });
      } else {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header = "System Message!";
        this.fadeAwayMessage.message = "Please fill all required fields";
      }
    },
    getFilteredMethods(requesttype_id) {
      this.work_method_filtered = [];
      this.formdata.workMethodId = null;
      this.work_method.forEach((item) => {
        JSON.parse(item.requestTypeId).forEach((item2) => {
          if (item2 == requesttype_id) {
            this.work_method_filtered.push(item);
          }
        });
      });
    },
    getTechTags(techs) {
      this.tech_tags = [];
      this.technicians.forEach((item) => {
        techs.forEach((tech) => {
          if (tech == item.id) {
            this.tech_tags.push(item);
          }
        });
      });
    },
  },
};
</script>
<style scoped>
.bgGreen {
  background-color: rgb(1, 149, 1);
}

.bgRed {
  background-color: rgb(203, 19, 19);
}
</style>
