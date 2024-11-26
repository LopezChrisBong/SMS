<template>
  <div>
    <v-dialog v-model="dialog" eager persistent scrollable fullscreen>
      <v-form ref="AddTARFormref" enctype="multipart/form-data" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span
              >{{
                action == "Approve" ? "Approve" : action == "View" ? "View" : ""
              }}
              TAR - {{ prepared_by }}</span
            >
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
                    <v-stepper-header v-if="tarType == 1">
                      <v-stepper-step
                        step="1"
                        class="pa-5"
                        style="cursor:pointer"
                        :rules="[() => immHead_approval_status != 3]"
                        :complete="immHead_approval_status == 2 ? true : false"
                        color="#6DB249"
                      >
                        <h3 class="text-gray-200 text-body-2">
                          {{ getUserNames(immHead_user_detailID) }}
                        </h3>
                        <small>Immediate head</small>
                      </v-stepper-step>

                      <v-divider></v-divider>

                      <v-stepper-step
                        step="2"
                        class="pa-5"
                        :rules="[() => hr_approval_status != 3]"
                        :complete="hr_approval_status == 2 ? true : false"
                        color="#6DB249"
                      >
                        HR Personnel
                      </v-stepper-step>
                    </v-stepper-header>

                    <v-stepper-header v-if="tarType == 2">
                      <v-stepper-step
                        step="1"
                        class="pa-5"
                        style="cursor:pointer"
                        :rules="[() => immHead_approval_status != 3]"
                        :complete="immHead_approval_status == 2 ? true : false"
                        color="#6DB249"
                      >
                        <h3 class="text-gray-200 text-body-2">
                          {{ getUserNames(immHead_user_detailID) }}
                        </h3>
                        <small>Immediate head</small>
                      </v-stepper-step>

                      <v-divider></v-divider>

                      <v-stepper-step
                        step="2"
                        class="pa-5"
                        style="cursor:pointer"
                        :rules="[() => REPDir_approval_status != 3]"
                        :complete="REPDir_approval_status == 2 ? true : false"
                        color="#6DB249"
                      >
                        <h3 class="text-gray-200 text-body-2">
                          {{ getUserNames(REPDir_user_detailID) }}
                        </h3>
                        <small>Director for Research and Development</small>
                      </v-stepper-step>

                      <v-divider></v-divider>

                      <v-stepper-step
                        step="3"
                        class="pa-5"
                        style="cursor:pointer"
                        :rules="[() => HRM_approval_status != 3]"
                        :complete="HRM_approval_status == 2 ? true : false"
                        color="#6DB249"
                      >
                        <h3 class="text-gray-200 text-body-2">
                          {{ getUserNames(HRM_user_detailID) }}
                        </h3>
                        <small>Director for HRM Division </small>
                      </v-stepper-step>

                      <v-divider></v-divider>

                      <v-stepper-step
                        class="pa-5"
                        step="4"
                        :rules="[() => hr_approval_status != 3]"
                        :complete="hr_approval_status == 2 ? true : false"
                        color="#6DB249"
                      >
                        HR Personnel
                      </v-stepper-step>
                    </v-stepper-header>
                  </v-stepper>
                </v-col>
                <!-- <v-col cols="6">
                  <h3>Attachments</h3>
                </v-col>
                <v-col cols="6" class="d-flex justify-end">
                  <v-btn
                    v-if="action != 'View'"
                    color="#519043"
                    class="white--text"
                    @click="addAttachment()"
                  >
                    Add New Attachment
                  </v-btn>
                </v-col>
                <v-col cols="6" v-if="action != 'View'">
                  <v-text-field
                    v-model="file_desc"
                    dense
                    outlined
                    required
                    label="Description"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>
                <v-col cols="6" v-if="action != 'View'">
                  <v-file-input
                    v-model="file_selected"
                    accept="application/pdf"
                    outlined
                    color="#6DB249"
                    dense
                    label="Upload file"
                  ></v-file-input>
                </v-col>

                <v-col cols="12" v-if="files_to_display.length > 0">
                  <div class="elevation-2 rounded-lg ">
                    <div
                      class="d-flex justify-space-between  elevation-1 px-2 py-2 white--text"
                      style="background-color:#519043"
                    >
                      <h3
                        class="text-subtitle-2 text-center"
                        style="width:35%;"
                      >
                        Description
                      </h3>
                      <h3
                        class="text-subtitle-2 text-center"
                        style="width:35%;"
                      >
                        File
                      </h3>
                      <h3
                        class="text-subtitle-2 text-center"
                        style="width:30%; "
                      >
                        Action
                      </h3>
                    </div>
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
                </v-col> -->

                <v-col
                  cols="12"
                  class="mt-4 elevation-4 d-flex justify-space-around"
                >
                  <v-checkbox
                    readonly
                    color="#6DB249"
                    :value="1"
                    :checked="tarType == 1 ? true : false"
                    v-model="tarType"
                    label="(Seminars/Webinars, Conferences, Training/Workshops)"
                  ></v-checkbox>
                  <v-checkbox
                    readonly
                    color="#6DB249"
                    :value="2"
                    :checked="tarType == 2 ? true : false"
                    v-model="tarType"
                    label="Participation to Conferences and Publication)"
                  ></v-checkbox>
                </v-col>
                <v-col cols="12" class="mt-4 elevation-4">
                  <v-text-field
                    v-model="title"
                    label="Title of the Activity"
                    readonly
                    outlined
                    dense
                    color="#519043"
                  ></v-text-field>
                </v-col>

                <v-col cols="6" class="elevation-2">
                  <h3 class="mt-2 text-h6">Accomplishment/s</h3>
                  <v-divider></v-divider>
                  <i class="mt-2" v-if="accomplishmentsList.length == 0"
                    ><p class="text-caption">No data found.</p></i
                  >
                  <ul class="mt-2" v-else>
                    <li v-for="(i, index) in accomplishmentsList" :key="index">
                      <div class="d-flex justify-space-between">
                        <div>{{ i }}</div>
                      </div>
                    </li>
                  </ul>
                </v-col>

                <v-col cols="6" class="elevation-2">
                  <h3 class="mt-2 text-h6">Plan of Action</h3>
                  <v-divider></v-divider>
                  <i class="mt-2" v-if="planOfActionList.length == 0"
                    ><p class="text-caption">No data found.</p></i
                  >
                  <ul class="mt-2" v-else>
                    <li v-for="(i, index) in planOfActionList" :key="index">
                      <div class="d-flex justify-space-between">
                        <div>{{ i }}</div>
                      </div>
                    </li>
                  </ul>
                </v-col>
                <v-col cols="6" class="elevation-2  mt-4" v-if="tarType == 1">
                  <h3 class="mt-2 text-h6">Timeline of Action</h3>
                  <v-divider></v-divider>
                  <i class="mt-2" v-if="timeLineOfActionList.length == 0"
                    ><p class="text-caption">No data found.</p></i
                  >
                  <ul class="mt-2" v-else>
                    <li v-for="(i, index) in timeLineOfActionList" :key="index">
                      <div class="d-flex justify-space-between">
                        <div>{{ i }}</div>
                      </div>
                    </li>
                  </ul>
                </v-col>

                <v-col cols="6" class="elevation-2 mt-4" v-if="tarType == 1">
                  <h3 class="mt-2 text-h6">
                    How to be Evaluated(After 3 - 4 months)
                  </h3>
                  <v-divider></v-divider>
                  <i class="mt-2" v-if="evaluationList.length == 0"
                    ><p class="text-caption">No data found.</p></i
                  >
                  <ul class="mt-2" v-else>
                    <li v-for="(i, index) in evaluationList" :key="index">
                      <div class="d-flex justify-space-between">
                        <div>{{ i }}</div>
                      </div>
                    </li>
                  </ul>
                </v-col>

                <v-col class="mt-4 elevation-4" cols="12">
                  <h3 class="text-h6">Evaluation</h3>
                  <p class="text-subtitle-2">
                    Kindly answer each question below by checking (/) the column
                    that matches your judgment. Please rate these questions on a
                    1 to 5 scale, one(1) being the lowest score and five (5)
                    being the highest score. The column heading have these
                    meanings:
                  </p>
                  <div style="width:75%; " class="d-flex justify-space-around">
                    <div class="text-subtitle-2">
                      (5) Excellent
                    </div>
                    <div class="text-subtitle-2">
                      (4) Good
                    </div>
                    <div class="text-subtitle-2">
                      (3) Fair
                    </div>
                    <div class="text-subtitle-2">
                      (2) Needs Improvement
                    </div>
                    <div class="text-subtitle-2">
                      (1) Poor
                    </div>
                  </div>
                  <table class="mt-2 elevation-2" id="table">
                    <tr>
                      <th class="font-weight-bold">#</th>
                      <th class="font-weight-bold">Area/s</th>
                      <th class="font-weight-bold">5</th>
                      <th class="font-weight-bold">4</th>
                      <th class="font-weight-bold">3</th>
                      <th class="font-weight-bold">2</th>
                      <th class="font-weight-bold">1</th>
                    </tr>
                    <tr>
                      <td class="text-body-2 " align="center">1</td>
                      <td class="text-body-2 indent">
                        To what extent has the activity awakened your awareness?
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          readonly
                          v-model="eval1"
                          color="#6DB249"
                          :value="5"
                          :checked="eval1 == 5 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          readonly
                          v-model="eval1"
                          color="#6DB249"
                          :value="4"
                          :checked="eval1 == 4 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          readonly
                          v-model="eval1"
                          color="#6DB249"
                          :value="3"
                          :checked="eval1 == 3 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          readonly
                          v-model="eval1"
                          color="#6DB249"
                          :value="2"
                          :checked="eval1 == 2 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          readonly
                          v-model="eval1"
                          color="#6DB249"
                          :value="1"
                          :checked="eval1 == 1 ? true : false"
                        ></v-checkbox>
                      </td>
                    </tr>
                    <tr>
                      <td class="text-body-2 " align="center">2</td>
                      <td class="text-body-2 indent">
                        To what extent has the activity met your expectations?
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          readonly
                          v-model="eval2"
                          color="#6DB249"
                          :value="5"
                          :checked="eval2 == 5 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          readonly
                          v-model="eval2"
                          color="#6DB249"
                          :value="4"
                          :checked="eval2 == 4 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          readonly
                          v-model="eval2"
                          color="#6DB249"
                          :value="3"
                          :checked="eval2 == 3 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          readonly
                          v-model="eval2"
                          color="#6DB249"
                          :value="2"
                          :checked="eval2 == 2 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          readonly
                          v-model="eval2"
                          color="#6DB249"
                          :value="1"
                          :checked="eval2 == 1 ? true : false"
                        ></v-checkbox>
                      </td>
                    </tr>
                    <tr>
                      <td class="text-body-2 " align="center">3</td>
                      <td class="text-body-2 indent">
                        Were the objectives of the said activity attained?
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          readonly
                          v-model="eval3"
                          color="#6DB249"
                          :value="5"
                          :checked="eval3 == 5 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          readonly
                          v-model="eval3"
                          color="#6DB249"
                          :value="4"
                          :checked="eval3 == 4 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          readonly
                          v-model="eval3"
                          color="#6DB249"
                          :value="3"
                          :checked="eval3 == 3 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          readonly
                          v-model="eval3"
                          color="#6DB249"
                          :value="2"
                          :checked="eval3 == 2 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          readonly
                          v-model="eval3"
                          color="#6DB249"
                          :value="1"
                          :checked="eval3 == 1 ? true : false"
                        ></v-checkbox>
                      </td>
                    </tr>
                    <tr>
                      <td class="text-body-2 " align="center">4</td>
                      <td class="text-body-2 indent">
                        How much did the seminar help you become a well oriented
                        DNSC employee?
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          readonly
                          v-model="eval4"
                          color="#6DB249"
                          :value="5"
                          :checked="eval4 == 5 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          readonly
                          v-model="eval4"
                          color="#6DB249"
                          :value="4"
                          :checked="eval4 == 4 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          readonly
                          v-model="eval4"
                          color="#6DB249"
                          :value="3"
                          :checked="eval4 == 3 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          readonly
                          v-model="eval4"
                          color="#6DB249"
                          :value="2"
                          :checked="eval4 == 2 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          readonly
                          v-model="eval4"
                          color="#6DB249"
                          :value="1"
                          :checked="eval4 == 1 ? true : false"
                        ></v-checkbox>
                      </td>
                    </tr>

                    <tr>
                      <td class="text-body-2 rem_border_btm indent"></td>
                      <td class="text-body-2 rem_border_btm indent">
                        How much did you learn from:
                      </td>
                      <td class="text-body-2  rem_border_btm"></td>
                      <td class="text-body-2 rem_border_btm"></td>
                      <td class="text-body-2 rem_border_btm"></td>
                      <td class="text-body-2 rem_border_btm"></td>
                      <td class="text-body-2 rem_border_btm"></td>
                    </tr>
                    <tr>
                      <td
                        class="text-body-2 rem_border_top rem_border_btm indent"
                      ></td>
                      <td
                        class="text-body-2 rem_border_top rem_border_btm indent"
                      >
                        1.1 Being well-informed
                      </td>
                      <td class="text-body-2 rem_border_top" align="center">
                        <v-checkbox
                          readonly
                          v-model="eval411"
                          color="#6DB249"
                          :value="5"
                          :checked="eval411 == 5 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2 rem_border_top" align="center">
                        <v-checkbox
                          readonly
                          v-model="eval411"
                          color="#6DB249"
                          :value="4"
                          :checked="eval411 == 4 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2 rem_border_top" align="center">
                        <v-checkbox
                          readonly
                          v-model="eval411"
                          color="#6DB249"
                          :value="3"
                          :checked="eval411 == 3 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2 rem_border_top" align="center">
                        <v-checkbox
                          readonly
                          v-model="eval411"
                          color="#6DB249"
                          :value="2"
                          :checked="eval411 == 2 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2 rem_border_top" align="center">
                        <v-checkbox
                          readonly
                          v-model="eval411"
                          color="#6DB249"
                          :value="1"
                          :checked="eval411 == 1 ? true : false"
                        ></v-checkbox>
                      </td>
                    </tr>
                    <tr>
                      <td class="text-body-2 rem_border_top indent"></td>
                      <td class="text-body-2 rem_border_top indent">
                        1.2 Proper Observance
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          readonly
                          v-model="eval412"
                          color="#6DB249"
                          :value="5"
                          :checked="eval412 == 5 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          readonly
                          v-model="eval412"
                          color="#6DB249"
                          :value="4"
                          :checked="eval412 == 4 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          readonly
                          v-model="eval412"
                          color="#6DB249"
                          :value="3"
                          :checked="eval412 == 3 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          readonly
                          v-model="eval412"
                          color="#6DB249"
                          :value="2"
                          :checked="eval412 == 2 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          readonly
                          v-model="eval412"
                          color="#6DB249"
                          :value="1"
                          :checked="eval412 == 1 ? true : false"
                        ></v-checkbox>
                      </td>
                    </tr>
                    <tr>
                      <td class="text-body-2 indent"></td>
                      <td class="text-body-2 indent">
                        Rate the timeliness of this event
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          readonly
                          v-model="eval5"
                          color="#6DB249"
                          :value="5"
                          :checked="eval5 == 5 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          readonly
                          v-model="eval5"
                          color="#6DB249"
                          :value="4"
                          :checked="eval5 == 4 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          readonly
                          v-model="eval5"
                          color="#6DB249"
                          :value="3"
                          :checked="eval5 == 3 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          readonly
                          v-model="eval5"
                          color="#6DB249"
                          :value="2"
                          :checked="eval5 == 2 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          readonly
                          v-model="eval5"
                          color="#6DB249"
                          :value="1"
                          :checked="eval5 == 1 ? true : false"
                        ></v-checkbox>
                      </td>
                    </tr>
                    <tr>
                      <td class="text-body-2 indent"></td>
                      <td class="text-body-2 indent">Rate the speaker(s)</td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          readonly
                          v-model="eval6"
                          color="#6DB249"
                          :value="5"
                          :checked="eval6 == 5 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          readonly
                          v-model="eval6"
                          color="#6DB249"
                          :value="4"
                          :checked="eval6 == 4 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          readonly
                          v-model="eval6"
                          color="#6DB249"
                          :value="3"
                          :checked="eval6 == 3 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          readonly
                          v-model="eval6"
                          color="#6DB249"
                          :value="2"
                          :checked="eval6 == 2 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          readonly
                          v-model="eval6"
                          color="#6DB249"
                          :value="1"
                          :checked="eval6 == 1 ? true : false"
                        ></v-checkbox>
                      </td>
                    </tr>
                    <tr>
                      <td class="text-body-2 indent"></td>
                      <td class="text-body-2 indent">
                        Rate the location of the event
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          readonly
                          v-model="eval7"
                          color="#6DB249"
                          :value="5"
                          :checked="eval7 == 5 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          readonly
                          v-model="eval7"
                          color="#6DB249"
                          :value="4"
                          :checked="eval7 == 4 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          readonly
                          v-model="eval7"
                          color="#6DB249"
                          :value="3"
                          :checked="eval7 == 3 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          readonly
                          v-model="eval7"
                          color="#6DB249"
                          :value="2"
                          :checked="eval7 == 2 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          readonly
                          v-model="eval7"
                          color="#6DB249"
                          :value="1"
                          :checked="eval7 == 1 ? true : false"
                        ></v-checkbox>
                      </td>
                    </tr>
                  </table>
                </v-col>
                <v-col cols="12" class="mt-4 elevation-4">
                  <p class="text-h6 mt-6">
                    What kind of other activity/seminar/trainings or services
                    would you like to suggest?
                  </p>
                  <v-textarea
                    v-model="suggestedActivity"
                    outlined
                    placeholder="Type here..."
                  ></v-textarea>
                </v-col>
                <v-col cols="12" class="mt-4 elevation-4">
                  <p class="text-h6 mt-6">
                    The seminar/training conducted enhanced and developed myself
                    especially my potentials (skills, talents, etc.) or
                    leadership experience.
                  </p>
                  <div class="mt-2 d-flex justify-space-around">
                    <v-checkbox
                      readonly
                      color="#6DB249"
                      :value="1"
                      :checked="expertiseRating == 1 ? true : false"
                      v-model="expertiseRating"
                      label="Substantially"
                    ></v-checkbox>
                    <v-checkbox
                      readonly
                      color="#6DB249"
                      :value="2"
                      :checked="expertiseRating == 2 ? true : false"
                      v-model="expertiseRating"
                      label="Somewhat"
                    ></v-checkbox>
                    <v-checkbox
                      readonly
                      color="#6DB249"
                      :value="3"
                      :checked="expertiseRating == 3 ? true : false"
                      v-model="expertiseRating"
                      label="Not at all"
                    ></v-checkbox>
                  </div>
                </v-col>
                <v-col cols="12" class="mt-4 elevation-4">
                  <p class="text-h6 mt-6">
                    COMMENTS/SUGGESTIONS:
                  </p>
                  <v-textarea
                    v-model="commentSuggestion"
                    readonly
                    outlined
                    placeholder="Type here..."
                  ></v-textarea>
                </v-col>
                <v-col cols="12" class="mt-4 elevation-4">
                  <div class="d-flex justify-space-between">
                    <div class="text-h6 mt-6">
                      Attachments:
                    </div>
                  </div>
                  <div class="elevation-2 rounded-lg mt-2">
                    <div
                      class="d-flex justify-space-between  elevation-1 px-2 py-2 white--text"
                      style="background-color:#519043"
                    >
                      <h3
                        class="text-subtitle-2 text-center"
                        style="width:35%;"
                      >
                        Description
                      </h3>
                      <h3
                        class="text-subtitle-2 text-center"
                        style="width:35%;"
                      >
                        File
                      </h3>
                      <h3
                        class="text-subtitle-2 text-center"
                        style="width:30%; "
                      >
                        Action
                      </h3>
                    </div>
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
                        <v-btn
                          icon
                          color="#519043"
                          @click="viewFile(file.filename)"
                          ><v-icon>mdi-eye-outline</v-icon></v-btn
                        >
                      </div>
                    </div>
                  </div>
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
                    color="#519043"
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
                        color="#519043"
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
                        color="#519043"
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
            <!-- <v-btn color="red" outlined @click="closeD()">
              <v-icon>mdi-close-circle-outline</v-icon>
              {{ action == "View" ? "Close" : "Cancel" }}
            </v-btn> -->
            <v-btn
              v-if="action == 'Approve'"
              color="red"
              class="white--text"
              @click="pending()"
            >
              <v-icon>mdi-close-circle</v-icon>
              Pending
            </v-btn>
            <v-btn
              v-if="action == 'Approve'"
              color="#519043"
              class="white--text"
              @click="save()"
            >
              <v-icon>mdi-check-circle</v-icon>
              Approve
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <v-dialog v-model="remarksDialog" persistent max-width="500">
      <v-card color="white">
        <v-form ref="RemarksFormref" @submit.prevent>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>Add Remarks</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="remarksDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col>
                  <v-textarea
                    solo
                    name="input-7-4"
                    :rules="[formRules.required]"
                    label="Remarks"
                    v-model="remarksMsg"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" outlined @click="confirmDialog = false">
              Close
            </v-btn>
            <v-btn color="green" class="white--text" @click="saveRemarks()">
              Confirm
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <ViewAttachment :data="filename" :moduleFrom="'TAR'" />
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
    isHRApproval: null,
  },
  components: {
    ViewAttachment: () => import("../Views/ViewAttachment.vue"),
  },
  data() {
    return {
      dialog: false,
      remarksDialog: false,
      filename: null,
      remarksMsg: null,
      remarksData: [],
      TO_ID: null,
      tarID: null,
      isTagged: null,
      title: null,
      to_activity: null,
      fieldToAdd: null,
      suggestedActivity: null,
      expertiseRating: null,
      commentSuggestion: null,
      accomplishmentsList: [],
      planOfActionList: [],
      timeLineOfActionList: [],
      evaluationList: [],
      fieldList: [
        { id: 1, field: "Accomplishments" },
        { id: 2, field: "Plan Of Action" },
        { id: 3, field: "Timeline of Action" },
        { id: 4, field: "How to be evaluated" },
      ],
      eval1: null,
      eval2: null,
      eval3: null,
      eval4: null,
      eval411: null,
      eval412: null,
      eval5: null,
      eval6: null,
      eval7: null,
      tarType: 1,
      immHeadName: null,
      immHead_approval_status: null,
      immHead_user_detailID: null,
      hr_approval_status: null,
      hr_user_detailID: null,
      REPDir_user_detailID: null,
      REPDir_approval_status: null,
      HRM_user_detailID: null,
      HRM_approval_status: null,
      prepared_by: null,
      files_to_display: [],
      usersList: [],
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
        this.getUsers();
        this.dialog = true;
        console.log(data);
        this.tarType = data.tarType;
        this.prepared_by = data.name;
        this.tarID = data.id;
        this.title = data.title;
        this.isTagged = data.isTagged;
        this.accomplishmentsList = data.accomplishmentsList
          ? data.accomplishmentsList
          : [];
        this.planOfActionList = data.planOfActionList
          ? data.planOfActionList
          : [];
        this.timeLineOfActionList = data.timelineOfActionList
          ? data.timelineOfActionList
          : [];
        this.evaluationList = data.evaluationList ? data.evaluationList : [];
        this.eval1 = data.eval1;
        this.eval2 = data.eval2;
        this.eval3 = data.eval3;
        this.eval4 = data.eval4;
        this.eval411 = data.eval411;
        this.eval412 = data.eval412;
        this.eval5 = data.eval5;
        this.eval6 = data.eval6;
        this.eval7 = data.eval7;
        this.suggestedActivity = data.suggestedActivity;
        this.expertiseRating = data.expertiseRating;
        this.commentSuggestion = data.commentSuggestion;
        this.immHead_approval_status = data.immHead_approval_status;
        this.immHead_user_detailID = data.immHead_user_detailID;
        this.REPDir_approval_status =
          data.tarType == 2 ? data.REPDir_approval_status : null;
        this.REPDir_user_detailID =
          data.tarType == 2 ? data.REPDir_user_detailID.toString() : null;
        this.HRM_approval_status =
          data.tarType == 2 ? data.HRM_approval_status : null;
        this.HRM_user_detailID =
          data.tarType == 2 ? data.HRM_user_detailID.toString() : null;
        this.hr_approval_status = data.hr_approval_status;
        this.getTARAttachments(data.id);
        this.getImmediateHead(data.immHead_user_detailID);
        this.loadRemarks(data.id);
      },
      deep: true,
    },
  },

  methods: {
    initialize() {
      this.$refs.AddTARFormref.resetValidation();
    },
    getTARAttachments(id) {
      this.axiosCall("/tar/getAttachments/" + id, "GET").then((res) => {
        if (res.data) {
          console.log("files", res.data);
          this.files_to_display = res.data;
        }
      });
    },

    viewFile(file) {
      this.filename = null;
      setTimeout(() => {
        this.filename = file;
      }, 50);
    },

    closeD() {
      this.eventHub.$emit("closeTARApprovalDialog", false);
      this.dialog = false;
    },

    getUserNames(id) {
      let name;
      this.usersList.forEach((element) => {
        if (element.id == id) {
          name = element.name;
        }
      });
      return name;
    },

    getUsers() {
      this.axiosCall("/user-details/getAllUserDetail", "GET").then((res) => {
        this.usersList = res.data;
        // console.log(res.data);
      });
    },

    getImmediateHead(id) {
      this.axiosCall("/my-direct-head/getPersonnelName/" + id, "GET").then(
        (res) => {
          if (res.data) {
            console.log(res.data);
            this.immHeadName = res.data.name;
          }
        }
      );
    },

    save() {
      var url = this.isHRApproval ? "/tar/HRApprovedTAR" : "/tar/approveTAR";

      var data;
      if (this.isHRApproval) {
        data = {
          tarID: this.tarID,
          approval_status: 2,
          approvedBy: "HR personnel",
        };
      } else {
        if (this.$store.state.user.id == this.immHead_user_detailID) {
          if (this.$store.state.user.id == this.HRM_user_detailID) {
            data = {
              tarID: this.tarID,
              approval_status: 2,
              approvedBy: "Immediate head / HRM Dir",
            };
          } else {
            data = {
              tarID: this.tarID,
              approval_status: 2,
              approvedBy: "Immediate head",
            };
          }
        } else if (this.$store.state.user.id == this.REPDir_user_detailID) {
          data = {
            tarID: this.tarID,
            approval_status: 2,
            approvedBy: "REP Dir",
          };
        } else if (this.$store.state.user.id == this.HRM_user_detailID) {
          data = {
            tarID: this.tarID,
            approval_status: 2,
            approvedBy: "HRM Director",
          };
        }
      }

      this.axiosCall(url, "POST", data).then((res) => {
        if (res.data.status == 200) {
          this.dialog = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
          this.closeD();
        } else if (res.data.status == 400) {
          this.dialog = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
          this.$refs.PositionFormref.reset();
          this.closeD();
        }
      });
    },

    pending() {
      this.remarksDialog = true;
      this.$refs.RemarksFormref.resetValidation();
    },

    savePending() {
      var data;
      if (this.isHRApproval) {
        data = {
          tarID: this.tarID,
          pendingBy: "HR personnel",
        };
      } else {
        if (this.$store.state.user.id == this.immHead_user_detailID) {
          if (this.$store.state.user.id == this.HRM_user_detailID) {
            data = {
              tarID: this.tarID,
              pendingBy: "Immediate head / HRM Dir",
            };
          } else {
            data = {
              tarID: this.tarID,
              pendingBy: "Immediate head",
            };
          }
        } else if (this.$store.state.user.id == this.REPDir_user_detailID) {
          data = {
            tarID: this.tarID,
            pendingBy: "REP Dir",
          };
        } else if (this.$store.state.user.id == this.HRM_user_detailID) {
          data = {
            tarID: this.tarID,
            pendingBy: "HRM Director",
          };
        }
      }
      // console.log(data);
      this.axiosCall("/tar/pending", "POST", data).then((res) => {
        if (res.data.status == 200) {
          this.closeD();
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
        } else if (res.data.status == 400) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
        }
      });
    },

    loadRemarks(id) {
      this.axiosCall("/remarks/" + id + "/TAR", "GET").then((res) => {
        if (res.data) {
          this.remarksData = res.data;
        }
      });
    },

    saveRemarks() {
      if (this.$refs.RemarksFormref.validate()) {
        let data = {
          remarks_from: "TAR",
          id_to_remark: this.tarID,
          message: this.remarksMsg,
        };
        this.axiosCall("/remarks", "POST", data).then((res) => {
          if (res.data.status == 201) {
            this.remarksDialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;

            this.savePending();
          } else if (res.data.status == 400) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
          }
        });
      }
    },
  },
};
</script>

<style scoped>
.clickme {
  text-decoration: underline;
  cursor: pointer;
  text-underline-offset: 2px;
}
.grid {
  display: grid;
  row-gap: 2px;
}
#table {
  width: 100%;
  border-collapse: collapse;
}
table,
th,
td {
  border: 1px solid rgb(201, 201, 201);
}
.rem_border_btm {
  border-bottom: none !important;
}
.rem_border_top {
  border-top: none !important;
}
.indent {
  text-indent: 20px;
}
td {
  padding: 5px;
}
</style>
