<template>
  <div>
    <v-dialog
      fullscreen
      v-model="dialog"
      persistent
      eager
      scrollable
      max-width="900px"
    >
      <v-form ref="JobPostinDialog" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>{{ action }} Job Posting</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="closeD()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 700px" class="my-4">
            <v-container>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    style="border: 1px solid gray; border-radius: 4px;"
                    class="px-2"
                    v-model="position"
                    label="Position Title"
                    hide-details
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="plantillaItem"
                    style="border: 1px solid gray; border-radius: 4px;"
                    class="px-2"
                    label="Plantilla/COS/JO Item No."
                    hide-details
                    required
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="applicantNumber"
                    outlined
                    class="mt-2"
                    :items="numberPosition"
                    label="Number of applicant needed"
                    color="#93CB5B"
                    dense
                  ></v-select>
                </v-col>
                <v-col cols="12" md="4">
                  <!-- <v-text-field
                    v-model="salaryGrade"
                    style="border: 1px solid gray; border-radius: 4px;"
                    class="px-2"
                    label="Salary Grade"
                    hide-details
                    required
                  ></v-text-field> -->
                  <v-select
                    @change="onChangeSG($event)"
                    v-model="salaryGrade"
                    outlined
                    class="mt-2"
                    :items="sg"
                    label="Salary Grade"
                    color="#93CB5B"
                    dense
                  ></v-select>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="monthlySalary"
                    style="border: 1px solid gray; border-radius: 4px;"
                    class="px-2"
                    label="Monthly Salary"
                    :value="monthlySalary"
                    hide-details
                    :readonly="salaryGrade == 0 ? false : true"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6" lg="6" sm="12">
                  <!-- <v-text-field
                    v-model="assignment"
                    style="border: 1px solid gray; border-radius: 4px;"
                    class="px-2"
                    label="Place of Assignment"
                    hide-details
                    required
                  ></v-text-field> -->
                  <v-select
                    @change="onChangeAssignment($event)"
                    v-model="assignment"
                    outlined
                    class="mt-2"
                    :items="assignmentlist"
                    label="Place of Assignment"
                    color="#93CB5B"
                    :selected="assignmentlist == officeData"
                    :value="officeData"
                    dense
                  ></v-select>
                </v-col>
                <v-col cols="12" md="6" lg="6" sm="12">
                  <v-text-field
                    style="border: 1px solid gray; border-radius: 4px;"
                    class="px-2"
                    :class="assignment != null ? 'd-none' : ''"
                    readonly
                    label="Please Select Place of Assignment"
                    hide-details
                    color="red"
                  ></v-text-field>
                  <v-select
                    v-model="unit_department"
                    :class="assignment != null ? '' : 'd-none'"
                    outlined
                    class="mt-2"
                    :items="unit_departmentlist"
                    label="Place of Assignment Office/Unit"
                    color="#93CB5B"
                    :selected="unit_departmentlist == departmentData"
                    :value="departmentData"
                    dense
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col col="12"> Education</v-col>
              </v-row>
              <v-row>
                <v-col col="12">
                  <vue-editor
                    v-model="jobPostingContent"
                    :editorToolbar="customToolbar"
                  ></vue-editor>
                </v-col>
              </v-row>
              <v-row>
                <!-- <v-col cols="12" md="6">
                  <v-text-field
                    v-model="education"
                    style="border: 1px solid gray; border-radius: 4px;"
                    class="px-2"
                    label="Education"
                    hide-details
                    required
                  ></v-text-field>
                </v-col> -->

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="training"
                    style="border: 1px solid gray; border-radius: 4px;"
                    class="px-2"
                    label="Training"
                    hide-details
                    required
                  ></v-text-field>
                  <!-- <v-select
                    v-model="training"
                    outlined
                    class="mt-2"
                    :items="traininglist"
                    label="Training"
                    color="#93CB5B"
                    dense
                  ></v-select> -->
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="experience"
                    style="border: 1px solid gray; border-radius: 4px;"
                    class="px-2"
                    label="Experience"
                    hide-details
                    required
                  ></v-text-field>
                  <!-- <v-select
                    v-model="experience"
                    outlined
                    class="mt-2"
                    :items="experiencelist"
                    label="Experience"
                    color="#93CB5B"
                    dense
                  ></v-select> -->
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="eligibility"
                    style="border: 1px solid gray; border-radius: 4px;"
                    class="px-2"
                    label="Eligibility"
                    hide-details
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    class="px-2"
                    v-model="competency"
                    style="border: 1px solid gray; border-radius: 4px;"
                    label="Competency"
                    hide-details
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row class="pt-8"
                >Please Check the Required File on this position
              </v-row>

              <v-row style="border: 1px solid gray; border-radius: 4px;">
                <!-- Required Section -->
                <v-col cols="12" md="3">
                  <v-checkbox
                    v-model="applicationLetter"
                    label="Application Letter"
                    value="required"
                  ></v-checkbox
                  >{{ applicationLetter }}
                </v-col>
                <v-col cols="12" md="3">
                  <v-checkbox
                    :model-value="true"
                    v-model="personalData"
                    label="PDS"
                    value="required"
                  ></v-checkbox
                  >{{ personalData }}
                </v-col>
                <v-col cols="12" md="3">
                  <v-checkbox
                    v-model="performanceRating"
                    label="Performance Rating"
                    value="required"
                  ></v-checkbox
                  >{{ performanceRating }}
                </v-col>
                <v-col cols="12" md="3">
                  <v-checkbox
                    v-model="certificataEligibility"
                    label="Certificate of Eligibility"
                    value="required"
                  ></v-checkbox
                  >{{ certificataEligibility }}
                </v-col>
                <v-col cols="12" md="3">
                  <v-checkbox
                    v-model="transcriptRecord"
                    label="Transcript of Record"
                    value="required"
                  ></v-checkbox
                  >{{ transcriptRecord }}
                </v-col>
                <v-col cols="12" md="3">
                  <v-checkbox
                    v-model="certificateEmployment"
                    label="Certificate of Employment"
                    value="required"
                  ></v-checkbox
                  >{{ certificateEmployment }}
                </v-col>
                <v-col cols="12" md="3">
                  <v-checkbox
                    v-model="certificateTraining"
                    label="Certificate of Trainings"
                    value="required"
                  ></v-checkbox
                  >{{ certificateTraining }}
                </v-col>
              </v-row>
              <v-row class="mt-10">
                <v-col col="12" md="6">From: {{ dateFrom }}</v-col>
                <v-col col="12" md="6">To: {{ dateTo }}</v-col>
              </v-row>
              <v-row>
                <v-col cols="12" lg="6">
                  <v-menu
                    v-model="menu2"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="dateFrom"
                        label="Select Date From:"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="dateFrom"
                      @input="menu2 = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-menu
                    ref="menu"
                    v-model="menu"
                    :close-on-content-click="false"
                    :return-value.sync="dateTo"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="dateTo"
                        label="Select Date To:"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="dateTo" no-title scrollable>
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="menu = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.menu.save(dateTo)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
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
              color="#519043"
              class="white--text"
              v-if="action == 'Add'"
              @click="checkConflict('ADD')"
            >
              <v-icon>mdi-check-circle</v-icon>
              Add
            </v-btn>
            <v-btn
              color="#519043"
              class="white--text"
              v-if="action == 'Update'"
              @click="checkConflict('UPDATE')"
            >
              <v-icon>mdi-check-circle</v-icon>
              Update
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
      :timeout="3000"
    ></fade-away-message-component>
    <!-- schedule day of week  -->
    <v-dialog
      v-model="schedDialog"
      eager
      persistent
      scrollable
      max-width="700px"
    >
      <v-card>
        <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
          <span>{{ schedAction }} Core Time Schedule</span>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="closeSchedDialog()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text style="max-height: 700px" class="my-4">
          <v-form ref="schedDialogRef" @submit.prevent>
            <v-container>
              <v-row>
                <v-col cols="12" class="pa-0 pt-2 px-4">
                  <v-autocomplete
                    outlined
                    multiple
                    small-chips
                    required
                    deletable-chips
                    v-model="schedWfh"
                    :rules="[formRules.required]"
                    :items="dayList"
                    item-value="name"
                    item-text="name"
                    dense
                    class="rounded-lg"
                    label="Work Schedule"
                    color="#6DB249"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" class="px-4">
                  <div
                    class="d-flex justify-space-between px-3 py-1 rounded-lg"
                    style="border:1px solid grey"
                  >
                    <span class="text-body-1">Time Schedule/s</span>
                    <v-btn
                      v-if="schedTimeList.length < 2"
                      color="#519043"
                      @click="addSchedTime()"
                      small
                      outlined
                      >Add Time</v-btn
                    >
                  </div>

                  <div
                    class="d-flex justify-space-between pa-2"
                    v-for="(time, i) in schedTimeList"
                    :key="i"
                  >
                    <div style="width:40%">
                      {{ getPart(time.tapTimePartID) }}
                    </div>

                    <div style="width:40%">
                      {{ formatTime(time.timeFrom) }} -
                      {{ formatTime(time.timeTo) }}
                    </div>
                    <div style="width:20%" class="d-flex justify-end">
                      <v-btn
                        x-small
                        outlined
                        @click="editSchedTime(time, i)"
                        color="grey"
                        >Edit</v-btn
                      >
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-5">
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="closeSchedDialog()">
            <v-icon>mdi-close-circle-outline</v-icon>
            Cancel
          </v-btn>
          <v-btn
            color="#519043"
            class="white--text"
            v-if="schedAction == 'Add'"
            @click="saveSched()"
          >
            <v-icon>mdi-check-circle</v-icon>
            Add
          </v-btn>
          <v-btn
            color="#519043"
            class="white--text"
            v-if="schedAction == 'Update'"
            @click="updateSched()"
          >
            <v-icon>mdi-check-circle</v-icon>
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- schedule time schedules -->
    <v-dialog
      v-model="schedTimeDialog"
      eager
      persistent
      scrollable
      max-width="500px"
    >
      <v-card>
        <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
          <span>{{ schedTimeAction }} Time Schedule/s</span>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="closeSchedTimeDialog()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text style="max-height: 700px" class="my-4">
          <v-form ref="schedTimeDialogRef" @submit.prevent>
            <v-container>
              <v-row>
                <v-col cols="12" class="pa-0 pt-2 px-4">
                  <v-autocomplete
                    outlined
                    small-chips
                    @change="changeTime()"
                    required
                    deletable-chips
                    v-model="tapTimePartID"
                    :rules="[formRules.required]"
                    :items="tapTimeList"
                    item-value="id"
                    item-text="title"
                    dense
                    class="rounded-lg"
                    label="Tap Time"
                    color="#6DB249"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" class="pa-0 pt-2 px-4">
                  <v-menu
                    ref="from"
                    v-model="schedTimeIn"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="timePicker1"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        dense
                        v-model="timePicker1"
                        :rules="[formRules.required]"
                        color="#6DB249"
                        label="From"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <!-- <v-time-picker
                      v-if="timePicker1"
                      format="ampm"
                      color="green lighten-1"
                      v-model="timePicker1"
                      @click:minute="$refs.from.save(timePicker1)"
                    ></v-time-picker> -->

                    <v-date-picker
                      v-if="timePicker1"
                      color="green lighten-1"
                      v-model="timePicker1"
                      @click:minute="$refs.from.save(timePicker1)"
                    ></v-date-picker>
                  </v-menu>
                </v-col>

                <v-col cols="12" class="pa-0 pt-2 px-4">
                  <v-menu
                    ref="to"
                    v-model="schedTimeOut"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="timePicker2"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        outlined
                        :rules="[formRules.required]"
                        dense
                        v-model="timePicker2"
                        color="#6DB249"
                        label="To"
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <!-- <v-time-picker
                      v-if="timePicker2"
                      format="ampm"
                      color="green lighten-1"
                      v-model="timePicker2"
                      @click:minute="$refs.to.save(timePicker2)"
                    ></v-time-picker> -->
                    <v-date-picker
                      v-if="timePicker2"
                      format="ampm"
                      color="green lighten-1"
                      v-model="timePicker2"
                      @click:minute="$refs.to.save(timePicker2)"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-5">
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="closeSchedTimeDialog()">
            <v-icon>mdi-close-circle-outline</v-icon>
            Cancel
          </v-btn>
          <v-btn
            color="#519043"
            class="white--text"
            v-if="schedTimeAction == 'Add'"
            @click="saveSchedTime()"
          >
            <v-icon>mdi-check-circle</v-icon>
            Add
          </v-btn>
          <v-btn
            color="#519043"
            class="white--text"
            v-if="schedTimeAction == 'Update'"
            @click="updateSchedTime()"
          >
            <v-icon>mdi-check-circle</v-icon>
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- updating confirmation -->
    <v-dialog v-model="confirmSubmissionDialog" persistent max-width="400">
      <v-card color="white">
        <div class="pa-4 #3a3b3a--text">
          <div class="text-h6 mb-1">WARNING!</div>

          <div
            v-if="!confirmSubmit.error && confirmSubmit.type == 'UPDATE'"
            class="text-body-1 mb-1"
          >
            <p style="text-align: justify">
              <v-icon class="mt-n2" color="white">mdi-alert</v-icon> &nbsp; Are
              you sure you want to update this approved core-time?
            </p>
            <p style="text-align: justify">
              <v-icon class="mt-n2" color="white">mdi-alert</v-icon> &nbsp;
              Updated core-time will be subject <b>FOR APPROVAL</b>.
            </p>
          </div>
          <div
            v-if="!confirmSubmit.error && confirmSubmit.type == 'ADD'"
            class="text-body-1 mb-1"
          >
            <p style="text-align: justify">
              <v-icon class="mt-n2" color="white">mdi-alert</v-icon> &nbsp; Are
              you sure you want to add core-time?
            </p>
            <p style="text-align: justify">
              <v-icon class="mt-n2" color="white">mdi-alert</v-icon> &nbsp;
              Added core-time will be subject <b>FOR APPROVAL</b>.
            </p>
          </div>
          <!-- error -->
          <div
            v-if="
              confirmSubmit.error &&
                (confirmSubmit.type == 'ADD' || confirmSubmit.type == 'UPDATE')
            "
            class="text-body-1 mb-1"
          >
            <p style="text-align: justify">
              <v-icon class="mt-n2" color="white">mdi-alert</v-icon> &nbsp;
              {{ confirmSubmit.msg }}
            </p>
          </div>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="confirmSubmissionDialog = false">
            Close
          </v-btn>

          <v-btn
            v-if="!confirmSubmit.error && confirmSubmit.type == 'UPDATE'"
            color="green"
            class="white--text"
            :loading="submitBtnLoading"
            :disabled="submitBtnLoading"
            @click="updateCoreTime()"
          >
            Yes
          </v-btn>

          <v-btn
            v-if="!confirmSubmit.error && confirmSubmit.type == 'ADD'"
            color="green"
            :loading="submitBtnLoading"
            :disabled="submitBtnLoading"
            class="white--text"
            @click="addnew()"
          >
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { VueEditor } from "vue2-editor";
export default {
  components: {
    VueEditor,
  },
  props: {
    data: null,
    action: null,
  },
  data() {
    return {
      applicantNumber: null,
      numberPosition: [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
      ],
      sg: [],
      traininglist: [
        "None Required",
        "4 hours of relevant training",
        "8 hours of relevant training",
        "12 hours of relevant training",
        "16 hours of relevant training",
        "20 hours of relevant training",
        "24 hours of relevant training",
      ],
      jobPostingContent: null,
      customToolbar: [
        ["bold", "italic", "underline"],
        // [{ list: "ordered" }, { list: "bullet" }],
        [{ list: "bullet" }],
      ],
      experiencelist: [
        "None Required",
        "1 year relevant experience",
        "2 years of relevant training ",
        "3 years of relevant training ",
        "4 years of relevant training ",
        "5 years of relevant training ",
      ],
      assignmentlist: [
        "DNSC Main Campus",
        "DNSC-Sto. Tomas Campus",
        "DNSC DJAL Talaingod Campus",
        "DNSC-Carmen Campus",
        "DNSC-Island Garden City of Samal Campus",
      ],
      unit_departmentlist: [],
      updateID: null,
      departmentData: null,
      officeData: null,
      menu: false,
      menu2: false,
      position: null,
      plantillaItem: null,
      salaryGrade: null,
      monthlySalary: null,
      education: null,
      training: null,
      experience: null,
      eligibility: null,
      competency: null,
      assignment: null,
      dateFrom: null,
      dateTo: null,
      remarksData: [],
      confirmSubmissionDialog: false,
      submitBtnLoading: false,
      schedTimeDialog: false,
      schedTimeAction: null,
      schedDialog: false,
      schedTimeIn: null,
      schedTimeOut: null,
      schedWfh: null,
      schedAction: null,
      schedIndexToUpdate: null,
      timeSchedIndexToUpdate: null,

      applicationLetter: null,
      transcriptRecord: null,
      personalData: null,
      performanceRating: null,
      certificataEligibility: null,
      certificateEmployment: null,
      certificateTraining: null,

      schedList: [],
      schedTimeList: [],
      tempSelectedDays: [],
      dialog: false,
      timePicker1: null,
      timePicker2: null,
      ctdModel: {
        id: null,

        workSched: null,
        name: null,
        empID: null,
        coreTimeFrom: null,
        coreTimeTo: null,
        syID: null,
        status: null,
        ctType: null,
        cyFrom: null,
        cyTo: null,
        sem: null,
        isActive: null,
      },
      directHeadUser: null,
      syList: [],
      ctd_headers: [
        {
          text: "Work Schedule",
          value: "workSched",
          align: "start",
        },
        // { text: "Part", value: "part", align: "center" },
        { text: "Time Schedule/s", value: "schedTimeList", align: "center" },

        {
          text: "Actions",
          value: "actions",
          align: "center",
          sortable: false,
          width: 200,
        },
      ],
      statusList: ["Active", "Inactive"],
      semList: [
        { id: 1, title: "First Semester" },
        { id: 2, title: "Second Semester" },
        { id: 3, title: "Summer" },
      ],

      tapTimeList: [
        { id: 1, title: "First Part" },
        { id: 2, title: "Second Part" },
        // { id: 3, title: "Overtime" },
      ],
      tapTimePartID: null,
      designationList: [],
      officeList: [],
      dayList: [
        // { name: "N/A", disabled: false },
        { name: "Monday", disabled: false },
        { name: "Tuesday", disabled: false },
        { name: "Wednesday", disabled: false },
        { name: "Thursday", disabled: false },
        { name: "Friday", disabled: false },
        { name: "Saturday", disabled: false },
      ],
      yearSelection: [],
      confirmSubmit: {
        error: false,
        msg: null,
        type: null,
        show: false,
      },

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
    getMinDateFrom() {
      let min;
      let monthArr = [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
      ];
      let d = new Date();
      if (this.ctdModel.ctType && this.ctdModel.ctType == 1) {
        if (this.ctdModel.sem == 1) {
          //min is july
          min = d.getFullYear() + "-" + monthArr[6] + "-01";
        } else if (this.ctdModel.sem == 2) {
          //min is january of current uear
          min = d.getFullYear() + "-" + monthArr[0] + "-01";
        } else if (this.ctdModel.sem == 3) {
          //min is june
          min = d.getFullYear() + "-" + monthArr[5] + "-01";
        }
      } else if (this.ctdModel.ctType && this.ctdModel.ctType == 2) {
        min = d.getFullYear() + "-" + monthArr[0] + "-01";
      }
      return min;
    },
    getMaxDateTo() {
      let max;
      let monthArr = [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
      ];
      let d = new Date();
      if (this.ctdModel.ctType && this.ctdModel.ctType == 1) {
        if (this.ctdModel.sem == 1) {
          //max is december current year
          max = d.getFullYear() + "-" + monthArr[11] + "-31";
        } else if (this.ctdModel.sem == 2) {
          //max is june of current year
          max = d.getFullYear() + "-" + monthArr[5] + "-31";
        } else if (this.ctdModel.sem == 3) {
          //max is june
          max = d.getFullYear() + "-" + monthArr[6] + "-31";
        }
      } else if (this.ctdModel.ctType && this.ctdModel.ctType == 2) {
        max = d.getFullYear() + "-" + monthArr[11] + "-31";
      }
      return max;
    },
  },
  watch: {
    data: {
      handler(data) {
        this.dialog = true;
        console.log("View Data", data.salary_grade);

        if (data.id) {
          this.initialize();
          this.loadRemarks(data.id);
          this.ctdModel.syID = data.syID;
          this.schedList = data.coreTimeSched ? data.coreTimeSched : [];
          this.ctdModel.id = data.id;
          this.ctdModel.ctType = data.ctType;
          this.ctdModel.cyFrom = data.cyFrom;
          this.ctdModel.cyTo = data.cyTo;
          this.ctdModel.status = data.status;
          this.applicantNumber = data.applicant_number;
          this.getEmpDetails();
          this.ctdModel.sem = data.sem;
          this.ctdModel.isActive = data.isActive ? "Active" : "Inactive";
          this.timePicker1 = "08:00";
          this.timePicker2 = "12:00";
          this.computeDaylist();
          this.position = data.position_title;
          this.plantillaItem = data.plantilla_item;
          this.salaryGrade = data.salary_grade;
          this.monthlySalary = data.monthly_salary;
          this.education = data.education;
          this.jobPostingContent = data.job_posting_content;
          this.training = data.training;
          this.experience = data.experience;
          this.eligibility = data.eligibility;
          this.competency = data.competency;
          this.assignment = data.place_assignment;
          this.officeData = data.place_assignment;
          console.log("Assignment", this.assignment);
          this.unit_department = data.unit_department;
          this.dateFrom = data.date_from;
          this.dateTo = data.date_to;
          this.updateID = data.id;
          this.applicationLetter = data.application_letter;
          this.personalData = data.personal_data;
          this.performanceRating = data.performance_rating;
          this.certificataEligibility = data.certificate_eligibility;
          this.transcriptRecord = data.transcript_record;
          this.certificateEmployment = data.certificate_employment;
          this.certificateTraining = data.certificate_training;
        } else {
          this.$refs.JobPostinDialog.reset();
          this.initialize();
          this.getEmpDetails();
          this.schedWfh = null;
          this.schedList = [];
          this.schedTimeList = [];
          this.ctdModel.syID = null;
          this.ctdModel.ctType = null;
          this.ctdModel.cyFrom = null;
          this.ctdModel.cyTo = null;
          this.ctdModel.status = null;
          this.ctdModel.sem = null;
          this.ctdModel.isActive = null;
        }
      },
      deep: true,
    },
  },

  methods: {
    onChangeAssignment(val) {
      console.log(val);
      if (val == "DNSC Main Campus") {
        this.axiosCall("/offices", "GET").then((res) => {
          console.log("Offices", res.data);
          const arr = [];
          for (let index = 0; index < res.data.length; index++) {
            const element = JSON.stringify(res.data[index].name);
            const newVal = element.replace(/"/g, "");
            arr.push(newVal);
          }
          // console.log(arr);
          this.unit_departmentlist = arr;
        });
      } else {
        this.unit_departmentlist = [
          "Office of the Campus Director",
          "Cashiering Services Unit",
          "Human Resource Management Unit ",
          "Procurement Services Unit",
          "Records Unit",
          "Supply and Property Management Unit",
          "Accounting Services Unit",
          "Budgeting Services Unit",
          "Institute of Leadership, Entrepreneurship, and Good Governance",
          "Institute of Teacher Education",
          "Institute of Computing",
          "Institute of Aquatic and Applied Sciences",
        ];
      }
    },
    salary_Grade() {
      for (let index = 1; index < 34; index++) {
        const element = index;
        this.sg.push(element);
      }
      this.sg.unshift(0);
    },
    onChangeSG(val) {
      if (val == 0) {
        this.monthlySalary = "";
      } else if (val == 1) {
        this.monthlySalary = "13,000.00";
      } else if (val == 2) {
        this.monthlySalary = "13,819.00";
      } else if (val == 3) {
        this.monthlySalary = "14,678.00";
      } else if (val == 4) {
        this.monthlySalary = "15,586.00";
      } else if (val == 5) {
        this.monthlySalary = "16,543.00";
      } else if (val == 6) {
        this.monthlySalary = "17,553.00";
      } else if (val == 7) {
        this.monthlySalary = "18,620.00";
      } else if (val == 8) {
        this.monthlySalary = "19,744.00";
      } else if (val == 9) {
        this.monthlySalary = "21,211.00";
      } else if (val == 10) {
        this.monthlySalary = "23,176.00";
      } else if (val == 11) {
        this.monthlySalary = "27,000.00";
      } else if (val == 12) {
        this.monthlySalary = "29,165.00";
      } else if (val == 13) {
        this.monthlySalary = "31,320.00";
      } else if (val == 14) {
        this.monthlySalary = "33,843.00";
      } else if (val == 15) {
        this.monthlySalary = "36,619.00";
      } else if (val == 16) {
        this.monthlySalary = "39,672.00";
      } else if (val == 17) {
        this.monthlySalary = "43,030.00";
      } else if (val == 18) {
        this.monthlySalary = "46,725.00";
      } else if (val == 19) {
        this.monthlySalary = "51,357.00";
      } else if (val == 20) {
        this.monthlySalary = "57,347.00";
      } else if (val == 21) {
        this.monthlySalary = "63,997.00";
      } else if (val == 22) {
        this.monthlySalary = "71,511.00";
      } else if (val == 23) {
        this.monthlySalary = "80,003.00";
      } else if (val == 24) {
        this.monthlySalary = "90,078.00";
      } else if (val == 25) {
        this.monthlySalary = "102,690.00";
      } else if (val == 26) {
        this.monthlySalary = "116,040.00";
      } else if (val == 27) {
        this.monthlySalary = "131,124.00";
      } else if (val == 28) {
        this.monthlySalary = "148,171.00";
      } else if (val == 29) {
        this.monthlySalary = "167,432.00";
      } else if (val == 30) {
        this.monthlySalary = "189,199.00";
      } else if (val == 31) {
        this.monthlySalary = "278,434.00";
      } else if (val == 32) {
        this.monthlySalary = "331,954.00";
      } else if (val == 33) {
        this.monthlySalary = "419,144.00";
      }
    },
    initialize() {
      this.getDirectHead();
      this.getOffices();
      this.getSchoolYear();
      this.getDesignations();
      this.loadYearSelection();
      this.salary_Grade();

      //   this.getEmpStatus();
      //   this.getInstitutes();
      //   this.getUserType();
    },

    loadRemarks(id) {
      if (id) {
        this.axiosCall("/remarks/" + id + "/CORETIME", "GET").then((res) => {
          if (res.data) {
            console.log("remarks", res.data);
            this.remarksData = res.data;
          }
        });
      }
    },

    changeSem() {
      this.ctdModel.cyFrom = null;
      this.ctdModel.cyTo = null;
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

    loadYearSelection() {
      let d = new Date();

      for (let i = parseInt(d.getFullYear()); i >= 2021; i--) {
        this.yearSelection.push(i);
      }
    },

    closeSchedDialog() {
      this.$refs.schedDialogRef.resetValidation();
      this.schedDialog = false;
    },

    closeSchedTimeDialog() {
      this.$refs.schedTimeDialogRef.resetValidation();
      this.schedTimeDialog = false;
    },

    addSched() {
      this.schedDialog = true;
      this.schedTimeList = [];
      this.schedAction = "Add";
      this.$refs.schedDialogRef.resetValidation();
      this.computeDaylist();
      this.schedWfh = null;
    },
    editSched(item, index) {
      this.schedIndexToUpdate = index;
      this.schedWfh = item.workSched;
      this.schedTimeList = item.schedTimeList;
      for (let i = 0; i < item.workSched.length; i++) {
        let el = item.workSched[i];
        for (let j = 0; j < this.dayList.length; j++) {
          if (el == this.dayList[j].name) {
            this.dayList[j].disabled = false;
          }
        }
      }

      this.timePicker1 = item.timeIn;
      this.timePicker2 = item.timeOut;

      this.schedAction = "Update";
      this.schedDialog = true;
    },

    updateSched() {
      if (this.$refs.schedDialogRef.validate()) {
        this.schedList[this.schedIndexToUpdate].workSched = this.schedWfh;
        this.schedList[this.schedIndexToUpdate].timeIn = this.timePicker1;
        this.schedList[this.schedIndexToUpdate].timeOut = this.timePicker2;
        this.computeDaylist();
        this.schedDialog = false;
      } else {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message = "Please fill up all fields!";
      }
    },

    addSchedTime() {
      this.schedTimeDialog = true;
      //   this.timePicker1 = "08:00";
      //   this.timePicker2 = "12:00";
      this.schedTimeAction = "Add";
      this.$refs.schedTimeDialogRef.reset();
      this.$refs.schedTimeDialogRef.resetValidation();
    },

    changeTime() {
      if (this.tapTimePartID == 1) {
        this.timePicker1 = "08:00";
        this.timePicker2 = "12:00";
      } else if (this.tapTimePartID == 2) {
        this.timePicker1 = "13:00";
        this.timePicker2 = "17:00";
      } else if (this.tapTimePartID == 3) {
        this.timePicker1 = "17:00";
        this.timePicker2 = "22:00";
      }
    },

    editSchedTime(time, index) {
      console.log(time, index);
      this.timeSchedIndexToUpdate = index;

      this.timePicker1 = time.timeFrom;
      this.timePicker2 = time.timeTo;
      this.schedTimeAction = "Update";
      this.tapTimePartID = time.tapTimePartID;
      this.schedTimeDialog = true;
    },

    saveSchedTime() {
      if (this.$refs.schedTimeDialogRef.validate()) {
        this.schedTimeList.push({
          tapTimePartID: this.tapTimePartID,
          timeFrom: this.timePicker1,
          timeTo: this.timePicker2,
        });
        console.log(this.schedTimeList);
        this.schedTimeDialog = false;
      } else {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message = "Please fill up all fields!";
      }
    },

    updateSchedTime() {
      if (this.$refs.schedTimeDialogRef.validate()) {
        this.schedTimeList[
          this.timeSchedIndexToUpdate
        ].tapTimePartID = this.tapTimePartID;
        this.schedTimeList[
          this.timeSchedIndexToUpdate
        ].timeFrom = this.timePicker1;
        this.schedTimeList[
          this.timeSchedIndexToUpdate
        ].timeTo = this.timePicker2;
        this.timeSchedIndexToUpdate = null;
        this.schedTimeDialog = false;
      } else {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message = "Please fill up all fields!";
      }
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
      this.confirmSubmissionDialog = false;
      this.confirmSubmit.type = null;
      this.confirmSubmit.error = false;
      this.confirmSubmit.msg = null;
      this.eventHub.$emit("closeJobPostinDialog", false);
      this.dialog = false;
    },
    addnew() {
      this.submitBtnLoading = true;
      if (this.$refs.MyCoreTimeFormref.validate()) {
        let data = {
          coreTimeSched: this.schedList,
          // designationID: this.ctdModel.designationID,
          ctType: this.ctdModel.ctType,
          cyFrom: this.ctdModel.cyFrom,
          cyTo: this.ctdModel.cyTo,
          syID: this.ctdModel.syID,
          sem: this.ctdModel.sem,
          approval_user_detailID: this.directHeadUser,
          employeeID: this.ctdModel.empID,
          // isActive: this.ctdModel.isActive == "Active" ? true : false,
        };

        this.axiosCall("/my-core-time", "POST", data).then((res) => {
          this.submitBtnLoading = false;
          if (res.data.status == 201) {
            this.closeD();
            this.dialog = false;

            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.$refs.MyCoreTimeFormref.reset();
          } else if (res.data.status == 400) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
          }
        });
      }
    },

    checkConflict(type) {
      if (type == "ADD") {
        if (
          this.position == null ||
          this.applicantNumber == null ||
          this.assignment == null ||
          this.unit_department == null ||
          this.salaryGrade == null ||
          this.monthlySalary == null ||
          this.dateFrom == null ||
          this.dateTo == null
        ) {
          alert("Please Fillup missing form");
        } else {
          let data = {
            position_title: this.position,
            plantilla_item: this.plantillaItem,
            applicant_number: this.applicantNumber,
            salary_grade: this.salaryGrade,
            monthly_salary: this.monthlySalary,
            education: this.education,
            training: this.training,
            experience: this.experience,
            eligibility: this.eligibility,
            competency: this.competency,
            place_assignment: this.assignment,
            unit_department: this.unit_department,
            date_from: this.dateFrom,
            date_to: this.dateTo,
            application_letter: this.applicationLetter,
            personal_data: this.personalData,
            performance_rating: this.performanceRating,
            certificate_eligibility: this.certificataEligibility,
            transcript_record: this.transcriptRecord,
            certificate_employment: this.certificateEmployment,
            certificate_training: this.certificateTraining,
            job_posting_content: this.jobPostingContent,
          };
          // console.log(data);
          this.axiosCall("/job-posting", "POST", data).then((res) => {
            console.log(res.data);
            // alert("Successfully Added");
            this.closeD();
            if (res.data.status == 201) {
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "success";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message =
                "Successfully posted on DNSC website!";

              // location.reload();
            } else if (res.data.status == 400) {
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "error";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
            }
          });
        }
      } else if (type == "UPDATE") {
        // alert("UPDATED");
        if (
          this.position == null ||
          this.salaryGrade == null ||
          this.monthlySalary == null ||
          this.dateFrom == null ||
          this.dateTo == null
        ) {
          alert("Please Fillup missing form");
        } else {
          let data = {
            position_title: this.position,
            plantilla_item: this.plantillaItem,
            applicant_number: this.applicantNumber,
            salary_grade: this.salaryGrade,
            monthly_salary: this.monthlySalary,
            education: this.education,
            training: this.training,
            experience: this.experience,
            eligibility: this.eligibility,
            competency: this.competency,
            place_assignment: this.assignment,
            unit_department: this.unit_department,
            date_from: this.dateFrom,
            date_to: this.dateTo,
            application_letter: this.applicationLetter,
            personal_data: this.personalData,
            performance_rating: this.performanceRating,
            certificate_eligibility: this.certificataEligibility,
            transcript_record: this.transcriptRecord,
            certificate_employment: this.certificateEmployment,
            certificate_training: this.certificateTraining,
            job_posting_content: this.jobPostingContent,
          };
          console.log(data);
          this.axiosCall("/job-posting/" + this.updateID, "PATCH", data).then(
            (res) => {
              console.log(res.data);
              if (res.data.status == 201) {
                this.closeD();
                this.fadeAwayMessage.show = true;
                this.fadeAwayMessage.type = "success";
                this.fadeAwayMessage.header = "System Message";
                this.fadeAwayMessage.message =
                  "Successfully updated job posting!";

                // location.reload();
              } else if (res.data.status == 400) {
                this.fadeAwayMessage.show = true;
                this.fadeAwayMessage.type = "error";
                this.fadeAwayMessage.header = "System Message";
                this.fadeAwayMessage.message = res.data.msg;
              }
            }
          );
        }
      }
      // if (this.$refs.MyCoreTimeFormref.validate()) {
      //   if (this.schedList.length > 0) {
      //     let data = {
      //       ctType: this.ctdModel.ctType,
      //       cyFrom: this.ctdModel.cyFrom,
      //       cyTo: this.ctdModel.cyTo,
      //       syID: this.ctdModel.syID,
      //       sem: this.ctdModel.sem,
      //       id: this.ctdModel.id,
      //     };
      //     this.axiosCall("/my-core-time/checkConflict", "POST", data).then(
      //       (res) => {
      //         console.log(res.data);
      //         this.confirmSubmissionDialog = true;
      //         if (res.data.status == 200) {
      //           this.confirmSubmit.error = false;
      //           this.confirmSubmit.type = type;
      //         } else if (res.data.status == 400) {
      //           this.confirmSubmit.error = true;
      //           this.confirmSubmit.type = type;
      //           this.confirmSubmit.msg = res.data.msg;
      //         }
      //       }
      //     );
      //   } else {
      //     this.fadeAwayMessage.show = true;
      //     this.fadeAwayMessage.type = "error";
      //     this.fadeAwayMessage.header = "System Message";
      //     this.fadeAwayMessage.message = "No time schedules found!";
      //   }

      //   // this.confirmUpdateDialog = true;
      // }
    },

    updateCoreTime() {
      this.submitBtnLoading = true;
      // if (this.$refs.MyCoreTimeFormref.validate()) {
      let data = {
        coreTimeSched: this.schedList,
        // designationID: this.ctdModel.designationID,
        ctType: this.ctdModel.ctType,

        cyFrom: this.ctdModel.cyFrom,
        cyTo: this.ctdModel.cyTo,

        syID: this.ctdModel.syID,
        sem: this.ctdModel.sem,
        employeeID: this.ctdModel.empID,
        // isActive: this.ctdModel.isActive == "Active" ? true : false,
      };

      this.axiosCall("/my-core-time/" + this.ctdModel.id, "PATCH", data).then(
        (res) => {
          this.submitBtnLoading = false;
          if (res.data.status == 200) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.$refs.MyCoreTimeFormref.reset();
            this.confirmSubmissionDialog = false;
            this.closeD();
          } else if (res.data.status == 400) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
          }
        }
      );
      // }
    },

    getSchoolYear() {
      this.axiosCall("/school-year", "GET").then((res) => {
        console.log(res.data);
        this.syList = res.data;
      });
    },

    getDirectHead() {
      this.axiosCall("/my-direct-head/getMyDirectHead", "GET").then((res) => {
        if (res.data) {
          this.directHeadUser = res.data[0].userID;
        }
      });
    },

    getEmpDetails() {
      this.axiosCall("/employee/my-details", "GET").then((res) => {
        console.log(res.data);
        this.ctdModel.assigned_office = res.data.officeID;
      });
    },

    getOffices() {
      this.axiosCall("/offices", "GET").then((res) => {
        this.officeList = res.data;
      });
    },
    getPositions() {
      this.axiosCall("/positions", "GET").then((res) => {
        this.positionList = res.data;
      });
    },
    getDesignations() {
      this.axiosCall("/designations", "GET").then((res) => {
        this.designationList = res.data;
      });
    },
    getEmpStatus() {
      this.axiosCall("/employment-status", "GET").then((res) => {
        this.empStatusList = res.data;
      });
    },
    getInstitutes() {
      this.axiosCall("/institutes", "GET").then((res) => {
        this.instituteList = res.data;
      });
    },
  },
};
</script>
