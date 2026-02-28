e
<template>
  <div style="margin-top: 8pt">
    <v-row class="mx-2">
      <v-col cols="12" md="5" class="pa-0">
        <div class="pa-5" style="text-transform: uppercase; font-weight: 600">
          {{
            roomData ? roomData.grade_level + " " + roomData.room_section : ""
          }}
          Student List
        </div>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12" md="6">
        <div class="d-flex">
          <v-text-field
            v-model="search"
            outlined
            prepend-inner-icon="search"
            label="Search"
            single-line
            hide-details
            class="rounded-lg gboFontsTab"
            color="#f5b027"
            dense
          ></v-text-field>
          <v-btn
            class="white--text ml-2 rounded-lg"
            color="orange"
            @click="upgrade()"
          >
            <v-icon center medium> mdi-eye-outline </v-icon>
            View
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-card class="ma-5 dt-container" elevation="0" outlined>
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
        <!-- <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            class="mx-2 gboFontsTable"
            small
            color="green"
            outlined
            @click="viewItem(item)"
          >
            <v-icon class="gboFontsTable" size="20">mdi-pencil</v-icon>
            Attendance
          </v-btn>
        </template> -->
      </v-data-table>
    </v-card>
    <v-row class="mb-2 mx-5" align="center">
      <v-col cols="auto" class="mr-auto text-truncate flex-items" no-gutters>
        <span class="px-2 gboFonts">Show</span>
        <span>
          <v-select
            outlined
            dense
            color="#f5b027"
            hide-details
            :value="options.itemsPerPage"
            style="max-width: 90px"
            class="rounded-lg gboFonts"
            @change="options.itemsPerPage = parseInt($event, 10)"
            :items="perPageChoices"
          >
          </v-select>
        </span>
        <span class="px-2 gboFonts"> Entries </span>
      </v-col>

      <v-col cols="auto" class="mr-auto text-truncate gboFonts" no-gutters>
        Showing {{ paginationData.pageStart + 1 }} to
        {{ paginationData.pageStop }} of
        {{ paginationData.itemsLength }} entries
      </v-col>
      <v-col cols="auto">
        <v-pagination
          v-model="options.page"
          class="rounded-lg gboFonts"
          :total-visible="7"
          :color="$vuetify.theme.themes.light.submitBtns"
          :length="paginationData.pageCount"
        >
        </v-pagination>
      </v-col>
    </v-row>

    <AdviserStudentListDialog :data="viewData" :action="action" />

    <v-dialog v-model="dialogConfirmDelete" max-width="500">
      <v-card>
        <v-card-title class="text-h5"> Confirmation </v-card-title>

        <v-card-text style="font-size: 17px">
          Are you sure you want to delete this item ?
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="teal darken-3"
            outlined
            @click="dialogConfirmDelete = false"
          >
            Cancel
          </v-btn>

          <v-btn
            :color="$vuetify.theme.themes.light.submitBtns"
            class="white--text"
            @click="
              confirmDelete();
              dialogConfirmDelete = false;
            "
          >
            Confirm
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
  components: {
    AdviserStudentListDialog: () =>
      import("../Dialogs/Forms/AdviserStudentListDialog.vue"),
  },
  data: () => ({
    search: "",
    headers: [
      { text: "Student Name", value: "name", align: "start" },
      {
        text: "Sex",
        value: "sex",
        align: "center",
        sortable: false,
        width: 200,
      },
      {
        text: "LRN",
        value: "LRN",
        align: "center",
        sortable: false,
        width: 200,
      },
      {
        text: "CODE",
        value: "CODE",
        align: "center",
        sortable: false,
        width: 200,
      },
    ],
    data: [],
    verified: [],
    perPageChoices: [
      { text: "5", value: 5 },
      { text: "10", value: 10 },
      { text: "20", value: 20 },
      { text: "50", value: 50 },
      { text: "100", value: 100 },
      { text: "250", value: 250 },
      { text: "500", value: 500 },
    ],
    totalCount: 0,
    deleteData: null,
    viewData: null,
    loading: false,
    options: {},
    filter: null,
    action: null,
    paginationData: {},
    roomData: null,
    dialogConfirmDelete: false,
    fadeAwayMessage: {
      show: false,
      type: "success",
      header: "Successfully Deleted!",
      message: "",
      top: 10,
    },
  }),

  mounted() {
    this.eventHub.$on("closeadviserStudentListDialog", () => {
      this.initialize();
    });
  },
  beforeDestroy() {
    this.eventHub.$off("closeadviserStudentListDialog");
  },
  computed: {
    filterYear() {
      return this.$store.getters.getFilterSelected;
    },
  },
  watch: {
    options: {
      handler() {
        this.initialize();
      },
      deep: true,
    },
    filterYear: {
      handler(newData, oldData) {
        if (oldData != newData) {
          this.initialize();
        }
      },
      deep: true,
    },
  },

  methods: {
    pagination(data) {
      this.paginationData = data;
    },

    initialize() {
      this.filter = this.$store.getters.getFilterSelected;
      this.findAllRoomsSection();
      this.getTaggedStudent();
    },
    getTaggedStudent() {
      let userRoleID = this.$store.state.user.id;
      this.axiosCall(
        "/rooms-section/getMyClassList/" + userRoleID + "/" + this.filter,
        "GET",
      ).then((res) => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          let data = res.data;
          if (data[0].name != null) {
            for (let i = 0; i < data.length; i++) {
              data[i].name = this.toTitleCase(data[i].name);
            }
            this.data = data;
          } else {
            this.data = [];
          }
        } else {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message =
            "Please contact admin to set you room advisory!";
        }
      });
    },
    findAllRoomsSection() {
      this.axiosCall(
        "/rooms-section/findAllRoomsSection/" + this.$store.state.user.id,
        "GET",
      ).then((res) => {
        if (res.data) {
          this.roomData = res.data;
        }
      });
    },

    upgrade() {
      this.viewData = this.roomData;
      this.action = "View";
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
  font-size: 10.5pt;
}

.custom-table :deep(th) {
  font-size: 11pt !important;
  line-height: 1.5;
}
</style>
