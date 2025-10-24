<template>
  <div class=" mx-2">
    <v-card class="mt-2" style="min-height: 85vh; width: 100%; background-color: rgba(255, 255, 255, 0.8);">
      <v-row>
        <v-col cols="12">
          <AccountVerificationDataTable />
        </v-col>
      </v-row>
    </v-card>
    <AccountVerificationDialog :data="typeData" :action="action" />
  </div>
</template>

<script>
export default {
  components: {
    AccountVerificationDataTable: () =>
      import("../../components/Utils/AccountVerificationDataTable.vue"),
    AccountVerificationDialog: () =>
      import("../../components/Dialogs/Forms/AccountVerificationDialog.vue"),
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
  methods: {
    addOffice() {
      this.typeData = [{ id: null }];
      this.action = "Add";
    },
  },
};
</script>

<style></style>
