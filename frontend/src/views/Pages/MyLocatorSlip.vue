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
              @click="add()"
            >
              <v-icon left> mdi-plus-box-outline </v-icon>
              Add New
            </v-btn> -->
          <!-- </v-toolbar> -->
          <MyLocatorSlipDataTable />
        </v-col>
      </v-row>
    </v-card>

    <MyLocatorSlipDialog :data="typeData" :action="action" />
  </div>
</template>

<script>
export default {
  components: {
    MyLocatorSlipDataTable: () =>
      import("../../components/Utils/MyLocatorSlipDataTable.vue"),
    MyLocatorSlipDialog: () =>
      import("../../components/Dialogs/Forms/MyLocatorSlipDialog.vue"),
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
    snackbar: false,
    hasDirectHead: true,
  }),
  mounted() {
    this.checkDirectHead();
  },
  methods: {
    add() {
      this.typeData = [{ id: null }];
      this.action = "Add";
    },

    checkDirectHead() {
      this.axiosCall("/my-direct-head/getMyDirectHead", "GET").then((res) => {
        // console.log(res.data);
        if (res.data) {
          this.hasDirectHead = true;
        } else {
          this.hasDirectHead = false;
        }
      });
    },
  },
};
</script>

<style></style>
