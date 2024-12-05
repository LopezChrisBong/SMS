<template>
  <div>
    <v-dialog v-model="dialog" scrollable max-width="600px" persistent>
      <v-card>
        <v-card-title dark class="dialog-header">
          <span>Update Salary Grade</span>
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
          <v-form ref="SalaryGradesFormref" @submit.prevent>
            <v-container>
              <v-row class="mt-4">
                <v-col cols="12">
                  <v-select
                    v-model="sg_no"
                    :rules="[]"
                    :items="sgList"
                    dense
                    outlined
                    required
                    label="Salary Grade"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-select>
                </v-col>

                <v-col cols="12">
                  <v-select
                    v-model="step"
                    :items="sgStepList"
                    :rules="[]"
                    dense
                    outlined
                    required
                    label="Salary Grade Step"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-select>
                </v-col>
                <v-col cols="12" class="py-0">
                  <v-text-field
                    v-model="monthly_sal"
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
      salary_grades: [],
      sg_no: null,
      step: null,
      monthly_sal: null,
      sgList: [
        "",
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
        32,
        33,
      ],
      sgStepList: ["", 1, 2, 3, 4, 5, 6, 7, 8],
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
            this.instModel = data;
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    close() {
      this.eventHub.$on("closeSalaryDialog", true);
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
            this.$emit("reloadTable");
          } else if (res.data.status == 400) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.$refs.InstituteFormref.reset();
            this.$emit("reloadTable");
          }
        });
      }
    },
    update() {
      if (this.$refs.InstituteFormref.validate()) {
        this.axiosCall(
          "/institutes/" + this.data.id,
          "PATCH",
          this.instModel
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
            this.$refs.InstituteFormref.reset();
            this.$emit("reloadTable");
          }
        });
      }
    },
  },
};
</script>
