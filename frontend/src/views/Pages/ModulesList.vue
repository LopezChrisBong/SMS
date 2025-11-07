<template>
  <div class=" mx-2">
    <v-card class="mt-2" style="min-height: 85vh; width: 100%; background-color: rgba(255, 255, 255, 0.8);">
      <v-row class="px-2">
        <v-col cols="12">
          <ModulesListDataTable />
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
export default {
  components: {
    ModulesListDataTable: () =>
      import("../../components/Utils/ModulesListDataTable.vue"),
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
  data: () => ({
    typeData: [],
    action: null,
    reload: false,
  }),
  methods: {},
};
</script>

<style></style>
