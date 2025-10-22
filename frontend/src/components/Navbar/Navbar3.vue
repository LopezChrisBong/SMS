<template>
  <v-app>
    <!-- ✅ TOP BAR -->
    <v-app-bar app flat color="white" class="px-5">
      <!-- Burger icon only visible when sidebar is hidden -->
      <v-app-bar-nav-icon
        v-if="!drawer"
        @click="drawer = true"
        class="mr-2"
      ></v-app-bar-nav-icon>

      <v-toolbar-title>
        <div class="title font-weight-bold">Hello, {{ userName }}</div>
        <div class="caption grey--text">
          Today is Monday, 20 October 2021
        </div>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-bell-outline</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-account-circle-outline</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- ✅ SIDEBAR -->
    <v-navigation-drawer
      v-model="drawer"
      app
      :mini-variant.sync="mini"
      :permanent="!$vuetify.breakpoint.smAndDown"
      temporary
      width="220"
      mini-variant-width="80"
      color="#3F2B96"
      dark
      class="sidebar"
    >
      <!-- Logo + Mini toggle -->
      <div class="d-flex align-center justify-space-between px-3 mt-4 mb-6">
        <div class="white--text font-weight-bold text-h6">
          <span v-if="!mini">CI</span><span class="font-weight-light">Mac</span>
        </div>

        <!-- Mini toggle -->
        <v-btn
          icon
          small
          color="white"
          @click="toggleSidebar"
          v-if="!$vuetify.breakpoint.smAndDown"
        >
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </div>

      <!-- Menu Items -->
      <v-list dense nav>
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
      </v-list>
    </v-navigation-drawer>

    <!-- ✅ MAIN CONTENT -->
    <v-main>
      <v-container fluid>
        <v-row>
          <v-col cols="12">
            <v-card class="pa-10 text-center" outlined>
              <h2>Dashboard Content</h2>
              <p>This area updates based on menu selection.</p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: true,
      mini: false,
      selected: 0,
      userName: "Chris",
      menuItems: [
        { icon: "mdi-view-dashboard", title: "Dashboard" },
        { icon: "mdi-cog-outline", title: "Settings" },
        { icon: "mdi-lock-outline", title: "Security" },
        { icon: "mdi-email-outline", title: "Messages" },
      ],
    };
  },
  mounted() {
    this.updateDrawerVisibility();
    window.addEventListener("resize", this.updateDrawerVisibility);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.updateDrawerVisibility);
  },
  methods: {
    toggleSidebar() {
      this.mini = !this.mini;
    },
    updateDrawerVisibility() {
      // Automatically hide sidebar on mobile
      if (this.$vuetify.breakpoint.smAndDown) {
        this.drawer = false;
        this.mini = false;
      } else {
        this.drawer = true;
      }
    },
  },
};
</script>

<style scoped>
.sidebar {
  transition: all 0.3s ease;
}

.sidebar-item {
  transition: background-color 0.3s;
}

.sidebar-item.active {
  background-color: rgba(255, 255, 255, 0.2);
}

.v-app-bar {
  border-bottom: 1px solid #eee;
}
</style>
