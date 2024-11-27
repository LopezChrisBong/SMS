<template>
  <v-app>
    <!-- Top Bar -->
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>
        <v-btn icon @click="sidebarOpen = !sidebarOpen">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
        <v-icon class="mr-2">mdi-facebook</v-icon>
        MyApp
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-bell</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-message</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Sidebar -->
    <v-navigation-drawer
      app
      v-model="sidebarOpen"
      :temporary="$vuetify.breakpoint.smAndDown"
      class="pa-3"
    >
      <v-list dense>
        <v-list-item>
          <v-list-item-avatar>
            <v-avatar>
              <img src="https://via.placeholder.com/150" alt="User" />
            </v-avatar>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>John Doe</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-account-group</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Friends</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-television</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Watch</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-calendar</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Events</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Layout with Content -->
    <v-main>
      <v-container fluid>
        <v-row>
          <!-- Feed -->
          <v-col cols="12" md="12" class="pa-3 px-2">
            <v-card outlined class="mb-4">
              <v-card-title>
                <v-avatar class="mr-3">
                  <img src="https://via.placeholder.com/150" alt="User" />
                </v-avatar>
                What's on your mind, John?
              </v-card-title>
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn text color="primary">Post</v-btn>
              </v-card-actions>
            </v-card>

            <!-- Example Posts -->
            <v-card outlined class="mb-4">
              <v-card-title>
                <v-avatar class="mr-3">
                  <img src="https://via.placeholder.com/150" alt="User" />
                </v-avatar>
                Jane Smith
              </v-card-title>
              <v-card-subtitle>2 hours ago</v-card-subtitle>
              <v-card-text>
                This is an example post. Welcome to the Facebook-like dashboard!
              </v-card-text>
              <v-card-actions>
                <v-btn text icon>
                  <v-icon>mdi-thumb-up</v-icon>
                </v-btn>
                <v-btn text icon>
                  <v-icon>mdi-comment</v-icon>
                </v-btn>
                <v-btn text icon>
                  <v-icon>mdi-share</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>

          <!-- Right Sidebar -->
          <v-col
            cols="3"
            class="pa-3"
            style="border-left: 1px solid #ddd;"
            v-if="$vuetify.breakpoint.mdAndUp"
          >
            <v-list dense>
              <v-subheader>Contacts</v-subheader>
              <v-list-item>
                <v-list-item-avatar>
                  <v-avatar>
                    <img src="https://via.placeholder.com/150" alt="User" />
                  </v-avatar>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>Jane Smith</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-avatar>
                  <v-avatar>
                    <img src="https://via.placeholder.com/150" alt="User" />
                  </v-avatar>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>Robert Johnson</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
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
      sidebarOpen: true, // Controls the visibility of the sidebar
    };
  },
};
</script>

<style>
/* Add any custom styles as needed */
</style>
