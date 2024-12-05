<template>
  <div>
    <v-row class="mx-2">
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
        <v-btn
          class="white--text ml-2 rounded-lg"
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
        <template v-slot:[`item.func_type`]="{ item }">
          {{ getFuncTypeDesc(item.func_type) }}
        </template>
        <template v-slot:[`item.eqt`]="{ item }">
          <div class="text-center">
            <div class="d-flex align-center justify-center">
              <div class="text-caption">E -</div>
              <div class="align-self-center">
                <v-icon color="#5a67da" v-if="item.eff_is_rated"
                  >mdi-check</v-icon
                >
                <v-chip x-small class="pa-1" v-if="!item.eff_is_rated"
                  >NR</v-chip
                >
              </div>
            </div>
            <div class="d-flex align-center justify-center">
              <div class="text-caption">Q -</div>
              <div class="align-self-center">
                <v-icon color="#5a67da" v-if="item.qly_is_rated"
                  >mdi-check</v-icon
                >
                <v-chip x-small class="pa-1" v-if="!item.qly_is_rated"
                  >NR</v-chip
                >
              </div>
            </div>
            <div class="d-flex align-center justify-center">
              <div class="text-caption">T -</div>
              <div class="align-self-center">
                <v-icon color="#5a67da" v-if="item.timeliness_is_rated"
                  >mdi-check</v-icon
                >
                <v-chip x-small class="pa-1" v-if="!item.timeliness_is_rated"
                  >NR</v-chip
                >
              </div>
            </div>
          </div>
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <v-btn
            class="mx-1"
            x-small
            color="warning"
            outlined
            @click="editItem(item)"
          >
            Update
          </v-btn>

          <v-btn
            class="mx-1"
            x-small
            @click="deleteItem(item)"
            outlined
            color="red"
            >Delete</v-btn
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

    <!-- delete dialog -->
    <v-dialog v-model="confirmDialog" persistent max-width="390">
      <v-card color="white">
        <div class="pa-4 #3a3b3a--text">
          <div class="text-h6 mb-1">WARNING!</div>
          <div class="text-body-1 mb-1">
            <p style="text-align: justify">
              <v-icon class="mt-n2" color="white">mdi-alert</v-icon> &nbsp; Are
              you sure you want to delete this information?<br /><br />
              Please note that
              <b>this action is irreversible.</b>
            </p>
          </div>
        </div>

        <!-- <v-card-title class="text-h5">
          Are you sure you want to proceed?
        </v-card-title> -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="cancelDelete()">
            Close
          </v-btn>
          <v-btn color="green" class="white--text" @click="confirmDelete()">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <AddIPCRSupportUtilDialog :data="itemData" :action="action" />

    <fade-away-message-component
      displayType="variation2"
      v-model="fadeAwayMessage.show"
      :message="fadeAwayMessage.message"
      :header="fadeAwayMessage.header"
      :top="fadeAwayMessage.top"
      :type="fadeAwayMessage.type"
      :timeout="5000"
    ></fade-away-message-component>
  </div>
</template>
<script>
export default {
  components: {
    AddIPCRSupportUtilDialog: () =>
      import("../../components/Dialogs/Forms/AddIPCRSupportUtilDialog.vue"),
  },
  data: () => ({
    confirmDialog: false,
    itemToDelete: null,
    search: "",
    func_List: [
      { id: 1, description: "Institutional Obligations" },
      { id: 2, description: "Intervening Function" },
    ],
    itemData: null,
    headers: [
      {
        text: "Function Type",
        value: "func_type",
        align: "start",
        valign: "center",
        sortable: false,
      },
      {
        text: "Success Indicator",
        value: "success_indicator",
        align: "center",
        valign: "center",
        width: 300,
        sortable: false,
      },
      {
        text: "Actual Accomplishment",
        value: "actual_accomp",
        align: "center",
        width: 300,
        valign: "center",
        sortable: false,
      },
      {
        text: "To Rate (E-Q-T)",
        value: "eqt",
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

    perPageChoices: [
      { text: "5", value: 5 },
      { text: "10", value: 10 },
      { text: "20", value: 20 },
      { text: "50", value: 50 },
      { text: "100", value: 100 },
      { text: "250", value: 250 },
      { text: "500", value: 500 },
    ],

    loading: false,
    options: {},
    action: null,
    paginationData: {},
    fadeAwayMessage: {
      show: false,
      type: "success",
      header: "Successfully Deleted!",
      message: "",
      top: 10,
    },
  }),

  mounted() {
    this.eventHub.$on("closeAddIPCRSupportUtilDialog", () => {
      this.initialize();
    });
  },

  beforeDestroy() {
    this.eventHub.$off("closeAddIPCRSupportUtilDialog");
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
    getFuncTypeDesc(id) {
      return this.func_List[id - 1].description;
    },
    pagination(data) {
      this.paginationData = data;
    },

    initialize() {
      this.axiosCall("/ipcr-support-util", "GET").then((res) => {
        if (res) {
          this.data = res.data;
          this.loading = false;
        }
      });
    },

    add() {
      this.itemData = { id: null };
      this.action = "Add";
    },

    editItem(item) {
      this.itemData = item;
      this.action = "Update";
    },
    deleteItem(item) {
      this.itemToDelete = item;
      this.confirmDialog = true;
    },
    confirmDelete() {
      this.axiosCall("/ipcr/" + this.itemToDelete.id, "DELETE").then((res) => {
        if (res.data.status == 200) {
          this.confirmDialog = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
          this.initialize();
        } else {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
        }
      });
    },
    cancelDelete() {
      this.itemToDelete = null;
      this.confirmDialog = false;
    },
  },
};
</script>
