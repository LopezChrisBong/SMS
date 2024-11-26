<template>
  <div>
    <v-dialog v-model="dialog" persistent eager scrollable max-width="1000px">
      <v-form ref="MPOROutput" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>Update Outputs</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="closeD()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 700px" class="my-4">
            <v-container>
              <v-row>
                <v-col
                  cols="12"
                  style="border:1px solid #d3d3d3;background-color : #f5fefd"
                  class="rounded-lg"
                >
                  <v-row>
                    <v-col cols="12">
                      <div class="text-h6">
                        Efficiency (E)
                        <span v-if="!eff_is_rated"><i>Not to be Rated</i></span>
                      </div>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        outlined
                        :disabled="!eff_is_rated"
                        label="Week 1"
                        v-model="e_w1"
                        dense
                        :rules="[formRules.onlyNumberNoNegative]"
                        type="number"
                        min="0"
                        class="rounded-lg"
                        color="#6DB249"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        outlined
                        label="Week 2"
                        :disabled="!eff_is_rated"
                        dense
                        :rules="[formRules.onlyNumberNoNegative]"
                        type="number"
                        v-model="e_w2"
                        class="rounded-lg"
                        color="#6DB249"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        outlined
                        label="Week 3"
                        :disabled="!eff_is_rated"
                        dense
                        :rules="[formRules.onlyNumberNoNegative]"
                        type="number"
                        v-model="e_w3"
                        class="rounded-lg"
                        color="#6DB249"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        outlined
                        label="Week 4"
                        :disabled="!eff_is_rated"
                        dense
                        :rules="[formRules.onlyNumberNoNegative]"
                        type="number"
                        v-model="e_w4"
                        class="rounded-lg"
                        color="#6DB249"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col
                  cols="12"
                  style="border:1px solid #d3d3d3;background-color : #f5fefd"
                  class="rounded-lg mt-2"
                  v-if="qly_is_rated"
                >
                  <v-row>
                    <v-col cols="12">
                      <div class="text-h6">
                        Quality (Q)
                        <span v-if="!qly_is_rated"><i>Not to be Rated</i></span>
                      </div>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        outlined
                        :disabled="!qly_is_rated"
                        label="Week 1"
                        dense
                        :rules="[formRules.onlyNumberNoNegative]"
                        type="number"
                        v-model="q_w1"
                        class="rounded-lg"
                        color="#6DB249"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        outlined
                        label="Week 2"
                        :disabled="!qly_is_rated"
                        dense
                        :rules="[formRules.onlyNumberNoNegative]"
                        type="number"
                        v-model="q_w2"
                        class="rounded-lg"
                        color="#6DB249"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        outlined
                        label="Week 3"
                        :disabled="!qly_is_rated"
                        dense
                        :rules="[formRules.onlyNumberNoNegative]"
                        type="number"
                        v-model="q_w3"
                        class="rounded-lg"
                        color="#6DB249"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        outlined
                        label="Week 4"
                        :disabled="!qly_is_rated"
                        dense
                        :rules="[formRules.onlyNumberNoNegative]"
                        type="number"
                        v-model="q_w4"
                        class="rounded-lg"
                        color="#6DB249"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col
                  cols="12"
                  style="border:1px solid #d3d3d3;background-color : #f5fefd"
                  class="rounded-lg mt-2"
                >
                  <v-row>
                    <v-col cols="12">
                      <div class="text-h6">
                        Timeliness (T)
                        <span v-if="!timeliness_is_rated"
                          ><i>Not to be Rated</i></span
                        >
                      </div>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        outlined
                        :disabled="!timeliness_is_rated"
                        label="Week 1"
                        dense
                        :rules="[formRules.onlyNumberNoNegative]"
                        type="number"
                        v-model="t_w1"
                        class="rounded-lg"
                        color="#6DB249"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        outlined
                        label="Week 2"
                        :disabled="!timeliness_is_rated"
                        dense
                        :rules="[formRules.onlyNumberNoNegative]"
                        type="number"
                        v-model="t_w2"
                        class="rounded-lg"
                        color="#6DB249"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        outlined
                        label="Week 3"
                        :disabled="!timeliness_is_rated"
                        dense
                        :rules="[formRules.onlyNumberNoNegative]"
                        type="number"
                        v-model="t_w3"
                        class="rounded-lg"
                        color="#6DB249"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        outlined
                        label="Week 4"
                        :disabled="!timeliness_is_rated"
                        dense
                        :rules="[formRules.onlyNumberNoNegative]"
                        type="number"
                        v-model="t_w4"
                        class="rounded-lg"
                        color="#6DB249"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col cols="12" class="px-0 pt-4">
                  <v-textarea
                    outlined
                    label="Remarks"
                    dense
                    v-model="remarks"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-textarea>
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
              color="#519043"
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
  },

  data() {
    return {
      id: null,
      e_w1: null,
      e_w2: null,
      e_w3: null,
      e_w4: null,
      q_w1: null,
      q_w2: null,
      q_w3: null,
      q_w4: null,
      t_w1: null,
      t_w2: null,
      t_w3: null,
      t_w4: null,
      remarks: null,
      eff_is_rated: null,
      qly_is_rated: null,
      timeliness_is_rated: null,
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
        console.log("MPOR DATA", data);
        if (data.mpor.id) {
          this.id = data.mpor.id;
          this.e_w1 = data.mpor.e_w1;
          this.e_w2 = data.mpor.e_w2;
          this.e_w3 = data.mpor.e_w3;
          this.e_w4 = data.mpor.e_w4;
          this.q_w1 = data.mpor.q_w1;
          this.q_w2 = data.mpor.q_w2;
          this.q_w3 = data.mpor.q_w3;
          this.q_w4 = data.mpor.q_w4;
          this.t_w1 = data.mpor.t_w1;
          this.t_w2 = data.mpor.t_w2;
          this.t_w3 = data.mpor.t_w3;
          this.t_w4 = data.mpor.t_w4;
          this.remarks = data.mpor.remarks;
          this.eff_is_rated = data.eff_is_rated;
          this.qly_is_rated = data.qly_is_rated;
          this.timeliness_is_rated = data.timeliness_is_rated;
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
      this.isSubmitLoading = false;
      this.dialog = false;
      this.eventHub.$emit("closeMPOROutputDialog", false);
    },

    save() {
      if (this.$refs.MPOROutput.validate()) {
        this.isSubmitLoading = true;
        let data = {
          e_w1: this.e_w1,
          e_w2: this.e_w2,
          e_w3: this.e_w3,
          e_w4: this.e_w4,
          q_w1: this.q_w1,
          q_w2: this.q_w2,
          q_w3: this.q_w3,
          q_w4: this.q_w4,
          t_w1: this.t_w1,
          t_w2: this.t_w2,
          t_w3: this.t_w3,
          t_w4: this.t_w4,
          remarks: this.remarks,
        };
        // console.log(data);
        this.axiosCall(
          "/ipcr-mpor/updateMyMPOROutput/" + this.id,
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
  },
};
</script>
