<template>
  <div>
    <v-dialog v-model="dialog" scrollable max-width="600px">
      <v-card>
        <v-card-title dark class="dialog-header">
          <span v-if="action == 'Add'"> Add New OIC</span>
          <span v-if="action == 'Update'">Update OIC</span>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="close()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-col> </v-col>
        <v-card-text style="max-height: 700px">
          <v-form ref="OICFormref" @submit.prevent>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-autocomplete
                    v-model="oic_user"
                    dense
                    outlined
                    class="rounded-lg"
                    item-text="name"
                    item-value="id"
                    label="Name"
                    color="#93CB5B"
                    :items="oicList"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <v-menu
                    ref="oicDateFrom"
                    :close-on-content-click="false"
                    :return-value.sync="date_from"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        color="#6DB249"
                        dense
                        v-model="date_from"
                        :rules="[formRules.required]"
                        chips
                        small-chips
                        label="Date from"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="date_from"
                      :min="new Date().toISOString().substr(0, 10)"
                      no-title
                      scrollable
                      color="#6DB249"
                    >
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        color="#6DB249"
                        @click="$refs.oicDateFrom.save(date_from)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12">
                  <v-menu
                    ref="oicDateTo"
                    :close-on-content-click="false"
                    :return-value.sync="date_to"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        color="#6DB249"
                        dense
                        v-model="date_to"
                        :rules="[formRules.required]"
                        chips
                        small-chips
                        label="Date To"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      :min="date_from ? date_from : null"
                      v-model="date_to"
                      no-title
                      scrollable
                      color="#6DB249"
                    >
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        color="#6DB249"
                        @click="$refs.oicDateTo.save(date_to)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
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
          <v-btn color="#5a67da" class="white--text" @click="add()">
            <v-icon>mdi-check-circle</v-icon>
            Save
          </v-btn>
        </v-card-actions>

        <v-card-actions v-if="action == 'Update'" class="pa-5">
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="close()">
            <v-icon>mdi-close-circle-outline</v-icon>
            Cancel
          </v-btn>
          <v-btn color="#5a67da" class="white--text" @click="update()">
            <v-icon>mdi-check-circle</v-icon>
            Update
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
      id: null,
      oic_user: null,
      date_from: null,
      date_to: null,
      oicList: [],
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
        this.getToOIC();
        if (data.id) {
          this.id = data.id;
          this.oic_user = data.oic_user_detailID.toString();
          this.date_from = data.date_from;
          this.date_to = data.date_to;
          this.dialog = true;
        } else {
          this.id = null;
          this.dialog = true;
          this.$refs.OICFormref.reset();
        }
      },
      deep: true,
    },
  },
  methods: {
    close() {
      this.dialog = false;
      this.eventHub.$emit("closeOICDialog", false);
    },
    getToOIC() {
      this.axiosCall("/user-details/toOIC", "GET").then((res) => {
        if (res) {
          //oic
          let data = res.data;
          data.forEach((element, i) => {
            data[i].name = this.toTitleCase(element.name);
          });
          this.oicList = data;
        }
      });
    },

    add() {
      if (this.$refs.OICFormref.validate()) {
        let data = {
          oic_user_detailID: this.oic_user,
          date_from: this.date_from,
          date_to: this.date_to,
        };
        this.axiosCall("/my-oic", "POST", data).then((res) => {
          if (res.data.status == 201) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.message = res.data.msg;
            this.fadeAwayMessage.header = "System Message";
            this.$refs.OICFormref.reset();
            this.close();
            // this.$emit("reloadTable");
          } else if (res.data.status == 400) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
          }
        });
      }
    },
    update() {
      if (this.$refs.OICFormref.validate()) {
        let data = {
          oic_user_detailID: this.oic_user,
          date_from: this.date_from,
          date_to: this.date_to,
        };
        this.axiosCall("/my-oic/" + this.data.id, "PATCH", data).then((res) => {
          if (res.data.status == 200) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            // this.$refs.OfficeFormref.reset();
            this.close();
          } else if (res.data.status == 400) {
            this.dialog = false;
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
