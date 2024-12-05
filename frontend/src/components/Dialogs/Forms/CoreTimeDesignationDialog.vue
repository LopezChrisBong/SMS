<template>
  <div>
    <v-dialog v-model="dialog" eager scrollable max-width="900px">
      <v-form ref="CoreTimeFormref" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>{{ action }} Core Time and Designation</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="closeD()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 700px" class="my-4">
            <v-container>
              <v-row>
                <!-- <v-col cols="12" class="pa-0 pt-2 px-4">
                  <v-autocomplete
                    outlined
                    multiple
                    small-chips
                    deletable-chips
                    v-model="ctdModel.workSched"
                    :rules="[]"
                    :items="dayList"
                    dense
                    class="rounded-lg"
                    label="Work From Home"
                    color="#6DB249"
                  >
                  </v-autocomplete>
                </v-col>

                <v-col cols="6" class="pa-0 pt-2 px-4">
                  <v-menu
                    ref="menu"
                    v-model="ctdModel.coreTimeFrom"
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
                        color="#6DB249"
                        label="Core Time (From)"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-if="timePicker1"
                      color="green lighten-1"
                      v-model="timePicker1"
                      @click:minute="$refs.menu.save(timePicker1)"
                    ></v-time-picker>
                  </v-menu>
                </v-col>

                <v-col cols="6" class="pa-0 pt-2 px-4">
                  <v-menu
                    ref="menu1"
                    v-model="ctdModel.coreTimeTo"
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
                        dense
                        v-model="timePicker2"
                        color="#6DB249"
                        label="Core Time (To)"
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-if="timePicker2"
                      color="green lighten-1"
                      v-model="timePicker2"
                      @click:minute="$refs.menu1.save(timePicker2)"
                    ></v-time-picker>
                  </v-menu>
                </v-col> -->
                <v-col class="d-flex justify-end">
                  <v-btn
                    class="white--text ml-2 rounded-lg"
                    :color="$vuetify.theme.themes.light.submitBtns"
                    @click="addSched()"
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
                      <!-- <template v-slot:[`item.part`]="{ item }">
                        <div
                          v-for="(time, index) in item.schedTimeList"
                          :key="index"
                        >
                          -
                        </div>
                      </template> -->
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
                          @click="editSched(item, index)"
                        >
                          <v-icon>mdi-pencil-outline</v-icon>
                        </v-btn>
                      </template>
                    </v-data-table>
                  </v-card>
                </v-col>

                <v-col xs="12" sm="12" md="12" xl="12" class="pa-0 pt-2 px-4">
                  <v-checkbox
                    outlined
                    :checked="ctdModel.isDesignated == 1 ? true : false"
                    v-model="ctdModel.isDesignated"
                    label="Is Designated"
                    color="#6DB249"
                  >
                  </v-checkbox>
                </v-col>
                <v-col
                  xs="12"
                  sm="6"
                  md="6"
                  xl="6"
                  class="pa-0 pt-2 px-4"
                  v-if="ctdModel.isDesignated == 1"
                >
                  <v-autocomplete
                    outlined
                    v-model="ctdModel.designationID"
                    :rules="
                      ctdModel.isDesignated == 1 ? [formRules.required] : []
                    "
                    item-text="description"
                    item-value="id"
                    :items="designationList"
                    dense
                    class="rounded-lg"
                    label="Designation"
                    color="#6DB249"
                  >
                  </v-autocomplete>
                </v-col>

                <v-col
                  :xs="ctdModel.isDesignated == 1 ? 6 : 12"
                  :sm="ctdModel.isDesignated == 1 ? 6 : 12"
                  :md="ctdModel.isDesignated == 1 ? 6 : 12"
                  :xl="ctdModel.isDesignated == 1 ? 6 : 12"
                  class="pa-0 pt-2 px-4"
                >
                  <v-autocomplete
                    outlined
                    v-model="ctdModel.assigned_office"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    label="Assigned Office"
                    color="#6DB249"
                    item-text="name"
                    item-value="id"
                    :items="officeList"
                  >
                  </v-autocomplete>
                </v-col>

                <v-col
                  xs="12"
                  sm="6"
                  md="6"
                  xl="6"
                  class="pa-0 pt-2 px-4"
                  v-if="ctdModel.isDesignated == 1"
                >
                  <v-text-field
                    outlined
                    v-model="ctdModel.units"
                    :rules="
                      ctdModel.isDesignated == 1 ? [formRules.zeroAllowed] : []
                    "
                    dense
                    required
                    label="Units Deload"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>

                <v-col
                  xs="12"
                  sm="6"
                  md="6"
                  xl="6"
                  class="pa-0 pt-2 px-4"
                  v-if="ctdModel.isDesignated == 1"
                >
                  <v-text-field
                    outlined
                    v-model="ctdModel.specialOrderNo"
                    :rules="
                      ctdModel.isDesignated == 1 ? [formRules.required] : []
                    "
                    dense
                    class="rounded-lg"
                    label="Special Order"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>

                <v-col
                  xs="12"
                  sm="12"
                  md="12"
                  xl="12"
                  class="pa-0 pt-2 px-4"
                  v-if="ctdModel.isDesignated == 1"
                >
                  <v-menu
                    ref="effectivityDateMenu"
                    :close-on-content-click="false"
                    :return-value.sync="ctdModel.effectivityDate"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        dense
                        v-model="ctdModel.effectivityDate"
                        :rules="
                          ctdModel.isDesignated == 1 ? [formRules.required] : []
                        "
                        chips
                        small-chips
                        label="Effectivity Date"
                        color="#6DB249"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      color="#6DB249"
                      v-model="ctdModel.effectivityDate"
                      no-title
                      scrollable
                    >
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        color="#6DB249"
                        @click="
                          $refs.effectivityDateMenu.save(
                            ctdModel.effectivityDate
                          )
                        "
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>

                <!-- <v-col xs="12" sm="6" md="6" xl="6" class="pa-0 pt-2 px-4">
                  <v-menu
                    ref="start_menu"
                    :close-on-content-click="false"
                    :return-value.sync="ctdModel.schoolYearFrom"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        dense
                        v-model="ctdModel.schoolYearFrom"
                        :rules="[formRules.required]"
                        chips
                        small-chips
                        color="#6DB249"
                        label="School Year (From)"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="ctdModel.schoolYearFrom"
                      no-title
                      color="#6DB249"
                      scrollable
                    >
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        color="#6DB249"
                        @click="$refs.start_menu.save(ctdModel.schoolYearFrom)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col> -->

                <v-col cols="12" class="pa-0 pt-2 px-4">
                  <v-autocomplete
                    outlined
                    small-chips
                    required
                    deletable-chips
                    v-model="ctdModel.syID"
                    :rules="[formRules.required]"
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

                <!-- <v-col xs="12" sm="6" md="6" xl="6" class="pa-0 pt-2 px-4">
                  <v-menu
                    ref="end_menu"
                    :close-on-content-click="false"
                    :return-value.sync="ctdModel.schoolYearTo"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        dense
                        v-model="ctdModel.schoolYearTo"
                        :rules="[formRules.required]"
                        chips
                        small-chips
                        color="#6DB249"
                        label="School Year (To)"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="ctdModel.schoolYearTo"
                      no-title
                      color="#6DB249"
                      scrollable
                    >
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        color="#6DB249"
                        @click="$refs.end_menu.save(ctdModel.schoolYearTo)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col> -->

                <v-col xs="12" sm="6" md="6" xl="6" class="pa-0 pt-2 px-4">
                  <v-autocomplete
                    outlined
                    v-model="ctdModel.sem"
                    :rules="[formRules.required]"
                    dense
                    :items="semList"
                    class="rounded-lg"
                    label="Semester"
                    item-text="title"
                    item-value="id"
                    color="#6DB249"
                  ></v-autocomplete>
                </v-col>
                <v-col xs="12" sm="6" md="6" xl="6" class="pa-0 pt-2 px-4">
                  <v-select
                    outlined
                    :items="statusList"
                    label="Status"
                    color="#93CB5B"
                    dense
                    v-model="ctdModel.isActive"
                  ></v-select>
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
              :color="$vuetify.theme.themes.light.submitBtns"
              class="white--text"
              v-if="action == 'Add'"
              @click="addnew()"
            >
              <v-icon>mdi-check-circle</v-icon>
              Add
            </v-btn>
            <v-btn
              :color="$vuetify.theme.themes.light.submitBtns"
              class="white--text"
              v-if="action == 'Update'"
              @click="updateCoreTime()"
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
                      color="#5a67da"
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

                <!-- <v-col cols="6" class="pa-0 pt-2 px-4">
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
                      color="green lighten-1"
                      v-model="timePicker1"
                      @click:minute="$refs.menu.save(timePicker1)"
                    ></v-time-picker>
                  </v-menu>
                </v-col>

                <v-col cols="6" class="pa-0 pt-2 px-4">
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
                      color="green lighten-1"
                      v-model="timePicker2"
                      @click:minute="$refs.menu1.save(timePicker2)"
                    ></v-time-picker>
                  </v-menu>
                </v-col> -->
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
            :color="$vuetify.theme.themes.light.submitBtns"
            class="white--text"
            v-if="schedAction == 'Add'"
            @click="saveSched()"
          >
            <v-icon>mdi-check-circle</v-icon>
            Add
          </v-btn>
          <v-btn
            :color="$vuetify.theme.themes.light.submitBtns"
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
            :color="$vuetify.theme.themes.light.submitBtns"
            class="white--text"
            v-if="schedTimeAction == 'Add'"
            @click="saveSchedTime()"
          >
            <v-icon>mdi-check-circle</v-icon>
            Add
          </v-btn>
          <v-btn
            :color="$vuetify.theme.themes.light.submitBtns"
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
      schedTimeDialog: false,
      schedTimeAction: null,
      schedDialog: false,
      schedTimeIn: null,
      schedTimeOut: null,
      schedWfh: null,
      schedAction: null,
      schedIndexToUpdate: null,
      schedList: [],
      schedTimeList: [],
      tempSelectedDays: [],
      dialog: false,
      timePicker1: null,
      timePicker2: null,
      ctdModel: {
        id: null,
        isDesignated: null,
        workSched: null,
        name: null,
        empID: null,
        coreTimeFrom: null,
        coreTimeTo: null,
        designationID: null,
        units: null,
        effectivityDate: null,
        specialOrderNo: null,
        assigned_office: null,
        syID: null,

        schoolYearFrom: null,
        schoolYearTo: null,
        sem: null,
        isActive: null,
      },
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
        { id: 3, title: "Overtime" },
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
        this.$refs.CoreTimeFormref.resetValidation();
        if (data.id) {
          console.log(data);
          this.initialize();

          this.schedList = data.coreTimeSched ? data.coreTimeSched : [];
          this.ctdModel.id = data.id;
          this.ctdModel.isDesignated = data.isDesignated;
          // this.schedTimeList = data.coreTimeSched.schedTimeList;
          this.ctdModel.name = data.name;
          this.ctdModel.empID = data.empID;
          this.getEmpDetails();
          this.ctdModel.designationID = parseInt(data.designationID);
          this.ctdModel.schoolYearFrom = data.schoolYearFrom;
          this.ctdModel.schoolYearTo = data.schoolYearTo;
          this.ctdModel.sem = data.sem;
          this.ctdModel.units = data.units == 0 ? "0" : data.units;
          this.ctdModel.effectivityDate = data.effectivityDate;
          this.ctdModel.specialOrderNo = data.specialOrderNo;
          this.ctdModel.assigned_office = data.assigned_office;
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
          this.timePicker1 = "08:00";
          this.timePicker2 = "12:00";
          this.ctdModel.name = data.name;
          this.ctdModel.isDesignated = 0;
          this.ctdModel.units = 0;
          this.ctdModel.empID = data.empID;
          // this.ctdModel.workSched = data.workSched;
          this.ctdModel.effectivityDate = null;
          this.ctdModel.specialOrderNo = null;
          // this.ctdModel.assigned_office = null;
          this.ctdModel.designationID = null;
          this.ctdModel.schoolYearTo = null;
          this.ctdModel.schoolYearFrom = null;
          this.ctdModel.sem = null;
          this.ctdModel.isActive = null;
        }
      },
      deep: true,
    },
  },

  methods: {
    initialize() {
      this.getOffices();
      this.getSchoolYear();
      this.getDesignations();
      //   this.getEmpStatus();
      //   this.getInstitutes();
      //   this.getUserType();
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
      this.timePicker1 = "08:00";
      this.timePicker2 = "12:00";
      this.schedTimeAction = "Add";
      this.$refs.schedTimeDialogRef.resetValidation();
    },
    editSchedTime(time, index) {
      console.log(time, index);
      this.schedIndexToUpdate = index;

      this.timePicker1 = time.timeFrom;
      this.timePicker2 = time.timeTo;
      this.schedTimeAction = "Update";
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
          this.schedIndexToUpdate
        ].tapTimePartID = this.tapTimePartID;
        this.schedTimeList[this.schedIndexToUpdate].timeFrom = this.timePicker1;
        this.schedTimeList[this.schedIndexToUpdate].timeTo = this.timePicker2;
        this.schedIndexToUpdate = null;
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
      this.eventHub.$emit("closeCoreTimeDesignationDialog", false);
      this.dialog = false;
    },
    addnew() {
      if (this.$refs.CoreTimeFormref.validate()) {
        let data = {
          coreTimeSched: this.schedList,
          isDesignated: this.ctdModel.isDesignated,
          designationID: this.ctdModel.designationID,
          syID: this.ctdModel.syID,
          // schoolYearFrom: this.ctdModel.schoolYearFrom,
          // schoolYearTo: this.ctdModel.schoolYearTo,
          effectivityDate: this.ctdModel.effectivityDate,
          specialOrderNo: this.ctdModel.specialOrderNo,
          assigned_office: this.ctdModel.assigned_office,
          sem: this.ctdModel.sem,
          units: this.ctdModel.units,
          employeeID: this.ctdModel.empID,
          isActive: this.ctdModel.isActive == "Active" ? true : false,
        };

        this.axiosCall("/core-time-designation", "POST", data).then((res) => {
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
            this.$refs.CoreTimeFormref.reset();
            this.closeD();
          }
        });
      }
    },

    updateCoreTime() {
      if (this.$refs.CoreTimeFormref.validate()) {
        let data = {
          isDesignated: this.ctdModel.isDesignated,
          coreTimeSched: this.schedList,
          designationID: this.ctdModel.designationID,
          syID: this.ctdModel.syID,
          // schoolYearFrom: this.ctdModel.schoolYearFrom,
          // schoolYearTo: this.ctdModel.schoolYearTo,
          effectivityDate: this.ctdModel.effectivityDate,
          specialOrderNo: this.ctdModel.specialOrderNo,
          assigned_office: this.ctdModel.assigned_office,
          sem: this.ctdModel.sem,
          units: this.ctdModel.units,
          isActive: this.ctdModel.isActive == "Active" ? true : false,
        };

        this.axiosCall(
          "/core-time-designation/" + this.ctdModel.id,
          "PATCH",
          data
        ).then((res) => {
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
            this.$refs.CoreTimeFormref.reset();
            this.closeD();
          }
        });
      }
    },

    getSchoolYear() {
      this.axiosCall("/school-year", "GET").then((res) => {
        console.log(res.data);
        this.syList = res.data;
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
