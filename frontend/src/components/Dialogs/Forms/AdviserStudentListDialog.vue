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
      <v-form ref="ShortListAccess" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-3 pb-3 pl-6">
            <span
              >{{ action }} {{ data ? data.grade_level : "" }}
              {{ data ? data.room_section : "" }} Student List</span
            >
            <v-spacer></v-spacer>
            <v-btn icon dark @click="closeD()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 700px" class="my-4">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="room_section"
                    outlined
                    required
                    :rules="[formRules.required]"
                    deletable-chips
                    label="Class Name"
                    item-text="room_section"
                    item-value="id"
                    class="rounded-lg"
                    readonly
                    color="#6DB249"
                  ></v-text-field>
                </v-col>

                <!-- <v-col cols="12">
                      <v-autocomplete
                        v-model="employee"
                        multiple
                        small-chips
                        deletable-chips
                       outlined
              dense
                        outlined
                        required
                        label="Employee"
                        :items="student_activeList"
                        item-text="name"
                        item-value="id"
                        class="rounded-lg"
                        color="#6DB249"
                      ></v-autocomplete>
                    </v-col> -->
                <v-col cols="12" class="elevation-1">
                  <div class="d-flex flex-row-reverse mb-2">
                    <v-btn
                      min-height="40"
                      style="width: 95pt; background-color: #f5b027"
                      class="white--text rounded-lg ml-2"
                      v-if="studentList.length"
                      color="#f5b027"
                      small
                      outlined
                      @click="
                        data
                          ? data.grade_level == 'Grade 12'
                            ? notUpdateable()
                            : updateable()
                          : notUpdateable()
                      "
                    >
                      <v-icon center medium> mdi-chart-line-variant </v-icon>
                      <span class="gboFontsTab"> Promote</span>
                    </v-btn>

                    <v-btn
                      v-if="currentYear"
                      color="#f5b027"
                      medium
                      min-height="40"
                      style="width: 75pt; background-color: #f5b027"
                      class="white--text rounded-lg"
                      outlined
                      @click="studentDialog = true"
                    >
                      <v-icon size="25">mdi-plus</v-icon>
                      Add
                    </v-btn>
                  </div>
                  <v-data-table
                    :headers="headers"
                    :items="studentList"
                    :items-per-page="10"
                    hide-default-footer
                    class="custom-table"
                  >
                    <template v-slot:[`item.name`]="{ item }">
                      <span class="gboFontsTable">{{ item.name }}</span>
                    </template>
                    <template v-slot:[`item.status`]="{ item }">
                      <v-chip
                        class="chip-status-4 white--text"
                        :color="
                          item.status == 1
                            ? 'blue'
                            : item.status == 2
                            ? 'green'
                            : 'red'
                        "
                        small
                        v-if="item.status != null"
                      >
                        <span>
                          {{
                            item.status == 1
                              ? "Transferred"
                              : item.status == 2
                              ? "Drop"
                              : "Dead"
                          }}
                        </span>
                      </v-chip>
                    </template>
                    <template v-slot:[`item.action`]="{ item, index }">
                      <div class="text-no-wrap">
                        <v-btn
                          small
                          color="red"
                          class="my-2 mx-2 gboFontsTable rounded-lg"
                          outlined
                          @click="deleteItem(item, index)"
                        >
                          <v-icon>mdi-trash-can</v-icon>
                        </v-btn>
                        <v-btn
                          small
                          color="red"
                          class="mx-1 gboFontsTable"
                          outlined
                          @click="transfer(item, index)"
                        >
                          <v-icon>mdi-transfer</v-icon>
                        </v-btn>
                        <v-btn
                          small
                          color="green"
                          class="mx-1 gboFontsTable"
                          outlined
                          @click="nextClassroom(item, index)"
                        >
                          <v-icon>mdi-page-next</v-icon>
                        </v-btn>
                      </div>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions class="pa-5">
            <v-spacer></v-spacer>

            <v-btn
              color="red"
              class="rounded-lg"
              style="width: 85pt"
              outlined
              @click="closeD()"
            >
              <v-icon>mdi-close-circle-outline</v-icon>
              <span class="gboFontsTab"> Cancel</span>
            </v-btn>

            <v-btn
              color="#f5b027"
              style="width: 85pt"
              class="white--text rounded-lg"
              @click="save()"
            >
              <v-icon>mdi-check-circle</v-icon>
              <span class="gboFontsTab"> Save</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <v-dialog
      v-model="studentDialog"
      persistent
      eager
      scrollable
      max-width="600px"
    >
      <v-form ref="studentDialogForm" @submit.prevent>
        <v-card class="rounded-xl">
          <v-card-title dark class="dialog-header pt-3 pb-3 pl-6">
            <span>Add Student</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="studentDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 700px" class="my-4">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-autocomplete
                    v-model="studentData"
                    multiple
                    small-chips
                    deletable-chips
                    outlined
                    required
                    label="Students"
                    :items="student_activeList"
                    item-text="name"
                    item-value="id"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions class="pa-5">
            <v-spacer></v-spacer>

            <v-btn
              color="red"
              class="rounded-lg"
              outlined
              @click="studentDialog = false"
            >
              <v-icon>mdi-close-circle-outline</v-icon>
              Cancel
            </v-btn>

            <v-btn
              color="#f5b027"
              class="white--text rounded-lg"
              @click="saveStudent()"
            >
              <v-icon>mdi-check-circle</v-icon>
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <v-dialog
      v-model="updateClassListDialog"
      persistent
      eager
      scrollable
      max-width="700px"
      fullscreen
    >
      <v-form ref="updateClassListDialogForm" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-3 pb-3 pl-6">
            <span>Upgrade Class List </span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="updateClassListDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 700px" class="my-4">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-autocomplete
                    v-model="nextSchoolYear"
                    outlined
                    required
                    label="School Year"
                    :items="nextSchoolYearList"
                    item-text="school_year"
                    item-value="id"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    v-model="nextClass"
                    outlined
                    required
                    small-chips
                    deletable-chips
                    chips
                    :rules="[formRules.required]"
                    label="Room List"
                    :items="nextClassRoomList"
                    item-text="room_section"
                    item-value="id"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <div
                    style="border: 1px solid orange; border-radius: 10px"
                    class="pa-3"
                  >
                    <input
                      type="file"
                      @change="readExcel"
                      accept=".xls,.xlsx"
                    />
                  </div>
                </v-col>
                <v-col cols="12" v-if="promotedList.length">
                  <v-card elevation="10">
                    <v-data-table
                      :headers="headers1"
                      :items="promotedList"
                      :items-per-page="10"
                      class="custom-table"
                    ></v-data-table>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions class="pa-5">
            <v-spacer></v-spacer>

            <v-btn
              color="red"
              class="rounded-lg"
              outlined
              @click="updateClassListDialog = false"
            >
              <v-icon>mdi-close-circle-outline</v-icon>
              Cancel
            </v-btn>

            <v-btn
              color="#f5b027"
              class="white--text rounded-lg"
              @click="updateStudent(1)"
              :disabled="!nextClass || promotedList.length === 0"
            >
              <v-icon>mdi-check-circle</v-icon>
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <v-dialog
      v-model="transferDialog"
      persistent
      eager
      scrollable
      max-width="400px"
    >
      <v-card class="rounded-xl">
        <v-card-title dark class="dialog-header">
          <span>Update Student Status</span>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="transferDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="my-3">
          <v-row>
            <v-col
              ><div>
                <strong>Student Name: </strong
                >{{ updateData ? updateData.name : "" }}
              </div></v-col
            >
            <v-col cols="12">
              <v-autocomplete
                v-model="studentStatus"
                deletable-chips
                small-chips
                outlined
                label="Status"
                :items="[
                  { id: 1, description: 'Transfer' },
                  { id: 2, description: 'Drop' },
                  { id: 3, description: 'Death' },
                ]"
                item-text="description"
                item-value="id"
                class="rounded-lg mb-n5 mt-3"
                color="#6DB249"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="statusRemarks"
                outlined
                color="orange"
                label="Remarks"
                class="mb-n5 rounded-lg"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="red"
            class="rounded-lg"
            outlined
            @click="transferDialog = false"
          >
            <v-icon>mdi-close-circle-outline</v-icon>
            Cancel
          </v-btn>

          <v-btn
            color="#f5b027"
            class="white--text rounded-lg"
            @click="saveStatus"
            :disabled="!studentStatus || !statusRemarks"
          >
            <v-icon>mdi-check-circle</v-icon>
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="changeClassDialog"
      persistent
      eager
      :retain-focus="false"
      scrollable
      max-width="400px"
    >
      <v-card class="rounded-xl">
        <v-card-title dark class="dialog-header pt-3 pb-3 pl-6">
          <span>Change Student Classroom</span>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="changeClassDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text style="max-height: 700px" class="my-4">
          <v-row>
            <v-col
              ><div>
                <strong>Student Name: </strong
                >{{ updateData ? updateData.name : "" }}
              </div></v-col
            >
            <v-col cols="12">
              <v-autocomplete
                v-model="nextClass"
                outlined
                required
                small-chips
                deletable-chips
                chips
                :rules="[formRules.required]"
                label="Room List"
                :items="nextClassRoomList"
                item-text="room_section"
                item-value="id"
                class="rounded-lg"
                color="#6DB249"
              ></v-autocomplete>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>

        <v-card-actions class="pa-5">
          <v-spacer></v-spacer>

          <v-btn
            color="red"
            class="rounded-lg"
            outlined
            @click="changeClassDialog = false"
          >
            <v-icon>mdi-close-circle-outline</v-icon>
            Cancel
          </v-btn>

          <v-btn
            color="#f5b027"
            class="white--text rounded-lg"
            @click="studentChangeClass()"
            :disabled="!nextClass"
          >
            <v-icon>mdi-check-circle</v-icon>
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="saveConfirmation" persistent max-width="500">
      <v-card class="rounded-xl pa-2">
        <v-card-title class="d-flex align-center gap-2 pb-2">
          <span class="text-h6 font-weight-bold"> Upgrade Confirmation! </span>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="text-center py-6">
          <div class="text-body-1 mb-4">
            There is already list of student on the class you selected, please
            confirm if the you still want to add student list into the class you
            selected.
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="px-6 py-4">
          <v-btn @click="saveConfirmation = false" outlined color="red"
            >cancel</v-btn
          >
          <v-spacer></v-spacer>

          <v-btn @click="updateStudent(2)" color="orange" outlined>
            Confirm Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div v-if="loadingState" class="loading-overlay">
      <div class="spinner"></div>
      <p>Loading, please wait...</p>
    </div>
    <fade-away-message-component
      displayType="variation2"
      v-model="fadeAwayMessage.show"
      :message="fadeAwayMessage.message"
      :header="fadeAwayMessage.header"
      :top="fadeAwayMessage.top"
      :type="fadeAwayMessage.type"
      :timeout="3000"
    ></fade-away-message-component>
  </div>
