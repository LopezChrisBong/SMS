<template>
  <div>
    <v-dialog v-model="dialog" eager scrollable max-width="600px">
      <v-form ref="LNDFormref" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span v-if="action == 'Add'"> Add L & D Intervention</span>
            <span v-if="action == 'Update'">Update L & D Intervention</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-col> </v-col>
          <v-card-text style="max-height: 700px" class="my-4">
            <v-container>
              <v-row>
                <v-col cols="12" class="py-0">
                  <v-text-field
                    v-model="title"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    label="Title of LND Intervention / Training Program"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-menu
                    ref="lndDateFrom"
                    :close-on-content-click="false"
                    :return-value.sync="date_from"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        dense
                        v-model="date_from"
                        :rules="[formRules.required]"
                        chips
                        small-chips
                        label="Date from"
                        color="#6DB249"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      color="#6DB249"
                      v-model="date_from"
                      no-title
                      scrollable
                    >
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        color="#6DB249"
                        @click="$refs.lndDateFrom.save(date_from)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12">
                  <v-menu
                    ref="lndDateTo"
                    :close-on-content-click="false"
                    :return-value.sync="date_to"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        dense
                        v-model="date_to"
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
                      :min="date_from ? date_from : ''"
                      color="#6DB249"
                      v-model="date_to"
                      no-title
                      scrollable
                    >
                      <v-spacer></v-spacer>
                      <v-btn
                        text
                        color="#6DB249"
                        @click="$refs.lndDateTo.save(date_to)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>

                <!-- <v-col cols="12">
                  <v-btn small outlined color="#6DB249" @click="add_date()"
                    >Add date</v-btn
                  >
                </v-col> -->
                <!-- <v-col cols="12" class="pt-0">
                  <div
                    class="d-flex justify-space-between mt-3"
                    v-for="(item, i) in inclusiveDate"
                    :key="i"
                  >
                    <div class="px-2 py-1 text-subtitle-1 box">
                      {{ formatDate(item.date_from) }}
                    </div>
                    <div class="px-2 py-1 text-subtitle-1 box">
                      {{ formatDate(item.date_to) }}
                    </div>
                    <v-btn @click="remove(i)" icon small color="#6DB249"
                      ><v-icon>mdi-minus-circle-outline</v-icon></v-btn
                    >
                  </div>
                </v-col> -->

                <v-col cols="12" class="py-0 mt-2">
                  <v-text-field
                    v-model="num_hours"
                    :rules="[formRules.numberRequired]"
                    dense
                    outlined
                    label="Number of Hours"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" class="py-0">
                  <v-text-field
                    v-model="type"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    label="Type of LD"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" class="py-0">
                  <v-text-field
                    v-model="conducted_by"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    label="Conducted by"
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
            <v-btn color="#5a67da" class="white--text" @click="addLND()">
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
            <v-btn color="#5a67da" class="white--text" @click="updateMyLND()">
              <v-icon>mdi-check-circle</v-icon>
              Update Details
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <v-dialog
      v-model="addDatesDialog"
      transition="dialog-bottom-transition"
      max-width="400px"
    >
      <v-card>
        <v-card-title dark class="dialog-header">
          <span>{{ inner_action }} Date Randge</span>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="addDatesDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="mt-4">
          <v-form @submit.prevent ref="AddDatesFormRef">
            <v-row>
              <v-col cols="12">
                <v-menu
                  ref="lndDateFrom"
                  :close-on-content-click="false"
                  :return-value.sync="date_from"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      outlined
                      dense
                      v-model="date_from"
                      :rules="[formRules.required]"
                      chips
                      small-chips
                      label="Date from"
                      color="#6DB249"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    color="#6DB249"
                    v-model="date_from"
                    no-title
                    scrollable
                  >
                    <v-spacer></v-spacer>

                    <v-btn
                      text
                      color="#6DB249"
                      @click="$refs.lndDateFrom.save(date_from)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12">
                <v-menu
                  ref="lndDateTo"
                  :close-on-content-click="false"
                  :return-value.sync="date_to"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      outlined
                      dense
                      v-model="date_to"
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
                    :min="date_from ? date_from : ''"
                    color="#6DB249"
                    v-model="date_to"
                    no-title
                    scrollable
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="#6DB249"
                      @click="$refs.lndDateTo.save(date_to)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn outlined color="red" @click="addDatesDialog = false"
            >Close</v-btn
          >
          <v-btn outlined color="#6DB249" @click="saveInclusiveDates()"
            >Save</v-btn
          >
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
      addDatesDialog: false,

      title: null,
      num_hours: null,
      type: null,
      conducted_by: null,

      inclusiveDate: [],
      date_from: null,
      date_to: null,
      inner_action: null,
      indexTOUpdate: null,
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
        this.$refs.LNDFormref.resetValidation();

        // this.lndModel = data;
        this.title = data.title;
        this.num_hours = data.num_hours;
        this.type = data.type;
        this.conducted_by = data.conducted_by;
        this.date_from = data.date_from;
        this.date_to = data.date_to;
        // this.inclusiveDate = data.inclusiveDate ? data.inclusiveDate : [];
      },
      deep: true,
    },
  },
  methods: {
    add_date() {
      this.addDatesDialog = true;
    },
    saveInclusiveDates() {
      if (this.$refs.AddDatesFormRef.validate()) {
        this.inclusiveDate.push({
          date_from: this.date_from,
          date_to: this.date_to,
        });
        console.log(this.inclusiveDate);
        this.$refs.AddDatesFormRef.reset();
        this.$refs.AddDatesFormRef.resetValidation();
        this.addDatesDialog = false;
      }
    },
    remove(index) {
      this.inclusiveDate.splice(index, 1);
    },
    closeD() {
      this.dialog = false;
    },
    addLND() {
      if (this.$refs.LNDFormref.validate()) {
        // if (this.inclusiveDate.length > 0) {
        let data = {
          title: this.title,
          num_hours: this.num_hours,
          date_from: this.date_from,
          date_to: this.date_to,
          type: this.type,
          conducted_by: this.conducted_by,
          // inclusiveDate: this.inclusiveDate,
        };
        this.$emit("addLND", data);
        this.closeD();
        // }
      } else {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message = "Please fill in all required fields!";
      }
    },
    updateMyLND() {
      if (this.$refs.LNDFormref.validate()) {
        // if (this.inclusiveDate.length > 0) {
        let data = {
          title: this.title,
          num_hours: this.num_hours,
          type: this.type,
          conducted_by: this.conducted_by,
          date_from: this.date_from,
          date_to: this.date_to,
          // inclusiveDate: this.inclusiveDate,
        };
        this.$emit("updateLND", data);
        // } else {
        //   this.fadeAwayMessage.show = true;
        //   this.fadeAwayMessage.type = "error";
        //   this.fadeAwayMessage.header = "System Message";
        //   this.fadeAwayMessage.message = "No date/s added!";
        // }
        this.closeD();
        setTimeout(() => {
          this.closeD();
        }, 100);
      } else {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message = "Please fill in all required fields!";
      }
    },
  },
};
</script>

<style scoped>
.box {
  border: 1px solid grey;
  border-radius: 5px;
  width: 45%;
}
</style>
