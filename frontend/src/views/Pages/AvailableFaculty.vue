<template>
  <div class="mx-2 ">
    <v-card class="mt-2" style="min-height: 85vh; width: 100%; background-color: rgba(255, 255, 255, 0.8);">
      <v-row>
        <v-col cols="12">
          <AvailableFacultyDataTable />
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
export default {
  components: {
    AvailableFacultyDataTable: () =>
      import("../../components/Utils/AvailableFacultyDataTable.vue"),
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
    // this.getHeadCount();
  },
  data: () => ({
    typeData: [],
    action: null,
    hasHead: false,
  }),
  methods: {
    add() {
      this.typeData = [{ id: null }];
      this.action = "Add";
    },
    getHeadCount() {
      this.axiosCall("/my-direct-head/getMyDirectHeadCount", "GET").then(
        (res) => {
          this.hasHead = res.data;
        }
      );
    },
  },
};
</script>

<style></style>
