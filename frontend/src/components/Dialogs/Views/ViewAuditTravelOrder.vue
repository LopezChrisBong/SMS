<template>
  <div>
    <v-dialog
      v-model="dialog"
      eager
      scrollable
      persistent
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-form ref="ViewTravelOrderAttachmentFormref" @submit.prevent>
        <v-card class="" elevation="0" outlined>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>Travel Order</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="closeD()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text class=" my-4 ">
            <v-row>
              <v-col
                :cols="isHrReceived == 0 || travel_subtype == 1 ? 12 : 6"
                class="px-4 elevation-2"
              >
                <v-row class="px-4">
                  <v-col cols="12" class="elevation-2 pa-0  mt-2">
                    <v-data-table
                      :headers="employee_headers"
                      :items="employee_data"
                      :items-per-page="20"
                      hide-default-footer
                    >
                      <template v-slot:[`item.actions`]="{ item }">
                        <v-btn small color="grey" icon @click="viewFile(item)">
                          <v-icon>mdi-pencil-outline</v-icon>
                        </v-btn>
                      </template>
                    </v-data-table>
                  </v-col>
                  <v-col cols="12" class="px-2 mt-6">
                    <v-row>
                      <v-col cols="6" class="py-1"
                        ><p class="text-body-1 font-weight-bold">
                          Travel Order Number:
                        </p></v-col
                      >
                      <v-col cols="6" class="py-1"
                        ><p class="text-body-1 line_border">
                          {{ travel_order_num }}
                        </p></v-col
                      >
                      <v-col cols="6" class="py-1"
                        ><p class="text-body-1 font-weight-bold">
                          Date/s of Travel:
                        </p></v-col
                      >
                      <v-col cols="6" class="py-1"
                        ><p class="text-body-1 line_border">
                          {{ travelDates }}
                        </p></v-col
                      >

                      <v-col cols="6" class="py-1"
                        ><p class="text-body-1 font-weight-bold">
                          Place/s of Travel:
                        </p></v-col
                      >
                      <v-col cols="6" class="py-1"
                        ><p class="text-body-1 line_border">
                          {{ travel_place }}
                        </p></v-col
                      >

                      <v-col cols="6" class="py-1"
                        ><p class="text-body-1 font-weight-bold">
                          Purpose of Travel:
                        </p></v-col
                      >
                      <v-col cols="6" class="py-1"
                        ><p class="text-body-1 line_border">
                          {{ travel_purpose }}
                        </p></v-col
                      >
                    </v-row>
                  </v-col>

                  <v-col cols="12">
                    <p class="text-body-1">Attachments</p>
                  </v-col>
                  <v-col cols="12" class="elevation-2 pa-0 mb-4 ">
                    <v-data-table
                      :headers="headers"
                      :items="attachments_data"
                      :items-per-page="20"
                      hide-default-footer
                    >
                      <template v-slot:[`item.actions`]="{ item }">
                        <v-btn small color="grey" icon @click="viewFile(item)">
                          <v-icon>mdi-eye</v-icon>
                        </v-btn>
                      </template>
                    </v-data-table>
                  </v-col>
                </v-row>
              </v-col>
              <v-col
                v-if="isHrReceived == 1 && travel_subtype == 2"
                :cols="isHrReceived == 1 && travel_subtype == 2 ? 6 : ''"
                class="px-4 elevation-2"
                style="overflow-y:auto"
              >
                <v-row
                  class=" mt-2"
                  v-if="tarData.length == 0 && travel_subtype == 2"
                >
                  <v-col cols="12">
                    <h3 class="text-h5">No TAR data submitted yet.</h3>
                    <v-divider></v-divider>
                  </v-col>
                </v-row>
                <v-row
                  class=" mt-2"
                  v-if="tarData.length > 0 && travel_subtype == 2"
                >
                  <v-col cols="12">
                    <h3 class="text-h5">Tag activity to employee's ILPD</h3>
                    <v-divider></v-divider>
                  </v-col>
                  <v-col cols="6" class="py-1"
                    ><p class="text-body-1  font-weight-bold">
                      Employee/s submitted TAR:
                    </p></v-col
                  >
                  <v-col cols="6" class="py-1 "
                    ><p class="text-body-1 line_border">
                      {{ participant_employee_data.length }} of
                      {{ employee_data.length }}
                    </p></v-col
                  >

                  <v-col cols="6" class="py-1"
                    ><p class="text-body-1 font-weight-bold">
                      Employees
                    </p></v-col
                  >
                  <v-col cols="6" class="py-1">
                    <v-autocomplete
                      v-model="selectedparticipant"
                      dense
                      @change="changeParticipant()"
                      :items="participant_employee_data"
                      item-value="id"
                      item-text="name"
                      color="gray"
                    >
                    </v-autocomplete>
                  </v-col>

                  <v-col cols="6" class="py-1"
                    ><p class="text-body-1  font-weight-bold">
                      Title of the Activity:
                    </p></v-col
                  >
                  <v-col cols="6" class="py-1 "
                    ><p class="text-body-1 line_border">
                      {{ getActivityTitle }}
                    </p></v-col
                  >

                  <v-col cols="6" class="py-1"
                    ><p class="text-body-1 font-weight-bold">
                      Tag to ILDP Activity:
                    </p></v-col
                  >
                  <v-col cols="6" class="py-1">
                    <v-autocomplete
                      @change="getILDP()"
                      v-model="getTaggedActivity"
                      :items="lndActivity"
                      item-value="id"
                      item-text="title"
                      dense
                      color="grey"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="6" class="py-1"
                    ><p class="text-body-1 font-weight-bold">
                      Employee's ILDP for the year :
                      {{ ildpCalYrFromTo }}
                    </p></v-col
                  >
                  <v-col cols="6" class="py-1" v-if="getTaggedActivity != 5">
                    <div v-if="ildpList.length == 0 && !getTaggedActivity">
                      <p class="text-subtitle-1">
                        <i>No ILDP Activity selected.</i>
                      </p>
                    </div>

                    <div v-if="ildpList.length == 0 && getTaggedActivity">
                      <p class="text-subtitle-1"><i>No ILDP data found.</i></p>
                    </div>

                    <div v-else>
                      <v-checkbox
                        v-for="i in ildpList"
                        :key="i.id"
                        :label="'(' + i.year + ') ' + i.title"
                        v-model="selectedILDPToTag"
                        :value="i.id"
                        :disabled="getIsActivityTagged"
                      ></v-checkbox>
                    </div>
                  </v-col>
                  <v-col cols="12">
                    <v-btn
                      v-if="ildpList.length > 0"
                      @click="tagActivity()"
                      :disabled="getIsActivityTagged"
                      >{{ getIsActivityTagged ? "Tagged" : "tag" }}</v-btn
                    >
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
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

            <!-- <v-btn
              color="#5a67da"
              @click="confirmActionBtn('receiveAndArchive')"
              v-if="
                isSignatoryApproved && isHrReceived == 0 && travel_subtype == 1
              "
              class="white--text"
            >
              <v-icon>mdi-check-circle</v-icon>
              Receive & Archive
            </v-btn>

            <v-btn
              color="#5a67da"
              @click="confirmActionBtn('receive')"
              v-if="
                isSignatoryApproved && isHrReceived == 0 && travel_subtype == 2
              "
              class="white--text"
            >
              <v-icon>mdi-check-circle</v-icon>
              Receive
            </v-btn>

            <v-btn
              color="red"
              @click="confirmActionBtn('pending')"
              v-if="isHrReceived == 1 && tab == 2"
              class="white--text"
            >
              <v-icon>mdi-close-circle-outline</v-icon>
              Pending
            </v-btn>
            <v-btn
              color="#5a67da"
              @click="confirmActionBtn('archive')"
              v-if="isHrReceived == 1 && tab == 2"
              class="white--text"
            >
              <v-icon>mdi-check-circle</v-icon>
              Archive
            </v-btn> -->
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <v-dialog v-model="confirmDialog" persistent max-width="290">
      <v-card color="white">
        <div class="pa-4 #3a3b3a--text">
          <div class="text-overline mb-1">WARNING!</div>
          <div class="text-body-1 mb-1">
            <p style="text-align: justify">
              <v-icon class="mt-n2" color="white">mdi-alert</v-icon> &nbsp; Are
              you sure you want to
              <span class="font-weight-bold">{{ confirmAction }}</span> this and
              proceed?
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

    <v-dialog v-model="deadlineToAddTARDialog" persistent max-width="500">
      <v-card color="white">
        <v-form ref="deadlineToAddTARFormref" @submit.prevent>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>Set deadline</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="deadlineToAddTARDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <!-- <v-col class="mt-2" cols="12">
                  <v-checkbox
                    v-model="isTARRequired"
                    :checked="isTARRequired == 1 ? true : false"
                    label="Is TAR Required?"
                  ></v-checkbox>
                </v-col> -->
                <v-col class="mt-2" cols="12">
                  <v-menu
                    ref="deadlineDateFromRef"
                    :close-on-content-click="false"
                    :return-value.sync="deadline_date"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        dense
                        v-model="deadline_date"
                        :rules="[formRules.required]"
                        chips
                        readonly
                        small-chips
                        color="#6DB249"
                        label="Deadline for adding TAR"
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="deadline_date"
                      :min="
                        new Date(travel_date_to).toISOString().substr(0, 10)
                      "
                      no-title
                      color="#6DB249"
                      scrollable
                    >
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        color="#6DB249"
                        @click="$refs.deadlineDateFromRef.save(deadline_date)"
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

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" outlined @click="deadlineToAddTARDialog = false">
              Close
            </v-btn>
            <v-btn
              color="green"
              class="white--text"
              @click="saveDeadlineDate()"
            >
              Confirm
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <ViewTOAttachments :data="fileToView" />

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
    toApproveType: null,
    tab: null,
  },
  components: {
    ViewTOAttachments: () => import("../Views/ViewTOAttachments.vue"),
  },
  data() {
    return {
      dialog: false,
      headers: [
        { text: "Description", value: "description", align: "start" },
        { text: "Action", value: "actions", align: "center" },
      ],
      employee_headers: [
        { text: "Employee", value: "name", align: "start" },
        { text: "Position", value: "position", align: "center" },
        { text: "Unit", value: "unit", align: "center" },
      ],
      isTARRequired: true,
      TO_id: null,
      travel_order_num: null,
      travel_date_from: null,
      travel_date_to: null,
      travel_place: null,
      travel_purpose: null,
      travel_type: null,
      travel_subtype: null,
      isHrReceived: null,
      is_president_approved: null,
      is_finance_dir_approved: null,
      is_recommending_approval_approved: null,
      hasUploadedTAR: null,
      selectedLndActivity: null,
      employee_data: [],
      participant_employee_data: [],
      selectedparticipant: null,
      selectedILDPToTag: false,
      attachments_data: [],
      fileToView: [],
      files_to_display: [],
      ildpCalYrFromTo: null,
      tar_title: null,
      tarData: [],
      users: [],
      userRoleList: [
        { id: 1, role: "Admin" },
        { id: 2, role: "Staff" },
      ],
      usertypeList: [],
      officeList: [],
      designationList: [],
      positionList: [],
      empStatusList: [],
      instituteList: [],

      lndActivity: [
        {
          id: 1,
          title: "Seminars, Workshops, Training and Conferences",
        },
        {
          id: 2,
          title: "Advanced Studies/ Professional Development",
        },
        {
          id: 3,
          title: "Skills Certification/ Licensure/Eligibilities",
        },
        {
          id: 4,
          title:
            "Research, Extension, Production, Administration and Other Interests",
        },
        {
          id: 5,
          title: "Non ILDP Connected",
        },
      ],
      ildpList: [],
      immHeadName: null,
      confirmDialog: false,
      confirmAction: null,
      remarksDialog: false,
      remarksMsg: null,
      remarksData: [],
      deadlineToAddTARDialog: false,
      deadline_date: null,
      travelDates: null,
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
        console.log("view", data);
        this.TO_id = data.id;
        this.travel_type = data.travel_type;
        this.travel_subtype = data.travel_subtype;
        this.isHrReceived = data.isHrReceived;
        this.is_president_approved = data.is_president_approved;
        this.is_finance_dir_approved = data.is_finance_dir_approved;
        this.is_recommending_approval_approved =
          data.is_recommending_approval_approved;
        this.isTARRequired = data.isTARRequired;
        this.hasUploadedTAR = data.hasUploadedTAR;
        this.getTOAttachments(data.id);
        this.getEmployeeInvolved(data.id);
        this.getTravelOrder(data.id);
        if (data.travel_subtype == 2) {
          this.tarData = [];
          this.ildpList = [];
          this.getTAR(data.id);
        }
        this.loadRemarks(data.id);
        this.dialog = true;

        // this.$refs.TOApprovalFormref.reset();
        // this.$refs.TOApprovalFormref.resetValidation();

        // if (data.id) {

        // }
      },
      deep: true,
    },
  },

  computed: {
    isSignatoryApproved() {
      return (
        this.is_recommending_approval_approved &&
        this.is_finance_dir_approved == 2 &&
        this.is_president_approved
      );
    },

    getActivityTitle() {
      let title;
      for (let i = 0; i < this.tarData.length; i++) {
        if (this.tarData[i].user_detailID == this.selectedparticipant) {
          title = this.tarData[i].title;
        }
      }
      return title;
    },

    getTaggedActivity: {
      get: function() {
        let act;
        for (let i = 0; i < this.tarData.length; i++) {
          if (this.tarData[i].user_detailID == this.selectedparticipant) {
            act = this.tarData[i].lndActivityID;
          }
        }
        return act;
      },
      // setter
      set: function(newValue) {
        for (let i = 0; i < this.tarData.length; i++) {
          if (this.tarData[i].user_detailID == this.selectedparticipant) {
            this.tarData[i].lndActivityID = newValue;
          }
        }
      },
    },

    getIsActivityTagged() {
      let isTagged;
      for (let i = 0; i < this.tarData.length; i++) {
        if (this.tarData[i].user_detailID == this.selectedparticipant) {
          if (this.tarData[i].isTagged == 1) {
            isTagged = true;
          } else {
            isTagged = false;
          }
        }
      }
      return isTagged;
    },
  },
  methods: {
    viewFile(file) {
      setTimeout(() => {
        this.fileToView = { id: null };
      }, 100);
      this.fileToView = file;
    },

    loadRemarks(id) {
      this.axiosCall("/remarks/" + id + "/Travel Order", "GET").then((res) => {
        if (res.data) {
          this.remarksData = res.data;
        }
      });
    },

    changeParticipant() {
      this.ildpCalYrFromTo = null;
      this.ildpList = [];
      this.getTaggedActivity = null;
    },

    getTOAttachments(id) {
      this.axiosCall("/to-attachments/" + id, "GET").then((res) => {
        if (res.data) {
          this.attachments_data = res.data;
        }
      });
    },
    getEmployeeInvolved(id) {
      this.axiosCall("/travel-order/getEmployeeInvolved/" + id, "GET").then(
        (res) => {
          if (res.data) {
            this.employee_data = res.data;
          }
        }
      );
    },

    confirmActionBtn(action) {
      if (action == "pending") {
        this.confirmAction = "pending";
        this.confirmDialog = true;
      } else if (action == "archive") {
        this.confirmAction = "archive";
        this.confirmDialog = true;
      } else if (action == "receive") {
        this.confirmAction = "receive";
        this.confirmDialog = true;
      } else if (action == "receiveAndArchive") {
        this.confirmAction = "receive and archive";
        this.confirmDialog = true;
      }
    },

    saveRemarks() {
      if (this.$refs.RemarksFormref.validate()) {
        let data = {
          remarks_from: "Travel Order",
          id_to_remark: this.TO_id,
          message: this.remarksMsg,
        };
        this.axiosCall("/remarks", "POST", data).then((res) => {
          if (res.data.status == 201) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;

            this.pending();
          } else if (res.data.status == 400) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
          }
        });
      }
    },

    pending() {
      this.remarksDialog = false;
      let data = {
        isArchived: true,
        TO_id: this.TO_id,
      };
      this.axiosCall("/travel-order/update_to_pending", "POST", data).then(
        (res) => {
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

            this.closeD();
          }
        }
      );
    },

    proceedAction() {
      if (this.confirmAction == "receive") {
        // this.receive();
        this.confirmDialog = false;
        this.confirmAction = null;

        // if (this.travel_subtype == 2) {
        this.deadlineToAddTARDialog = true;
        this.$refs.deadlineToAddTARFormref.reset();
        // } else {
        //   this.receive();
        // }
      } else if (this.confirmAction == "archive") {
        this.archive();
        this.confirmDialog = false;
        this.confirmAction = null;
      } else if (this.confirmAction == "pending") {
        // this.pending();
        this.remarksDialog = true;
        this.confirmDialog = false;
        this.confirmAction = null;
      } else if (this.confirmAction == "receive and archive") {
        this.receiveAndArchive();
        // this.remarksDialog = true;
        this.confirmDialog = false;
        this.confirmAction = null;
      }
    },

    // save deadline date for adding tar and invoke receive function
    saveDeadlineDate() {
      if (this.$refs.deadlineToAddTARFormref.validate()) {
        // if (this.isTARRequired == 1) {
        this.receive();
        // } else {
        //   this.receiveAndArchive();
        // }

        this.deadlineToAddTARDialog = false;
      }
    },

    receive() {
      let data = {
        received: true,
        TO_id: this.TO_id,
        deadline_for_tar: this.deadline_date,
      };
      this.axiosCall("/travel-order/update_received", "POST", data).then(
        (res) => {
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

            this.closeD();
          }
        }
      );
    },

    receiveAndArchive() {
      let data = {
        TO_id: this.TO_id,
      };
      this.axiosCall(
        "/travel-order/update_receivedAndArchive",
        "POST",
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

          this.closeD();
        }
      });
    },

    archive() {
      let data = {
        isArchived: true,
        TO_id: this.TO_id,
      };
      this.axiosCall("/travel-order/update_to_archive", "POST", data).then(
        (res) => {
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

            this.closeD();
          }
        }
      );
    },

    getTravelOrder(id) {
      this.axiosCall("/travel-order/" + id, "GET").then((res) => {
        if (res.data) {
          this.travel_order_num = res.data.travel_order_num;
          if (this.isValidJSON(res.data.travel_date_from)) {
            let data = JSON.parse(res.data.travel_date_from);
            let dateStr = "";
            if (data.length > 2) {
              for (let i = 0; i < data.length - 1; i++) {
                if (dateStr == "") {
                  dateStr = this.formatDate(data[i]);
                } else {
                  dateStr += ", " + this.formatDate(data[i]);
                }
              }
              dateStr += " & " + this.formatDate(res.data.travel_date_to);
            } else {
              dateStr =
                this.formatDate(data[0]) +
                " - " +
                this.formatDate(res.data.travel_date_to);
            }

            this.travelDates = dateStr;
          } else {
            this.travelDates =
              this.formatDate(res.data.travel_date_from) +
              " - " +
              this.formatDate(res.data.travel_date_to);
          }
          this.travel_date_from = res.data.travel_date_from;
          this.travel_date_to = res.data.travel_date_to;
          this.travel_place = res.data.travel_place;
          this.travel_purpose = res.data.travel_purpose;
        }
      });
    },

    isValidJSON(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    },

    getTAR(id) {
      this.axiosCall("/tar/" + id, "GET").then((res) => {
        if (res.data) {
          this.tarData = res.data;
          console.log("tar", res.data);

          this.participant_employee_data = [];
          if (res.data.length > 0) {
            for (let i = 0; i < res.data.length; i++) {
              let element = res.data[i];
              this.participant_employee_data.push({
                id: element.user_detailID,
                name: element.name,
              });
            }
            this.selectedparticipant = this.participant_employee_data[0].id;
            if (res.data[0].lndActivityID) {
              this.getILDPonLoad(
                res.data[0].lndActivityID,
                this.participant_employee_data[0].id
              );
              this.selectedILDPToTag = res.data[0].ildpID;
            }
          }
        }
      });
    },

    //used on change of slected ILDP activity
    getILDP() {
      let d = new Date(this.travel_date_from);
      let y = d.getFullYear();

      this.axiosCall(
        "/ildp/getEmpILDPByActID/" +
          this.getTaggedActivity +
          "/" +
          this.selectedparticipant +
          "/" +
          y,
        "GET"
      ).then((res) => {
        if (res.data) {
          console.log(res.data);
          this.ildpList = res.data.ildps;
          this.ildpCalYrFromTo =
            res.data.ildpCalRange.yearFrom +
            " - " +
            res.data.ildpCalRange.yearTo;
        }
      });
    },

    // used on data onload
    getILDPonLoad(actID, participantID) {
      let d = new Date(this.travel_date_from);
      let y = d.getFullYear();

      this.axiosCall(
        "/ildp/getEmpILDPByActID/" + actID + "/" + participantID + "/" + y,
        "GET"
      ).then((res) => {
        if (res.data) {
          console.log("getIldpOnload", res.data);
          this.ildpList = res.data.ildps;
          this.ildpCalYrFromTo =
            res.data.ildpCalRange.yearFrom +
            " - " +
            res.data.ildpCalRange.yearTo;
        }
      });
    },

    tagActivity() {
      if (this.getTaggedActivity) {
        let d = new Date();
        var temp_data;
        for (let i = 0; i < this.tarData.length; i++) {
          if (this.selectedparticipant == this.tarData[i].user_detailID) {
            temp_data = this.tarData[i];
            this.tarData[i].isTagged = true;
            this.tarData[i].lndActivityID = this.getTaggedActivity;
            this.tarData[i].lndYear = d.getFullYear();
          }
        }

        let data = {
          tar_ID: temp_data.id,
          isTagged: temp_data.isTagged,
          lndYear: temp_data.lndYear,
          lndActivityID: temp_data.lndActivityID,
          ildpID: temp_data.lndActivityID == 5 ? null : this.selectedILDPToTag,
        };

        this.axiosCall("/tar/updateTagged", "POST", data).then((res) => {
          if (res.data.status == 200) {
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
      } else {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message = "Please select ILDP Activity to tag!";
      }
    },

    closeD() {
      this.eventHub.$emit("closeViewTravelOrderAttachments", false);
      this.dialog = false;
    },
  },
};
</script>

<style scoped>
.line_border {
  border-bottom: 1px solid gray;
}
</style>
