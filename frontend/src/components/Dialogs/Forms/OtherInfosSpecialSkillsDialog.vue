<template>
  <div>
    <v-dialog v-model="dialog" eager scrollable max-width="600px">
      <v-form ref="OtherInfoSpecialSkillsFormref" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span v-if="action == 'Add'"> Add Special Skills and Hobby</span>
            <span v-if="action == 'Update'"
              >Update Special Skills and Hobby</span
            >
            <v-spacer></v-spacer>
            <v-btn icon dark @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-col> </v-col>
          <v-card-text style="max-height: 700px">
            <v-container>
              <v-row>
                <v-col cols="12" class="py-0">
                  <v-text-field
                    v-model="otherInfoModel.hobbies"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    label="Special Skills and Hobbies"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions v-if="action == 'Add'" class="pa-5">
            <v-spacer></v-spacer>
            <v-btn color="red" outlined @click="dialog = false">
              <v-icon>mdi-close-circle-outline</v-icon>
              Cancel
            </v-btn>
            <v-btn color="#519043" class="white--text" @click="addSkill()">
              <v-icon>mdi-check-circle</v-icon>
              Save Details
            </v-btn>
          </v-card-actions>

          <v-card-actions v-if="action == 'Update'" class="pa-5">
            <v-spacer></v-spacer>
            <v-btn color="red" outlined @click="dialog = false">
              <v-icon>mdi-close-circle-outline</v-icon>
              Cancel
            </v-btn>
            <v-btn color="#519043" class="white--text" @click="updateSkill()">
              <v-icon>mdi-check-circle</v-icon>
              Update Details
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
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
      otherInfoModel: {
        hobbies: null,
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
        this.$refs.OtherInfoSpecialSkillsFormref.resetValidation();
        this.otherInfoModel = data;
      },
      deep: true,
    },
  },
  methods: {
    closeD() {
      //  this.$refs.OtherInfoFormref.reset();
      this.dialog = false;
    },
    addSkill() {
      if (this.$refs.OtherInfoSpecialSkillsFormref.validate()) {
        this.$emit("addOtherInfoSpecialSkill", this.otherInfoModel);
        this.closeD();
      }
    },
    updateSkill() {
      if (this.$refs.OtherInfoSpecialSkillsFormref.validate()) {
        this.$emit("updateOtherInfoSpecialSkill", this.otherInfoModel);
        this.closeD();
      }
    },
  },
};
</script>