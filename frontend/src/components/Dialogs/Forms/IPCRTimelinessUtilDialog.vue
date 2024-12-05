<template>
  <div>
    <v-dialog v-model="dialog" scrollable max-width="600px">
      <v-card>
        <v-card-title dark class="dialog-header">
          <span v-if="action == 'Add'"> Add New IPCR Timeliness</span>
          <span v-if="action == 'Update'">Update IPCR Timeliness</span>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="close()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-col> </v-col>
        <v-card-text style="max-height: 700px">
          <v-form ref="IPCRTlyFormref" @submit.prevent>
            <v-container>
              <v-row class="mt-4">
                <v-col cols="12" class="my-0 ">
                  <div
                    class="pa-4 text-center rounded-lg"
                    style="border: 1px solid gray; border-radius: 20%;"
                  >
                    <h3 class="red--text">Note: <i>Add Prefix Number</i></h3>
                    <v-radio-group v-model="prefix" row>
                      <v-radio label="Yes" value="true"></v-radio>
                      <v-radio label="No" value="false"></v-radio>
                    </v-radio-group>
                  </div>
                </v-col>
                <v-col cols="12" class="py-0">
                  <v-textarea
                    v-model="description"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="Description"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-textarea>
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
            Save Details
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
      prefix: "false",
      id: null,
      description: null,

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
        if (data.id != null) {
          this.id = data.id;
          this.description = data.description;
          this.prefix = data.toAddNumber == 0 ? "false" : "true";
        } else {
          this.$refs.IPCRTlyFormref.reset();
        }
      },
      deep: true,
    },
  },
  methods: {
    close() {
      this.eventHub.$emit("closeIPCRTimelinessUtilDialog", false);
      this.dialog = false;
    },
    add() {
      if (this.$refs.IPCRTlyFormref.validate()) {
        let toAddNumber = this.prefix == "true" ? 1 : 0;
        let data = {
          toAddNumber: toAddNumber,
          description: this.description,
        };
        this.axiosCall("/ipcr-timeliness-util", "POST", data).then((res) => {
          if (res.data.status == 201) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.message = res.data.msg;
            this.fadeAwayMessage.header = "System Message";
            this.$refs.IPCRTlyFormref.reset();
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
    update() {
      if (this.$refs.IPCRTlyFormref.validate()) {
        let toAddNumber = this.prefix == "true" ? 1 : 0;
        let data = {
          description: this.description,
          toAddNumber: toAddNumber,
        };
        this.axiosCall("/ipcr-timeliness-util/" + this.id, "PATCH", data).then(
          (res) => {
            if (res.data.status == 200) {
              this.dialog = false;
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "success";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
              this.$refs.IPCRTlyFormref.reset();
              this.close();
            } else if (res.data.status == 400) {
              this.dialog = false;
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
