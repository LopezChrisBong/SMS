<template>
  <div>
    <v-dialog v-model="dialog" persistent eager scrollable max-width="1000px">
      <v-form ref="PerformanceTarget" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>{{ action }} {{ getMFODesc(target_type) }}</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="closeD()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 700px" class="my-4">
            <v-container>
              <v-row>
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
                <v-col cols="12">
                  <v-textarea
                    label="Major Final Output"
                    outlined
                    v-model="mfo"
                    dense
                    :rules="[formRules.required]"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-textarea>
                </v-col>

                <v-col cols="12">
                  <div
                    class="rounded-lg px-3 pb-3"
                    style="border:1px solid gray;"
                  >
                    <div v-if="target_type != 2" class="h3 my-3">
                      Success Indicator (Target + Measure)
                    </div>
                    <div
                      class="d-flex justify-space-evenly"
                      :class="target_type == 3 ? 'mt-8' : ''"
                    >
                      <div v-if="target_type != 3">
                        <div
                          style="border:1px solid grey; width:95%"
                          class="rounded-lg pt-1 px-1 ml-1"
                        >
                          <div class="text-caption mb-n4">
                            Efficiency Type
                          </div>
                          <v-radio-group
                            :rules="
                              target_type != 3 ? [formRules.required] : []
                            "
                            v-model="efficiency_type"
                            mandatory
                            class=" pb-n4"
                            inline
                          >
                            <v-radio label="Numeric" value="numeric"></v-radio>
                            <v-radio
                              label="Percentage"
                              value="percentage"
                            ></v-radio>
                          </v-radio-group>
                        </div>
                        <v-text-field
                          label="Efficiency"
                          outlined
                          type="number"
                          v-model="efficiency"
                          :rules="
                            target_type != 3
                              ? [formRules.required, formRules.numberRequired]
                              : []
                          "
                          dense
                          color="#6DB249"
                          class="mx-1 mt-2"
                        >
                        </v-text-field>
                      </div>
                      <div style="width:30%">
                        <v-autocomplete
                          v-model="quality"
                          dense
                          outlined
                          class="rounded-lg mx-2"
                          item-text="description"
                          item-value="id"
                          label="Quality"
                          color="#6DB249"
                          :items="qlyList"
                        >
                        </v-autocomplete>
                      </div>

                      <!-- <v-textarea
                        label="Quality"
                        outlined
                        rows="5"
                        v-model="quality"
                        :rules="[formRules.required]"
                        dense
                        color="#6DB249"
                        class="mx-1"
                      >
                      </v-textarea> -->
                      <div style="width:50%">
                        <v-autocomplete
                          v-model="timeliness_selected"
                          dense
                          @change="changeTimeliness()"
                          outlined
                          class="rounded-lg mx-2"
                          item-text="description"
                          item-value="id"
                          label="Timeliness Type"
                          color="#6DB249"
                          :items="timelinessList"
                        >
                        </v-autocomplete>
                        <v-text-field
                          v-if="isToTimelinessNumber"
                          label="Number of day/s, weeks, etc."
                          outlined
                          type="number"
                          v-model="t_num"
                          :rules="
                            isToTimelinessNumber
                              ? [formRules.required, formRules.numberRequired]
                              : []
                          "
                          dense
                          color="#6DB249"
                          class="mx-2 mt-2"
                        >
                        </v-text-field>
                        <div
                          v-if="timeliness_selected"
                          class="ml-2 mb-1 red--text text-caption"
                        >
                          <i>Note: This is not required.</i>
                        </div>
                        <v-text-field
                          v-if="timeliness_selected"
                          label="Timeliness Additional Text"
                          outlined
                          v-model="t_add_desc"
                          dense
                          color="#6DB249"
                          class="mx-1 mx-2"
                        >
                        </v-text-field>

                        <v-textarea
                          v-if="timeliness_selected"
                          label="Timeliness Preview"
                          readonly
                          outlined
                          rows="3"
                          v-model="timelinessPreview"
                          dense
                          color="#6DB249"
                          class="mx-2"
                        >
                        </v-textarea>
                        <!-- <v-textarea
                          v-if="timeliness_selected"
                          label="Timeliness Preview"
                          readonly
                          outlined
                          rows="3"
                          v-model="timeliness"
                          dense
                          color="#6DB249"
                          class="mx-2"
                        >
                        </v-textarea> -->
                      </div>
                    </div>
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
              color="#5a67da"
              class="white--text"
              @click="addnew()"
              :disabled="isSubmitLoading"
              :loading="isSubmitLoading"
            >
              <v-icon>mdi-check-circle</v-icon>
              Save
            </v-btn>
            <v-btn
              v-if="action == 'Update'"
              color="#5a67da"
              class="white--text"
              @click="update()"
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
  },

  data() {
    return {
      id: null,
      timeliness: null,
      timeliness_selected: null,
      t_num: null,
      t_add_desc: null,
      quality: null,
      efficiency: null,
      efficiency_type: null,
      eff_is_rated: true,
      qly_is_rated: true,
      timeliness_is_rated: true,
      dialog: false,
      qlyList: [],
      timelinessList: [],
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
        console.log("asdasd", data);
        if (data.id) {
          this.id = data.id;
          this.mfo = data.mfo;
          this.timeliness = data.timeliness;
          this.quality = parseInt(data.quality_util_id);
          this.efficiency = data.efficiency;
          this.efficiency_type = data.efficiency_type;
          this.eff_is_rated = data.eff_is_rated;
          this.qly_is_rated = data.qly_is_rated;
          this.timeliness_is_rated = data.timeliness_is_rated;
          this.t_num = data.t_num;
          this.timeliness_selected = parseInt(data.timeliness_util_id);
          this.t_add_desc = data.t_add_desc;
        } else {
          this.id = null;
          this.mfo = null;
          this.timeliness = null;
          this.efficiency_type = null;
          this.quality = null;
          this.efficiency = null;
          this.eff_is_rated = 1;
          this.qly_is_rated = 1;
          this.timeliness_is_rated = 1;
          this.t_num = null;
          this.timeliness_selected = null;
          this.t_add_desc = null;
        }
        this.getIPCRQuality();
        this.getIPCRTimeliness();
      },

      deep: true,
    },
  },
  computed: {
    isToTimelinessNumber() {
      let toAdd = false;
      if (this.timeliness_selected) {
        for (let i = 0; i < this.timelinessList.length; i++) {
          if (this.timelinessList[i].id == this.timeliness_selected) {
            toAdd = this.timelinessList[i].toAddNumber;
          }
        }
      }
      return toAdd;
    },

    timelinessPreview() {
      let text = "";
      if (this.timeliness_selected) {
        for (let i = 0; i < this.timelinessList.length; i++) {
          if (this.timelinessList[i].id == this.timeliness_selected) {
            if (this.timelinessList[i].toAddNumber) {
              text += this.t_num ? this.t_num + " " : "";
              text += this.timelinessList[i].description + " ";
              text += this.t_add_desc ? this.t_add_desc : "";
            } else {
              text += this.timelinessList[i].description + " ";
              text += this.t_add_desc ? this.t_add_desc : "";
            }
          }
        }
      }
      return text;
    },

    getQualityDesc() {
      let text = "";
      if (this.quality) {
        for (let i = 0; i < this.qlyList.length; i++) {
          if (this.qlyList[i].id == this.quality) {
            text = this.qlyList[i].description;
          }
        }
      }
      return text;
    },
  },

  methods: {
    initialize() {},
    getMFODesc(id) {
      return this.mfoList[id - 1];
    },
    changeTimeliness() {
      this.t_num = null;
      this.t_add_desc = null;
    },
    closeD() {
      this.eventHub.$emit("closeIPCRFunctionDialog", false);
      this.initialize();
      this.isSubmitLoading = false;
      this.dialog = false;
    },

    addnew() {
      if (this.$refs.PerformanceTarget.validate()) {
        this.isSubmitLoading = true;
        let data = {
          ipcr_ID: this.ipcrID,
          target_type: this.target_type,
          mfo: this.mfo,
          efficiency: this.target_type != 3 ? this.efficiency : null,
          efficiency_type: this.target_type != 3 ? this.efficiency_type : null,
          quality_util_id: this.quality,
          quality: this.getQualityDesc,
          // quality: this.quality,
          // timeliness: this.timeliness,
          timeliness: this.timelinessPreview,
          t_num: this.t_num,
          t_add_desc: this.t_add_desc,
          timeliness_util_id: this.timeliness_selected,
          eff_is_rated: this.eff_is_rated,
          qly_is_rated: this.qly_is_rated,
          timeliness_is_rated: this.timeliness_is_rated,
        };
        // console.log(data);
        this.axiosCall("/ipcr-target", "POST", data).then((res) => {
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
      if (this.$refs.PerformanceTarget.validate()) {
        this.isSubmitLoading = true;
        let data = {
          ipcr_ID: this.ipcrID,
          target_type: this.target_type,
          mfo: this.mfo,
          efficiency: this.target_type != 3 ? this.efficiency : null,
          efficiency_type: this.target_type != 3 ? this.efficiency_type : null,
          // quality: this.quality,
          // timeliness: this.timeliness,
          quality_util_id: this.quality,
          quality: this.getQualityDesc,
          timeliness: this.timelinessPreview,
          t_num: this.t_num,
          t_add_desc: this.t_add_desc,
          timeliness_util_id: this.timeliness_selected,
          eff_is_rated: this.eff_is_rated,
          qly_is_rated: this.qly_is_rated,
          timeliness_is_rated: this.timeliness_is_rated,
        };
        // console.log(data);
        this.axiosCall("/ipcr-target/" + this.id, "PATCH", data).then((res) => {
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

    getIPCRQuality() {
      this.axiosCall("/ipcr-quality-util", "GET").then((res) => {
        this.qlyList = res.data;
      });
    },

    getIPCRTimeliness() {
      this.axiosCall("/ipcr-timeliness-util", "GET").then((res) => {
        this.timelinessList = res.data;
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
