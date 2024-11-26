<template>
  <div class="mx-2 ">
    <v-card class="mt-2">
      <v-row>
        <v-col cols="12">
          <v-alert
            v-model="cannotAvail"
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
          <StrategicPlanning v-if="!cannotAvail" />
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
export default {
  components: {
    StrategicPlanning: () =>
      import("../../components/Utils/StrategicPlanningDataTable.vue"),
  },
  created() {
    if (this.$store.state.expiryDate < Date.now()) {
      this.$store.dispatch("setUser", null);
      this.$store.dispatch("setIsAuthenticated", 0);
      this.render = true;
      this.$router.push("/");
    }
  },
  mounted() {
    this.getMyEmploymentStatus();
  },
  data: () => ({
    typeData: [],
    action: null,
    hasHead: false,
    cannotAvail: null,
  }),
  methods: {
    add() {
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
            this.cannotAvail = true;
          } else {
            this.cannotAvail = false;
          }
        }
      });
    },
  },
};
</script>

<style></style>
