<template>
  <div class="mx-2 ">
    <v-card class="mt-2">
      <v-row>
        <v-col cols="12">
          <!-- <v-toolbar flat class="rounded-xl mb-7"> -->
          <!-- <v-toolbar-title
              ><strong class="text-gray-100">{{
                $route.meta.title
              }}</strong></v-toolbar-title
            >
            <v-spacer></v-spacer> -->
          <!-- <v-btn
              class="white--text rounded-lg"
              color="#519043"
              @click="addDesignation()"
            >
              <v-icon left> mdi-plus-box-outline </v-icon>
              Add New Designation
            </v-btn> -->
          <!-- </v-toolbar> -->
          <DesignationDataTable :reloadTable="reload" />
        </v-col>
      </v-row>
    </v-card>

    <DesignationDialog
      :data="typeData"
      :action="action"
      v-on:reloadTable="refresh"
    />
  </div>
</template>

<script>
export default {
  components: {
    DesignationDataTable: () =>
      import("../../components/Utils/DesignationDataTable.vue"),
    DesignationDialog: () =>
      import("../../components/Dialogs/Forms/DesignationDialog.vue"),
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
    addDesignation() {
      this.typeData = [{ id: null }];
      this.action = "Add";
    },
  },
};
</script>

<style></style>
