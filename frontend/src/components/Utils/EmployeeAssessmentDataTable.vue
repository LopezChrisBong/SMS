<template>
  <div>
    <v-row class="mx-2">
      <v-col cols="12" md="8" class="pa-0">
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
        <template v-slot:[`item.name`]="{ item }">
          {{ item.name }}
        </template>
        <template v-slot:[`item.TO_travel_date_from`]="{ item }">
          {{
            formatDate(item.TO_travel_date_from) +
              " - " +
              formatDate(item.TO_travel_date_to)
          }}
        </template>

        <template v-slot:[`item.assessment_date`]="{ item }">
          {{
            formatDate(item.EA_assessment_date_from) +
              " - " +
              formatDate(item.EA_assessment_date_to)
          }}
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            elevation="2"
            color="#17C800"
            class="white--text mx-1"
            x-small
            @click="viewItem('Create', item)"
          >
            <v-icon size="14">mdi-eye</v-icon>
            view</v-btn
          >
          <v-btn
            v-if="tab == 3"
            class="mx-1"
            color="#17C800"
            outlined
            x-small
            @click="printItem(item)"
          >
            <v-icon size="14">mdi-printer</v-icon>
            print</v-btn
          >
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
            color="#519043"
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

    <EmployeeAssessmentDialog :data="viewData" :action="action" :tab="tab" />

    <v-dialog v-model="confirmDialog" persistent max-width="290">
      <v-card color="white">
        <div class="pa-4 #3a3b3a--text">
          <div class="text-overline mb-1">WARNING!</div>
          <div class="text-body-1 mb-1">
            <p style="text-align: justify">
              <v-icon class="mt-n2" color="white">mdi-alert</v-icon> &nbsp; Are
              you sure you want to {{ confirmAction }} this locator slip?
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
          <v-btn
            v-if="confirmAction == 'approve'"
            color="green"
            class="white--text"
            @click="approve()"
          >
            Confirm
          </v-btn>
          <v-btn
            v-if="confirmAction == 'deny'"
            color="green"
            class="white--text"
            @click="deny()"
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
    EmployeeAssessmentDialog: () =>
      import("../../components/Dialogs/Forms/EmployeeAssessmentDialog.vue"),
  },
  data: () => ({
    search: "",
    headers: [
      { text: "Name", value: "name", align: "start", valign: "center" },
      {
        text: "Title",
        value: "title",
        align: "center",
        valign: "center",
      },
      {
        text: "Travel Date/s",
        value: "TO_travel_date_from",
        align: "center",
        valign: "center",
      },

      {
        text: "Actions",
        value: "actions",
        align: "center",
        valign: "center",
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
    activeTab: { id: 1, name: "For Assessment" },
    tab: 1,
    tabList: [
      { id: 1, name: "For Assessment Creation" },
      { id: 2, name: "For Assessment" },
      { id: 3, name: "Assessed" },
    ],
    totalCount: 0,
    confirmDialog: false,
    confirmAction: null,
    confirmApprovalID: null,
    viewData: null,
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
  watch: {
    options: {
      handler() {
        this.initialize(this.tab);
      },
      deep: true,
    },
  },
  mounted() {
    this.eventHub.$on("closeEmployeeAssessmentDialog", () => {
      this.initialize(this.tab);
    });
  },
  beforeDestroy() {
    this.eventHub.$off("closeEmployeeAssessmentDialog");
  },

  methods: {
    pagination(data) {
      this.paginationData = data;
    },

    changeTab(tab) {
      this.activeTab = tab;
      this.initialize(tab.id);
      this.tab = tab.id;
      if (tab.id == 1) {
        const list = this.headers.find((element) => {
          if (element.text === "Assessment Dates") {
            return true;
          }

          return false;
        });
        if (list) {
          this.headers.splice(3, 1);
        }
      } else if (tab.id != 1) {
        const list = this.headers.find((element) => {
          if (element.text === "Assessment Dates") {
            return true;
          }

          return false;
        });
        if (!list) {
          this.headers.splice(3, 0, {
            text: "Assessment Dates",
            value: "assessment_date",
            align: "center",
          });
        }
      }
    },

    initialize(status) {
      this.loading = true;

      this.axiosCall("/tar/getEmployeeForAssessment/" + status, "GET").then(
        (res) => {
          if (res) {
            // console.log(res.data);
            let data = res.data;
            data.forEach((element, i) => {
              data[i].name = this.toTitleCase(element.name);
            });
            this.data = data;
            this.loading = false;
          }
        }
      );
    },

    viewItem(action, item) {
      this.viewData = item;
      this.action = action;
    },

    printItem(item) {
      const url =
        process.env.VUE_APP_SERVER +
        "/pdf-generator/print-employee-assessment/" +
        item.EA_id;
      window.open(url);
    },

    approve() {
      let data = {
        id: this.confirmApprovalID,
        status: 2,
      };
      // console.log(data);
      this.axiosCall("/my-locator-slip/approve-locator", "POST", data).then(
        (res) => {
          if (res.data.status == 200) {
            this.confirmDialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.message = res.data.msg;
            this.fadeAwayMessage.header = "System Message";
            this.initialize(this.tab);
          } else if (res.data.status == 400) {
            this.confirmDialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.initialize(this.tab);
          }
        }
      );
    },
    deleteItem(item) {
      this.dialogConfirmDelete = true;
      this.deleteData = item;
    },
    editItem(item) {
      this.updateData = [{ id: null }];
      setTimeout(() => {
        this.updateData = item;
        this.action = "Update";
      }, 100);
    },
    confirm(action, item) {
      // console.log(item);
      this.confirmAction = action;
      this.confirmDialog = true;
      this.confirmApprovalID = item.id;
    },
  },
};
</script>
