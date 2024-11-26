<template>
  <div>
    <v-row class="mx-2">
      <v-col cols="12" md="6" class="">
        <v-tabs v-model="activeTab" color="#519043" align-tabs="left">
          <v-tab v-for="tab in tabList" :key="tab.id" @click="changeTab(tab)">{{
            tab.name
          }}</v-tab>
        </v-tabs>
      </v-col>
      <v-spacer></v-spacer>
      <!-- <v-col cols="12" md="3">
        <v-menu
          ref="work_dates_menu"
          :close-on-content-click="false"
          :return-value.sync="formdata.work_dates"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-combobox
              outlined
              v-model="formdata.work_dates"
              prepend-inner-icon="mdi-calendar"
              label="Work Dates"
              readonly
              single-line
              v-bind="attrs"
              v-on="on"
              color="#239FAB"
              class="rounded-lg"
              hide-details
              dense
            ></v-combobox>
          </template>
          <v-date-picker
            v-model="formdata.work_dates"
            no-title
            scrollable
            range
            color="#239FAB"
          >
            <v-spacer></v-spacer>
            <v-btn outlined color="#239FAB" @click="work_dates_menu = false">
              Cancel
            </v-btn>
            <v-btn
              color="#239FAB"
              class="white--text"
              @click="$refs.work_dates_menu.save(formdata.work_dates)"
            >
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>
      </v-col> -->
      <v-col cols="12" md="3">
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
    <v-card class="mx-5 mt-5 mb-1 dt-container" elevation="0" outlined>
      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="data"
        item-key="id"
        :search="search"
        :options.sync="options"
        @pagination="pagination"
        hide-default-footer
      >
        <template v-slot:[`item.fullname`]="{ item }">
          {{ item.fullname }}
          <!-- <span v-if="item.mname"
            >{{ item.fname }} {{ item.mname[0] }}. {{ item.lname }}</span
          >
          <span v-else>{{ item.fname }} {{ item.lname }}</span> -->
        </template>

        <template v-slot:[`item.isApproved`]="{ item }">
          <span>{{ item.isApproved == 1 ? "Approved" : "Pending" }}</span>
        </template>
        <!-- <template v-slot:item.statusID="{ item }">
          <span>{{ item.statusID }}</span>
        </template> -->
        <template v-slot:[`item.action`]="{ item }">
          <v-btn x-small color="grey" outlined class="mx-1" @click="view(item)">
            <v-icon size="14">mdi-eye</v-icon> View
          </v-btn>

          <v-btn
            x-small
            color="green"
            outlined
            class="mx-2"
            @click="printPDS(item)"
          >
            <v-icon size="14">mdi-printer</v-icon> Print
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    <v-row class="my-2 mx-5" align="center">
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
    <ViewEmployeePDSDialog :data="updateData" :statusType="tab" />

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
    // EmployeePDSDialog: () => import("../Dialogs/Forms/EmployeePDSDialog.vue"),
    ViewEmployeePDSDialog: () =>
      import("../Dialogs/Views/ViewEmployeePDSDialog.vue"),
  },
  data: () => ({
    search: "",
    headers: [
      { text: "Name", value: "fullname" },

      // { text: "Status", value: "isApproved", align: "center" },
      { text: "Action", value: "action", align: "right" },
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
      { id: 1, name: "For Approval" },
      { id: 2, name: "Approved" },
      { id: 3, name: "Pending" },
    ],
    options: {},
    paginationData: {},
    loading: false,
    formdata: [],
    work_dates_menu: false,
    fadeAwayMessage: {
      show: false,
      type: "success",
      header: "Successfully Added!",
      message: "",
      top: 10,
    },
    updateData: [],
  }),

  mounted() {
    this.eventHub.$on("closeViewEmployeePDSDialog", () => {
      this.initialize(this.tab);
    });
    // this.eventHub.$on("closeDispatchTechnicianDialog", () => {
    //   this.initialize();
    // });
    // this.eventHub.$on("closeVoidDialog", () => {
    //   this.initialize();
    // });
  },
  beforeDestroy() {
    this.eventHub.$off("closeViewEmployeePDSDialog");
    // this.eventHub.$off("closeDispatchTechnicianDialog");
    // this.eventHub.$off("closeVoidDialog");
  },

  watch: {
    options: {
      handler() {
        // if (this.tab == 1) {
        this.initialize(this.tab);

        // } else if (this.tab == 2) {
        //   this.getVerifiedUsers();
        // }
      },
      deep: true,
    },
  },
  methods: {
    pagination(data) {
      this.paginationData = data;
    },

    changeTab(tab) {
      this.activeTab = tab;
      this.tab = tab.id;
      this.initialize(tab.id);
    },
    initialize(status) {
      this.loading = true;
      this.axiosCall("/user-details/getAllUsersPDS/" + status, "GET").then(
        (res) => {
          let data = res.data;
          data.forEach((element, i) => {
            data[i].fullname = this.toTitleCase(element.fullname);
          });
          this.data = data;

          this.loading = false;
        }
      );
    },
    view(data) {
      this.updateData = data;
    },

    printPDS(data) {
      console.log(data);
      window.open(
        process.env.VUE_APP_SERVER + "/pdf-generator/generatePDS/" + data.id
      );
    },
  },
};
</script>
<style scoped>
.chip-status-1 {
  background-color: #ebfdff !important;
  color: #1abbb9 !important;
}
.chip-status-2 {
  background-color: #fff0f0 !important;
  color: #eb5757 !important;
}
.chip-status-3 {
  background-color: #fdffcc !important;
  color: #e6a400 !important;
}
.chip-status-4 {
  background-color: #e6e6e6 !important;
  color: #404040 !important;
}
.chip-status-5 {
  background-color: #fff0f0 !important;
  color: #ff3300 !important;
}

.chip-status-6 {
  background-color: #f0fff8 !important;
  color: #18ab56 !important;
}
</style>
