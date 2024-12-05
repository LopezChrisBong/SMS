<template>
  <div>
    <v-dialog v-model="dialog" eager persistent scrollable fullscreen>
      <v-card>
        <v-card-title dark class="dialog-header pt-2 pb-2 pl-6">
          <span>Leave Approval</span>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="closeD()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text style="max-height: 900px" class="my-4">
          <v-container>
            <v-form ref="LeaveApprovalFormref" @submit.prevent>
              <v-row>
                <v-col cols="12">
                  <v-stepper alt-labels class="elevation-0">
                    <v-stepper-header>
                      <v-stepper-step
                        step="1"
                        :complete="true"
                        color="#6DB249"
                        class="pa-5"
                      >
                        {{ hr_personnel_name }}
                        <small>HR Officer <br /> </small>
                      </v-stepper-step>

                      <v-divider></v-divider>

                      <v-stepper-step
                        v-if="!isMonitization && !isHeadPresident"
                        step="2"
                        class="pa-5"
                        :complete="recommending_status == 1 ? true : false"
                        :rules="[() => recommending_status != 2]"
                        color="#6DB249"
                      >
                        {{ recommending_name }}
                        <small>Recommending Approval<br /> </small>
                      </v-stepper-step>
                      <v-divider
                        v-if="!isMonitization && !isHeadPresident"
                      ></v-divider>

                      <v-stepper-step
                        class="pa-5"
                        :step="!isMonitization && !isHeadPresident ? 3 : 2"
                        :complete="
                          is_final_approval_disapproved != null &&
                          is_final_approval_disapproved == 0
                            ? true
                            : false
                        "
                        :rules="[() => is_final_approval_disapproved != 1]"
                        color="#6DB249"
                      >
                        {{ final_approval_name }}
                        <small>Approved<br /> </small>
                      </v-stepper-step>
                    </v-stepper-header>
                  </v-stepper>
                </v-col>
              </v-row>
              <table>
                <tr>
                  <td colspan="2">
                    <div class="d-flex">
                      <div style="width:35%">
                        <div class="text-body-1">1. OFFICE/DEPARTMENT</div>
                        <div class="line_border font-weight-bold">
                          {{ office }}
                        </div>
                      </div>
                      <div style="width:65%" class="d-flex">
                        <div style="width:10%">
                          <div class="text-body-1">
                            2. NAME
                          </div>
                        </div>
                        <div style="width:30%">
                          <div class="text-body-1">
                            (Last)
                          </div>
                          <div class="line_border font-weight-bold">
                            {{ lname }}
                          </div>
                        </div>
                        <div style="width:30%">
                          <div class="text-body-1">(First)</div>
                          <div class="line_border font-weight-bold">
                            {{ fname }}
                          </div>
                        </div>
                        <div style="width:30%">
                          <div class="text-body-1">(Middle)</div>
                          <div class="line_border font-weight-bold">
                            {{ mname }}
                            <span v-if="!mname" style="visibility : hidden"
                              >XX</span
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="2">
                    <div class="d-flex">
                      <div style="width:30%" class="d-flex">
                        <div class="text-body-1" style="width:45%">
                          4. DATE OF FILING
                        </div>
                        <div
                          class="line_border font-weight-bold"
                          style="width:55%"
                        >
                          {{ date_filed }}
                        </div>
                      </div>
                      <div style="width:5%"></div>
                      <div style="width:30%" class="d-flex">
                        <div class="text-body-1" style="width:30%">
                          4. POSITION
                        </div>
                        <div
                          class="line_border font-weight-bold"
                          style="width:70%"
                        >
                          {{ position }}
                        </div>
                      </div>
                      <div style="width:5%"></div>
                      <div style="width:30%" class="d-flex">
                        <div class="text-body-1" style="width:30%">
                          5. SALARY
                        </div>
                        <div class="line_border" style="width:70%"></div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td
                    colspan="2"
                    height="20"
                    style="background-color:#C0C0C0"
                    align="center"
                  >
                    <div class="text-h6 white--text">
                      6. DETAILS OF APPLICATION
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="width:60%">
                    <div class="text-body-1">
                      6.A TYPE OF LEAVE TO BE AVAILED
                    </div>
                    <div
                      v-for="item in typesOfLeaveList"
                      :key="item.id"
                      class="py-2"
                    >
                      <input
                        type="checkbox"
                        :disabled="item.id != type_of_leave_ID"
                        :value="item.id"
                        :checked="item.id == type_of_leave_ID"
                      />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <label class="text-body-1"
                        >{{ item.description }}
                        <span v-if="item.subdescription" class="text-caption"
                          >({{ item.subdescription }})</span
                        >
                      </label>
                    </div>

                    <div class="line_border" v-if="type_of_leave_ID == 14">
                      {{ other_type_of_leave }}
                    </div>
                  </td>
                  <td style="width:40%; vertical-align: top;">
                    <div class="text-body-1">
                      6.B DETAILS OF LEAVE
                    </div>
                    <div class="mt-2">
                      <i class="text-caption font-weight-bold"
                        >In case of Vacation/Special Privilege Leave</i
                      >
                      <div>
                        <div class="d-flex mt-2">
                          <div style="width:50%">
                            <input
                              :disabled="
                                (type_of_leave_ID == 1 ||
                                  type_of_leave_ID == 6) &&
                                selected_details_of_leave == 1
                                  ? false
                                  : true
                              "
                              :checked="
                                (type_of_leave_ID == 1 ||
                                  type_of_leave_ID == 6) &&
                                  selected_details_of_leave == 1
                              "
                              type="checkbox"
                            />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <label class="text-subtitle-1"
                              >Within the Philippines</label
                            >
                          </div>
                          <div style="width:50%" class="line_border">
                            {{
                              (type_of_leave_ID == 1 ||
                                type_of_leave_ID == 6) &&
                              selected_details_of_leave == 1
                                ? details_of_leave
                                : ""
                            }}
                          </div>
                        </div>
                        <div class="d-flex">
                          <div style="width:50%">
                            <input
                              :disabled="
                                (type_of_leave_ID == 1 ||
                                  type_of_leave_ID == 6) &&
                                selected_details_of_leave == 2
                                  ? false
                                  : true
                              "
                              :checked="
                                (type_of_leave_ID == 1 ||
                                  type_of_leave_ID == 6) &&
                                  selected_details_of_leave == 2
                              "
                              type="checkbox"
                            />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <label class="text-subtitle-1">Abroad</label>
                          </div>
                          <div style="width:50%" class="line_border">
                            {{
                              (type_of_leave_ID == 1 ||
                                type_of_leave_ID == 6) &&
                              selected_details_of_leave == 2
                                ? details_of_leave
                                : ""
                            }}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class=" mt-2">
                      <i class="text-caption font-weight-bold"
                        >In case of Sick Leave</i
                      >
                      <div>
                        <div class="d-flex  mt-2">
                          <div style="width:50%">
                            <input
                              :disabled="
                                type_of_leave_ID == 3 &&
                                selected_details_of_leave == 1
                                  ? false
                                  : true
                              "
                              :checked="
                                type_of_leave_ID == 3 &&
                                  selected_details_of_leave == 1
                              "
                              type="checkbox"
                            />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <label class="text-subtitle-1"
                              >In Hospital (Specify Illness)</label
                            >
                          </div>
                          <div style="width:50%" class="line_border">
                            {{
                              type_of_leave_ID == 3 &&
                              selected_details_of_leave == 1
                                ? details_of_leave
                                : ""
                            }}
                          </div>
                        </div>
                        <div class="d-flex">
                          <div style="width:50%">
                            <input
                              :disabled="
                                type_of_leave_ID == 3 &&
                                selected_details_of_leave == 2
                                  ? false
                                  : true
                              "
                              :checked="
                                type_of_leave_ID == 3 &&
                                  selected_details_of_leave == 2
                              "
                              type="checkbox"
                            />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <label class="text-subtitle-1"
                              >Out Patient (Specify Illness)</label
                            >
                          </div>
                          <div style="width:50%" class="line_border">
                            {{
                              type_of_leave_ID == 3 &&
                              selected_details_of_leave == 1
                                ? details_of_leave
                                : ""
                            }}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class=" mt-2">
                      <i class="text-caption font-weight-bold"
                        >In case of Special Leave Benefits for Women</i
                      >
                      <div>
                        <div class="d-flex  mt-2">
                          <div style="width:50%">
                            <input
                              :disabled="type_of_leave_ID == 11 ? false : true"
                              :checked="type_of_leave_ID == 11"
                              type="checkbox"
                            />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <label class="text-subtitle-1"
                              >(Specify Illness)</label
                            >
                          </div>
                          <div style="width:50%" class="line_border">
                            {{ type_of_leave_ID == 11 ? details_of_leave : "" }}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class=" mt-2">
                      <i class="text-caption font-weight-bold"
                        >In case of Study Leave</i
                      >
                      <div>
                        <div class="d-flex  mt-2">
                          <div style="width:50%">
                            <input
                              :disabled="
                                type_of_leave_ID == 8 &&
                                selected_details_of_leave == 1
                                  ? false
                                  : true
                              "
                              :checked="
                                type_of_leave_ID == 8 &&
                                  selected_details_of_leave == 1
                              "
                              type="checkbox"
                            />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <label class="text-subtitle-1"
                              >Completion of Master's Degree</label
                            >
                          </div>
                          <div style="width:50%" class="line_border">
                            {{
                              type_of_leave_ID == 8 &&
                              selected_details_of_leave == 1
                                ? det_of_leave
                                : ""
                            }}
                          </div>
                        </div>
                        <div class="d-flex">
                          <div style="width:50%">
                            <input
                              :disabled="
                                type_of_leave_ID == 8 &&
                                selected_details_of_leave == 2
                                  ? false
                                  : true
                              "
                              :checked="
                                type_of_leave_ID == 8 &&
                                  selected_details_of_leave == 2
                              "
                              type="checkbox"
                            />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <label class="text-subtitle-1"
                              >BAR/Boar Examination Review</label
                            >
                          </div>
                          <div style="width:50%" class="line_border">
                            {{
                              type_of_leave_ID == 8 &&
                              selected_details_of_leave == 2
                                ? det_of_leave
                                : ""
                            }}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class=" mt-2">
                      <i class="text-caption font-weight-bold">Other Purpose</i>
                      <div>
                        <div class="d-flex  mt-2">
                          <div>
                            <input
                              :disabled="
                                type_of_leave_ID == 14 &&
                                selected_details_of_leave == 1
                                  ? false
                                  : true
                              "
                              :checked="
                                type_of_leave_ID == 14 &&
                                  selected_details_of_leave == 1
                              "
                              type="checkbox"
                            />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <label class="text-subtitle-1"
                              >Monitization of Leave Credits</label
                            >
                          </div>
                        </div>
                        <div class="d-flex">
                          <div>
                            <input
                              :disabled="
                                type_of_leave_ID == 14 &&
                                selected_details_of_leave == 2
                                  ? false
                                  : true
                              "
                              :checked="
                                type_of_leave_ID == 14 &&
                                  selected_details_of_leave == 2
                              "
                              type="checkbox"
                            />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <label class="text-subtitle-1"
                              >Terminal Leave</label
                            >
                          </div>
                        </div>
                        <div class="d-flex">
                          <div>
                            <input
                              :disabled="
                                type_of_leave_ID == 14 &&
                                selected_details_of_leave == 3
                                  ? false
                                  : true
                              "
                              :checked="
                                type_of_leave_ID == 14 &&
                                  selected_details_of_leave == 3
                              "
                              type="checkbox"
                            />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <label class="text-subtitle-1"
                              >Compensatory Time Off</label
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="width:60%;vertical-align: top;">
                    <div style="width:70%">
                      <div class="text-body-1">
                        6.C NUMBER OF WORKING DAYS APPLIED FOR
                      </div>
                      <div
                        style="height:20px"
                        class="ml-8 line_border text-center font-weight-bold"
                      >
                        {{ no_days_applied }}
                      </div>
                      <div class="text-body-1 ml-8 mt-4">
                        INCLUSIVE DATES
                      </div>
                      <div
                        style="height:20px"
                        class="ml-8 line_border text-center  font-weight-bold"
                      >
                        {{ inclusiveDateString }}
                        <!-- {{ inclusive_date_from }} - {{ inclusive_date_to }} -->
                      </div>
                    </div>
                  </td>
                  <td style="width:40%; vertical-align: top;">
                    <div class="text-body-1">
                      6.D COMMUTATION
                    </div>
                    <div class="mt-2">
                      <div class="d-flex mt-2 ml-4">
                        <div>
                          <input
                            :disabled="commutation == 2 ? false : true"
                            :checked="commutation == 2"
                            type="checkbox"
                          />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          <label class="text-subtitle-1">Not Requested</label>
                        </div>
                      </div>
                      <div class="d-flex  ml-4">
                        <div style="width:50%">
                          <input
                            :disabled="commutation == 1 ? false : true"
                            :checked="commutation == 1"
                            type="checkbox"
                          />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          <label class="text-subtitle-1">Requested</label>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr
                  v-if="
                    type_of_leave_ID == 3 ||
                      type_of_leave_ID == 4 ||
                      type_of_leave_ID == 5 ||
                      type_of_leave_ID == 7 ||
                      type_of_leave_ID == 9 ||
                      type_of_leave_ID == 10 ||
                      type_of_leave_ID == 11 ||
                      type_of_leave_ID == 12 ||
                      type_of_leave_ID == 13
                  "
                >
                  <td colspan="2" style="width:60%;position:relative">
                    <div class="text-body-1" style="position:absolute; top:0">
                      Attachments
                    </div>
                    <div class="mt-10">
                      <table v-if="attachments.length > 0">
                        <tr>
                          <td align="center">Description</td>
                          <td align="center">Action</td>
                        </tr>
                        <tr v-for="(item, index) in attachments" :key="index">
                          <td>{{ item.description }}</td>
                          <td align="center">
                            <v-btn
                              x-small
                              outlined
                              @click="viewFile(item.filename)"
                              color="grey"
                              ><v-icon size="14">mdi-eye</v-icon>View</v-btn
                            >
                          </td>
                        </tr>
                      </table>

                      <table v-if="attachments.length == 0">
                        <tr>
                          <td align="center">Description</td>
                          <td align="center">Action</td>
                        </tr>
                        <tr>
                          <td colspan="2" align="center">
                            <span class="text-caption"
                              ><i>No attachment/s found.</i></span
                            >
                          </td>
                        </tr>
                      </table>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td
                    colspan="2"
                    style="background-color:#C0C0C0;"
                    align="center"
                  >
                    <div class="text-h6 white--text">
                      7. DETAILS OF ACTION ON APPLICATION
                    </div>
                  </td>
                </tr>
                <tr>
                  <td
                    :colspan="!isMonitization ? 1 : 2"
                    :style="!isMonitization ? 'width:60%;' : ''"
                    style="position:relative"
                  >
                    <div
                      class="text-body-1 mt-2"
                      style="position:absolute; top:0"
                    >
                      7.A CERTIFICATION OF LEAVE CREDITS
                    </div>

                    <div class="mt-6 mb-16">
                      <div class="d-flex justify-end">
                        <v-btn
                          @click="viewEmpLeave()"
                          small
                          outlined
                          color="#5a67da"
                          >view used leave</v-btn
                        >
                      </div>
                      <div class="text-center text-caption">
                        As of
                        <span class="line_border font-weight-bold">{{
                          date_filed
                        }}</span>
                      </div>
                      <table>
                        <tr>
                          <td></td>
                          <td align="center">Vacation Leave</td>
                          <td align="center">Sick Leave</td>
                        </tr>
                        <tr>
                          <td align="center">Total Earned</td>
                          <td align="center" class="font-weight-bold">
                            {{ vl_credit }}
                          </td>
                          <td align="center" class="font-weight-bold">
                            {{ sl_credit }}
                          </td>
                        </tr>
                        <tr>
                          <td align="center">Less this application</td>
                          <td align="center" class="font-weight-bold">
                            {{ less_vl_credit }}
                          </td>
                          <td align="center" class="font-weight-bold">
                            {{ less_sl_credit }}
                          </td>
                        </tr>
                        <tr>
                          <td align="center">Balance</td>
                          <td align="center" class="font-weight-bold">
                            {{ bal_vl_credit }}
                          </td>
                          <td align="center" class="font-weight-bold">
                            {{ bal_sl_credit }}
                          </td>
                        </tr>
                      </table>
                    </div>
                    <div
                      class="text-center mt-10 mb-2 ml-10"
                      style="position:absolute; bottom:0;width:90%;"
                    >
                      <div
                        style="height:20px"
                        class="line_border  font-weight-bold"
                      >
                        {{ hr_personnel_name }}
                      </div>
                      <div>(Authorized Officer)</div>
                    </div>
                  </td>
                  <td
                    v-if="!isMonitization"
                    style=" width:40%; position:relative"
                  >
                    <div
                      class="text-body-1  mt-2"
                      style="position:absolute; top:0"
                    >
                      7.B RECOMMENDATION
                    </div>
                    <div style="margin-top:-40px">
                      <div class="d-flex  ml-4">
                        <v-checkbox
                          v-if="user_approval_type == 2"
                          :readonly="user_approval_type == 2"
                          v-model="recommending_status_temp"
                          :checked="recommending_status_temp == 1"
                          :value="1"
                        >
                          <template v-slot:label>
                            <span class="text-subtitle-1">For Approval</span>
                          </template>
                        </v-checkbox>
                        <v-checkbox
                          v-if="user_approval_type == 1"
                          :readonly="
                            (tab == 2 || tab == 3) &&
                              user_approval_type == 1 &&
                              recommending_status_temp != null
                          "
                          :rules="
                            user_approval_type == 1 ? [formRules.required] : []
                          "
                          v-model="recommending_status_temp"
                          :checked="recommending_status_temp == 1"
                          :value="1"
                        >
                          <template v-slot:label>
                            <span class="text-subtitle-1">For Approval</span>
                          </template>
                        </v-checkbox>
                      </div>
                      <div class="d-flex ml-4">
                        <div style="width:50%">
                          <v-checkbox
                            v-if="user_approval_type == 2"
                            :readonly="user_approval_type == 2"
                            v-model="recommending_status_temp"
                            :checked="recommending_status_temp == 2"
                            :value="2"
                          >
                            <template v-slot:label>
                              <span class="text-subtitle-1"
                                >For disapproval due to</span
                              >
                            </template>
                          </v-checkbox>
                          <v-checkbox
                            v-if="user_approval_type == 1"
                            :readonly="
                              (tab == 2 || tab == 3) &&
                                user_approval_type == 1 &&
                                recommending_status_temp != null
                            "
                            :rules="
                              user_approval_type == 1
                                ? [formRules.required]
                                : []
                            "
                            v-model="recommending_status_temp"
                            :checked="recommending_status_temp == 2"
                            :value="2"
                          >
                            <template v-slot:label>
                              <span class="text-subtitle-1"
                                >For disapproval due to</span
                              >
                            </template>
                          </v-checkbox>
                        </div>

                        <div
                          style="width:50%"
                          :class="
                            recommending_status_temp == 1 ||
                            recommending_status_temp == null
                              ? 'line_border'
                              : ''
                          "
                        >
                          <v-textarea
                            outlined
                            :rules="
                              user_approval_type == 1 &&
                              recommending_status_temp == 2
                                ? [formRules.required]
                                : []
                            "
                            v-model="recommending_remarks"
                            rows="3"
                            :readonly="user_approval_type == 2"
                            class="text-body-2"
                            placeholder="Please type here..."
                            v-if="
                              (user_approval_type == 1 ||
                                user_approval_type == 2) &&
                                recommending_status_temp == 2
                            "
                          ></v-textarea>
                        </div>
                      </div>
                    </div>
                    <div
                      class="text-center  mb-2 ml-8"
                      style="position: absolute; bottom:0; width:90%"
                    >
                      <div
                        style="height:20px"
                        class="line_border font-weight-bold"
                      >
                        {{ recommending_name }}
                      </div>
                      <div>(Authorized Officer)</div>
                    </div>
                  </td>
                </tr>
                <tr
                  v-if="
                    user_approval_type == 2 && !is_final_approval_disapproved
                  "
                >
                  <td colspan="2" style="border-bottom:none">
                    <div class="d-flex justify-space-around">
                      <v-checkbox
                        :readonly="
                          user_approval_type == 2 &&
                            (tab == 2 || tab == 3) &&
                            is_final_approval_disapproved != null
                        "
                        :rules="
                          user_approval_type == 2 ? [formRules.required] : []
                        "
                        v-model="is_final_approval_disapproved_temp"
                        :checked="is_final_approval_disapproved_temp == 1"
                        :value="1"
                      >
                        <template v-slot:label>
                          <span class="text-subtitle-1">Approved</span>
                        </template>
                      </v-checkbox>
                      <v-checkbox
                        :readonly="
                          user_approval_type == 2 &&
                            (tab == 2 || tab == 3) &&
                            is_final_approval_disapproved != null
                        "
                        :rules="
                          user_approval_type == 2 ? [formRules.required] : []
                        "
                        v-model="is_final_approval_disapproved_temp"
                        :checked="is_final_approval_disapproved_temp == 2"
                        :value="2"
                      >
                        <template v-slot:label>
                          <span class="text-subtitle-1">Disapproved</span>
                        </template>
                      </v-checkbox>
                    </div>
                  </td>
                </tr>
                <tr v-if="user_approval_type == 2">
                  <td
                    :style="user_approval_type == 2 ? 'border-top:none' : ''"
                    style="width:60%;position:relative; border-right:none; border-bottom:none"
                  >
                    <div
                      class="text-body-1  mt-2"
                      style="position:absolute; top:0"
                    >
                      7.C APPROVED FOR
                    </div>
                    <div class="d-flex mt-10" style="width:50%">
                      <div
                        :class="
                          user_approval_type == 2 &&
                          is_final_approval_disapproved_temp == 1 &&
                          is_final_approval_disapproved_temp
                            ? ''
                            : 'line_border'
                        "
                        style="width:50%"
                      >
                        <v-text-field
                          class="centered-input "
                          v-model="app_days_w_pay"
                          readonly
                          v-if="user_approval_type == 2"
                          :outlined="tab == 1"
                          dense
                        >
                        </v-text-field>
                        <!-- <v-text-field
                          class="centered-input "
                          v-model="app_days_w_pay"
                          :readonly="tab == 2 || tab == 3"
                          v-if="
                            user_approval_type == 2 &&
                              is_final_approval_disapproved_temp == 1 &&
                              is_final_approval_disapproved_temp
                          "
                          :rules="
                            user_approval_type == 2 &&
                            is_final_approval_disapproved_temp == 1 &&
                            is_final_approval_disapproved_temp
                              ? [formRules.zeroAllowed]
                              : []
                          "
                          :outlined="tab == 1"
                          dense
                        >
                        </v-text-field> -->
                      </div>

                      <div class="text-subtitle-1 ml-2" style="width:50%">
                        days with pay
                      </div>
                    </div>
                    <div class="d-flex" style="width:50%">
                      <div
                        :class="
                          user_approval_type == 2 &&
                          is_final_approval_disapproved_temp == 1 &&
                          is_final_approval_disapproved_temp
                            ? ''
                            : 'line_border'
                        "
                        style="width:50%"
                      >
                        <v-text-field
                          class="centered-input "
                          v-model="app_days_wo_pay"
                          v-if="user_approval_type == 2"
                          readonly
                          :outlined="tab == 1"
                          dense
                        >
                        </v-text-field>
                        <!-- <v-text-field
                          class="centered-input "
                          v-model="app_days_wo_pay"
                          v-if="
                            user_approval_type == 2 &&
                              is_final_approval_disapproved_temp == 1 &&
                              is_final_approval_disapproved_temp
                          "
                          :readonly="tab == 2 || tab == 3"
                          :rules="
                            user_approval_type == 2 &&
                            is_final_approval_disapproved_temp == 1 &&
                            is_final_approval_disapproved_temp
                              ? [formRules.zeroAllowed]
                              : []
                          "
                          :outlined="tab == 1"
                          dense
                        >
                        </v-text-field> -->
                      </div>

                      <div class="text-subtitle-1 ml-2" style="width:50%">
                        days without pay
                      </div>
                    </div>
                    <div class="d-flex" style="width:50%">
                      <div
                        :class="user_approval_type == 2 ? '' : 'line_border'"
                        style="width:50%"
                      >
                        <v-text-field
                          class="centered-input "
                          v-model="app_days_others"
                          readonly
                          v-if="user_approval_type == 2"
                          :rules="[]"
                          :outlined="tab == 1"
                          dense
                        >
                        </v-text-field>
                        <!-- <v-text-field
                          class="centered-input "
                          v-model="app_days_others"
                          :readonly="tab == 2 || tab == 3"
                          v-if="
                            user_approval_type == 2 &&
                              is_final_approval_disapproved_temp == 1 &&
                              is_final_approval_disapproved_temp
                          "
                          :rules="[]"
                          :outlined="tab == 1"
                          dense
                        >
                        </v-text-field> -->
                      </div>

                      <div class="text-subtitle-1 ml-2" style="width:50%">
                        other (Specify)
                      </div>
                    </div>
                  </td>
                  <td
                    :style="user_approval_type == 2 ? 'border-top:none' : ''"
                    style="width:40%; position:relative; border-left:none; border-bottom:none"
                  >
                    <div
                      class="text-body-1  mt-2"
                      style="position:absolute; top:0"
                    >
                      7.D DISAPPROVED DUE TO:
                    </div>
                    <div
                      class="ml-10 "
                      :class="
                        user_approval_type == 2 &&
                        is_final_approval_disapproved_temp == 2 &&
                        is_final_approval_disapproved_temp
                          ? ''
                          : 'line_border'
                      "
                      style="width:90%"
                    >
                      <v-textarea
                        v-model="final_approval_user_remarks"
                        class="mt-10 text-body-2"
                        rows="3"
                        :readonly="tab == 2 || tab == 3"
                        :rules="
                          user_approval_type == 2 &&
                          is_final_approval_disapproved_temp == 2 &&
                          is_final_approval_disapproved_temp != null
                            ? [formRules.required]
                            : []
                        "
                        v-if="
                          user_approval_type == 2 &&
                            is_final_approval_disapproved_temp == 2 &&
                            is_final_approval_disapproved_temp != null
                        "
                        outlined
                        placeholder="Please type here..."
                      ></v-textarea>
                    </div>
                  </td>
                </tr>
                <tr v-if="user_approval_type == 2">
                  <td colspan="2" align="center" style=" border-top:none;">
                    <div class="mt-10" style="width:40%">
                      <div class="line_border  font-weight-bold">
                        {{ final_approval_name }}
                      </div>
                      <div>(Authorized Official)</div>
                    </div>
                  </td>
                </tr>
              </table>
            </v-form>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>

        <v-card-actions class="pa-5" v-if="tab == 1">
          <v-spacer></v-spacer>
          <v-btn color="#5a67da" class="white--text" @click="save()">
            <v-icon>mdi-check</v-icon>
            Submit
          </v-btn>
          <!-- <v-btn color="#5a67da" class="white--text">
            <v-icon>mdi-printer</v-icon>
            Print
          </v-btn> -->
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="addRemarksDialog" persistent max-width="400">
      <v-card color="white">
        <v-form ref="RemarksFormref" @submit.prevent>
          <v-card-title dark class="dialog-header pt-2 pb-2 pl-6">
            <span>Add Remarks</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="addRemarksDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 400px" class="my-4"> </v-card-text>
          <v-container>
            <v-row>
              <!-- <v-col cols="12" v-if="isSalaryEditable">
                <v-text-field
                  v-model="salary"
                  :rules="isSalaryEditable ? [formRules.required] : []"
                  dense
                  label="Salary"
                  outlined
                  required
                  class="rounded-lg"
                  color="#6DB249"
                ></v-text-field>
              </v-col> -->
              <!-- <v-col cols="12">
                <v-text-field
                  v-model="remarks"
                  :rules="[formRules.required]"
                  dense
                  label="Remarks"
                  outlined
                  required
                  class="rounded-lg"
                  color="#6DB249"
                ></v-text-field>
              </v-col> -->
            </v-row>
          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" outlined @click="addRemarksDialog = false">
              Close
            </v-btn>
            <v-btn color="green" class="white--text" @click="saveUpdate()">
              Save
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <ViewFileDialog :data="filename" />
    <ViewEmployeeLeaveDialog :data="empIDToView" />
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
    tab: null,
  },
  components: {
    ViewFileDialog: () => import("../Views/ViewFileDialog.vue"),
    ViewEmployeeLeaveDialog: () =>
      import("../Views/ViewEmployeeLeaveDialog.vue"),
  },
  data() {
    return {
      isMonitization: null,
      filename: null,
      empID: null,
      attachments: [],
      addRemarksDialog: false,
      dialog: false,
      typesOfLeaveList: [],
      user_approval_type: null,
      id: null,
      fname: null,
      mname: null,
      lname: null,
      office: null,
      position: null,
      date_filed: null,
      salary: null,
      type_of_leave_ID: null,
      details_of_leave: null,
      other_type_of_leave: null,
      no_days_applied: null,
      inclusive_date_from: null,
      inclusive_date_to: null,
      commutation: null,
      recommending_status: null,
      recommending_status_temp: null,
      recommending_remarks: null,
      selected_details_of_leave: null,
      vl_credit: null,
      sl_credit: null,
      less_vl_credit: null,
      less_sl_credit: null,
      bal_vl_credit: null,
      bal_sl_credit: null,
      recommending_name: null,
      final_approval_name: null,
      empIDToView: null,
      final_approval_user_remarks: null,
      app_days_w_pay: null,
      app_days_wo_pay: null,
      app_days_others: null,
      is_final_approval_disapproved: null,
      is_final_approval_disapproved_temp: null,
      isHeadPresident: null,
      hr_personnel_name: null,
      ctoNumApp: [],
      indexToUpdate: null,
      inclusiveDateString: null,
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
    getDateToday() {
      let d = new Date();
      let date =
        d.getFullYear() +
        "-" +
        (d.getMonth() + 1 <= 9 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1) +
        "-" +
        d.getDate();
      return date;
      // return moment(date).format("YY/MM/DD");
    },
    getInclusiveDateString() {
      let dateString = "";
      for (let i = 0; i < this.ctoNumApp.length; i++) {
        if (dateString == "") {
          dateString =
            this.formatDate(this.ctoNumApp[i].cto_date_from) +
            "-" +
            this.formatDate(this.ctoNumApp[i].cto_date_from);
        } else {
          dateString +=
            " / " +
            this.formatDate(this.ctoNumApp[i].cto_date_from) +
            "-" +
            this.formatDate(this.ctoNumApp[i].cto_date_from);
        }
      }
      return dateString;
    },
  },
  watch: {
    data: {
      handler(data) {
        this.dialog = true;
        console.log("ehehe", data);
        this.loadAllTypeOfLeave();

        if (
          data.type_of_leave_ID == 14 &&
          data.selected_details_of_leave == 1
        ) {
          this.isMonitization = true;
        } else {
          this.isMonitization = false;
        }

        this.id = data.id;
        this.attachments = data.attachments ? data.attachments : [];
        this.empID = data.empID;
        this.user_approval_type = data.user_approval_type;
        this.fname = data.aplcnt_fname;
        this.mname = data.aplcnt_mname;
        this.lname = data.aplcnt_lname;
        this.office = data.office;
        this.position = data.position;

        this.is_final_approval_disapproved = data.is_final_approval_disapproved;
        this.ctoNumApp = data.ctoNumApp;
        if (data.ctoNumApp.length > 0) {
          this.inclusiveDateString = this.getInclusiveDateString;
        } else {
          this.inclusiveDateString =
            this.formatDate(data.inclusive_date_from) +
            "-" +
            this.formatDate(data.inclusive_date_to);
        }
        this.date_filed = data.date_filed
          ? this.formatDate(data.date_filed)
          : this.formatDate(data.created_at);
        this.type_of_leave_ID = data.type_of_leave_ID;
        if (data.type_of_leave_ID == 1 || data.type_of_leave_ID == 6) {
          this.details_of_leave = data.details_of_leave;
        } else if (data.type_of_leave_ID == 3) {
          this.details_of_leave = data.details_of_leave;
        } else if (data.type_of_leave_ID == 11) {
          this.details_of_leave = data.details_of_leave;
        }

        this.selected_details_of_leave = data.selected_details_of_leave;
        // this.inclusive_date_from = this.formatDate(data.inclusive_date_from);
        // this.inclusive_date_to = this.formatDate(data.inclusive_date_to);
        this.no_days_applied = data.no_days_applied;
        this.vl_credit = data.vl_total_earned;
        this.sl_credit = data.sl_total_earned;
        this.less_sl_credit = data.sl_less;
        this.less_vl_credit = data.vl_less;
        this.bal_vl_credit = data.vl_balance;
        this.bal_sl_credit = data.sl_balance;
        if (data.type_of_leave_ID == 1) {
          //vacation leave
          this.app_days_w_pay = data.app_days_w_pay;
          this.app_days_wo_pay = data.app_days_wo_pay;
          this.app_days_others = data.app_days_others;
        } else if (data.type_of_leave_ID == 2) {
          //Force leave
          this.app_days_w_pay = data.app_days_w_pay;
          this.app_days_wo_pay = data.app_days_wo_pay;
          this.app_days_others = data.app_days_others;
        } else if (data.type_of_leave_ID == 3) {
          //sick leave
          this.app_days_w_pay = data.app_days_w_pay;
          this.app_days_wo_pay = data.app_days_wo_pay;
          this.app_days_others = data.app_days_others;
        } else {
          this.app_days_w_pay = data.app_days_w_pay;
          this.app_days_wo_pay = data.app_days_wo_pay;
          this.app_days_others = data.app_days_others;
        }

        this.commutation = data.commutation;

        if (data.is_final_approval_disapproved == null) {
          this.is_final_approval_disapproved_temp = null;
        } else if (data.is_final_approval_disapproved == 0) {
          this.is_final_approval_disapproved_temp = 1;
        } else {
          this.is_final_approval_disapproved_temp = 2;
        }

        this.loadUserDetail("HR PERSONNEL", data.hr_officer_user_detailID);
        if (data.recommending_user_detailID != null) {
          this.loadUserDetail("RECOMMENDING", data.recommending_user_detailID);
          this.recommending_status = data.recommending_status;
          this.recommending_remarks = data.recommending_remarks;
          this.recommending_status_temp = data.recommending_status;

          this.isHeadPresident = false;
        } else {
          this.recommending_status = null;
          this.recommending_remarks = null;
          this.recommending_name = null;
          this.recommending_status_temp = null;
          this.isHeadPresident = true;
        }

        this.loadUserDetail(
          "FINAL APPROVAL",
          data.final_approval_user_detailID
        );
      },
      deep: true,
    },
  },

  methods: {
    viewFile(file) {
      this.filename = null;
      setTimeout(() => {
        this.filename = file;
      }, 50);
    },
    viewEmpLeave() {
      this.empIDToView = null;
      setTimeout(() => {
        this.empIDToView = { empID: this.empID, id: this.id };
      }, 50);
    },

    confirmDialogBtn(action) {
      this.confirmAction = action;
      this.confirmDialog = true;
    },

    loadAllTypeOfLeave() {
      this.axiosCall("/types-of-leave", "GET").then((res) => {
        if (res) {
          this.typesOfLeaveList = res.data;
        }
      });
    },

    getEmploymentStatus() {
      this.axiosCall("/employee/getEmploymentStatus/" + this.id, "GET").then(
        (res) => {
          if (res) {
            this.empStatus = res.data.positionID;
          }
        }
      );
    },

    loadUserDetail(signatory, id) {
      this.axiosCall("/user-details/getSpecificUser/" + id, "GET").then(
        (res) => {
          if (signatory == "RECOMMENDING") {
            this.recommending_name = res.data.mname
              ? res.data.fname + " " + res.data.mname[0] + ". " + res.data.lname
              : res.data.fname + " " + res.data.lname;
          } else if (signatory == "FINAL APPROVAL") {
            this.final_approval_name = res.data.mname
              ? res.data.fname + " " + res.data.mname[0] + ". " + res.data.lname
              : res.data.fname + " " + res.data.lname;
          } else if (signatory == "HR PERSONNEL") {
            this.hr_personnel_name = res.data.mname
              ? res.data.fname + " " + res.data.mname[0] + ". " + res.data.lname
              : res.data.fname + " " + res.data.lname;
          }
        }
      );
    },

    save() {
      if (this.user_approval_type == 1) {
        if (this.$refs.LeaveApprovalFormref.validate()) {
          let data = {
            id: this.id,
            user_approval_type: this.user_approval_type,
            recommending_status: this.recommending_status_temp,
            recommending_remarks: this.recommending_remarks,
          };

          this.axiosCall("/leaves/approve-leave", "POST", data).then((res) => {
            if (res.data.status == 200) {
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "success";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
              this.closeD();
            } else if (res.data.status == 400) {
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
          this.fadeAwayMessage.message = "Please fill in all required fields!";
        }
      } else if (this.user_approval_type == 2) {
        if (this.$refs.LeaveApprovalFormref.validate()) {
          let data = {
            id: this.id,
            user_approval_type: this.user_approval_type,
            is_final_approval_disapproved:
              this.is_final_approval_disapproved_temp == 2 ? true : false,
            final_approval_user_remarks: this.final_approval_user_remarks,
            app_days_w_pay:
              this.is_final_approval_disapproved_temp == 2
                ? null
                : this.app_days_w_pay,
            app_days_wo_pay:
              this.is_final_approval_disapproved_temp == 2
                ? null
                : this.app_days_wo_pay,
            app_days_others:
              this.is_final_approval_disapproved_temp == 2
                ? null
                : this.app_days_others,
          };
          console.log("leave approval", data);
          this.axiosCall("/leaves/approve-leave", "POST", data).then((res) => {
            if (res.data.status == 200) {
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "success";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
              this.closeD();
            } else if (res.data.status == 400) {
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "error";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
            }
          });
        }
      }
    },

    closeD() {
      this.eventHub.$emit("closeViewLeaveApprovalDialog", false);
      this.dialog = false;
    },
  },
};
</script>
<style scoped>
.line_border {
  border-bottom: 1px solid darkgray;
}
table {
  width: 100%;
}
td {
  padding: 10px;
}
table,
td {
  border-collapse: collapse !important;
  border: 1px solid grey;
}
::v-deep .centered-input input {
  text-align: center;
}
</style>
