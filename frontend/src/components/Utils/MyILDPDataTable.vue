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
          :color="$vuetify.theme.themes.light.submitBtns"
          dense
        ></v-text-field>
        <v-btn
          class="white--text ml-2 rounded-lg"
          color="#519043"
          @click="add()"
          v-if="this.$store.state.user.user.isAdminApproved == 1"
        >
          <v-icon left> mdi-plus-box-outline </v-icon>
          Add new
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
        <template v-slot:[`item.yearFrom`]="{ item }">
          {{ item.yearFrom + " - " + item.yearTo }}
        </template>
        <!-- <template v-slot:[`item.prog_head_approval_status`]="{ item }">
          <v-chip
            v-if="item.prog_head_approval_status == 1"
            class="ma-2"
            x-small
          >
            For Approval
          </v-chip>
          <v-icon color="#519043" v-if="item.prog_head_approval_status == 2"
            >mdi-check-bold</v-icon
          >
        </template> -->
        <template v-slot:[`item.dean_approval_status`]="{ item }">
          <v-chip v-if="item.dean_approval_status == 1" class="ma-2" x-small>
            For Approval
          </v-chip>
          <v-icon color="#519043" v-if="item.dean_approval_status == 2"
            >mdi-check-bold</v-icon
          >
        </template>
        <template v-slot:[`item.vpaa_approval_status`]="{ item }">
          <v-chip v-if="item.vp_approval_status == 1" class="ma-2" x-small>
            For Approval
          </v-chip>
          <v-icon color="#519043" v-if="item.vp_approval_status == 2"
            >mdi-check-bold</v-icon
          >
        </template>
        <template v-slot:[`item.president_approval_status`]="{ item }">
          <v-chip
            v-if="item.president_approval_status == 1"
            class="ma-2"
            x-small
          >
            For Approval
          </v-chip>
          <v-icon color="#519043" v-if="item.president_approval_status == 2"
            >mdi-check-bold</v-icon
          >
        </template>
        <template v-slot:[`item.is_hr_received`]="{ item }">
          <v-chip v-if="item.is_hr_received == 0" class="ma-2" x-small>
            To Receive
          </v-chip>
          <v-chip
            v-if="item.is_hr_received == 1"
            color="#519043"
            class="ma-2 white--text"
            x-small
          >
            Received
          </v-chip>
          <!-- <v-icon color="#519043" v-if="item.is_hr_received == 1"
            >mdi-check-bold</v-icon
          > -->
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn x-small outlined color="grey" @click="editItem(item)">
            <v-icon size="14">{{
              item.is_hr_received == 1 ? "mdi-eye" : " mdi-pencil-outline"
            }}</v-icon
            >{{ item.is_hr_received == 1 ? "View" : "Update" }}
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

    <MyILDPDialog
      :data="updateData"
      :action="action"
      :isHrReceived="isHRReceived"
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
    MyILDPDialog: () =>
      import("../../components/Dialogs/Forms/MyILDPDialog.vue"),
  },
  props: ["reloadTable"],
  data: () => ({
    search: "",
    headers: [
      { text: "Calendar Year", value: "yearFrom", align: "start" },
      // {
      //   text: "Program Head",
      //   value: "prog_head_approval_status",
      //   align: "center",
      // },
      {
        text: "Immediate Head / Supervisor",
        value: "dean_approval_status",
        align: "center",
      },
      {
        text: "Vice President",
        value: "vpaa_approval_status",
        align: "center",
      },
      {
        text: "President",
        value: "president_approval_status",
        align: "center",
      },
      {
        text: "HR",
        value: "is_hr_received",
        align: "center",
      },
      {
        text: "Actions",
        value: "actions",
        align: "center",

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
    deleteData: null,
    updateData: null,
    loading: false,
    options: {},
    action: null,
    paginationData: {},
    formdata: [],
    isHRReceived: null,
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
    this.eventHub.$on("closeMyIldpDialog", () => {
      this.initialize();
    });
  },
  beforeDestroy() {
    this.eventHub.$off("closeMyIldpDialog");
  },
  methods: {
    pagination(data) {
      this.paginationData = data;
    },
    initialize() {
      this.loading = true;
      this.axiosCall("/my-ildp/getMyILDP", "GET").then((res) => {
        if (res) {
          console.log(res.data);
          this.data = res.data;
          this.loading = false;
        }
      });
    },
    deleteItem(item) {
      this.dialogConfirmDelete = true;
      this.deleteData = item;
    },
    add() {
      this.updateData = [{ id: null }];
      this.action = "Add";
      this.isHRReceived = 0;
    },
    editItem(item) {
      // setTimeout(() => {
      //   this.updateData = { id: null };
      // }, 100);
      console.log(item);
      this.isHRReceived = item.is_hr_received;
      this.updateData = item;
      this.action = "Update";
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
