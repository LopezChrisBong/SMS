<template>
  <div>
    <v-dialog v-model="dialog" scrollable persistent max-width="600px">
      <v-card>
        <v-card-title dark class="dialog-header">
          <span v-if="action == 'Add'"> Add Schedule</span>
          <span v-if="action == 'Update'">Update Schedule</span>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="close()">
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
                    v-model="scheduleUpdateModel.purpose"
                    dense
                    outlined
                    label="Purpose"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>
                <v-col cols="6" class="py-0">
                  <v-menu
                    ref="AllowDateFrom"
                    :close-on-content-click="false"
                    :return-value.sync="scheduleUpdateModel.date_from"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        dense
                        v-model="scheduleUpdateModel.date_from"
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
                      v-model="scheduleUpdateModel.date_from"
                      no-title
                      color="#6DB249"
                      scrollable
                    >
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        color="#6DB249"
                        @click="
                          $refs.AllowDateFrom.save(
                            scheduleUpdateModel.date_from
                          )
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
                    :return-value.sync="scheduleUpdateModel.date_to"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        dense
                        v-model="scheduleUpdateModel.date_to"
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
                      v-model="scheduleUpdateModel.date_to"
                      no-title
                      color="#6DB249"
                      scrollable
                    >
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        color="#6DB249"
                        @click="
                          $refs.AllowDateTo.save(scheduleUpdateModel.date_to)
                        "
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>

                <v-col cols="12" class="py-0">
                  <v-switch
                    @change="selectAllEmp"
                    v-model="isSelectAll"
                    label="Select All Employees"
                  ></v-switch>
                  <v-autocomplete
                    outlined
                    dense
                    :rules="[formRules.required]"
                    label="Employee/s"
                    v-model="selectedUser"
                    :items="users"
                    item-text="name"
                    item-value="id"
                    required
                    class="rounded-lg"
                    color="#6DB249"
                    deletable-chips
                    multiple
                    small-chips
                  ></v-autocomplete>
                </v-col>
                <!-- <v-col cols="12" class="py-0">
                  <v-select
                    dense
                    :items="status"
                    outlined
                    :rules="[formRules.required]"
                    label="Status"
                    required
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
          <v-btn
            color="red"
            outlined
            @click="
              close();
              dialog = false;
            "
          >
            <v-icon>mdi-close-circle-outline</v-icon>
            Cancel
          </v-btn>
          <v-btn
            :loading="isLoading"
            :disabled="isLoading"
            color="#519043"
            class="white--text"
            @click="addSchedule()"
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
              close();
              dialog = false;
            "
          >
            <v-icon>mdi-close-circle-outline</v-icon>
            Cancel
          </v-btn>
          <v-btn
            :loading="isLoading"
            :disabled="isLoading"
            color="#519043"
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
      isLoading: false,
      status: ["Allowed", "Not allowed"],
      isSelectAll: null,
      scheduleUpdateModel: {
        id: null,
        name: null,
        date_to: null,
        date_from: null,
        purpose: null,
        userID: null,
      },
      selectedUser: [],
      users: [],
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
        this.getUsers();
        if (data.id) {
          this.scheduleUpdateModel.id = data.id;
          this.scheduleUpdateModel.purpose = data.purpose;
          this.scheduleUpdateModel.date_to = data.date_to;
          this.scheduleUpdateModel.date_from = data.date_from;
          this.selectedUser = JSON.parse(data.user_detailID);

          //   this.allowUpdateModel.allow_update =
          //     data.allow_update == 1 ? "Allowed" : "Not allowed";
        } else {
          this.selectedUser = [];
          this.scheduleUpdateModel.id = null;
          this.scheduleUpdateModel.purpose = null;
          this.scheduleUpdateModel.date_to = null;
          this.scheduleUpdateModel.date_from = null;
          this.isSelectAll = null;
        }
        this.dialog = true;
      },
      deep: true,
    },
    selectedUser: {
      handler(data) {
        if (this.users.length != 0) {
          if (data.length == this.users.length) {
            this.isSelectAll = true;
          } else {
            this.isSelectAll = false;
          }
        } else {
          this.isSelectAll = false;
        }
      },
      deep: true,
    },
  },
  methods: {
    close() {
      this.eventHub.$emit("closeSchedulePDSUpdateDialog", false);
      this.dialog = false;
    },

    selectAllEmp() {
      if (this.isSelectAll == true) {
        this.selectedUser = [];
        for (let i = 0; i < this.users.length; i++) {
          this.selectedUser.push(this.users[i].id);
        }
      } else {
        this.selectedUser = [];
      }
    },

    getUsers() {
      this.axiosCall("/user-details/getAllUserDetail", "GET").then((res) => {
        this.users = res.data;
      });
    },
    addSchedule() {
      this.isLoading = true;
      if (this.$refs.Formref.validate()) {
        let data = {
          purpose: this.scheduleUpdateModel.purpose,
          selectedUser: this.selectedUser,
          date_from: this.scheduleUpdateModel.date_from,
          date_to: this.scheduleUpdateModel.date_to,
        };

        this.axiosCall("/allow-pds-update/createSched", "POST", data).then(
          (res) => {
            if (res.data.status == 201) {
              this.isLoading = false;
              this.dialog = false;
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.message = res.data.msg;
              this.fadeAwayMessage.type = "success";
              this.fadeAwayMessage.header = "System Message!";
              this.$refs.Formref.reset();
              this.close();
            } else {
              this.isLoading = false;
              this.dialog = false;
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.message = res.data.msg;
              this.fadeAwayMessage.type = "error";
              this.fadeAwayMessage.header = "System Message!";
              this.$refs.Formref.reset();
              this.close();
            }
          }
        );
      }
    },
    updateUserType() {
      this.isLoading = true;
      if (this.$refs.Formref.validate()) {
        // this.allowUpdateModel.allow_update =
        //   this.allowUpdateModel.allow_update == "Allowed" ? true : false;
        // let data = {
        //   allow_update: this.allowUpdateModel.allow_update,
        //   user_detailID: this.allowUpdateModel.userID,
        //   date_from: this.allowUpdateModel.date_from,
        //   date_to: this.allowUpdateModel.date_to,
        // };
        let data = {
          purpose: this.scheduleUpdateModel.purpose,
          selectedUser: this.selectedUser,
          date_from: this.scheduleUpdateModel.date_from,
          date_to: this.scheduleUpdateModel.date_to,
        };

        this.axiosCall(
          "/allow-pds-update/" + this.scheduleUpdateModel.id,
          "PATCH",
          data
        ).then((res) => {
          if (res.data.status == 200) {
            this.isLoading = false;
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.message = res.data.msg;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message!";
            this.$refs.Formref.reset();
            this.close();
          } else {
            this.dialog = false;
            this.isLoading = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.message = res.data.msg;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message!";
            this.$refs.Formref.reset();
            this.close();
          }
        });
      }
    },
  },
};
</script>

<style scoped>
.v-select__selection,
.v-select__selection--comma,
.v-select.v-text-field input {
  color: red !important;
}
</style>
