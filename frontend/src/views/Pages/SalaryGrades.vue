<template>
  <div class="mx-2">
    <v-card class="mt-2">
      <v-row>
        <v-col cols="12">
          <!-- <v-toolbar flat class="rounded-xl mb-7">
            <v-toolbar-title
              ><strong class="text-gray-100">
                {{ $route.meta.title }}</strong
              ></v-toolbar-title
            >
            <v-spacer></v-spacer>
            <v-btn
              class="white--text rounded-lg"
              color="#5a67da"
              @click="add()"
            >
              <v-icon left> mdi-plus-box-outline </v-icon>
              Add New
            </v-btn>
          </v-toolbar> -->
          <SalaryGradesDataTable />
        </v-col>
      </v-row>
    </v-card>

    <FiscalBudgetYearDialog :data="typeData" :action="action" />
  </div>
</template>

<script>
export default {
  components: {
    SalaryGradesDataTable: () =>
      import("../../components/Utils/SalaryGradesDataTable.vue"),
    FiscalBudgetYearDialog: () =>
      import("../../components/Dialogs/Forms/FiscalBudgetYearDialog.vue"),
  },
  data: () => ({
    typeData: [],
    action: null,
    reload: false,
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
  //   mounted() {
  //     this.eventHub.$on("closeFiscalBudgetYearDialog", () => {
  //       this.initialize();
  //     });
  //   },
  //   beforeDestroy() {
  //     this.eventHub.$off("closeFiscalBudgetYearDialog");
  //   },

  methods: {
    add() {
      this.typeData = [{ id: null }];
      this.action = "Add";
    },
  },
};
</script>

<style></style>
