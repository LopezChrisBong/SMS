<template>
  <div class="mx-2 ">
    <v-card class="mt-2">
      <v-row>
        <v-col cols="12">
          <!-- <v-toolbar flat class="rounded-xl mb-7">
            <v-toolbar-title
              ><strong class="text-gray-100">{{
                $route.meta.title
              }}</strong></v-toolbar-title
            >
            <v-spacer></v-spacer> -->
          <!-- <v-btn
              class="white--text rounded-lg"
              color="#519043"
              @click="addPosition()"
            >
              <v-icon left> mdi-plus-box-outline </v-icon>
              Add New Position
            </v-btn> -->
          <!-- </v-toolbar> -->
          <SchoolYearDataTable />
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
export default {
  components: {
    SchoolYearDataTable: () =>
      import("../../components/Utils/SchoolYearDataTable.vue"),
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
