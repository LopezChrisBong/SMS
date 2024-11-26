<template>
  <div>
    <v-dialog v-model="dialog" persistent eager scrollable max-width="1000px">
      <v-form ref="StratPlanTargets" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>{{ action }} Strat Plan Target</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="closeD()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 700px" class="my-4">
            <v-container>
              <v-row>
                <!-- <v-col cols="12" class=" mt-4">
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
                </v-col> -->
                <v-col cols="12">
                  <v-textarea
                    label="Strategic Planning Target Description"
                    outlined
                    v-model="target_desc"
                    dense
                    :rules="[formRules.required]"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-textarea>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="target_accomplishment"
                    :rules="[formRules.required]"
                    dense
                    type="number"
                    outlined
                    required
                    label="Strategic Planning Target Accomplishment"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>
                <!-- 
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

                      <v-textarea
                        label="Quality"
                        outlined
                        rows="5"
                        v-model="quality"
                        :rules="[formRules.required]"
                        dense
                        color="#6DB249"
                        class="mx-1"
                      >
                      </v-textarea>
                      <v-textarea
                        label="Timeliness"
                        outlined
                        rows="5"
                        v-model="timeliness"
                        :rules="[formRules.required]"
                        dense
                        color="#6DB249"
                        class="mx-1"
                      >
                      </v-textarea>
                    </div>
                  </div>
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
              v-if="action == 'Add'"
              color="#519043"
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
              color="#519043"
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
    action: null,
  },

  data() {
    return {
      id: null,
      spID: null,
      target_desc: null,
      target_accomplishment: null,
      linked: null,
      dialog: false,
      isSubmitLoading: false,
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
        console.log("Data", data);
        if (data.id) {
          this.id = data.id;
          this.linked = data.linked;
          this.target_desc = data.target_desc;
          this.target_accomplishment = data.target_accomplishment;

          this.spID = data.spID;
        } else {
          this.id = null;
          this.spID = data.spID;
          this.target_desc = null;
          this.linked = null;
          this.target_accomplishment = null;
        }
      },

      deep: true,
    },
  },

  methods: {
    initialize() {},

    closeD() {
      this.eventHub.$emit("closeStratPlanTargets", false);
      this.isSubmitLoading = false;
      this.dialog = false;
    },

    addnew() {
      if (this.$refs.StratPlanTargets.validate()) {
        this.isSubmitLoading = true;
        let data = {
          spID: this.spID,
          target_desc: this.target_desc,
          target_accomplishment: this.target_accomplishment,
        };
        // console.log(data);
        this.axiosCall(
          "/strategic-planning/stratPlanTargets",
          "POST",
          data
        ).then((res) => {
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
      if (this.$refs.StratPlanTargets.validate()) {
        this.isSubmitLoading = true;
        let data = {
          target_desc: this.target_desc,
          target_accomplishment: this.target_accomplishment,
        };
        // console.log(data);
        this.axiosCall(
          "/strategic-planning/updateStratPlanTarget/" + this.id,
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
