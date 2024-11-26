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

      <v-col cols="12" md="5" class="d-flex justify-space-between">
        <!-- <v-select
          dense
          outlined
          color="#519043"
          v-model="yearDefVal"
          @change="initialize()"
          hide-details
          style="max-width: 100px"
          class="rounded-lg mr-1"
          :items="yearList"
        >
        </v-select> -->
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
          class="white--text mx-1 rounded-lg"
          :color="$vuetify.theme.themes.light.submitBtns"
          @click="printSummary()"
        >
          <v-icon left> mdi-printer </v-icon>
          Print
        </v-btn>
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
        <template v-slot:[`item.lname`]="{ item }">
          {{
            item.mname
              ? item.lname + ", " + item.fname + " " + item.mname[0]
              : item.lname + ", " + item.fname
          }}
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn x-small outlined color="grey" @click="viewItem(item)">
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

    <ViewSALNDialog :data="updateData" :approval_tab="tab" />

    <v-dialog v-model="printSummarDialog" persistent max-width="500">
      <v-card color="white">
        <v-form ref="deadlineToAddTARFormref" @submit.prevent>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>Print SALN Summary</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="printSummarDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col class="text-h5 font-weight-bold ">
                  SALN year to print:
                  <span style="text-decoration:underline">{{
                    filterYear
                  }}</span>
                </v-col>
                <!-- <v-col class="mt-2" cols="12" v-if="isTARRequired">
                  <v-menu
                    ref="deadlineDateFromRef"
                    :close-on-content-click="false"
                    :return-value.sync="deadline_date"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        dense
                        v-model="deadline_date"
                        :rules="isTARRequired == 1 ? [formRules.required] : []"
                        chips
                        readonly
                        small-chips
                        color="#6DB249"
                        label="Deadline for adding TAR"
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="deadline_date"
                      :min="
                        new Date(travel_date_to).toISOString().substr(0, 10)
                      "
                      no-title
                      color="#6DB249"
                      scrollable
                    >
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        color="#6DB249"
                        @click="$refs.deadlineDateFromRef.save(deadline_date)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col> -->
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" outlined @click="printSummarDialog = false">
              Close
            </v-btn>
            <v-btn color="green" class="white--text" @click="confirmPrint()">
              Confirm
            </v-btn>
          </v-card-actions>
        </v-form>
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
    ViewSALNDialog: () =>
      import("../../components/Dialogs/Views/ViewSALNDialog.vue"),
  },
  data: () => ({
    search: "",
    headers: [
      { text: "Employee / Declarant", value: "name", align: "start" },
      { text: "Year", value: "saln_for_year", align: "start" },
      {
        text: "Action",
        value: "actions",
        align: "center",
        sortable: false,
        width: 200,
      },
    ],

    printSummarDialog: false,
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
    activeTab: { id: 1, name: "For Checking" },
    tab: 1,
    tabList: [
      { id: 1, name: "For Checking" },
      { id: 2, name: "Checked" },
      { id: 3, name: "Pending" },
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
    fadeAwayMessage: {
      show: false,
      type: "success",
      header: "Successfully Deleted!",
      message: "",
      top: 10,
    },
  }),

  mounted() {
    this.eventHub.$on("closeSALNDialog", () => {
      this.initialize();
    });
  },
  beforeDestroy() {
    this.eventHub.$off("closeSALNDialog");
  },

  watch: {
    options: {
      handler() {
        this.initialize();
      },
      deep: true,
    },
    filterYear: {
      handler(newData, oldData) {
        if (oldData != newData) {
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

  methods: {
    // generateYearList() {
    //   let d = new Date();
    //   for (let index = d.getFullYear(); index >= 2020; index--) {
    //     this.yearList.push(index);
    //   }
    // },

    printSummary() {
      this.printSummarDialog = true;
    },
    confirmPrint() {
      let url =
        process.env.VUE_APP_SERVER +
        "/pdf-generator/printSALNSummary/" +
        this.filterYear;
      window.open(url);
    },
    pagination(data) {
      this.paginationData = data;
    },

    changeTab(tab) {
      this.activeTab = tab;

      this.tab = tab.id;
      this.initialize();
    },

    changeFilter() {},

    initialize() {
      // console.log("tab", this.tab);
      this.loading = true;
      let filter = this.$store.getters.getFilterSelected;
      this.axiosCall("/saln/" + filter + "/" + this.tab, "GET").then((res) => {
        if (res) {
          let data = res.data;
          data.forEach((element, i) => {
            data[i].name = this.toTitleCase(element.name);
          });
          this.data = data;
          this.loading = false;
        }
      });
    },

    viewItem(item) {
      this.updateData = item;
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
