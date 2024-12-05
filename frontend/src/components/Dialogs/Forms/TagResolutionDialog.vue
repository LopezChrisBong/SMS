<template>
  <div>
    <v-dialog v-model="dialog" persistent eager scrollable max-width="900px">
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
                  <v-text-field
                    outlined
                    v-model="resolution"
                    dense
                    :rules="[formRules.required]"
                    class="rounded-lg"
                    label="Resolution Number"
                    color="#6DB249"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-menu
                    ref="incDateTo"
                    :close-on-content-click="false"
                    :return-value.sync="effective_date"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        color="#6DB249"
                        dense
                        v-model="effective_date"
                        :rules="[formRules.required]"
                        chips
                        small-chips
                        label="Date Signed"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="effective_date"
                      no-title
                      scrollable
                      color="#6DB249"
                    >
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        color="#6DB249"
                        @click="$refs.incDateTo.save(effective_date)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12">
                  <v-file-input
                    v-model="file_selected"
                    accept="application/pdf"
                    outlined
                    :rules="action == 'Update' ? [] : [formRules.required]"
                    color="#6DB249"
                    dense
                    label="Upload file"
                  ></v-file-input>
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
              color="#5a67da"
              class="white--text"
              v-if="action == 'Add'"
              @click="addnew()"
            >
              <v-icon>mdi-check-circle</v-icon>
              Add
            </v-btn>
            <v-btn
              color="#5a67da"
              class="white--text"
              v-if="action == 'Update'"
              @click="update()"
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
      effective_date: null,
      id: null,
      dialog: false,
      resolution: null,
      file_selected: null,
      fileNewValue: null,
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
        // console.log("DATA", data);
        if (this.action != "Tagging") {
          if (data.id) {
            this.resolution = data.resolution;
            this.id = data.id;
            this.file_selected = null;
            this.effective_date = data.effective_date;
          }
        }
      },

      deep: true,
    },
    file_selected: {
      handler(newValue, oldValue) {
        console.log(newValue, oldValue);
        if (newValue) {
          this.fileNewValue = true;
        } else {
          this.fileNewValue = false;
        }
      },
      deep: true,
    },
  },

  methods: {
    initialize() {},

    closeD() {
      this.eventHub.$emit("closeResolutionDialog", false);
      this.initialize();
      this.dialog = false;
    },

    addnew() {
      if (this.$refs.ResolutionUploading.validate()) {
        const fd = new FormData();
        console.log(fd);
        const data = {
          resolution: this.resolution,
          effective_date: this.effective_date,
        };
        fd.append("file", this.file_selected);
        fd.append("body", JSON.stringify(data));
        console.log("Added Employee Data", data);
        this.axiosCall("/resolution", "POST", fd).then((res) => {
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
