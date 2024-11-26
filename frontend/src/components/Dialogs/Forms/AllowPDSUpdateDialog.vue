<template>
  <div>
    <v-dialog v-model="dialog" scrollable max-width="600px">
      <v-card>
        <v-card-title dark class="dialog-header">
          <span v-if="action == 'Add'"> Add New Date</span>
          <span v-if="action == 'Update'"> Update </span>
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
          <v-form ref="Formref">
            <v-container class="mt-2">
              <v-row>
                <v-col cols="12" class="py-0">
                  <v-text-field
                    v-model="allowUpdateModel.name"
                    dense
                    outlined
                    label="Name"
                    readonly
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>
                <v-col cols="6" class="py-0">
                  <v-menu
                    ref="AllowDateFrom"
                    :close-on-content-click="false"
                    :return-value.sync="allowUpdateModel.date_from"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        dense
                        v-model="allowUpdateModel.date_from"
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
                      v-model="allowUpdateModel.date_from"
                      no-title
                      color="#6DB249"
                      scrollable
                    >
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        color="#6DB249"
                        @click="
                          $refs.AllowDateFrom.save(allowUpdateModel.date_from)
                        "
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="6" class="py-0">
                  <v-menu
                    ref="AllowDateTo"
                    :close-on-content-click="false"
                    :return-value.sync="allowUpdateModel.date_to"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        dense
                        v-model="allowUpdateModel.date_to"
                        :rules="[formRules.required]"
                        chips
                        small-chips
                        color="#6DB249"
                        label="Date To"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="allowUpdateModel.date_to"
                      no-title
                      color="#6DB249"
                      scrollable
                    >
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        color="#6DB249"
                        @click="
                          $refs.AllowDateTo.save(allowUpdateModel.date_to)
                        "
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>

                <v-col cols="12" class="py-0">
                  <v-select
                    v-model="allowUpdateModel.allow_update"
                    dense
                    :items="status"
                    outlined
                    :rules="[formRules.required]"
                    label="Status"
                    required
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions v-if="action == 'Add'" class="pa-5">
          <v-spacer></v-spacer>
          <v-btn
            color="red"
            outlined
            @click="
              closeDialog();
              dialog = false;
            "
          >
            <v-icon>mdi-close-circle-outline</v-icon>
            Cancel
          </v-btn>
          <v-btn
            :color="$vuetify.theme.themes.light.submitBtns"
            class="white--text"
            @click="addUserType()"
          >
            <v-icon>mdi-check-circle</v-icon>
            Save Details
          </v-btn>
        </v-card-actions>

        <v-card-actions v-if="action == 'Update'" class="pa-5">
          <v-spacer></v-spacer>
          <v-btn
            color="red"
            outlined
            @click="
              closeDialog();
              dialog = false;
            "
          >
            <v-icon>mdi-close-circle-outline</v-icon>
            Cancel
          </v-btn>
          <v-btn
            :color="$vuetify.theme.themes.light.submitBtns"
            class="white--text"
            @click="updateUserType()"
          >
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
      status: ["Allowed", "Not allowed"],
      allowUpdateModel: {
        name: null,
        date_to: null,
        date_from: null,
        allow_update: null,
        userID: null,
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
        console.log(data);
        if (data.id) {
          this.allowUpdateModel.name = data.user.mname
            ? data.user.fname +
              " " +
              data.user.mname[0] +
              ". " +
              data.user.lname
            : data.user.fname + " " + data.user.lname;
          this.allowUpdateModel.date_to = data.date_to;
          this.allowUpdateModel.date_from = data.date_from;
          this.allowUpdateModel.userID = data.user.id;

          this.allowUpdateModel.allow_update =
            data.allow_update == 1 ? "Allowed" : "Not allowed";
        }
        this.dialog = true;
      },
      deep: true,
    },
  },
  methods: {
    close() {
      this.eventHub.$emit("closeAllowPDSUpdateDialog", false);
      this.dialog = false;
    },
    addUserType() {
      if (this.$refs.Formref.validate()) {
        this.allowUpdateModel.allow_update =
          this.allowUpdateModel.allow_update == "Active" ? true : false;
        // console.log(this.allowUpdateModel);
        let data = {
          allow_update: this.allowUpdateModel.allow_update,
          user_detailID: this.allowUpdateModel.userID,
          date_from: this.allowUpdateModel.date_from,
          date_to: this.allowUpdateModel.date_to,
        };

        this.axiosCall("/allow-pds-update", "POST", data).then((res) => {
          if (res.data.status == 201) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.message = res.data.msg;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message!";
            this.$refs.Formref.reset();
            this.closeDialog();
          } else {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.message = res.data.msg;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message!";
            this.$refs.Formref.reset();
            this.closeDialog();
          }
        });
      }
    },
    updateUserType() {
      if (this.$refs.Formref.validate()) {
        this.allowUpdateModel.allow_update =
          this.allowUpdateModel.allow_update == "Allowed" ? true : false;
        let data = {
          allow_update: this.allowUpdateModel.allow_update,
          user_detailID: this.allowUpdateModel.userID,
          date_from: this.allowUpdateModel.date_from,
          date_to: this.allowUpdateModel.date_to,
        };
        this.axiosCall("/allow-pds-update/" + this.data.id, "PATCH", data).then(
          (res) => {
            if (res.data.status == 200) {
              this.dialog = false;
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.message = res.data.msg;
              this.fadeAwayMessage.type = "success";
              this.fadeAwayMessage.header = "System Message!";
              this.$refs.Formref.reset();
              this.closeDialog();
            } else {
              this.dialog = false;
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.message = res.data.msg;
              this.fadeAwayMessage.type = "error";
              this.fadeAwayMessage.header = "System Message!";
              this.$refs.Formref.reset();
              this.closeDialog();
            }
          }
        );
      }
    },
  },
};
</script>
