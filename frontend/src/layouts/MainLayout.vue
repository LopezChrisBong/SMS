<template>
  <v-app class="">
    <!-- <div class="d-flex" style="height: 100dvh"> -->
    <!-- <div style="width: 100%; height: 100dvh" class="d-flex"> -->
    <!-- <div style="width: 100%; height: 100dvh"> -->
    <Navbar3
      :reloadImg="reloadImg"
      :screenSmall="mini"
      v-on:closeNav="mini = false"
      :isOIC="is_oic"
    />
    <!--  <v-main style="background-color: #519043;overflow-y:hidden "> -->
    <v-main style="background-color: #5a67da;">
      <div class="mx-2 fill-height pb-6" style="background-color:white; ">
        <div class="d-flex justify-space-between pt-4 px-4  ">
          <strong class="text-gray-100">{{ $route.meta.title }}</strong>
          <div>
            <v-select
              label="Year"
              color="#519043"
              @change="changeFilter()"
              outlined
              v-model="selectedFiter"
              dense
              :items="filterYears"
            ></v-select>
          </div>
        </div>
        <router-view v-on:reloadProfile="loadImg" />
        <!-- <div
          class="fill-height "
          style="position: relative;width:100%; overflow-y:auto; border:1px solid red"
        >
        
        </div> -->
      </div>
    </v-main>
  </v-app>
</template>

<script>
import Navbar3 from "../components/Navbar/Navbar3.vue";
export default {
  name: "App",
  components: {
    Navbar3,
  },
  data: () => ({
    mini: false,
    alert: true,
    oic_alert: false,
    is_oic: false,
    oic_by: null,
    oic_date_from: null,
    oic_date_to: null,
    filterYears: [],
    selectedFiter: null,
    // profImg: null,
    date_from: null,
    date_to: null,
    reloadImg: null,
  }),
  mounted() {
    this.loadYearForFilter();

    if (this.$store.getters.isExpired) {
      this.$store.dispatch("setUser", null);
      this.$store.dispatch("setIsAuthenticated", 0);
      this.$router.push("/");
    }
    this.getInPDSUpdateActive();
    this.getOICActive();
  },
  methods: {
    loadImg() {
      setTimeout(() => {
        this.reloadImg = false;
      }, 100);
      this.reloadImg = true;
    },
    loadYearForFilter() {
      let d = new Date();
      let cur = d.getFullYear();
      this.selectedFiter = cur;
      this.$store.commit("setFilterSelected", cur);
      let yearLimit = 2020;
      for (let i = cur; i >= yearLimit; i--) {
        this.filterYears.push(i);
      }
      this.filterYears.push("All");
    },

    changeFilter() {
      this.$store.commit("setFilterSelected", this.selectedFiter);
    },

    getInPDSUpdateActive() {
      this.axiosCall("/allow-pds-update/isPDSUpdateActive", "GET").then(
        (res) => {
          if (res.data.isAllowed) {
            this.alert = true;
            this.date_from = res.data.schedule.date_from;
            this.date_to = res.data.schedule.date_to;
          } else {
            this.alert = false;
          }
        }
      );
    },
    getOICActive() {
      this.axiosCall("/my-oic/active", "GET").then((res) => {
        if (res.data.hasActive) {
          this.is_oic = true;
          this.oic_alert = true;
          this.oic_date_from = res.data.oic[0].date_from;
          this.oic_date_to = res.data.oic[0].date_to;
          this.oic_by = res.data.oic[0].name;
        } else {
          this.is_oic = false;
          this.oic_alert = false;
        }
      });
    },
  },
};
</script>

<style scoped>
html,
body {
  margin: 0;
  padding: 0;
}
/* .main_div {
  height: 100%;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  position: fixed;
} */
#rem {
  flex-grow: 1;
  background-color: red;
}
#alert {
  position: fixed;
  z-index: 10;
  width: 70%;
  left: 50%;
  transform: translate(-40%, -50%);
  border-radius: 5px;
  padding: 5px;
  background-color: #ff7043;
}
</style>
