<template>
  <div class=" mx-2 ">
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
              color="#239FAB"
              @click="dispatch()"
            >
              <v-icon left> mdi-plus-box-outline </v-icon>
              Add Employee
            </v-btn> -->
          <!-- </v-toolbar> -->
        </v-col>
        <v-col cols="12">
          <EmployeeDetailsDataTable />
        </v-col>
      </v-row>
    </v-card>
    <EmployeeDetailsDialog :data="dispatchingData" />
  </div>
</template>

<script>
export default {
  components: {
    EmployeeDetailsDataTable: () =>
      import("../../components/Utils/EmployeeDetailsDataTable.vue"),
    EmployeeDetailsDialog: () =>
      import("../../components/Dialogs/Forms/EmployeeDetailsDialog.vue"),
  },
  data: () => ({
    dispatchingData: [],
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
    dispatch() {
      this.dispatchingData = [{ id: null }];
    },
  },
};
</script>
