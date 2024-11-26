<template>
  <div>
    <v-dialog v-model="dialog" persistent eager scrollable max-width="1000px">
      <v-form ref="SupportFunction" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>{{ action }} IPCR Support Function</span>
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
                    readonly
                    v-model="func_type"
                    :rules="[formRules.required]"
                    dense
                    @change="changeActualAccomp()"
                    outlined
                    label="Function Type"
                    class="rounded-lg"
                    item-text="description"
                    item-value="id"
                    color="#93CB5B"
                    :items="func_List"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    label="Success Indicator"
                    outlined
                    v-model="success_indicator"
                    dense
                    :rules="[formRules.required]"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-textarea>
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    label="Actual Accomplishment"
                    outlined
                    :rules="func_type == 1 ? [formRules.required] : []"
                    v-model="actual_accom"
                    dense
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-textarea>
                </v-col>

                <v-col cols="12" class=" mt-4">
                  <div class="rounded-lg  pa-3" style="border:1px solid gray;">
                    <div class="h3 mb-2">
                      Rating (<i>Uncheck if <b>Not to be Rated</b></i> )
                    </div>
                    <v-row>
                      <v-col
                        cols="4"
                        class="d-flex justify-center align-center"
                      >
                        <v-checkbox
                          v-model="eff_is_rated"
                          label="(E) - Efficiency"
                        ></v-checkbox>
                      </v-col>
                      <v-col
                        cols="4"
                        class="d-flex justify-center align-center"
                      >
                        <v-checkbox
                          v-model="qly_is_rated"
                          label="(Q) - Quality"
                        ></v-checkbox>
                      </v-col>
                      <v-col
                        cols="4"
                        class="d-flex justify-center align-center"
                      >
                        <v-checkbox
                          v-model="timeliness_is_rated"
                          label="(T) - Timeliness"
                        ></v-checkbox>
                      </v-col>
                    </v-row>
                  </div>
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
              v-if="action == 'Add'"
              :color="$vuetify.theme.themes.light.submitBtns"
              class="white--text"
              @click="moduleFrom == 'Employee' ? addMySupFunc() : addnew()"
              :disabled="isSubmitLoading"
              :loading="isSubmitLoading"
            >
              <v-icon>mdi-check-circle</v-icon>
              Save
            </v-btn>
            <v-btn
              v-if="action == 'Update'"
              :color="$vuetify.theme.themes.light.submitBtns"
              class="white--text"
              @click="moduleFrom == 'Employee' ? updateMySupFunc() : update()"
              :disabled="isSubmitLoading"
              :loading="isSubmitLoading"
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
    target_type: null,
    ipcrID: null,
    action: null,
    moduleFrom: null,
  },

  data() {
    return {
      id: null,
      func_type: null,
      success_indicator: null,
      eff_is_rated: true,
      qly_is_rated: true,
      actual_accom: null,
      timeliness_is_rated: true,
      dialog: false,
      isSubmitLoading: false,
      fadeAwayMessage: {
        show: false,
        type: "success",
        header: "Successfully Added!",
        message: "",
        top: 10,
      },
      func_List: [
        { id: 1, description: "Institutional Obligations" },
        { id: 2, description: "Intervening Function" },
      ],

      mfo: null,
      mfoDescription: null,
    };
  },
  watch: {
    data: {
      handler(data) {
        this.dialog = true;
        if (data.ipcrID) {
          this.ipcrID = data.ipcrID;
        }
        if (data.id) {
          this.id = data.id;

          this.func_type = parseInt(data.func_type);
          this.actual_accom = data.actual_accom;
          if (data.func_type == 1) {
            this.success_indicator = data.success_indicator;
          } else {
            this.success_indicator = data.suc_ind;
          }

          this.eff_is_rated = data.eff_is_rated;
          this.qly_is_rated = data.qly_is_rated;
          this.timeliness_is_rated = data.timeliness_is_rated;
        } else {
          this.id = null;
          if (this.moduleFrom == "Employee") {
            this.func_type = 2;
          } else {
            this.func_type = 1;
          }

          this.actual_accom = null;
          this.success_indicator = null;
          this.eff_is_rated = 1;
          this.qly_is_rated = 1;
          this.timeliness_is_rated = 1;
        }
      },

      deep: true,
    },
  },

  methods: {
    initialize() {},

    closeD() {
      this.eventHub.$emit("closeAddIPCRSupportUtilDialog", false);
      this.initialize();
      this.isSubmitLoading = false;
      this.dialog = false;
    },

    changeActualAccomp() {
      if (this.func_type == 1) {
        this.actual_accom = "Provided by the Human Resource Management Office";
      } else {
        this.actual_accom = null;
      }
    },

    addnew() {
      if (this.$refs.SupportFunction.validate()) {
        this.isSubmitLoading = true;
        let data = {
          success_indicator: this.success_indicator,
          actual_accom: this.actual_accom,
          func_type: this.func_type,
          eff_is_rated: this.eff_is_rated,
          qly_is_rated: this.qly_is_rated,
          timeliness_is_rated: this.timeliness_is_rated,
        };
        // console.log(data);
        this.axiosCall("/ipcr-support-util", "POST", data).then((res) => {
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

    addMySupFunc() {
      if (this.$refs.SupportFunction.validate()) {
        this.isSubmitLoading = true;
        let data = {
          ipcrID: this.ipcrID,
          suc_ind: this.success_indicator,
          actual_accom: this.actual_accom,
          func_type: this.func_type,
          eff_is_rated: this.eff_is_rated,
          qly_is_rated: this.qly_is_rated,
          timeliness_is_rated: this.timeliness_is_rated,
        };
        // console.log(data);
        this.axiosCall("/ipcr-support/addSupportFunction", "POST", data).then(
          (res) => {
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
      }
    },

    update() {
      if (this.$refs.SupportFunction.validate()) {
        this.isSubmitLoading = true;
        let data = {
          success_indicator: this.success_indicator,
          actual_accom: this.actual_accom,
          func_type: this.func_type,
          eff_is_rated: this.eff_is_rated,
          qly_is_rated: this.qly_is_rated,
          timeliness_is_rated: this.timeliness_is_rated,
        };
        // console.log(data);
        this.axiosCall("/ipcr-support-util/" + this.id, "PATCH", data).then(
          (res) => {
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
          }
        );
      }
    },

    updateMySupFunc() {
      if (this.$refs.SupportFunction.validate()) {
        this.isSubmitLoading = true;
        let data = {
          suc_ind: this.success_indicator,
          actual_accom: this.actual_accom,
          func_type: this.func_type,
          eff_is_rated: this.eff_is_rated,
          qly_is_rated: this.qly_is_rated,
          timeliness_is_rated: this.timeliness_is_rated,
        };
        // console.log(data);
        this.axiosCall(
          "/ipcr-support/updateSupportFunction" + this.id,
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
