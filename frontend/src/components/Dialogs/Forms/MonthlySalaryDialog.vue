<template>
  <div>
    <v-dialog v-model="dialog" scrollable max-width="600px" persistent>
      <v-card>
        <v-card-title dark class="dialog-header">
          <span>Update Salary Step {{ salaryData.stepId }}</span>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="close()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-col> </v-col>
        <v-card-text style="max-height: 700px">
          <v-form ref="MonthlySalaryFormref" @submit.prevent>
            <v-container>
              <v-row class="mt-4">
                <v-col cols="12" class="py-0">
                  <v-text-field
                    v-model="salaryData.monthly_salary"
                    :rules="[
                      formRules.numberRequired,
                      formRules.noNegativeNumberAllowed,
                    ]"
                    dense
                    outlined
                    required
                    label="Monthly Salary"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-5">
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="close()">
            <v-icon>mdi-close-circle-outline</v-icon>
            Cancel
          </v-btn>
          <v-btn color="#519043" class="white--text" @click="add()">
            <v-icon>mdi-check-circle</v-icon>
            Save Details
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
      salaryData: {
        id: null,
        monthly_salary: null,
        sgId: null,
      },
      monthly_sal: null,
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
        // this.$refs.MonthlySalaryFormref.resetValidation();
        if (data) {
          this.dialog = true;

          this.salaryData = data;
          //   this.monthly_sal = data.monthly_salary;
        }
      },
      deep: true,
    },
  },
  methods: {
    close() {
      this.eventHub.$emit("closeMonthlySalaryDialog", true);

      this.dialog = false;
    },
    add() {
      if (this.$refs.MonthlySalaryFormref.validate()) {
        this.close();
      }
    },
  },
};
</script>
