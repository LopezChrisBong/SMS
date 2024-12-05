<template>
  <div>
    <v-dialog v-model="dialog" persistent eager scrollable max-width="1000px">
      <v-form ref="PerformanceTarget" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>{{ action }} Support Function To Rate Setting</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="closeD()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 700px" class="my-4">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-textarea
                    v-model="success_indicator"
                    dense
                    readonly
                    outlined
                    label="Success Indicator"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-textarea>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="actual_accom"
                    dense
                    readonly
                    outlined
                    label="Actual Accomplishment"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-textarea>
                </v-col>
                <v-col cols="12" class=" mt-4">
                  <div class="rounded-lg  pa-3" style="border:1px solid gray;">
                    <div class="h3 mb-2">
                      <!-- Performance Target
                      Success Indicator (Target + Measure) -->
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
              v-if="action == 'Update'"
              color="#5a67da"
              class="white--text"
              @click="save()"
              :disabled="isSubmitLoading"
              :loading="isSubmitLoading"
            >
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
    target_type: null,
    ipcrID: null,
    action: null,
  },

  data() {
    return {
      id: null,
      success_indicator: null,
      actual_accom: null,
      timeliness: null,
      quality: null,
      efficiency: null,
      efficiency_type: null,
      eff_is_rated: true,
      qly_is_rated: true,
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
      mfoList: ["Core Functions", "Strategic Priority", "Support Functions"],
      mfo: null,
      mfoDescription: null,
    };
  },
  watch: {
    data: {
      handler(data) {
        this.dialog = true;
        if (data.id) {
          this.id = data.id;
          this.mfo = data.mfo;
          this.success_indicator = data.success_indicator;
          this.actual_accom = data.actual_accom;
          this.timeliness = data.timeliness;
          this.quality = data.quality;
          this.efficiency = data.efficiency;
          this.efficiency_type = data.efficiency_type;
          this.eff_is_rated = data.eff_is_rated;
          this.qly_is_rated = data.qly_is_rated;
          this.timeliness_is_rated = data.timeliness_is_rated;
        } else {
          this.id = null;
          this.mfo = null;
          this.actual_accom = null;
          this.timeliness = null;
          this.efficiency_type = null;
          this.quality = null;
          this.efficiency = null;
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
    getMFODesc(id) {
      return this.mfoList[id - 1];
    },
    closeD() {
      this.eventHub.$emit("closeUpdateSFToRateSettingDialog", false);
      this.initialize();
      this.isSubmitLoading = false;
      this.dialog = false;
    },

    save() {
      if (this.$refs.PerformanceTarget.validate()) {
        this.isSubmitLoading = true;
        let data = {
          eff_is_rated: this.eff_is_rated,
          qly_is_rated: this.qly_is_rated,
          timeliness_is_rated: this.timeliness_is_rated,
        };
        // console.log(data);
        this.axiosCall(
          "/ipcr-support/adminUpdateSupportFunction/" + this.id,
          "PATCH",
          data
        ).then((res) => {
          console.log(res);
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
