<template>
  <div>
    <v-dialog v-model="dialog" persistent eager scrollable max-width="900px">
      <v-form ref="MyCoreTimeFormref" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>{{ action }} Core Time</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="closeD()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 700px" class="my-4">
            <v-container>
              <v-row>
                <v-col class="d-flex justify-end">
                  <v-btn
                    class="white--text ml-2 rounded-lg"
                    color="#519043"
                    @click="addSched()"
                    v-if="action != 'View'"
                  >
                    <v-icon left> mdi-plus-box-outline </v-icon>
                    Add Schedule
                  </v-btn>
                </v-col>
                <v-col cols="12" class=" pt-2 px-4">
                  <v-card>
                    <v-data-table
                      :headers="ctd_headers"
                      :items="schedList"
                      :items-per-page="8"
                      hide-default-footer
                    >
                      <template v-slot:[`item.schedTimeList`]="{ item }">
                        <div
                          class="d-flex justify-space-around"
                          v-for="(time, index) in item.schedTimeList"
                          :key="index"
                        >
                          <div style="width:50%;" class="text-center">
                            {{ getPart(time.tapTimePartID) }}
                          </div>
                          <div style="width:50%;" class="text-center">
                            {{ formatTime(time.timeFrom) }} -
                            {{ formatTime(time.timeTo) }}
                          </div>
                        </div>
                      </template>
                      <template v-slot:[`item.actions`]="{ item, index }">
                        <v-btn
                          small
                          color="grey"
                          icon
                          v-if="action != 'View'"
                          @click="editSched(item, index)"
                        >
                          <v-icon>mdi-pencil-outline</v-icon>
                        </v-btn>
                      </template>
                    </v-data-table>
                  </v-card>
                </v-col>

                <v-col cols="12" class="mt-4 px-4 ">
                  <div style="border:1px solid grey" class="rounded-lg">
                    <div class="text-subtitle-1 pl-6 pt-3">
                      Calendrical Year
                    </div>
                    <div class="d-flex justify-space-around">
                      <v-checkbox
                        :rules="[formRules.required]"
                        v-model="ctdModel.ctType"
                        :checked="ctdModel.ctType == 1"
                        value="1"
                        label="Academic Year"
                      ></v-checkbox>
                      <v-checkbox
                        :rules="[formRules.required]"
                        v-model="ctdModel.ctType"
                        :checked="ctdModel.ctType == 2"
                        label="Calendar Year"
                        value="2"
                      ></v-checkbox>
                    </div>
                  </div>
                </v-col>

                <v-col
                  cols="12"
                  v-if="ctdModel.ctType && ctdModel.ctType == 1"
                  class="mt-4 pt-2 px-4"
                >
                  <v-autocomplete
                    outlined
                    small-chips
                    required
                    deletable-chips
                    v-model="ctdModel.syID"
                    :rules="
                      ctdModel.ctType && ctdModel.ctType == 1
                        ? [formRules.required]
                        : []
                    "
                    :items="syList"
                    item-value="id"
                    :item-text="getSYItemText"
                    dense
                    class="rounded-lg"
                    label="School Year"
                    color="#6DB249"
                  >
                  </v-autocomplete>
                </v-col>

                <v-col
                  v-if="ctdModel.ctType && ctdModel.ctType == 1"
                  cols="12"
                  class="px-4 text-center"
                >
                  <v-radio-group
                    @change="changeSem()"
                    v-model="ctdModel.sem"
                    row
                    class=" px-2 d-flex justify-space-evenly"
                    style=""
                    :rules="[formRules.required]"
                  >
                    <v-radio
                      style="width:30%"
                      class="text-center"
                      v-for="item in semList"
                      :key="item.id"
                      :label="item.title"
                      :value="item.id"
                    ></v-radio>
                  </v-radio-group>
                  <!-- <v-autocomplete
                    outlined
                    v-model="ctdModel.sem"
                    :rules="
                      ctdModel.ctType && ctdModel.ctType == 1
                        ? [formRules.required]
                        : []
                    "
                    dense
                    :items="semList"
                    class="rounded-lg"
                    label="Semester"
                    item-text="title"
                    item-value="id"
                    color="#6DB249"
                  ></v-autocomplete> -->
                </v-col>

                <v-col cols="6" v-if="ctdModel.ctType" class="mt-4 pt-2 px-4">
                  <v-menu
                    ref="cyFromRef"
                    :close-on-content-click="false"
                    :return-value.sync="ctdModel.cyFrom"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        dense
                        v-model="ctdModel.cyFrom"
                        :rules="[formRules.required]"
                        chips
                        color="#6DB249"
                        small-chips
                        label="Date (From)"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      color="#6DB249"
                      v-model="ctdModel.cyFrom"
                      :min="getMinDateFrom"
                      no-title
                      scrollable
                    >
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        color="#6DB249"
                        @click="$refs.cyFromRef.save(ctdModel.cyFrom)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col v-if="ctdModel.ctType" cols="6" class="mt-4 pt-2 px-4">
                  <v-menu
                    ref="cyToRef"
                    :close-on-content-click="false"
                    :return-value.sync="ctdModel.cyTo"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        dense
                        v-model="ctdModel.cyTo"
                        :rules="[formRules.required]"
                        chips
                        color="#6DB249"
                        small-chips
                        label="Date (To)"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      color="#6DB249"
                      :min="ctdModel.cyFrom"
                      :max="getMaxDateTo"
                      v-model="ctdModel.cyTo"
                      no-title
                      scrollable
                    >
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        color="#6DB249"
                        @click="$refs.cyToRef.save(ctdModel.cyTo)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>

                <!-- <v-col v-if="action == 'Update'" cols="12" class=" pt-2 px-4">
                  <v-select
                    outlined
                    :rules="action == 'Update' ? [formRules.required] : []"
                    :items="statusList"
                    label="Status"
                    color="#93CB5B"
                    dense
                    v-model="ctdModel.isActive"
                  ></v-select>
                </v-col> -->
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions class="pa-5">
            <v-fab-transition v-if="action != 'Add'">
              <v-menu top>
                <template v-slot:activator="{ on }">
                  <v-btn color="#519043" left outlined v-on="on">
                    Remarks
                  </v-btn>
                </template>

                <v-card class="mx-auto" width="600" max-width="600" elevation-4>
                  <v-card-title class="dialog-header  white--text">
                    <span class="text-h6">Remarks</span>
                  </v-card-title>
                  <v-card-text
                    class="py-0"
                    style="background-color:white;  height : 300px; overflow-y:auto"
                  >
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
                    ref="menu"
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
                    <v-time-picker
                      v-if="timePicker1"
                      format="ampm"
                      color="green lighten-1"
                      v-model="timePicker1"
                      @click:minute="$refs.menu.save(timePicker1)"
                    ></v-time-picker>
                  </v-menu>
                </v-col>

                <v-col cols="12" class="pa-0 pt-2 px-4">
                  <v-menu
                    ref="menu1"
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
                    <v-time-picker
                      v-if="timePicker2"
                      format="ampm"
                      color="green lighten-1"
                      v-model="timePicker2"
                      @click:minute="$refs.menu1.save(timePicker2)"
                    ></v-time-picker>
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
export default {
  props: {
    data: null,
    action: null,
  },
  data() {
    return {
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

        this.$refs.MyCoreTimeFormref.resetValidation();
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
          this.getEmpDetails();
          this.ctdModel.sem = data.sem;
          this.ctdModel.isActive = data.isActive ? "Active" : "Inactive";
          this.timePicker1 = "08:00";
          this.timePicker2 = "12:00";
          this.computeDaylist();
        } else {
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
    initialize() {
      this.getDirectHead();
      this.getOffices();
      this.getSchoolYear();
      this.getDesignations();
      this.loadYearSelection();
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
      this.eventHub.$emit("closeCoreTimeDesignationDialog", false);
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
            this.dialog = false;

            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.$refs.MyCoreTimeFormref.reset();

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

    checkConflict(type) {
      if (this.$refs.MyCoreTimeFormref.validate()) {
        if (this.schedList.length > 0) {
          let data = {
            ctType: this.ctdModel.ctType,
            cyFrom: this.ctdModel.cyFrom,
            cyTo: this.ctdModel.cyTo,
            syID: this.ctdModel.syID,
            sem: this.ctdModel.sem,
            id: this.ctdModel.id,
          };
          this.axiosCall("/my-core-time/checkConflict", "POST", data).then(
            (res) => {
              console.log(res.data);
              this.confirmSubmissionDialog = true;
              if (res.data.status == 200) {
                this.confirmSubmit.error = false;
                this.confirmSubmit.type = type;
              } else if (res.data.status == 400) {
                this.confirmSubmit.error = true;
                this.confirmSubmit.type = type;
                this.confirmSubmit.msg = res.data.msg;
              }
            }
          );
        } else {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "No time schedules found!";
        }

        // this.confirmUpdateDialog = true;
      }
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
