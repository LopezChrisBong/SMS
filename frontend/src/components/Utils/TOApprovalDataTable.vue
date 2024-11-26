<template>
  <div>
    <v-row class="mx-2">
      <v-col cols="12" md="8" class="flex-items">
        <v-tabs v-model="activeTab" color="#519043" align-tabs="left">
          <v-tab
            :disabled="loading"
            v-for="tab in tabList"
            :key="tab.id"
            @click="changeTab(tab)"
            >{{ tab.name }}</v-tab
          >
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
        <template v-slot:[`item.travel_date_from`]="{ item }">
          {{
            isValidJSON(item.travel_date_from)
              ? formatDate(getFirstDate(item.travel_date_from))
              : formatDate(item.travel_date_from)
          }}
          -
          {{ formatDate(item.travel_date_to) }}
        </template>

        <template v-slot:[`item.action`]="{ item }">
          <v-btn x-small color="grey" outlined @click="viewItem(item)">
            <v-icon size="14"> mdi-eye</v-icon>
            view
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

    <ViewTOApproval
      :data="dataForApproval"
      :toApproveType="toApproveType"
      :tab="tab"
    />
    <!-- <ViewTOAttachments :data="updateData" :action="action" /> -->

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

    <!-- remarks dialog -->

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
    // ViewTOAttachments: () =>
    //   import("../../components/Dialogs/Views/ViewTOAttachments.vue"),
    ViewTOApproval: () =>
      import("../../components/Dialogs/Views/ViewTOApproval.vue"),
  },
  data: () => ({
    search: "",
    headers: [
      { text: "TO #", value: "travel_order_num", align: "start" },
      { text: "Date of Travel", value: "travel_date_from", align: "start" },
      { text: "Place/s of Travel", value: "travel_place", align: "start" },
      { text: "Purpose", value: "travel_purpose", align: "start" },

      {
        text: "Action",
        value: "action",
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

    activeTab: null,

    tab: 1,
    tabList: [
      { id: 1, name: "For Approval" },
      { id: 2, name: "Approved" },
      { id: 3, name: "Pending" },
    ],
    dataForApproval: null,

    toApproveType: null,
    totalCount: 0,
    deleteData: null,
    updateData: null,
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
    this.eventHub.$on("closeViewTOApproval", () => {
      this.initialize(this.tab);
    });
  },
  beforeDestroy() {
    this.eventHub.$off("closeViewTOApproval");
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

    initialize(status) {
      this.loading = true;

      // if (this.$store.state.user.user.user_roleID == 11) {
      //   // accountant user role
      //   this.toApproveType = "finDir";
      //   this.axiosCall("/travel-order/getFinDirApproval/" + status, "GET").then(
      //     (res) => {
      //       if (res) {
      //         // console.log(res.data);
      //         this.data = res.data;
      //         this.loading = false;
      //       }
      //     }
      //   );
      // } else if (this.$store.state.user.user.user_roleID == 4) {
      //   // president user role
      //   this.toApproveType = "president";
      //   this.axiosCall(
      //     "/travel-order/getPresidentApproval/" + status,
      //     "GET"
      //   ).then((res) => {
      //     if (res) {
      //       // console.log(res.data);
      //       this.data = res.data;
      //       this.loading = false;
      //     }
      //   });
      // } else {
      //   this.toApproveType = "recommending";
      //   this.axiosCall(
      //     "/travel-order/getForRecommendingApproval/" + status,
      //     "GET"
      //   ).then((res) => {
      //     if (res) {
      //       // console.log(res.data);
      //       this.data = res.data;
      //       this.loading = false;
      //     }
      //   });
      // }
      //dump
      //  this.toApproveType = "recommending";

      this.axiosCall("/travel-order/getApproval/" + status, "GET").then(
        (res) => {
          if (res) {
            // console.log(res.data);
            this.data = res.data;
            this.loading = false;
          }
        }
      );
    },

    getVerifiedUsers() {
      this.loading = true;

      this.axiosCall("/user-details/getAllVerifiedUser", "GET").then((res) => {
        if (res) {
          this.data = [];

          this.data = res.data;
          this.loading = false;
        }
      });
    },

    changeTab(tab) {
      this.activeTab = tab;

      if (tab.id == 1) {
        this.initialize(1);
        this.tab = tab.id;
      } else if (tab.id == 2) {
        this.initialize(2);
        this.tab = tab.id;
      } else if (tab.id == 3) {
        this.initialize(3);
        this.tab = tab.id;
      }
    },
    add() {
      this.updateData = [{ id: null }];
      this.action = "Add";
    },
    viewItem(item) {
      this.dataForApproval = item;
      this.toApproveType = item.toApproveType;
      this.action = "Update";
    },
    // confirmDelete() {
    //   this.axiosCall("/request-type/" + this.deleteData.id, "DELETE").then(
    //     () => {
    //       this.fadeAwayMessage.show = true;
    //       this.itemData = null;
    //       this.initialize();
    //     }
    //   );
    // },
  },
};
</script>
