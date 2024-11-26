<template>
  <div>
    <v-row class="mx-2">
      <v-spacer></v-spacer>

      <v-col cols="4" class="d-flex justify-space-between">
        <v-text-field
          v-model="search"
          outlined
          prepend-inner-icon="search"
          label="Search"
          single-line
          hide-details
          class="rounded-lg mx-1"
          color="#239FAB"
          dense
        ></v-text-field>
        <v-btn
          class="white--text rounded-lg mx-1"
          :color="$vuetify.theme.themes.light.submitBtns"
          @click="add()"
        >
          <v-icon left> mdi-plus-box-outline </v-icon>
          Add New
        </v-btn>
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
        <template v-slot:[`item.fy_from`]="{ item }">
          {{ formatDate(item.fy_from) }}
        </template>
        <template v-slot:[`item.fy_to`]="{ item }">
          {{ formatDate(item.fy_to) }}
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <v-chip
            x-small
            :color="item.status == 1 ? 'green' : 'red'"
            text-color="white"
          >
            {{ item.status == 1 ? "Active" : "Inactive" }}
          </v-chip>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            x-small
            color="grey"
            class="mx-1"
            outlined
            @click="editItem(item)"
          >
            <v-icon size="14">mdi-pencil-outline</v-icon> Update
          </v-btn>

          <v-btn
            x-small
            color="grey"
            class="mx-1"
            outlined
            @click="viewItem(item)"
          >
            <v-icon size="14">mdi-eye</v-icon> View
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    <v-row class="mb-2 mx-5" align="center">
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

    <ViewSalaryGrade :data="viewData" />
    <FiscalBudgetYearDialog :data="updateData" :action="action" />

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
    ViewSalaryGrade: () =>
      import("../../components/Dialogs/Views/ViewSalaryGrade.vue"),
    FiscalBudgetYearDialog: () =>
      import("../../components/Dialogs/Forms/FiscalBudgetYearDialog.vue"),
  },

  data: () => ({
    search: "",
    headers: [
      { text: "Title", value: "title", align: "start" },
      { text: "Date (From)", value: "fy_from", align: "start" },
      { text: "Date (To)", value: "fy_to", align: "start" },
      // { text: "Status", value: "status", align: "center" },
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
    totalCount: 0,
    viewData: null,
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
  watch: {
    options: {
      handler() {
        this.initialize();
      },
      deep: true,
    },
  },
  mounted() {
    this.eventHub.$on("closeFiscalBudgetYearDialog", () => {
      this.initialize();
    });
    this.eventHub.$on("closeViewSalaryGrade", () => {
      this.initialize();
    });
  },
  beforeDestroy() {
    this.eventHub.$off("closeFiscalBudgetYearDialog");
    this.eventHub.$off("closeViewSalaryGrade");
  },
  methods: {
    pagination(data) {
      this.paginationData = data;
    },
    initialize() {
      this.loading = true;
      this.axiosCall("/salary-fy-guide", "GET").then((res) => {
        if (res) {
          this.data = res.data;
          this.loading = false;
        }
      });
    },

    add() {
      this.updateData = { id: null };
      this.action = "Add";
    },

    editItem(item) {
      this.updateData = item;
      this.action = "Update";
    },
    viewItem(item) {
      setTimeout(() => {
        this.viewData = [{ id: null }];
      }, 100);
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
