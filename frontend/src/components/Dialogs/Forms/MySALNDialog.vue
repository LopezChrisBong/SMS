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
      <v-card>
        <v-card-title dark class="dialog-header">
          {{ action }} SALN
          <v-spacer></v-spacer>
          <v-btn icon dark @click="closed()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-tabs
            v-model="activeTab"
            class="elevation-2 mb-n7 elevation-4 rounded-lg"
            color="#5a67da"
            centered
          >
            <v-tab
              v-for="tab in tabList"
              :key="tab.id"
              @click="changeTab(tab)"
              >{{ tab.name }}</v-tab
            >
          </v-tabs>
        </v-card-title>

        <v-card-text
          style="max-height: 900px; max-width:1500px; margin:auto"
          class="mt-4"
        >
          <!-- <v-row>
            <v-col cols="12" class="elevation-2 pa-0 mb-4"> -->

          <!-- </v-col>
          </v-row> -->
          <v-form ref="MySALNFormref" @submit.prevent>
            <v-row class="mt-4" v-if="tab == 1">
              <v-col cols="12">
                <center>
                  <div class="text-h5 ">
                    SWORN STATEMENT OF ASSETS, AND LIABILITIES AND NET WORTH
                  </div>

                  <div class="text-subtitle-2">as of Current date</div>
                  <div class="text-body-1">(Required by R.A. Nos. 6713)</div>
                  <div class="text-caption">
                    <i>
                      (<span class="font-weight-bold">Note:</span> Husband and
                      Wife who are both public officials or employees may file
                      the required statements jointly or separately.)</i
                    >
                  </div>
                </center>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  :rules="[formRules.required]"
                  color="#6DB249"
                  v-model="saln_for_year"
                  dense
                  label="SALN for the year"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <div class="mt-2 d-flex justify-space-around">
                  <v-checkbox
                    color="#6DB249"
                    :readonly="action == 'View'"
                    :value="1"
                    :rules="filing_type == null ? [formRules.required] : []"
                    :checked="filing_type == 1 ? true : false"
                    v-model="filing_type"
                    label="Joint Filing"
                  ></v-checkbox>
                  <v-checkbox
                    color="#6DB249"
                    :value="2"
                    :readonly="action == 'View'"
                    :rules="filing_type == null ? [formRules.required] : []"
                    :checked="filing_type == 2 ? true : false"
                    v-model="filing_type"
                    label="Separate Filing"
                  ></v-checkbox>
                  <v-checkbox
                    color="#6DB249"
                    :value="3"
                    :readonly="action == 'View'"
                    :rules="filing_type == null ? [formRules.required] : []"
                    :checked="filing_type == 3 ? true : false"
                    v-model="filing_type"
                    label="Not Applicable"
                  ></v-checkbox>
                </div>
              </v-col>

              <v-col cols="6" class="elevation-4 px-10">
                <v-row class="mt-2">
                  <v-col cols="4">DECLARANT</v-col>
                  <v-col cols="8 ">
                    <v-row>
                      <v-col cols="4"
                        ><v-text-field
                          dense
                          readonly
                          v-model="declarant_lname"
                          label="Family Name"
                        ></v-text-field
                      ></v-col>
                      <v-col cols="4"
                        ><v-text-field
                          dense
                          readonly
                          v-model="declarant_fname"
                          label="First Name"
                        ></v-text-field></v-col
                      ><v-col cols="4"
                        ><v-text-field
                          dense
                          readonly
                          v-model="declarant_mname"
                          label="Middle Initial"
                        ></v-text-field
                      ></v-col> </v-row
                  ></v-col>
                  <v-col cols="4">POSITION</v-col>
                  <v-col cols="8"
                    ><v-text-field
                      dense
                      readonly
                      v-model="declarant_position"
                    ></v-text-field
                  ></v-col>
                  <v-col cols="4">AGENCY/OFFICE</v-col>
                  <v-col cols="8"
                    ><v-text-field
                      dense
                      :readonly="action == 'View'"
                      :rules="[formRules.required]"
                      v-model="declarant_agency"
                    ></v-text-field
                  ></v-col>
                  <v-col cols="4">OFFICE ADDRESS</v-col>
                  <v-col cols="8"
                    ><v-text-field
                      dense
                      :readonly="action == 'View'"
                      :rules="[formRules.required]"
                      v-model="declarant_office_address"
                    ></v-text-field
                  ></v-col>
                </v-row>
              </v-col>
              <v-col cols="6" class="elevation-4  px-10">
                <v-row class="mt-2">
                  <v-col cols="4">Address</v-col>
                  <v-col cols="8"
                    ><v-text-field
                      dense
                      readonly
                      v-model="address"
                    ></v-text-field
                  ></v-col>
                </v-row>
              </v-col>
              <v-col cols="6" class="elevation-4 mt-2  px-10">
                <v-row class="mt-2">
                  <v-col cols="12" class="d-flex justify-space-around">
                    <v-checkbox
                      color="#6DB249"
                      :readonly="action == 'View'"
                      :value="1"
                      @change="changeHasSpouse()"
                      :checked="hasSpouse == 1 ? true : false"
                      v-model="hasSpouse"
                      label="Has Spouse?"
                    ></v-checkbox>
                    <v-checkbox
                      :readonly="action == 'View'"
                      :disabled="!hasSpouse"
                      @change="changedIsDeceased()"
                      color="#6DB249"
                      :checked="is_spouse_deceased == 1 ? true : false"
                      v-model="is_spouse_deceased"
                      label="Deceased?"
                    ></v-checkbox>
                    <v-checkbox
                      :readonly="action == 'View'"
                      :disabled="!hasSpouse"
                      color="#6DB249"
                      @change="changeSpouseInDnsc()"
                      :checked="is_spouse_in_dnsc == 1 ? true : false"
                      v-model="is_spouse_in_dnsc"
                      label="Is your spouse working in DNSC?"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="12" v-if="is_spouse_in_dnsc && hasSpouse">
                    <v-autocomplete
                      v-model="spouse_userID"
                      @change="getSpousePosition()"
                      :rules="is_spouse_in_dnsc ? [formRules.required] : []"
                      dense
                      :readonly="action == 'View'"
                      outlined
                      class="rounded-lg"
                      item-text="name"
                      item-value="id"
                      label="Spouse Name"
                      color="#93CB5B"
                      :items="usersList"
                    >
                    </v-autocomplete>
                  </v-col>
                  <v-col v-if="!is_spouse_in_dnsc" cols="4">SPOUSE</v-col>
                  <v-col v-if="!is_spouse_in_dnsc" cols="8 ">
                    <v-row>
                      <v-col cols="4"
                        ><v-text-field
                          :readonly="action == 'View'"
                          :disabled="!hasSpouse && !is_spouse_in_dnsc"
                          dense
                          :rules="
                            hasSpouse == 1 &&
                            is_spouse_in_dnsc &&
                            filing_type == 1
                              ? [formRules.required]
                              : []
                          "
                          v-model="spouse_lname"
                          label="Family Name"
                        ></v-text-field
                      ></v-col>
                      <v-col cols="4"
                        ><v-text-field
                          :readonly="action == 'View'"
                          :disabled="!hasSpouse && !is_spouse_in_dnsc"
                          :rules="
                            hasSpouse == 1 &&
                            is_spouse_in_dnsc &&
                            filing_type == 1
                              ? [formRules.required]
                              : []
                          "
                          dense
                          v-model="spouse_fname"
                          label="First Name"
                        ></v-text-field></v-col
                      ><v-col cols="4"
                        ><v-text-field
                          :readonly="action == 'View'"
                          :disabled="!hasSpouse && !is_spouse_in_dnsc"
                          :rules="
                            hasSpouse == 1 &&
                            is_spouse_in_dnsc &&
                            filing_type == 1
                              ? [formRules.required]
                              : []
                          "
                          dense
                          v-model="spouse_mname"
                          label="Middle Initial"
                        ></v-text-field
                      ></v-col> </v-row
                  ></v-col>
                  <v-col cols="4">POSITION</v-col>
                  <v-col cols="8"
                    ><v-text-field
                      :readonly="action == 'View'"
                      :disabled="
                        (!hasSpouse && !is_spouse_in_dnsc) || is_spouse_deceased
                      "
                      :rules="
                        hasSpouse == 1 &&
                        is_spouse_in_dnsc &&
                        filing_type == 1 &&
                        !is_spouse_deceased
                          ? [formRules.required]
                          : []
                      "
                      dense
                      v-model="spouse_position"
                    ></v-text-field
                  ></v-col>
                  <v-col cols="4">AGENCY/OFFICE</v-col>
                  <v-col cols="8"
                    ><v-text-field
                      :disabled="
                        (!hasSpouse && !is_spouse_in_dnsc) || is_spouse_deceased
                      "
                      :rules="
                        hasSpouse == 1 && is_spouse_in_dnsc && filing_type == 1
                          ? [formRules.required]
                          : []
                      "
                      dense
                      v-model="spouse_agency"
                    ></v-text-field
                  ></v-col>
                  <v-col cols="4">OFFICE ADDRESS</v-col>
                  <v-col cols="8"
                    ><v-text-field
                      :readonly="action == 'View'"
                      :disabled="
                        (!hasSpouse && !is_spouse_in_dnsc) || is_spouse_deceased
                      "
                      :rules="
                        hasSpouse == 1 &&
                        is_spouse_in_dnsc &&
                        filing_type == 1 &&
                        !is_spouse_deceased
                          ? [formRules.required]
                          : []
                      "
                      dense
                      v-model="spouse_office_address"
                    ></v-text-field
                  ></v-col>
                </v-row>
              </v-col>
              <v-col cols="12" class="mt-6">
                <center>
                  <div class="text-h5 ">
                    UNMARRIED CHILDREN BELOW EIGHTEEN (18) YRS OF AGE LIVING IN
                    DECLARANT’S HOUSEHOLD
                  </div>
                </center>
              </v-col>
              <v-col cols="12">
                <div v-if="action != 'View'" class="d-flex justify-end">
                  <v-btn color="#5a67da" class="white--text" @click="addChild()"
                    >Add</v-btn
                  >
                </div>
                <div class="mt-4">
                  <v-data-table
                    class="elevation-2"
                    :headers="headers"
                    :items="children"
                    :items-per-page="20"
                    hide-default-footer
                  >
                    <template v-slot:[`item.actions`]="{ item, index }">
                      <v-btn
                        v-if="action != 'View'"
                        x-small
                        outlined
                        class="mx-1"
                        color="gray"
                        @click="editChild(item, index)"
                      >
                        Edit
                      </v-btn>
                      <v-btn
                        v-if="action != 'View'"
                        x-small
                        class="white--text mx-1"
                        color="red"
                        @click="removeChild(item, index)"
                        ><v-icon size="14" light>mdi-pencil</v-icon
                        >Remove</v-btn
                      >
                    </template>
                  </v-data-table>
                </div>
              </v-col>
            </v-row>
            <v-row class="mt-4" v-if="tab == 2">
              <v-col cols="12">
                <center>
                  <div class="text-h5 ">
                    ASSETS, LIABILITIES AND NET WORTH
                  </div>

                  <div class="text-caption">
                    <i>
                      (Including those of the spouse and unmarried children
                      below eighteen (18) years of age living in declarant's
                      household)</i
                    >
                  </div>
                </center>
              </v-col>

              <v-col cols="12" class="elevation-2 rounded-lg">
                <div class="">
                  <div class="text-h5">Assets</div>
                  <div class="d-flex justify-space-between mb-2">
                    <div class="text-h6">A. Real Properties</div>
                    <v-btn
                      v-if="action != 'View'"
                      color="#5a67da"
                      class="white--text"
                      @click="addAssetA()"
                      >Add
                    </v-btn>
                  </div>

                  <div class="elevation-2">
                    <table id="table_assets">
                      <tr>
                        <td align="center" rowspan="2" class="th">
                          DESCRIPTION <br />
                          <span class="text-caption"
                            >(e.g. lot, house and lot, condominium and
                            improvements)</span
                          >
                        </td>
                        <td align="center" rowspan="2" class="th">
                          KIND <br />
                          <span class="text-caption"
                            >(e.g. residential, commercial, industrial,
                            agricultural and mixed use)</span
                          >
                        </td>
                        <td align="center" rowspan="2" class="th">
                          EXACT LOCATION
                        </td>
                        <td align="center" class="th">ASSESSED VALUE</td>
                        <td align="center" class="th">
                          CURRENT FAIR MARKET VALUE
                        </td>
                        <td align="center" colspan="2" class="th">
                          ACQUISITION
                        </td>
                        <td align="center" rowspan="2" class="th">
                          ACQUISITION COST
                        </td>
                        <td align="center" rowspan="2" class="th">
                          ACTION
                        </td>
                      </tr>
                      <tr>
                        <td align="center" colspan="2" class="th">
                          (as found in the Tax Declaration of Real Property
                        </td>
                        <td align="center" class="th">YEAR</td>
                        <td align="center" class="th">MODE</td>
                      </tr>
                      <tbody v-if="assetsA.length == 0">
                        <tr>
                          <td colspan="9" align="center">
                            <i class="text-caption">No data found</i>
                          </td>
                        </tr>
                      </tbody>
                      <tbody v-if="assetsA.length > 0">
                        <tr v-for="(item, i) in assetsA" :key="i">
                          <td
                            align="center"
                            width="15%"
                            class="pa-1 text-body-2"
                          >
                            {{ item.assetA_desc }}
                          </td>
                          <td
                            align="center"
                            width="10%"
                            class="pa-1 text-body-2"
                          >
                            {{ item.kind }}
                          </td>
                          <td
                            align="center"
                            width="20%"
                            class="pa-1 text-body-2"
                          >
                            {{ item.exact_loc }}
                          </td>
                          <td
                            align="center"
                            width="10%"
                            class="pa-1 text-body-2"
                          >
                            {{
                              isNaN(item.assessed_val)
                                ? item.assessed_val
                                : numberFormatter(item.assessed_val)
                            }}
                          </td>
                          <td
                            align="center"
                            width="10%"
                            class="pa-1 text-body-2"
                          >
                            {{
                              isNaN(item.current_market_val)
                                ? item.current_market_val
                                : numberFormatter(item.current_market_val)
                            }}
                          </td>
                          <td
                            align="center"
                            width="5%"
                            class="pa-1 text-body-2"
                          >
                            {{ item.acq_year }}
                          </td>
                          <td
                            align="center"
                            width="5%"
                            class="pa-1 text-body-2"
                          >
                            {{ item.acq_mode }}
                          </td>
                          <td
                            align="center"
                            width="10%"
                            class="pa-1 text-body-2"
                          >
                            {{ numberFormatter(item.acq_cost) }}
                          </td>
                          <td align="center" width="5%" class="pa-2">
                            <div class="d-flex justify-space-around">
                              <v-btn
                                v-if="action != 'View'"
                                color="gray"
                                outlined
                                class="mx-1"
                                x-small
                                @click="editAssetA(item, i)"
                              >
                                <v-icon size="14" light>mdi-pencil</v-icon
                                >Edit</v-btn
                              ><v-btn
                                v-if="action != 'View'"
                                x-small
                                color="red"
                                class="white--text mx-1"
                                @click="removeAssetA(item, i)"
                              >
                                <v-icon size="14" light>mdi-trash-can</v-icon
                                >Remove</v-btn
                              >
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td colspan="7" align="right" class=" pa-1">
                            <div class="text-subtitle-2 mr-4">Subtotal</div>
                          </td>
                          <td colspan="2" align="left" class=" pa-1">
                            <div class="ml-4">
                              {{ numberFormatter(getAssetASubTotal) }}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div class="d-flex justify-space-between mb-2 mt-6">
                    <div class="text-h6">B. Personal Properties</div>
                    <v-btn
                      v-if="action != 'View'"
                      color="#5a67da"
                      class="white--text"
                      @click="addAssetB()"
                      >Add
                    </v-btn>
                  </div>

                  <div class="elevation-2">
                    <table id="table_assets">
                      <tr>
                        <td align="center" width="35%" class="th pa-1">
                          DESCRIPTION
                        </td>
                        <td align="center" width="35%" class="th pa-1">
                          YEAR ACQUIRED
                        </td>
                        <td align="center" width="20%" class="th pa-1">
                          ACQUISITION COST/AMOUNT
                        </td>
                        <td align="center" width="10%" class="th pa-1">
                          ACTION
                        </td>
                      </tr>
                      <tbody v-if="assetsB.length == 0">
                        <tr>
                          <td colspan="4" align="center">
                            <i class="text-caption">No data found</i>
                          </td>
                        </tr>
                      </tbody>
                      <tbody v-if="assetsB.length > 0">
                        <tr v-for="(item, i) in assetsB" :key="i">
                          <td align="center" class="pa-1 text-body-2">
                            {{ item.assetB_desc }}
                          </td>
                          <td align="center" class="pa-1 text-body-2">
                            {{ item.year_acq }}
                          </td>
                          <td align="center" class="pa-1 text-body-2">
                            {{ numberFormatter(item.assetB_acq_cost) }}
                          </td>
                          <td align="center" class="pa-2">
                            <div class="d-flex justify-space-around">
                              <v-btn
                                v-if="action != 'View'"
                                class="mx-1"
                                color="gray"
                                x-small
                                @click="editAssetB(item, i)"
                              >
                                <v-icon size="14" light>mdi-pencil</v-icon
                                >Edit</v-btn
                              ><v-btn
                                v-if="action != 'View'"
                                x-small
                                color="red"
                                class="white--text mx-1"
                                @click="removeAssetB(item, i)"
                              >
                                <v-icon size="14" class="white--text" light
                                  >mdi-trash-can</v-icon
                                >Remove</v-btn
                              >
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td colspan="2" align="right" class=" pa-1">
                            <div class="text-subtitle-2 mr-4">Subtotal</div>
                          </td>
                          <td colspan="2" align="left" class=" pa-1">
                            <div class="ml-4">
                              {{ numberFormatter(getAssetBSubTotal) }}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <table class="mt-2">
                    <tr>
                      <td width="70%" class=" pa-2" align="right">
                        <div class="text-subtitle-2 mr-4">
                          Total Assets (a + b)
                        </div>
                      </td>
                      <td width="30%" align="left" class="pa-2">
                        <div class="ml-4">
                          {{
                            numberFormatter(
                              getAssetASubTotal + getAssetBSubTotal
                            )
                          }}
                        </div>
                      </td>
                    </tr>
                  </table>
                </div>
              </v-col>

              <v-col cols="12" class="elevation-2 mt-4 rounded-lg">
                <div class="">
                  <div class="text-h5">Liabilities</div>
                  <div class="d-flex justify-end mb-2 ">
                    <v-btn
                      v-if="action != 'View'"
                      color="#5a67da"
                      class="white--text"
                      @click="addLiabilities()"
                      >Add
                    </v-btn>
                  </div>

                  <div class="elevation-2">
                    <table id="table_assets">
                      <tr>
                        <td align="center" width="35%" class="th pa-1">
                          NATURE
                        </td>
                        <td align="center" width="35%" class="th  pa-1">
                          NAME OF CREDITORS
                        </td>
                        <td align="center" width="20%" class="th pa-1">
                          OUTSTANDING BALANCE
                        </td>
                        <td
                          align="center"
                          width="10
                        %"
                          class="th"
                        >
                          ACTION
                        </td>
                      </tr>
                      <tbody v-if="liabilities.length == 0">
                        <tr>
                          <td colspan="4" align="center">
                            <i class="text-caption">No data found</i>
                          </td>
                        </tr>
                      </tbody>
                      <tbody v-if="liabilities.length > 0">
                        <tr v-for="(item, i) in liabilities" :key="i">
                          <td align="center" class="pa-1 text-body-2">
                            {{ item.nature }}
                          </td>
                          <td align="center" class="pa-1 text-body-2">
                            {{ item.creditor_name }}
                          </td>
                          <td align="center" class="pa-1 text-body-2">
                            {{ numberFormatter(item.out_bal) }}
                          </td>
                          <td class="pa-2">
                            <div class="d-flex justify-space-around">
                              <v-btn
                                v-if="action != 'View'"
                                class="mx-1"
                                color="gray"
                                outlined
                                x-small
                                @click="editLiability(item, i)"
                              >
                                <v-icon size="14" light>mdi-pencil</v-icon
                                >Edit</v-btn
                              ><v-btn
                                v-if="action != 'View'"
                                x-small
                                color="red"
                                class="white--text mx-1"
                                @click="removeLiability(item, i)"
                                ><v-icon size="14" light>mdi-trash-can</v-icon
                                >Remove</v-btn
                              >
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td colspan="2" align="right">
                            <div class="text-subtitle-2 mr-4">Subtotal</div>
                          </td>
                          <td colspan="2" align="left">
                            <div class="ml-10">
                              {{ numberFormatter(getLiabilitySubTotal) }}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <table class="mt-2">
                    <tr>
                      <td width="70%" class=" pa-2" align="right">
                        <div class="text-subtitle-2 mr-4">
                          NET WORTH: Total Assets Less Total Liabilities
                        </div>
                      </td>
                      <td width="30%" align="left" class="pa-2">
                        <div class="ml-4">
                          {{
                            numberFormatter(
                              getAssetASubTotal +
                                getAssetBSubTotal -
                                getLiabilitySubTotal
                            )
                          }}
                        </div>
                      </td>
                    </tr>
                  </table>
                </div>
              </v-col>
            </v-row>

            <v-row class="mt-4" v-if="tab == 3">
              <v-col cols="12">
                <center>
                  <div class="text-h5 ">
                    BUSINESS INTERESTS AND FINANCIAL CONNECTIONS
                  </div>

                  <div class="text-caption">
                    <i>
                      (of Declarant / Declarant's spouse/ Unmarried Children
                      Below Eighteen (18) years of Age living in Declarant's
                      Household)</i
                    >
                  </div>
                </center>
              </v-col>
              <v-col cols="12">
                <div class="mt-2 d-flex justify-space-around">
                  <!-- <v-checkbox
                    readonly
                    color="#6DB249"
                    :value="1"
                    :checked="expertiseRating == 1 ? true : false"
                    v-model="expertiseRating"
                    label="I/We do not have any business interest and other financial connection."
                  ></v-checkbox> -->
                </div>
              </v-col>

              <v-col cols="12">
                <div class="mt-4">
                  <div class="d-flex justify-space-between mb-2 ">
                    <v-checkbox
                      :readonly="action == 'View'"
                      v-model="hasBIFC"
                      color="#6DB249"
                      label="I/We do not have any business interest and other financial connection."
                    ></v-checkbox>
                    <v-btn
                      v-if="action != 'View'"
                      :disabled="hasBIFC == 1"
                      color="#5a67da"
                      class="white--text"
                      @click="addBIFC()"
                      >Add
                    </v-btn>
                  </div>

                  <div class="elevation-2">
                    <table id="table_assets">
                      <tr>
                        <td align="center" width="25%" class="th">
                          NAME OF ENTITY/ BUSINESS ENTERPRISE
                        </td>
                        <td align="center" width="25%" class="th">
                          BUSINESS ADDRESS
                        </td>
                        <td align="center" width="20%" class="th">
                          NATURE OF BUSINESS INTEREST &/OR FINANCIAL CONNECTION
                        </td>
                        <td align="center" width="20%" class="th">
                          DATE OF ACQUISITION OF INTEREST OR CONNECTION
                        </td>
                        <td align="center" class="th" width="10%">ACTION</td>
                      </tr>
                      <tbody v-if="bifc.length == 0">
                        <tr>
                          <td colspan="5" align="center">
                            <i class="text-caption">No data found.</i>
                          </td>
                        </tr>
                      </tbody>
                      <tbody v-if="bifc.length > 0">
                        <tr v-for="(item, i) in bifc" :key="i">
                          <td align="center" class="pa-1 text-body-2">
                            {{ item.bifc_name }}
                          </td>
                          <td align="center" class="pa-1 text-body-2">
                            {{ item.bifc_address }}
                          </td>
                          <td align="center" class="pa-1 text-body-2">
                            {{ item.nature_of_business }}
                          </td>
                          <td align="center" class="pa-1 text-body-2">
                            {{ item.date_acq }}
                          </td>

                          <td class="pa-2">
                            <div class="d-flex justify-space-around">
                              <v-btn
                                v-if="action != 'View'"
                                color="gray"
                                outlined
                                x-small
                                class="mx-1"
                                @click="editBifc(item, i)"
                                ><v-icon size="14" light>mdi-pencil</v-icon
                                >Edit</v-btn
                              ><v-btn
                                v-if="action != 'View'"
                                x-small
                                class="white--text mx-1"
                                color="red"
                                @click="removeBIFC(item, i)"
                                ><v-icon size="14" light>mdi-trash-can</v-icon
                                >Remove</v-btn
                              >
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </v-col>
            </v-row>
            <v-row class="mt-4" v-if="tab == 4">
              <v-col cols="12">
                <center>
                  <div class="text-h5 ">
                    RELATIVES IN THE GOVERNMENT SERVICE
                  </div>

                  <div class="text-caption">
                    <i>
                      (Within the Fourth Degree of Consanguinity or Affinity.
                      Include also Bilas, Balae and Inso)
                    </i>
                  </div>
                </center>
              </v-col>
              <!-- <v-col cols="12">
                <div class="mt-2 d-flex justify-space-around">
                  <v-checkbox
                    readonly
                    color="#6DB249"
                    :value="1"
                    :checked="expertiseRating == 1 ? true : false"
                    v-model="expertiseRating"
                    label="I/We do not have any business interest and other financial connection."
                  ></v-checkbox>
                </div>
              </v-col> -->

              <v-col cols="12">
                <div class="mt-4">
                  <div class="d-flex justify-space-between mb-2 ">
                    <v-checkbox
                      :readonly="action == 'View'"
                      color="#6DB249"
                      v-model="hasRelativeInGov"
                      label="I/We do not know of any relative/s in the government service"
                    ></v-checkbox>
                    <v-btn
                      v-if="action != 'View'"
                      :disabled="hasRelativeInGov == 1"
                      color="#5a67da"
                      class="white--text"
                      @click="addRelativeInGov()"
                      >Add
                    </v-btn>
                  </div>

                  <div class="elevation-2">
                    <table id="table_assets">
                      <tr>
                        <td align="center" width="25%" class="th">
                          NAME OF RELATIVE
                        </td>
                        <td align="center" width="25%" class="th">
                          RELATIONSHIP
                        </td>
                        <td align="center" width="20%" class="th">
                          POSITION
                        </td>
                        <td align="center" width="20%" class="th">
                          NAME OF AGENCY/OFFICE AND ADDRESS
                        </td>
                        <td align="center" width="10%" class="th">
                          ACTION
                        </td>
                      </tr>
                      <tbody v-if="relatives_in_gov.length == 0">
                        <tr>
                          <td colspan="5" align="center">
                            <i class="text-caption">No data found.</i>
                          </td>
                        </tr>
                      </tbody>
                      <tbody v-if="relatives_in_gov.length > 0">
                        <tr v-for="(item, i) in relatives_in_gov" :key="i">
                          <td align="center" class="pa-1 text-body-2">
                            {{ item.relative_name }}
                          </td>
                          <td align="center" class="pa-1 text-body-2">
                            {{ item.relative_relationship }}
                          </td>
                          <td align="center" class="pa-1 text-body-2">
                            {{ item.relative_position }}
                          </td>
                          <td align="center" class="pa-1 text-body-2">
                            {{ item.relative_name_of_agency_and_address }}
                          </td>
                          <td align="center" class="pa-2">
                            <div class="d-flex justify-space-around">
                              <v-btn
                                v-if="action != 'View'"
                                color="gray"
                                class="mx-1"
                                outlined
                                x-small
                                @click="editRelativeInGov(item, i)"
                                ><v-icon size="14" light>mdi-pencil</v-icon
                                >Edit</v-btn
                              ><v-btn
                                v-if="action != 'View'"
                                x-small
                                class="white--text mx-1"
                                color="red"
                                @click="removeRelativesInGov(item, i)"
                                ><v-icon size="14" light>mdi-pencil</v-icon
                                >Remove</v-btn
                              >
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </v-col>
              <v-col cols="12">
                <p class="text-caption">
                  I hereby certify that these are true statements of my assets ,
                  liabilities, networth, business interest, and financial
                  connections, including those of my spouse and unmarried
                  children below eighteen (18) years of age living in my
                  household, and that to the best of my knowledge, the
                  above-enumerated are names of my relatives in the government
                  within the fourth civil degree of consanguinity or of
                  affinity.
                </p>
                <p class="text-caption">
                  I hereby authorize the Ombudsman or his/her duly authorized
                  representatives to obtain and secure from all appropriate
                  government agencies, including the Bureau of Internal Revenue
                  such documents that may show my assets, liabilities, net
                  worth, business interests and financial connections, to
                  include those of my spouse and unmarried children below 18
                  years of age living with me in my household covering previous
                  years to include the year I first assumed office in
                  government.
                </p>
              </v-col>

              <v-col cols="6">
                <v-row>
                  <v-col cols="12"
                    ><div class="text-h5">Declarant</div>
                    <v-divider></v-divider
                  ></v-col>

                  <v-col cols="6">Government Issued ID:</v-col>
                  <v-col cols="6"
                    ><v-text-field
                      dense
                      :readonly="action == 'View'"
                      v-model="declarant_gov_issued_id"
                      :rules="[formRules.required]"
                    ></v-text-field
                  ></v-col>
                  <v-col cols="6">ID Number:</v-col>
                  <v-col cols="6"
                    ><v-text-field
                      dense
                      :readonly="action == 'View'"
                      v-model="declarant_id_no"
                      :rules="[formRules.required]"
                    ></v-text-field
                  ></v-col>
                  <v-col cols="12" class="py-0"
                    ><v-checkbox
                      @change="changeNoDateIssued('declarant')"
                      v-model="declarant_id_no_date_issued"
                      :checked="declarant_id_no_date_issued == 1 ? true : false"
                      class="my-1 py-1 text-caption"
                      hide-details="true"
                      label="No Date of Issuance on ID?"
                    >
                      <!-- <template v-slot:label>
                        <span class="text-caption">No date issued on id?</span>
                      </template> -->
                    </v-checkbox></v-col
                  >
                  <v-col cols="6" v-if="!declarant_id_no_date_issued"
                    >Date Issued:</v-col
                  >
                  <v-col cols="6" v-if="!declarant_id_no_date_issued"
                    ><v-menu
                      ref="declarantIDDateIssuedRef"
                      :close-on-content-click="false"
                      :return-value.sync="declarant_id_date_issued"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          color="#6DB249"
                          dense
                          v-model="declarant_id_date_issued"
                          :rules="[formRules.required]"
                          readonly
                          chips
                          small-chips
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="declarant_id_date_issued"
                        no-title
                        scrollable
                        color="#6DB249"
                      >
                        <v-spacer></v-spacer>

                        <v-btn
                          v-if="action != 'View'"
                          text
                          color="#6DB249"
                          @click="
                            $refs.declarantIDDateIssuedRef.save(
                              declarant_id_date_issued
                            )
                          "
                        >
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="6">
                <v-row>
                  <v-col cols="12"
                    ><div class="text-h5">Spouse</div>
                    <v-divider></v-divider
                  ></v-col>

                  <v-col cols="6">Government Issued ID:</v-col>
                  <v-col cols="6"
                    ><v-text-field
                      :readonly="action == 'View'"
                      dense
                      :disabled="
                        hasSpouse == 0 ||
                          hasSpouse == null ||
                          is_spouse_deceased
                      "
                      v-model="spouse_gov_issued_id"
                      :rules="
                        filing_type == 1 &&
                        hasSpouse == 1 &&
                        !is_spouse_deceased
                          ? [formRules.required]
                          : []
                      "
                    ></v-text-field
                  ></v-col>
                  <v-col cols="6">ID Number:</v-col>
                  <v-col cols="6"
                    ><v-text-field
                      :readonly="action == 'View'"
                      dense
                      :disabled="
                        hasSpouse == 0 ||
                          hasSpouse == null ||
                          is_spouse_deceased
                      "
                      v-model="spouse_id_no"
                      :rules="
                        filing_type == 1 &&
                        hasSpouse == 1 &&
                        !is_spouse_deceased
                          ? [formRules.required]
                          : []
                      "
                    ></v-text-field
                  ></v-col>
                  <v-col cols="12" class="py-0"
                    ><v-checkbox
                      :disabled="
                        hasSpouse == 0 ||
                          hasSpouse == null ||
                          is_spouse_deceased
                      "
                      v-model="spouse_id_no_date_issued"
                      @change="changeNoDateIssued('spouse')"
                      :checked="spouse_id_no_date_issued == 1 ? true : false"
                      class="my-1 py-1"
                      hide-details="true"
                      label="No Date of Issuance on ID?"
                    ></v-checkbox
                  ></v-col>
                  <v-col cols="6" v-if="!spouse_id_no_date_issued">
                    Date Issued:</v-col
                  >
                  <v-col cols="6" v-if="!spouse_id_no_date_issued">
                    <v-menu
                      ref="spouseIDDateIssuedRef"
                      :close-on-content-click="false"
                      :return-value.sync="spouse_id_date_issued"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          color="#6DB249"
                          dense
                          readonly
                          :disabled="
                            hasSpouse == 0 ||
                              hasSpouse == null ||
                              is_spouse_deceased
                          "
                          v-model="spouse_id_date_issued"
                          :rules="
                            filing_type == 1 &&
                            hasSpouse == 1 &&
                            !is_spouse_deceased
                              ? [formRules.required]
                              : []
                          "
                          chips
                          small-chips
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="spouse_id_date_issued"
                        no-title
                        scrollable
                        :readonly="action == 'View'"
                        color="#6DB249"
                      >
                        <v-spacer></v-spacer>

                        <v-btn
                          v-if="action != 'View'"
                          text
                          color="#6DB249"
                          @click="
                            $refs.spouseIDDateIssuedRef.save(
                              spouse_id_date_issued
                            )
                          "
                        >
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>

        <v-card-actions class="pa-5">
          <v-fab-transition v-if="action != 'Add'">
            <v-menu top>
              <template v-slot:activator="{ on }">
                <v-btn color="#5a67da" left outlined v-on="on">
                  Remarks
                </v-btn>
              </template>

              <v-card
                class="mx-auto"
                width="600"
                max-width="600"
                elevation-4
                max-height="600"
              >
                <v-card-title class="dialog-header  white--text">
                  <span class="text-h6">Remarks</span>
                </v-card-title>
                <v-card-text class="py-0" style="background-color:white">
                  <v-timeline dense v-if="remarksData.length > 0">
                    <v-timeline-item
                      v-for="item in remarksData"
                      :key="item.id"
                      small
                      color="#5a67da"
                      icon="mdi-comment-processing-outline"
                      fill-dot
                    >
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
                      small
                      color="#5a67da"
                      icon="mdi-comment-processing-outline"
                      fill-dot
                    >
                      <v-alert :value="true">
                        <div class="text-body-1">
                          No remarks found.
                        </div>
                      </v-alert>
                    </v-timeline-item>
                  </v-timeline>
                </v-card-text>
              </v-card>
            </v-menu>
          </v-fab-transition>
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="closed()">
            <v-icon>mdi-close-circle-outline</v-icon>
            Close
          </v-btn>
          <v-btn
            v-if="action == 'Add'"
            color="#5a67da"
            class="white--text"
            @click="saveSALN()"
          >
            <v-icon>mdi-check-circle</v-icon>
            Save
          </v-btn>

          <v-btn
            v-if="action == 'Update'"
            color="#5a67da"
            class="white--text"
            @click="update()"
          >
            <v-icon>mdi-check-circle</v-icon>
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- child dialog -->
    <v-dialog
      v-model="addChildDialog"
      eager
      scrollable
      persistent
      max-width="500px"
      transition="dialog-bottom-transition"
    >
      <v-form ref="addChildFormref" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>{{ internal_action }} Child</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="addChildDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 800px" class="my-4">
            <v-row>
              <v-col class="mt-2" cols="12">
                <v-text-field
                  v-model="childName"
                  :rules="[formRules.required]"
                  dense
                  outlined
                  class="rounded-lg"
                  label="Name"
                  color="#93CB5B"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-menu
                  ref="childBdateRef"
                  :close-on-content-click="false"
                  :return-value.sync="childBdate"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      outlined
                      color="#6DB249"
                      dense
                      v-model="childBdate"
                      :rules="[formRules.required]"
                      chips
                      small-chips
                      label="Birth date"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    @change="calculateChildAge()"
                    v-model="childBdate"
                    no-title
                    scrollable
                    color="#6DB249"
                  >
                    <v-spacer></v-spacer>

                    <v-btn
                      text
                      color="#6DB249"
                      @click="$refs.childBdateRef.save(childBdate)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="childAge"
                  outlined
                  dense
                  readonly
                  label="Age"
                  color="#93CB5B"
                  rows="2"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions class="pa-5">
            <v-spacer></v-spacer>
            <v-btn color="red" outlined @click="addChildDialog = false">
              Close
            </v-btn>
            <v-btn
              v-if="internal_action == 'Add'"
              color="#5a67da"
              class="white--text"
              @click="saveChild()"
            >
              Add
            </v-btn>
            <v-btn
              v-if="internal_action == 'Update'"
              color="#5a67da"
              class="white--text"
              @click="updateChild()"
            >
              Update
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <!-- assets A -->
    <v-dialog
      v-model="addAssetsADialog"
      eager
      scrollable
      persistent
      max-width="800px"
      transition="dialog-bottom-transition"
    >
      <v-form ref="addAssetAFormref" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>{{ internal_action }} Assets A.</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="addAssetsADialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 800px" class="my-4">
            <v-row>
              <v-col class="mt-2" cols="12">
                <v-text-field
                  v-model="assetA_desc"
                  :rules="[formRules.required]"
                  dense
                  outlined
                  class="rounded-lg"
                  label="Description"
                  color="#93CB5B"
                >
                </v-text-field>
              </v-col>
              <v-col class="mt-2" cols="12">
                <v-text-field
                  v-model="kind"
                  :rules="[formRules.required]"
                  dense
                  outlined
                  class="rounded-lg"
                  label="Kind"
                  color="#93CB5B"
                >
                </v-text-field>
              </v-col>
              <v-col class="mt-2" cols="12">
                <v-text-field
                  v-model="exact_loc"
                  :rules="[formRules.required]"
                  dense
                  outlined
                  class="rounded-lg"
                  label="Exact Location"
                  color="#93CB5B"
                >
                </v-text-field>
              </v-col>
              <v-col class="mt-2" cols="12">
                <v-text-field
                  v-model="assessed_val"
                  :rules="[formRules.required]"
                  dense
                  outlined
                  hint="Write N/A if field Not Applicable"
                  class="rounded-lg"
                  label="Asssessed Value"
                  color="#93CB5B"
                >
                </v-text-field>
              </v-col>
              <v-col class="mt-2" cols="12">
                <v-text-field
                  v-model="current_market_val"
                  :rules="[formRules.required]"
                  hint="Write N/A if field Not Applicable"
                  dense
                  outlined
                  class="rounded-lg"
                  label="Current Fair Market Value"
                  color="#93CB5B"
                >
                </v-text-field>
              </v-col>
              <v-col class="mt-2" cols="12">
                <v-text-field
                  v-model="acq_year"
                  :rules="[formRules.required, formRules.isValidYear]"
                  dense
                  outlined
                  class="rounded-lg"
                  label="Acquisition Year"
                  color="#93CB5B"
                >
                </v-text-field>
              </v-col>
              <v-col class="mt-2" cols="12">
                <v-text-field
                  v-model="acq_mode"
                  :rules="[formRules.required]"
                  dense
                  outlined
                  class="rounded-lg"
                  label="Acquisition Mode"
                  color="#93CB5B"
                >
                </v-text-field>
              </v-col>

              <v-col class="mt-2" cols="12">
                <v-text-field
                  v-model="acq_cost"
                  :rules="[formRules.required, formRules.numberRequired]"
                  dense
                  outlined
                  class="rounded-lg"
                  label="Acquisition Cost"
                  color="#93CB5B"
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions class="pa-5">
            <v-spacer></v-spacer>
            <v-btn color="red" outlined @click="addAssetsADialog = false">
              Close
            </v-btn>
            <v-btn
              v-if="internal_action == 'Add'"
              color="#5a67da"
              class="white--text"
              @click="saveAssetA()"
            >
              Add
            </v-btn>
            <v-btn
              v-if="internal_action == 'Update'"
              color="#5a67da"
              class="white--text"
              @click="updateAssetA()"
            >
              Update
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <!-- assets B -->
    <v-dialog
      v-model="addAssetsBDialog"
      eager
      scrollable
      persistent
      max-width="800px"
      transition="dialog-bottom-transition"
    >
      <v-form ref="addAssetBFormref" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>{{ internal_action }} Asset B.</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="addAssetsBDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 800px" class="my-4">
            <v-row>
              <v-col class="mt-2" cols="12">
                <v-text-field
                  v-model="assetB_desc"
                  :rules="[formRules.required]"
                  dense
                  outlined
                  class="rounded-lg"
                  label="Description"
                  color="#93CB5B"
                >
                </v-text-field>
              </v-col>
              <v-col class="mt-2" cols="12">
                <v-text-field
                  v-model="year_acq"
                  :rules="[formRules.required]"
                  dense
                  outlined
                  class="rounded-lg"
                  label="Year Acquired"
                  color="#93CB5B"
                >
                </v-text-field>
              </v-col>
              <v-col class="mt-2" cols="12">
                <v-text-field
                  v-model="assetB_acq_cost"
                  :rules="[formRules.required, formRules.numberRequired]"
                  dense
                  outlined
                  class="rounded-lg"
                  label="Acquisition Cost"
                  color="#93CB5B"
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions class="pa-5">
            <v-spacer></v-spacer>
            <v-btn color="red" outlined @click="addAssetsBDialog = false">
              Close
            </v-btn>
            <v-btn
              v-if="internal_action == 'Add'"
              color="#5a67da"
              class="white--text"
              @click="saveAssetB()"
            >
              Add
            </v-btn>
            <v-btn
              v-if="internal_action == 'Update'"
              color="#5a67da"
              class="white--text"
              @click="updateAssetB()"
            >
              Update
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <!-- assets Liabilities -->
    <v-dialog
      v-model="addliabilitiesDialog"
      eager
      scrollable
      persistent
      max-width="800px"
      transition="dialog-bottom-transition"
    >
      <v-form ref="addLiabilityFormref" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>{{ internal_action }} Liabilities</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="addliabilitiesDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 800px" class="my-4">
            <v-row>
              <v-col class="mt-2" cols="12">
                <v-text-field
                  v-model="nature"
                  :rules="[formRules.required]"
                  dense
                  outlined
                  class="rounded-lg"
                  label="Nature"
                  color="#93CB5B"
                >
                </v-text-field>
              </v-col>
              <v-col class="mt-2" cols="12">
                <v-text-field
                  v-model="creditor_name"
                  :rules="[formRules.required]"
                  dense
                  outlined
                  class="rounded-lg"
                  label="Name of Creditor"
                  color="#93CB5B"
                >
                </v-text-field>
              </v-col>
              <v-col class="mt-2" cols="12">
                <v-text-field
                  v-model="out_bal"
                  :rules="[formRules.required]"
                  dense
                  outlined
                  class="rounded-lg"
                  label="Outstanding Balance"
                  color="#93CB5B"
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions class="pa-5">
            <v-spacer></v-spacer>
            <v-btn color="red" outlined @click="addliabilitiesDialog = false">
              Close
            </v-btn>
            <v-btn
              v-if="internal_action == 'Add'"
              color="#5a67da"
              class="white--text"
              @click="saveLiabilities()"
            >
              Add
            </v-btn>
            <v-btn
              v-if="internal_action == 'Update'"
              color="#5a67da"
              class="white--text"
              @click="updateLiability()"
            >
              Update
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <!-- BIFC -->
    <v-dialog
      v-model="addBIFCDialog"
      eager
      scrollable
      persistent
      max-width="800px"
      transition="dialog-bottom-transition"
    >
      <v-form ref="addBIFCFormref" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>{{ internal_action }} BIFC</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="addBIFCDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 800px" class="my-4">
            <v-row>
              <v-col class="mt-2" cols="12">
                <v-text-field
                  v-model="bifc_name"
                  :rules="[formRules.required]"
                  dense
                  outlined
                  class="rounded-lg"
                  label="Name of Entity / Business Enterprise"
                  color="#93CB5B"
                >
                </v-text-field>
              </v-col>
              <v-col class="mt-2" cols="12">
                <v-text-field
                  v-model="bifc_address"
                  :rules="[formRules.required]"
                  dense
                  outlined
                  class="rounded-lg"
                  label="Business Address"
                  color="#93CB5B"
                >
                </v-text-field>
              </v-col>
              <v-col class="mt-2" cols="12">
                <v-text-field
                  v-model="nature_of_business"
                  :rules="[formRules.required]"
                  dense
                  outlined
                  class="rounded-lg"
                  label="NATURE OF BUSINESS INTEREST &/OR FINANCIAL CONNECTION"
                  color="#93CB5B"
                >
                </v-text-field>
              </v-col>

              <v-col cols="12">
                <v-menu
                  ref="bifcDateAcqRef"
                  :close-on-content-click="false"
                  :return-value.sync="date_acq"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      outlined
                      color="#6DB249"
                      dense
                      v-model="date_acq"
                      :rules="[formRules.required]"
                      chips
                      small-chips
                      label="DATE OF ACQUISITION OF INTEREST OR CONNECTION"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="date_acq"
                    no-title
                    scrollable
                    color="#6DB249"
                  >
                    <v-spacer></v-spacer>

                    <v-btn
                      text
                      color="#6DB249"
                      @click="$refs.bifcDateAcqRef.save(date_acq)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions class="pa-5">
            <v-spacer></v-spacer>
            <v-btn color="red" outlined @click="addBIFCDialog = false">
              Close
            </v-btn>
            <v-btn
              v-if="internal_action == 'Add'"
              color="#5a67da"
              class="white--text"
              @click="saveBIFC()"
            >
              Add
            </v-btn>
            <v-btn
              v-if="internal_action == 'Update'"
              color="#5a67da"
              class="white--text"
              @click="updateBifc()"
            >
              Update
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <!-- Relatives in Gov -->
    <v-dialog
      v-model="addRelativeInGoveDialog"
      eager
      scrollable
      persistent
      max-width="800px"
      transition="dialog-bottom-transition"
    >
      <v-form ref="addRelativeInGovFormref" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>{{ internal_action }} Relative In Government</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="addRelativeInGoveDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 800px" class="my-4">
            <v-row>
              <v-col class="mt-2" cols="12">
                <v-text-field
                  v-model="relative_name"
                  :rules="[formRules.required]"
                  dense
                  outlined
                  class="rounded-lg"
                  label="Name of Relative"
                  color="#93CB5B"
                >
                </v-text-field>
              </v-col>
              <v-col class="mt-2" cols="12">
                <v-text-field
                  v-model="relative_relationship"
                  :rules="[formRules.required]"
                  dense
                  outlined
                  class="rounded-lg"
                  label="Relationship"
                  color="#93CB5B"
                >
                </v-text-field>
              </v-col>
              <v-col class="mt-2" cols="12">
                <v-text-field
                  v-model="relative_position"
                  :rules="[formRules.required]"
                  dense
                  outlined
                  class="rounded-lg"
                  label="Position"
                  color="#93CB5B"
                >
                </v-text-field>
              </v-col>
              <v-col class="mt-2" cols="12">
                <v-text-field
                  v-model="relative_name_of_agency_and_address"
                  :rules="[formRules.required]"
                  dense
                  outlined
                  class="rounded-lg"
                  label="Name of Agency/Office and Address"
                  color="#93CB5B"
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions class="pa-5">
            <v-spacer></v-spacer>
            <v-btn
              color="red"
              outlined
              @click="addRelativeInGoveDialog = false"
            >
              Close
            </v-btn>
            <v-btn
              v-if="internal_action == 'Add'"
              color="#5a67da"
              class="white--text"
              @click="saveRelativeInGov()"
            >
              Add
            </v-btn>
            <v-btn
              v-if="internal_action == 'Update'"
              color="#5a67da"
              class="white--text"
              @click="updateRelativeInGov()"
            >
              Update
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <!-- confirmation dialog -->
    <v-dialog v-model="confirmDialog" persistent max-width="290">
      <v-card color="white">
        <div class="pa-4 #3a3b3a--text">
          <div class="text-overline mb-1">WARNING!</div>
          <div class="text-body-1 mb-1">
            <p style="text-align: justify">
              <v-icon class="mt-n2" color="white">mdi-alert</v-icon> &nbsp; Are
              you sure you want to remove this and proceed?
            </p>
          </div>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="confirmDialog = false">
            Close
          </v-btn>
          <v-btn color="green" class="white--text" @click="proceedAction()">
            Confirm
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
      id: null,
      is_spouse_in_dnsc: null,
      is_spouse_deceased: null,
      usersList: [],
      spouse_userID: null,
      filing_type: null,
      saln_for_year: null,
      internal_action: null,
      confirmDialog: false,
      arrToUpdate: null,
      indexToRemove: null,
      indexToUpdate: null,
      itemData: null,
      headers: [
        {
          text: "Name",
          value: "name",
          align: "start",
        },
        {
          text: "Date of Birth",
          value: "bdate",
          align: "start",
        },
        {
          text: "Age",
          value: "age",
          align: "start",
        },

        {
          text: "Actions",
          value: "actions",
          align: "center",
          sortable: false,
          width: 400,
        },
      ],

      assets_headers_B: [
        {
          text: "Description",
          value: "name",
          align: "start",
        },
        {
          text: "Year Acquired",
          value: "bdate",
          align: "start",
        },
        {
          text: "Acquisition Cost/Amount",
          value: "age",
          align: "start",
        },

        {
          text: "Actions",
          value: "actions",
          align: "center",
          sortable: false,
          width: 400,
        },
      ],
      activeTab: { id: 1, name: "Personal Data" },
      tab: 1,
      tabList: [
        { id: 1, name: "Personal Data" },
        { id: 2, name: "Assets, Liabilities and Net Worth" },
        { id: 3, name: "BUSINESS INTERESTS AND FINANCIAL CONNECTIONS" },
        { id: 4, name: "RELATIVES IN THE GOVERNMENT SERVICE" },
      ],

      declarant_fname: null,
      declarant_mname: null,
      declarant_lname: null,
      // declarant_suffix: null,
      declarant_position: null,
      declarant_agency: null,
      declarant_office_address: null,
      spouse_fname: null,
      spouse_lname: null,
      spouse_mname: null,
      spouse_position: null,
      spouse_agency: null,
      spouse_office_address: null,
      hasSpouse: false,
      address: null,
      children: [],
      assetsA: [],
      assetsB: [],
      liabilities: [],
      bifc: [],
      relatives_in_gov: [],

      declarant_gov_issued_id: null,
      declarant_id_no: null,
      declarant_id_date_issued: null,
      declarant_id_no_date_issued: null,

      spouse_gov_issued_id: null,
      spouse_id_no: null,
      spouse_id_date_issued: null,
      spouse_id_no_date_issued: null,

      addChildDialog: false,
      childName: null,
      childBdate: null,
      childAge: null,
      removedChild: [],

      addAssetsADialog: false,
      assetA_desc: null,
      kind: null,
      exact_loc: null,
      assessed_val: null,
      current_market_val: null,
      acq_year: null,
      acq_mode: null,
      acq_cost: null,
      removedAssetA: [],

      addAssetsBDialog: false,
      assetB_desc: null,
      year_acq: null,
      assetB_acq_cost: null,
      removedAssetB: [],

      addliabilitiesDialog: false,
      nature: null,
      creditor_name: null,
      out_bal: null,
      removedLiabilities: [],

      hasBIFC: null,
      addBIFCDialog: false,
      bifc_name: null,
      bifc_address: null,
      nature_of_business: null,
      date_acq: null,
      removedBIFC: [],

      hasRelativeInGov: null,
      addRelativeInGoveDialog: false,
      relative_name: null,
      relative_relationship: null,
      relative_position: null,
      relative_name_of_agency_and_address: null,
      removedRelativeInGov: [],

      remarksData: [],

      fadeAwayMessage: {
        show: false,
        type: "success",
        header: "Successfully Added!",
        message: "",
        top: 10,
      },
    };
  },
  computed: {
    getAssetASubTotal() {
      var st = 0;
      if (this.assetsA.length > 0) {
        for (let i = 0; i < this.assetsA.length; i++) {
          let el = this.assetsA[i];
          st += parseFloat(el.acq_cost);
        }
      }
      return st;
    },
    getAssetBSubTotal() {
      var st = 0;
      if (this.assetsB.length > 0) {
        for (let i = 0; i < this.assetsB.length; i++) {
          let el = this.assetsB[i];
          st += parseFloat(el.assetB_acq_cost);
        }
      }
      return st;
    },
    getLiabilitySubTotal() {
      var st = 0;
      if (this.liabilities.length > 0) {
        for (let i = 0; i < this.liabilities.length; i++) {
          let el = this.liabilities[i];
          st += parseFloat(el.out_bal);
        }
      }
      return st;
    },
  },

  watch: {
    data: {
      handler() {
        this.dialog = true;
        this.loadRemarks(this.data.id);
      },
      deep: true,
    },
    action: {
      handler() {
        this.removedAssetA = [];
        this.removedAssetB = [];
        this.removedChild = [];
        this.removedLiabilities = [];
        this.removedBIFC = [];
        this.removedRelativeInGov = [];

        this.getUsers();
        this.getDeclarantData();
        let data = this.data;

        if (this.action == "Add") {
          this.activeTab = { id: 1, name: "Personal Data" };
          this.tab = 1;
          this.getPreviousSALN();
        } else {
          if (data.id) {
            this.id = data.id;
            this.saln_for_year = data.saln_for_year;
            this.is_spouse_deceased = data.is_spouse_deceased;
            this.filing_type = data.filing_type;
            this.declarant_agency = data.agency;
            this.declarant_office_address = data.office_address;
            this.spouse_userID = data.spouse_userID
              ? data.spouse_userID.toString()
              : null;
            this.is_spouse_in_dnsc = data.is_spouse_in_dnsc;
            this.hasBIFC = data.hasBIFC;
            this.hasRelativeInGov = data.hasRelativeInGov;
            if (data.is_spouse_in_dnsc) {
              this.loadSpouseData(data.spouse_userID);
            } else {
              this.spouse_fname = data.spouse_fname;
              this.spouse_lname = data.spouse_lname;
              this.spouse_mname = data.spouse_mname;
              this.spouse_position = data.spouse_position;
              this.spouse_agency = data.spouse_agency;
              this.spouse_office_address = data.spouse_office_address;
            }

            this.hasSpouse = data.has_spouse;
            this.children = data.children1;
            this.assetsA = data.assetsA1;
            this.assetsB = data.assetsB1;
            this.liabilities = data.liabilities1;
            this.bifc = data.bifc1;
            this.relatives_in_gov = data.relatives_in_gov1;
            this.declarant_gov_issued_id = data.declarant_gov_issued_id;
            this.declarant_id_no = data.declarant_id_no;
            if (data.declarant_id_date_issued.toLowerCase() == "n/a") {
              this.declarant_id_no_date_issued = true;
              this.declarant_id_date_issued = null;
            } else {
              this.declarant_id_no_date_issued = false;
              this.declarant_id_date_issued = data.declarant_id_date_issued;
            }

            this.spouse_gov_issued_id = data.spouse_gov_issued_id;
            this.spouse_id_no = data.spouse_id_no;
            this.spouse_id_date_issued = data.spouse_id_date_issued;

            if (data.spouse_id_date_issued.toLowerCase() == "n/a") {
              this.spouse_id_no_date_issued = true;
              this.spouse_id_date_issued = null;
            } else {
              this.spouse_id_no_date_issued = false;
              this.spouse_id_date_issued = data.spouse_id_date_issued;
            }
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    initialize() {
      this.id = null;
      this.filing_type = null;
      // this.saln_for_year = null;
      this.declarant_agency = null;
      this.declarant_office_address = null;
      this.is_spouse_in_dnsc = null;
      this.spouse_userID = null;
      this.hasBIFC = null;
      this.hasRelativeInGov = null;
      this.spouse_fname = null;
      this.spouse_lname = null;
      this.spouse_mname = null;
      this.spouse_position = null;
      this.spouse_agency = null;
      this.spouse_office_address = null;
      this.hasSpouse = false;
      this.children = [];
      this.assetsA = [];
      this.assetsB = [];
      this.liabilities = [];
      this.bifc = [];
      this.relatives_in_gov = [];
      this.declarant_gov_issued_id = null;
      this.declarant_id_no = null;
      this.declarant_id_date_issued = null;
      this.declarant_id_no_date_issued = false;
      this.spouse_id_no_date_issued = false;
      this.spouse_gov_issued_id = null;
      this.spouse_id_no = null;
      this.spouse_id_date_issued = null;
    },

    closed() {
      this.dialog = false;

      this.eventHub.$emit("closeMySALNDialog", false);
    },

    addILPD() {
      if (this.year && this.title && this.ld_actID) {
        let data = {
          year: this.year,
          title: this.title,
          ld_actID: this.ld_actID,
        };
        this.ildpCreated.push(data);
        this.year = null;
        this.title = null;
        this.ld_actID = null;
      } else {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message = "Please fill out all fields!";
      }
    },

    calculateChildAge() {
      this.childAge = this.calculateAge(this.childBdate);
    },

    changeTab(tab) {
      this.activeTab = tab;
      this.tab = tab.id;
    },

    changeNoDateIssued(field) {
      if (field == "declarant") {
        if (
          this.declarant_id_no_date_issued &&
          this.declarant_id_no_date_issued == true
        ) {
          this.declarant_id_date_issued = "N/A";
        } else {
          this.declarant_id_date_issued = null;
        }
      }

      if (field == "spouse") {
        if (
          this.spouse_id_no_date_issued &&
          this.spouse_id_no_date_issued == true
        ) {
          this.spouse_id_date_issued = "N/A";
        } else {
          this.spouse_id_date_issued = null;
        }
      }
    },

    loadRemarks(id) {
      if (id) {
        this.axiosCall("/remarks/" + id + "/SALN", "GET").then((res) => {
          if (res.data) {
            console.log("remarks", res.data);
            this.remarksData = res.data;
          }
        });
      }
    },

    getDeclarantData() {
      this.axiosCall("/user-details/getDeclarantData", "GET").then((res) => {
        if (res.data) {
          console.log("asdasdas", res.data);
          this.declarant_fname = res.data.fname;
          this.declarant_mname = res.data.mname ? res.data.mname[0] : null;
          this.declarant_lname =
            res.data.suffix
              .toString()
              .replace(/\s/g, "")
              .replace(/\t/g, "")
              .toLowerCase() != "n/a" &&
            res.data.suffix != " " &&
            res.data.suffix != "" &&
            res.data.suffix != null
              ? res.data.lname + ", " + res.data.suffix
              : res.data.lname;
          // this.declarant_suffix =
          //   res.data.suffix
          //     .toString()
          //     .replace(/\s/g, "")
          //     .replace(/\t/g, "")
          //     .toLowerCase() != "n/a" &&
          //   res.data.suffix != " " &&
          //   res.data.suffix != "" &&
          //   res.data.suffix != null
          //     ? res.data.suffix
          //     : "";
          this.declarant_position = res.data.position;
          let add = "";
          if (res.data.residential_house_no) {
            if (
              res.data.residential_house_no
                .toString()
                .replace(/\s/g, "")
                .replace(/\t/g, "")
                .toLowerCase() != "n/a" &&
              res.data.residential_house_no != null
            ) {
              add += res.data.residential_house_no + ", ";
            }
          }

          if (res.data.residential_street) {
            if (
              res.data.residential_street
                .toString()
                .replace(/\s/g, "")
                .replace(/\t/g, "")
                .toLowerCase() != "n/a" &&
              res.data.residential_street != null
            ) {
              add += res.data.residential_street + ", ";
            }
          }

          if (res.data.residential_subd) {
            if (
              res.data.residential_subd
                .toString()
                .replace(/\s/g, "")
                .replace(/\t/g, "")
                .toLowerCase() != "n/a" &&
              res.data.residential_subd != null
            ) {
              add += res.data.residential_subd + ", ";
            }
          }
          this.address =
            add == ""
              ? ""
              : add +
                res.data.residential_brgy +
                ", " +
                res.data.residential_city;
        }
      });
    },

    getPreviousSALN() {
      let d = new Date();
      this.saln_for_year = d.getFullYear() - 1;
      this.axiosCall("/saln/getPreviousSALN", "GET").then((res) => {
        if (res.data) {
          // console.log("prev", res.data);

          this.filing_type = res.data.filing_type;

          this.declarant_agency = res.data.agency;
          this.declarant_office_address = res.data.office_address;
          this.hasBIFC = res.data.hasBIFC;
          this.hasRelativeInGov = res.data.hasRelativeInGov;
          this.is_spouse_in_dnsc = res.data.is_spouse_in_dnsc;

          this.spouse_userID = res.data.spouse_userID
            ? res.data.spouse_userID.toString()
            : null;
          if (res.data.is_spouse_in_dnsc) {
            this.loadSpouseData(res.data.spouse_userID);
          } else {
            this.spouse_fname = res.data.spouse_fname;
            this.spouse_lname = res.data.spouse_lname;
            this.spouse_mname = res.data.spouse_mname;
            this.spouse_position = res.data.spouse_position;
            this.spouse_agency = res.data.spouse_agency;
            this.spouse_office_address = res.data.spouse_office_address;
          }

          this.hasSpouse = res.data.has_spouse;
          this.children = res.data.children1;
          this.assetsA = res.data.assetsA1;
          this.assetsB = res.data.assetsB1;
          this.liabilities = res.data.liabilities1;
          this.bifc = res.data.bifc1;
          this.relatives_in_gov = res.data.relatives_in_gov1;
          this.declarant_gov_issued_id = res.data.declarant_gov_issued_id;
          this.declarant_id_no = res.data.declarant_id_no;
          // this.declarant_id_date_issued = res.data.declarant_id_date_issued;
          if (res.data.declarant_id_date_issued.toLowerCase() == "n/a") {
            this.declarant_id_no_date_issued = true;
            this.declarant_id_date_issued = null;
          } else {
            this.declarant_id_no_date_issued = false;
            this.declarant_id_date_issued = res.data.declarant_id_date_issued;
          }
          this.spouse_gov_issued_id = res.data.spouse_gov_issued_id;
          this.spouse_id_no = res.data.spouse_id_no;
          // this.spouse_id_date_issued = res.data.spouse_id_date_issued;
          if (res.data.spouse_id_date_issued.toLowerCase() == "n/a") {
            this.spouse_id_no_date_issued = true;
            this.spouse_id_date_issued = null;
          } else {
            this.spouse_id_no_date_issued = false;
            this.spouse_id_date_issued = res.data.spouse_id_date_issued;
          }
        } else {
          this.initialize();
        }
      });
    },

    changeHasSpouse() {
      if (!this.hasSpouse && this.is_spouse_in_dnsc) {
        this.is_spouse_in_dnsc = false;
        this.changeSpouseInDnsc();
      }
    },

    changeSpouseInDnsc() {
      this.spouse_userID = null;
      this.spouse_fname = null;
      this.spouse_lname = null;
      this.spouse_mname = null;
      this.spouse_position = null;
      this.spouse_agency = null;
      this.spouse_office_address = null;
      this.spouse_id_no = null;
      this.spouse_gov_issued_id = null;
      this.spouse_id_date_issued = null;
    },

    changedIsDeceased() {
      this.spouse_position = null;
      this.spouse_agency = null;
      this.spouse_office_address = null;
    },

    getSpousePosition() {
      this.axiosCall("/employee/user/" + this.spouse_userID, "GET").then(
        (res) => {
          if (res.data) {
            this.spouse_fname = res.data.user.fname;
            this.spouse_lname = res.data.user.lname;
            this.spouse_mname = res.data.user.mname
              ? res.data.user.mname[0]
              : null;
            this.spouse_position = res.data.position
              ? res.data.position.description
              : null;
            this.spouse_agency = res.data.office ? res.data.office.name : null;
            this.spouse_office_address = "New Visayas, Panabo City";
          }
        }
      );
    },

    loadSpouseData(id) {
      this.axiosCall("/employee/user/" + id, "GET").then((res) => {
        if (res.data) {
          this.spouse_fname = res.data.user.fname;
          this.spouse_lname = res.data.user.lname;
          this.spouse_mname = res.data.user.mname
            ? res.data.user.mname[0]
            : null;
          this.spouse_position = res.data.position
            ? res.data.position.description
            : null;
          this.spouse_agency = res.data.office ? res.data.office.name : null;
          this.spouse_office_address = "New Visayas, Panabo City";
        }
      });
    },

    getDirectHead() {
      this.axiosCall("/my-direct-head/getMyDirectHead", "GET").then((res) => {
        if (res.data) {
          if (res.data.length == 0) {
            this.hasDirectHead = false;
          } else {
            this.hasDirectHead = true;
            this.dean_name = res.data[0].name;
            this.dean_userID = res.data[0].userID;
          }
        }
      });
    },

    addChild() {
      this.$refs.addChildFormref.reset();
      this.$refs.addChildFormref.resetValidation();
      this.addChildDialog = true;
      this.internal_action = "Add";
    },

    editChild(item, index) {
      this.indexToUpdate = index;
      this.addChildDialog = true;
      this.childName = item.name;
      this.childBdate = item.bdate;
      this.childAge = item.age;
      this.internal_action = "Update";
    },

    removeChild(item, index) {
      this.itemData = item;
      this.arrToUpdate = "children";
      this.indexToRemove = index;
      this.confirmDialog = true;
    },

    proceedAction() {
      if (this.arrToUpdate == "children") {
        if (this.action == "Update") {
          if (this.itemData.id) {
            this.removedChild.push(this.itemData);
            this.children.splice(this.indexToRemove, 1);
          } else {
            this.children.splice(this.indexToRemove, 1);
          }
        }

        if (this.action == "Add") {
          this.children.splice(this.indexToRemove, 1);
        }
      } else if (this.arrToUpdate == "assetsA") {
        if (this.action == "Update") {
          if (this.itemData.id) {
            this.removedAssetA.push(this.itemData);
            this.assetsA.splice(this.indexToRemove, 1);
          } else {
            this.assetsA.splice(this.indexToRemove, 1);
          }
        }

        if (this.action == "Add") {
          this.assetsA.splice(this.indexToRemove, 1);
        }
      } else if (this.arrToUpdate == "assetsB") {
        if (this.action == "Update") {
          if (this.itemData.id) {
            this.removedAssetB.push(this.itemData);
            this.assetsB.splice(this.indexToRemove, 1);
          } else {
            this.assetsB.splice(this.indexToRemove, 1);
          }
        }

        if (this.action == "Add") {
          this.assetsB.splice(this.indexToRemove, 1);
        }
      } else if (this.arrToUpdate == "liabilities") {
        if (this.action == "Update") {
          if (this.itemData.id) {
            this.removedLiabilities.push(this.itemData);
            this.liabilities.splice(this.indexToRemove, 1);
          } else {
            this.liabilities.splice(this.indexToRemove, 1);
          }
        }

        if (this.action == "Add") {
          this.liabilities.splice(this.indexToRemove, 1);
        }
      } else if (this.arrToUpdate == "bifc") {
        if (this.action == "Update") {
          if (this.itemData.id) {
            this.removedBIFC.push(this.itemData);
            this.bifc.splice(this.indexToRemove, 1);
          } else {
            this.bifc.splice(this.indexToRemove, 1);
          }
        }

        if (this.action == "Add") {
          this.bifc.splice(this.indexToRemove, 1);
        }
      } else if (this.arrToUpdate == "relatives_in_gov") {
        if (this.action == "Update") {
          if (this.itemData.id) {
            this.removedRelativeInGov.push(this.itemData);
            this.relatives_in_gov.splice(this.indexToRemove, 1);
          } else {
            this.relatives_in_gov.splice(this.indexToRemove, 1);
          }
        }

        if (this.action == "Add") {
          this.relatives_in_gov.splice(this.indexToRemove, 1);
        }
      }

      // console.log("removedList", this.removedRelativeInGov);
      this.itemData = null;
      this.arrToUpdate = null;
      this.indexToRemove = null;
      this.confirmDialog = false;
    },

    saveChild() {
      if (this.$refs.addChildFormref.validate()) {
        let data = {
          name: this.childName,
          bdate: this.childBdate,
          age: this.childAge,
        };
        this.children.push(data);
        this.$refs.addChildFormref.reset();
        this.$refs.addChildFormref.resetValidation();
        this.addChildDialog = false;
      }
    },

    updateChild() {
      if (this.$refs.addChildFormref.validate()) {
        this.children[this.indexToUpdate].name = this.childName;
        this.children[this.indexToUpdate].bdate = this.childBdate;
        this.children[this.indexToUpdate].age = this.childAge;

        this.$refs.addChildFormref.reset();
        this.$refs.addChildFormref.resetValidation();
        this.addChildDialog = false;
      }
    },

    addAssetA() {
      this.$refs.addAssetAFormref.reset();
      this.$refs.addAssetAFormref.resetValidation();
      this.internal_action = "Add";
      this.addAssetsADialog = true;
    },

    editAssetA(item, index) {
      this.indexToUpdate = index;
      this.addAssetsADialog = true;
      this.assetA_desc = item.assetA_desc;
      this.kind = item.kind;
      this.exact_loc = item.exact_loc;
      this.assessed_val = item.assessed_val;
      this.current_market_val = item.current_market_val;
      this.acq_year = item.acq_year;
      this.acq_mode = item.acq_mode;
      this.acq_cost = item.acq_cost;
      this.internal_action = "Update";
    },

    updateAssetA() {
      if (this.$refs.addAssetAFormref.validate()) {
        this.assetsA[this.indexToUpdate].assetA_desc = this.assetA_desc;
        this.assetsA[this.indexToUpdate].kind = this.kind;
        this.assetsA[this.indexToUpdate].exact_loc = this.exact_loc;
        this.assetsA[this.indexToUpdate].assessed_val = this.assessed_val;
        this.assetsA[
          this.indexToUpdate
        ].current_market_val = this.current_market_val;
        this.assetsA[this.indexToUpdate].acq_year = this.acq_year;
        this.assetsA[this.indexToUpdate].acq_mode = this.acq_mode;
        this.assetsA[this.indexToUpdate].acq_cost = this.acq_cost;

        this.$refs.addAssetAFormref.reset();
        this.$refs.addAssetAFormref.resetValidation();
        this.addAssetsADialog = false;
      }
    },

    saveAssetA() {
      if (this.$refs.addAssetAFormref.validate()) {
        let data = {
          assetA_desc: this.assetA_desc,
          kind: this.kind,
          exact_loc: this.exact_loc,
          assessed_val: this.assessed_val,
          current_market_val: this.current_market_val,
          acq_year: this.acq_year,
          acq_mode: this.acq_mode,
          acq_cost: this.acq_cost,
        };
        this.assetsA.push(data);
        this.addAssetsADialog = false;
      }
    },

    removeAssetA(item, index) {
      this.itemData = item;
      this.arrToUpdate = "assetsA";
      this.indexToRemove = index;
      this.confirmDialog = true;
    },

    addAssetB() {
      this.$refs.addAssetBFormref.reset();
      this.$refs.addAssetBFormref.resetValidation();
      this.internal_action = "Add";
      this.addAssetsBDialog = true;
    },

    editAssetB(item, index) {
      this.internal_action = "Update";
      this.addAssetsBDialog = true;
      this.indexToUpdate = index;
      this.assetB_desc = item.assetB_desc;
      this.year_acq = item.year_acq;
      this.assetB_acq_cost = item.assetB_acq_cost;
    },

    updateAssetB() {
      if (this.$refs.addAssetBFormref.validate()) {
        this.assetsB[this.indexToUpdate].assetB_desc = this.assetB_desc;
        this.assetsB[this.indexToUpdate].year_acq = this.year_acq;
        this.assetsB[this.indexToUpdate].assetB_acq_cost = this.assetB_acq_cost;
        this.addAssetsBDialog = false;
        this.$refs.addAssetBFormref.reset();
        this.$refs.addAssetBFormref.resetValidation();
      }
    },

    saveAssetB() {
      if (this.$refs.addAssetBFormref.validate()) {
        let data = {
          assetB_desc: this.assetB_desc,
          year_acq: this.year_acq,
          assetB_acq_cost: this.assetB_acq_cost,
        };
        this.assetsB.push(data);
        this.addAssetsBDialog = false;
      }
    },

    removeAssetB(item, index) {
      this.itemData = item;
      this.arrToUpdate = "assetsB";
      this.indexToRemove = index;
      this.confirmDialog = true;
    },

    addLiabilities() {
      this.$refs.addLiabilityFormref.reset();
      this.$refs.addLiabilityFormref.resetValidation();
      this.internal_action = "Add";
      this.addliabilitiesDialog = true;
    },

    editLiability(item, index) {
      this.internal_action = "Update";
      this.indexToUpdate = index;
      this.nature = item.nature;
      this.creditor_name = item.creditor_name;
      this.out_bal = item.out_bal;
      this.addliabilitiesDialog = true;
    },

    updateLiability() {
      if (this.$refs.addLiabilityFormref.validate()) {
        this.liabilities[this.indexToUpdate].nature = this.nature;
        this.liabilities[this.indexToUpdate].creditor_name = this.creditor_name;
        this.liabilities[this.indexToUpdate].out_bal = this.out_bal;
        this.$refs.addLiabilityFormref.reset();
        this.$refs.addLiabilityFormref.resetValidation();
        this.addliabilitiesDialog = false;
      }
    },

    saveLiabilities() {
      if (this.$refs.addLiabilityFormref.validate()) {
        let data = {
          nature: this.nature,
          creditor_name: this.creditor_name,
          out_bal: this.out_bal,
        };
        this.liabilities.push(data);
        this.addliabilitiesDialog = false;
      }
    },

    removeLiability(item, index) {
      this.itemData = item;
      this.arrToUpdate = "liabilities";
      this.indexToRemove = index;
      this.confirmDialog = true;
    },

    addBIFC() {
      this.internal_action = "Add";
      this.$refs.addBIFCFormref.reset();
      this.$refs.addBIFCFormref.resetValidation();
      this.addBIFCDialog = true;
    },

    editBifc(item, index) {
      console.log("adasd");
      this.internal_action = "Update";
      this.indexToUpdate = index;
      this.bifc_name = item.bifc_name;
      this.bifc_address = item.bifc_address;
      this.nature_of_business = item.nature_of_business;
      this.date_acq = item.date_acq;
      this.addBIFCDialog = true;
    },

    updateBifc() {
      if (this.$refs.addBIFCFormref.validate()) {
        this.bifc[this.indexToUpdate].bifc_name = this.bifc_name;
        this.bifc[this.indexToUpdate].bifc_address = this.bifc_address;
        this.bifc[
          this.indexToUpdate
        ].nature_of_business = this.nature_of_business;
        this.bifc[this.indexToUpdate].date_acq = this.date_acq;
        this.$refs.addBIFCFormref.reset();
        this.$refs.addBIFCFormref.resetValidation();
        this.addBIFCDialog = false;
      }
    },

    saveBIFC() {
      if (this.$refs.addBIFCFormref.validate()) {
        let data = {
          bifc_name: this.bifc_name,
          bifc_address: this.bifc_address,
          nature_of_business: this.nature_of_business,
          date_acq: this.date_acq,
        };
        this.bifc.push(data);
        this.addBIFCDialog = false;
      }
    },

    removeBIFC(item, index) {
      this.itemData = item;
      this.arrToUpdate = "bifc";
      this.indexToRemove = index;
      this.confirmDialog = true;
    },

    addRelativeInGov() {
      this.internal_action = "Add";
      this.$refs.addRelativeInGovFormref.reset();
      this.$refs.addRelativeInGovFormref.resetValidation();
      this.addRelativeInGoveDialog = true;
    },

    editRelativeInGov(item, index) {
      this.internal_action = "Update";
      this.indexToUpdate = index;
      this.relative_name = item.relative_name;
      this.relative_relationship = item.relative_relationship;
      this.relative_position = item.relative_position;
      this.relative_name_of_agency_and_address =
        item.relative_name_of_agency_and_address;
      this.addRelativeInGoveDialog = true;
    },

    updateRelativeInGov() {
      if (this.$refs.addRelativeInGovFormref.validate()) {
        this.relatives_in_gov[
          this.indexToUpdate
        ].relative_name = this.relative_name;
        this.relatives_in_gov[
          this.indexToUpdate
        ].relative_relationship = this.relative_relationship;
        this.relatives_in_gov[
          this.indexToUpdate
        ].relative_position = this.relative_position;
        this.relatives_in_gov[
          this.indexToUpdate
        ].relative_name_of_agency_and_address = this.relative_name_of_agency_and_address;
        this.$refs.addRelativeInGovFormref.reset();
        this.$refs.addRelativeInGovFormref.resetValidation();
        this.addRelativeInGoveDialog = false;
      }
    },

    saveRelativeInGov() {
      if (this.$refs.addRelativeInGovFormref.validate()) {
        let data = {
          relative_name: this.relative_name,
          relative_relationship: this.relative_relationship,
          relative_position: this.relative_position,
          relative_name_of_agency_and_address: this
            .relative_name_of_agency_and_address,
        };
        this.relatives_in_gov.push(data);
        this.addRelativeInGoveDialog = false;
      }
    },

    removeRelativesInGov(item, index) {
      this.itemData = item;
      this.arrToUpdate = "relatives_in_gov";
      this.indexToRemove = index;
      this.confirmDialog = true;
    },

    getUsers() {
      this.loading = true;
      this.axiosCall("/user-details/getAllUserExceptCurrentUser", "GET").then(
        (res) => {
          if (res) {
            this.usersList = res.data;
          }
        }
      );
    },

    saveSALN() {
      if (this.$refs.MySALNFormref.validate()) {
        if (this.declarant_gov_issued_id == null) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message =
            "Declarant's Government Issued ID is required!";
        } else {
          let data = {
            filing_type: this.filing_type,
            saln_for_year: this.saln_for_year,
            agency: this.declarant_agency,
            office_address: this.declarant_office_address,
            is_spouse_deceased:
              this.is_spouse_deceased == null ||
              this.is_spouse_deceased == false
                ? false
                : true,
            spouse_fname: this.spouse_fname,
            spouse_lname: this.spouse_lname,
            spouse_mname: this.spouse_mname,
            spouse_position: this.spouse_position,
            spouse_agency: this.spouse_agency,
            spouse_office_address: this.spouse_office_address,
            has_spouse: this.hasSpouse,
            is_spouse_in_dnsc: this.is_spouse_in_dnsc,
            children: this.children,
            assetsA: this.assetsA,
            assetsB: this.assetsB,
            liabilities: this.liabilities,
            bifc: this.bifc,
            relatives_in_gov: this.relatives_in_gov,
            declarant_gov_issued_id: this.declarant_gov_issued_id,
            declarant_id_no: this.declarant_id_no,
            declarant_id_date_issued:
              this.declarant_id_no_date_issued == true
                ? "N/A"
                : this.declarant_id_date_issued,
            spouse_userID: this.spouse_userID,
            spouse_gov_issued_id:
              this.is_spouse_deceased == true
                ? null
                : this.spouse_gov_issued_id,
            spouse_id_no:
              this.is_spouse_deceased == true ? null : this.spouse_id_no,
            spouse_id_date_issued:
              this.is_spouse_deceased == true
                ? null
                : this.spouse_id_date_issued,
            hasBIFC: this.hasBIFC ? true : false,
            hasRelativeInGov: this.hasRelativeInGov ? true : false,
          };

          this.axiosCall("/saln", "POST", data).then((res) => {
            if (res.data.status == 201) {
              this.dialog = false;
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "success";
              this.fadeAwayMessage.message = res.data.msg;
              this.fadeAwayMessage.header = "System Message";
              this.closed();
            } else if (res.data.status == 400) {
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "error";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
            }
          });
        }
      } else {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message = "Please fill in required fields!";
      }
    },
    update() {
      if (this.$refs.MySALNFormref.validate()) {
        let d = new Date();
        if (parseInt(this.saln_for_year) >= parseInt(d.getFullYear())) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "Cannot create saln for this year!";
        } else {
          let data = {
            filing_type: this.filing_type,
            saln_for_year: this.saln_for_year,
            is_spouse_deceased:
              this.is_spouse_deceased == null ||
              this.is_spouse_deceased == false
                ? false
                : true,
            agency: this.declarant_agency,
            office_address: this.declarant_office_address,
            spouse_fname: this.spouse_fname,
            spouse_lname: this.spouse_lname,
            spouse_mname: this.spouse_mname,
            spouse_position: this.spouse_position,
            spouse_agency: this.spouse_agency,
            spouse_office_address: this.spouse_office_address,
            has_spouse: this.hasSpouse,
            is_spouse_in_dnsc: this.is_spouse_in_dnsc,
            children: this.children,
            assetsA: this.assetsA,
            assetsB: this.assetsB,
            liabilities: this.liabilities,
            bifc: this.bifc,
            relatives_in_gov: this.relatives_in_gov,
            declarant_gov_issued_id: this.declarant_gov_issued_id,
            declarant_id_no: this.declarant_id_no,
            declarant_id_date_issued:
              this.declarant_id_no_date_issued == true
                ? "N/A"
                : this.declarant_id_date_issued,
            spouse_userID: this.spouse_userID,
            spouse_gov_issued_id:
              this.is_spouse_deceased == true
                ? null
                : this.spouse_gov_issued_id,
            spouse_id_no:
              this.is_spouse_deceased == true ? null : this.spouse_id_no,
            spouse_id_date_issued:
              this.is_spouse_deceased == true
                ? null
                : this.spouse_id_date_issued,
            hasBIFC: this.hasBIFC ? true : false,
            hasRelativeInGov: this.hasRelativeInGov ? true : false,
            removedAssetA: this.removedAssetA,
            removedAssetB: this.removedAssetB,
            removedChild: this.removedChild,
            removedLiabilities: this.removedLiabilities,
            removedBIFC: this.removedBIFC,
            removedRelativeInGov: this.removedRelativeInGov,
          };
          // console.log(data);
          this.axiosCall("/saln/" + this.id, "PATCH", data).then((res) => {
            if (res.data.status == 200) {
              this.dialog = false;
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "success";
              this.fadeAwayMessage.message = res.data.msg;
              this.fadeAwayMessage.header = "System Message";
              this.closed();
            } else if (res.data.status == 400) {
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "error";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
            }
          });
        }
      } else {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message = "Please fill in required fields!";
      }
    },
  },
};
</script>

<style scoped>
table {
  width: 100%;
}

.th {
  background-color: #5a67da;
  color: white !important;
  border-color: white;
  padding: 1px;
}

table,
td {
  border: 1px solid rgba(146, 147, 149, 0.518);
  border-collapse: collapse;
}
</style>
