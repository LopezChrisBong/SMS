<template>
  <!-- <div
    class="pl-2 pt-2 pr-2 mx-2 fill-height"
    style="background-color: white; overflow-y: hidden; overflow-x: hidden"
  > -->
  <div class="mx-2 ">
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
          </v-toolbar> -->
          <AllLSDataTable />
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
export default {
  components: {
    AllLSDataTable: () => import("../../components/Utils/AllLSDataTable.vue"),
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
  }),
  methods: {},
};
</script>

<style></style>
