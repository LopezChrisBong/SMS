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
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>{{ action }} {{ room_section }} Student List</span>
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
                    dense
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
                  <div class="d-flex flex-row-reverse">
                    <v-btn
                      color="#147452"
                      medium
                      class="mb-2 ma-2 pa-2 "
                      outlined
                      @click="employeeDialog = true"
                    >
                      <v-icon size="14">mdi-plus</v-icon>Add
                    </v-btn>
                  </div>
                  <v-data-table
                    :headers="headers"
                    :items="studentList"
                    :items-per-page="10"
                    hide-default-footer
                  >
                    <template v-slot:[`item.action`]="{ item, index }">
                      <div class="text-no-wrap">
                        <v-btn
                          x-small
                          color="red"
                          class="mx-1"
                          outlined
                          @click="deleteItem(item, index)"
                        >
                          <v-icon size="14">mdi-trash-can</v-icon>Delete
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

            <v-btn color="red" outlined @click="closeD()">
              <v-icon>mdi-close-circle-outline</v-icon>
              Cancel
            </v-btn>

            <v-btn color="#147452" class="white--text" @click="save()">
              <v-icon>mdi-check-circle</v-icon>
              Save
            </v-btn>
            <v-btn
              color="#519043"
              class="white--text"
              v-if="action == 'Update'"
              @click="update()"
            >
              <v-icon>mdi-check-circle</v-icon>
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <v-dialog
      v-model="employeeDialog"
      persistent
      eager
      scrollable
      max-width="700px"
    >
      <v-form ref="employeeDialogForm" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>Add Student</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="employeeDialog = false">
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
                    dense
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

            <v-btn color="red" outlined @click="employeeDialog = false">
              <v-icon>mdi-close-circle-outline</v-icon>
              Cancel
            </v-btn>

            <v-btn color="#147452" class="white--text" @click="saveStudent()">
              <v-icon>mdi-check-circle</v-icon>
              Save
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
  </div>
</template>

<script>
export default {
  props: {
    data: null,
    action: null,
    grade: null,
    filter: null,
  },

  data() {
    return {
      employeeDialog: false,
      effective_date: null,
      id: null,
      dialog: false,
      resolution_list: [],
      studentList: [],
      studentData: [],
      student_activeList: [],
      remove_item: [],
      room_section: null,
      headers: [
        {
          text: "Name",
          value: "name",
          align: "start",
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
      this.getEnrolledStudent();
    },

    getEnrolledStudent() {
      this.axiosCall(
        "/enroll-student/AddClassStudent/EnrolledStudent/" + this.grade,
        "GET"
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
          this.grade +
          "/" +
          this.filter,
        "GET"
      ).then((res) => {
        if (res.data) {
          let data = res.data;
          console.log("Data", data);

          for (let i = 0; i < data.length; i++) {
            data[i].name = this.toTitleCase(data[i].name);
            this.studentData.push(data[i].id);
          }
          this.studentList = data;
        }
      });
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

      this.employeeDialog = false;
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

    closeD() {
      this.eventHub.$emit("closeaddStudentClassRoomDialog", false);
      this.initialize();
      this.dialog = false;
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
        }
      );
      // } else {
      //   this.fadeAwayMessage.show = true;
      //   this.fadeAwayMessage.type = "error";
      //   this.fadeAwayMessage.header = "System Message";
      //   this.fadeAwayMessage.message = "Cannot save without employee tagged!";
      // }
    },

    update() {
      console.log("Update Data");
      if (this.$refs.ShortListAccess.validate()) {
        const fd = new FormData();
        console.log(fd);
        let data = {
          resolution: this.resolution,
          effective_date: this.effective_date,
        };
        if (this.fileNewValue == true) {
          console.log("File naa", this.fileNewValue);
          fd.append("file", this.file_selected);
          fd.append("body", JSON.stringify(data));
          this.axiosCall("/resolution/" + this.id, "PATCH", fd).then((res) => {
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
        } else {
          console.log("File", this.fileNewValue);
          this.axiosCall(
            "/resolution/noFileUploaded/" + this.id,
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
        this.assigned_office = res.data.officeID;
      });
    },

    getOffices() {
      this.axiosCall("/offices", "GET").then((res) => {
        this.officeList = res.data;
      });
    },

    getDesignations() {
      this.axiosCall("/designations", "GET").then((res) => {
        this.designationList = res.data;
      });
    },
  },
};
</script>
