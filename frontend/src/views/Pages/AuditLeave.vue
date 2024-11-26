<template>
  <div class="mx-2">
    <v-card class="mt-2">
      <v-row>
        <v-col cols="12">
          <AuditLeaveDataTable />
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
export default {
  components: {
    AuditLeaveDataTable: () =>
      import("../../components/Utils/AuditLeaveDataTable.vue"),
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
    cannotAvailLeave: null,
  }),
  methods: {},
};
</script>

<style></style>
