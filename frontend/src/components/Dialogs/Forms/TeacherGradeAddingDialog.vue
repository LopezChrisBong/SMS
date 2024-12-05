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
            <span>{{ action }} My Grade Level List</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="closeD()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 700px" class="my-4">
            <v-container>
              <v-row>
                <v-col cols="12" class="elevation-1 mt-4">
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
                    :items="subject_list"
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
            <span>Add Grade</span>
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
                    v-model="subjectData"
                    multiple
                    small-chips
                    deletable-chips
                    dense
                    outlined
                    required
                    label="Subjects"
                    :items="subjectListed"
                    item-text="subject_title"
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
      subject_list: [],
      subjectData: [],
      subjectListed: [],
      remove_item: [],
      room_section: null,
      headers: [
        {
          text: "Subject Name",
          value: "subject_title",
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
          this.getTaggedSubjects(data.id);
          this.subjectData = [];
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
        "/subjects/CreateSubject/active/" + this.filter,
        "GET"
      ).then((res) => {
        if (res.data) {
          let data = res.data;
          // for (let i = 0; i < data.length; i++) {
          //   data[i].name = this.toTitleCase(data[i].name);
          // }
          this.subjectListed = data;
        }
      });
    },

    getTaggedSubjects(id) {
      this.axiosCall("/subjects/getSubjectTaagged/" + id, "GET").then((res) => {
        if (res.data) {
          let data = res.data;

          for (let i = 0; i < data.length; i++) {
            data[i].subject_title = this.toTitleCase(data[i].subject_title);
            this.subjectData.push(data[i].id);
          }
          this.subject_list = data;
        }
      });
    },

    saveStudent() {
      for (let i = 0; i < this.subjectListed.length; i++) {
        for (let j = 0; j < this.subjectData.length; j++) {
          if (this.subjectListed[i].id == this.subjectData[j]) {
            if (
              this.subject_list.filter((e) => e.id == this.subjectData[j])
                .length == 0
            ) {
              this.subject_list.push(this.subjectListed[i]);
            }
          }
        }
      }

      this.employeeDialog = false;
    },
    deleteItem(item, index) {
      console.log(item.id, index);
      if (item.id) {
        this.remove_item.push(this.subject_list[index]);
        this.subject_list.splice(index, 1);
        this.subjectData.splice(index, 1);
      } else {
        this.subject_list.splice(index, 1);
        this.subjectData.splice(index, 1);
      }
    },

    closeD() {
      this.eventHub.$emit("closeaddStudentClassRoomDialog", false);
      this.initialize();
      this.dialog = false;
    },

    save() {
      // if (this.subject_list.length > 0) {
      let data = {
        userID: this.data.id,
        subject_list: JSON.stringify(this.subject_list),
        removed_subjects: JSON.stringify(this.remove_item),
      };
      this.axiosCall("/subjects/addTeachersSubject", "POST", data).then(
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
