<template>
  <div>
    <v-dialog v-model="dialog" eager scrollable max-width="600px">
      <v-form ref="VolWorkFormref" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span v-if="action == 'Add'"> Add Work Involvement</span>
            <span v-if="action == 'Update'">Update Work Involvement</span>
            <v-spacer></v-spacer>
            <v-btn
              icon
              dark
              @click="
                closeDialog();
                dialog = false;
              "
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-col> </v-col>
          <v-card-text style="max-height: 700px">
            <v-container>
              <v-row>
                <v-col cols="12" class="py-0">
                  <v-text-field
                    v-model="volWorkModel.org_name"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    label="Name and Address of Organization"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="6" xl="6" lg="6" class="py-0">
                  <v-menu
                    ref="vworkDateFrom"
                    :close-on-content-click="false"
                    :return-value.sync="volWorkModel.date_from"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        dense
                        v-model="volWorkModel.date_from"
                        :rules="[formRules.required]"
                        chips
                        small-chips
                        color="#6DB249"
                        label="Date from"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="volWorkModel.date_from"
                      no-title
                      scrollable
                      color="#6DB249"
                    >
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        color="#6DB249"
                        @click="
                          $refs.vworkDateFrom.save(volWorkModel.date_from)
                        "
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="6" md="6" xl="6" lg="6" class="py-0">
                  <v-menu
                    ref="vworkDateTo"
                    :close-on-content-click="false"
                    :return-value.sync="volWorkModel.date_to"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        dense
                        v-model="volWorkModel.date_to"
                        :rules="[formRules.required]"
                        chips
                        small-chips
                        color="#6DB249"
                        label="Date to"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      color="#6DB249"
                      :min="
                        volWorkModel.date_from ? volWorkModel.date_from : ''
                      "
                      v-model="volWorkModel.date_to"
                      no-title
                      scrollable
                    >
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        color="#6DB249"
                        @click="$refs.vworkDateTo.save(volWorkModel.date_to)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>

                <v-col cols="12" class="py-0">
                  <v-text-field
                    v-model="volWorkModel.num_hours"
                    :rules="[]"
                    dense
                    outlined
                    label="Number of Hours"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" class="py-0">
                  <v-text-field
                    v-model="volWorkModel.position"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    label="Position / Nature of Work"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions v-if="action == 'Add'" class="pa-5">
            <v-spacer></v-spacer>
            <v-btn color="red" outlined @click="dialog = false">
              <v-icon>mdi-close-circle-outline</v-icon>
              Cancel
            </v-btn>
            <v-btn color="#519043" class="white--text" @click="addVolWork()">
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
            <v-btn color="#519043" class="white--text" @click="updateVolWork()">
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

      volWorkModel: {
        date_from: null,
        date_to: null,
        org_name: null,
        num_hours: null,
        position: null,
      },
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
        this.$refs.VolWorkFormref.resetValidation();

        this.volWorkModel = data;
      },
      deep: true,
    },
  },
  methods: {
    closeD() {
      //  this.$refs.VolWorkFormref.reset();
      this.dialog = false;
    },
    addVolWork() {
      if (this.$refs.VolWorkFormref.validate()) {
        this.$emit("addVolWork", this.volWorkModel);
        this.closeD();
      }
    },
    updateVolWork() {
      if (this.$refs.VolWorkFormref.validate()) {
        this.$emit("updateVolWork", this.volWorkModel);
        this.closeD();
      }
    },
  },
};
</script>
