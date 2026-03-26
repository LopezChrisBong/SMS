<template>
  <div class="hero">
    <div class="overlay"></div>

    <!-- HEADER -->
    <div class="header1">
      <p>
        Interested and qualified applicants should signify their interest and
        upload the documents not later than April 30, 2026.
      </p>
    </div>

    <!-- CAROUSEL -->
    <div class="carousel-container">
      <div class="viewport">
        <div
          class="track"
          :style="{ transform: 'translateX(' + translateX + 'px)' }"
        >
          <div
            v-for="(job, index) in jobs"
            :key="index"
            class="card"
            :class="getClass(index)"
          >
            <div class="top">
              <h3>{{ job.position_title }}</h3>
              <div class="badge">Available</div>
            </div>

            <div class="content">
              <div class="row">
                <span class="label">Monthly Salary:</span>
                <span class="value">₱{{ job.monthly_salary }}</span>
              </div>

              <div class="row">
                <span class="label">Department:</span>
                <span class="value">{{ job.unit_department }}</span>
              </div>

              <div class="row">
                <span class="label">Assignment:</span>
                <span class="value">{{ job.place_assignment }}</span>
              </div>

              <div class="row exp-row">
                <span class="label">Experience:</span>
                <span class="value exp"
                  ><div v-html="job.experience"></div
                ></span>
              </div>
            </div>

            <div class="btn" @click="goToDetails(job)">Read More</div>
          </div>
        </div>
      </div>

      <div class="nav-container">
        <button class="nav-btn" @click="prev">❮</button>
        <button class="nav-btn" @click="next">❯</button>
      </div>
    </div>
  </div>
</template>

<script>
// import JobDetails from "./JobDetails.vue";

export default {
  components: {
    // JobDetails,
  },

  data() {
    return {
      selectedJob: null,
      current: 0,

      // dynamic values (auto updated)
      containerWidth: 0,
      cardWidth: 400,
      gap: 100,

      jobs: [
        {
          item_no: "DDNSCB-PDO1-18-2025",
          title: "Administrative Aide VI",
          salary: "₱19,716.00",
          salara_grade: "SG 11",
          department: "Curriculum and Instruction Division",
          assignment: "DNSC Main Campus",
          eligibility: "Career Service (Professional) Second Level Eligibility",
          education: "Bachelor of Science in Information Technology",
          training: "Non Required",
          competency:
            "“Core & Org: Intermediate ; Leadership: Basic Preferably with background in linkages and partnership development”",
          experience:
            "Completion of two-year studies in college (prior to 2018) or Completion of Grade 12 / Senior High School (starting 2026)",
        },
        {
          title: "Clerk III",
          salary: "₱21,000.00",
          department: "Admin Office",
          assignment: "DNSC Branch",
          experience:
            "Completion of two-year studies in college (prior to 2018) or Completion of Grade 12 / Senior High School (starting 2026)",
        },
        {
          title: "IT Officer I",
          salary: "₱30,000.00",
          department: "IT Department",
          assignment: "Main Campus",
          experience: "Bachelor's degree in IT or related field",
        },
        {
          title: "IT Officer I",
          salary: "₱30,000.00",
          department: "IT Department",
          assignment: "Main Campus",
          experience: "Bachelor's degree in IT or related field",
        },
        {
          title: "Clerk III",
          salary: "₱21,000.00",
          department: "Admin Office",
          assignment: "DNSC Branch",
          experience:
            "Completion of two-year studies in college (prior to 2018) or Completion of Grade 12 / Senior High School (starting 2026)",
        },
      ],
    };
  },

  mounted() {
    this.initialize();
    this.$nextTick(() => {
      this.updateSizes();
    });

    window.addEventListener("resize", this.updateSizes);
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.updateSizes);
  },

  computed: {
    translateX() {
      return (
        (this.containerWidth - this.cardWidth) / 2 -
        this.current * (this.cardWidth + this.gap)
      );
    },
  },

  methods: {
    initialize() {
      this.axiosCall("/job-posting/DnscPage/active", "GET").then((res) => {
        if (res) {
          this.jobs = res.data;
        }
      });
    },
    updateSizes() {
      const viewport = this.$el.querySelector(".viewport");
      const card = this.$el.querySelector(".card");
      const track = this.$el.querySelector(".track");

      if (viewport && card && track) {
        const styles = getComputedStyle(viewport);

        const paddingLeft = parseFloat(styles.paddingLeft) || 0;
        const paddingRight = parseFloat(styles.paddingRight) || 0;

        // ✅ REAL usable width (fix center issue)
        this.containerWidth = viewport.clientWidth - paddingLeft - paddingRight;

        this.cardWidth = card.offsetWidth;
        this.gap = parseFloat(getComputedStyle(track).gap) || 100;
      }
    },

    next() {
      if (this.current < this.jobs.length - 1) {
        this.current++;
      }
    },

    prev() {
      if (this.current > 0) {
        this.current--;
      }
    },

    getClass(index) {
      if (index === this.current) return "active";
      if (Math.abs(index - this.current) === 1) return "side";
      return "hidden";
    },

    goToDetails(job) {
      this.$router.push({ name: "JobDetails", params: { job } });
    },

    openDetails(job) {
      this.selectedJob = job;
    },
  },
};
</script>

