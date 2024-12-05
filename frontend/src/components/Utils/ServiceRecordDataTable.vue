<template>
  <div>
    <v-row class="mx-2">
      <v-col cols="12" md="8" class="flex-items">
        <!-- <v-tabs v-model="activeTab" color="#5a67da" align-tabs="left">
          <v-tab v-for="tab in tabList" :key="tab.id" @click="changeTab(tab)">{{
            tab.name
          }}</v-tab>
        </v-tabs> -->
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
          :color="$vuetify.theme.themes.light.submitBtns"
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
        <template v-slot:[`item.reqType`]="{ item }">
          {{ getDocumentRequestedType(item.reqType) }}
        </template>
        <template v-slot:[`item.document_requested_id`]="{ item }">
          {{ getType(item.document_requested_id) }}
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn x-small color="grey" outlined @click="selectToView(item)">
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

    <ViewServiceRecordDialog :data="updateData" :action="action" :tab="tab" />

    <v-dialog
      v-model="selectToPreviewDialog"
      eager
      scrollable
      persistent
      max-width="500px"
      transition="dialog-bottom-transition"
    >
      <v-form ref="selectToPreviewFormref" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>Select to preview Service Record </span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="selectToPreviewDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 800px" class="my-4">
            <v-row>
              <v-col class="mt-2" cols="12">
                <v-autocomplete
                  v-model="selectedToPreview"
                  :rules="[formRules.required]"
                  dense
                  outlined
                  class="rounded-lg"
                  label="Type to Preview"
                  color="#93CB5B"
                  :items="srvcRcrdToGen"
                >
                </v-autocomplete>
              </v-col>
              <v-col cols="6" v-if="selectedToPreview == 'Range'">
                <v-menu
                  ref="SelectDateFromRef"
                  :close-on-content-click="false"
                  :return-value.sync="selectDateFrom"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      outlined
                      dense
                      v-model="selectDateFrom"
                      :rules="
                        selectedToPreview == 'Range' ? [formRules.required] : []
                      "
                      chips
                      small-chips
                      color="#6DB249"
                      label="From"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="selectDateFrom"
                    no-title
                    color="#6DB249"
                    scrollable
                  >
                    <v-spacer></v-spacer>

                    <v-btn
                      text
                      color="#6DB249"
                      @click="$refs.SelectDateFromRef.save(selectDateFrom)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="6" v-if="selectedToPreview == 'Range'">
                <v-menu
                  ref="SelectDateToRef"
                  :close-on-content-click="false"
                  :return-value.sync="selectDateTo"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      outlined
                      dense
                      v-model="selectDateTo"
                      :rules="
                        selectedToPreview == 'Range' ? [formRules.required] : []
                      "
                      chips
                      small-chips
                      color="#6DB249"
                      label="To"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="selectDateTo"
                    no-title
                    color="#6DB249"
                    scrollable
                  >
                    <v-spacer></v-spacer>

                    <v-btn
                      text
                      color="#6DB249"
                      @click="$refs.SelectDateToRef.save(selectDateTo)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions class="pa-5">
            <v-spacer></v-spacer>
            <v-btn color="red" outlined @click="selectToPreviewDialog = false">
              Close
            </v-btn>
            <v-btn color="#5a67da" @click="preview()" class="white--text">
              Preview and Edit
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
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
    ViewServiceRecordDialog: () =>
      import("../Dialogs/Views/ViewServiceRecordDialog.vue"),
  },
  data: () => ({
    search: "",
    headers: [
      { text: "Last Name", value: "lname", align: "start" },
      { text: "First Name", value: "fname", align: "center" },
      { text: "Middle Name", value: "mname", align: "center" },
      { text: "Sex", value: "sex", align: "center" },
      { text: "Position", value: "positionDesc", align: "center" },

      {
        text: "Actions",
        value: "actions",
        align: "center",
        sortable: false,
        width: 200,
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
    activeTab: { id: 1, name: "Requests" },
    tab: 1,
    tabList: [
      { id: 1, name: "Requests" },
      { id: 2, name: "Claimed" },
    ],
    selectToPreviewDialog: false,
    srvcRcrdToGen: ["Range", "All"],
    selectedToPreview: null,
    selectDateFrom: null,
    selectDateTo: null,
    dataToPreview: null,
    totalCount: 0,
    deleteData: null,
    updateData: null,
    isHrReceived: null,
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
    this.eventHub.$on("closeViewPreviewServiceRecordDialog", () => {
      this.initialize();
    });
  },
  beforeDestroy() {
    this.eventHub.$off("closeViewPreviewServiceRecordDialog");
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
    selectToView(item) {
      this.$refs.selectToPreviewFormref.reset();
      this.selectToPreviewDialog = true;
      this.dataToPreview = item;
    },

    preview() {
      if (this.$refs.selectToPreviewFormref.validate()) {
        this.selectToPreviewDialog = false;
        if (this.selectedToPreview == "Range") {
          let data = this.dataToPreview;

          Object.assign(
            data,
            { date_from: this.selectDateFrom },
            { date_to: this.selectDateTo }
          );

          this.updateData = data;
        } else {
          this.updateData = this.dataToPreview;
        }
      }
    },

    pagination(data) {
      this.paginationData = data;
    },
    getType(id) {
      let rl = this.requestsList.filter((type) => type.id == id);
      return rl[0].type;
    },

    getDocumentRequestedType(val) {
      let rl = this.requestTypeList.filter((type) => type.id == val);
      return rl[0].type;
    },

    initialize() {
      this.loading = true;

      this.axiosCall("/employee", "GET").then((res) => {
        if (res) {
          console.log(res.data);
          this.data = res.data;
          this.loading = false;
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
    viewItem(item) {
      this.updateData = item;
      this.action = "View";
    },
  },
};
</script>
