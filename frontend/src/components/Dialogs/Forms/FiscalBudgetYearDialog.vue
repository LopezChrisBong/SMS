<template>
  <div>
    <v-dialog v-model="dialog" scrollable max-width="600px" persistent>
      <v-card>
        <v-card-title dark class="dialog-header">
          <span>{{ action }} Salary Grade Guide</span>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="close()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-col> </v-col>
        <v-card-text style="max-height: 700px">
          <v-form ref="FYFormref" @submit.prevent>
            <v-container>
              <v-row class="mt-4">
                <v-col cols="12">
                  <v-text-field
                    outlined
                    dense
                    v-model="fyModel.title"
                    :rules="[formRules.required]"
                    chips
                    color="#6DB249"
                    small-chips
                    label="Description"
                  >
                  </v-text-field>
                </v-col>

                <!-- <v-text-field
                    outlined
                    dense
                    v-model="fyModel.fy_from"
                    :rules="[formRules.required]"
                    chips
                    color="#6DB249"
                    small-chips
                    label="Date"
                  >
                  </v-text-field> -->
                <v-col cols="12">
                  <v-menu
                    ref="dateFromRef"
                    :close-on-content-click="false"
                    :return-value.sync="fyModel.fy_from"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        color="#6DB249"
                        dense
                        v-model="fyModel.fy_from"
                        :rules="[formRules.required]"
                        chips
                        small-chips
                        label="Date (From)"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="fyModel.fy_from"
                      no-title
                      scrollable
                      color="#6DB249"
                    >
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        color="#6DB249"
                        @click="$refs.dateFromRef.save(fyModel.fy_from)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>

                <v-col cols="12">
                  <!-- <v-text-field
                    outlined
                    dense
                    v-model="fyModel.fy_to"
                    :rules="[formRules.required, formRules.isValidFiscalYear]"
                    chips
                    color="#6DB249"
                    small-chips
                    label="FY (from) (year only)"
                  >
                  </v-text-field> -->
                  <v-menu
                    ref="dateToRef"
                    :close-on-content-click="false"
                    :return-value.sync="fyModel.fy_to"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        color="#6DB249"
                        dense
                        v-model="fyModel.fy_to"
                        :rules="[formRules.required]"
                        chips
                        small-chips
                        label="Date (To)"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="fyModel.fy_to"
                      no-title
                      :min="fyModel.fy_from"
                      scrollable
                      color="#6DB249"
                    >
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        color="#6DB249"
                        @click="$refs.dateToRef.save(fyModel.fy_to)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>

                <!-- <v-col cols="12" v-if="action == 'Update'">
                  <v-select
                    v-model="fyModel.status"
                    :items="statusList"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="Status"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-select>
                </v-col> -->
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions v-if="action == 'Add'" class="pa-5">
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="close()">
            <v-icon>mdi-close-circle-outline</v-icon>
            Cancel
          </v-btn>
          <v-btn color="#519043" class="white--text" @click="add()">
            <v-icon>mdi-check-circle</v-icon>
            Save Details
          </v-btn>
        </v-card-actions>

        <v-card-actions v-if="action == 'Update'" class="pa-5">
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="close()">
            <v-icon>mdi-close-circle-outline</v-icon>
            Cancel
          </v-btn>
          <v-btn color="#519043" class="white--text" @click="update()">
            <v-icon>mdi-check-circle</v-icon>
            Update Details
          </v-btn>
        </v-card-actions>
      </v-card>
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
      fyModel: {
        title: null,
        fy_from: null,
        fy_to: null,
        status: null,
      },

      statusList: ["Active", "Inactive"],
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
        if (data) {
          this.dialog = true;
          if (data.id) {
            this.fyModel.title = data.title;
            this.fyModel.fy_from = data.fy_from;
            this.fyModel.fy_to = data.fy_to;
            // this.fyModel.status = data.status == 1 ? "Active" : "Inactive";
            // this.fyModel.status = data.status == 1 ? "Active" : "Inactive";
          } else {
            this.fyModel.title = null;
            this.fyModel.fy_from = null;
            this.fyModel.fy_to = null;
          }
          this.$refs.FYFormref.resetValidation();
        }
      },
      deep: true,
    },
  },
  methods: {
    close() {
      this.dialog = false;
      this.eventHub.$emit("closeFiscalBudgetYearDialog", false);
    },
    add() {
      if (this.$refs.FYFormref.validate()) {
        // this.fyModel.status = false;

        this.axiosCall("/salary-fy-guide", "POST", this.fyModel).then((res) => {
          if (res.data.status == 201) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.message = res.data.msg;
            this.fadeAwayMessage.header = "System Message";
            this.$refs.FYFormref.reset();
            this.close();
          } else if (res.data.status == 400) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            // this.$refs.FYFormref.reset();
            // this.close();
          }
        });
      }
    },
    update() {
      if (this.$refs.FYFormref.validate()) {
        // this.fyModel.status = this.fyModel.status == "Active" ? true : false;

        this.axiosCall(
          "/salary-fy-guide/" + this.data.id,
          "PATCH",
          this.fyModel
        ).then((res) => {
          if (res.data.status == 200) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.message = res.data.msg;
            this.fadeAwayMessage.header = "System Message";
            // this.$refs.FYFormref.reset();
            this.close();
          } else if (res.data.status == 400) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            // this.$refs.FYFormref.reset();
            // this.close();
          }
        });
      }
    },
  },
};
</script>
