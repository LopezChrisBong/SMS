<template>
  <div>
    <v-dialog v-model="dialog" eager scrollable max-width="900px">
      <v-form ref="UserVerifyFormref" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>{{ action }} {{ grade }} {{ className }} Class Program </span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="closeD()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 700px" class="my-4">
            <v-container>
              <v-row>
                <v-col cols="11" sm="5">
                  <v-dialog
                    ref="dialog1"
                    v-model="modal1"
                    :return-value.sync="time_slot_from"
                    persistent
                    width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="time_slot_from"
                        label="Select time from:"
                        prepend-icon="mdi-clock-time-four-outline"
                        readonly
                        v-bind="attrs"
                        :rules="[formRules.required]"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-if="modal1"
                      v-model="time_slot_from"
                      :readonly="action == 'Update' ? readonly : !readonly"
                      full-width
                    >
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="modal1 = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.dialog1.save(time_slot_from)"
                      >
                        OK
                      </v-btn>
                    </v-time-picker>
                  </v-dialog>
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="11" sm="5">
                  <v-dialog
                    ref="dialog2"
                    v-model="modal2"
                    :return-value.sync="time_slot_to"
                    persistent
                    width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="time_slot_to"
                        label="Select time to:"
                        prepend-icon="mdi-clock-time-four-outline"
                        readonly
                        v-bind="attrs"
                        :rules="[formRules.required]"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-if="modal2"
                      v-model="time_slot_to"
                      :readonly="action == 'Update' ? readonly : !readonly"
                      full-width
                    >
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="modal2 = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.dialog2.save(time_slot_to)"
                      >
                        OK
                      </v-btn>
                    </v-time-picker>
                  </v-dialog>
                </v-col>
                <v-col cols="12" md="6">
                  <v-autocomplete
                    v-model="day"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    item-text="name"
                    item-value="name"
                    label="Select Day"
                    color="#93CB5B"
                    :items="dayList"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" md="6">
                  <v-autocomplete
                    v-model="teacher"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    item-text="name"
                    item-value="id"
                    label="Teacher to assign"
                    @change="teacherAssign(teacher)"
                    color="#93CB5B"
                    :items="TeachersList"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" md="12">
                  <v-autocomplete
                    v-model="subject"
                    dense
                    :rules="[formRules.required]"
                    class="rounded-lg"
                    item-text="subject_title"
                    item-value="id"
                    label="Subject Title Name"
                    color="#93CB5B"
                    :items="subjectList"
                  >
                  </v-autocomplete>
                </v-col>

                <!-- <v-col cols="12" md="6">
                  <v-autocomplete
                    v-model="class_room"
                    :rules="[formRules.required]"
                    dense
                    class="rounded-lg"
                    item-text="room_section"
                    item-value="id"
                    label="Classroom to assign"
                    color="#93CB5B"
                    :items="classroomList"
                  >
                  </v-autocomplete>
                </v-col> -->
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
              @click="accept()"
            >
              <v-icon>mdi-check-circle</v-icon>
              {{ action == "Add" ? "Add" : "Update" }}
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
  </div>
</template>

