<template>
  <div style="margin-top: 8pt">
    <!-- TOP BAR -->
    <v-row class="mx-2">
      <v-col cols="12" md="5" class="pa-0">
        <v-tabs v-model="activeTab" color="#f5b027" align-tabs="left">
          <v-tab
            class="gboFontsTab"
            v-for="tab in tabList"
            :key="tab.id"
            @click="changeTab(tab)"
          >
            {{ tab.name }}
          </v-tab>
        </v-tabs>
      </v-col>

      <v-spacer></v-spacer>

      <v-col cols="12" md="4">
        <v-text-field
          v-model="search"
          outlined
          prepend-inner-icon="search"
          label="Search"
          single-line
          hide-details
          class="rounded-lg gboFontsTabs"
          color="#F5B027"
          dense
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- TABLE + PREVIEW -->
    <v-row class="ma-5">
      <!-- TABLE -->
      <v-col :cols="showPreview ? 8 : 12">
        <v-card class="dt-container" elevation="0" outlined>
          <v-data-table
            class="custom-table"
            :headers="headers"
            :items="data"
            :items-per-page="10"
            :search="search"
            :options.sync="options"
            :loading="loading"
            @pagination="pagination"
            hide-default-footer
          >
            <!-- NAME -->
            <template v-slot:[`item.name`]="{ item }">
              <span class="gboFontsTable">{{ item.name }}</span>
            </template>
            <template v-slot:[`item.documents`]="{ item }">
              <div class="d-flex flex-column align-start">
                <!-- PSA -->
                <v-btn
                  v-if="item.birthPSA && !item.birthPSA.startsWith('default')"
                  small
                  outlined
                  color="primary"
                  class="my-1 rounded-lg"
                  elevation="0"
                  @click="
                    previewDocument(item.birthPSA, 'PSA Birth Certificate')
                  "
                >
                  PSA
                </v-btn>

                <!-- FORM 137 -->
                <v-btn
                  v-if="
                    item.schoolCard && !item.schoolCard.startsWith('default')
                  "
                  small
                  outlined
                  color="primary"
                  class="my-1 rounded-lg"
                  elevation="0"
                  @click="previewDocument(item.schoolCard, 'Form 137')"
                >
                  FORM 137
                </v-btn>

                <!-- GOOD MORAL -->
                <v-btn
                  v-if="item.goodMoral && !item.goodMoral.startsWith('default')"
                  small
                  outlined
                  color="primary"
                  class="my-1 rounded-lg"
                  elevation="0"
                  @click="
                    previewDocument(item.goodMoral, 'Good Moral Certificate')
                  "
                >
                  GOOD MORAL
                </v-btn>
                <!-- Picture -->
                <v-btn
                  v-if="item.picture && !item.picture.startsWith('default')"
                  small
                  outlined
                  color="primary"
                  class="my-1 rounded-lg"
                  elevation="0"
                  @click="previewDocument(item.picture, '2x2 Picture')"
                >
                  2x2 Picture
                </v-btn>
              </div>
            </template>

            <!-- ACTIONS -->
            <template v-slot:[`item.actions`]="{ item }">
              <div class="d-flex">
                <v-btn
                  v-if="activeTab === 0"
                  style="width: 80pt"
                  small
                  color="#f5b027"
                  class="my-2 mx-2 gboFontsTable rounded-lg"
                  outlined
                  @click="enrollStudent(item)"
                >
                  <v-icon left>mdi-check</v-icon>
                  Enroll
                </v-btn>

                <v-btn
                  style="width: 80pt"
                  small
                  class="my-2 mx-2 gboFontsTable rounded-lg"
                  color="#758A93"
                  outlined
                  @click="viewItem(item)"
                >
                  <v-icon>mdi-eye</v-icon>
                  View
                </v-btn>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>

      <!-- PREVIEW PANEL -->
      <v-col cols="4" v-if="showPreview">
        <v-card outlined height="100%" class="rounded-xl">
          <v-card-title height="20%">
            {{ previewTitle }}

            <v-spacer></v-spacer>

            <v-btn icon @click="closePreview">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text class="text-center">
            <div v-if="previewImage">
              <!-- IMAGE -->
              <img
                v-if="!previewImage.endsWith('.pdf')"
                :src="previewImage"
                style="max-width: 100%; max-height: 500px"
              />

              <!-- PDF -->
              <iframe
                v-else
                :src="previewImage"
                width="100%"
                height="500"
              ></iframe>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <ViewAccountVerificationDialog :data="viewData" :action="action" />
      <v-dialog v-model="missingDialog" persistent max-width="380">
        <v-card class="rounded-xl elevation-3">
          <!-- HEADER -->
          <div class="px-6 pt-6">
            <!-- ICON + TITLE (ONE ROW LEFT) -->
            <div class="d-flex align-center">
              <v-avatar size="44" color="#fff3cd">
                <v-icon color="#f5b027" size="26"
                  >mdi-file-alert-outline</v-icon
                >
              </v-avatar>

              <div class="text-h6 font-weight-bold ml-3">Missing Documents</div>
            </div>

            <!-- DESCRIPTION -->
            <p class="text-body-2 grey--text text--darken-1 mt-3">
              The student cannot be enrolled because the following documents are
              missing:
            </p>

            <!-- MISSING LIST -->
            <ul class="mt-2">
              <li
                v-for="doc in missingDocs"
                :key="doc"
                class="red--text text--darken-1"
              >
                {{ doc }}
              </li>
            </ul>
          </div>

          <!-- ACTION BUTTON -->
          <v-card-actions class="justify-end px-6 pb-5">
            <v-btn
              color="#f5b027"
              class="white--text rounded-lg"
              elevation="1"
              @click="missingDialog = false"
            >
              OK
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
export default {
  components: {
    ViewAccountVerificationDialog: () =>
      import(
        "../../components/Dialogs/Views/ViewStudentVerificationDialog.vue"
      ),
  },
  data: () => ({
    search: "",
    loading: false,
    missingDialog: false,
    missingDocs: [],
    viewData: null,
    viewDialog: false,
    action: "",
    /* Preview */
    zoomImage: null,
    showZoom: false,
    previewImage: null,
    previewTitle: "",
    showPreview: false,

    /* Table */
    headers: [
      { text: "Name", value: "name", align: "start" },
      { text: "Document Requirements", value: "documents", align: "left" },
      {
        text: "Actions",
        value: "actions",
        align: "center",
        sortable: false,
        width: 200,
      },
    ],

    data: [],
    options: {},
    paginationData: {},

    /* Tabs */
    tabList: [
      { id: 1, name: "For Verification" },
      { id: 2, name: "Enrolled" },
    ],
    activeTab: { id: 1, name: "For Verification" },

    /* Notification */
    fadeAwayMessage: {
      show: false,
      type: "success",
      header: "System Message",
      message: "",
      top: 10,
    },
  }),

  mounted() {
    this.initialize();
  },

  methods: {
    /* ----------------------------------
       UTILITIES
    ----------------------------------- */

    validFile(file) {
      return file && !file.startsWith("default");
    },

    pagination(data) {
      this.paginationData = data;
    },

    /* ----------------------------------
       LOAD DATA
    ----------------------------------- */

    initialize() {
      this.loading = true;

      this.axiosCall("/enroll-student/EnrollStudent", "GET").then((res) => {
        let data = res.data;

        data = data.filter((student) => {
          return (
            student.birthPSA !== "default" &&
            student.picture !== "default" &&
            student.schoolCard !== "default" &&
            student.goodMoral !== "default"
          );
        });

        data.forEach((element, i) => {
          data[i].name = this.toTitleCase(element.name);
        });

        this.data = data;
        this.loading = false;
      });
    },

    getVerifiedUsers() {
      this.loading = true;

      this.axiosCall("/enroll-student/EnrolledStudent", "GET").then((res) => {
        let data = res.data;

        data = data.filter((student) => {
          return (
            student.birthPSA !== "default" &&
            student.picture !== "default" &&
            student.schoolCard !== "default" &&
            student.goodMoral !== "default"
          );
        });

        data.forEach((element, i) => {
          data[i].name = this.toTitleCase(element.name);
        });

        this.data = data;
        this.loading = false;
      });
    },

    /* ----------------------------------
       TAB SWITCH
    ----------------------------------- */

    changeTab(tab) {
      this.activeTab = tab;

      if (tab.id === 1) {
        this.initialize();
      } else {
        this.getVerifiedUsers();
      }
    },

    /* ----------------------------------
       ENROLL STUDENT
    ----------------------------------- */

    enrollStudent(item) {
      let missing = [];

      if (!item.birthPSA || item.birthPSA.startsWith("default"))
        missing.push("PSA Birth Certificate");

      if (!item.schoolCard || item.schoolCard.startsWith("default"))
        missing.push("Form 137");
      if (item.transfered == 1) {
        if (!item.goodMoral || item.goodMoral.startsWith("default"))
          missing.push("Good Moral Certificate");
      }

      if (missing.length > 0) {
        this.missingDocs = missing;
        this.missingDialog = true;
        return;
      }

      let filter = this.$store.getters.getFilterSelected;

      let data = {
        id: item.id,
        grade_level: item.grade_level,
        goodMoral: item.goodMoral,
        birthPSA: item.birthPSA,
        schoolCard: item.schoolCard,
        picture: item.picture,
        seniorJunior: item.seniorJunior,
        schoo_yearId: filter,
        update_type: 1,
        statusEnrolled: true,
      };

      this.axiosCall(
        "/enroll-student/updateEnrolledStudent",
        "POST",
        data,
      ).then((res) => {
        if (res.data.status == 200) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;

          this.initialize();
        } else {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
        }
      });
    },

    /* ----------------------------------
       DOCUMENT PREVIEW
    ----------------------------------- */

    previewDocument(file, title) {
      if (!file) return;

      let datastring = file.substring(7, 0);

      if (datastring == "default") {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "info";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message =
          "No file Uploaded, This file is not required";
        return;
      }

      this.previewTitle = title;
      this.previewImage =
        process.env.VUE_APP_SERVER + "/enroll-student/view/studentFile/" + file;

      this.showPreview = true;
    },

    closePreview() {
      this.showPreview = false;
      this.previewImage = null;
      this.previewTitle = "";
    },

    /* ----------------------------------
       ACTION BUTTONS
    ----------------------------------- */

    editItem(item) {
      this.updateData = item;
      this.action = "Verify";
    },

    viewItem(item) {
      this.viewData = null;

      this.$nextTick(() => {
        this.viewData = { ...item }; // force new object reference
        this.action = this.activeTab.id === 1 ? "View" : "Update";
      });
    },
  },
};
</script>

<style scoped>
.gboFonts {
  font-family: "Segoe UI" !important;
  font-size: 11pt;
}

.gboFontsTab {
  font-family: "Segoe UI" !important;
  font-size: 12pt;
}

.gboFontsTable {
  font-family: "Segoe UI" !important;
  font-size: 11pt;
}

.custom-table :deep(th) {
  font-size: 11pt !important;
}
</style>
