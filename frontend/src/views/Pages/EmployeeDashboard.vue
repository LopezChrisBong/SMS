<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h2 class="mb-4">Teacher Dashboard</h2>
      </v-col>
    </v-row>

    <v-row>
      <!-- Loop through subjects -->
      <v-col
        v-for="subject in subjects"
        :key="subject.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card outlined class="pa-3">
          <v-card-title>
            <v-icon color="primary" class="mr-2">mdi-book-open-variant</v-icon>
            <span class="text-h6">{{ subject.name }}</span>
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="6" class="text-center">
                <v-icon color="green" large>mdi-check-circle</v-icon>
                <div class="text-h6 green--text">
                  {{ subject.present }}
                </div>
                <div class="caption">Present</div>
              </v-col>

              <v-col cols="6" class="text-center">
                <v-icon color="red" large>mdi-close-circle</v-icon>
                <div class="text-h6 red--text">
                  {{ subject.absent }}
                </div>
                <div class="caption">Absent</div>
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-btn text small color="primary" @click="viewSubject(subject)">
              <v-icon small left>mdi-eye</v-icon>
              View Details
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
      subjects: [
        {
          id: 1,
          name: "Mathematics 10",
          present: 25,
          absent: 5,
        },
        {
          id: 2,
          name: "Science 9",
          present: 28,
          absent: 2,
        },
        {
          id: 3,
          name: "English 8",
          present: 27,
          absent: 3,
        },
      ],
    };
  },
  methods: {
    viewSubject(subject) {
      // This could navigate to subject details
      console.log("Viewing subject:", subject);
      this.$router.push({
        name: "SubjectAttendance",
        params: { id: subject.id },
      });
    },
  },
};
</script>

<style scoped>
.text-h6 {
  font-weight: bold;
}
</style>
