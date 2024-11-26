<template>
  <div>
    <v-dialog v-model="dialog" scrollable max-width="600px">
      <v-card>
        <v-card-title dark class="dialog-header">
          <span v-if="action == 'Add'"> Add New Employee Type</span>
          <span v-if="action == 'Update'">Update Employee Type</span>
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
        <v-card-text style="max-height: 700px" class="my-4">
          <v-form ref="Formref" @submit.prevent>
            <v-container>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="employeeTypeModel.description"
                    :rules="[formRules.required]"
                    dense
                    outlined
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
          <v-btn color="#519043" class="white--text" @click="addUserType()">
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
          <v-btn color="#519043" class="white--text" @click="updateUserType()">
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
      employeeTypeModel: {
        description: null,
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
        if (data) {
          this.dialog = true;
          if (data.id != null) {
            this.employeeTypeModel = data;
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    addUserType() {
      if (this.$refs.Formref.validate()) {
        this.axiosCall(
          "/employment-status",
          "POST",
          this.employeeTypeModel
        ).then((res) => {
          if (res.data.status == 201) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.message = res.data.msg;
            this.fadeAwayMessage.header = "System Message";
            this.$refs.Formref.reset();
            this.$emit("reloadTable");
          } else if (res.data.status == 400) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.$refs.Formref.reset();
            this.$emit("reloadTable");
          }
        });
      }
    },
    updateUserType() {
      if (this.$refs.Formref.validate()) {
        this.axiosCall(
          "/employment-status/" + this.data.id,
          "PATCH",
          this.employeeTypeModel
        ).then((res) => {
          if (res.data.status == 200) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.$emit("reloadTable");
          } else if (res.data.status == 400) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.$refs.Formref.reset();
            this.$emit("reloadTable");
          }
        });
      }
    },
  },
};
</script>