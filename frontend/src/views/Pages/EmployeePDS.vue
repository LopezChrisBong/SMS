<template>
  <div class="mx-2 ">
    <v-card class="mt-2">
      <v-row>
        <v-col cols="12">
          <!-- <v-toolbar flat class="rounded-xl">
            <v-toolbar-title
              ><strong class="text-gray-100">{{
                $route.meta.title
              }}</strong></v-toolbar-title
            >
            <v-spacer></v-spacer> -->
          <!-- <v-btn
              class="white--text rounded-lg mt-3"
              dense
              color="#5a67da"
              @click="dispatch()"
            >
              <v-icon left> mdi-plus-box-outline </v-icon>
              Add Employee
            </v-btn> -->
          <!-- </v-toolbar> -->
        </v-col>
        <v-col cols="12">
          <EmployeePDSDataTable />
        </v-col>
      </v-row>
    </v-card>
    <!-- <EmployeePDSDialog :data="dispatchingData" /> -->
  </div>
</template>

<script>
export default {
  components: {
    EmployeePDSDataTable: () =>
      import("../../components/Utils/EmployeePDSDataTable.vue"),
    // EmployeePDSDialog: () =>
    //   import("../../components/Dialogs/Forms/EmployeePDSDialog.vue"),
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
    dispatchingData: [],
  }),
  methods: {
    dispatch() {
      this.dispatchingData = [{ id: null }];
    },
  },
};
</script>
