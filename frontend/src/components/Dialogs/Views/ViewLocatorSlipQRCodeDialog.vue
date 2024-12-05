<template>
  <v-dialog v-model="dialog" max-width="400px" persistent>
    <v-card>
      <v-card-title dark class="dialog-header">
        <span>QR Code</span>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col class="mt-10 mb-10 d-flex justify-center">
            <qr-code :size="150" :text="qrText"></qr-code>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="#5a67da" class="white--text" @click="printQRCode()">
          <v-icon>mdi-printer</v-icon>
          Print
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    data: null,
  },
  data() {
    return {
      dialog: false,
      qrText: null,
    };
  },
  watch: {
    data: {
      handler(data) {
        if (data.id) {
          this.qrText = data.id.toString();
          this.dialog = true;
        }
      },
      deep: true,
    },
  },
  methods: {
    close() {
      this.dialog = false;

      this.dialog = false;

      this.eventHub.$emit("closeLocatorSlipQRCodeDialog", false);
    },

    printQRCode() {
      const url =
        process.env.VUE_APP_SERVER + "/pdf-generator/getQRCode/" + this.qrText;
      window.open(url);
    },
  },
};
</script>
