<template>
  <div>
    <v-row class="mx-2">
      <v-col cols="12" md="6" class="flex-items"> </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12" md="6" class="d-flex justify-space-between">
        <v-text-field
          v-model="search"
          outlined
          prepend-inner-icon="search"
          label="Search"
          single-line
          hide-details
          class="rounded-lg"
          color="#239FAB"
          dense
        ></v-text-field>
        <v-btn
          class="white--text ml-2 rounded-lg"
          :color="$vuetify.theme.themes.light.submitBtns"
          v-if="this.$store.state.user.user.isAdminApproved == 1"
          @click="add()"
        >
          <v-icon left> mdi-plus-box-outline </v-icon>
          Add New
        </v-btn>
      </v-col>
    </v-row>
    <v-card class="ma-5 dt-container" elevation="0" outlined>
      <v-data-table
        :headers="headers"
        :items="data"
        :items-per-page="10"
        :search="search"
        :options.sync="options"
        :loading="loading"
        @pagination="pagination"
        hide-default-footer
      >
        <template v-slot:[`item.inclusive_date`]="{ item }">
          {{ formatDate(item.inclusive_date) }}
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <v-chip
            small
            :color="
              item.status == 1
                ? '#FF9135'
                : item.status == 2
                ? '#17C800'
                : item.status == 3
                ? 'error'
                : ''
            "
            text-color="white"
          >
            {{
              item.status == 1
                ? "For Approval"
                : item.status == 2
                ? "Approved"
                : item.status == 3
                ? "Denied"
                : ""
            }}
          </v-chip>
        </template>
        <template v-slot:[`item.locator_type`]="{ item }">
          {{
            item.locator_type == 1
              ? "Personal Transaction"
              : item.locator_type == 3
              ? "Official Business"
              : "Official Time"
          }}
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <!-- <div v-if="getCurrentDate <= toTimestampp(item.inclusive_date)"> -->
          <v-btn
            v-if="item.status == 2"
            x-small
            outlined
            color="grey"
            class="mx-1"
            @click="viewQRItem(item)"
          >
            <v-icon size="14">mdi-qrcode</v-icon> QR
          </v-btn>

          <v-btn
            x-small
            class="mx-1"
            outlined
            color="grey"
            @click="viewLS(item)"
          >
            <v-icon size="14">mdi-eye</v-icon> View
          </v-btn>

          <v-btn
            x-small
            outlined
            class="mx-1"
            v-if="item.status == 1"
            color="grey"
            @click="editItem(item)"
          >
            <v-icon size="14">mdi-pencil-outline</v-icon> Update
          </v-btn>
          <v-btn
            class="mx-1"
            x-small
            outlined
            v-if="
              (item.status == 1 || item.status == 2) &&
                item.out == null &&
                getIsBeyondInclusiveDate(item.inclusive_date)
            "
            color="red"
            @click="deleteItem(item)"
          >
            <v-icon size="14">mdi-trash-can</v-icon> Delete
          </v-btn>
          <!-- </div> -->
        </template>
      </v-data-table>
    </v-card>
    <v-row class="mb-2 mx-5" align="center">
      <v-col cols="auto" class="mr-auto text-truncate flex-items" no-gutters>
        <span class="px-2">Show</span>
        <span>
          <v-select
            dense
            outlined
            hide-details
            :value="options.itemsPerPage"
            style="max-width: 90px"
            class="rounded-lg"
            @change="options.itemsPerPage = parseInt($event, 10)"
            :items="perPageChoices"
          >
          </v-select>
        </span>
        <span class="px-2"> Entries </span>
      </v-col>

      <v-col cols="auto" class="mr-auto text-truncate" no-gutters>
        Showing {{ paginationData.pageStart + 1 }} to
        {{ paginationData.pageStop }} of
        {{ paginationData.itemsLength }} entries
      </v-col>
      <v-col cols="auto">
        <v-pagination
          v-model="options.page"
          class="rounded-lg"
          :total-visible="7"
          :color="$vuetify.theme.themes.light.submitBtns"
          :length="paginationData.pageCount"
        >
        </v-pagination>
      </v-col>
    </v-row>

    <MyLocatorSlipDialog :data="updateData" :action="action" />
    <ViewLocatorSlipQRCodeDialog :data="viewData" :action="action" />
    <ViewLocatorSlipDialog :data="previewLSData" :displayFor="'me'" />

    <v-dialog v-model="dialogConfirmDelete" max-width="390">
      <v-card color="white">
        <div class="pa-4 #3a3b3a--text">
          <div class="text-h6 mb-1">WARNING!</div>
          <div class="text-body-1 mb-1">
            <p style="text-align: justify">
              <v-icon class="mt-n2" color="white">mdi-alert</v-icon> &nbsp; Are
              you sure you want to delete this information?<br /><br />
              Please note that
              <b>this action is irreversible.</b>
            </p>
          </div>
        </div>

        <!-- <v-card-title class="text-h5">
          Are you sure you want to proceed?
        </v-card-title> -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="cancelDelete()">
            Close
          </v-btn>
          <v-btn
            :color="$vuetify.theme.themes.light.submitBtns"
            :loading="btnLoading"
            :disabled="btnLoading"
            class="white--text"
            @click="confirmDelete()"
          >
            Yes
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
    MyLocatorSlipDialog: () =>
      import("../../components/Dialogs/Forms/MyLocatorSlipDialog.vue"),
    ViewLocatorSlipQRCodeDialog: () =>
      import("../Dialogs/Views/ViewLocatorSlipQRCodeDialog.vue"),
    ViewLocatorSlipDialog: () =>
      import("../Dialogs/Views/ViewLocatorSlipDialog.vue"),
  },

  data: () => ({
    search: "",
    headers: [
      {
        text: "Inclusive Date",
        value: "inclusive_date",
        align: "start",
        width: 200,
      },

      {
        text: "Destination",
        value: "destination",
        align: "left",
        width: 200,
      },
      {
        text: "Purpose",
        value: "purpose",
        align: "left",
        width: 200,
      },
      {
        text: "Type",
        value: "locator_type",
        align: "left",
        width: 200,
      },
      { text: "Status", value: "status", align: "center", width: 200 },
      {
        text: "Actions",
        value: "actions",
        align: "center",
        sortable: false,
      },
    ],
    data: [],
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
    viewData: null,
    previewLSData: null,
    updateData: null,
    loading: false,
    options: {},
    action: null,
    paginationData: {},
    formdata: [],
    work_dates_menu: false,
    dialogConfirmDelete: false,
    btnLoading: false,
    deleteData: null,
    fadeAwayMessage: {
      show: false,
      type: "success",
      header: "Successfully Deleted!",
      message: "",
      top: 10,
    },
  }),
  computed: {
    getCurrentDate() {
      return Date.now();
    },
  },
  watch: {
    options: {
      handler() {
        this.initialize();
      },
      deep: true,
    },
  },
  mounted() {
    this.eventHub.$on("closeMyLocatorSlipDialog", () => {
      this.initialize();
    });
    this.eventHub.$on("closeViewLocatorSlipDialog", () => {
      this.initialize();
    });
    this.eventHub.$on("closeLocatorSlipQRCodeDialog", () => {
      this.initialize();
    });
  },

  beforeDestroy() {
    this.eventHub.$off("closeMyLocatorSlipDialog");
    this.eventHub.$off("closeViewLocatorSlipDialog");
    this.eventHub.$off("closeLocatorSlipQRCodeDialog");
  },
  methods: {
    add() {
      this.updateData = [{ id: null }];
      this.action = "Add";
    },
    pagination(data) {
      this.paginationData = data;
    },

    getIsBeyondInclusiveDate(date) {
      let d = new Date(date);
      let current_date = new Date();
      return current_date > d;
    },
    initialize() {
      this.loading = true;
      this.axiosCall("/my-locator-slip/getAllMyLocators", "GET").then((res) => {
        if (res) {
          this.data = res.data;
          this.loading = false;
        }
      });
    },

    toTimestampp(date) {
      var d = new Date(date);
      return d.getTime();
    },
    deleteItem(item) {
      this.dialogConfirmDelete = true;
      this.deleteData = item;
    },
    cancelDelete() {
      this.btnLoading = false;
      this.dialogConfirmDelete = false;
      this.deleteData = null;
    },
    confirmDelete() {
      this.btnLoading = true;
      console.log(this.deleteData);
      this.axiosCall(
        "/my-locator-slip/delete/" + this.deleteData.id,
        "DELETE"
      ).then((res) => {
        if (res.data.status == 200) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
          this.deleteData = null;
          this.btnLoading = false;
          this.dialogConfirmDelete = false;
          this.initialize();
        } else if (res.data.status == 400) {
          this.btnLoading = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
        }
      });
    },
    editItem(item) {
      this.updateData = item;
      this.action = "Update";
    },

    viewQRItem(item) {
      this.viewData = item;
    },

    viewLS(item) {
      this.previewLSData = item;
    },
  },
};
</script>
