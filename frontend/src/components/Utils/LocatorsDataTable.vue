<template>
  <div>
    <v-row class="mx-2">
      <v-col cols="12" md="6" class="pa-0">
        <v-tabs v-model="activeTab" color="#5a67da" align-tabs="left">
          <v-tab v-for="tab in tabList" :key="tab.id" @click="changeTab(tab)">{{
            tab.name
          }}</v-tab>
        </v-tabs>
      </v-col>
      <v-spacer></v-spacer>
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
    <v-card class="ma-5 dt-container" elevation="0" outlined>
      <v-data-table
        :headers="tab == 1 ? headers : headers1"
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
        <template v-slot:[`item.inclusive_date`]="{ item }">
          {{ formatDate(item.inclusive_date) }}
        </template>
        <template v-slot:[`item.locator_type`]="{ item }">
          {{
            item.locator_type == 1
              ? "Personal"
              : item.locator_type == 2
              ? "Official Time"
              : "Official Business"
          }}
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <v-chip
            small
            :color="
              item.status == 1
                ? '#FF9135'
                : item.status == 2
                ? '#17C800'
                : item.status == 3
                ? 'error'
                : ''
            "
            text-color="white"
          >
            {{
              item.status == 1
                ? "For Approval"
                : item.status == 2
                ? "Approved"
                : item.status == 3
                ? "Denied"
                : ""
            }}
          </v-chip>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            v-if="item.status == 1"
            elevation="2"
            color="error"
            class="mr-2"
            x-small
            @click="confirm('deny', item)"
            >Deny</v-btn
          >
          <v-btn
            v-if="item.status == 1"
            elevation="2"
            color="#17C800"
            class="white--text"
            x-small
            @click="confirm('approve', item)"
            >Approve</v-btn
          >
          <v-btn
            x-small
            color="grey"
            class="white--text ml-2"
            @click="editItem(item)"
            v-if="item.status == 1"
          >
            View
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
            color="#5a67da"
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

    <LocatorsDialog :data="updateData" />

    <v-dialog v-model="confirmDialog" persistent max-width="350">
      <v-card color="white">
        <div class="#3a3b3a--text">
          <div
            class="text-overline mb-1 px-4 py-2"
            :class="confirmAction == 'deny' ? 'bgRed' : 'bgGreen'"
          >
            WARNING!
          </div>
          <div class="text-body-1 mb-5 px-4 py-4" v-if="!isDeny">
            <p style="text-align: justify">
              <v-icon class="mt-n2" color="white">mdi-alert</v-icon> &nbsp; Are
              you sure you want to {{ confirmAction }} this locator slip?
            </p>
          </div>
          <div style="margin-bottom: -25px">
            <v-textarea
              v-model="remarks"
              v-if="isDeny"
              class="mx-4 my-4"
              label="Please leave a remarks/comments"
              outlined
              dense
              color="#5a67da"
              variant="solo-inverted"
            ></v-textarea>
          </div>
        </div>

        <!-- <v-card-title class="text-h5">
          Are you sure you want to proceed?
        </v-card-title> -->
        <v-card-actions style="border-top: 1px solid rgb(226, 225, 225)">
          <v-spacer></v-spacer>
          <v-btn
            color="red"
            outlined
            @click="(confirmDialog = false), (isDeny = false)"
          >
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
            v-if="confirmAction == 'deny' && isDeny == false"
            color="green"
            class="white--text"
            @click="isDeny = true"
          >
            Confirm
          </v-btn>
          <v-btn
            v-if="confirmAction == 'deny' && isDeny == true"
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
    LocatorsDialog: () =>
      import("../../components/Dialogs/Forms/LocatorsDialog.vue"),
  },
  data: () => ({
    search: "",
    isDeny: false,
    remarks: null,
    headers: [
      { text: "Name", value: "name", align: "start", valign: "center" },
      {
        text: "Date",
        value: "inclusive_date",
        align: "center",
        valign: "center",
      },
      {
        text: "Destination",
        value: "destination",
        align: "center",
        width: 200,
        valign: "center",
      },
      {
        text: "Purpose",
        value: "purpose",
        align: "center",
        width: 200,
        valign: "center",
      },
      {
        text: "Type",
        value: "locator_type",
        align: "center",
        valign: "center",
      },
      {
        text: "Status",
        value: "status",
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
    headers1: [
      { text: "Name", value: "name", align: "start", valign: "center" },
      {
        text: "Date",
        value: "inclusive_date",
        align: "center",
        valign: "center",
      },
      {
        text: "Destination",
        value: "destination",
        align: "center",
        valign: "center",
      },
      {
        text: "Purpose",
        value: "purpose",
        align: "center",
        valign: "center",
      },
      {
        text: "Type",
        value: "locator_type",
        align: "left",
      },
      {
        text: "Status",
        value: "status",
        align: "center",
        valign: "center",
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
    activeTab: { id: 1, name: "For Approval" },
    tab: 1,
    tabList: [
      { id: 1, name: "For Approval" },
      { id: 2, name: "Approved" },
      { id: 3, name: "Denied" },
    ],
    totalCount: 0,
    confirmDialog: false,
    confirmAction: null,
    confirmApprovalID: null,
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
        this.initialize(this.activeTab.id);
      },
      deep: true,
    },
  },
  mounted() {
    this.eventHub.$on("closeLocatorsDialog", () => {
      this.initialize(this.tab);
    });
  },
  beforeDestroy() {
    this.eventHub.$off("closeLocatorsDialog");
  },

  methods: {
    pagination(data) {
      this.paginationData = data;
    },

    changeTab(tab) {
      this.activeTab = tab;

      this.initialize(tab.id);
      this.tab = tab.id;
    },

    initialize(status) {
      this.loading = true;

      this.axiosCall(
        "/my-locator-slip/getLocatorsToApprove/" + status,
        "GET"
      ).then((res) => {
        if (res) {
          // console.log(res.data);
          let data = res.data;
          data.forEach((element, i) => {
            data[i].name = this.toTitleCase(element.name);
          });
          this.data = data;
          this.loading = false;
        }
      });
    },

    deny() {
      if (this.remarks != null) {
        let data = {
          id: this.confirmApprovalID,
          status: 3,
          remarks: this.remarks,
        };
        this.axiosCall("/my-locator-slip/deny-locator", "POST", data).then(
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
      } else {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "warning";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message = "Remarks is required.";
        this.initialize(this.tab);
      }
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
      if (action == "approve") {
        this.isDeny = false;
      }
      // console.log(item);
      this.confirmAction = action;
      this.confirmDialog = true;
      this.confirmApprovalID = item.id;
    },
  },
};
</script>
<style scoped>
.bgOrange {
  background-color: orange;
}
.bgGreen {
  background-color: rgb(15, 170, 26);
  color: white;
}
.bgRed {
  background-color: rgb(255, 0, 0);
  color: white;
}
</style>
