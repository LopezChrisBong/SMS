<template>
  <div>
    <v-dialog v-model="dialog" persistent eager scrollable max-width="1000px">
      <v-form ref="SupportOutput" @submit.prevent>
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
                <v-col cols="4">
                  <v-text-field
                    outlined
                    :disabled="!eff_is_rated"
                    label="Efficiency"
                    dense
                    :rules="
                      eff_is_rated
                        ? [
                            formRules.onlyNumberNoNegative,
                            formRules.numberNotAboveFiveOrBelowZero,
                          ]
                        : []
                    "
                    type="number"
                    v-model="efficiency"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    outlined
                    :disabled="!qly_is_rated"
                    label="Quality"
                    dense
                    :rules="
                      qly_is_rated
                        ? [
                            formRules.onlyNumberNoNegative,
                            formRules.numberNotAboveFiveOrBelowZero,
                          ]
                        : []
                    "
                    type="number"
                    v-model="quality"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    outlined
                    :disabled="!timeliness_is_rated"
                    label="Timeliness"
                    dense
                    :rules="
                      timeliness_is_rated
                        ? [
                            formRules.onlyNumberNoNegative,
                            formRules.numberNotAboveFiveOrBelowZero,
                          ]
                        : []
                    "
                    type="number"
                    v-model="timeliness"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
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
      efficiency: null,
      quality: null,
      timeliness: null,

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
        console.log("sdasdasd DATA", data);
        if (data.id) {
          this.id = data.id;
          this.efficiency = data.efficiency;
          this.quality = data.quality;
          this.timeliness = data.timeliness;
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
      this.eventHub.$emit("closeSupportOutputDialog", false);
      this.initialize();
      this.isSubmitLoading = false;
      this.dialog = false;
    },

    save() {
      if (this.$refs.SupportOutput.validate()) {
        this.isSubmitLoading = true;
        let data = {
          id: this.id,
          efficiency: this.efficiency,
          quality: this.quality,
          timeliness: this.timeliness,
        };
        // console.log(data);
        this.axiosCall("/ipcr-support/updateOutput", "POST", data).then(
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
  },
};
</script>
