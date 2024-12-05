<template>
  <div>
    <v-dialog v-model="dialog" scrollable max-width="600px">
      <v-card>
        <v-card-title dark class="dialog-header">
          <span v-if="action == 'Add'"> Add New Institute</span>
          <span v-if="action == 'Update'">Update Insitute</span>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="close()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-col> </v-col>
        <v-card-text style="max-height: 700px">
          <v-form ref="InstituteFormref" @submit.prevent>
            <v-container>
              <v-row class="mt-4">
                <v-col cols="12" class="py-0">
                  <v-text-field
                    v-model="instModel.name"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="Name"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="py-0">
                  <v-text-field
                    v-model="instModel.abbr"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    label="Abbreviation"
                    required
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
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
      instModel: {
        id: null,
        name: null,
        abbr: null,
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
        if (data.id != null) {
          this.instModel.id = data.id;
          this.instModel.name = data.name;
          this.instModel.abbr = data.abbr;
        } else {
          this.$refs.InstituteFormref.reset();
        }
      },
      deep: true,
    },
  },
  methods: {
    close() {
      this.eventHub.$emit("closeInstitutesDialog", false);
      this.dialog = false;
    },
    add() {
      if (this.$refs.InstituteFormref.validate()) {
        this.axiosCall("/institutes", "POST", this.instModel).then((res) => {
          if (res.data.status == 201) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.message = res.data.msg;
            this.fadeAwayMessage.header = "System Message";
            this.$refs.InstituteFormref.reset();
            this.close();
          } else if (res.data.status == 400) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.$refs.InstituteFormref.reset();
            this.close();
          }
        });
      }
    },
    update() {
      if (this.$refs.InstituteFormref.validate()) {
        let data = {
          abbr: this.instModel.abbr,
          name: this.instModel.name,
        };
        this.axiosCall("/institutes/" + this.instModel.id, "PATCH", data).then(
          (res) => {
            if (res.data.status == 200) {
              this.dialog = false;
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "success";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
              this.$refs.InstituteFormref.reset();
              this.close();
            } else if (res.data.status == 400) {
              this.dialog = false;
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "error";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
              this.$refs.InstituteFormref.reset();
              this.close();
            }
          }
        );
      }
    },
  },
};
</script>
