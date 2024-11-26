<template>
  <v-dialog v-model="dialog" max-width="1200px" persistent>
    <v-card>
      <v-card-title dark class="dialog-header">
        <span>{{ fileDesc }}</span>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text style="max-height: 950px" class="mt-2">
        <v-row>
          <v-col cols="12">
            <div class="py-1">
              <iframe :src="source" width="100%" height="700"> </iframe>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    data: null,
    moduleFrom: null,
  },
  components: {},
  data() {
    return {
      dialog: false,
      source: null,
      isLoading: true,
      fileDesc: null,
      page: null,
      pageCount: 1,
      showAllPages: true,
    };
  },
  watch: {
    data: {
      handler(data) {
        console.log(data);
        // if (data.id) {
        //   console.log(data);
        //   this.fileDesc = data.description;
        if (data) {
          this.source =
            process.env.VUE_APP_SERVER + "/leaves/getAttachment/" + data;
          this.dialog = true;
        }
        // }
      },
      deep: true,
    },
    showAllPages() {
      this.page = this.showAllPages ? null : 1;
    },
  },
  methods: {
    close() {
      this.dialog = false;
    },
    handleDocumentRender() {
      this.isLoading = false;
      this.pageCount = this.$refs.pdfRef.pageCount;
    },
  },
};
</script>
