<template>
  <div>
    <v-dialog v-model="dialog" eager persistent scrollable fullscreen>
      <v-form ref="AddTARFormref" enctype="multipart/form-data" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>{{ action }} TAR</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="closeD()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 900px" class="my-4">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-stepper alt-labels class="elevation-0" v-if="tarID">
                    <v-stepper-header v-if="tarType == 1">
                      <v-stepper-step
                        class="pa-5"
                        step="1"
                        style="cursor:pointer"
                        :complete="immHead_approval_status == 2 ? true : false"
                        :rules="[() => immHead_approval_status != 3]"
                        color="#6DB249"
                      >
                        <h3 class="text-gray-200 text-body-2">
                          {{ getUserNames(immHead_user_detailID) }}
                        </h3>
                        <small>Immediate head</small>
                      </v-stepper-step>

                      <v-divider></v-divider>

                      <v-stepper-step
                        class="pa-5"
                        step="2"
                        :complete="hr_approval_status == 2 ? true : false"
                        :rules="[() => hr_approval_status != 3]"
                        color="#6DB249"
                      >
                        <h3 class="text-gray-200 text-body-2">
                          HR Personnel
                        </h3>
                      </v-stepper-step>
                    </v-stepper-header>

                    <v-stepper-header v-if="tarType == 2">
                      <v-stepper-step
                        class="pa-5"
                        step="1"
                        style="cursor:pointer"
                        :complete="immHead_approval_status == 2 ? true : false"
                        :rules="[() => immHead_approval_status != 3]"
                        color="#6DB249"
                      >
                        <h3 class="text-gray-200 text-body-2">
                          {{ getUserNames(immHead_user_detailID) }}
                        </h3>
                        <small>Immediate head</small>
                      </v-stepper-step>

                      <v-divider></v-divider>

                      <v-stepper-step
                        class="pa-5"
                        step="2"
                        style="cursor:pointer"
                        :complete="REPDir_approval_status == 2 ? true : false"
                        :rules="[() => REPDir_approval_status != 3]"
                        color="#6DB249"
                      >
                        <h3 class="text-gray-200 text-body-2">
                          {{ getUserNames(REPDir_user_detailID) }}
                        </h3>
                        <small>Director for Research and Development</small>
                      </v-stepper-step>

                      <v-divider></v-divider>

                      <v-stepper-step
                        class="pa-5"
                        step="3"
                        style="cursor:pointer"
                        :complete="HRM_approval_status == 2 ? true : false"
                        :rules="[() => HRM_approval_status != 3]"
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
                        :complete="hr_approval_status == 2 ? true : false"
                        :rules="[() => hr_approval_status != 3]"
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
                    color="#5a67da"
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
                      style="background-color:#5a67da"
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
                    :rules="tarType ? [] : [formRules.required]"
                    color="#6DB249"
                    :readonly="action == 'View'"
                    :value="1"
                    :checked="tarType == 1 ? true : false"
                    v-model="tarType"
                    label="(Seminars/Webinars, Conferences, Training/Workshops)"
                  ></v-checkbox>
                  <v-checkbox
                    :rules="tarType ? [] : [formRules.required]"
                    color="#6DB249"
                    :readonly="action == 'View'"
                    :value="2"
                    :checked="tarType == 2 ? true : false"
                    v-model="tarType"
                    label="Participation to Conferences and Publication)"
                  ></v-checkbox>
                </v-col>
                <v-col cols="12" class="mt-4 elevation-4">
                  <v-text-field
                    v-model="title"
                    :readonly="action == 'View'"
                    label="Title of the Activity"
                    :rules="[formRules.required]"
                    outlined
                    dense
                    color="#5a67da"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  class="d-flex justify-end"
                  v-if="action != 'View'"
                >
                  <v-btn
                    color="#5a67da"
                    class="white--text"
                    @click="addNewData()"
                  >
                    <v-icon>mdi-plus</v-icon>Add
                  </v-btn>
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
                        <div class="grid" v-if="isTagged == 0">
                          <v-btn
                            x-small
                            outlined
                            color="#5a67da"
                            @click="editData(1, index)"
                            >Edit</v-btn
                          >
                          <v-btn
                            x-small
                            outlined
                            color="red"
                            @click="removeData(1, index)"
                            >Remove</v-btn
                          >
                        </div>
                      </div>
                    </li>
                  </ul>
                </v-col>
                <v-spacer></v-spacer>
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
                        <div class="grid" v-if="isTagged == 0">
                          <v-btn
                            x-small
                            outlined
                            color="#5a67da"
                            @click="editData(2, index)"
                            >Edit</v-btn
                          >
                          <v-btn
                            x-small
                            outlined
                            color="red"
                            @click="removeData(2, index)"
                            >Remove</v-btn
                          >
                        </div>
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
                        <div class="grid" v-if="isTagged == 0">
                          <v-btn
                            x-small
                            outlined
                            color="#5a67da"
                            @click="editData(3, index)"
                            >Edit</v-btn
                          >
                          <v-btn
                            x-small
                            outlined
                            color="red"
                            @click="removeData(3, index)"
                            >Remove</v-btn
                          >
                        </div>
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
                        <div class="grid" v-if="isTagged == 0">
                          <v-btn
                            x-small
                            outlined
                            color="#5a67da"
                            @click="editData(4, index)"
                            >Edit</v-btn
                          >
                          <v-btn
                            x-small
                            outlined
                            color="red"
                            @click="removeData(4, index)"
                            >Remove</v-btn
                          >
                        </div>
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
                          :rules="eval1 ? [] : [formRules.required]"
                          :readonly="action == 'View'"
                          v-model="eval1"
                          color="#6DB249"
                          :value="5"
                          :checked="eval1 == 5 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          :rules="eval1 ? [] : [formRules.required]"
                          :readonly="action == 'View'"
                          v-model="eval1"
                          color="#6DB249"
                          :value="4"
                          :checked="eval1 == 4 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          :rules="eval1 ? [] : [formRules.required]"
                          :readonly="action == 'View'"
                          v-model="eval1"
                          color="#6DB249"
                          :value="3"
                          :checked="eval1 == 3 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          :rules="eval1 ? [] : [formRules.required]"
                          :readonly="action == 'View'"
                          v-model="eval1"
                          color="#6DB249"
                          :value="2"
                          :checked="eval1 == 2 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          :rules="eval1 ? [] : [formRules.required]"
                          :readonly="action == 'View'"
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
                          :rules="eval2 ? [] : [formRules.required]"
                          :readonly="action == 'View'"
                          v-model="eval2"
                          color="#6DB249"
                          :value="5"
                          :checked="eval2 == 5 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          :rules="eval2 ? [] : [formRules.required]"
                          :readonly="action == 'View'"
                          v-model="eval2"
                          color="#6DB249"
                          :value="4"
                          :checked="eval2 == 4 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          :rules="eval2 ? [] : [formRules.required]"
                          :readonly="action == 'View'"
                          v-model="eval2"
                          color="#6DB249"
                          :value="3"
                          :checked="eval2 == 3 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          :rules="eval2 ? [] : [formRules.required]"
                          :readonly="action == 'View'"
                          v-model="eval2"
                          color="#6DB249"
                          :value="2"
                          :checked="eval2 == 2 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          :rules="eval2 ? [] : [formRules.required]"
                          :readonly="action == 'View'"
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
                          :rules="eval3 ? [] : [formRules.required]"
                          :readonly="action == 'View'"
                          v-model="eval3"
                          color="#6DB249"
                          :value="5"
                          :checked="eval3 == 5 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          :rules="eval3 ? [] : [formRules.required]"
                          :readonly="action == 'View'"
                          v-model="eval3"
                          color="#6DB249"
                          :value="4"
                          :checked="eval3 == 4 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          :rules="eval3 ? [] : [formRules.required]"
                          :readonly="action == 'View'"
                          v-model="eval3"
                          color="#6DB249"
                          :value="3"
                          :checked="eval3 == 3 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          :rules="eval3 ? [] : [formRules.required]"
                          :readonly="action == 'View'"
                          v-model="eval3"
                          color="#6DB249"
                          :value="2"
                          :checked="eval3 == 2 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          :rules="eval3 ? [] : [formRules.required]"
                          :readonly="action == 'View'"
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
                          :rules="eval4 ? [] : [formRules.required]"
                          :readonly="action == 'View'"
                          v-model="eval4"
                          color="#6DB249"
                          :value="5"
                          :checked="eval4 == 5 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          :rules="eval4 ? [] : [formRules.required]"
                          :readonly="action == 'View'"
                          v-model="eval4"
                          color="#6DB249"
                          :value="4"
                          :checked="eval4 == 4 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          :rules="eval4 ? [] : [formRules.required]"
                          :readonly="action == 'View'"
                          v-model="eval4"
                          color="#6DB249"
                          :value="3"
                          :checked="eval4 == 3 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          :rules="eval4 ? [] : [formRules.required]"
                          :readonly="action == 'View'"
                          v-model="eval4"
                          color="#6DB249"
                          :value="2"
                          :checked="eval4 == 2 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          :rules="eval4 ? [] : [formRules.required]"
                          :readonly="action == 'View'"
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
                          :rules="eval411 ? [] : [formRules.required]"
                          :readonly="action == 'View'"
                          v-model="eval411"
                          color="#6DB249"
                          :value="5"
                          :checked="eval411 == 5 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2 rem_border_top" align="center">
                        <v-checkbox
                          :rules="eval411 ? [] : [formRules.required]"
                          :readonly="action == 'View'"
                          v-model="eval411"
                          color="#6DB249"
                          :value="4"
                          :checked="eval411 == 4 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2 rem_border_top" align="center">
                        <v-checkbox
                          :rules="eval411 ? [] : [formRules.required]"
                          :readonly="action == 'View'"
                          v-model="eval411"
                          color="#6DB249"
                          :value="3"
                          :checked="eval411 == 3 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2 rem_border_top" align="center">
                        <v-checkbox
                          :rules="eval411 ? [] : [formRules.required]"
                          :readonly="action == 'View'"
                          v-model="eval411"
                          color="#6DB249"
                          :value="2"
                          :checked="eval411 == 2 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2 rem_border_top" align="center">
                        <v-checkbox
                          :rules="eval411 ? [] : [formRules.required]"
                          :readonly="action == 'View'"
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
                          :rules="eval412 ? [] : [formRules.required]"
                          :readonly="action == 'View'"
                          v-model="eval412"
                          color="#6DB249"
                          :value="5"
                          :checked="eval412 == 5 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          :rules="eval412 ? [] : [formRules.required]"
                          :readonly="action == 'View'"
                          v-model="eval412"
                          color="#6DB249"
                          :value="4"
                          :checked="eval412 == 4 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          :rules="eval412 ? [] : [formRules.required]"
                          :readonly="action == 'View'"
                          v-model="eval412"
                          color="#6DB249"
                          :value="3"
                          :checked="eval412 == 3 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          :rules="eval412 ? [] : [formRules.required]"
                          :readonly="action == 'View'"
                          v-model="eval412"
                          color="#6DB249"
                          :value="2"
                          :checked="eval412 == 2 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          :rules="eval412 ? [] : [formRules.required]"
                          :readonly="action == 'View'"
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
                          :rules="eval5 ? [] : [formRules.required]"
                          :readonly="action == 'View'"
                          v-model="eval5"
                          color="#6DB249"
                          :value="5"
                          :checked="eval5 == 5 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          :rules="eval5 ? [] : [formRules.required]"
                          :readonly="action == 'View'"
                          v-model="eval5"
                          color="#6DB249"
                          :value="4"
                          :checked="eval5 == 4 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          :rules="eval5 ? [] : [formRules.required]"
                          :readonly="action == 'View'"
                          v-model="eval5"
                          color="#6DB249"
                          :value="3"
                          :checked="eval5 == 3 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          :rules="eval5 ? [] : [formRules.required]"
                          :readonly="action == 'View'"
                          v-model="eval5"
                          color="#6DB249"
                          :value="2"
                          :checked="eval5 == 2 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          :rules="eval5 ? [] : [formRules.required]"
                          :readonly="action == 'View'"
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
                          :rules="eval6 ? [] : [formRules.required]"
                          :readonly="action == 'View'"
                          v-model="eval6"
                          color="#6DB249"
                          :value="5"
                          :checked="eval6 == 5 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          :rules="eval6 ? [] : [formRules.required]"
                          :readonly="action == 'View'"
                          v-model="eval6"
                          color="#6DB249"
                          :value="4"
                          :checked="eval6 == 4 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          :rules="eval6 ? [] : [formRules.required]"
                          :readonly="action == 'View'"
                          v-model="eval6"
                          color="#6DB249"
                          :value="3"
                          :checked="eval6 == 3 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          :rules="eval6 ? [] : [formRules.required]"
                          :readonly="action == 'View'"
                          v-model="eval6"
                          color="#6DB249"
                          :value="2"
                          :checked="eval6 == 2 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          :rules="eval6 ? [] : [formRules.required]"
                          :readonly="action == 'View'"
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
                          :rules="eval7 ? [] : [formRules.required]"
                          :readonly="action == 'View'"
                          v-model="eval7"
                          color="#6DB249"
                          :value="5"
                          :checked="eval7 == 5 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          :rules="eval7 ? [] : [formRules.required]"
                          :readonly="action == 'View'"
                          v-model="eval7"
                          color="#6DB249"
                          :value="4"
                          :checked="eval7 == 4 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          :rules="eval7 ? [] : [formRules.required]"
                          :readonly="action == 'View'"
                          v-model="eval7"
                          color="#6DB249"
                          :value="3"
                          :checked="eval7 == 3 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          :rules="eval7 ? [] : [formRules.required]"
                          :readonly="action == 'View'"
                          v-model="eval7"
                          color="#6DB249"
                          :value="2"
                          :checked="eval7 == 2 ? true : false"
                        ></v-checkbox>
                      </td>
                      <td class="text-body-2" align="center">
                        <v-checkbox
                          :rules="eval7 ? [] : [formRules.required]"
                          :readonly="action == 'View'"
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
                    :readonly="action == 'View'"
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
                      :rules="expertiseRating ? [] : [formRules.required]"
                      :readonly="action == 'View'"
                      color="#6DB249"
                      :value="1"
                      :checked="expertiseRating == 1 ? true : false"
                      v-model="expertiseRating"
                      label="Substantially"
                    ></v-checkbox>
                    <v-checkbox
                      :rules="expertiseRating ? [] : [formRules.required]"
                      :readonly="action == 'View'"
                      color="#6DB249"
                      :value="2"
                      :checked="expertiseRating == 2 ? true : false"
                      v-model="expertiseRating"
                      label="Somewhat"
                    ></v-checkbox>
                    <v-checkbox
                      :rules="expertiseRating ? [] : [formRules.required]"
                      :readonly="action == 'View'"
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
                    :readonly="action == 'View'"
                    outlined
                    placeholder="Type here..."
                  ></v-textarea>
                </v-col>

                <v-col cols="12" class="mt-4 elevation-4">
                  <div class="d-flex justify-space-between">
                    <div class="text-h6 mt-6">
                      Attachments:
                    </div>
                    <div class="text-h6 mt-6">
                      <v-btn
                        v-if="action == 'Add' || action == 'Update'"
                        color="#5a67da"
                        class="white--text"
                        @click="addAttachment()"
                      >
                        <v-icon>mdi-plus</v-icon>Add
                      </v-btn>
                    </div>
                  </div>
                  <div class="elevation-2 rounded-lg mt-2">
                    <div
                      class="d-flex justify-space-between  elevation-1 px-2 py-2 white--text"
                      style="background-color:#5a67da"
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
                </v-col>

                <v-col cols="12" v-if="tarType == 2" class="elevation-2 mt-4">
                  <v-autocomplete
                    v-model="REPDir_user_detailID"
                    :rules="tarType == 2 ? [formRules.required] : []"
                    dense
                    :readonly="action == 'View'"
                    outlined
                    class="rounded-lg"
                    label="Director for Research and Development"
                    color="#93CB5B"
                    :items="usersList"
                    item-value="id"
                    item-text="name"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" v-if="tarType == 2" class="elevation-2">
                  <v-autocomplete
                    v-model="HRM_user_detailID"
                    :rules="tarType == 2 ? [formRules.required] : []"
                    dense
                    :readonly="action == 'View'"
                    outlined
                    class="rounded-lg"
                    label="Director for HRM Division"
                    color="#93CB5B"
                    :items="usersList"
                    item-value="id"
                    item-text="name"
                  >
                  </v-autocomplete>
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
                    :color="$vuetify.theme.themes.light.submitBtns"
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
            <v-btn color="red" outlined @click="closeD()">
              <v-icon>mdi-close-circle-outline</v-icon>
              {{ action == "View" ? "Close" : "Cancel" }}
            </v-btn>

            <v-btn
              v-if="tarID"
              :color="$vuetify.theme.themes.light.submitBtns"
              class="white--text"
              @click="print()"
            >
              <v-icon>mdi-printer</v-icon>
              print
            </v-btn>

            <v-btn
              v-if="action == 'Add'"
              :color="$vuetify.theme.themes.light.submitBtns"
              class="white--text"
              @click="save()"
            >
              <v-icon>mdi-check-circle</v-icon>
              Save
            </v-btn>

            <v-btn
              v-if="isTagged == 0 && action == 'Update' && getIsValidToUpdate"
              :color="$vuetify.theme.themes.light.submitBtns"
              class="white--text"
              @click="update()"
            >
              <v-icon>mdi-check-circle</v-icon>
              Update
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <v-dialog
      v-model="addDataDialog"
      eager
      scrollable
      persistent
      max-width="500px"
      transition="dialog-bottom-transition"
    >
      <v-form ref="addDataFormref" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>Add data to selected field</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="addDataDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 800px" class="my-4">
            <v-row>
              <v-col class="mt-2" cols="12">
                <v-autocomplete
                  v-model="fieldToAdd"
                  :rules="[formRules.required]"
                  dense
                  outlined
                  class="rounded-lg"
                  label="Field to add"
                  color="#93CB5B"
                  :items="tarType == 1 ? fieldList : fieldList1"
                  item-value="id"
                  item-text="field"
                >
                </v-autocomplete>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  outlined
                  dense
                  label="Data to add"
                  color="#93CB5B"
                  v-model="dataToAdd"
                  rows="2"
                  :rules="[formRules.required]"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions class="pa-5">
            <v-spacer></v-spacer>
            <v-btn color="red" outlined @click="addDataDialog = false">
              Close
            </v-btn>
            <v-btn
              :color="$vuetify.theme.themes.light.submitBtns"
              class="white--text"
              @click="saveNewData()"
            >
              Add
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <!-- attachment dialog -->
    <v-dialog
      v-model="attachmentDialog"
      transition="dialog-bottom-transition"
      max-width="600px"
    >
      <v-card>
        <v-card-title dark class="dialog-header">
          <span>Add Attachment</span>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="attachmentDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="mt-4">
          <v-form @submit.prevent ref="AttachmentFormref">
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
                  :rules="[formRules.required]"
                  accept="application/pdf"
                  outlined
                  color="#6DB249"
                  dense
                  label="Upload file"
                ></v-file-input>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn outlined color="red" @click="attachmentDialog = false"
            >Close</v-btn
          >
          <v-btn
            outlined
            :color="$vuetify.theme.themes.light.submitBtns"
            @click="saveAttachment()"
            >Add</v-btn
          >
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
      addDataDialog: false,
      tarType: 1,
      dataToAdd: null,
      dataDialogAction: null,
      dataIndexToEdit: null,
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
      immHeadName: null,
      immHead_approval_status: null,
      immHead_user_detailID: null,
      hr_approval_status: null,
      hr_user_detailID: null,
      REPDir_user_detailID: null,
      REPDir_approval_status: null,
      HRM_user_detailID: null,
      HRM_approval_status: null,
      usersList: [],
      fieldList: [
        { id: 1, field: "Accomplishments" },
        { id: 2, field: "Plan Of Action" },
        { id: 3, field: "Timeline of Action" },
        { id: 4, field: "How to be evaluated" },
      ],
      fieldList1: [
        { id: 1, field: "Accomplishments" },
        { id: 2, field: "Plan Of Action" },
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
      attachmentDialog: false,
      file_selected: null,
      file_desc: null,
      files_to_display: [],
      file_attachments: [],
      file_attachments_desc: [],
      itemToRemove: [],
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
  watch: {
    data: {
      handler(data) {
        this.dialog = true;
        this.getUsers();
        // console.log(data);
        this.TO_ID = data.toID;
        if (data.tar != null) {
          console.log("tar", data.tar);
          this.getTAR(data.tar);
        } else {
          this.initialize();
        }
      },
      deep: true,
    },
  },

  computed: {
    getUserHeads() {
      let names = "";
      this.recommendingApprovalList.forEach((element) => {
        if (names == "") {
          names += element.name;
        } else {
          names += ", " + element.name;
        }
      });
      return names;
    },

    getIsValidToUpdate() {
      let valid;
      if (this.tarType == 1) {
        valid = this.immHead_approval_status != 2;
        return valid;
      } else {
        return (valid =
          this.immHead_approval_status != 2 ||
          (this.HRM_approval_status != 2 && this.REPDir_approval_status != 2));
      }
    },
  },
  methods: {
    initialize() {
      this.title = null;
      this.accomplishmentsList = [];
      this.planOfActionList = [];
      this.timeLineOfActionList = [];
      this.evaluationList = [];
      this.tarID = null;
      this.tarType = 1;
      this.isTagged = false;
      this.eval1 = null;
      this.eval2 = null;
      this.eval3 = null;
      this.eval4 = null;
      this.eval411 = null;
      this.eval412 = null;
      this.eval5 = null;
      this.eval6 = null;
      this.eval7 = null;
      (this.REPDir_user_detailID = null),
        (this.HRM_user_detailID = null),
        (this.suggestedActivity = null);
      this.expertiseRating = null;
      this.commentSuggestion = null;
      this.file_selected = null;
      this.file_desc = null;
      this.files_to_display = [];
      this.file_attachments = [];
      this.file_attachments_desc = [];
      this.itemToRemove = [];
      this.$refs.AddTARFormref.resetValidation();
    },

    addAttachment() {
      this.attachmentDialog = true;
    },
    saveAttachment() {
      if (this.$refs.AttachmentFormref.validate()) {
        if (this.file_selected && this.file_desc) {
          let data = {
            description: this.file_desc,
            filename: this.file_selected.name,
          };
          this.files_to_display.push(data);
          this.file_attachments.push(this.file_selected);
          this.file_attachments_desc.push(this.file_desc);

          this.file_selected = null;
          this.file_desc = null;
          this.attachmentDialog = false;
        }
      }
    },
    removeFile(file, i) {
      if (file.id) {
        this.itemToRemove.push(this.files_to_display[i]);
        this.files_to_display.splice(i, 1);
      } else {
        this.files_to_display.splice(i, 1);
      }
    },

    getTAR(tar) {
      this.axiosCall("/tar/getSpecificTAR/" + tar.id, "GET").then((res) => {
        if (res.data) {
          this.file_selected = null;
          this.file_desc = null;
          this.files_to_display = [];
          this.file_attachments = [];
          this.file_attachments_desc = [];
          this.itemToRemove = [];
          console.log("specificTar", res.data);
          this.tarID = res.data.id;
          this.tarType = res.data.tarType;
          this.title = res.data.title;
          this.isTagged = res.data.isTagged;
          this.accomplishmentsList = res.data.accomplishmentsList
            ? res.data.accomplishmentsList
            : [];
          this.planOfActionList = res.data.planOfActionList
            ? res.data.planOfActionList
            : [];
          this.timeLineOfActionList = res.data.timelineOfActionList
            ? res.data.timelineOfActionList
            : [];
          this.evaluationList = res.data.evaluationList
            ? res.data.evaluationList
            : [];
          this.eval1 = res.data.eval1;
          this.eval2 = res.data.eval2;
          this.eval3 = res.data.eval3;
          this.eval4 = res.data.eval4;
          this.eval411 = res.data.eval411;
          this.eval412 = res.data.eval412;
          this.eval5 = res.data.eval5;
          this.eval6 = res.data.eval6;
          this.eval7 = res.data.eval7;
          this.suggestedActivity = res.data.suggestedActivity;
          this.expertiseRating = res.data.expertiseRating;
          this.commentSuggestion = res.data.commentSuggestion;
          this.immHead_approval_status = res.data.immHead_approval_status;
          this.immHead_user_detailID = res.data.immHead_user_detailID;
          this.REPDir_approval_status =
            res.data.tarType == 2 ? res.data.REPDir_approval_status : null;
          this.REPDir_user_detailID =
            res.data.tarType == 2
              ? res.data.REPDir_user_detailID.toString()
              : null;
          this.HRM_approval_status =
            res.data.tarType == 2 ? res.data.HRM_approval_status : null;
          this.HRM_user_detailID =
            res.data.tarType == 2
              ? res.data.HRM_user_detailID.toString()
              : null;
          this.hr_approval_status = res.data.hr_approval_status;
          this.files_to_display = res.data.attachment;
          this.loadRemarks(res.data.id);
          this.getImmediateHead(res.data.immHead_user_detailID);
        }
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

    getUserNames(id) {
      let name;
      this.usersList.forEach((element) => {
        if (element.id == id) {
          name = element.name;
        }
      });
      return name;
    },

    addNewData() {
      this.$refs.addDataFormref.reset();
      this.dataDialogAction = "Add";
      this.addDataDialog = true;
    },

    print() {
      let url =
        process.env.VUE_APP_SERVER + "/pdf-generator/printTAR/" + this.tarID;
      window.open(url);
    },

    editData(field, index) {
      if (field == 1) {
        this.fieldToAdd = field;
        this.dataToAdd = this.accomplishmentsList[index];
        this.addDataDialog = true;
      } else if (field == 2) {
        this.fieldToAdd = field;
        this.dataToAdd = this.planOfActionList[index];
        this.addDataDialog = true;
      } else if (field == 3) {
        this.fieldToAdd = field;
        this.dataToAdd = this.timeLineOfActionList[index];
        this.addDataDialog = true;
      } else if (field == 4) {
        this.fieldToAdd = field;
        this.dataToAdd = this.evaluationList[index];
        this.addDataDialog = true;
      }
      this.dataIndexToEdit = index;
      this.dataDialogAction = "Edit";
    },

    removeData(field, index) {
      if (field == 1) {
        this.accomplishmentsList.splice(index, 1);
      } else if (field == 2) {
        this.planOfActionList.splice(index, 1);
      } else if (field == 3) {
        this.timeLineOfActionList.splice(index, 1);
      } else if (field == 4) {
        this.evaluationList.splice(index, 1);
      }
    },

    saveNewData() {
      if (this.$refs.addDataFormref.validate()) {
        if (this.dataDialogAction == "Add") {
          if (this.fieldToAdd == 1) {
            this.accomplishmentsList.push(this.dataToAdd);
          } else if (this.fieldToAdd == 2) {
            this.planOfActionList.push(this.dataToAdd);
          } else if (this.fieldToAdd == 3) {
            this.timeLineOfActionList.push(this.dataToAdd);
          } else if (this.fieldToAdd == 4) {
            this.evaluationList.push(this.dataToAdd);
          }
        } else {
          if (this.fieldToAdd == 1) {
            this.accomplishmentsList[this.dataIndexToEdit] = this.dataToAdd;
          } else if (this.fieldToAdd == 2) {
            this.planOfActionList[this.dataIndexToEdit] = this.dataToAdd;
          } else if (this.fieldToAdd == 3) {
            this.timeLineOfActionList[this.dataIndexToEdit] = this.dataToAdd;
          } else if (this.fieldToAdd == 4) {
            this.evaluationList[this.dataIndexToEdit] = this.dataToAdd;
          }
        }

        this.dataDialogAction = null;
        this.addDataDialog = false;
      }
    },

    closeD() {
      this.eventHub.$emit("closeAddTARDialog", false);
      this.dialog = false;
    },

    save() {
      if (this.$refs.AddTARFormref.validate()) {
        if (this.file_attachments_desc.length == 0) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "File attachment is required!";
        } else {
          let data = {
            to_ID: this.TO_ID,
            title: this.title,
            tarType: this.tarType,
            accomplishmentsList: this.accomplishmentsList,
            planOfActionList: this.planOfActionList,
            timelineOfActionList: this.timeLineOfActionList,
            evaluationList: this.evaluationList,
            eval1: this.eval1,
            eval2: this.eval2,
            eval3: this.eval3,
            eval4: this.eval4,
            eval411: this.eval411,
            eval412: this.eval412,
            eval5: this.eval5,
            eval6: this.eval6,
            eval7: this.eval7,
            suggestedActivity: this.suggestedActivity,
            expertiseRating: this.expertiseRating,
            commentSuggestion: this.commentSuggestion,
            REPDir_user_detailID: this.REPDir_user_detailID,
            HRM_user_detailID: this.HRM_user_detailID,
          };

          let fd = new FormData();
          let str_data = JSON.stringify(data);
          let str_file_att_desc = JSON.stringify(this.file_attachments_desc);

          for (let i = 0; i < this.file_attachments.length; i++) {
            const element = this.file_attachments[i];
            fd.append("file", element);
          }

          fd.append("data", str_data);
          fd.append("file_attachment_desc", str_file_att_desc);
          // console.log(fd);
          this.axiosCall("/tar", "POST", fd).then((res) => {
            if (res.data.status == 201) {
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
            }
          });
        }
      }
    },

    update() {
      if (this.$refs.AddTARFormref.validate()) {
        let data = {
          title: this.title,
          accomplishmentsList: this.accomplishmentsList,
          planOfActionList: this.planOfActionList,
          timelineOfActionList: this.timeLineOfActionList,
          evaluationList: this.evaluationList,
          eval1: this.eval1,
          eval2: this.eval2,
          eval3: this.eval3,
          eval4: this.eval4,
          eval411: this.eval411,
          eval412: this.eval412,
          eval5: this.eval5,
          eval6: this.eval6,
          eval7: this.eval7,
        };

        let fd = new FormData();
        let str_data = JSON.stringify(data);
        let str_file_att_desc = JSON.stringify(this.file_attachments_desc);
        let str_itemToremove = JSON.stringify(this.itemToRemove);

        for (let i = 0; i < this.file_attachments.length; i++) {
          const element = this.file_attachments[i];
          fd.append("file", element);
        }

        fd.append("data", str_data);
        fd.append("file_attachment_desc", str_file_att_desc);
        fd.append("itemToRemove", str_itemToremove);

        this.axiosCall("/tar/" + this.tarID, "PATCH", fd).then((res) => {
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
          }
        });
      }
    },

    getTOAttachments(id) {
      this.axiosCall("/to-attachments/" + id, "GET").then((res) => {
        if (res.data) {
          this.files_to_display = res.data;
        }
      });
    },
    getUsers() {
      this.axiosCall("/user-details/getAllUserDetail", "GET").then((res) => {
        this.usersList = res.data;
        // console.log(res.data);
      });
    },

    loadRemarks(id) {
      this.axiosCall("/remarks/" + id + "/TAR", "GET").then((res) => {
        if (res.data) {
          this.remarksData = res.data;
        }
      });
    },

    redirectTo() {
      var usertype = this.$store.state.user.usertype.description;
      if (this.$store.state.user.user.user_roleID == 5) {
        this.$router.push("/superadmin/my-direct-head");
      } else {
        this.$router.push("/" + usertype.toLowerCase() + "/my-direct-head");
      }
    },

    getDirectHead() {
      this.axiosCall("/my-direct-head/getMyDirectHead", "GET").then((res) => {
        if (res.data) {
          if (res.data.length == 0) {
            this.hasDirectHead = false;
          } else {
            this.hasDirectHead = true;
            this.TOModel.recommeding_approval_userID = res.data[0].userID;
            this.TOModel.recommeding_approval_name = res.data[0].name;
            this.recommendingApprovalList.push({
              id: res.data[0].userID,
              name: res.data[0].name,
              approveStatus: 1,
              dateApproved: null,
            });
          }
        }
      });
    },

    // getFinanceDir() {
    //   this.axiosCall("/user-details/getFinanceDir", "GET").then((res) => {
    //     if (res.data) {
    //       this.TOModel.finDir_userID = res.data.userID;
    //       this.TOModel.finDir_name = res.data.name;
    //     }
    //   });
    // },

    // getCollegePres() {
    //   this.axiosCall("/user-details/getCollegePres", "GET").then((res) => {
    //     if (res.data) {
    //       this.TOModel.president_userID = res.data.userID;
    //       this.TOModel.president_name = res.data.name;
    //     }
    //   });
    // },

    getSelectedUsersHead() {
      console.log("changed", this.TOModel.selectedUsers);
      this.recommendingApprovalList = [];
      this.TOModel.selectedUsers.forEach((element) => {
        this.axiosCall(
          "/my-direct-head/getUserDirectHead/" + element,
          "GET"
        ).then((res) => {
          if (res.data) {
            if (this.recommendingApprovalList.length == 0) {
              this.recommendingApprovalList.push({
                id: res.data.userID,
                name: res.data.name,
                approveStatus: 1,
                dateApproved: null,
              });
            } else {
              const checkUserID = (obj) => obj.id === res.data.userID;

              if (!this.recommendingApprovalList.some(checkUserID)) {
                this.recommendingApprovalList.push({
                  id: res.data.userID,
                  name: res.data.name,
                  approveStatus: 1,
                  dateApproved: null,
                });
              }
            }
          }
        });
      });
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
