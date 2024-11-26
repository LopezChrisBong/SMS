<template>
  <div>
    <v-row class="mx-2">
      <v-col cols="12" md="6" class="pa-0">
        <v-tabs v-model="activeTab" color="#519043" align-tabs="left">
          <v-tab v-for="tab in tabList" :key="tab.id" @click="changeTab(tab)">{{
            tab.name
          }}</v-tab>
        </v-tabs>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12" md="3" class="d-flex justify-space-between">
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
        <!-- <v-btn
          class="white--text ml-2 rounded-lg"
          color="#519043"
          @click="add()"
        >
          <v-icon left> mdi-plus-box-outline </v-icon>
          Add New
        </v-btn> -->
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
        <template v-slot:[`item.to_names`]="{ item }">
          <div :inner-html.prop="item.to_names | highlight(search)"></div>
        </template>
        <template v-slot:[`item.travel_date_from`]="{ item }">
          {{
            isValidJSON(item.travel_date_from)
              ? formatDate(getFirstDate(item.travel_date_from))
              : formatDate(item.travel_date_from)
          }}
          -
          {{ formatDate(item.travel_date_to) }}
        </template>
        <template v-slot:[`item.is_recommending_approval_approved`]="{ item }">
          <v-chip
            v-if="item.is_recommending_approval_approved == 1"
            class="ma-2"
            x-small
          >
            For Approval
          </v-chip>
          <v-icon
            color="#519043"
            v-if="item.is_recommending_approval_approved == 2"
            >mdi-check-bold</v-icon
          >

          <v-icon
            color="error"
            v-if="item.is_recommending_approval_approved == 3"
            >mdi-timer-refresh-outline</v-icon
          >
        </template>

        <template v-slot:[`item.is_finance_dir_approved`]="{ item }">
          <v-chip v-if="item.is_finance_dir_approved == 1" class="ma-2" x-small>
            For Approval
          </v-chip>
          <v-icon color="#519043" v-if="item.is_finance_dir_approved == 2"
            >mdi-check-bold</v-icon
          >

          <v-icon color="error" v-if="item.is_finance_dir_approved == 3"
            >mdi-timer-refresh-outline</v-icon
          >
        </template>

        <template v-slot:[`item.is_president_approved`]="{ item }">
          <v-chip v-if="item.is_president_approved == 1" class="ma-2" x-small>
            For Approval
          </v-chip>
          <v-icon color="#519043" v-if="item.is_president_approved == 2"
            >mdi-check-bold</v-icon
          >

          <v-icon color="error" v-if="item.is_president_approved == 3"
            >mdi-timer-refresh-outline</v-icon
          >
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            class="mx-1"
            x-small
            color="grey"
            outlined
            @click="editItem(item)"
          >
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

    <ViewAuditTravelOrder :data="updateData" :action="action" :tab="tab" />
    <ViewTravelOrderToUpdateDialog :data="viewData" :action="action" />

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
    ViewAuditTravelOrder: () =>
      import("../../components/Dialogs/Views/ViewAuditTravelOrder.vue"),
    ViewTravelOrderToUpdateDialog: () =>
      import(
        "../../components/Dialogs/Views/ViewTravelOrderToUpdateDialog.vue"
      ),
  },
  filters: {
    highlight: function(value, query) {
      return value.replace(
        new RegExp(query, ""),
        "<span class='blue'>" + query + "</span>"
      );
    },
  },
  data: () => ({
    search: "",
    deadline_date: null,
    resetDeadlineDialog: false,
    travel_date_to: null,
    to_ID: null,
    headers: [
      { text: "TO Number", value: "travel_order_num", align: "start" },
      // { text: "Created By", value: "name", align: "start" },
      { text: "Employee/s", value: "to_names", align: "start", width: 180 },
      {
        text: "Date of Travel",
        value: "travel_date_from",
        align: "start",
        width: 100,
      },
      {
        text: "Place/s of Travel",
        value: "travel_place",
        align: "start",
        width: 180,
      },
      { text: "Purpose", value: "travel_purpose", align: "start", width: 180 },
      {
        text: "Recommending Approval",
        value: "is_recommending_approval_approved",
        align: "center",
      },
      {
        text: "Accountant",
        value: "is_finance_dir_approved",
        align: "center",
      },
      { text: "President", value: "is_president_approved", align: "center" },

      {
        text: "Action",
        value: "actions",
        align: "center",
        sortable: false,
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
    activeTab: { id: 2, name: "Received" },
    tab: 1,
    tabList: [
      // { id: 1, name: "To receive" },
      { id: 2, name: "Received" },
      { id: 3, name: "Archived" },
      // { id: 4, name: "Pending" },
      { id: 5, name: "Cancelled" },
    ],
    totalCount: 0,
    deleteData: null,
    updateData: null,
    viewData: null,
    loading: false,
    options: {},
    action: null,
    paginationData: {},
    formdata: [],
    cancelTravelOrderDialog: false,
    itemToCancel: null,
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
    this.eventHub.$on("closeMyTravelOrderDialog", () => {
      this.initialize(this.tab);
    });
    this.eventHub.$on("closeViewTravelOrderAttachments", () => {
      this.initialize(this.tab);
    });
    this.eventHub.$on("ViewTravelOrderToUpdateDialog", () => {
      this.initialize(this.tab);
    });
  },
  beforeDestroy() {
    this.eventHub.$off("closeMyTravelOrderDialog");
    this.eventHub.$off("ViewTravelOrderToUpdateDialog");
    this.eventHub.$off("closeViewTravelOrderAttachments");
  },

  watch: {
    options: {
      handler() {
        this.initialize(this.tab);
      },
      deep: true,
    },
  },

  methods: {
    pagination(data) {
      this.paginationData = data;
    },
    getFirstDate(data) {
      let dump = JSON.parse(data);
      return dump[0];
    },

    isValidJSON(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    },

    isNotDeadlineToday(date) {
      let today = new Date();
      let deadline = new Date(date);

      if (today.setHours(0, 0, 0, 0) <= deadline.setHours(0, 0, 0, 0)) {
        return true;
      } else {
        return false;
      }
    },

    changeTab(tab) {
      this.activeTab = tab;
      this.initialize(tab.id);
      this.tab = tab.id;
    },

    initialize(status) {
      this.loading = true;
      if (status == 3) {
        this.axiosCall("/travel-order/archived", "GET").then((res) => {
          if (res) {
            let data = res.data;
            data.forEach((element, i) => {
              data[i].name = this.toTitleCase(element.name);
            });
            this.data = data;
            this.loading = false;
          }
        });
      } else if (status == 4) {
        this.axiosCall("/travel-order/pending", "GET").then((res) => {
          if (res) {
            let data = res.data;
            data.forEach((element, i) => {
              data[i].name = this.toTitleCase(element.name);
            });
            this.data = data;
            this.loading = false;
          }
        });
      } else if (status == 5) {
        this.axiosCall("/travel-order/cancelled", "GET").then((res) => {
          if (res) {
            let data = res.data;
            data.forEach((element, i) => {
              data[i].name = this.toTitleCase(element.name);
            });
            this.data = data;
            this.loading = false;
          }
        });
      } else {
        this.axiosCall("/travel-order/receive/" + status, "GET").then((res) => {
          if (res) {
            let data = res.data;
            data.forEach((element, i) => {
              data[i].name = this.toTitleCase(element.name);
            });
            this.data = data;
            this.loading = false;
          }
        });
      }
    },

    add() {
      this.updateData = [{ id: null }];
      this.action = "Add";
    },
    editItem(item) {
      this.updateData = item;
      this.action = "Update";
    },
    updateItem(item) {
      this.viewData = item;
      this.action = "Update";
    },
  },
};
</script>
