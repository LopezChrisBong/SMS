<template>
  <div>
    <v-dialog
      v-model="dialog"
      fullscreen
      persistent
      scrollable
      max-width="800px"
    >
      <v-card>
        <v-card-title dark class="dialog-header">
          <span v-if="action == 'Apply'"> {{ action }} for Leave</span>
          <span v-if="action == 'Update'"> Update Application for Leave</span>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="close()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text
          style="max-height: 780px; max-width:1300px; margin: 0 auto; "
          class="mt-4"
        >
          <v-form class="mt-5" ref="MyLeaveFormref" @submit.prevent>
            <v-row>
              <v-col cols="12">
                <v-autocomplete
                  label="Types of Leave to be Availed"
                  @change="reset()"
                  v-model="selected_type_of_leave"
                  :rules="[formRules.required]"
                  dense
                  :readonly="action == 'View'"
                  outlined
                  class="rounded-lg"
                  :item-text="getItemText"
                  item-value="id"
                  color="#93CB5B"
                  :items="type_of_leave_list"
                >
                </v-autocomplete>
              </v-col>

              <v-col cols="12" v-if="selected_type_of_leave">
                <!-- vacation and special previledge leave -->
                <v-autocomplete
                  v-if="
                    selected_type_of_leave == 1 || selected_type_of_leave == 6
                  "
                  label="Details of Leave"
                  v-model="selected_details_of_leave"
                  :rules="
                    selected_type_of_leave == 1 || selected_type_of_leave == 6
                      ? [formRules.required]
                      : []
                  "
                  :readonly="action == 'View'"
                  dense
                  outlined
                  class="rounded-lg"
                  item-text="type"
                  item-value="id"
                  color="#93CB5B"
                  :items="details_of_leave_vacation_special_previledge"
                >
                </v-autocomplete>

                <v-text-field
                  v-if="
                    selected_type_of_leave == 1 || selected_type_of_leave == 6
                  "
                  v-model="place"
                  :readonly="action == 'View'"
                  dense
                  outlined
                  :rules="
                    selected_type_of_leave == 1 || selected_type_of_leave == 6
                      ? [formRules.required]
                      : []
                  "
                  class="mt-2"
                  required
                  label="Specify"
                  color="#93CB5B"
                ></v-text-field>

                <!-- sick leave details -->
                <v-autocomplete
                  v-if="selected_type_of_leave == 3"
                  label="Details of Leave"
                  :readonly="action == 'View'"
                  v-model="selected_details_of_leave"
                  :rules="
                    selected_type_of_leave == 3 ? [formRules.required] : []
                  "
                  dense
                  outlined
                  class="rounded-lg"
                  item-text="type"
                  item-value="id"
                  color="#93CB5B"
                  :items="details_of_leave_sick"
                >
                </v-autocomplete>

                <v-text-field
                  v-if="selected_type_of_leave == 3"
                  v-model="illness"
                  dense
                  outlined
                  :rules="
                    selected_type_of_leave == 3 ? [formRules.required] : []
                  "
                  class="mt-2"
                  :readonly="action == 'View'"
                  required
                  label="Please specify illness"
                  color="#93CB5B"
                ></v-text-field>
                <!-- study leave -->
                <v-autocomplete
                  v-if="selected_type_of_leave == 8"
                  label="Details of Leave"
                  v-model="selected_details_of_leave"
                  :readonly="action == 'View'"
                  :rules="
                    selected_type_of_leave == 8 ? [formRules.required] : []
                  "
                  dense
                  outlined
                  class="rounded-lg"
                  item-text="type"
                  item-value="id"
                  color="#93CB5B"
                  :items="details_of_leave_study_leave"
                >
                </v-autocomplete>
                <!-- Special Benefit for women -->

                <v-textarea
                  v-if="selected_type_of_leave == 11"
                  v-model="spcl_leave_bnft_details"
                  :rules="
                    selected_type_of_leave == 11 ? [formRules.required] : []
                  "
                  dense
                  :readonly="action == 'View'"
                  outlined
                  required
                  label="Specify Illness"
                  color="#93CB5B"
                ></v-textarea>
                <!-- other purposes -->
                <v-autocomplete
                  v-if="selected_type_of_leave == 14"
                  label="Other Purpose"
                  @change="changeSelectedDetails()"
                  v-model="selected_details_of_leave"
                  :rules="
                    selected_type_of_leave == 14 ? [formRules.required] : []
                  "
                  :readonly="action == 'View'"
                  dense
                  outlined
                  class="rounded-lg"
                  item-text="type"
                  item-value="id"
                  color="#93CB5B"
                  :items="other_purposes_list"
                >
                </v-autocomplete>
              </v-col>

              <v-col cols="12" v-if="selected_details_of_leave == 3">
                <div
                  class="pa-2 "
                  style="border:1px solid grey; border-radius:10px"
                >
                  <v-btn
                    v-if="action != 'View'"
                    color="#6DB249"
                    class="white--text mb-2"
                    @click="addCto()"
                    >Add</v-btn
                  >
                  <table class="my-2">
                    <tr>
                      <th width="30%">Number of Hours</th>
                      <th width="20%">AM/PM</th>
                      <!-- <th width="20%">Date From</th>
                      <th width="20%">Date To</th> -->

                      <th width="20%">Inclusive Date</th>
                      <th width="10%" v-if="action != 'View'">Action</th>
                    </tr>
                    <tbody v-if="ctoNumApp.length == 0">
                      <tr>
                        <td colspan="5" align="center">
                          <span><i>No data found!</i></span>
                        </td>
                      </tr>
                    </tbody>
                    <tbody v-else>
                      <tr v-for="(item, i) in ctoNumApp" :key="i">
                        <td align="center">
                          {{ item.cto_num_hours_applied }} Hours
                        </td>
                        <td align="center">
                          {{ item.cto_am_pm }}
                        </td>
                        <td align="center">
                          {{ formatDate(item.cto_date_from) }}
                        </td>
                        <!-- <td align="center">
                          {{ formatDate(item.cto_date_to) }}
                        </td> -->
                        <td v-if="action != 'View'">
                          <div class="d-flex justify-space-around">
                            <v-btn
                              x-small
                              outlined
                              class="mx-1"
                              color="warning"
                              @click="editCto(item, i)"
                              >Edit</v-btn
                            ><v-btn
                              class="mx-1"
                              x-small
                              outlined
                              color="red"
                              @click="removeCto(item, i)"
                              >Remove</v-btn
                            >
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </v-col>

              <v-col
                cols="12"
                v-if="
                  selected_type_of_leave == 3 ||
                    selected_type_of_leave == 4 ||
                    selected_type_of_leave == 5 ||
                    selected_type_of_leave == 7 ||
                    selected_type_of_leave == 9 ||
                    selected_type_of_leave == 10 ||
                    selected_type_of_leave == 11 ||
                    selected_type_of_leave == 12 ||
                    selected_type_of_leave == 13
                "
              >
                <v-btn
                  v-if="action != 'View'"
                  @click="uploadFile()"
                  color="#6DB249"
                  class="white--text mb-2"
                  >Upload file</v-btn
                >
                <div class="elevation-2 rounded-lg ">
                  <div
                    class="d-flex justify-space-between  elevation-1 px-2 py-2 white--text"
                    style="background-color:#5a67da"
                  >
                    <h3 class="text-subtitle-2 text-center" style="width:35%;">
                      Description
                    </h3>
                    <h3 class="text-subtitle-2 text-center" style="width:35%;">
                      File
                    </h3>
                    <h3 class="text-subtitle-2 text-center" style="width:30%; ">
                      Action
                    </h3>
                  </div>
                  <div v-if="files_to_display.length > 0">
                    <div
                      v-for="(file, i) in files_to_display"
                      :key="i"
                      class="d-flex justify-space-between px-2 mt-1"
                    >
                      <h3
                        class="text-subtitle-1 text-center"
                        style="width:35%; "
                      >
                        {{ file.description }}
                      </h3>
                      <h3
                        class="text-subtitle-1 text-center"
                        style="width:35%; "
                      >
                        {{ file.filename }}
                      </h3>
                      <div class=" text-center" style="width:30%;">
                        <v-btn icon color="#C62828" @click="removeFile(file, i)"
                          ><v-icon>mdi-close-circle-outline</v-icon></v-btn
                        >
                      </div>
                    </div>
                  </div>
                  <div
                    class="text-center py-1"
                    v-if="files_to_display.length == 0"
                  >
                    <span class="text-caption"><i>No file/s uploaded.</i></span>
                  </div>
                </div>
              </v-col>

              <v-col
                cols="12"
                md="6"
                sm="6"
                v-if="
                  selected_details_of_leave != 3 && selected_type_of_leave != 14
                "
              >
                <v-menu
                  ref="incDateFrom"
                  :close-on-content-click="false"
                  :return-value.sync="inclusive_date_from"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      outlined
                      color="#6DB249"
                      dense
                      v-model="inclusive_date_from"
                      :rules="
                        selected_details_of_leave != 3
                          ? [formRules.required]
                          : []
                      "
                      chips
                      small-chips
                      label="Inclusive Date (FROM)"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="inclusive_date_from"
                    :min="
                      selected_type_of_leave == 1 ||
                      selected_type_of_leave == 2 ||
                      selected_type_of_leave == 7 ||
                      selected_type_of_leave == 8
                        ? nowDate
                        : null
                    "
                    no-title
                    scrollable
                    color="#6DB249"
                  >
                    <v-spacer></v-spacer>

                    <v-btn
                      v-if="action == 'Apply' || action == 'Update'"
                      text
                      color="#6DB249"
                      @click="
                        $refs.incDateFrom.save(inclusive_date_from);
                        getNumberOfDays();
                      "
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>

              <v-col
                cols="12"
                md="6"
                sm="6"
                v-if="
                  selected_details_of_leave != 3 && selected_type_of_leave != 14
                "
              >
                <v-menu
                  ref="incDateTo"
                  :close-on-content-click="false"
                  :return-value.sync="inclusive_date_to"
                  transition="scale-transition"
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      outlined
                      color="#6DB249"
                      dense
                      v-model="inclusive_date_to"
                      :rules="
                        selected_details_of_leave != 3
                          ? [formRules.required]
                          : []
                      "
                      chips
                      small-chips
                      label="Inclusive Date (TO)"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="inclusive_date_to"
                    no-title
                    :min="inclusive_date_from ? inclusive_date_from : null"
                    scrollable
                    color="#6DB249"
                  >
                    <v-spacer></v-spacer>

                    <v-btn
                      v-if="action == 'Apply' || action == 'Update'"
                      text
                      color="#6DB249"
                      @click="
                        $refs.incDateTo.save(inclusive_date_to);
                        getNumberOfDays();
                      "
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>

              <v-col cols="12" v-if="selected_details_of_leave != 3">
                <v-text-field
                  v-model="no_of_working_days_applied"
                  :rules="
                    selected_type_of_leave == 4
                      ? [
                          (v) =>
                            parseInt(v) <= 105 ||
                            'Value should not exceed 105.',
                        ]
                      : selected_type_of_leave == 3
                      ? [
                          (v) =>
                            parseFloat(v) == 0.5 ||
                            parseFloat(v) >= 1 ||
                            'Invalid!',
                        ]
                      : selected_details_of_leave != 3
                      ? [formRules.numberRequired]
                      : []
                  "
                  :readonly="action == 'View' || selected_type_of_leave != 3"
                  dense
                  outlined
                  required
                  label="Number of Working Days Applied for"
                  color="#93CB5B"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <div style="border:1px solid #A9A9A9" class="rounded-lg py-2">
                  <div class="text-body-1 ml-4">
                    Commutation
                  </div>

                  <div class="d-flex justify-space-around">
                    <v-checkbox
                      v-model="commutation"
                      label="Requested"
                      color="#6DB249"
                      :rules="[formRules.required]"
                      :readonly="action == 'View'"
                      :value="1"
                      :checked="commutation == 1 ? true : false"
                    ></v-checkbox>
                    <v-checkbox
                      v-model="commutation"
                      label="Not Requested"
                      :rules="[formRules.required]"
                      :readonly="action == 'View'"
                      color="#6DB249"
                      :value="2"
                      :checked="commutation == 2 ? true : false"
                    ></v-checkbox>
                  </div>
                </div>
                <!-- <v-checkbox
                  v-model="commutation"
                  label="REQUESTED"
                  color="#6DB249"
                  :value="1"
                  :checked="commutation == 1 ? true : false"
                ></v-checkbox> -->
              </v-col>

              <v-col cols="12">
                <v-autocomplete
                  @change="checkIfHeadIsPresident()"
                  :label="
                    isHeadPresident
                      ? 'Authorized Officer'
                      : 'Recommending Officer'
                  "
                  v-model="recommending_userID"
                  :rules="[formRules.required]"
                  dense
                  :readonly="action == 'View'"
                  outlined
                  class="rounded-lg"
                  item-text="name"
                  item-value="user_detailID"
                  color="#93CB5B"
                  :items="recommendingUsersList"
                >
                </v-autocomplete>
                <!-- <v-text-field
                  :rules="[formRules.required]"
                  dense
                  v-model="recommending_name"
                  readonly
                  outlined
                  required
                  :label="
                    isHeadPresident
                      ? 'Authorized Officer'
                      : 'Recommending Officer'
                  "
                  color="#93CB5B"
                ></v-text-field> -->
              </v-col>
              <v-col v-if="!isHeadPresident" cols="12">
                <v-autocomplete
                  label="Authorized Officer"
                  v-model="final_approval_user_detailID"
                  :rules="!isHeadPresident ? [formRules.required] : []"
                  dense
                  :readonly="action == 'View'"
                  outlined
                  class="rounded-lg"
                  item-text="name"
                  item-value="id"
                  color="#93CB5B"
                  :items="usersList"
                >
                </v-autocomplete>
              </v-col>
            </v-row>
          </v-form>
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
          <v-btn
            color="red"
            outlined
            @click="
              close();
              dialog = false;
            "
          >
            <v-icon>mdi-close-circle-outline</v-icon>
            Cancel
          </v-btn>
          <v-btn
            v-if="action == 'Apply'"
            color="#5a67da"
            class="white--text"
            @click="alertUser()"
          >
            <v-icon>mdi-check-circle</v-icon>
            Apply
          </v-btn>
          <v-btn
            v-if="
              action == 'Update' &&
                (certifying_hr_status == null ||
                  certifying_hr_status == 1 ||
                  certifying_hr_status == 3 ||
                  hr_status == null ||
                  hr_status == 1 ||
                  hr_status == 3)
            "
            color="#5a67da"
            class="white--text"
            @click="alertUser()"
          >
            <v-icon>mdi-check-circle</v-icon>
            Update Details
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- updloading of file dialog -->
    <v-dialog
      v-model="fileUploadDialog"
      transition="dialog-bottom-transition"
      max-width="400px"
    >
      <v-card>
        <v-card-title dark class="dialog-header">
          <span>Upload file</span>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="closeUploadDialog()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="mt-4">
          <v-form
            ref="uploadFileRef"
            enctype="multipart/form-data"
            @submit.prevent
          >
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="file_desc"
                  :rules="[formRules.required]"
                  dense
                  outlined
                  required
                  label="Description"
                  class="rounded-lg"
                  color="#6DB249"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-file-input
                  v-model="file_selected"
                  accept="application/pdf,image/x-png,image/gif,image/jpeg"
                  outlined
                  :rules="[formRules.required]"
                  color="#6DB249"
                  dense
                  label="Upload file"
                ></v-file-input>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn outlined color="red" @click="closeUploadDialog()">Close</v-btn>
          <v-btn outlined color="#6DB249" @click="addAttachment()">save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--confirmation dialog  -->
    <v-dialog
      v-model="confirmDialog"
      transition="dialog-bottom-transition"
      max-width="400px"
    >
      <v-card>
        <v-card-title dark class="dialog-header">
          <span>Leave Application</span>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="confirmDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="mt-4">
          <v-form @submit.prevent>
            <v-row>
              <v-col cols="12">
                <!-- <div class="text-body-1 font-weight-bold">
                  {{ alertMsg }}
                </div> -->
                <div class="text-body-1 font-weight-bold">
                  <div v-html="alertMsg"></div>
                </div>
              </v-col>
              <v-col cols="12">
                <div class="d-flex justify-space-between">
                  <div style="width:50%" class="text-body-1">
                    Days with Pay:
                  </div>
                  <div style="width:50%" class="text-body-1 font-weight-bold">
                    {{ dayWPay }}
                  </div>
                </div>
              </v-col>
              <v-col cols="12">
                <div class="d-flex justify-space-between">
                  <div style="width:50%" class="text-body-1">
                    Days without Pay:
                  </div>
                  <div style="width:50%" class="text-body-1 font-weight-bold">
                    {{ dayWOPay }}
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn outlined color="red" @click="confirmDialog = false"
            >Close</v-btn
          >
          <v-btn
            v-if="isValidToApply"
            outlined
            color="#6DB249"
            @click="confirmAction()"
            >Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- CTO MULTIPLE DATE APPLICATION -->
    <v-dialog
      v-model="ctoAddDialog"
      transition="dialog-bottom-transition"
      max-width="400px"
    >
      <v-card>
        <v-card-title dark class="dialog-header">
          <span>Add</span>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="ctoAddDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="mt-4">
          <v-form @submit.prevent ref="AddCTOFormRef">
            <v-row>
              <v-col cols="12">
                <v-autocomplete
                  label="Number of Working Hours Applied for"
                  v-model="cto_num_hours_applied"
                  dense
                  :rules="[formRules.required]"
                  outlined
                  class="rounded-lg"
                  item-text="text"
                  item-value="value"
                  color="#93CB5B"
                  :items="num_work_app_list"
                >
                </v-autocomplete>
              </v-col>
              <v-col
                cols="12"
                class="py-0 d-flex justify-space-around"
                v-if="cto_num_hours_applied && cto_num_hours_applied == 4"
              >
                <v-checkbox
                  label="AM"
                  v-model="cto_am_pm"
                  value="AM"
                  :checked="cto_am_pm == 'AM'"
                  :rules="
                    this.cto_num_hours_applied == 4 ? [formRules.required] : []
                  "
                ></v-checkbox>
                <v-checkbox
                  label="PM"
                  v-model="cto_am_pm"
                  value="PM"
                  :checked="cto_am_pm == 'PM'"
                  :rules="
                    this.cto_num_hours_applied == 4 ? [formRules.required] : []
                  "
                ></v-checkbox>
              </v-col>
              <!-- <v-col cols="6" class="py-0">
                <v-checkbox
                  label="PM"
                  v-model="cto_am_pm"
                  value="PM"
                  :checked="cto_am_pm == 'PM'"
                  :rules="
                    this.cto_num_hours_applied == 4 ? [formRules.required] : []
                  "
                ></v-checkbox>
              </v-col> -->

              <v-col cols="12">
                <v-menu
                  ref="ctoDateFrom"
                  :close-on-content-click="false"
                  :return-value.sync="cto_date_from"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      outlined
                      color="#6DB249"
                      dense
                      v-model="cto_date_from"
                      :rules="[formRules.required]"
                      chips
                      small-chips
                      label="Inclusive Date"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="cto_date_from"
                    no-title
                    scrollable
                    color="#6DB249"
                  >
                    <v-spacer></v-spacer>

                    <v-btn
                      text
                      color="#6DB249"
                      @click="$refs.ctoDateFrom.save(cto_date_from)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>

              <!-- <v-col cols="12">
                <v-menu
                  ref="ctoDateTo"
                  :close-on-content-click="false"
                  :return-value.sync="cto_date_to"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      outlined
                      color="#6DB249"
                      dense
                      v-model="cto_date_to"
                      :rules="[formRules.required]"
                      chips
                      small-chips
                      label="Inclusive Date (TO)"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="cto_date_to"
                    no-title
                    :min="cto_date_from ? cto_date_from : null"
                    scrollable
                    color="#6DB249"
                  >
                    <v-spacer></v-spacer>

                    <v-btn
                      text
                      color="#6DB249"
                      @click="$refs.ctoDateTo.save(cto_date_to)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col> -->
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn outlined color="red" @click="ctoAddDialog = false"
            >Close</v-btn
          >
          <v-btn outlined color="#6DB249" @click="saveCTOApp()">save</v-btn>
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
      remarksData: [],
      dialog: false,
      confirmDialog: false,
      dayWPay: null,
      dayWOPay: null,

      id: null,
      fileUploadDialog: false,
      nowDate: new Date().toISOString().slice(0, 10),
      type_of_leave_list: [],
      files_to_display: [],
      file_attachments_desc: [],
      file_attachments: [],
      files_to_remove: [],
      file_desc: null,
      file_selected: null,
      details_of_leave_vacation_special_previledge: [
        {
          id: 1,
          type: "Within the Philippines",
        },
        {
          id: 2,
          type: "Abroad",
        },
      ],
      details_of_leave_sick: [
        {
          id: 1,
          type: "In Hospital",
        },
        {
          id: 2,
          type: "Out Patient",
        },
      ],
      details_of_leave_study_leave: [
        {
          id: 1,
          type: "Completion of Master's Degree",
        },
        {
          id: 2,
          type: "BAR/Board Examinatin Review",
        },
      ],
      other_purposes_list: [
        {
          id: 1,
          type: "Monitization of Leave Credits",
        },
        {
          id: 2,
          type: "Terminal Leave",
        },
        {
          id: 3,
          type: "Compensatory Time Off",
        },
      ],
      num_work_app_list: [
        {
          value: 4,
          text: "4 Hours",
        },
        {
          value: 8,
          text: "8 Hours",
        },
        // {
        //   value: 12,
        //   text: "12 Hours",
        // },
      ],
      selected_type_of_leave: null,
      selected_details_of_leave: null,
      spcl_leave_bnft_details: null,
      other_type_of_leave_selected: null,
      no_of_working_days_applied: null,
      inclusive_date_from: null,
      inclusive_date_to: null,
      place: null,
      illness: null,
      recommending_name: null,
      recommending_userID: null,
      final_approval_user_detailID: null,
      commutation: 2,
      hr_status: null,
      certifying_hr_status: null,
      credits_data: null,
      myHiringStatus: null,
      alertMsg: null,
      isValidToApply: null,
      usersList: [],
      recommendingUsersList: [],
      ctoAddDialog: false,
      ctoNumApp: [],
      cto_num_hours_applied: null,
      cto_date_from: null,
      cto_date_to: null,
      cto_am_pm: null,
      indexToUpdate: null,
      isHeadPresident: null,
      presidentUser: null,
      isMyCoretimeHasSaturday: false,
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
        this.getTypeOfLeaves();
        this.getUsers();

        // this.loadRecommendingOfficers();
        this.isValidToApply = null;
        if (data.id) {
          this.id = data.id;

          this.loadRemarks(data.id);
          // hr status 0 for certify, 1 certified, 2 pending
          this.hr_status = data.hr_status;
          this.files_to_remove = [];
          this.selected_type_of_leave = data.type_of_leave_ID;
          this.selected_details_of_leave = data.selected_details_of_leave;
          this.files_to_display = data.attachments;
          if (data.type_of_leave_ID == 1 || data.type_of_leave_ID == 6) {
            this.place = data.details_of_leave;
          } else if (data.type_of_leave_ID == 3) {
            this.illness = data.details_of_leave;
          } else if (data.type_of_leave_ID == 11) {
            this.spcl_leave_bnft_details = data.details_of_leave;
          }
          this.other_type_of_leave_selected = data.other_type_of_leave;
          this.no_of_working_days_applied = data.no_days_applied;
          this.inclusive_date_from = data.inclusive_date_from;
          this.inclusive_date_to = data.inclusive_date_to;
          this.ctoNumApp = data.ctoNumApp;
          this.recommending_userID = data.recommending_user_detailID
            ? data.recommending_user_detailID
            : null;
          this.final_approval_user_detailID = data.final_approval_user_detailID.toString();
          this.commutation = data.commutation;
          this.isValidToApply = true;

          // console.log("recomenfding", data.recommending_user_detailID);
          if (data.recommending_user_detailID != null) {
            this.isHeadPresident = false;
            this.loadDirectHead(data.recommending_user_detailID);
          } else {
            this.isHeadPresident = true;
            this.loadDirectHead(data.final_approval_user_detailID);
          }

          this.loadLeaveCreditBalance();
        } else {
          this.files_to_display = [];

          this.file_attachments_desc = [];
          this.file_attachments = [];
          this.files_to_remove = [];
          // this.checkIfHeadIsPresident();
          this.loadRecommendingOfficers();
          this.loadLeaveCreditBalance();
          // this.getDirectHead();
          this.loadMyHiringStatus();
          this.isCoretimeHasSaturday();

          this.no_of_working_days_applied = null;
          this.$refs.MyLeaveFormref.reset();
        }
      },
      deep: false,
    },
  },

  computed: {
    getTotalCTO() {
      let total = 0;
      for (let i = 0; i < this.ctoNumApp.length; i++) {
        total += this.ctoNumApp[i].cto_num_hours_applied;
      }
      return total;
    },
  },
  mounted() {
    this.loadRecommendingOfficers();
  },

  methods: {
    close() {
      this.eventHub.$emit("closeMyLeaveDialog", false);
      this.dialog = false;
    },

    getNumberOfDays() {
      if (this.inclusive_date_from && this.inclusive_date_to) {
        let dDate1 = new Date(this.inclusive_date_from);
        let dDate2 = new Date(this.inclusive_date_to);

        var iWeeks,
          iDateDiff,
          iAdjust = 0;
        if (dDate2 < dDate1) {
          this.no_of_working_days_applied = null; // error code if dates transposed
        } else {
          if (this.selected_type_of_leave == 4) {
            // let maxDays = 105;
            let Difference_In_Time = dDate2.getTime() - dDate1.getTime();
            let Difference_In_Days = Math.round(
              Difference_In_Time / (1000 * 3600 * 24)
            );
            // if (Difference_In_Days > maxDays) {
            //   this.no_of_working_days_applied = maxDays;
            // } else {
            this.no_of_working_days_applied = Difference_In_Days + 1;
            // }
          } else {
            var iWeekday1 = dDate1.getDay(); // day of week
            var iWeekday2 = dDate2.getDay();

            iWeekday1 = iWeekday1 == 0 ? 7 : iWeekday1; // change Sunday from 0 to 7
            iWeekday2 = iWeekday2 == 0 ? 7 : iWeekday2;

            //check if employee applying has saturday in the coretime
            if (this.isMyCoretimeHasSaturday) {
              if (iWeekday1 > 6 && iWeekday2 > 6) iAdjust = 1; // adjustment if both days on weekend
              iWeekday1 = iWeekday1 > 6 ? 6 : iWeekday1; // only count weekdays and saturday
              iWeekday2 = iWeekday2 > 6 ? 6 : iWeekday2;

              // calculate differnece in weeks (1000mS * 60sec * 60min * 24hrs * 7 days = 604800000)
              iWeeks = Math.floor(
                (dDate2.getTime() - dDate1.getTime()) / 604800000
              );

              if (iWeekday1 <= iWeekday2) {
                //Equal to makes it reduce 5 days
                iDateDiff = iWeeks * 6 + (iWeekday2 - iWeekday1);
              } else {
                iDateDiff = (iWeeks + 1) * 6 - (iWeekday1 - iWeekday2);
              }
            } else {
              if (iWeekday1 > 5 && iWeekday2 > 5) iAdjust = 1; // adjustment if both days on weekend
              iWeekday1 = iWeekday1 > 5 ? 5 : iWeekday1; // only count weekdays
              iWeekday2 = iWeekday2 > 5 ? 5 : iWeekday2;

              // calculate differnece in weeks (1000mS * 60sec * 60min * 24hrs * 7 days = 604800000)
              iWeeks = Math.floor(
                (dDate2.getTime() - dDate1.getTime()) / 604800000
              );

              if (iWeekday1 <= iWeekday2) {
                //Equal to makes it reduce 5 days
                iDateDiff = iWeeks * 5 + (iWeekday2 - iWeekday1);
              } else {
                iDateDiff = (iWeeks + 1) * 5 - (iWeekday1 - iWeekday2);
              }
            }

            iDateDiff -= iAdjust; // take into account both days on weekend
            this.no_of_working_days_applied = iDateDiff + 1;
          }
        }
      }
    },

    loadRecommendingOfficers() {
      this.axiosCall("/my-direct-head/loadRecommendingOfficers", "GET").then(
        (res) => {
          if (res.data) {
            console.log("recommendingListsss", res.data);
            this.presidentUser = res.data.pres_emp;
            let data = res.data.heads;
            data.forEach((element, i) => {
              data[i].name = this.toTitleCase(element.name);
            });
            this.recommendingUsersList = data;

            this.recommending_userID = res.data.heads[0].user_detailID;
            this.checkIfHeadIsPresident();
          }
        }
      );
    },

    checkIfHeadIsPresident() {
      if (this.presidentUser.user_detailID && this.recommending_userID) {
        if (this.presidentUser.user_detailID == this.recommending_userID) {
          this.isHeadPresident = true;
        } else {
          this.isHeadPresident = false;
        }
      }
    },

    isCoretimeHasSaturday() {
      this.axiosCall("/my-core-time/isMyCoretimeHasSaturday", "GET").then(
        (res) => {
          this.isMyCoretimeHasSaturday = res.data;
        }
      );
    },

    // checkIfHeadIsPresident() {
    //   this.axiosCall("/my-direct-head/checkIfHeadIsPresident", "GET").then(
    //     (res) => {

    //       if (res.data) {
    //         this.isHeadPresident = res.data.isHeadPresident;
    //         if (!res.data.isHeadPresident) {
    //           this.loadRecommendingOfficers();
    //         }
    //       }
    //     }
    //   );
    // },

    addCto() {
      this.ctoAddDialog = true;
      this.$refs.AddCTOFormRef.reset();
      this.$refs.AddCTOFormRef.resetValidation();
    },

    editCto(item, i) {
      this.indexToUpdate = i;
      this.cto_num_hours_applied = item.cto_num_hours_applied;
      // this.cto_date_from = item.cto_date_from;
      // this.cto_date_to = item.cto_date_to;
      this.cto_date_from = item.cto_date_from;
      (this.cto_am_pm = item.cto_am_pm), (this.ctoAddDialog = true);
    },
    removeCto(item, i) {
      console.log(item, i);
      this.ctoNumApp.splice(i, 1);
    },

    saveCTOApp() {
      if (this.$refs.AddCTOFormRef.validate()) {
        if (this.indexToUpdate == null) {
          this.ctoNumApp.push({
            cto_num_hours_applied: this.cto_num_hours_applied,
            // cto_date_from: this.cto_date_from,
            // cto_date_to: this.cto_date_to,

            cto_date_from: this.cto_date_from,
            cto_am_pm: this.cto_am_pm,
          });
        } else {
          this.ctoNumApp[
            this.indexToUpdate
          ].cto_num_hours_applied = this.cto_num_hours_applied;

          // this.ctoNumApp[this.indexToUpdate].cto_date_from = this.cto_date_from;
          // this.ctoNumApp[this.indexToUpdate].cto_date_to = this.cto_date_to;
          this.ctoNumApp[this.indexToUpdate].cto_date_from = this.cto_date_from;

          this.ctoNumApp[this.indexToUpdate].cto_am_pm = this.cto_am_pm;
          this.indexToUpdate = null;
        }

        this.ctoAddDialog = false;
      }
    },

    reset() {
      this.selected_details_of_leave = null;
      this.no_of_working_days_applied = null;
      this.inclusive_date_from = null;
      this.inclusive_date_to = null;
      this.final_approval_user_detailID = null;
      this.ctoNumApp = [];
      this.loadRecommendingOfficers();
    },

    changeSelectedDetails() {
      if (this.selected_details_of_leave == 1) {
        this.getPresidentUser();
        let total = this.credits_data ? this.credits_data.VL_TOTAL : 0;
        if (parseFloat(total) >= 15) {
          let total_split = this.formatNumberValue(total, 3)
            .toString()
            .split(".");
          let diff = parseInt(total_split[0]) - parseInt(5);
          if (diff >= 10 && diff <= 30) {
            // this.alertMsg =
            //   "Vacation Leave credits left - " +
            //   this.formatNumberValue(total, 3);
            this.alertMsg =
              "<p>Vacation Leave credits left - " +
              this.formatNumberValue(total, 3) +
              "</p>";
            this.no_of_working_days_applied = diff;
            this.dayWPay = diff;
            this.dayWOPay = 0;
          } else if (diff > 30) {
            this.alertMsg =
              // "Vacation Leave credits left - " +
              // this.formatNumberValue(total, 3);
              this.alertMsg =
                "<p>Vacation Leave credits left - " +
                this.formatNumberValue(total, 3) +
                "</p>";
            this.no_of_working_days_applied = 30;
            this.dayWPay = 30;
            this.dayWOPay = 0;
          }

          this.isValidToApply = true;
        } else {
          // this.alertMsg =
          //   "You cannot avail monitization of leave since you don't have sufficient VL credits! Minimum VL credits should be 15.";
          this.alertMsg =
            "<p>You cannot avail monitization of leave since you don't have sufficient VL credits! Minimum VL credits should be 15.</p>";
          this.no_of_working_days_applied = 0;
          this.isValidToApply = false;
        }
      } else {
        this.loadRecommendingOfficers();
        this.final_approval_user_detailID = null;
      }
    },

    uploadFile() {
      this.fileUploadDialog = true;
    },
    closeUploadDialog() {
      this.$refs.uploadFileRef.resetValidation();
      this.$refs.uploadFileRef.reset();
      this.fileUploadDialog = false;
    },

    addAttachment() {
      if (this.$refs.uploadFileRef.validate()) {
        let data = {
          description: this.file_desc,
          filename: this.file_selected.name,
        };
        this.files_to_display.push(data);
        this.file_attachments.push(this.file_selected);
        this.file_attachments_desc.push(this.file_desc);
        this.file_selected = null;
        this.file_desc = null;

        this.closeUploadDialog();
      }
    },

    getDirectHead() {
      this.axiosCall("/my-direct-head/getMyDirectHead", "GET").then((res) => {
        if (res.data) {
          this.recommending_name = res.data[0].name;
          this.recommending_userID = res.data[0].userID;
        }
      });
    },
    getUsers() {
      this.axiosCall("/user-details/getDeanDirAboveUsers", "GET").then(
        (res) => {
          let data = res.data;
          data.forEach((element, i) => {
            data[i].name = this.toTitleCase(element.name);
          });
          this.usersList = data;
          // console.log(res.data);
        }
      );
    },

    alertUser() {
      if (this.$refs.MyLeaveFormref.validate()) {
        if (this.selected_type_of_leave) {
          if (this.selected_type_of_leave == 1) {
            //vl
            let total = this.credits_data ? this.credits_data.VL_TOTAL : 0;
            total = this.formatNumberValue(total, 3);
            // this.alertMsg = "Available Vacation Leave Credits: " + total;
            this.alertMsg =
              "<p>Available Vacation Leave Credits: " + total + ".</p>";
            if (parseFloat(total) > 0) {
              if (
                parseFloat(this.no_of_working_days_applied) > parseFloat(total)
              ) {
                let total_split = total.toString().split(".");

                this.dayWPay = total_split[0];
                this.dayWOPay =
                  parseInt(this.no_of_working_days_applied) -
                  parseInt(total_split[0]);
              } else {
                this.dayWPay = this.no_of_working_days_applied;
                this.dayWOPay = 0;
              }
            } else {
              this.dayWPay = 0;
              this.dayWOPay = this.no_of_working_days_applied;
            }

            this.isValidToApply = true;
            this.confirmDialog = true;
          } else if (this.selected_type_of_leave == 2) {
            //fl
            if (this.myHiringStatus == "Newly hired") {
              this.isValidToApply = false;
              // this.alertMsg =
              //   "You are a newly hired employee, you need to render atleast 10 months to avail Force Leave!";
              this.alertMsg =
                "<p>You are a newly hired employee, you need to render atleast 10 months to avail Force Leave!</p>";
            } else {
              if (this.no_of_working_days_applied > 5) {
                // this.alertMsg = "Invalid number of working days applied! ";
                this.alertMsg = "<p>Invalid number of working days applied</p>";
                this.isValidToApply = false;
              } else {
                let total = this.credits_data
                  ? 5 - this.credits_data.CURRENT_FL_TOTAL_DEDUCT
                  : 5;

                if (total <= 0) {
                  // this.alertMsg = "You have already used all you Force leave.";
                  this.alertMsg =
                    "<p>You have already used all you Force leave.</p>";
                  this.isValidToApply = false;
                } else {
                  // this.alertMsg = "Available Force Leave Credits:  " + total;
                  this.alertMsg =
                    "<p>Available Force Leave Credits:  " + total + "</p>";
                  let diff =
                    parseInt(total) - parseInt(this.no_of_working_days_applied);
                  if (diff < 0) {
                    this.dayWPay = total;
                    this.dayWOPay = diff * -1;
                  } else {
                    this.dayWPay = this.no_of_working_days_applied;
                    this.dayWOPay = 0;
                  }

                  this.isValidToApply = true;
                }
              }
            }
            this.confirmDialog = true;
          } else if (this.selected_type_of_leave == 3) {
            //sl
            let total = this.formatNumberValue(
              this.credits_data ? this.credits_data.SL_TOTAL : 0,
              3
            );
            // this.alertMsg = "Available Sick Leave Credits: " + total;
            this.alertMsg =
              "<p>Available Sick Leave Credits: " + total + ".</p>";
            //checking if remaining sl >= 0.5

            if (parseFloat(total) >= 0.5) {
              if (
                parseFloat(this.no_of_working_days_applied) >= parseFloat(total)
              ) {
                let vl = this.credits_data ? this.credits_data.VL_TOTAL : 0;
                let remToDeduct = this.formatNumberValue(
                  parseFloat(this.no_of_working_days_applied) -
                    parseFloat(total),
                  3
                );
                if (parseFloat(vl) > 0) {
                  this.alertMsg +=
                    "<p>Available Vacation Leave Credits: " + vl + ".</p>";
                  if (parseFloat(vl) >= remToDeduct) {
                    this.alertMsg +=
                      "<p>An excess of  " +
                      remToDeduct +
                      " credits will be deducted to your vacation leave credits.";
                    ("</p>");

                    this.dayWPay = this.no_of_working_days_applied;
                    this.dayWOPay = 0;
                  } else {
                    let VlDeducted =
                      this.formatNumberValue(
                        parseFloat(vl) - remToDeduct - parseFloat(total),
                        3
                      ) >= 0
                        ? this.formatNumberValue(
                            remToDeduct - parseFloat(total),
                            3
                          )
                        : this.formatNumberValue(parseFloat(vl), 3);

                    let dwOP = this.formatNumberValue(
                      parseFloat(this.no_of_working_days_applied) - remToDeduct,
                      3
                    );

                    this.alertMsg +=
                      "<p>A " +
                      VlDeducted +
                      " credits will be deducted to your vacation leave credits.";
                    ("</p>");
                    this.dayWPay = remToDeduct;
                    this.dayWOPay = dwOP;
                  }
                } else {
                  this.dayWPay = parseFloat(total);
                  this.dayWOPay = remToDeduct;
                }
              } else {
                this.dayWPay = this.no_of_working_days_applied;
                this.dayWOPay = 0;
              }
            } else {
              //else if sl < 0.5

              let vl = this.credits_data ? this.credits_data.VL_TOTAL : 0;
              let remToDeduct = this.formatNumberValue(
                parseFloat(this.no_of_working_days_applied),
                3
              );
              //  let remToDeduct = this.formatNumberValue(
              //   parseFloat(this.no_of_working_days_applied) - parseFloat(total),
              //   3
              // );
              if (parseFloat(vl) > 0) {
                this.alertMsg +=
                  "<p>Available Vacation Leave Credits: " + vl + ".</p>";
                if (parseFloat(vl) >= remToDeduct) {
                  this.alertMsg +=
                    "<p>An excess of " +
                    remToDeduct +
                    " credits will be deducted to your vacation leave credits.";
                  ("</p>");

                  this.dayWPay = this.no_of_working_days_applied;
                  this.dayWOPay = 0;
                } else {
                  let VlDeducted =
                    this.formatNumberValue(parseFloat(vl) - remToDeduct, 3) >= 0
                      ? this.formatNumberValue(remToDeduct, 3)
                      : this.formatNumberValue(parseFloat(vl), 3);
                  // let VlDeducted =
                  // this.formatNumberValue(
                  //   parseFloat(vl) - remToDeduct - parseFloat(total),
                  //   3
                  // ) >= 0
                  //   ? this.formatNumberValue(
                  //       remToDeduct - parseFloat(total),
                  //       3
                  //     )
                  //   : this.formatNumberValue(parseFloat(vl), 3);

                  let dwOP = this.formatNumberValue(
                    parseFloat(this.no_of_working_days_applied) - remToDeduct,
                    3
                  );

                  this.alertMsg +=
                    "<p>A " +
                    VlDeducted +
                    " credits will be deducted to your vacation leave credits.";
                  ("</p>");
                  this.dayWPay = remToDeduct;
                  this.dayWOPay = dwOP;
                }
              } else {
                this.dayWPay = 0;
                this.dayWOPay = this.no_of_working_days_applied;
              }
            }

            this.isValidToApply = true;
            this.confirmDialog = true;
          } else if (this.selected_type_of_leave == 4) {
            //maternity leave

            this.alertMsg = null;

            this.dayWPay = this.no_of_working_days_applied;
            this.dayWOPay = 0;

            this.isValidToApply = true;
            this.confirmDialog = true;
          } else if (this.selected_type_of_leave == 5) {
            //paternity leave

            this.alertMsg = null;

            this.dayWPay = this.no_of_working_days_applied;
            this.dayWOPay = 0;

            this.isValidToApply = true;
            this.confirmDialog = true;
          } else if (this.selected_type_of_leave == 6) {
            //spl

            let total = this.credits_data
              ? 3 - this.credits_data.CURRENT_SPL_TOTAL_DEDUCT
              : 3;
            // this.alertMsg =
            //   "Available Special Privilege Leave Credits: " + total;
            this.alertMsg =
              "<p>Available Special Privilege Leave Credits: " +
              total +
              ".</p>";
            if (this.no_of_working_days_applied > total) {
              let total_split = total.toString().split(".");

              this.dayWPay = total_split[0];
              this.dayWOPay =
                parseInt(this.no_of_working_days_applied) -
                parseInt(total_split[0]);
            } else {
              this.dayWPay = this.no_of_working_days_applied;
              this.dayWOPay = 0;
            }
            this.isValidToApply = true;
            this.confirmDialog = true;
          } else if (this.selected_type_of_leave == 7) {
            //solo parent leave

            this.alertMsg = null;

            this.dayWPay = this.no_of_working_days_applied;
            this.dayWOPay = 0;

            this.isValidToApply = true;
            this.confirmDialog = true;
          } else if (this.selected_type_of_leave == 8) {
            //study leave

            this.alertMsg = null;

            this.dayWPay = this.no_of_working_days_applied;
            this.dayWOPay = 0;

            this.isValidToApply = true;
            this.confirmDialog = true;
          } else if (this.selected_type_of_leave == 9) {
            //10-Day VAWC Leave

            this.alertMsg = null;

            this.dayWPay = this.no_of_working_days_applied;
            this.dayWOPay = 0;

            this.isValidToApply = true;
            this.confirmDialog = true;
          } else if (this.selected_type_of_leave == 10) {
            //Rehabilitation priviledge Leave

            this.alertMsg = null;

            this.dayWPay = this.no_of_working_days_applied;
            this.dayWOPay = 0;

            this.isValidToApply = true;
            this.confirmDialog = true;
          } else if (this.selected_type_of_leave == 11) {
            //spl for woman Leave

            this.alertMsg = null;

            this.dayWPay = this.no_of_working_days_applied;
            this.dayWOPay = 0;

            this.isValidToApply = true;
            this.confirmDialog = true;
          } else if (this.selected_type_of_leave == 12) {
            //special emergency Leave

            this.alertMsg = null;

            this.dayWPay = this.no_of_working_days_applied;
            this.dayWOPay = 0;

            this.isValidToApply = true;
            this.confirmDialog = true;
          } else if (this.selected_type_of_leave == 13) {
            //Adoption Leave

            this.alertMsg = null;

            this.dayWPay = this.no_of_working_days_applied;
            this.dayWOPay = 0;

            this.isValidToApply = true;
            this.confirmDialog = true;
          } else if (this.selected_type_of_leave == 14) {
            if (this.selected_details_of_leave == 3) {
              // CTO
              let numDays = this.getTotalCTO / 8;
              this.no_of_working_days_applied = numDays;
              // console.log("numdays", numDays);

              let total = this.credits_data ? this.credits_data.CURRENT_CTO : 0;
              if (total <= 0) {
                // this.alertMsg = "You have no CTO left!";
                this.alertMsg = "<p>You have no CTO left!</p>";
                this.isValidToApply = false;
                this.confirmDialog = true;
              } else {
                // this.alertMsg = "CTO hours left - " + total;
                this.alertMsg = "<p>CTO hours left - " + total + ".</p>";
                if (parseInt(this.getTotalCTO) > parseInt(total)) {
                  let tempTotal = parseInt(this.getTotalCTO) - parseInt(total);

                  this.dayWPay = parseInt(total) / 8;
                  this.dayWOPay = parseInt(tempTotal) / 8;
                } else {
                  this.dayWPay = numDays;
                  this.dayWOPay = 0;
                }
                this.isValidToApply = true;
                this.confirmDialog = true;
              }
            } else if (this.selected_details_of_leave == 1) {
              this.confirmDialog = true;
            } else {
              this.isValidToApply = true;
            }
          }
        }
      }
    },

    confirmAction() {
      if (this.action == "Apply") {
        this.confirmDialog = false;
        this.apply();
      } else if (this.action == "Update") {
        this.confirmDialog = false;
        this.updateLeave();
      }
    },

    loadLeaveCreditBalance() {
      this.axiosCall("/employee-accum-leaves/getMyLeaveCredits/", "GET").then(
        (res) => {
          if (res) {
            this.credits_data = res.data;
          }
        }
      );
    },

    loadMyHiringStatus() {
      this.axiosCall("/employee/my-hiring-status", "GET").then((res) => {
        if (res) {
          this.myHiringStatus = res.data.employee_status;
        }
      });
    },

    loadDirectHead(id) {
      this.axiosCall("/user-details/getSpecificUser/" + id, "GET").then(
        (res) => {
          this.recommending_name = res.data.mname
            ? res.data.fname + " " + res.data.mname[0] + ". " + res.data.lname
            : res.data.fname + " " + res.data.lname;
        }
      );
    },

    removeFile(file, i) {
      if (file.id) {
        this.files_to_remove.push(file);
        this.files_to_display.splice(i, 1);
      } else {
        this.files_to_display.splice(i, 1);
        this.file_attachments.splice(i, 1);
        this.file_attachments_desc.splice(i, 1);
      }
    },

    getItemText(item) {
      if (item.subdescription) {
        return `${item.description}  (${item.subdescription})`;
      }
      return `${item.description} `;
    },
    apply() {
      if (this.$refs.MyLeaveFormref.validate()) {
        // this.alertUser();

        let det_of_leave = null;
        if (
          this.selected_type_of_leave == 1 ||
          this.selected_type_of_leave == 6
        ) {
          det_of_leave = this.place;
        } else if (this.selected_type_of_leave == 3) {
          det_of_leave = this.illness;
        } else if (this.selected_type_of_leave == 11) {
          det_of_leave = this.spcl_leave_bnft_details;
        }

        // if (
        //   this.selected_type_of_leave == 14 &&
        //   this.selected_details_of_leave == 3
        // ) {
        //   let numdays = this.getTotalCTO / 8;
        //   this.no_of_working_days_applied = numdays;
        // }

        let data = {
          type_of_leave_ID: this.selected_type_of_leave,
          other_type_of_leave: this.other_type_of_leave_selected,
          selected_details_of_leave: this.selected_details_of_leave,
          details_of_leave: det_of_leave,
          inclusive_date_from: this.inclusive_date_from,
          inclusive_date_to: this.inclusive_date_to,
          no_days_applied: this.no_of_working_days_applied,
          commutation: this.commutation,
          recommending_user_detailID: this.isHeadPresident
            ? null
            : this.recommending_userID,
          final_approval_user_detailID: this.isHeadPresident
            ? this.recommending_userID
            : this.final_approval_user_detailID,
          ctoNumApp:
            this.selected_type_of_leave == 14
              ? this.selected_details_of_leave == 3
                ? this.ctoNumApp
                : []
              : [],
        };

        let fd = new FormData();
        let str_data = JSON.stringify(data);
        let str_file_att_desc = JSON.stringify(this.file_attachments_desc);
        // let str_itemToremove = JSON.stringify(this.files_to_remove);

        for (let i = 0; i < this.file_attachments.length; i++) {
          const element = this.file_attachments[i];
          fd.append("file", element);
        }

        fd.append("data", str_data);
        fd.append("file_attachment_desc", str_file_att_desc);
        // fd.append("itemToRemove", str_itemToremove);

        if (
          this.selected_type_of_leave == 3 ||
          this.selected_type_of_leave == 4 ||
          this.selected_type_of_leave == 5 ||
          this.selected_type_of_leave == 7 ||
          this.selected_type_of_leave == 9 ||
          this.selected_type_of_leave == 10 ||
          this.selected_type_of_leave == 11 ||
          this.selected_type_of_leave == 12 ||
          this.selected_type_of_leave == 13
        ) {
          if (
            this.selected_type_of_leave == 3 &&
            parseInt(this.no_of_working_days_applied) > 5
          ) {
            if (this.files_to_display.length == 0) {
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "error";
              this.fadeAwayMessage.header = "Notification";
              this.fadeAwayMessage.message =
                "An attachment is required, kindly upload your file!";
            } else {
              this.axiosCall("/leaves", "POST", fd).then((res) => {
                if (res.data.status == 201) {
                  this.dialog = false;
                  this.fadeAwayMessage.show = true;
                  this.fadeAwayMessage.type = "success";
                  this.fadeAwayMessage.header = "System Message";
                  this.fadeAwayMessage.message = res.data.msg;
                  this.close();
                } else if (res.data.status == 400) {
                  this.dialog = false;
                  this.fadeAwayMessage.show = true;
                  this.fadeAwayMessage.type = "error";
                  this.fadeAwayMessage.header = "System Message";
                  this.fadeAwayMessage.message = res.data.msg;
                }
              });
            }
          } else if (
            this.selected_type_of_leave == 3 &&
            parseInt(this.no_of_working_days_applied) <= 5
          ) {
            this.axiosCall("/leaves", "POST", fd).then((res) => {
              if (res.data.status == 201) {
                this.dialog = false;
                this.fadeAwayMessage.show = true;
                this.fadeAwayMessage.type = "success";
                this.fadeAwayMessage.header = "System Message";
                this.fadeAwayMessage.message = res.data.msg;
                this.close();
              } else if (res.data.status == 400) {
                this.dialog = false;
                this.fadeAwayMessage.show = true;
                this.fadeAwayMessage.type = "error";
                this.fadeAwayMessage.header = "System Message";
                this.fadeAwayMessage.message = res.data.msg;
              }
            });
          } else if (this.selected_type_of_leave != 3) {
            if (this.files_to_display.length == 0) {
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "error";
              this.fadeAwayMessage.header = "Notification";
              this.fadeAwayMessage.message =
                "An attachment is required, kindly upload your file!";
            } else {
              this.axiosCall("/leaves", "POST", fd).then((res) => {
                if (res.data.status == 201) {
                  this.dialog = false;
                  this.fadeAwayMessage.show = true;
                  this.fadeAwayMessage.type = "success";
                  this.fadeAwayMessage.header = "System Message";
                  this.fadeAwayMessage.message = res.data.msg;
                  this.close();
                } else if (res.data.status == 400) {
                  this.dialog = false;
                  this.fadeAwayMessage.show = true;
                  this.fadeAwayMessage.type = "error";
                  this.fadeAwayMessage.header = "System Message";
                  this.fadeAwayMessage.message = res.data.msg;
                }
              });
            }
          }
        } else {
          this.axiosCall("/leaves", "POST", fd).then((res) => {
            if (res.data.status == 201) {
              this.dialog = false;
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "success";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
              this.close();
            } else if (res.data.status == 400) {
              this.dialog = false;
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "error";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
            }
          });
        }
      }
    },

    updateLeave() {
      if (this.$refs.MyLeaveFormref.validate()) {
        let det_of_leave = null;
        if (
          this.selected_type_of_leave == 1 ||
          this.selected_type_of_leave == 6
        ) {
          det_of_leave = this.place;
        } else if (this.selected_type_of_leave == 3) {
          det_of_leave = this.illness;
        } else if (this.selected_type_of_leave == 11) {
          det_of_leave = this.spcl_leave_bnft_details;
        }

        let data = {
          id: this.id,
          type_of_leave_ID: this.selected_type_of_leave,
          other_type_of_leave: this.other_type_of_leave_selected,
          selected_details_of_leave: this.selected_details_of_leave,
          details_of_leave: det_of_leave,
          inclusive_date_from: this.inclusive_date_from,
          inclusive_date_to: this.inclusive_date_to,
          no_days_applied: this.no_of_working_days_applied,
          commutation: this.commutation,
          recommending_user_detailID: this.isHeadPresident
            ? null
            : this.recommending_userID,
          final_approval_user_detailID: this.isHeadPresident
            ? this.recommending_userID
            : this.final_approval_user_detailID,
          ctoNumApp:
            this.selected_type_of_leave == 14
              ? this.selected_details_of_leave == 3
                ? this.ctoNumApp
                : []
              : [],
        };

        let fd = new FormData();
        let str_data = JSON.stringify(data);
        let str_file_att_desc = JSON.stringify(this.file_attachments_desc);
        let str_itemToremove = JSON.stringify(this.files_to_remove);

        for (let i = 0; i < this.file_attachments.length; i++) {
          const element = this.file_attachments[i];
          fd.append("file", element);
        }

        fd.append("data", str_data);
        fd.append("file_attachment_desc", str_file_att_desc);
        fd.append("itemToRemove", str_itemToremove);

        if (
          this.selected_type_of_leave == 3 ||
          this.selected_type_of_leave == 4 ||
          this.selected_type_of_leave == 5 ||
          this.selected_type_of_leave == 7 ||
          this.selected_type_of_leave == 9 ||
          this.selected_type_of_leave == 10 ||
          this.selected_type_of_leave == 11 ||
          this.selected_type_of_leave == 12 ||
          this.selected_type_of_leave == 13
        ) {
          if (
            this.selected_type_of_leave == 3 &&
            parseInt(this.no_of_working_days_applied) > 5
          ) {
            if (this.files_to_display.length == 0) {
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "error";
              this.fadeAwayMessage.header = "Notification";
              this.fadeAwayMessage.message =
                "An attachment is required, kindly upload your file!";
            } else {
              this.axiosCall("/leaves/update_my_application", "POST", fd).then(
                (res) => {
                  if (res.data.status == 201) {
                    this.dialog = false;
                    this.fadeAwayMessage.show = true;
                    this.fadeAwayMessage.type = "success";
                    this.fadeAwayMessage.header = "System Message";
                    this.fadeAwayMessage.message = res.data.msg;
                    this.close();
                  } else if (res.data.status == 400) {
                    this.dialog = false;
                    this.fadeAwayMessage.show = true;
                    this.fadeAwayMessage.type = "error";
                    this.fadeAwayMessage.header = "System Message";
                    this.fadeAwayMessage.message = res.data.msg;
                  }
                }
              );
            }
          } else if (
            this.selected_type_of_leave == 3 &&
            parseInt(this.no_of_working_days_applied) <= 5
          ) {
            this.axiosCall("/leaves/update_my_application", "POST", fd).then(
              (res) => {
                if (res.data.status == 201) {
                  this.dialog = false;
                  this.fadeAwayMessage.show = true;
                  this.fadeAwayMessage.type = "success";
                  this.fadeAwayMessage.header = "System Message";
                  this.fadeAwayMessage.message = res.data.msg;
                  this.close();
                } else if (res.data.status == 400) {
                  this.dialog = false;
                  this.fadeAwayMessage.show = true;
                  this.fadeAwayMessage.type = "error";
                  this.fadeAwayMessage.header = "System Message";
                  this.fadeAwayMessage.message = res.data.msg;
                }
              }
            );
          } else if (this.selected_type_of_leave != 3) {
            if (this.files_to_display.length == 0) {
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "error";
              this.fadeAwayMessage.header = "Notification";
              this.fadeAwayMessage.message =
                "An attachment is required, kindly upload your file!";
            } else {
              this.axiosCall("/leaves/update_my_application", "POST", fd).then(
                (res) => {
                  if (res.data.status == 201) {
                    this.dialog = false;
                    this.fadeAwayMessage.show = true;
                    this.fadeAwayMessage.type = "success";
                    this.fadeAwayMessage.header = "System Message";
                    this.fadeAwayMessage.message = res.data.msg;
                    this.close();
                  } else if (res.data.status == 400) {
                    this.dialog = false;
                    this.fadeAwayMessage.show = true;
                    this.fadeAwayMessage.type = "error";
                    this.fadeAwayMessage.header = "System Message";
                    this.fadeAwayMessage.message = res.data.msg;
                  }
                }
              );
            }
          }
        } else {
          this.axiosCall("/leaves/update_my_application", "POST", fd).then(
            (res) => {
              if (res.data.status == 201) {
                this.dialog = false;
                this.fadeAwayMessage.show = true;
                this.fadeAwayMessage.type = "success";
                this.fadeAwayMessage.header = "System Message";
                this.fadeAwayMessage.message = res.data.msg;
                this.close();
              } else if (res.data.status == 400) {
                this.dialog = false;
                this.fadeAwayMessage.show = true;
                this.fadeAwayMessage.type = "error";
                this.fadeAwayMessage.header = "System Message";
                this.fadeAwayMessage.message = res.data.msg;
              }
            }
          );
        }
      }
    },
    getOffices() {
      this.axiosCall("/offices", "GET").then((res) => {
        this.officeList = res.data;
      });
    },

    getTypeOfLeaves() {
      this.axiosCall("/types-of-leave", "GET").then((res) => {
        this.type_of_leave_list = res.data;
      });
    },

    getPresidentUser() {
      this.axiosCall("/user-details/getCollegePres", "GET").then((res) => {
        this.isHeadPresident = true;
        this.recommendingUsersList = [];
        this.recommendingUsersList.push({
          user_detailID: parseInt(res.data.userID),
          name: res.data.name,
        });
        this.recommending_userID = parseInt(res.data.userID);
        this.final_approval_user_detailID = res.data.userID;
      });
    },

    loadPresidentUser() {
      this.axiosCall("/user-details/getCollegePres", "GET").then((res) => {
        this.presidentUser = res.data;
      });
    },

    loadRemarks(id) {
      this.axiosCall("/remarks/" + id + "/LEAVE", "GET").then((res) => {
        if (res.data) {
          this.remarksData = res.data;
        }
      });
    },
  },
};
</script>
<style scoped>
table {
  width: 100%;
}
td {
  padding: 10px;
}
table,
th,
td {
  border-collapse: collapse !important;
  border: 1px solid grey;
}
</style>
