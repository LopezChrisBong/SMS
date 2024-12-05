<template>
  <div>
    <v-dialog v-model="dialog" scrollable max-width="600px">
      <v-card>
        <v-card-title dark class="dialog-header">
          <span>{{ action }} School Year</span>

          <v-spacer></v-spacer>
          <v-btn icon dark @click="closed()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-col> </v-col>
        <v-card-text style="max-height: 700px">
          <v-form ref="SchoolYearFormref" @submit.prevent>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="syFrom"
                    :rules="[formRules.required]"
                    dense
                    label="From"
                    outlined
                    required
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="syTo"
                    :rules="[formRules.required]"
                    dense
                    label="TO"
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
        <v-card-actions class="pa-5">
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="closed()">
            <v-icon>mdi-close-circle-outline</v-icon>
            Cancel
          </v-btn>
          <v-btn
            color="#5a67da"
            v-if="action == 'Add'"
            class="white--text"
            @click="add()"
          >
            <v-icon>mdi-check-circle</v-icon>
            Save Details
          </v-btn>
          <v-btn
            color="#5a67da"
            v-if="action == 'Update'"
            class="white--text"
            @click="update()"
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

      id: null,
      syFrom: null,
      syTo: null,

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

        if (data.id) {
          this.id = data.id;
          this.syFrom = data.syFrom;
          this.syTo = data.syTo;
        } else {
          this.$refs.SchoolYearFormref.reset();
        }
      },
      deep: true,
    },
  },
  methods: {
    closed() {
      this.eventHub.$emit("closeSchoolYearDialog", false);
      this.dialog = false;
    },
    add() {
      if (this.$refs.SchoolYearFormref.validate()) {
        let data = {
          syFrom: this.syFrom,
          syTo: this.syTo,
        };

        this.axiosCall("/school-year", "POST", data).then((res) => {
          if (res.data.status == 201) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.message = res.data.msg;
            this.fadeAwayMessage.header = "System Message";

            this.closed();
          } else if (res.data.status == 400) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;

            this.closed();
          }
        });
      }
    },
    update() {
      if (this.$refs.SchoolYearFormref.validate()) {
        let data = {
          syFrom: this.syFrom,
          syTo: this.syTo,
        };

        this.axiosCall("/school-year/" + this.id, "PATCH", data).then((res) => {
          if (res.data.status == 200) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;

            this.closed();
          } else if (res.data.status == 400) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;

            this.closed();
          }
        });
      }
    },
  },
};
</script>
