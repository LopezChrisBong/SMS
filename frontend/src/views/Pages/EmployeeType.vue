<template>
  <div class="mx-2 ">
    <v-card class="mt-2">
      <v-row>
        <v-col cols="12">
          <!-- <v-toolbar flat class="rounded-xl mb-7">
            <v-toolbar-title
              ><strong class="text-gray-100"
                >Employment Status</strong
              ></v-toolbar-title
            >
            <v-spacer></v-spacer>
            <v-btn
              class="white--text rounded-lg"
              color="#5a67da"
              @click="addRequest()"
            >
              <v-icon left> mdi-plus-box-outline </v-icon>
              Add New Employee Type
            </v-btn>
          </v-toolbar> -->
          <EmployeeTypeDataTable :reloadTable="reload" />
        </v-col>
      </v-row>
    </v-card>

    <EmployeeTypeDialog
      :data="typeData"
      :action="action"
      v-on:reloadTable="refresh"
    />
  </div>
</template>

<script>
export default {
  name: "RequestType",
  components: {
    EmployeeTypeDataTable: () =>
      import("../../components/Utils/EmployeeTypeDataTable.vue"),
    EmployeeTypeDialog: () =>
      import("../../components/Dialogs/Forms/EmployeeTypeDialog.vue"),
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
  methods: {
    refresh() {
      this.reload = true;
    },
    addRequest() {
      this.typeData = [{ id: null }];
      this.action = "Add";
    },
  },
};
</script>

<style></style>