</template>

<script>
import * as XLSX from "xlsx";
export default {
  props: {
    data: null,
    action: null,
  },

  data() {
    return {
      currentYear: true,
      loadingState: false,
      studentDialog: false,
      changeClassDialog: false,
      saveConfirmation: false,
      studentStatus: null,
      statusRemarks: null,
      transferDialog: false,
      originalStudentList: [],
      effective_date: null,
      id: null,
      dialog: false,
      resolution_list: [],
      filter: null,
      studentList: [],
      studentData: [],
      promotedList: [],
      student_activeList: [],
      remove_item: [],
      room_section: null,
      updateClassListDialog: false,
      nextSchoolYearList: [],
      nextSchoolYear: null,
      nextGradeLevel: null,
      nextClass: null,
      nextClassRoomList: [],
      updateData: null,
      notPromotedStudents: [],
      promotedStudents: [],
      headers: [
        {
          text: "Student Name",
          value: "name",
          align: "start",
          valign: "center",
          sortable: false,
        },

        {
          text: "Status",
          value: "status",
          align: "center",
          valign: "center",
          sortable: false,
        },

        {
          text: "Action",
          value: "action",
          align: "end",
          valign: "center",
          sortable: false,
        },
      ],
      headers1: [
        {
          text: "LRN",
          value: "lrn",
          align: "start",
          valign: "center",
          sortable: false,
        },

        {
          text: "Student Name",
          value: "learnerName",
          align: "center",
          valign: "center",
          sortable: false,
        },

        {
          text: "Action",
          value: "action",
          align: "end",
          valign: "center",
          sortable: false,
        },
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
        this.initialize();
        this.dialog = true;
        this.$refs.updateClassListDialogForm.resetValidation();
        // console.log("DATA", data);
        if (data.id) {
          console.log("Data Title", data);
          this.getTaggedStudent(data.id);
          this.studentData = [];
          this.room_section = data.room_section;
        }
      },

      deep: true,
    },
  },

  methods: {
    initialize() {
      this.filter = this.$store.getters.getFilterSelected;
      this.nextSchoolYear = this.filter;
      this.getEnrolledStudent();
      this.getSchoolYear();
    },

    getEnrolledStudent() {
      this.axiosCall(
        "/enroll-student/AddClassStudent/EnrolledStudent/" +
          this.data.grade_level,
        "GET",
      ).then((res) => {
        if (res.data) {
          let data = res.data;

          for (let i = 0; i < data.length; i++) {
            data[i].name = this.toTitleCase(data[i].name);
          }
          this.student_activeList = data;
        }
      });
    },

    getTaggedStudent(id) {
      this.axiosCall(
        "/rooms-section/getRoomClassList/" +
          id +
          "/" +
          this.data.grade_level +
          "/" +
          this.filter,
        "GET",
      ).then((res) => {
        if (res.data) {
          let data = res.data;
          console.log("Data", data);

          for (let i = 0; i < data.length; i++) {
            data[i].name = this.toTitleCase(data[i].name);
            this.studentData.push(data[i].id);
          }
          if (data[0].school_yearId != this.filter) {
            this.currentYear = false;
          }
          this.studentList = data;
          this.originalStudentList = data;
        }
      });
    },
    notUpdateable() {
      alert("This grade level is  not updatable!");
    },

    updateable() {
      const currentGrade = this.data.grade_level;

      if (currentGrade) {
        if (currentGrade === "Kinder 1") {
          this.nextGradeLevel = "Kinder 2";
        } else if (currentGrade === "Kinder 2") {
          this.nextGradeLevel = "Grade 1";
        } else if (currentGrade.startsWith("Grade ")) {
          const gradeNumber = parseInt(currentGrade.replace("Grade ", ""));

          if (!isNaN(gradeNumber)) {
            this.nextGradeLevel =
              gradeNumber < 12 ? `Grade ${gradeNumber + 1}` : "Grade 12";
          }
        }
      }
      this.updateClassListDialog = true;
      this.getAllRooms();
    },

    getAllRooms() {
      this.axiosCall("/rooms-section/" + this.nextGradeLevel, "GET").then(
        (res) => {
          if (res) {
            console.log("Love", res.data);
            let data = res.data;
            let newArr = [];
            for (let i = 0; i < data.length; i++) {
              if (data[i].id != this.data.id) {
                newArr.push(data[i]);
              }
            }
            this.nextClassRoomList = newArr;
          }
        },
      );
    },
    saveStudent() {
      for (let i = 0; i < this.student_activeList.length; i++) {
        for (let j = 0; j < this.studentData.length; j++) {
          if (this.student_activeList[i].id == this.studentData[j]) {
            if (
              this.studentList.filter((e) => e.id == this.studentData[j])
                .length == 0
            ) {
              this.studentList.push(this.student_activeList[i]);
            }
          }
        }
      }

      this.studentDialog = false;
    },
    deleteItem(item, index) {
      console.log(item.id, index);
      if (item.id) {
        this.remove_item.push(this.studentList[index]);
        this.studentList.splice(index, 1);
        this.studentData.splice(index, 1);
      } else {
        this.studentList.splice(index, 1);
        this.studentData.splice(index, 1);
      }
    },

    transfer(item, index) {
      console.log(item, index);
      this.transferDialog = true;
      this.updateData = item;
    },
    saveStatus() {
      let data = {
        status: this.studentStatus,
        remarks: this.statusRemarks,
        school_yearId: this.filter,
      };
      this.axiosCall(
        "/rooms-section/updateStudentStatus/" + this.updateData.id,
        "PATCH",
        data,
      ).then((res) => {
        console.log(res.data);
        if (res.data.status == 201) {
          this.transferDialog = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "Successfully updated subject!";
          this.closeD();
        } else if (res.data.status == 400) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
        }
      });
    },
    nextClassroom(item, index) {
      console.log(item, index);
      this.updateData = item;
      this.nextGradeLevel = this.data.grade_level;
      this.changeClassDialog = true;
      this.getAllRooms();
    },
    studentChangeClass() {
      console.log(this.nextClass);
      let data = {
        roomId: this.nextClass,
        school_yearId: this.filter,
      };
      this.axiosCall(
        "/rooms-section/updateStudentList/" + this.updateData.id,
        "PATCH",
        data,
      ).then((res) => {
        console.log(res.data);
        if (res.data.status == 201) {
          this.changeClassDialog = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "Successfully updated subject!";
          this.closeD();
        } else if (res.data.status == 400) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
        }
      });
    },

    closeD() {
      this.eventHub.$emit("closeadviserStudentListDialog", false);
      this.initialize();
      this.dialog = false;
      this.updateClassListDialog = false;
    },

    save() {
      // if (this.studentList.length > 0) {
      let data = {
        classID: this.data.id,
        stundent_list: JSON.stringify(this.studentList),
        removed_student: JSON.stringify(this.remove_item),
      };

      this.axiosCall("/rooms-section/addStudentClassRoom", "POST", data).then(
        (res) => {
          console.log(res);
          if (res.data.status == 201) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.closeD();
          } else {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
          }
        },
      );
      // } else {
      //   this.fadeAwayMessage.show = true;
      //   this.fadeAwayMessage.type = "error";
      //   this.fadeAwayMessage.header = "System Message";
      //   this.fadeAwayMessage.message = "Cannot save without employee tagged!";
      // }
    },

    async updateStudent(count) {
      if (this.$refs.updateClassListDialogForm.validate()) {
        let accountedStudent = {
          promoted: this.promotedStudents,
          notPromoted: this.notPromotedStudents,
          count: count,
          roomID: this.data.id,
          gradeLevel: this.data.grade_level,
        };
        let data = {
          data: JSON.stringify(accountedStudent),
        };

        this.axiosCall(
          "/rooms-section/updateAddRecords/" +
            this.nextGradeLevel +
            "/" +
            this.nextSchoolYear +
            "/" +
            this.nextClass,
          "POST",
          data,
        ).then((res) => {
          if (res) {
            if (res.data.status == 201) {
              this.dialog = false;
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "success";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
              this.confirmDialog = false;
              this.updateClassListDialog = false;
              this.saveConfirmation = false;
              this.initialize();
            } else if (res.data.status == 400) {
              if (res.data.count == 2) {
                this.saveConfirmation = true;
              } else {
                this.updateClassListDialog = false;
                this.confirmDialog = false;
                this.fadeAwayMessage.show = true;
                this.fadeAwayMessage.type = "error";
                this.fadeAwayMessage.header = "System Message";
                this.fadeAwayMessage.message = res.data.msg;
              }
            }
          }
        });
      }
    },

    getSchoolYear() {
      this.axiosCall("/enroll-student/getSchoolYear", "GET").then((res) => {
        if (res) {
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].status == 1) {
              this.nextSchoolYearList.push(res.data[i]);
              this.nextSchoolYear = res.data[i].id;
            }
          }
        }
      });
    },
    readExcel(event) {
      const file = event.target.files[0];
      this.loadingState = true;
      if (!file) {
        this.promotedList = [];
        this.loadingState = false;
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const rows = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: "",
        });

        // Find header row (row containing LRN)
        const headerIndex = rows.findIndex((row) =>
          row.some((cell) => String(cell).toUpperCase().includes("LRN")),
        );

        if (headerIndex === -1) {
          console.error("LRN column not found.");
          return;
        }

        const headers = rows[headerIndex];

        const lrnCol = headers.findIndex((h) =>
          String(h).toUpperCase().includes("LRN"),
        );

        const nameCol = headers.findIndex((h) =>
          String(h).toUpperCase().includes("LEARNER"),
        );

        const actionCol = headers.findIndex((h) =>
          String(h).toUpperCase().includes("ACTION"),
        );

        if (lrnCol === -1 || nameCol === -1 || actionCol === -1) {
          console.error("Required columns not found.");
          return;
        }

        const result = [];

        for (let i = headerIndex + 1; i < rows.length; i++) {
          const row = rows[i];

          const lrn = row[lrnCol];
          const name = row[nameCol];
          const action = row[actionCol];

          if (!lrn || !name || !action) continue;

          result.push({
            lrn: String(lrn).trim(),
            learnerName: String(name).trim(),
            action: String(action).toUpperCase().includes("PROMOTED")
              ? "PROMOTED"
              : String(action).toUpperCase().includes("CONDITIONAL")
              ? "CONDITIONALLY PROMOTED"
              : String(action).toUpperCase().includes("RETAINED")
              ? "RETAINED"
              : String(action).toUpperCase().includes("DROPPED")
              ? "DROPPED"
              : action,
          });
        }
        this.promotedList = result;
        // console.log(result);
        this.compare();
        this.loadingState = false;
      };

      reader.readAsArrayBuffer(file);
    },
    compare() {
      let notPromoted = [];
      let promoted = [];

      this.studentList.forEach((student) => {
        const match = this.promotedList.find(
          (p) => String(p.lrn).trim() === String(student.LRN).trim(),
        );

        if (match) {
          if (
            match.action === "PROMOTED" ||
            match.action === "CONDITIONALLY PROMOTED"
          ) {
            promoted.push(student);
          } else if (match.action === "RETAINED") {
            notPromoted.push(student);
          }
        } else {
          if (student.status !== 1) {
            notPromoted.push(student);
          }
        }
      });

      // console.log("Promoted:", promoted);
      // console.log("Not Promoted:", notPromoted);
      this.promotedStudents = promoted;
      this.notPromotedStudents = notPromoted;
    },
  },
};
</script>

<style scoped>
.gboFonts {
  font-family: "Segoe UI" !important;
  font-size: 11pt;
}

.gboFontsTab {
  font-family: "Segoe UI" !important;
  font-size: 12pt;
}

.gboFontsTable {
  font-family: "Segoe UI" !important;
  font-size: 11pt;
}

.custom-table :deep(th) {
  font-size: 11pt !important;
  line-height: 1.5;
}
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 6px solid #ccc;
  border-top: 6px solid #1976d2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
</style>
