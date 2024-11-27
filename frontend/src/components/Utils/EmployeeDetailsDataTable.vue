<template>
  <div>
    <v-row class="mx-2">
      <v-col cols="12" md="8"> </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12" md="4" class="d-flex justify-space-between align-center">
        <v-text-field
          v-model="search"
          outlined
          prepend-inner-icon="search"
          label="Search"
          hide-details
          class="rounded-lg"
          color="#93CB5B"
          dense
        ></v-text-field>

        <!-- <v-btn color="#519043" outlined class="ml-2" @click="viewPrintOption()">
          <v-icon class="mr-1">mdi-printer</v-icon>
          Print
        </v-btn> -->
        <!-- <v-btn color="#519043" outlined class="ml-2" @click="printEmpCount()">
          <v-icon class="mr-1">mdi-printer</v-icon>
          Print Employee Count
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
        <!-- <template v-slot:[`item.lname`]="{ item }">
          {{
            item.mname
              ? item.lname + ", " + item.fname + " " + item.mname[0] + "."
              : item.lname + ", " + item.fname
          }}
        </template> -->
        <template v-slot:[`item.date_hired`]="{ item }">
          {{ item.date_hired ? formatDate(item.date_hired) : "" }}
        </template>
        <template v-slot:[`item.isActive`]="{ item }">
          <v-chip
            class="ma-1"
            x-small
            :color="item.isActive ? 'green' : 'red'"
            text-color="white"
          >
            {{ item.isActive ? "Active" : "Inactive" }}
          </v-chip>
        </template>
        <template v-slot:[`item.inactive_type`]="{ item }">
          <div v-if="!item.isActive">
            {{ getInactiveType(item.inactive_type) }}
          </div>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            x-small
            color="grey"
            class="mx-1"
            outlined
            @click="viewItem(item)"
          >
            <v-icon size="14">mdi-eye</v-icon> View
          </v-btn>
          <!-- <v-btn
            x-small
            color="grey"
            class="mx-1"
            outlined
            @click="editItem(item)"
          >
            <v-icon size="14">mdi-pencil-outline</v-icon> Update
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

    <EmployeeDetailsDialog
      :data="updateData"
      :action="action"
      v-on:refreshTable="initialize()"
    />
    <ViewEmployeeDetailDialog :data="viewData" />
    <v-dialog persistent v-model="dialogPrintOption" max-width="500">
      <v-card>
        <v-card-title dark class="dialog-header">
          <span>Type of Report</span>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="dialogPrintOption = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-col> </v-col>
        <v-card-text style="max-height: 700px"> </v-card-text>

        <v-card-actions class="pa-5">
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="dialogPrintOption = false">
            <v-icon>mdi-close-circle-outline</v-icon>
            Cancel
          </v-btn>
          <v-btn color="#5A67DA" class="white--text" @click="print()">
            <v-icon class="mr-1">mdi-printer</v-icon>
            Print
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
    EmployeeDetailsDialog: () =>
      import("../../components/Dialogs/Forms/EmployeeDetailsDialog.vue"),
    ViewEmployeeDetailDialog: () =>
      import("../../components/Dialogs/Views/ViewEmployeeDetailDialog.vue"),
  },
  data: () => ({
    search: "",
    monthsList: [
      { id: 1, name: "January" },
      { id: 2, name: "February" },
      { id: 3, name: "March" },
      { id: 4, name: "April" },
      { id: 5, name: "May" },
      { id: 6, name: "June" },
      { id: 7, name: "July" },
      { id: 8, name: "August" },
      { id: 9, name: "September" },
      { id: 10, name: "October" },
      { id: 11, name: "November" },
      { id: 12, name: "December" },
    ],
    yearList: [],
    selectedMonth: null,
    selectedYear: null,
    toPrint: null,
    headers: [
      { text: "Lastname", value: "lname", align: "start" },
      { text: "First Name", value: "fname", align: "center" },
      { text: "Middle Name", value: "mname", align: "center" },
      { text: "Sex", value: "sex", align: "center" },
      { text: "Mobile No.", value: "mobile_no", align: "center" },
      {
        text: "Actions",
        value: "actions",
        align: "center",
        sortable: false,
        width: 200,
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
    inActiveStatusList: [
      { id: 1, type: "Resigned" },
      { id: 2, type: "Retired" },
      { id: 3, type: "End of Contract" },
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
    work_dates_menu: false,
    dialogConfirmDelete: false,
    dialogPrintOption: false,
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
      },
      deep: true,
    },
  },
  mounted() {
    this.loadYear();
    this.eventHub.$on("closeViewEmployeeDetailDialog", () => {
      this.initialize();
    });
    this.eventHub.$on("closeEmployeeDetailDialog", () => {
      this.initialize();
    });
  },
  beforeDestroy() {
    this.eventHub.$off("closeViewEmployeeDetailDialog");
    this.eventHub.$off("closeEmployeeDetailDialog");
  },
  methods: {
    pagination(data) {
      this.paginationData = data;
    },

    initialize() {
      this.loading = true;
      this.axiosCall("/user-details", "GET").then((res) => {
        if (res) {
          let data = res.data;
          this.data = data;
          this.loading = false;
        }
      });
    },

    getInactiveType(id) {
      let data;
      for (let i = 0; i < this.inActiveStatusList.length; i++) {
        if (id == this.inActiveStatusList[i].id) {
          data = this.inActiveStatusList[i].type;
        }
      }
      return data;
    },

    loadYear() {
      let curYear;
      var d = new Date();
      curYear = d.getFullYear();
      for (let i = curYear; i >= 2020; i--) {
        this.yearList.push(i);
      }
    },

    print() {
      if (this.$refs.PrintFormref.validate()) {
        if (this.toPrint != 8) {
          window.open(
            process.env.VUE_APP_SERVER +
              "/pdf-generator/profileList/" +
              this.toPrint
          );
        } else {
          this.printEmpCount();
        }
      }
    },

    printEmpCount() {
      window.open(
        process.env.VUE_APP_SERVER +
          "/pdf-generator/getEmployeeStats?month=" +
          this.selectedMonth +
          "&year=" +
          this.selectedYear
      );
    },

    viewPrintOption() {
      this.dialogPrintOption = true;
      this.$refs.PrintFormref.reset();
    },
    deleteItem(item) {
      this.dialogConfirmDelete = true;
      this.deleteData = item;
    },
    editItem(item) {
      // setTimeout(() => {
      //   this.updateData = [{ id: null }];
      // }, 100);
      this.updateData = item;
      this.action = "Update";
    },
    viewItem(item) {
      // setTimeout(() => {
      //   this.viewData = null;
      // }, 100);
      this.viewData = item;
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
