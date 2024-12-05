<template>
  <div>
    <v-dialog v-model="dialog" scrollable max-width="700px">
      <v-card>
        <v-card-title dark class="dialog-header">
          Approve
          <v-spacer></v-spacer>
          <v-btn icon dark @click="close()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-col> </v-col>
        <v-card-text style="max-height: 800px">
          <v-form ref="MyLocatorSlipFormref" @submit.prevent>
            <v-container>
              <v-row>
                <v-col cols="4" class="mb-2">
                  <v-checkbox
                    v-model="locatorModel.type"
                    label="PERSONAL"
                    color="#6DB249"
                    readonly
                    :value="1"
                    :checked="locatorModel.type == 1 ? true : false"
                  ></v-checkbox>
                </v-col>
                <v-col cols="4" class="mb-2">
                  <v-checkbox
                    v-model="locatorModel.type"
                    label="OFFICIAL TIME"
                    color="#6DB249"
                    readonly
                    :value="2"
                    :checked="locatorModel.type == 2 ? true : false"
                  ></v-checkbox>
                </v-col>
                <v-col cols="4" class="mb-2">
                  <v-checkbox
                    v-model="locatorModel.type"
                    label="OFFICIAL BUSINESS"
                    readonly
                    color="#6DB249"
                    :value="3"
                    :checked="locatorModel.type == 3 ? true : false"
                  ></v-checkbox>
                </v-col>
                <v-col cols="12" class="py-0">
                  <v-text-field
                    v-model="locatorModel.destination"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="Destination"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="py-0">
                  <v-textarea
                    v-model="locatorModel.purpose"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="Purpose(s)"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-textarea>
                </v-col>
                <v-col cols="12" class="py-0">
                  <v-menu
                    ref="inclusiveDateMenu"
                    :close-on-content-click="false"
                    :return-value.sync="locatorModel.date"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        color="#6DB249"
                        dense
                        v-model="locatorModel.date"
                        :rules="[formRules.required]"
                        chips
                        small-chips
                        label="Inclusive Date"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="locatorModel.date"
                      no-title
                      scrollable
                      readonly
                      color="#6DB249"
                    >
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        color="#6DB249"
                        @click="$refs.inclusiveDateMenu.save(locatorModel.date)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <!-- <v-col cols="6" class="py-0">
                  <v-text-field
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="Out"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>
                <v-col cols="6" class="py-0">
                  <v-text-field
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="In"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col> -->
                <v-col cols="12" class="py-0">
                  <v-text-field
                    v-model="locatorModel.requestedBy"
                    dense
                    outlined
                    readonly
                    required
                    label="Requested By"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="py-0">
                  <v-text-field
                    v-model="locatorModel.recommendingApproval"
                    dense
                    readonly
                    outlined
                    required
                    label="Recommending Approval"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>
                <!-- <v-col cols="12" class="py-0">
                  <v-text-field
                    v-model="locatorModel.approvedBy"
                    readonly
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="Approved"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col> -->
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-5">
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="close()">
            <v-icon>mdi-close-circle-outline</v-icon>
            Cancel
          </v-btn>
          <v-btn color="#5a67da" class="white--text" @click="approve()">
            <v-icon>mdi-check-circle</v-icon>
            Approve
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
      locatorModel: {
        id: null,
        name: null,
        position: null,
        purpose: null,
        date: null,
        out: null,
        in: null,
        requestedBy: null,
        recommendingApproval: null,
        approvedBy: null,
        approvedByID: null,
        type: null,
      },
      selected: 1,
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
          console.log(data);
          this.dialog = true;
          if (data.id != null) {
            this.locatorModel.id = data.id;
            this.locatorModel.purpose = data.purpose;
            this.locatorModel.destination = data.destination;
            this.locatorModel.date = data.inclusive_date;
            this.locatorModel.requestedBy = data.requestedBy;
            this.locatorModel.recommendingApproval = data.recommending_approval;
            this.locatorModel.type = data.locator_type;
            this.selected = data.locator_type;
          }
          //   this.getDirectHead();
        }
      },
      deep: true,
    },
  },
  methods: {
    close() {
      this.dialog = false;
      this.$refs.MyLocatorSlipFormref.reset();
      this.eventHub.$emit("closeLocatorsLogDialog", false);
    },
    getDirectHead() {
      this.axiosCall("/my-direct-head/getMyDirectHead", "GET").then((res) => {
        if (res.data) {
          this.locatorModel.approvedBy = res.data[0].name;
          this.locatorModel.approvedByID = res.data[0].userID;
        }
      });
    },

    approve() {
      if (this.$refs.MyLocatorSlipFormref.validate()) {
        let data = {
          id: this.locatorModel.id,
        };
        this.axiosCall("/my-locator-slip/approve-locator", "POST", data).then(
          (res) => {
            if (res.data.status == 200) {
              this.dialog = false;
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "success";
              this.fadeAwayMessage.message = res.data.msg;
              this.fadeAwayMessage.header = "System Message";
              this.close();
              // this.$emit("reloadTable");
            } else if (res.data.status == 400) {
              this.dialog = false;
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "error";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
              this.close();
              // this.$emit("reloadTable");
            }
          }
        );
      }
    },
  },
};
</script>
