<template>
  <div>
    <v-dialog v-model="dialog" scrollable max-width="600px">
      <v-card>
        <v-card-title dark class="dialog-header">
          <span v-if="action == 'Add'"> Add New Office</span>
          <span v-if="action == 'Update'">Update Office</span>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="close()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-col> </v-col>
        <v-card-text style="max-height: 700px">
          <v-form ref="OfficeFormref" @submit.prevent>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="officeModel.name"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="Office name"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    v-model="officeModel.office_underID"
                    dense
                    outlined
                    class="rounded-lg"
                    item-text="name"
                    item-value="id"
                    label="Office Under"
                    color="#93CB5B"
                    :items="officeList"
                  ></v-autocomplete>
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
          <v-btn color="#519043" class="white--text" @click="addOffice()">
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
          <v-btn color="#519043" class="white--text" @click="updateOffice()">
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
      officeModel: {
        name: null,
        office_underID: null,
      },
      officeList: [],

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
        // console.log(data);
        this.getOffices();
        if (data.id != null) {
          this.officeModel = data;
        } else {
          this.officeModel.name = null;
          this.officeModel.office_underID = null;
          this.$refs.OfficeFormref.reset();
        }
      },
      deep: true,
    },
  },
  methods: {
    close() {
      this.dialog = false;
      this.eventHub.$emit("closeOfficeDialog", false);
    },
    getOffices() {
      this.axiosCall("/offices", "GET").then((res) => {
        if (res) {
          this.officeList = res.data;
          this.loading = false;
        }
      });
    },

    addOffice() {
      if (this.$refs.OfficeFormref.validate()) {
        let data = {
          name: this.officeModel.name,
          office_underID: this.officeModel.office_underID,
        };
        this.axiosCall("/offices", "POST", data).then((res) => {
          if (res.data.status == 201) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.message = res.data.msg;
            this.fadeAwayMessage.header = "System Message";
            this.$refs.OfficeFormref.reset();
            this.close();
            // this.$emit("reloadTable");
          } else if (res.data.status == 400) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.$refs.OfficeFormref.reset();
            this.close();
            // this.$emit("reloadTable");
          }
        });
      }
    },
    updateOffice() {
      if (this.$refs.OfficeFormref.validate()) {
        let data = {
          name: this.officeModel.name,
          office_underID: this.officeModel.office_underID,
        };
        console.log(this.officeModel);
        this.axiosCall("/offices/" + this.data.id, "PATCH", data).then(
          (res) => {
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
              this.close();
            }
          }
        );
      }
    },
  },
};
</script>
