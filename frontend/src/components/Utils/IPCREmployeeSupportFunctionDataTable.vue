<template>
  <div>
    <v-row class="mx-2">
      <v-col cols="12" md="6"> </v-col>
      <v-spacer></v-spacer>
      <v-col
        cols="12"
        md="6"
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
        <!-- <v-autocomplete
          :items="periodList"
          v-model="period"
          item-text="description"
          item-value="id"
          @change="changePeriod()"
          outlined
          dense
          color="#239FAB"
          label="Period"
          class="rounded-lg mx-2 mt-6 "
        ></v-autocomplete> -->
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
        <!-- <template v-slot:[`item.period`]="{ item }">
          {{ periodList[item.period - 1].description }}
        </template> -->
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            v-if="item.support_functions.length > 0"
            x-small
            color="grey"
            outlined
            @click="editItem(item)"
          >
            <v-icon size="14">mdi-pencil-outline</v-icon> Rate
          </v-btn>

          <!-- <v-btn
                small
                color="grey"
                icon
                @click="deleteItem(item)"
              >
                <v-icon color="red darken-2">mdi-trash-can-outline</v-icon>
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

    <IPCRSupportDialog
      :moduleFrom="'Admin'"
      :data="updateData"
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
    // IPCRQualityUtilDialog: () =>
    //   import("../../components/Dialogs/Forms/IPCRQualityUtilDialog.vue"),
    IPCRSupportDialog: () =>
      import("../../components/Dialogs/Forms/IPCRSupportDialog.vue"),
  },
  data: () => ({
    search: "",
    headers: [
      { text: "Name", value: "name", align: "start" },
      { text: "Period", value: "period", align: "center" },
      { text: "Year", value: "year", align: "center" },

      {
        text: "Actions",
        value: "actions",
        align: "center",
        sortable: false,
        width: 200,
      },
    ],
    periodList: [
      {
        id: 1,
        description: "January to June",
      },
      {
        id: 2,
        description: "July to December",
      },
      {
        id: 3,
        description: "January to December",
      },
    ],
    period: null,
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
        this.period = 1;
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
  mounted() {
    this.eventHub.$on("closeIPCRSupportDialog", () => {
      this.initialize();
    });
  },
  beforeDestroy() {
    this.eventHub.$off("closeIPCRSupportDialog");
  },
  computed: {
    filterYear() {
      return this.$store.getters.getFilterSelected;
    },
  },
  methods: {
    pagination(data) {
      this.paginationData = data;
    },
    initialize() {
      this.loading = true;
      this.axiosCall("/ipcr-support/getToRate/" + this.filterYear, "GET").then(
        (res) => {
          if (res) {
            let data = res.data;
            for (let i = 0; i < data.length; i++) {
              let element = data[i];
              data[i].name = this.toTitleCase(element.name);
            }
            this.data = data;
            this.loading = false;
          }
        }
      );
    },
    changePeriod() {
      this.initialize();
    },
    deleteItem(item) {
      this.dialogConfirmDelete = true;
      this.deleteData = item;
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
    },
  },
};
</script>
