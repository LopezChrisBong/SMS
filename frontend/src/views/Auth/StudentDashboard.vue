<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
      mini-variant-width="70"
      :mini-variant="mini"
      color="white"
      elevation="4"
    >
      <v-list dense>
        <v-list-item class="py-4">
          <v-list-item-icon>
            <v-icon color="primary">mdi-school</v-icon>
          </v-list-item-icon>

          <v-list-item-content v-if="!mini">
            <v-list-item-title class="font-weight-bold">
              {{ studentData.lname }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item link @click="page(1)">
          <v-list-item-icon
            ><v-icon>mdi-view-dashboard</v-icon></v-list-item-icon
          >
          <v-list-item-title v-if="!mini">Dashboard</v-list-item-title>
        </v-list-item>
        <!-- <v-list-item link @click="page(2)">
          <v-list-item-icon><v-icon>mdi-account</v-icon></v-list-item-icon>
          <v-list-item-title v-if="!mini">Profile</v-list-item-title>
        </v-list-item> -->
        <v-list-item link @click="page(3)">
          <v-list-item-icon><v-icon>mdi-logout</v-icon></v-list-item-icon>
          <v-list-item-title v-if="!mini">Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app flat color="white" clipped-left class="elevation-1">
      <v-app-bar-nav-icon @click="mini = !mini"></v-app-bar-nav-icon>

      <v-toolbar-title class="font-weight-bold">
        Welcome back, {{ studentData.lname }} 👋
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-chip color="primary" text-color="white" small> Active </v-chip>

      <v-avatar size="36" class="ml-4">
        <v-icon>mdi-account-circle</v-icon>
      </v-avatar>
    </v-app-bar>
    <v-container fluid class="pa-6 grey lighten-4">
      <!-- Loading Overlay -->
      <div v-if="loadingState" class="loading-overlay">
        <div class="spinner"></div>
        <p>Loading, please wait...</p>
      </div>
      <v-card class="pa-6 mt-6" rounded="xl" v-if="pageItem == 1">
        <h3 class="font-weight-bold mb-4">
          My Schedule {{ roomData.grade_level }}
          {{ roomData.room_section }}
        </h3>

        <v-data-table
          :headers="headers"
          :items="schedule"
          :loading="loading"
          outlined
          dense
          class="elevation-0"
        >
          <!-- <template v-slot:[`item.status`]="{ item }">
            <v-chip
              small
              :color="item.status === 'Passed' ? 'green' : 'orange'"
              dark
            >
              {{ item.status }}
            </v-chip>
          </template> -->
        </v-data-table>
      </v-card>
      <v-card class="pa-6 mt-6" rounded="xl" v-if="pageItem == 2">
        profile
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: true,
      mini: false,
      roomData: null,
      loadingState: false,
      studentData: null,
      pageItem: null,
      headers: [
        {
          text: "Time",
          value: "time",
          align: "start",
          valign: "start",
          sortable: false,
        },

        {
          text: "Monday",
          value: "Monday",
          align: "center",
          valign: "center",
          sortable: false,
        },
        {
          text: "Tuesday",
          value: "Tuesday",
          align: "center",
          valign: "center",
          sortable: false,
        },
        {
          text: "Wednesday",
          value: "Wednesday",
          align: "center",
          valign: "center",
          sortable: false,
        },
        {
          text: "Thursday",
          value: "Thursday",
          align: "center",
          valign: "center",
          sortable: false,
        },
        {
          text: "Friday",
          value: "Friday",
          align: "center",
          valign: "center",
          sortable: false,
        },
      ],
      schedule: [],
    };
  },
  mounted() {
    let student = localStorage.getItem("studentData");
    localStorage.setItem("lockedAccount", true);
    if (localStorage.getItem("pageNumber")) {
      this.pageItem = localStorage.getItem("pageNumber");
    } else {
      this.pageItem = 1;
    }

    this.studentData = JSON.parse(student);
    this.getStudentSchedule();
  },
  methods: {
    getStudentSchedule() {
      this.loading = true;
      this.axiosCall(
        "/enroll-student/getStudentSchedule/" + this.studentData.id,
        "GET",
      ).then((res) => {
        if (res) {
          console.log(res.data);
          this.schedule = res.data.data;
          this.roomData = res.data.roomData;
          this.loading = false;
        }
      });
    },
    page(item) {
      if (item == 1) {
        localStorage.setItem("pageNumber", item);
        this.getStudentSchedule();
        this.pageItem = 1;
      }
      // else if (item == 2) {
      //   this.pageItem = 2;
      //   localStorage.setItem("pageNumber", item);
      // }
      else {
        // alert("logout");
        this.loadingState = true;
        setTimeout(() => {
          this.loadingState = false;
          localStorage.clear();
          this.$router.push("/landing");
        }, 1500);
      }
    },
  },
};
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

.stat-card {
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 6px solid #ccc;
  border-top: 6px solid #1976d2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
</style>
