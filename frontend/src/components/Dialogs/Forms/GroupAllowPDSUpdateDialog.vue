<template>
  <div>
    <v-dialog v-model="dialog" scrollable max-width="600px">
      <v-card>
        <v-card-title dark class="dialog-header">
          <span>Allow PDS Update</span>

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
          <v-form ref="Formref">
            <v-container class="mt-2">
              <v-row>
                <v-col cols="12" class="py-3">
                  <v-select
                    v-model="allow_update"
                    dense
                    :items="status"
                    :rules="[formRules.required]"
                    label="Status"
                    required
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-select>
                </v-col>

                <v-col cols="6" class="py-0" v-if="allow_update == 'Allowed'">
                  <v-menu
                    ref="AllowDateFrom"
                    :close-on-content-click="false"
                    :return-value.sync="date_from"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        dense
                        v-model="date_from"
                        :rules="
                          allow_update == 'Allowed' ? [formRules.required] : []
                        "
                        chips
                        small-chips
                        label="Date from"
                        color="#6DB249"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="date_from"
                      no-title
                      color="#6DB249"
                      scrollable
                    >
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        color="#6DB249"
                        @click="$refs.AllowDateFrom.save(date_from)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="6" class="py-0" v-if="allow_update == 'Allowed'">
                  <v-menu
                    ref="AllowDateTo"
                    :close-on-content-click="false"
                    :return-value.sync="date_to"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        dense
                        v-model="date_to"
                        :rules="
                          allow_update == 'Allowed' ? [formRules.required] : []
                        "
                        chips
                        small-chips
                        color="#6DB249"
                        label="Date To"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="date_to"
                      no-title
                      color="#6DB249"
                      scrollable
                    >
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        color="#6DB249"
                        @click="$refs.AllowDateTo.save(date_to)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>

                <v-col cols="12" class="py-1">
                  <v-divider class="pt-2"></v-divider>
                  <ul style="column-count: 2">
                    <li v-for="i in namesArray" :key="i">{{ i }}</li>
                  </ul>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
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
          <v-btn color="#5a67da" class="white--text" @click="save()">
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
      status: ["Allowed", "Not allowed"],

      date_to: null,
      date_from: null,
      allow_update: null,

      namesArray: [],
      idArray: [],
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
        console.log(data);
        this.namesArray = data.namesArray;
        this.idArray = data.idArray;

        this.dialog = true;
      },
      deep: true,
    },
  },
  methods: {
    save() {
      if (this.$refs.Formref.validate()) {
        this.allow_update = this.allow_update == "Allowed" ? true : false;
        // console.log(this.allowUpdateModel);
        let data = {
          userIDs: this.idArray,
          allow_update: this.allow_update,
          date_from: this.allow_update ? this.date_from : null,
          date_to: this.allow_update ? this.date_to : null,
        };

        this.axiosCall("/allow-pds-update/updateGroupAllow", "POST", data).then(
          (res) => {
            if (res.data.status == 200) {
              this.dialog = false;
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.message = res.data.msg;
              this.fadeAwayMessage.type = "success";
              this.fadeAwayMessage.header = "System Message!";
              this.$refs.Formref.reset();
              this.closeDialog();
            } else {
              this.dialog = false;
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.message = res.data.msg;
              this.fadeAwayMessage.type = "error";
              this.fadeAwayMessage.header = "System Message!";
              this.$refs.Formref.reset();
              this.closeDialog();
            }
          }
        );
      }
    },
  },
};
</script>
