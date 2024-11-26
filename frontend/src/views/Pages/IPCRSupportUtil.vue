<template>
  <div class="mx-2 ">
    <v-card class="mt-2">
      <v-row>
        <v-col cols="12">
          <IPCRSupportUtilDataTable />
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
export default {
  components: {
    IPCRSupportUtilDataTable: () =>
      import("../../components/Utils/IPCRSupportUtilDataTable.vue"),
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
