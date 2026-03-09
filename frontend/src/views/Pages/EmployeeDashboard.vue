<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h2 class="mb-4">Teacher Dashboard</h2>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        v-for="subject in subjects"
        :key="subject.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card class="subject-card" elevation="2">
          <!-- SUBJECT TITLE -->
          <div class="subject-header">
            <div class="subject-icon">
              <v-icon color="white">mdi-book-open-page-variant</v-icon>
            </div>

            <div class="subject-info">
              <div class="subject-name">
                {{ subject.subject_title }}
              </div>

              <div class="subject-label">Attendance Summary</div>
            </div>
          </div>

          <v-divider class="my-2"></v-divider>

          <!-- STATS -->
          <v-card-text>
            <v-row class="mt-0">
              <!-- PRESENT -->
              <v-col cols="6">
                <div class="stat-box present-box">
                  <v-icon large color="green">mdi-check-circle</v-icon>

                  <div class="stat-number">
                    {{ subject.present }}
                  </div>

                  <div class="stat-text">Present</div>
                </div>
              </v-col>

              <!-- ABSENT -->
              <v-col cols="6">
                <div class="stat-box absent-box">
                  <v-icon large color="red">mdi-close-circle</v-icon>

                  <div class="stat-number">
                    {{ subject.absent }}
                  </div>

                  <div class="stat-text">Absent</div>
                </div>
              </v-col>
            </v-row>

            <!-- PROGRESS BAR -->
            <!-- <div class="progress-wrapper mt-3">
              <v-progress-linear
                :value="
                  (subject.present / (subject.present + subject.absent || 1)) *
                  100
                "
                height="8"
                rounded
                color="green"
                background-color="#eceff3"
              ></v-progress-linear>

              <div class="progress-label">Attendance Rate</div>
            </div> -->
          </v-card-text>

          <v-divider></v-divider>

          <!-- ACTION -->
          <v-card-actions class="px-4 pb-4">
            <v-btn
              min-height="50px"
              block
              class="view-btn"
              color="primary"
              :to="'/' + 'employee/my-student-record'"
              router
            >
              <v-icon left small>mdi-eye-outline</v-icon>
              View Student Records
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "TeacherDashboard",
  data() {
    return {
      subjects: [],
    };
  },
  mounted() {
    this.getMySubjectList();
  },
  methods: {
    async getMySubjectList() {
      const res = await this.axiosCall("/subjects/getMySubjects", "GET");

      if (res.data && res.data.length > 0) {
        let data = res.data;

        // Flatten if needed
        if (Array.isArray(data[0])) {
          data = data[0];
        }

        // Format titles + mark first as active
        data = data.map((item, index) => ({
          ...item,
          subject_title: this.toTitleCase(item.subject_title),
          active: index === 0,
        }));
        this.subjects = data;
        console.log(data);
      }
    },
  },
};
</script>

<style scoped>
.dashboard-container {
  background: #f4f6fa;
  min-height: 100vh;
  padding: 28px;
}

/* HEADER */

.dashboard-header {
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  padding: 22px 28px;
  border-radius: 14px;
  color: white;
  display: flex;
  align-items: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.header-left {
  display: flex;
  align-items: center;
}

.header-title {
  font-size: 22px;
  font-weight: 700;
}

.header-subtitle {
  font-size: 13px;
  opacity: 0.9;
}

/* CARD */

.subject-card {
  border-radius: 14px;
  transition: all 0.25s ease;
  border: 1px solid #eef1f5;
}

.subject-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.08);
}

/* SUBJECT HEADER */

.subject-header {
  display: flex;
  align-items: center;
  padding: 16px 18px 8px 18px;
}

.subject-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #4f8cff, #6ea8ff);
  display: flex;
  align-items: center;
  justify-content: center;
}

.subject-info {
  margin-left: 12px;
}

.subject-name {
  font-size: 15px;
  font-weight: 600;
}

.subject-label {
  font-size: 12px;
  color: #8a8a8a;
}

/* STATS */

.stat-box {
  text-align: center;
  padding: 6px;
}

.stat-number {
  font-size: 20px;
  font-weight: 700;
  display: block;
}

.stat-text {
  font-size: 14px;
  color: #777;
}

/* PROGRESS */

.progress-wrapper {
  padding: 0 6px;
}

.progress-label {
  font-size: 11px;
  color: #888;
  margin-top: 4px;
}

/* BUTTON */

.view-btn {
  border-radius: 8px;
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0.2px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}
</style>