<style scoped>
.row {
  display: grid;
  grid-template-columns: 170px 1fr;
  align-items: start;

  height: 25px; /* ✅ ensures uniform spacing */
  margin-top: 5px;
  margin-bottom: 10px;

  padding-left: 13px;
  padding-right: 13px;
}
.row.exp-row {
  display: flex !important;
  flex-direction: column !important;
  align-items: flex-start;
  height: auto;
  margin-top: 10px;
}
.label {
  font-weight: 500;
  text-align: left;
}

.value {
  text-align: left;
  word-break: break-word;
  line-height: 1.3;
  font-weight: 100;
}
.exp {
  font-size: 14px;
  opacity: 0.9;
}
/* BACKGROUND */
.hero {
  position: relative;
  min-height: 100vh;
  background-image: url("../../assets/img/bg_img.png");
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: "Poppins", sans-serif;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
}

/* HEADER */
.header1 {
  position: relative;
  color: white;
  text-align: center;
  max-width: 700px;
  margin-bottom: 20px;
  font-size: 22px;
}

/* CONTAINER */
.carousel-container {
  position: relative;
  width: 100%;
  max-width: 1400px; /* ✅ FIXED */
  margin: 0 auto;
}

/* VIEWPORT */
.viewport {
  overflow: hidden;
  width: 100%;
  padding: 40px 100px; /* ✅ gives breathing space */
  box-sizing: border-box;
}

/* TRACK */
.track {
  display: flex;
  gap: 100px;
  transition: transform 0.5s ease;
}

/* CARD */
.card {
  width: 400px;
  box-sizing: border-box;
  height: 380px;
  border-radius: 20px;
  padding: 20px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  /* background-color: rgb(255, 255, 255); */

  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(3px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  justify-content: space-between;
  transition: all 0.4s ease;
}
.top {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px; /* ✅ consistent spacing */
  min-height: 60px; /* ✅ prevents jumping */
}

.card h3 {
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  margin: 0;
}
/* STATES */
.card.active {
  transform: scale(1.05);
  opacity: 1;
}

.card.side {
  transform: scale(0.9);
  opacity: 0.5;
}

.card.hidden {
  opacity: 0;
  pointer-events: none;
}

/* BADGE */
.badge {
  background: #147452;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  margin: 1px auto;
  margin-bottom: 10px;
  width: fit-content;
}

/* CONTENT */
.content {
  flex: 1; /* ✅ takes available space */
  font-size: 14px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-top: 10px;
}
/* FOOTER (BUTTON FIX) */
.footer {
  margin-top: auto;
}

/* BUTTON */
.btn {
  width: 30%;
  padding: 10px;
  border-radius: 20px;
  border: none;

  background: rgba(255, 255, 255, 0.25);
  color: white;
  font-size: 14px;

  cursor: pointer;
  transition: 0.3s;

  display: flex;
  justify-content: center;
  align-items: center;

  margin-top: 15px; /* 🔥 pushes to bottom */
  margin-left: auto; /* center horizontally */
  margin-right: auto; /* center horizontally */
  margin-bottom: -5px;
}
.btn:hover {
  background: rgba(255, 255, 255, 0.4);
}

.nav-container {
  margin-top: 25px;
  display: flex;
  gap: 15px;
  justify-content: center;
}

.nav-btn {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.25);
  color: white;
  font-size: 18px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: 0.3s;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.4);
}
.nav:hover {
  background: rgba(255, 255, 255, 0.35);
}

.nav.left {
  left: -50px;
}

.nav.right {
  right: -50px;
}
/* ✅ FIXED RESPONSIVE (NO BREAK) */
@media (max-width: 1024px) {
  .viewport {
    padding: 30px 60px;
  }
}

@media (max-width: 768px) {
  .viewport {
    padding: 30px 60px;
  }

  .track {
    gap: 70px;
  }
}

@media (max-width: 480px) {
  .viewport {
    padding: 10px;
  }

  .header1 {
    font-size: 16px;
  }

  .track {
    gap: 40px;
  }

  .card {
    width: 350px;
  }
  .btn {
    width: 35%;
    padding: 10px;
  }
}
</style>
