<template>
  <div>
    <v-dialog v-model="dialog" scrollable max-width="700px">
      <v-card>
        <v-card-title dark class="dialog-header">
          {{ action }} Calendar Year for ILDP
          <v-spacer></v-spacer>
          <v-btn icon dark @click="close()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-col> </v-col>
        <v-card-text style="max-height: 800px">
          <v-form ref="ILDPFormref" @submit.prevent>
            <v-container>
              <v-row class="mt-2">
                <v-col cols="12" class="py-0">
                  <v-text-field
                    v-model="yearFrom"
                    :rules="[formRules.isValidFiscalYear, formRules.required]"
                    dense
                    outlined
                    required
                    label="Year (FROM)"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="py-0">
                  <v-text-field
                    v-model="yearTo"
                    :rules="[formRules.isValidFiscalYear, formRules.required]"
                    dense
                    outlined
                    required
                    label="Year (TO)"
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
            Close
          </v-btn>
          <v-btn
            v-if="action == 'Add'"
            color="#519043"
            class="white--text"
            @click="add()"
          >
            <v-icon>mdi-check-circle</v-icon>
            Add
          </v-btn>
          <v-btn
            v-if="action == 'Update'"
            color="#519043"
            class="white--text"
            @click="update()"
          >
            <v-icon>mdi-check-circle</v-icon>
            Update
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
      yearFrom: null,
      yearTo: null,
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
            this.id = data.id;
            this.yearFrom = data.yearFrom;
            this.yearTo = data.yearTo;
          } else {
            this.id = null;
            this.yearFrom = null;
            this.yearTo = null;
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    close() {
      this.dialog = false;
      this.$refs.ILDPFormref.reset();
      this.eventHub.$emit("closeIldpCalendarDialog", false);
    },

    add() {
      if (this.$refs.ILDPFormref.validate()) {
        let data = {
          yearFrom: this.yearFrom,
          yearTo: this.yearTo,
        };
        this.axiosCall("/ildp-calendar-year", "POST", data).then((res) => {
          if (res.data.status == 201) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.message = res.data.msg;
            this.fadeAwayMessage.header = "System Message";
            this.close();
            // this.$emit("reloadTable");
          } else if (res.data.status == 400) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.close();
            // this.$emit("reloadTable");
          }
        });
      }
    },
    update() {
      if (this.$refs.ILDPFormref.validate()) {
        let data = {
          yearFrom: this.yearFrom,
          yearTo: this.yearTo,
        };
        this.axiosCall("/ildp-calendar-year/" + this.id, "PATCH", data).then(
          (res) => {
            if (res.data.status == 200) {
              this.dialog = false;
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "success";
              this.fadeAwayMessage.message = res.data.msg;
              this.fadeAwayMessage.header = "System Message";
              this.close();
              // this.$emit("reloadTable");
            } else if (res.data.status == 400) {
              this.dialog = false;
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "error";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
              this.close();
              // this.$emit("reloadTable");
            }
          }
        );
      }
    },
  },
};
</script>
