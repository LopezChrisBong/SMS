<template>
  <v-app>
    <!-- Sidebar | #F5B027-->
    <v-navigation-drawer
      app
      :mini-variant.sync="mini"
      :permanent="$vuetify.breakpoint.smAndUp"
      :temporary="$vuetify.breakpoint.smAndDown"
      width="300"
      mini-variant-width="80"
      color="#F5B027"
      dark
      v-model="sidebarOpen"
      class="sidebar"
    >
      <!-- Logo + Burger Icon -->
      <div class="d-flex align-center justify-space-between px-3 mt-4 mb-6">
        <div class="white--text font-weight-bold text-h6">
          <span v-if="!mini">LOGO</span
          ><span class="font-weight-light">LIFE</span>
        </div>
        <v-btn
          icon
          small
          color="white"
          @click="toggleSidebar"
          v-show="!mini"
          v-if="$vuetify.breakpoint.smAndUp"
        >
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </div>

      <!-- Menu Items -->
      <!-- <v-list dense nav>
        <v-list-item
          v-for="(item, i) in menuItems"
          :key="i"
          link
          class="sidebar-item"
          @click="selected = i"
          :class="{ active: selected === i }"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content v-if="!mini">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list> -->
      <!-- Menu Items -->
      <v-list nav dense class="mt-3">
        <div v-for="(link, i) in links" :key="i">
          <v-list-item
            v-if="!link.subLink"
            :key="link.title"
            router
            :to="'/' + userType + link.route"
            class="sidebar-item"
            @click="selected = i"
            :class="{ active: selected === i }"
          >
            <v-list-item-icon>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title style="font-size: medium;">{{ link.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-group v-else :key="link" color="#3a3b3a" :value="false">
            <v-icon slot="prependIcon">{{ link.icon }}</v-icon>
            <template v-slot:activator>
              <v-list-item-title style="font-size: medium;">{{ link.title }}</v-list-item-title>
            </template>
            <div class="sub-item">
              <v-list-item
                v-for="sublink in link.subLink"
                router
                :to="'/' + userType + sublink.route"
                :key="sublink.title"
                color="#808191"
              >
                <v-list-item-icon>
                  <!-- <v-icon class="">{{ sublink.icon }}</v-icon> -->
                </v-list-item-icon>
                <v-list-item-title class="" style="font-size: medium;">{{
                  sublink.title
                }}</v-list-item-title>
              </v-list-item>
            </div>
          </v-list-group>
        </div>
      </v-list>
    </v-navigation-drawer>

    <!-- Top Bar -->
    <v-app-bar
      app
      flat
      height="75"
      style="background-color: white; border-bottom: 3px solid #dcdcdc ; box-shadow: 5px 10px 8px 10px #888888;"
    >
      <v-toolbar-title>
        <div v-if="$vuetify.breakpoint.smAndUp" style="margin-bottom: 5px;">
          <v-row>
            <v-col cols="10">
              <div class="title font-weight-bold" style="font-family: Segoe UI !important;">
                <!-- <v-btn icon small color="black" @click="toggleSidebar" v-if="mini">
              <v-icon>mdi-menu</v-icon>
            </v-btn> -->
              Hello, {{ $store.state.user.fname }}!
              </div>
              <!-- <div class="caption grey--text">
                {{
                  $vuetify.breakpoint.smAndUp
                    ? "Welcome to Limbaan Integrated Faculty - Loading and Enrollment System (LIFE)"
                    : ""
                }}
              </div> -->
              <div class="caption" style="font-size: 11pt !important; font-family: Segoe UI !important;">Today is {{ formattedDate }}</div>
            </v-col>
            <v-col cols="2"> </v-col>
          </v-row>
        </div>
        <div v-else>
          <v-row>
            <v-col cols="2">
              <v-btn
                icon
                small
                class="mr-1"
                color="black"
                @click="sidebarOpen = !sidebarOpen"
              >
                <v-icon>mdi-menu</v-icon>
              </v-btn>
            </v-col>
            <!-- <v-col cols="10">
              <div class="title font-weight-bold">
                <div style="font-size: 10px;" class="d-flex">
                  Hello, {{ $store.state.user.fname }}
                  {{
                    $vuetify.breakpoint.smAndUp
                      ? "Welcome to Limbaan Integrated Faculty - Loading and Enrollment System (LIFE)"
                      : ""
                  }}
                </div>
              </div>
              <div
                class="grey--text"
                style="font-size: 10px; margin-top: -0.8rem;"
              >
                Today is Monday, 20 October 2021
              </div>
            </v-col> -->
          </v-row>
        </div>
      </v-toolbar-title>

      <v-spacer></v-spacer>
            <div
        :style="
          $vuetify.breakpoint.smAndDown ? { width: '0' } : { width: '400px' }
        "
      ></div>
      <v-select
        :style="
          $vuetify.breakpoint.smAndDown
            ? { width: '35px', marginRight: '2rem' }
            : { width: '40px', marginLeft: '20rem' }
        "
        label="School Year"
        color="#F5B027"
        @change="changeFilter()"
        outlined
        v-model="selectedFiter"
        dense
        class="mt-8"
        item-text="school_year"
        item-value="id"
        :items="schooYearList"
      ></v-select>
    
      <v-menu>
        <template v-slot:activator="{ on }">
          <v-chip v-on="on" color="white" class="rounded-lg d-flex ">
            <!-- <v-avatar left :size="$vuetify.breakpoint.smAndUp ? 100 : 100">
              <img :src="profImg" max-width="100" />
            </v-avatar> -->
            <span
              class="text-uppercase"
              v-show="$vuetify.breakpoint.smAndUp"
              style="width: 40px; text-align: center; font-family: Segoe UI !important;"
              ><strong>
                <v-icon size="30" center class="">
                  mdi-account
                </v-icon>
              </strong>
              <!-- {{ $store.state.user.fname }} -->
            </span>
            <v-icon
              v-show="$vuetify.breakpoint.smAndDown"
              size="30"
              right
              class="mx-1"
              >mdi-account</v-icon
            >
            <!-- <v-icon right class="px-2"> mdi-chevron-down </v-icon> -->
          </v-chip>
        </template>
        <v-card width="200">
          <!-- <v-list color="#F5B027">
            <v-list-item>
              <v-list-item-avatar>
                <img :src="profImg" max-width="60" />
              </v-list-item-avatar>
              <v-spacer></v-spacer>
             <v-list-item-content>
                <v-list-item-title class="white--text"
                  >{{ $store.state.user.fname }}
                  {{
                    $store.state.user.lname.charAt(0).toUpperCase()
                  }}.</v-list-item-title
                >
                <v-list-item-subtitle class="white--text"
                  >{{ $store.state.user.usertype.description }} /
                  {{ getMyRole($store.state.user.user.user_roleID) }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon @click="menu = false">
                  <v-icon class="white--text">mdi-close-circle</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list> -->
          <v-list>
            <v-list-item @click="toProfile()">
              <v-list-item-action>
                <v-icon>mdi-account</v-icon>
              </v-list-item-action>
              <v-list-item-subtitle
                ><strong>Profile</strong></v-list-item-subtitle
              >
            </v-list-item>
            <v-list-item @click="logout()">
              <v-list-item-action>
                <v-icon>mdi-logout</v-icon>
              </v-list-item-action>
              <v-list-item-subtitle
                ><strong>Sign Out </strong></v-list-item-subtitle
              >
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-app-bar>

    <!-- Main Dashboard -->
    <v-main :style="{
      backgroundImage: 'url(' + require('@/assets/img/bg104.jpg') + ')',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'right center'
    }">
      <v-container fluid >
        <v-row >
          <v-col
            :cols="$vuetify.breakpoint.smAndUp ? '12' : '12'"
            class="pa-3 border mt-5"
          >
            <div class=" fill-height pb-6" >
              <!-- <div class="d-flex justify-space-between py-4 px-4  ">
                <div>
                  <v-select
                    style="width: 150px;"
                    label="School Year"
                    color="#F5B027"
                    @change="changeFilter()"
                    outlined
                    v-model="selectedFiter"
                    dense
                    item-text="school_year"
                    item-value="id"
                    :items="schooYearList"
                  ></v-select>
                </div>
                <strong class="text-gray-100">{{ $route.meta.title }}</strong>
              </div> -->
              <router-view v-on:reloadProfile="loadImg" />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  props: ["screenSmall", "reloadImg"],
  watch: {
    screenSmall: {
      handler(val) {
        this.drawer = val;
        this.mini = false;
      },
    },
    reloadImg: {
      handler() {
        this.loadImg();
      },
    },
  },
  data() {
    return {
      search: "",
      formattedDate: "",
      mini: false,
      drawer: true,
      profImg: null,
      mobile: false,
      isActiveOIC: false,
      userRoleList: [],
      links: [],
      userType: null,
      notif_cnt: 0,
      showAllNotifDialog: false,
      interval: null,
      loading: false,
      options: [],
      schooYearList: [],
      sidebarOpen: true,
      selectedFiter: null,
    };
  },

  mounted() {
    this.getSchoolYear();
    this.loadImg();
    this.formattedDate = this.getFormattedDate();

    if (this.$vuetify.breakpoint.xs) {
      this.drawer = false;
      this.mini = false;
    }
  },

  methods: {
    getFormattedDate() {
      const date = new Date();

      const options = {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      };

      return date.toLocaleDateString("en-US", options);
    },
    toggleSidebar() {
      this.mini = !this.mini;
    },
    getMyRole(id) {
      var role;
      for (let i = 0; i < this.userRoleList.length; i++) {
        if (parseInt(this.userRoleList[i].id) == parseInt(id)) {
          role = this.userRoleList[i].description;
        }
      }
      return role;
    },

    loadImg() {
      this.axiosCall("/user-details/getUserProfileImg", "GET").then((res) => {
        this.profImg =
          process.env.VUE_APP_SERVER +
          "/user-details/getProfileImg/" +
          res.data.profile_img;
      });
    },
    toProfile() {
      var usertype = this.$store.state.user.usertype.description;
      if (this.$store.state.user.user.user_roleID == 5) {
        this.$router.push("/superadmin/profile");
      } else {
        this.$router.push("/" + usertype.toLowerCase() + "/profile");
      }
    },
    getCurrentDate() {
      const cur_date = new Date();
      const month = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const day = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      return (
        day[cur_date.getDay()] +
        ", " +
        month[cur_date.getMonth()] +
        " " +
        cur_date.getDate() +
        "; " +
        this.formatAMPM(cur_date)
      );
    },
    formatAMPM(date) {
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? "pm" : "am";
      hours = hours % 12;
      hours = hours ? hours : 12;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      var strTime = hours + ":" + minutes + " " + ampm;
      return strTime;
    },

    closeNav() {
      this.drawer = false;

      this.$emit("closeNav");
    },
    changeFilter() {
      this.$store.commit("setFilterSelected", this.selectedFiter);
    },

    getSchoolYear() {
      this.axiosCall("/enroll-student/getSchoolYear", "GET").then((res) => {
        if (res) {
          this.selectedFiter = res.data[0].id;
          const activeYear = res.data.find((item) => item.status === 1);
          if (activeYear) {
            this.selectedFiter = activeYear.id;
          }
          this.$store.commit("setFilterSelected", this.selectedFiter);
          let data = res.data;
          this.schooYearList = data;
        }
      });
    },

    loadMenu(userType, userRole) {
      this.axiosCall("/assigned-modules/getMyAssignedModules/my", "GET").then(
        (resp) => {
          this.links = JSON.parse(resp.data.assign_mods);
          switch (userType) {
            case 1:
              this.userType = "admin";

              break;
            case 2:
              if (userRole == 5) {
                this.userType = "superadmin";
              } else {
                this.userType = "employee";
              }
              break;
            case 3:
              this.userType = "security";

              break;
            case 4:
              this.userType = "auditor";

              break;
          }
        }
      );
    },
  },
  beforeDestroy() {
    // prevent memory leak
    clearInterval(this.interval);
  },

  created: function() {
    // this.getMyAssignedModules();
    let userType = this.$store.state.user.user.usertypeID;

    let userrole = this.$store.state.user.user.user_roleID;
    // this.getMyDesignation();
    this.loadMenu(userType, userrole);

    this.interval = setInterval(() => {
      this.getMyNotifs();
    }, 180000);
  },
};
</script>

<style scoped>
.sidebar {
  border-top-right-radius: 30px;
  border-bottom-right-radius: 30px;
  overflow: hidden;
}
.sidebar-item {
  border-radius: 12px;
  margin: 8px;
  transition: background 0.3s;
  font-family: 'Segoe UI' !important;
}
/* .sidebar-item.active {
  background-color: rgba(253, 252, 252, 0.2);
} */
.rounded-lg {
  border-radius: 16px !important;
}
.v-list-group--active {
  background-color: #f3c74d !important;
  border-radius: 5px;
  color: rgb(255, 255, 255) !important;
  font-family: 'Segoe UI' !important;
}
.v-list-item--active {
  /* background-color: #ffd560 !important; */
  /* color: #000000 !important; */
  font-family: 'Segoe UI' !important;
}
.v-list-group--active .v-list-item--active {
  background-color: #926c03 !important;
  color: #ffffff !important;
  font-family: 'Segoe UI' !important;
}
</style>
