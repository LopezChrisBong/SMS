<template>
  <div class="mx-2">
    <v-card class="mt-2">
      <v-row>
        <v-col cols="12">
          <MyDTRDataTable />
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
export default {
  components: {
    MyDTRDataTable: () => import("../../components/Utils/MyDTRDataTable.vue"),
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
          if (res.data.id != 1) {
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