<script>
export default {
  props: {
    data: null,
    action: null,
    grade: null,
    section: null,
    filter: null,
    adviser: null,
  },
  data() {
    return {
      userId: null,
      dialog: false,
      readonly: true,
      className: [],
      class_room: null,
      teacher: null,
      TeachersList: [],
      subject: null,
      subjectList: [],
      day: "Monday",
      id: null,
      dayList: [
        { id: 1, name: "Monday" },
        { id: 2, name: "Tuesday" },
        { id: 3, name: "Wednesday" },
        { id: 4, name: "Thursday" },
        { id: 5, name: "Friday" },
        { id: 6, name: "Saturday" },
      ],
      time_slot_from: null,
      time_slot_to: null,
      modal1: false,
      modal2: false,
      classroomList: [],
      assignedModulesList: [],
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
        this.initialize();
        this.$refs.UserVerifyFormref.resetValidation();
        if (data.id) {
          console.log("Love", data);
          this.id = data.availId;
          this.time_slot_from = data.times_slot_from;
          this.time_slot_to = data.times_slot_to;
          this.teacher = data.teacherID.toString();
          this.day = data.day;
          this.subject = data.subjectId;

          // this.verifyModel.usertypeID = data.user_usertypeID.toString();
        }
      },
      deep: true,
    },
  },
  methods: {
    initialize() {
      this.getUserType();
      this.getClassroom();
      if (
        this.grade == "Grade 1" ||
        this.grade == "Grade 2" ||
        this.grade == "Grade 3" ||
        this.grade == "Grade 4" ||
        this.grade == "Kinder 1" ||
        this.grade == "Kinder 2"
      ) {
        this.TeachingRoleAdvisory();
      } else {
        this.getRoleTeachers();
      }
    },
    getUserType() {
      this.axiosCall("/user-type/getAllUsertype", "GET").then((res) => {
        if (res.data) {
          console.log("UserList", res.data);
          this.usertypeList = res.data;
        }
      });
    },
    closeD() {
      this.eventHub.$emit("closeAddScheduleDialog", true);
      this.teacher = null;
      this.subject = null;
      this.section = null;
      this.time_slot_from = null;
      this.time_slot_to = null;
      this.day = null;
      this.grade = null;
      this.dialog = false;
    },

    teacherAssign(teacher) {
      this.getAllActiveSubjects(teacher);
    },
    accept() {
      if (this.$refs.UserVerifyFormref.validate()) {
        let filter = this.$store.getters.getFilterSelected;
        let hours = this.calculateHoursDifference(
          this.time_slot_from,
          this.time_slot_to
        );
        if (hours < 1) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message =
            "Please select time range above or equal to 1 hour!";
        } else {
          if (this.action == "Add") {
            let data = {
              teacherID: this.teacher,
              subjectId: this.subject,
              roomId: this.section,
              times_slot_from: this.time_slot_from,
              times_slot_to: this.time_slot_to,
              day: this.day,
              grade_level: this.grade,
              hours: hours,
              school_yearId: filter,
            };
            this.axiosCall("/enroll-student/addSchedule", "POST", data).then(
              (res) => {
                if (res.data.status == 201) {
                  this.dialog = false;
                  this.fadeAwayMessage.show = true;
                  this.fadeAwayMessage.type = "success";
                  this.fadeAwayMessage.header = "System Message";
                  this.fadeAwayMessage.message = res.data.msg;
                  this.closeD();
                } else {
                  this.dialog = false;
                  this.fadeAwayMessage.show = true;
                  this.fadeAwayMessage.type = "error";
                  this.fadeAwayMessage.header = "System Message";
                  this.fadeAwayMessage.message = res.data.msg;
                  this.$refs.UserVerifyFormref.reset();
                  this.closeD();
                }
              }
            );
          } else if (this.action == "Update") {
            let data = {
              teacherID: this.teacher,
              subjectId: this.subject,
              roomId: this.section,
              times_slot_from: this.time_slot_from,
              times_slot_to: this.time_slot_to,
              day: this.day,
              grade_level: this.grade,
              school_yearId: filter,
              hours: hours,
            };
            this.axiosCall(
              "/enroll-student/updateClassProgram/" + this.id,
              "PATCH",
              data
            ).then((res) => {
              if (res.data.status == 200) {
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
            });
          }
        }
      }
    },

    calculateHoursDifference(startTime, endTime) {
      // Helper function to convert time to minutes
      const timeToMinutes = (time) => {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
      };

      // Convert both times to minutes
      const startMinutes = timeToMinutes(startTime);
      const endMinutes = timeToMinutes(endTime);

      // Calculate the difference in minutes
      const differenceMinutes = endMinutes - startMinutes;

      // Convert minutes to hours (decimal format)
      const differenceHours = differenceMinutes / 60;

      return differenceHours;
    },

    getAllActiveSubjects(id) {
      let grade;
      if (this.grade == "Grade 11" || this.grade == "Grade 12") {
        grade = "Senior High";
      } else {
        grade = "Junior High";
      }
      this.axiosCall(
        "/subjects/getSpicificSubject/" + id + "/" + this.filter + "/" + grade,
        "GET"
      ).then((res) => {
        if (res) {
          console.log("Subject List", res.data);
          this.subjectList = res.data;
        }
      });
    },

    getClassroom() {
      //   let grade = this.grade.toString();
      this.axiosCall(
        "/rooms-section/" + this.grade + "/" + this.section,
        "GET"
      ).then((res) => {
        console.log("ClassName", res.data[0].teacherId);
        // this.adviser = res.data[0].teacherId;
        this.className = res.data[0].room_section;
      });
    },

    getRoleTeachers() {
      this.axiosCall(
        "/user-details/getAllVerifiedUser/TeachingRole/" + this.grade,
        "GET"
      ).then((res) => {
        console.log("Teacher Role1", res.data);
        this.TeachersList = res.data;
      });
    },

    TeachingRoleAdvisory() {
      this.axiosCall(
        "/user-details/getAdviser/RoomAdvisory/" +
          this.adviser +
          "/" +
          this.grade,
        "GET"
      ).then((res) => {
        console.log("Teacher Role2", res.data);
        this.TeachersList = res.data;
      });
    },
  },
};
</script>
