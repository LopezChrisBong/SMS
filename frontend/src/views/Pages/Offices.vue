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
              @click="addOffice()"
            >
              <v-icon left> mdi-plus-box-outline </v-icon>
              Add New Office
            </v-btn> -->
          <!-- </v-toolbar> -->
          <OfficesDataTable :reloadTable="reload" />
        </v-col>
      </v-row>
    </v-card>

    <OfficesDialog
      :data="typeData"
      :action="action"
      v-on:reloadTable="refresh"
    />
  </div>
</template>

<script>
export default {
  components: {
    OfficesDataTable: () =>
      import("../../components/Utils/OfficesDataTable.vue"),
    OfficesDialog: () =>
      import("../../components/Dialogs/Forms/OfficesDialog.vue"),
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
  methods: {
    refresh() {
      setTimeout(() => {
        this.reload = true;
      }, 500);
      this.reload = false;
    },
    addOffice() {
      this.typeData = [{ id: null }];
      this.action = "Add";
    },
  },
};
</script>

<style></style>
