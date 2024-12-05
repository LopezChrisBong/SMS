<template>
  <div>
    <v-row class="mx-2">
      <v-col cols="12" md="6" class="flex-items">
        <v-tabs v-model="activeTab" color="#5a67da" align-tabs="left">
          <v-tab v-for="tab in tabList" :key="tab.id" @click="changeTab(tab)">{{
            tab.name
          }}</v-tab>
        </v-tabs>
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
        <template v-slot:[`item.description`]="{ item }">
          {{ item.isDesignated ? item.description : "N/A" }}
        </template>
        <template v-slot:[`item.units`]="{ item }">
          {{ item.isDesignated ? item.units : "N/A" }}
        </template>
        <template v-slot:[`item.specialOrderNo`]="{ item }">
          {{ item.isDesignated ? item.specialOrderNo : "N/A" }}
        </template>
        <template v-slot:[`item.effectivityDate`]="{ item }">
          {{ item.isDesignated ? item.effectivityDate : "N/A" }}
        </template>
        <!-- <template v-slot:[`item.schoolYear`]="{ item }">
          {{ item.SY ? item.SY.syFrom + " - " + item.SY.syTo : "" }}
        </template> -->
        <template v-slot:[`item.isActive`]="{ item }">
          <v-chip
            :color="item.isActive ? '#5a67da' : 'grey'"
            class="ma-2 white--text"
            x-small
          >
            {{ item.isActive ? "Active" : "Inactive" }}
          </v-chip>
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <v-btn
            @click="viewItem(item, tab)"
            x-small
            color="grey"
            outlined
            class="white--text"
          >
            <v-icon size="14">mdi-eye</v-icon>
            View
          </v-btn>
          &nbsp;&nbsp;&nbsp;
          <!-- <v-btn
            v-if="tab == 1"
            x-small
            color="#5a67da"
            class="white--text"
            @click="confirmDialogBtn('approve', item)"
          >
            Approve
          </v-btn>
          &nbsp;&nbsp;&nbsp;
          <v-btn
            v-if="tab == 1"
            x-small
            color="#C62828"
            class="white--text"
            @click="confirmDialogBtn('pending', item)"
          >
            Pending
          </v-btn> -->
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
            color="#5a67da"
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

    <CoreTimeDesignationDialog :data="updateData" :action="action" />
    <ViewCTDApprovalDialog :data="viewData" :action="action" />

    <v-dialog v-model="confirmDialog" persistent max-width="290">
      <v-card color="white">
        <div class="pa-4 #3a3b3a--text">
          <div class="text-overline mb-1">WARNING!</div>
          <div class="text-body-1 mb-1">
            <p style="text-align: justify">
              <v-icon class="mt-n2" color="white">mdi-alert</v-icon> &nbsp; Are
              you sure you want to proceed?
            </p>
          </div>
        </div>

        <!-- <v-card-title class="text-h5">
          Are you sure you want to proceed?
        </v-card-title> -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="confirmDialog = false">
            Close
          </v-btn>
          <v-btn color="green" class="white--text" @click="saveUpdate()">
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
    CoreTimeDesignationDialog: () =>
      import("../../components/Dialogs/Forms/CoreTimeDesignationDialog.vue"),
    ViewCTDApprovalDialog: () =>
      import("../../components/Dialogs/Views/ViewCTDApprovalDialog.vue"),
  },
  data: () => ({
    search: "",
    headers: [
      { text: "Name", value: "name", align: "start", valign: "center" },

      {
        text: "Designation",
        value: "description",
        align: "center",
        valign: "center",
      },
      {
        text: "Office",
        value: "office_name",
        align: "center",
        valign: "center",
      },
      {
        text: "Units",
        value: "units",
        align: "center",
        valign: "center",
        sortable: false,
      },
      {
        text: "Special Order",
        value: "specialOrderNo",
        align: "center",
        valign: "center",
        sortable: false,
      },
      {
        text: "Effectivity Date",
        value: "effectivityDate",
        align: "center",
        valign: "center",
        sortable: false,
      },
      {
        text: "School Year",
        value: "schoolYear",
        align: "center",
        valign: "center",
        sortable: false,
      },
      {
        text: "Semester",
        value: "sem",
        align: "center",
        valign: "center",
        sortable: false,
      },
      {
        text: "Status",
        value: "isActive",
        align: "center",
        valign: "center",
        sortable: false,
      },
      {
        text: "Action",
        value: "action",
        align: "center",
        valign: "center",
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
    activeTab: { id: 1, name: "For Approval" },
    tab: 1,
    tabList: [
      { id: 1, name: "For Approval" },
      { id: 2, name: "Approved" },
      { id: 3, name: "Pending" },
    ],
    totalCount: 0,
    dataToUpdate: null,
    deleteData: null,
    updateData: null,
    viewData: null,
    loading: false,
    options: {},
    action: null,
    paginationData: {},
    formdata: [],
    work_dates_menu: false,
    confirmDialog: false,
    confirmAction: null,
    fadeAwayMessage: {
      show: false,
      type: "success",
      header: "Successfully Deleted!",
      message: "",
      top: 10,
    },
  }),

  mounted() {
    this.eventHub.$on("closeCoreTimeDesignationDialog", () => {
      this.initialize(this.tab);
    });
    this.eventHub.$on("closeViewCTDApprovalDialog", () => {
      this.initialize(this.tab);
    });
  },
  beforeDestroy() {
    this.eventHub.$off("closeCoreTimeDesignationDialog");
    this.eventHub.$off("closeViewCTDApprovalDialog");
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

    initialize(status) {
      this.loading = true;

      this.axiosCall(
        "/core-time-designation/getCTDByStatus/" + status,
        "GET"
      ).then((res) => {
        if (res) {
          console.log(res.data);
          let data = res.data;
          data.forEach((element, i) => {
            data[i].name = this.toTitleCase(element.name);
          });
          this.data = data;
          this.loading = false;
        }
      });
    },

    confirmDialogBtn(action, item) {
      this.dataToUpdate = item;
      this.confirmAction = action;
      this.confirmDialog = true;
    },

    saveUpdate() {
      console.log(this.confirmAction, this.dataToUpdate);
      if (this.confirmAction == "approve") {
        this.approve(this.dataToUpdate);
        this.confirmDialog = false;
      } else if (this.confirmAction == "pending") {
        this.pending(this.dataToUpdate);
        this.confirmDialog = false;
      }
    },

    approve(item) {
      let data = {
        id: item.id,
        status: 2,
      };
      this.axiosCall(
        "/core-time-designation/update-ctd-approval",
        "POST",
        data
      ).then((res) => {
        if (res.data.status == 200) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
          this.initialize(this.tab);
        } else if (res.data.status == 400) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
        }
      });
    },
    pending(item) {
      let data = {
        id: item.id,
        status: 3,
      };
      this.axiosCall(
        "/core-time-designation/update-ctd-approval",
        "POST",
        data
      ).then((res) => {
        if (res.data.status == 200) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
          this.initialize(this.tab);
        } else if (res.data.status == 400) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
        }
      });
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

    viewItem(item, tab) {
      console.log(tab);
      this.viewData = item;
      this.action = tab == 1 ? "for_approval" : "approved/pending";
    },
  },
};
</script>
