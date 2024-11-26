<template>
  <div>
    <div class="pa-5">
      <v-card class="card-style">
        <v-row>
          <v-col cols="12">
            <v-tabs
              color="#239FAB"
              background-color="transparent"
              show-arrows
              class="mx-5 mt-5"
            >
              <v-tabs-slider color="#239FAB"></v-tabs-slider>

              <v-tab v-for="tab in tabs" :key="tab.id" @click="changeTab(tab)">
                <v-icon class="mr-2">{{ tab.icon }}</v-icon>
                {{ tab.description }}
              </v-tab>
            </v-tabs>
          </v-col>

          <v-col v-if="tab.id == 1" cols="12">
            <v-toolbar flat class="rounded-xl mb-7">
              <v-toolbar-title><strong>Status Details</strong></v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn
                class="white--text rounded-lg"
                color="#239FAB"
                @click="addStatus()"
              >
                <v-icon left>
                  mdi-plus-box-outline
                </v-icon>
                Add New Status
              </v-btn>
            </v-toolbar>
            <StatusDataTable ref="StatusDataTable" />
          </v-col>

          <v-col v-if="tab.id == 2" cols="12">
            <v-toolbar flat class="rounded-xl mb-7">
              <v-toolbar-title
                ><strong>Status Type Details</strong></v-toolbar-title
              >
              <v-spacer></v-spacer>
              <v-btn
                class="white--text rounded-lg"
                color="#239FAB"
                @click="addStatusType()"
              >
                <v-icon left>
                  mdi-plus-box-outline
                </v-icon>
                Add New Status Type
              </v-btn>
            </v-toolbar>
            <StatusTypeDataTable ref="StatusTypeDataTable" />
          </v-col>
        </v-row>
      </v-card>
    </div>
    <StatusDialog :data="statusData" :action="action" />
    <StatusTypeDialog :data="statusTypeData" :action="action" />
  </div>
</template>

<script>
export default {
  name: "Status",
  components: {
    StatusDataTable: () => import("../../components/Utils/StatusDataTable.vue"),
    StatusTypeDataTable: () =>
      import("../../components/Utils/StatusTypeDataTable.vue"),
    StatusDialog: () =>
      import("../../components/Dialogs/Forms/StatusDialog.vue"),
    StatusTypeDialog: () =>
      import("../../components/Dialogs/Forms/StatusTypeDialog.vue"),
  },
  data: () => ({
    statusData: [],
    statusTypeData: [],
    action: null,
    tabs: [
      { id: 1, description: "Status", icon: "mdi-account-clock-outline" },
      {
        id: 2,
        description: "Status Type",
        icon: "mdi-account-details-outline",
      },
    ],
    tab: { id: 1, description: "Status", icon: "mdi-account-clock-outline" },
  }),
  created() {
    // console.log("created");
    if (this.$store.state.expiryDate < Date.now()) {
      this.$store.dispatch("setUser", null);
      this.$store.dispatch("setIsAuthenticated", 0);
      this.render = true;
      this.$router.push("/");
      // location.reload();
    }
  },
  methods: {
    addStatus() {
      this.statusData = [{ id: null }];
      this.action = "Add";
    },
    addStatusType() {
      this.statusTypeData = [{ id: null }];
      this.action = "Add";
    },

    changeTab(data) {
      this.tab = data;
    },
  },
};
</script>

<style></style>
