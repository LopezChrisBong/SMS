<template>
  <div>
    <v-dialog v-model="dialog" scrollable max-width="600px">
      <v-card>
        <v-card-title dark class="dialog-header">
          <span v-if="action == 'Add'"> Add New Position</span>
          <span v-if="action == 'Update'">Update Position</span>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="close()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-col> </v-col>
        <v-card-text style="max-height: 700px">
          <v-form ref="PositionFormref" @submit.prevent>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="posModel.description"
                    :rules="[formRules.required]"
                    dense
                    label="Position"
                    outlined
                    required
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    outlined
                    dense
                    :rules="[formRules.required]"
                    label="Type"
                    v-model="posModel.is_teaching"
                    :items="personnel_type"
                    item-text="type"
                    item-value="id"
                    required
                    class="rounded-lg"
                    color="#6DB249"
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
          <v-btn color="#519043" class="white--text" @click="addPosition()">
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
          <v-btn color="#519043" class="white--text" @click="updatePosition()">
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
      posModel: {
        id: null,
        description: null,
        is_teaching: null,
      },
      selected_personnel_type: null,
      personnel_type: [
        { id: 1, type: "Teaching" },
        { id: 2, type: "Non-Teaching" },
      ],
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
          this.posModel.id = data.id;
          this.posModel.description = data.description;
          this.posModel.is_teaching = data.is_teaching ? 1 : 2;
        } else {
          this.$refs.PositionFormref.reset();
        }
      },
      deep: true,
    },
  },
  methods: {
    close() {
      this.eventHub.$emit("closePositionDialog", false);
      this.dialog = false;
    },
    addPosition() {
      if (this.$refs.PositionFormref.validate()) {
        let data = {
          description: this.posModel.description,
          is_teaching: this.posModel.is_teaching == 1 ? true : false,
        };

        this.axiosCall("/positions", "POST", data).then((res) => {
          if (res.data.status == 201) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.message = res.data.msg;
            this.fadeAwayMessage.header = "System Message";
            this.$refs.PositionFormref.reset();
            this.close();
          } else if (res.data.status == 400) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.$refs.PositionFormref.reset();
            this.close();
          }
        });
      }
    },
    updatePosition() {
      if (this.$refs.PositionFormref.validate()) {
        let data = {
          description: this.posModel.description,
          is_teaching: this.posModel.is_teaching == 1 ? true : false,
        };

        this.axiosCall("/positions/" + this.posModel.id, "PATCH", data).then(
          (res) => {
            if (res.data.status == 200) {
              this.dialog = false;
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "success";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
              this.$refs.PositionFormref.reset();
              this.close();
            } else if (res.data.status == 400) {
              this.dialog = false;
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "error";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
              this.$refs.PositionFormref.reset();
              this.close();
            }
          }
        );
      }
    },
  },
};
</script>
