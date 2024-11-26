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
          <!-- <v-col cols="12">
            <div>
              <template v-if="isLoading">
                Loading...
              </template>

              <template v-else>
                <span v-if="showAllPages"> {{ pageCount }} page(s) </span>

                <span v-else>
                  <v-btn icon :disabled="page <= 1" @click="page--">
                    <v-icon>mdi-chevron-left</v-icon></v-btn
                  >
                

                  {{ page }} / {{ pageCount }}
                  <v-btn icon :disabled="page >= pageCount" @click="page++">
                    <v-icon>mdi-chevron-right</v-icon></v-btn
                  >
                 
                </span>

                <label style="float:right">
                  <input v-model="showAllPages" type="checkbox" />

                  Show all pages
                </label>
              </template>
            </div>
          </v-col>
          <v-col>
            <div class="elevation-2" style="overflow-y:auto; overflow-x:hidden">
              <vue-pdf-embed
                @rendered="handleDocumentRender"
                ref="pdfRef"
                :source="source"
                style="max-height: 600px"
              />
            </div>
          </v-col> -->
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
// import VuePdfEmbed from "vue-pdf-embed/dist/vue2-pdf-embed";
export default {
  props: {
    data: null,
  },
  components: {
    // VuePdfEmbed,
  },
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
        if (data.id) {
          console.log(data);
          this.fileDesc = data.description;
          this.source =
            process.env.VUE_APP_SERVER +
            "/to-attachments/getAttachments/" +
            data.filename;
          this.dialog = true;
        }
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
