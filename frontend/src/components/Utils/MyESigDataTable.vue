<template>
  <div>
    <v-card class="ma-5 dt-container" elevation="0" outlined>
      <v-data-table
        :headers="headers"
        :items="data"
        :items-per-page="10"
        :search="search"
        :options.sync="options"
        :loading="loading"
        hide-default-footer
      >
        <template v-slot:[`item.hasEsign`]="{ item }">
          <v-icon color="#519043" v-if="item.hasEsign" large
            >mdi-check-bold</v-icon
          >
          <v-icon color="red" v-if="!item.hasEsign" large>mdi-alpha-x</v-icon>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            v-if="item.hasEsign"
            small
            color="grey"
            icon
            @click="viewItem(item)"
          >
            <v-icon>mdi-eye</v-icon>
          </v-btn>
          <v-btn x-small color="grey" outlined @click="editItem(item)">
            <v-icon size="14">mdi-pencil-outline</v-icon> Update
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <MyESigDialog :data="updateData" :action="action" />

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
    MyESigDialog: () =>
      import("../../components/Dialogs/Forms/MyESigDialog.vue"),
  },

  data: () => ({
    search: "",
    headers: [
      { text: "Has Uploaded E-signature", value: "hasEsign", align: "start" },
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
        this.initialize();
      },
      deep: true,
    },
  },
  mounted() {
    this.eventHub.$on("closeMyESigDialog", () => {
      this.initialize();
    });
  },
  beforeDestroy() {
    this.eventHub.$off("closeMyESigDialog");
  },
  methods: {
    pagination(data) {
      this.paginationData = data;
    },
    initialize() {
      this.loading = true;
      this.axiosCall("/e-sigs/getMyEsign", "GET").then((res) => {
        if (res.data) {
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
    editItem(item) {
      // setTimeout(() => {
      //   this.updateData = [{ id: null }];
      // }, 100);
      this.updateData = item;
      this.action = "Update";
    },

    viewItem(item) {
      // setTimeout(() => {
      //   this.updateData = [{ id: null }];
      // }, 100);
      this.updateData = item;
      this.action = "View";
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
