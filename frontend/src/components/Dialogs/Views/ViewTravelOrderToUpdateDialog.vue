<template>
  <div>
    <v-dialog v-model="dialog" persistent eager scrollable max-width="800px">
      <v-form
        ref="TravelOrderFormref"
        enctype="multipart/form-data"
        @submit.prevent
      >
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>Update Travel Order heheh</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="closeD()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 700px" class="my-4">
            <!-- <v-alert
              v-if="!hasDirectHead"
              dense
              border="right"
              color="red"
              dismissible
              type="warning"
              class="text-caption"
            >
              You haven't set who's your direct head yet. Click
              <span @click="redirectTo()" class="clickme">here</span> to
              set.</v-alert
            > -->
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-autocomplete
                    outlined
                    dense
                    disabled
                    label="Travel Type"
                    v-model="TOModel.travel_type"
                    :items="TravelTypeList"
                    item-text="type"
                    item-value="id"
                    readonly
                    required
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" v-if="TOModel.travel_type == 1">
                  <v-autocomplete
                    outlined
                    dense
                    disabled
                    label="Travel sub-type"
                    v-model="TOModel.travel_subtype"
                    :items="TravelTypeSubList"
                    item-text="type"
                    item-value="id"
                    required
                    readonly
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-autocomplete>
                </v-col>

                <v-col cols="12">
                  <v-menu
                    ref="TravelDateRef"
                    :close-on-content-click="false"
                    :return-value.sync="selectedDates"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        dense
                        v-model="getFormattedTravelDate"
                        chips
                        small-chips
                        color="#6DB249"
                        label="Travel Date/s"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>

                    <v-date-picker
                      v-model="selectedDates"
                      multiple
                      no-title
                      color="#6DB249"
                      scrollable
                    >
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        color="#6DB249"
                        @click="$refs.TravelDateRef.save(selectedDates)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>

                <v-col cols="12">
                  <v-autocomplete
                    outlined
                    dense
                    :rules="[formRules.required]"
                    label="Employee/s"
                    @change="getSelectedUsersHead()"
                    v-model="TOModel.selectedUsers"
                    :items="users"
                    item-text="name"
                    item-value="id"
                    required
                    class="rounded-lg"
                    color="#6DB249"
                    deletable-chips
                    multiple
                    small-chips
                  >
                    <template v-slot:selection="data">
                      <v-chip
                        :input-value="data.selected"
                        v-bind="data.attrs"
                        close
                        small
                        class="chip--select-multi text-caption"
                        @click:close="removeItem(data.item)"
                      >
                        {{ data.item.name }}
                      </v-chip>
                    </template>
                  </v-autocomplete>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    readonly
                    disabled
                    v-model="TOModel.travel_place"
                    dense
                    outlined
                    required
                    label="Place/s of Travel"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    readonly
                    disabled
                    v-model="TOModel.travel_purpose"
                    dense
                    outlined
                    required
                    label="Purpose of Travel"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="getUserHeads"
                    :rules="[formRules.required]"
                    readonly
                    disabled
                    dense
                    outlined
                    required
                    label="Recommending Approval"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>

                <!-- <v-col cols="6">
                  <h3>Attachments</h3>
                </v-col> -->
                <!-- <v-col cols="6" class="d-flex justify-end">
                  <v-btn
                    v-if="action != 'View'"
                    color="#519043"
                    class="white--text"
                    @click="openAttachment()"
                  >
                    Add Attachment
                  </v-btn>
                </v-col> -->
                <!-- <v-col cols="6" v-if="action != 'View'">
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
                </v-col> -->

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
                        <!-- <v-btn icon color="#C62828" @click="removeFile(file, i)"
                          ><v-icon>mdi-close-circle-outline</v-icon></v-btn
                        > -->
                      </div>
                    </div>
                  </div>
                </v-col>

                <!-- <v-col cols="12" class="mt-4 text-right">
                
                </v-col> -->
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions class="pa-5">
            <!-- <v-fab-transition>
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
                    <v-timeline dense>
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
                            {{ item.remarks_by }}
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
                  </v-card-text>
                </v-card>
              </v-menu>
            </v-fab-transition> -->
            <v-spacer></v-spacer>
            <v-btn color="red" outlined @click="closeD()">
              <v-icon>mdi-close-circle-outline</v-icon>
              close
            </v-btn>
            <!-- <v-btn
              v-if="action == 'Add'"
              color="#519043"
              class="white--text"
              @click="add()"
            >
              <v-icon>mdi-check-circle</v-icon>
              Create
            </v-btn> -->
            <!-- update button for not pending TO -->
            <v-btn
              v-if="action == 'Update' && TOModel.isPending == false"
              color="#519043"
              class="white--text"
              @click="update()"
            >
              <v-icon>mdi-check-circle</v-icon>
              Update
            </v-btn>

            <!-- update button for pending TO -->
            <!-- <v-btn
              v-if="action == 'Update' && TOModel.isPending == true"
              color="#519043"
              class="white--text"
              @click="update_pending()"
            >
              <v-icon>mdi-check-circle</v-icon>
              Update
            </v-btn> -->
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
          <v-btn outlined color="#6DB249" @click="addAttachment()">Add</v-btn>
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
      attachmentDialog: false,
      multiDatePicker: [],
      selectedDates: [],
      TOModel: {
        id: null,
        userID: null,
        selectedUsers: [],
        travel_date_from: null,
        travel_date_to: null,
        travel_type: null,
        travel_subtype: null,
        travel_place: null,
        travel_purpose: null,
        recommeding_approval_userID: null,
        president_userID: null,
        finDir_userID: null,
        president_name: null,
        isHrReceived: null,
        finDir_name: null,
        is_recommending_approval_approved: null,
        is_finance_approved: null,
        is_president_approved: null,
        recommeding_approval_name: null,
        isPending: null,
      },
      file_attachments: [],
      file_attachments_desc: [],
      files_to_display: [],
      itemToRemove: [],
      file_selected: null,
      file_desc: null,
      hasDirectHead: null,
      users: [],
      userRoleList: [
        { id: 1, role: "Admin" },
        { id: 2, role: "Staff" },
      ],

      TravelTypeList: [
        { id: 1, type: "Local Travel" },
        { id: 2, type: "Foreign Travel" },
      ],
      TravelTypeSubList: [
        { id: 1, type: "Work-related" },
        { id: 2, type: "Seminar / Conferences / Publication" },
      ],
      usertypeList: [],
      recommendingApprovalList: [],
      officeList: [],
      designationList: [],
      positionList: [],
      empStatusList: [],
      instituteList: [],
      empToRemove: [],
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
        this.file_attachments = [];
        this.file_attachments_desc = [];
        this.files_to_display = [];
        this.itemToRemove = [];
        this.empToRemove = [];
        console.log(data);
        if (data.id) {
          this.TOModel.id = data.id;
          this.TOModel.userID = data.userID;
          this.TOModel.selectedUsers = JSON.parse(data.selectedUsers);
          // console.log("isValidJSON", this.isValidJSON(data.travel_date_from));
          if (this.isValidJSON(data.travel_date_from)) {
            this.selectedDates = JSON.parse(data.travel_date_from);
          } else {
            this.selectedDates.push(data.travel_date_from);
            this.selectedDates.push(data.travel_date_to);
          }
          // this.TOModel.travel_date_from = data.travel_date_from;
          // this.TOModel.travel_date_to = data.travel_date_to;
          this.TOModel.travel_type = data.travel_type;
          this.TOModel.travel_subtype = data.travel_subtype;
          this.TOModel.travel_place = data.travel_place;
          this.TOModel.travel_purpose = data.travel_purpose;
          this.recommendingApprovalList = data.recommending_approval_list;
          this.TOModel.is_recommending_approval_approved =
            data.is_finance_approved;
          this.TOModel.is_president_approved = data.is_president_approved;
          this.TOModel.isPending = data.isPending;
          this.TOModel.isHrReceived = data.isHrReceived;
          this.getTOAttachments(data.id);
          this.loadRemarks(data.id);
          this.initialize();
        } else {
          this.selectedDates = [];
          this.TOModel.travel_date_from = null;
          this.TOModel.travel_date_to = null;
          this.TOModel.travel_type = null;
          this.TOModel.travel_subtype = null;
          this.TOModel.travel_place = null;
          this.TOModel.travel_purpose = null;

          this.TOModel.is_recommending_approval_approved = null;
          this.TOModel.is_president_approved = null;
          this.TOModel.isPending = null;
          this.TOModel.isHrReceived = null;
          this.recommendingApprovalList = [];
          this.$refs.TravelOrderFormref.reset();
          this.$refs.TravelOrderFormref.resetValidation();
          this.TOModel.selectedUsers.push(this.$store.state.user.id);
          this.initialize();
          this.getDirectHead();
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
          names += this.toTitleCase(element.name);
        } else {
          names += ", " + this.toTitleCase(element.name);
        }
      });
      return names;
    },

    getFormattedTravelDate() {
      let dates = [];
      for (let i = 0; i < this.selectedDates.length; i++) {
        dates.push(" " + this.formatDate(this.selectedDates[i]));
      }
      return dates;
    },

    getTravelToMinDate() {
      // set min date to travel-date-to date picker
      let d = new Date(
        this.TOModel.travel_date_from ? this.TOModel.travel_date_from : null
      );
      d.setDate(d.getDate() + 1);
      return d;
    },
  },
  methods: {
    initialize() {
      this.getUsers();
      // this.getAccountantUser()
      this.getFinanceDir();
      this.getCollegePres();
      //   this.getOffices();
      //   this.getPositions();
      //   this.getDesignations();
      //   this.getEmpStatus();
      //   this.getInstitutes();
      //   this.getUserType();
    },

    removeItem(item) {
      this.empToRemove.push(item.id);
      this.TOModel.selectedUsers = this.TOModel.selectedUsers.filter(
        (id) => id !== item.id
      );
      this.getSelectedUsersHead();
    },

    addAttachment() {
      if (this.$refs.AttachmentFormref.validate()) {
        if (this.file_selected && this.file_desc) {
          let data = {
            description: this.file_desc,
            filename: this.file_selected.name,
          };
          this.files_to_display.push(data);
          // Object.assign(this.file_selected, { description: this.file_desc });
          this.file_attachments.push(this.file_selected);
          this.file_attachments_desc.push(this.file_desc);

          this.file_selected = null;
          this.file_desc = null;
          this.attachmentDialog = false;
        }
      }
    },

    openAttachment() {
      this.attachmentDialog = true;
      this.$refs.AttachmentFormref.reset();
    },

    loadRemarks(id) {
      this.axiosCall("/remarks/" + id + "/Travel Order", "GET").then((res) => {
        if (res.data) {
          console.log(res.data);
          this.remarksData = res.data;
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

    addDatePicker() {
      this.multiDatePicker.push({ date: null });
    },
    removeDate(index) {
      this.multiDatePicker.splice(index, 1);
    },
    saveToRef(ref, val) {
      this.$refs[ref][0].save(val);
    },

    getMinDate(len) {
      let d;
      for (let i = 0; i < this.multiDatePicker.length; i++) {
        if (i == len) {
          d = new Date(this.multiDatePicker[i].date);
        }
      }
      if (d) {
        let dd = new Date(d);
        dd.setDate(d.getDate() + 1);

        let toRet = dd.toISOString().substr(0, 10);
        console.log(toRet);
        return toRet;
      } else {
        return null;
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
      this.eventHub.$emit("ViewTravelOrderToUpdateDialog", false);
      this.dialog = false;
    },
    // add() {
    //   if (this.$refs.TravelOrderFormref.validate()) {
    //     this.selectedDates.sort(function(a, b) {
    //       let dateA = new Date(a);
    //       let dateB = new Date(b);

    //       // Subtract the dates to get a value that is either negative, positive, or zero
    //       return dateA - dateB;
    //     });

    //     let data = {
    //       selectedUsers: this.TOModel.selectedUsers,
    //       // travel_date_from: this.TOModel.travel_date_from,
    //       // travel_date_to: this.TOModel.travel_date_to,

    //       travel_date_from: JSON.stringify(this.selectedDates),
    //       travel_date_to: this.selectedDates[this.selectedDates.length - 1],
    //       travel_type: this.TOModel.travel_type,
    //       travel_subtype: this.TOModel.travel_subtype,
    //       travel_place: this.TOModel.travel_place,
    //       travel_purpose: this.TOModel.travel_purpose,
    //       recommending_approval_list: this.recommendingApprovalList,
    //       // recommending_approval_userID: this.TOModel
    //       //   .recommeding_approval_userID,
    //       finance_dir_userID: this.TOModel.finDir_userID,
    //       president_userID: this.TOModel.president_userID,
    //     };
    //     let fd = new FormData();
    //     let str_data = JSON.stringify(data);
    //     let str_file_att_desc = JSON.stringify(this.file_attachments_desc);

    //     for (let i = 0; i < this.file_attachments.length; i++) {
    //       const element = this.file_attachments[i];
    //       fd.append("file", element);
    //     }

    //     fd.append("data", str_data);
    //     fd.append("file_attachment_desc", str_file_att_desc);

    //     this.axiosCall("/travel-order/createTO", "POST", fd).then((res) => {
    //       if (res.data.status == 201) {
    //         this.dialog = false;
    //         this.fadeAwayMessage.show = true;
    //         this.fadeAwayMessage.type = "success";
    //         this.fadeAwayMessage.header = "System Message";
    //         this.fadeAwayMessage.message = res.data.msg;
    //         this.closeD();
    //       } else if (res.data.status == 400) {
    //         this.dialog = false;
    //         this.fadeAwayMessage.show = true;
    //         this.fadeAwayMessage.type = "error";
    //         this.fadeAwayMessage.header = "System Message";
    //         this.fadeAwayMessage.message = res.data.msg;
    //         // this.$refs.PositionFormref.reset();
    //         // this.closeD();
    //       }
    //     });
    //   }
    // },
    // remove(item) {
    //   const index = this.TOModel.selectedUsers.indexOf(item.id);
    //   if (index >= 0) this.TOModel.selectedUsers.splice(index, 1);
    // },
    update() {
      if (this.$refs.TravelOrderFormref.validate()) {
        this.selectedDates.sort(function(a, b) {
          let dateA = new Date(a);
          let dateB = new Date(b);

          return dateA - dateB;
        });
        let data = {
          id: this.TOModel.id,
          travel_date_from: JSON.stringify(this.selectedDates),
          travel_date_to: this.selectedDates[this.selectedDates.length - 1],
          selectedUsers: this.TOModel.selectedUsers,
          recommending_approval_list: this.recommendingApprovalList,
          empToRemove: this.empToRemove,
        };
        console.log(data);

        this.axiosCall(
          "/travel-order/updateSelectedEmployee",
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
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
          }
        });
      }
    },

    // update_pending() {
    //   if (this.$refs.TravelOrderFormref.validate()) {
    //     this.selectedDates.sort(function(a, b) {
    //       let dateA = new Date(a);
    //       let dateB = new Date(b);

    //       // Subtract the dates to get a value that is either negative, positive, or zero
    //       return dateA - dateB;
    //     });
    //     let data = {
    //       id: this.TOModel.id,
    //       selectedUsers: this.TOModel.selectedUsers,
    //       // travel_date_from: this.TOModel.travel_date_from,
    //       // travel_date_to: this.TOModel.travel_date_to,
    //       travel_date_from: JSON.stringify(this.selectedDates),
    //       travel_date_to: this.selectedDates[this.selectedDates.length - 1],
    //       travel_type: this.TOModel.travel_type,
    //       travel_subtype: this.TOModel.travel_subtype,
    //       travel_place: this.TOModel.travel_place,
    //       travel_purpose: this.TOModel.travel_purpose,
    //       recommending_approval_list: this.recommendingApprovalList,
    //       // recommending_approval_userID: this.TOModel
    //       //   .recommeding_approval_userID,
    //     };
    //     let fd = new FormData();
    //     let str_data = JSON.stringify(data);
    //     let str_file_att_desc = JSON.stringify(this.file_attachments_desc);
    //     let str_itemToremove = JSON.stringify(this.itemToRemove);

    //     for (let i = 0; i < this.file_attachments.length; i++) {
    //       const element = this.file_attachments[i];
    //       fd.append("file", element);
    //     }

    //     fd.append("data", str_data);
    //     fd.append("file_attachment_desc", str_file_att_desc);
    //     fd.append("itemToRemove", str_itemToremove);

    //     this.axiosCall("/travel-order/updatePendingTO", "POST", fd).then(
    //       (res) => {
    //         if (res.data.status == 200) {
    //           this.dialog = false;
    //           this.fadeAwayMessage.show = true;
    //           this.fadeAwayMessage.type = "success";
    //           this.fadeAwayMessage.header = "System Message";
    //           this.fadeAwayMessage.message = res.data.msg;
    //           this.closeD();
    //         } else if (res.data.status == 400) {
    //           this.dialog = false;
    //           this.fadeAwayMessage.show = true;
    //           this.fadeAwayMessage.type = "error";
    //           this.fadeAwayMessage.header = "System Message";
    //           this.fadeAwayMessage.message = res.data.msg;
    //           this.$refs.PositionFormref.reset();
    //           this.closeD();
    //         }
    //       }
    //     );
    //   }
    // },

    // removeFile(file, i) {
    //   if (file.id) {
    //     this.itemToRemove.push(this.files_to_display[i]);
    //     this.files_to_display.splice(i, 1);
    //   } else {
    //     this.files_to_display.splice(i, 1);
    //   }
    // },

    getTOAttachments(id) {
      this.axiosCall("/to-attachments/" + id, "GET").then((res) => {
        if (res.data) {
          console.log("files", res.data);
          this.files_to_display = res.data;
        }
      });
    },
    getUsers() {
      this.axiosCall("/user-details/getAllUserDetail", "GET").then((res) => {
        this.users = res.data;

        // this.users.forEach((el, i) => {
        //   Object.assign(this.users[i], { disabled: true });
        // });

        for (let i = 0; i < this.users.length; i++) {
          this.users[i].name = this.toTitleCase(this.users[i].name);
          // for (let j = 0; j < this.TOModel.selectedUsers.length; j++) {
          //   if (this.users[i].id == this.TOModel.selectedUsers[j]) {
          //     Object.assign(this.users[i], { disabled: false });
          //   }
          // }
        }

        // console.log(res.data);
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

    getFinanceDir() {
      // fetched data is now accountant
      this.axiosCall("/user-details/getFinanceDir", "GET").then((res) => {
        if (res.data) {
          this.TOModel.finDir_userID = res.data.userID;
          this.TOModel.finDir_name = res.data.name;
        }
      });
    },

    // getAccountantUser() {
    //   this.axiosCall("/user-details/getAccountantUser", "GET").then((res) => {
    //     if (res.data) {
    //       this.TOModel.finDir_userID = res.data.userID;
    //       this.TOModel.finDir_name = res.data.name;
    //     }
    //   });
    // },

    getCollegePres() {
      this.axiosCall("/user-details/getCollegePres", "GET").then((res) => {
        if (res.data) {
          this.TOModel.president_userID = res.data.userID;
          this.TOModel.president_name = res.data.name;
        }
      });
    },

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
                approveStatus: 2,
                dateApproved: null,
              });
            } else {
              const checkUserID = (obj) => obj.id === res.data.userID;

              if (!this.recommendingApprovalList.some(checkUserID)) {
                this.recommendingApprovalList.push({
                  id: res.data.userID,
                  name: res.data.name,
                  approveStatus: 2,
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
</style>
