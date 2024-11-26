<template>
  <div>
    <v-row class="mx-2">
      <v-col cols="12" md="8" class="flex-items">
        <v-tabs v-model="activeTab" color="#519043" align-tabs="left">
          <v-tab v-for="tab in tabList" :key="tab.id" @click="changeTab(tab)">{{
            tab.name
          }}</v-tab>
        </v-tabs>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12" md="4" class="d-flex justify-space-between">
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
        <template v-slot:[`item.reqType`]="{ item }">
          {{ getDocumentRequestedType(item.reqType) }}
        </template>
        <template v-slot:[`item.document_requested_id`]="{ item }">
          {{ getType(item.document_requested_id) }}
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn x-small color="grey" outlined @click="viewItem(item)">
            <v-icon size="14">mdi-eye</v-icon> View
          </v-btn>
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
            color="#519043"
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

    <ViewDocumentRequestDialog :data="updateData" :action="action" :tab="tab" />

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
            color="teal darken-3"
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
    ViewDocumentRequestDialog: () =>
      import("../Dialogs/Views/ViewDocumentRequestDialog.vue"),
  },
  data: () => ({
    search: "",
    headers: [
      { text: "Requestor", value: "requestor", align: "start" },
      { text: "Control Number", value: "control_num", align: "start" },
      { text: "Document Requested Type", value: "reqType", align: "start" },
      {
        text: "Document Requested",
        value: "document_requested_id",
        align: "start",
      },
      { text: "Purpose", value: "purpose", align: "start" },

      {
        text: "Actions",
        value: "actions",
        align: "center",
        sortable: false,
        width: 200,
      },
    ],
    requestTypeList: [
      {
        id: 1,
        type: "Personal Files",
      },
      {
        id: 2,
        type: "HR Records",
      },
    ],
    data: [],
    verified: [],
    requestsList: [
      {
        id: 1,
        type: "Service Record",
      },
      {
        id: 2,
        type: "Certificate of Employment",
      },
      {
        id: 3,
        type: "Certificate of Leave Credits",
      },
      {
        id: 4,
        type: "Certification of No Pending Administrative/Criminal Case/s",
      },
      {
        id: 5,
        type:
          "Certificate of Income Derived from Salary, Pera, ADCOM and Others",
      },
      {
        id: 6,
        type: "Pay slip / Certification of Net pay",
      },
      {
        id: 7,
        type: "Others: Please specify",
      },
    ],
    perPageChoices: [
      { text: "5", value: 5 },
      { text: "10", value: 10 },
      { text: "20", value: 20 },
      { text: "50", value: 50 },
      { text: "100", value: 100 },
      { text: "250", value: 250 },
      { text: "500", value: 500 },
    ],
    activeTab: { id: 1, name: "Requests" },
    tab: 1,
    tabList: [
      { id: 1, name: "Requests" },
      { id: 2, name: "Claimed" },
    ],
    totalCount: 0,
    deleteData: null,
    updateData: null,
    isHrReceived: null,
    loading: false,
    options: {},
    action: null,
    paginationData: {},
    formdata: [],
    work_dates_menu: false,
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
    this.eventHub.$on("closeViewDocumentRequest", () => {
      this.initialize(this.tab);
    });
  },
  beforeDestroy() {
    this.eventHub.$off("closeViewDocumentRequest");
  },

  watch: {
    options: {
      handler() {
        this.initialize(this.activeTab.id);
      },
      deep: true,
    },
  },

  methods: {
    pagination(data) {
      this.paginationData = data;
    },
    getType(id) {
      let rl = this.requestsList.filter((type) => type.id == id);
      return rl[0].type;
    },

    getDocumentRequestedType(val) {
      let rl = this.requestTypeList.filter((type) => type.id == val);
      return rl[0].type;
    },

    initialize(id) {
      this.loading = true;
      if (id == 1) {
        this.axiosCall("/document-requests", "GET").then((res) => {
          if (res) {
            console.log(res.data);
            this.data = res.data;
            this.loading = false;
          }
        });
      } else {
        this.axiosCall("/document-requests", "GET").then((res) => {
          if (res) {
            console.log(res.data);
            this.data = res.data;
            this.loading = false;
          }
        });
      }
    },

    changeTab(tab) {
      this.activeTab = tab;

      this.initialize(tab.id);
      this.tab = tab.id;
    },
    add() {
      this.updateData = [{ id: null }];
      this.action = "Add";
    },
    editItem(item) {
      this.updateData = item;
      this.action = "Update";
    },
    viewItem(item) {
      this.updateData = item;
      this.action = "View";
    },
  },
};
</script>
