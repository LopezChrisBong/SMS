<template>
  <div>
    <div class="mx-5">
      <v-alert
        v-model="toAlert"
        type="warning"
        icon="mdi-alert-circle-outline"
        dense
        dismissible
        close-label="Close Alert"
      >
        <p class="text-subtitle-2">
          You are {{ isRequiredForSALN ? "" : "not" }} required to prepare the
          SALN.
        </p>
      </v-alert>
    </div>
    <v-row class="mx-2">
      <v-col cols="12" md="6" class="pa-0">
        <!-- <v-tabs v-model="activeTab" color="#5a67da" align-tabs="left">
          <v-tab v-for="tab in tabList" :key="tab.id" @click="changeTab(tab)">{{
            tab.name
          }}</v-tab>
        </v-tabs> -->
      </v-col>
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
          v-if="
            isRequiredForSALN &&
              this.$store.state.user.user.isAdminApproved == 1
          "
          class="white--text ml-2 rounded-lg"
          :color="$vuetify.theme.themes.light.submitBtns"
          @click="addNew()"
        >
          <v-icon left> mdi-plus-box-outline </v-icon>
          Add
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
        <template v-slot:[`item.createdAt`]="{ item }">
          {{ getYear(item.createdAt) }}
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <v-chip
            :color="
              item.status == 1 ? 'grey' : item.status == 2 ? '#5a67da' : 'red'
            "
            class="ma-2 white--text"
            x-small
          >
            {{
              item.status == 1
                ? "For Checking"
                : item.status == 2
                ? "Checked+"
                : "Pending"
            }}
          </v-chip>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <div>
            <v-btn
              x-small
              outlined
              color="grey"
              class="white--text mx-1"
              @click="viewItem(item)"
            >
              <v-icon size="14">mdi-eye</v-icon>
              View
            </v-btn>
            <v-btn
              x-small
              outlined
              color="grey"
              class="white--text mx-1"
              @click="editItem(item)"
            >
              <v-icon size="14">mdi-pencil</v-icon>
              Update
            </v-btn>
            <v-btn
              class="mx-1"
              v-if="item.status == 2"
              x-small
              outlined
              color="#5a67da"
              @click="printItem(item)"
            >
              <v-icon size="14">mdi-printer</v-icon>
              Print
            </v-btn>
            <v-btn
              v-if="item.status != 2"
              class="mx-1"
              x-small
              outlined
              color="red"
              @click="deleteItem(item)"
            >
              <v-icon size="14">mdi-trash-can</v-icon>
              delete
            </v-btn>
          </div>
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
            color="#5a67da"
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

    <MySALNDialog :data="updateData" :action="action" />

    <v-dialog v-model="confirmDialog" persistent max-width="390">
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
          <v-btn color="green" class="white--text" @click="confirmDelete()">
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
    MySALNDialog: () =>
      import("../../components/Dialogs/Forms/MySALNDialog.vue"),
  },
  data: () => ({
    search: "",
    headers: [
      {
        text: "Year",
        value: "saln_for_year",
        align: "start",
      },
      {
        text: "Status",
        value: "status",
        align: "center",
      },

      {
        text: "Actions",
        value: "actions",
        align: "center",
        sortable: false,
        width: 400,
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
    activeTab: { id: 1, name: "For Approval" },
    tab: 1,
    tabList: [
      { id: 1, name: "For Approved" },
      { id: 2, name: "Approved" },
      { id: 3, name: "Denied" },
    ],
    totalCount: 0,
    toAlert: false,
    isRequiredForSALN: null,
    confirmDialog: false,
    confirmAction: null,
    confirmApprovalID: null,
    updateData: null,
    loading: false,
    options: {},
    action: null,
    paginationData: {},
    formdata: [],
    work_dates_menu: false,
    itemToDelete: null,
    dialogConfirmDelete: false,
    fadeAwayMessage: {
      show: false,
      type: "success",
      header: "Successfully Deleted!",
      message: "",
      top: 10,
    },
  }),
  watch: {
    options: {
      handler() {
        this.initialize();
        this.getMyEmploymentStatus();
      },
      deep: true,
    },
  },
  mounted() {
    this.eventHub.$on("closeMySALNDialog", () => {
      this.initialize();
    });
  },
  beforeDestroy() {
    this.eventHub.$off("closeMySALNDialog");
  },

  methods: {
    pagination(data) {
      this.paginationData = data;
    },

    changeTab(tab) {
      this.activeTab = tab;

      this.initialize(tab.id);
      this.tab = tab.id;
    },

    initialize() {
      this.loading = true;

      this.axiosCall("/saln/getMySaln", "GET").then((res) => {
        if (res) {
          // console.log(res.data);
          this.data = res.data;
          this.loading = false;
        }
      });
    },

    getMyEmploymentStatus() {
      this.axiosCall("/employee/getMyEmploymentStatus", "GET").then((res) => {
        if (res) {
          if (res.data.id != 5) {
            this.isRequiredForSALN = true;
            this.toAlert = true;
          } else {
            this.toAlert = true;
            this.isRequiredForSALN = false;
          }
        }
      });
    },

    addNew() {
      this.updateData = { id: null };
      this.action = "Add";
    },

    editItem(item) {
      this.action = "";
      setTimeout(() => {
        this.updateData = item;
        this.action = "Update";
      }, 100);
    },

    deleteItem(item) {
      this.itemToDelete = item;
      this.confirmDialog = true;
    },
    cancelDelete() {
      this.itemToDelete = null;
      this.confirmDialog = false;
    },
    confirmDelete() {
      this.axiosCall("/saln/delete/" + this.itemToDelete.id, "DELETE").then(
        (res) => {
          if (res.data.status == 200) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.itemToDelete = null;
            this.confirmDialog = false;
            this.initialize();
          } else if (res.data.status == 400) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
          }
        }
      );
    },
    viewItem(item) {
      this.action = "";
      setTimeout(() => {
        this.updateData = item;
        this.action = "View";
      }, 100);
    },

    printItem(item) {
      console.log(item);
      const url =
        process.env.VUE_APP_SERVER + "/pdf-generator/print-saln/" + item.id;
      window.open(url);
    },
    // confirm(action, item) {
    //   // console.log(item);
    //   this.confirmAction = action;
    //   this.confirmDialog = true;
    //   this.confirmApprovalID = item.id;
    // },
  },
};
</script>
