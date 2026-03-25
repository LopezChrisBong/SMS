<template>
  <v-container fluid class="book-wrapper" fill-height>
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" md="10" lg="8">
        <v-card class="book-card" elevation="12">
          <div class="book-header white--text">
            <div class="d-flex justify-center align-center">
              <v-img
                max-width="90"
                src="../../assets/img/NEWLOGODNSC.png"
              ></v-img>
              <h1 class="mx-3">Davao del Norte State College</h1>
            </div>
            <!-- <p>Career Opportunities</p> -->
          </div>
          <div v-if="viewApplied">
            <JobPostApplicationFormDialog :action="action" :data="postData" />
          </div>
          <v-row>
            <v-col cols="12">
              <div class="book-container d-flex align-center justify-center">
                <div
                  class="hiring-text text-center white--text"
                  v-if="!viewApplied"
                >
                  <p style="font-size: 30px; font-weight: 600">
                    WE ARE HIRING!
                  </p>
                  <p>Shape the future with us.</p>
                  <!-- <p>
                    Davao del Norte State College is looking for passionate
                    educators and dedicated professionals to join our
                    institution.
                  </p> -->
                  <!-- <p>
                    Davao del Norte State College invites qualified and
                    interested applicants to apply for available teaching,
                    administrative, and support positions.
                  </p> -->
                  <p>
                    Davao del Norte State College is now accepting applications
                    from qualified individuals for various teaching,
                    non-teaching, and support positions.
                  </p>
                  <div class="d-flex jsutify-center align-center">
                    <v-img
                      class="ml-10"
                      max-width="230"
                      src="../../assets/img/career.png"
                    ></v-img>
                  </div>
                </div>

                <div ref="flipbook" class="flipbook" v-if="!viewApplied">
                  <div
                    class="page"
                    style="
                      background: linear-gradient(135deg, #f8f8f8, #bbb8b8);
                      border-radius: 0 10px 10px 0;
                    "
                  >
                    <div class="page-inner text-justify">
                      <div style="font-size: 14px">
                        <div class="d-flex justify-center align-center">
                          <h2>For Your Information!</h2>
                        </div>
                        <div>
                          1. Application Letter (addressed to the College
                          President – DR. JOY M. SORROSA) <br />2. Fully
                          accomplished Personal Data Sheet (PDS) with recent
                          passport-sized picture (CS form No. 212, Revised 2017)
                          which can be downloaded at
                          <a
                            href="https://csc.gov.ph/downloads/category/223-csc-form-212-revised-2017-personal-data-sheet"
                            style="color: blue; z-index: 1; position: relative"
                            >www.csc.gov.ph</a
                          >. <br />3. Performance rating in the present position
                          for one(1) year (if applicable). <br />4. Certificate
                          of Eligibility/Rating or Professional License as proof
                          of eligibility. <br />5. Transcript of Records,
                          including Diploma, Special Order and/or Certificate of
                          Authenticity and Validity (CAV) as proof of highest
                          education attained declared in PDS. <br />6.
                          Certificate of Employment/Service Contract as proof of
                          experience; and <br />7. Certificate/s of
                          Training/Seminar/Conferences as proof of
                          training/seminars attended decalared in PDS.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    v-for="(job, index) in jobs"
                    :key="job.id"
                    class="page"
                    :style="
                      index % 2 === 0
                        ? 'border-right:1px solid gray; box-shadow: 15px 15px 8px gray;  background: linear-gradient(135deg, #f8f8f8, #bbb8b8);border-radius: 10px 0 0 10px;'
                        : 'background: linear-gradient(270deg, #f8f8f8, #bbb8b8);border-radius: 0 10px 10px 0;'
                    "
                  >
                    <div
                      class="ma-3"
                      style="
                        border: #009e08 1px solid;
                        border-radius: 10px;
                        padding: 10px;
                      "
                    >
                      Interested and qualified applicants should signify their
                      interest and upload the documents not later than
                      <b>{{ formatDate(job.date_to) }}.</b>
                    </div>
                    <div class="page-inner">
                      <h2>{{ job.position_title }}</h2>

                      <p>
                        <strong
                          >{{
                            job.salary_grade == 0 ? "" : "Monthly "
                          }}Salary:</strong
                        >
                        ₱{{ job.monthly_salary }}
                      </p>
                      <p>
                        <strong>Department:</strong> {{ job.unit_department }}
                      </p>
                      <p>
                        <strong>Assignment:</strong> {{ job.place_assignment }}
                      </p>

                      <div class="mt-3">
                        <div>
                          <strong>{{
                            job.experience ? "Experience: " : "Education: "
                          }}</strong>
                        </div>
                        <div
                          v-if="!expandedJobs[job.id]"
                          class="job-content"
                          v-html="job.job_posting_content"
                        ></div>

                        <div
                          v-else
                          v-html="
                            job.experience
                              ? job.experience
                              : job.job_posting_content
                          "
                        ></div>
                        <!-- <v-btn
                          text
                          small
                          @click="expandedJobs[job.id] = !expandedJobs[job.id]"
                        >
                          {{ expandedJobs[job.id] ? "Show Less" : "Read More" }}
                        </v-btn> -->
                      </div>
                      <div>
                        <v-btn
                          style="
                            background-image: linear-gradient(
                              to bottom right,
                              #013d1f,
                              #009e08
                            );
                          "
                          dark
                          small
                          class="apply-btn"
                          :data-job="JSON.stringify(job)"
                          ><v-icon small>mdi-eye</v-icon>
                          View
                        </v-btn>
                      </div>
                    </div>
                  </div>

                  <div
                    class="page"
                    style="
                      background: linear-gradient(270deg, #f8f8f8, #bbb8b8);
                      border-radius: 0 10px 10px 0;
                    "
                  >
                    <div class="page-inner text-center">
                      <h2>Thank You</h2>
                      <p>
                        “Your skills are valuable. The right opportunity is
                        waiting for you to claim it.”
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  class="mouse-indicator text-center"
                  v-if="!viewApplied && clicked"
                >
                  <v-icon size="90" class="mouse-icon">
                    mdi-gesture-tap
                  </v-icon>
                  <div
                    class="white--text"
                    style="border: white 1px solid; border-radius: 10px"
                  >
                    <div>Click</div>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import $ from "jquery";
import "turn.js";
// npm install --save turn.js jquery
export default {
  components: {
    JobPostApplicationFormDialog: () =>
      import("../../components/Dialogs/Forms/JobPostApplicationFormDialog.vue"),
  },

  data() {
    return {
      pageFlip: null,
      viewApplied: false,
      postData: null,
      clicked: true,
      expandedJobs: {},
      action: null,
      jobs: [],
    };
  },

  mounted() {
    this.initialize();
    sessionStorage.setItem("lockedMode", "true");
    window.addEventListener("resize", this.handleResize);
    this.eventHub.$on("closeJobPostApplicationForm", () => {
      location.reload();
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
    this.eventHub.$off("closeJobPostApplicationForm");
  },
  methods: {
    initialize() {
      this.axiosCall("/job-posting/DnscPage/active", "GET").then((res) => {
        if (res) {
          this.jobs = res.data;
          console.log("Pages count:", this.$refs.flipbook.children.length);
          this.$nextTick(() => {
            this.reInitFlipbook();
          });
        }
      });
    },

    Apply(job) {
      console.log("JOB:", job);
      this.postData = job;
      this.action = "Add";
      this.viewApplied = true;
    },

    initFlipbook() {
      const width = this.getBookWidth();
      const height = width * 0.65;
      const isMobile = window.innerWidth < 600;

      const flipbook = $(this.$refs.flipbook);

      flipbook.turn({
        width: width,
        height: height,
        autoCenter: true,
        gradients: true,
        elevation: 20,
        display: isMobile ? "single" : "double",
      });

      flipbook.off("click");
      flipbook.on("click", (e) => {
        const bookWidth = flipbook.width();
        const clickX = e.pageX - flipbook.offset().left;

        if (clickX > bookWidth / 2) {
          this.clicked = false;
          flipbook.turn("next");
        } else {
          flipbook.turn("previous");
        }
      });

      flipbook.on("click", ".apply-btn", (e) => {
        const job = JSON.parse($(e.currentTarget).attr("data-job"));
        this.Apply(job);
      });
    },
    handleResize() {
      this.reInitFlipbook();
    },
    reInitFlipbook() {
      const flipbook = $(this.$refs.flipbook);

      if (flipbook.data("turn")) {
        flipbook.turn("destroy");
        flipbook.removeAttr("style");
        flipbook.children().removeAttr("style");
      }

      this.initFlipbook();
    },
    getBookWidth() {
      const screenWidth = window.innerWidth;

      if (screenWidth < 600) {
        return screenWidth - 40;
      } else if (screenWidth < 960) {
        return screenWidth - 80;
      } else {
        return 800;
      }
    },
  },
};
</script>

<style scoped>
html,
body,
#app {
  height: 100%;
}
.book-wrapper {
  background: linear-gradient(135deg, #ffffff, #ffffff);
}

.book-card {
  padding: 40px;
  border-radius: 20px;
  max-width: 1000px;
  width: 100%;
  margin: auto;
}

.book-header {
  text-align: center;
  margin-bottom: 20px;
}

.book-header h1 {
  font-weight: 700;
  font-size: 40px;
  margin-bottom: 5px;
}

.book-header p {
  color: #777;
}

.flipbook {
  margin: auto;
}

.page {
  background: rgb(245, 245, 245);
}

.page-inner {
  padding: 20px;
}

.page-inner h2 {
  font-size: 22px;
  margin-bottom: 15px;
}

.page-inner p {
  font-size: 14px;
  line-height: 1.7;
}
.book-wrapper {
  background: linear-gradient(135deg, #ffffff, #ffffff);
  overflow-x: hidden;
  padding: 20px;
  min-height: 100vh; /*  important */
}
.book-card {
  overflow: hidden;
  background-image: linear-gradient(to bottom right, #013d1f, #009e08);
}
.apply-btn {
  position: absolute;
  bottom: 0;
  left: 0;
  margin-left: 10px;
  margin-bottom: 10px;
}
.hiring-text {
  position: absolute;
  top: 58%;
  left: 10%;
  transform: translateY(-50%);
  width: 320px;
  height: 520px;
  border: 1px solid white;
  border-radius: 10px;
  padding: 10px;
  justify-content: center;
  align-content: center;
  align-items: center;
}
.book-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
}
.job-content {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.mouse-indicator {
  position: absolute;
  right: 20%;
  bottom: 10px;
  animation: floatUpDown 2s ease-in-out infinite;
}

.mouse-icon {
  color: #2e7d32;
  opacity: 0.8;
  transition: transform 0.3s ease;
}

/* Floating animation */
@keyframes floatUpDown {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-12px);
  }
  100% {
    transform: translateY(0px);
  }
}
</style>
