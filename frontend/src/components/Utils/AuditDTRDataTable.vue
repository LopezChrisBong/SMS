<template>
  <div>
    <v-row class="mx-2">
      <v-col cols="5" class="d-flex">
        <!-- <v-tabs v-model="activeTab" color="#519043" align-tabs="left">
          <v-tab v-for="tab in tabList" :key="tab.id" @click="changeTab(tab)">{{
            tab.name
          }}</v-tab>
        </v-tabs> -->
        <v-autocomplete
          :items="monthsArr"
          v-model="selectedMnth"
          item-text="mnth"
          item-value="val"
          outlined
          dense
          label="Month"
          class="rounded-lg mx-1"
        ></v-autocomplete>
        <v-autocomplete
          :items="dtr_filter"
          v-model="selectedDtrFilter"
          item-text="description"
          item-value="id"
          outlined
          dense
          label="Period"
          class="rounded-lg mx-1"
        ></v-autocomplete>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="6" class="d-flex justify-space-between">
        <v-text-field
          v-model="search"
          outlined
          prepend-inner-icon="search"
          label="Search"
          single-line
          hide-details
          class="rounded-lg"
          color="#519043"
          dense
        ></v-text-field>
      </v-col>
    </v-row>

    <v-card class="ma-5 dt-container" elevation="0" outlined>
      <v-data-table
        :headers="headers"
        :items="employees"
        :items-per-page="10"
        :search="search"
        :options.sync="options"
        :loading="loading"
        @pagination="pagination"
        hide-default-footer
      >
        <template v-slot:[`item.action`]="{ item }">
          <v-btn
            class="mx-1"
            x-small
            color="grey"
            outlined
            @click="viewItem(item)"
          >
            <v-icon size="14">mdi-eye</v-icon>
            View DTR
          </v-btn>
          <v-btn
            class="mx-1"
            x-small
            color="grey"
            outlined
            @click="viewCTItem(item)"
          >
            <v-icon size="14">mdi-eye</v-icon>
            View Coretime
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

    <ViewAuditDTR :data="viewData" />
    <ViewEmployeeCoreTimeDialog :data="ctViewData" />
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
import Papa from "papaparse";
export default {
  components: {
    ViewAuditDTR: () =>
      import("../../components/Dialogs/Views/ViewAuditDTR.vue"),
    ViewEmployeeCoreTimeDialog: () =>
      import("../../components/Dialogs/Views/ViewEmployeeCoreTimeDialog.vue"),
  },
  data: () => ({
    search: "",
    underDevtoDisplay: false,
    headers: [
      {
        text: "Employee",
        value: "name",
        align: "start",
        valign: "start",
      },
      {
        text: "Employee ID",
        value: "empID",
        align: "center",
        valign: "center",
      },
      {
        text: "Action",
        value: "action",
        align: "center",
        valign: "center",
      },
    ],
    dtr_filter: [
      {
        id: 1,
        description: "1st Quincena",
      },
      {
        id: 2,
        description: "2nd Quincena",
      },
      {
        id: 3,
        description: "Whole Month",
      },
    ],
    selectedDtrFilter: null,
    selectedMnth: null,
    monthsArr: [
      {
        val: "01",
        mnth: "January",
      },
      {
        val: "02",
        mnth: "February",
      },
      {
        val: "03",
        mnth: "March",
      },
      {
        val: "04",
        mnth: "April",
      },
      {
        val: "05",
        mnth: "May",
      },
      {
        val: "06",
        mnth: "June",
      },
      {
        val: "07",
        mnth: "July",
      },
      {
        val: "08",
        mnth: "August",
      },
      {
        val: "09",
        mnth: "September",
      },
      {
        val: "10",
        mnth: "October",
      },
      {
        val: "11",
        mnth: "November",
      },
      {
        val: "12",
        mnth: "December",
      },
    ],

    data: [],
    addData: null,
    csv_file: null,
    csv_results: [],
    employees: [],
    perPageChoices: [
      { text: "5", value: 5 },
      { text: "10", value: 10 },
      { text: "20", value: 20 },
      { text: "50", value: 50 },
      { text: "100", value: 100 },
      { text: "250", value: 250 },
      { text: "500", value: 500 },
    ],
    activeTab: { id: 1, name: "My Leave Credits" },
    tab: 1,
    tabList: [
      { id: 1, name: "My Leave Credits" },
      { id: 2, name: "My Leave Application" },
      { id: 3, name: "My Leave Card" },
      { id: 4, name: "My CTO" },
    ],

    confirmDialog: false,
    confirmAction: null,
    confirmApprovalID: null,
    viewData: null,
    ctViewData: null,
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
        // console.log(this.activeTab);
        this.initialize();
      },
      deep: true,
    },
    filterYear: {
      handler(newData, oldData) {
        if (oldData != newData) {
          console.log(oldData, newData);
          this.initialize();
        }
      },
      deep: true,
    },
  },
  computed: {
    filterYear() {
      return this.$store.getters.getFilterSelected;
    },
  },
  mounted() {
    // this.loadLeaveCredits();
    this.eventHub.$on("closeDTRDialog", () => {
      this.initialize();
    });
    this.eventHub.$on("closeViewEmployeeDTRDialog", () => {
      this.initialize();
    });
    this.eventHub.$on("closeViewEmployeeCoreTimeDialog", () => {
      this.initialize();
    });
  },
  beforeDestroy() {
    this.eventHub.$off("closeDTRDialog");
    this.eventHub.$off("closeViewEmployeeDTRDialog");
    this.eventHub.$off("closeViewEmployeeCoreTimeDialog");
  },

  methods: {
    parseCSV() {
      Papa.parse(this.csv_file, {
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
          console.log("results", results);
          this.csv_results = results;
          this.parsed = true;
        }.bind(this),
      });
    },

    pagination(data) {
      this.paginationData = data;
    },

    changeTab(tab) {
      this.activeTab = tab;
      this.tab = tab.id;
      this.initialize(tab.id);
    },

    initialize() {
      // this.employees = [];
      this.loading = true;
      this.axiosCall("/dtr/getActiveEmployees", "GET").then((res) => {
        if (res) {
          let data = res.data;
          data.forEach((element, i) => {
            data[i].name = this.toTitleCase(element.name);
          });

          this.employees = data;
          this.loading = false;
        }
      });
    },

    add() {
      this.addData = { id: null };
      this.action = "Add";
    },

    viewItem(item) {
      let data = item;
      let mnthyr;
      let period;
      if (this.filterYear != "All") {
        if (this.selectedMnth && this.selectedDtrFilter) {
          mnthyr = this.filterYear + "-" + this.selectedMnth + "-01";
          period = this.selectedDtrFilter;
        } else {
          period = 1;
          let d = new Date();
          let mm = this.monthsArr[d.getMonth()].val;
          let yy = d.getFullYear();
          mnthyr = yy + "-" + mm + "-01";
        }

        Object.assign(data, { monthyr: mnthyr, period: period });
        this.viewData = data;
        this.action = "View";
      }
    },

    printItem(item) {
      const url =
        process.env.VUE_APP_SERVER +
        "/pdf-generator/print-employee-assessment/" +
        item.EA_id;
      window.open(url);
    },

    viewCTItem(item) {
      console.log(item);
      this.loadCoreTime(item.id);
    },

    loadCoreTime(id) {
      this.axiosCall("/my-core-time/getByUser/" + id, "GET").then((res) => {
        if (res) {
          console.log(res.data[0]);
          this.ctViewData = res.data ? res.data[0] : [];
        }
      });
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

<style scoped>
.table {
  width: 100%;
  border-collapse: collapse;
}
table,
td {
  border-bottom: 1px solid rgb(206, 202, 202);
}
tr:first-child th:first-child {
  border-top-left-radius: 10px;
}
tr:first-child th:last-child {
  border-top-right-radius: 10px;
}

tr:last-child td:first-child {
  border-bottom-left-radius: 10px;
}
tr:last-child td:last-child {
  border-bottom-right-radius: 10px;
}

/* tr:nth-child(2) th:first-child {
  border-top-left-radius: none;
}
tr:nth-child(2) th:last-child {
  border-top-right-radius: none;
} */

tr td:first-child {
  border-left: 1px solid rgb(206, 202, 202);
}
tr td:last-child {
  border-right: 1px solid rgb(206, 202, 202);
}
</style>
