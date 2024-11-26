<template>
  <div>
    <v-dialog v-model="dialog" eager persistent scrollable max-width="600px">
      <v-form ref="CSEligFormref" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span v-if="action == 'Add'"> Add Civil Service Eligibility</span>
            <span v-if="action == 'Update'"
              >Update Civil Service Eligibility</span
            >
            <v-spacer></v-spacer>
            <v-btn
              icon
              dark
              @click="
                closeD();
                dialog = false;
              "
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-col> </v-col>
          <v-card-text style="max-height: 700px" class="">
            <v-container>
              <v-row>
                <v-col cols="12" class="py-1">
                  <v-text-field
                    v-model="csEligibilityModel.eligibility_type"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="Career Service / RA 1080 (Board/Bar)..."
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" class="py-1">
                  <v-text-field
                    v-model="csEligibilityModel.rating"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="Rating"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" class="py-1">
                  <v-menu
                    ref="confermentDate"
                    :close-on-content-click="false"
                    :return-value.sync="csEligibilityModel.conferment_date"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        dense
                        v-model="csEligibilityModel.conferment_date"
                        :rules="[formRules.required]"
                        chips
                        small-chips
                        label="Date of Examination/Conferment (FROM)"
                        color="#6DB249"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      color="#6DB249"
                      v-model="csEligibilityModel.conferment_date"
                      no-title
                      scrollable
                    >
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        color="#6DB249"
                        @click="
                          $refs.confermentDate.save(
                            csEligibilityModel.conferment_date
                          )
                        "
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" class="my-n3">
                  <span class="text-caption red--text"
                    ><b>Note:</b>
                    <i>
                      You may not fill/encode this field if the Date of
                      Examination/Conferment (FROM) is the same as the Date of
                      Examination/Conferment (TO).
                    </i></span
                  >
                </v-col>
                <v-col cols="12" class="py-1">
                  <v-menu
                    ref="confermentDateTo"
                    :close-on-content-click="false"
                    :return-value.sync="csEligibilityModel.conferment_date_to"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        dense
                        v-model="csEligibilityModel.conferment_date_to"
                        chips
                        clearable
                        small-chips
                        label="Date of Examination/Conferment (TO)"
                        color="#6DB249"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      color="#6DB249"
                      v-model="csEligibilityModel.conferment_date_to"
                      :min="csEligibilityModel.conferment_date"
                      no-title
                      scrollable
                    >
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        color="#6DB249"
                        @click="
                          $refs.confermentDateTo.save(
                            csEligibilityModel.conferment_date_to
                          )
                        "
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>

                <v-col cols="12" class="py-1">
                  <v-text-field
                    v-model="csEligibilityModel.conferment_place"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="Place of Examination/Conferment"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" class="py-1">
                  <v-text-field
                    v-model="csEligibilityModel.license_num"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="License Number"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" class="py-1">
                  <v-checkbox
                    v-model="no_validity"
                    @change="NoValidity()"
                    dense
                    outlined
                    required
                    label="License Validity Non-expiring"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-checkbox>
                </v-col>

                <v-col cols="12" class="py-1" v-if="!no_validity">
                  <v-menu
                    ref="licenseValidity"
                    :close-on-content-click="false"
                    :return-value.sync="csEligibilityModel.validity"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        dense
                        v-model="csEligibilityModel.validity"
                        :rules="!no_validity ? [] : [formRules.required]"
                        chips
                        small-chips
                        color="#6DB249"
                        label="License Validity"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      color="#6DB249"
                      v-model="csEligibilityModel.validity"
                      no-title
                      scrollable
                    >
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        color="#6DB249"
                        @click="
                          $refs.licenseValidity.save(
                            csEligibilityModel.validity
                          )
                        "
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions v-if="action == 'Add'" class="pa-5">
            <v-spacer></v-spacer>
            <v-btn color="red" outlined @click="closeD()">
              <v-icon>mdi-close-circle-outline</v-icon>
              Cancel
            </v-btn>
            <v-btn
              :color="$vuetify.theme.themes.light.submitBtns"
              class="white--text"
              @click="addCSElig()"
            >
              <v-icon>mdi-check-circle</v-icon>
              Save Details
            </v-btn>
          </v-card-actions>

          <v-card-actions v-if="action == 'Update'" class="pa-5">
            <v-spacer></v-spacer>
            <v-btn color="red" outlined @click="dialog = false">
              <v-icon>mdi-close-circle-outline</v-icon>
              Cancel
            </v-btn>
            <v-btn
              :color="$vuetify.theme.themes.light.submitBtns"
              class="white--text"
              @click="updateCSElig()"
            >
              <v-icon>mdi-check-circle</v-icon>
              Update Details
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
      dialog: false,

      csEligibilityModel: {
        eligibility_type: null,
        rating: null,
        conferment_date: null,
        conferment_date_to: null,
        conferment_place: null,
        license_num: null,
        validity: null,
      },

      no_validity: null,

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
        this.$refs.CSEligFormref.resetValidation();

        this.csEligibilityModel = data;

        if (data.validity == "N/A") {
          this.no_validity = true;
        } else {
          this.no_validity = false;
        }
      },
      deep: true,
    },
  },
  methods: {
    closeD() {
      this.$refs.CSEligFormref.resetValidation();
      this.dialog = false;
    },
    NoValidity() {
      if (this.no_validity) {
        this.csEligibilityModel.validity = "N/A";
      } else {
        this.csEligibilityModel.validity = null;
      }
    },
    addCSElig() {
      if (this.$refs.CSEligFormref.validate()) {
        this.$emit("addCSElig", this.csEligibilityModel);
        this.closeD();
      }
    },
    updateCSElig() {
      if (this.$refs.CSEligFormref.validate()) {
        this.$emit("updateCSElig", this.csEligibilityModel);
        this.closeD();
      }
    },
  },
};
</script>
