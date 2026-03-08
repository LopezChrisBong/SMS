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
            <span class="text-h6">{{ subject.subject_title }}</span>
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
            <v-btn
              text
              small
              color="primary"
              :to="'/' + 'employee/my-student-record'"
              router
            >
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
.text-h6 {
  font-weight: bold;
}
</style>
