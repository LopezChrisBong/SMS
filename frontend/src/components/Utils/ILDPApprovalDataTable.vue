<template>
  <div>
    <v-row class="mx-2">
      <v-col cols="12" md="8" class="flex-items">
        <v-tabs v-model="activeTab" color="#5a67da" align-tabs="left">
          <v-tab v-for="tab in tabList" :key="tab.id" @click="changeTab(tab)">{{
            tab.name
          }}</v-tab>
        </v-tabs>
      </v-col>
      <v-spacer></v-spacer>
      <v-col
        cols="12"
        md="4"
        class="d-flex justify-between-center align-center"
      >
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
        <template v-slot:[`item.yearFrom`]="{ item }">
          {{ item.yearFrom + " - " + item.yearTo }}
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn x-small color="grey" outlined @click="editItem(item)">
            <v-icon size="14">mdi-pencil-outline</v-icon> View
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

    <ViewILDPApproval
      :data="updateData"
      :toApproveType="approver"
      :tab="tab"
      :action="action"
    />

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
    ViewILDPApproval: () =>
      import("../../components/Dialogs/Views/ViewILDPApproval.vue"),
  },
  props: ["reloadTable"],
  data: () => ({
    search: "",
    headers: [
      { text: "Name", value: "name", align: "start" },
      { text: "Calendar Year", value: "yearFrom", align: "center" },
      {
        text: "Actions",
        value: "actions",
        align: "center",
      },
    ],
    activeTab: { id: 1, name: "For Approval" },
    tab: 1,
    tabList: [
      { id: 1, name: "For Approval" },
      { id: 2, name: "Approved" },
      // { id: 3, name: "Pending" },
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
    deleteData: null,
    updateData: null,
    loading: false,
    options: {},
    action: null,
    paginationData: {},
    formdata: [],
    work_dates_menu: false,
    dialogConfirmDelete: false,
    approver: null,
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
        this.initialize(this.activeTab.id);
      },
      deep: true,
    },
  },
  mounted() {
    this.eventHub.$on("closeViewILDPApproval", () => {
      this.initialize(this.tab);
    });
  },
  beforeDestroy() {
    this.eventHub.$off("closeViewILDPApproval");
  },
  methods: {
    pagination(data) {
      this.paginationData = data;
    },
    initialize(status) {
      this.loading = true;
      // // dean/director
      // if (this.$store.state.user.user.user_roleID == 7) {
      //   this.axiosCall("/my-ildp/toApproveBy/" + status + "/7", "GET").then(
      //     (res) => {
      //       if (res) {
      //         console.log(res.data);
      //         this.data = res.data;
      //         this.loading = false;
      //       }
      //     }
      //   );
      // }

      // else
      //vice presidents
      if (this.$store.state.user.user.user_roleID == 6) {
        this.axiosCall("/my-ildp/toApproveBy/" + status + "/6", "GET").then(
          (res) => {
            if (res) {
              console.log(res.data);
              this.data = res.data;
              this.loading = false;
            }
          }
        );
      }
      //president
      else if (this.$store.state.user.user.user_roleID == 4) {
        this.axiosCall("/my-ildp/toApproveBy/" + status + "/4", "GET").then(
          (res) => {
            if (res) {
              console.log(res.data);
              this.data = res.data;
              this.loading = false;
            }
          }
        );
      }
      //immediate heads  /  dean/director
      else {
        // this.axiosCall("/my-ildp/getILDPToApprove/" + status, "GET").then(
        //   (res) => {
        //     if (res) {
        //       console.log(res.data);
        //       this.data = res.data;
        //       this.loading = false;
        //     }
        //   }
        // );
        this.axiosCall("/my-ildp/toApproveBy/" + status + "/7", "GET").then(
          (res) => {
            if (res) {
              console.log(res.data);
              this.data = res.data;
              this.loading = false;
            }
          }
        );
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
      // setTimeout(() => {
      //   this.updateData = { id: null };
      // }, 100);
      this.updateData = item;
      this.action = "Update";
      //immediate heads
      // if (this.$store.state.user.user.user_roleID == 7) {
      //   this.approver = "Dean/Dir";
      // }

      // else
      //vice presidents
      if (this.$store.state.user.user.user_roleID == 6) {
        this.approver = "VP";
      }
      //president
      else if (this.$store.state.user.user.user_roleID == 4) {
        this.approver = "President";
      } else {
        this.approver = "Dean/Dir";
      }
    },
    confirmDelete() {
      this.axiosCall("/request-type/" + this.deleteData.id, "DELETE").then(
        () => {
          this.fadeAwayMessage.show = true;
          this.itemData = null;
          this.initialize();
        }
      );
    },
  },
};
</script>
