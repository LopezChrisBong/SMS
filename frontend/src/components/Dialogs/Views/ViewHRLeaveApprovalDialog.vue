<template>
  <div>
    <v-dialog v-model="dialog" eager persistent scrollable fullscreen>
      <v-card>
        <v-card-title dark class="dialog-header pt-2 pb-2 pl-6">
          <span>Application For Leave</span>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="closeD()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text style="max-height: 900px" class="my-4">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-stepper alt-labels class="elevation-0">
                  <v-stepper-header>
                    <v-stepper-step
                      step="1"
                      class="pa-5"
                      :complete="certifying_hr_status == 2 ? true : false"
                      :rules="[() => certifying_hr_status != 3]"
                      color="#6DB249"
                    >
                      {{ certifying_hr_officer }}
                      <small>Certifying HR Officer<br /> </small>
                    </v-stepper-step>
                    <v-divider></v-divider>

                    <v-stepper-step
                      class="pa-5"
                      step="2"
                      :complete="hr_status == 2 ? true : false"
                      :rules="[() => hr_status != 3]"
                      color="#6DB249"
                    >
                      {{
                        tab == 1
                          ? $store.state.user.mname
                            ? $store.state.user.fname +
                              " " +
                              $store.state.user.mname[0] +
                              ". " +
                              $store.state.user.lname
                            : $store.state.user.fname +
                              " " +
                              $store.state.user.lname
                          : hr_officer
                      }}
                      <small>Approving HR Officer<br /> </small>
                    </v-stepper-step>
                  </v-stepper-header>
                </v-stepper>
              </v-col>
              <v-col cols="12">
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
                      style="background-color:#C0C0C0;"
                      height="20"
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
                          :value="item.id"
                          :checked="item.id == type_of_leave_ID"
                        />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <label class="text-subtitle-1"
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
                          >In case of Vacation/Special Previledge Leave</i
                        >
                        <div>
                          <div class="d-flex mt-2">
                            <div style="width:50%">
                              <input
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
                                :checked="type_of_leave_ID == 11"
                                type="checkbox"
                              />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              <label class="text-subtitle-1"
                                >(Specify Illness)</label
                              >
                            </div>
                            <div style="width:50%" class="line_border">
                              {{
                                type_of_leave_ID == 11 ? details_of_leave : ""
                              }}
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
                        <i class="text-caption font-weight-bold"
                          >Other Purpose</i
                        >
                        <div>
                          <div class="d-flex  mt-2">
                            <div>
                              <input
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
                              :checked="commutation == 2"
                              type="checkbox"
                            />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <label class="text-subtitle-1">Not Requested</label>
                          </div>
                        </div>
                        <div class="d-flex  ml-4">
                          <div style="width:50%">
                            <input
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
                    <td colspan="2" style="position:relative">
                      <div class="text-body-1" style="position:absolute; top:0">
                        7.A CERTIFICATION OF LEAVE CREDITS
                      </div>

                      <div class="mt-6 mb-16">
                        <div class="d-flex justify-end">
                          <v-btn
                            v-if="tab != 4"
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
                      <!-- <div
                    class="text-center mt-10 mb-2 ml-10"
                    style="position:absolute; bottom:0;width:90%;"
                  >
                    <div
                      style="height:20px"
                      class="line_border  font-weight-bold"
                    >
                      {{
                        this.$store.state.user.fname +
                          " " +
                          this.$store.state.user.lname
                      }}
                    </div>
                    <div>(Authorized Officer)</div>
                  </div> -->
                    </td>
                    <!-- <td style="width:40%; position:relative">
                  <div class="text-body-1" style="position:absolute; top:0">
                    7.B RECOMMENDATION
                  </div>
                  <div style="margin-top:-40px">
                    <div class="d-flex  ml-4">
                      <v-checkbox
                        readonly
                        label="For Approval"
                        value="1"
                      ></v-checkbox>
                    </div>
                    <div class="d-flex ml-4">
                      <div style="width:50%">
                        <v-checkbox
                          readonly
                          label="For disapproval due to"
                          value="2"
                        ></v-checkbox>

                      
                      </div>
                      <div style="width:50%" class="line_border"></div>
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
                </td> -->
                  </tr>
                  <tr>
                    <td
                      style="width:60%;position:relative; border-right:none; border-bottom:none"
                    >
                      <div class="text-body-1" style="position:absolute; top:0">
                        7.C APPROVED FOR
                      </div>
                      <div class="d-flex mt-4" style="width:50%">
                        <div
                          class="line_border   text-center font-weight-bold"
                          style="width:50%"
                        >
                          {{ app_days_w_pay }}
                        </div>
                        <div class="text-subtitle-1" style="width:50%">
                          days with pay
                        </div>
                      </div>
                      <div class="d-flex" style="width:50%">
                        <div
                          class="line_border  text-center font-weight-bold"
                          style="width:50%"
                        >
                          {{ app_days_wo_pay }}
                        </div>
                        <div class="text-subtitle-1" style="width:50%">
                          days without pay
                        </div>
                      </div>
                      <div class="d-flex" style="width:50%">
                        <div class="line_border" style="width:50%"></div>
                        <div class="text-subtitle-1" style="width:50%">
                          other (Specify)
                        </div>
                      </div>
                    </td>
                    <td
                      style="width:40%; position:relative; border-left:none; border-bottom:none"
                    >
                      <div class="text-body-1" style="position:absolute; top:0">
                        7.D DISAPPROVED DUE TO:
                      </div>
                      <div class="ml-10 line_border" style="width:90%"></div>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" align="center" style=" border-top:none;">
                      <!-- <div class="mt-10" style="width:40%">
                        <div class="line_border  font-weight-bold">
                          {{ final_approval_name }}
                        </div>
                        <div>(Authorized Official)</div>
                      </div> -->
                    </td>
                  </tr>
                </table>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>

        <v-card-actions class="pa-5">
          <v-fab-transition>
            <v-menu top>
              <template v-slot:activator="{ on }">
                <v-btn
                  color="#5a67da"
                  fab
                  dark
                  left
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
          <v-btn v-if="tab == 1" @click="addRemarks()" color="red" outlined>
            <v-icon>mdi-close</v-icon>
            Pending
          </v-btn>
          <v-btn
            v-if="tab == 1"
            color="#5a67da"
            class="white--text"
            @click="approve()"
          >
            <v-icon>mdi-check</v-icon>
            Certify
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
              <v-col cols="12">
                <v-textarea
                  v-model="remarksMsg"
                  :rules="[formRules.required]"
                  dense
                  placeholder="Type remarks here..."
                  outlined
                  rows="5"
                  required
                  class="rounded-lg"
                  color="#6DB249"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" outlined @click="addRemarksDialog = false">
              Close
            </v-btn>
            <v-btn
              color="green"
              class="white--text"
              @click="savePendingRemarks()"
            >
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
      addRemarksDialog: false,
      filename: null,
      empID: null,
      remarksData: [],
      remarksMsg: null,
      attachments: [],
      dialog: false,
      typesOfLeaveList: [],
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
      recommeding_approval: null,
      recommending_remarks: null,
      selected_details_of_leave: null,
      empIDToView: null,
      vl_credit: null,
      sl_credit: null,
      less_vl_credit: null,
      less_sl_credit: null,
      bal_vl_credit: null,
      bal_sl_credit: null,
      app_days_w_pay: null,
      app_days_wo_pay: null,
      app_days_others: null,
      recommending_name: null,
      final_approval_name: null,
      indexToUpdate: null,
      certifying_hr_officer: null,
      certifying_hr_status: null,
      hr_officer: null,
      hr_status: null,
      ctoNumApp: [],
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
        console.log(data);
        this.loadAllTypeOfLeave();
        this.loadRemarks(data.id);
        this.attachments = data.attachments ? data.attachments : [];
        this.id = data.id;
        this.empID = data.empID;
        this.fname = data.aplcnt_fname;
        this.mname = data.aplcnt_mname;
        this.lname = data.aplcnt_lname;
        this.office = data.office;
        this.position = data.position;
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
        this.ctoNumApp = data.ctoNumApp;
        console.log("cto", data.ctoNumApp);
        if (data.ctoNumApp.length > 0) {
          this.inclusiveDateString = this.getInclusiveDateString;
        } else {
          if (!data.inclusive_date_from && !data.inclusive_date_to) {
            this.inclusiveDateString = "";
          } else {
            this.inclusiveDateString =
              this.formatDate(data.inclusive_date_from) +
              "-" +
              this.formatDate(data.inclusive_date_to);
          }
        }
        this.selected_details_of_leave = data.selected_details_of_leave;
        // this.inclusive_date_from = this.formatDate(data.inclusive_date_from);
        // this.inclusive_date_to = this.formatDate(data.inclusive_date_to);
        this.no_days_applied = data.no_days_applied;
        this.vl_credit = data.vl_total_earned;
        this.sl_credit = data.sl_total_earned;
        this.less_vl_credit = data.vl_less;
        this.less_sl_credit = data.sl_less;
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
        this.hr_status = data.hr_status;
        this.certifying_hr_status = data.certifying_hr_status;
        this.loadUserDetail(
          "Certify",
          data.certifying_hr_officer_user_detailID
        );
        this.hr_officer = null;
        if (data.certifying_hr_status == 2) {
          this.loadUserDetail("HR", data.hr_officer_user_detailID);
        }
        // this.loadLeaveCredits(data.empID);
      },
      deep: true,
    },
  },

  methods: {
    computeAnnual(value) {
      var annual = 0;
      for (let index = 0; index < 12; index++) {
        annual += parseFloat(value);
      }
      return annual;
    },
    confirmDialogBtn(action) {
      this.confirmAction = action;
      this.confirmDialog = true;
    },
    viewEmpLeave() {
      this.empIDToView = null;
      setTimeout(() => {
        this.empIDToView = { empID: this.empID, id: this.id };
      }, 50);
    },

    addRemarks() {
      this.addRemarksDialog = true;
      this.$refs.RemarksFormref.reset();
    },
    viewFile(file) {
      this.filename = null;
      setTimeout(() => {
        this.filename = file;
      }, 50);
    },

    loadAllTypeOfLeave() {
      this.axiosCall("/types-of-leave", "GET").then((res) => {
        if (res) {
          console.log(res.data);
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
          if (signatory == "Certify") {
            this.certifying_hr_officer = res.data.mname
              ? res.data.fname + " " + res.data.mname[0] + ". " + res.data.lname
              : res.data.fname + " " + res.data.lname;
          } else if (signatory == "HR") {
            this.hr_officer = res.data.mname
              ? res.data.fname + " " + res.data.mname[0] + ". " + res.data.lname
              : res.data.fname + " " + res.data.lname;
          }
        }
      );
    },

    loadLeaveCredits(id) {
      this.axiosCall("/employee-accum-leaves/employee/" + id, "GET").then(
        (res) => {
          if (res) {
            this.vl_credit = res.data.vl_credit;
            this.sl_credit = res.data.sl_credit;
            if (this.type_of_leave_ID == 1) {
              this.less_vl_credit = this.no_days_applied;
              this.less_sl_credit = 0;
              this.bal_vl_credit =
                parseFloat(this.vl_credit) - parseFloat(this.no_days_applied);
              this.bal_sl_credit = this.sl_credit;
            } else if (this.type_of_leave_ID == 3) {
              this.less_sl_credit = this.no_days_applied;
              this.less_vl_credit = 0;
              this.bal_sl_credit =
                parseFloat(this.sl_credit) - parseFloat(this.no_days_applied);
              this.bal_vl_credit = this.vl_credit;
            } else {
              this.less_sl_credit = 0;
              this.less_vl_credit = 0;
              this.bal_vl_credit = this.vl_credit;
              this.bal_sl_credit = this.sl_credit;
            }
          }
        }
      );
    },

    editItem(index, item) {
      this.addRemarksDialog = true;
      this.remarks = item.remarks;

      this.indexToUpdate = index;
      this.$refs.RemarksFormref.reset();
      console.log(index, item);
    },

    saveUpdate() {
      if (this.$refs.RemarksFormref.validate()) {
        this.serviceRecordData[this.indexToUpdate].remarks = this.remarks;
        this.serviceRecordData[this.indexToUpdate].rate_per_day = this.salary;
        this.addRemarksDialog = false;
      }
    },

    approve() {
      let data = {
        id: this.id,
      };
      this.axiosCall("/leaves/hr-approve-leave", "POST", data).then((res) => {
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
    },

    savePendingRemarks() {
      if (this.$refs.RemarksFormref.validate()) {
        let data = {
          leaveID: this.id,
          remarksMsg: this.remarksMsg,
        };
        this.axiosCall("/leaves/pendingBy/hr", "POST", data).then((res) => {
          if (res.data.status == 200) {
            this.addRemarksDialog = false;
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
    },

    loadRemarks(id) {
      this.axiosCall("/remarks/" + id + "/LEAVE", "GET").then((res) => {
        if (res.data) {
          this.remarksData = res.data;
        }
      });
    },

    closeD() {
      this.eventHub.$emit("closeViewHRLeaveApprovalDialog", false);
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
</style>
