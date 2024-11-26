<template>
  <div class="mx-2">
    <v-card class="mt-2">
      <v-row>
        <v-col cols="12">
          <!-- <v-toolbar flat class="rounded-xl mb-7">
            <v-toolbar-title><strong>My Leave</strong></v-toolbar-title>
            <v-spacer></v-spacer> -->

          <!-- <v-btn
              class="white--text rounded-lg"
              color="#519043"
              @click="addOffice()"
            >
              <v-icon left> mdi-plus-box-outline </v-icon>
              Add New Office
            </v-btn> -->
          <!-- </v-toolbar> -->
          <v-alert
            v-model="cannotAvailLeave"
            type="warning"
            icon="mdi-alert-circle-outline"
            dense
            close-label="Close Alert"
          >
            <p class="text-subtitle-2">
              This module is only available for employees whose employee status
              are plantilla or permanent.
            </p>
          </v-alert>
          <MyLeaveDataTable v-if="!cannotAvailLeave" />
        </v-col>
      </v-row>
    </v-card>

    <!-- <OfficesDialog :data="typeData" :action="action" /> -->
  </div>
</template>

<script>
export default {
  components: {
    MyLeaveDataTable: () =>
      import("../../components/Utils/MyLeaveDataTable.vue"),
    // OfficesDialog: () =>
    //   import("../../components/Dialogs/Forms/OfficesDialog.vue"),
  },

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
  mounted() {
    this.getMyEmploymentStatus();
  },
  data: () => ({
    typeData: [],
    action: null,
    cannotAvailLeave: null,
  }),
  methods: {
    addOffice() {
      this.typeData = [{ id: null }];
      this.action = "Add";
    },
    getMyEmploymentStatus() {
      this.axiosCall("/employee/getMyEmploymentStatus/", "GET").then((res) => {
        if (res) {
          if (
            res.data.id != 1 &&
            res.data.id != 2 &&
            res.data.id != 3 &&
            res.data.id != 6 &&
            res.data.id != 11
          ) {
            this.cannotAvailLeave = true;
          } else {
            this.cannotAvailLeave = false;
          }
        }
      });
    },
  },
};
</script>

<style></style>
