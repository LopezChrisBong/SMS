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
      <v-form ref="ResolutionUploading" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>{{ action }} Resolution</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="closeD()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 700px" class="my-4">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-autocomplete
                    v-model="selected_resolution"
                    dense
                    outlined
                    required
                    :rules="[formRules.required]"
                    deletable-chips
                    label="Resolutions"
                    :items="resolution_list"
                    item-text="resolution"
                    item-value="id"
                    class="rounded-lg"
                    readonly
                    color="#6DB249"
                  ></v-autocomplete>
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
                    :items="employee_list"
                    item-text="name"
                    item-value="id"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-autocomplete>
                </v-col> -->
                <v-col cols="12" class="elevation-1">
                  <div class="d-flex flex-row-reverse">
                    <v-btn
                      color="green"
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
                    :items="employee1"
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

            <v-btn color="#519043" class="white--text" @click="save()">
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
            <span>Employees</span>
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
                    v-model="employee"
                    multiple
                    small-chips
                    deletable-chips
                    dense
                    outlined
                    required
                    label="Employee"
                    :items="employee_list"
                    item-text="name"
                    item-value="userID"
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

            <v-btn color="#519043" class="white--text" @click="saveEmployees()">
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
  },

  data() {
    return {
      employeeDialog: false,
      effective_date: null,
      id: null,
      dialog: false,
      resolution_list: [],
      selected_resolution: null,
      employee1: [],
      employee: [],
      employee_list: [],
      remove_item: [],
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
          console.log(data);
          this.getTaggedEmployee(data.id);
          this.employee = [];
          this.selected_resolution = data.id;
        }
      },

      deep: true,
    },
  },

  methods: {
    initialize() {
      this.getAllPlantilla();
      this.getAllResolutions();
    },

    getAllPlantilla() {
      this.axiosCall(
        "/employee/getAllPlantillandDesignatedEmployees",
        "GET"
      ).then((res) => {
        if (res.data) {
          let data = res.data;

          for (let i = 0; i < data.length; i++) {
            data[i].name = this.toTitleCase(data[i].name);
          }
          this.employee_list = data;
        }
      });
    },

    getTaggedEmployee(id) {
      this.axiosCall("/resolution-tagged/getByResolution/" + id, "GET").then(
        (res) => {
          if (res.data) {
            let data = res.data;

            for (let i = 0; i < data.length; i++) {
              data[i].name = this.toTitleCase(data[i].name);
              this.employee.push(data[i].userID);
            }
            this.employee1 = data;
          }
        }
      );
    },

    getAllResolutions() {
      this.axiosCall("/resolution", "GET").then((res) => {
        if (res.data) {
          let data = res.data;

          this.resolution_list = data;
        }
      });
    },
    saveEmployees() {
      for (let i = 0; i < this.employee_list.length; i++) {
        for (let j = 0; j < this.employee.length; j++) {
          if (this.employee_list[i].userID == this.employee[j]) {
            if (
              this.employee1.filter((e) => e.userID == this.employee[j])
                .length == 0
            ) {
              this.employee1.push(this.employee_list[i]);
            }
          }
        }
      }

      this.employeeDialog = false;
    },
    deleteItem(item, index) {
      console.log(item.id, index);
      if (item.id) {
        this.remove_item.push(this.employee1[index]);
        this.employee1.splice(index, 1);
        this.employee.splice(index, 1);
      } else {
        this.employee1.splice(index, 1);
        this.employee.splice(index, 1);
      }
    },

    closeD() {
      this.eventHub.$emit("closeResolutionDialog", false);
      this.initialize();
      this.dialog = false;
    },

    save() {
      if (this.employee1.length > 0) {
        let data = {
          resolution: this.selected_resolution,
          employees: JSON.stringify(this.employee1),
          removed_employee: JSON.stringify(this.remove_item),
        };

        this.axiosCall("/resolution-tagged", "POST", data).then((res) => {
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
        });
      } else {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message = "Cannot save without employee tagged!";
      }
    },

    update() {
      console.log("Update Data");
      if (this.$refs.ResolutionUploading.validate()) {
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
