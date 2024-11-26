<template>
  <div>
    <v-dialog persistent v-model="dialog" scrollable max-width="700px">
      <v-card>
        <v-card-title dark class="dialog-header">
          {{ action == "Update" ? "Update" : "View" }} E-Signature
          <v-spacer></v-spacer>
          <v-btn icon dark @click="close()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-col> </v-col>
        <v-card-text style="max-height: 800px">
          <v-form ref="MyEsigFormref" @submit.prevent>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <h4>Esign Image Preview</h4>
                </v-col>
                <v-col cols="12" class="d-flex justify-center">
                  <img :src="imgpreview" alt="" width="200px" />
                </v-col>
                <v-col cols="12" v-if="action == 'Update'">
                  <v-file-input
                    @change="changeImage()"
                    :rules="action == 'Update' ? [formRules.required] : []"
                    v-model="esigSelected"
                    prepend-icon="mdi-camera"
                    accept="image/png"
                    outlined
                    color="#6DB249"
                    dense
                    label="Upload file"
                  ></v-file-input>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>

        <v-card-actions class="pa-5" v-if="action == 'Update'">
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="close()">
            <v-icon>mdi-close-circle-outline</v-icon>
            Cancel
          </v-btn>
          <v-btn color="#519043" class="white--text" @click="update()">
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
      users: [],
      dialog: false,
      esigSelected: null,
      imgpreview: null,
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

          if (data.esign.id != null) {
            console.log(data);
            this.imgpreview =
              process.env.VUE_APP_SERVER +
              "/e-sigs/getEsign/" +
              data.esign.esign_filename;
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    close() {
      this.dialog = false;
      this.eventHub.$emit("closeMyESigDialog", false);
    },

    changeImage() {
      this.imgpreview = URL.createObjectURL(this.esigSelected);
    },

    update() {
      if (this.$refs.MyEsigFormref.validate()) {
        let fd = new FormData();

        fd.append("file", this.esigSelected);
        this.axiosCall("/e-sigs/uploadEsign", "POST", fd).then((res) => {
          if (res.data.status == 200) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.close();
          } else if (res.data.status == 400) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.$refs.MyDirectHeadFormref.reset();
            this.close();
          }
        });
      }
    },
  },
};
</script>
