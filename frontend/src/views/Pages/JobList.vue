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
      <!-- LEFT BUTTON -->
      <button class="nav-btn left" @click="prev">❮</button>

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
              <h3>{{ job.position_title || "Administative Aide II" }}</h3>
              <div class="badge">Available</div>
            </div>

            <div class="grid">
              <!-- COLUMN 1 -->
              <div class="content">
                <div class="row">
                  <span>Item No.:</span>
                  <b>{{ job.plantilla_item || "N/A" }}</b>
                </div>

                <div class="row">
                  <span>Salary Grade:</span>
                  <b>
                    <span class="pill">
                      {{
                        job.salary_grade == 0 ? "N/A" : "SG " + job.salary_grade
                      }}
                    </span>
                  </b>
                </div>

                <div class="row">
                  <span>{{
                    job.salary_grade == 0 ? "Salary :" : "Monthly Salary :"
                  }}</span>
                  <b>₱{{ display(job.monthly_salary) }}</b>
                </div>
              </div>

              <!-- COLUMN 2 -->
              <div class="content">
                <div class="row">
                  <span>Department:</span>
                  <b>{{ display(job.unit_department) }}</b>
                </div>

                <div class="row">
                  <span>Assignment:</span>
                  <b>{{ display(job.place_assignment) }}</b>
                </div>

                <div class="row">
                  <span>Eligibility:</span>
                  <b>{{ display(job.eligibility) }}</b>
                </div>
              </div>
            </div>

            <!-- DETAILS -->
            <div class="details">
              <div class="section">
                <h4>Competency:</h4>
                <ul>
                  <li
                    class="section-content"
                    v-html="job.competency ? job.competency : 'None Required'"
                  ></li>
                </ul>
              </div>

              <div class="section">
                <h4>Experience:</h4>
                <ul>
                  <li
                    class="section-content"
                    v-html="job.experience ? job.experience : 'None Required'"
                  ></li>
                </ul>
              </div>

              <div class="section">
                <h4>Education:</h4>
                <ul>
                  <li
                    class="section-content"
                    v-html="job.education ? job.education : 'None Required'"
                  ></li>
                </ul>
              </div>

              <div class="section">
                <h4>Training:</h4>
                <ul>
                  <li
                    class="section-content"
                    v-html="job.training ? job.training : 'None Required'"
                  ></li>
                </ul>
              </div>
            </div>

            <!-- ✅ APPLY NOW BUTTON -->
            <div class="btn" @click="dataPrivacy(job)">Apply Now</div>
          </div>
        </div>
      </div>

      <!-- RIGHT BUTTON -->
      <button class="nav-btn right" @click="next">❯</button>

      <!-- NAV BUTTONS (BOTTOM ON MOBILE) -->
      <div class="nav-mobile">
        <button class="nav-btn" @click="prev">❮</button>
        <button class="nav-btn" @click="next">❯</button>
      </div>
    </div>

    <!-- DATA PRIVACY MODAL -->
    <div v-if="showDataPrivacy" class="privacy-overlay">
      <div class="privacy-modal">
        <h2>Data Privacy Statement</h2>
        <p>
          Davao del Norte State College (DNSC) will gather your name, email
          address, contact numbers, and other personal details. These details
          are collected for the purpose of your application for a vacant
          position.
        </p>

        <p>
          The personal information and other requested credentials will be kept
          for as long as necessary to fulfill the intended purpose. DNSC ensures
          that this information and documents remain secure and accessible
          solely to authorized individuals.
        </p>
        <p>
          When it comes time for disposal, it will be done securely to prevent
          further processing unauthorized access, or disclosure to any third
          part or the public.
        </p>
        <p>
          All actions are taken in strict adherence to the provisions of RA
          10173, also knows as the Data Privacy Act of 2012, and its
          implementing rules.
        </p>
        <p>
          By continuing you express your consent for DNSC to collect, process,
          store, and dispose of your personal information in accordance with RA
          10173 and its regulations.
        </p>
        <p>
          All provided information and uploaded credentials will be handled with
          the utmost confidentiality. Thank you.
        </p>

        <div class="actions">
          <button class="cancel" @click="showDataPrivacy = false">
            Cancel
          </button>

          <button class="apply" @click="proceedApply">I Agree</button>
        </div>
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
      job: null,
      showDataPrivacy: false,
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
    if (this.$route.params && this.$route.params.job) {
      this.job = this.$route.params.job;
    }
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
    dataPrivacy(job) {
      this.job = job; // 🔥 important fix
      this.showDataPrivacy = true;
    },

    // ✅ REDIRECT AFTER AGREE
    proceedApply() {
      this.showDataPrivacy = false;

      this.$router.push({
        path: "/jobrequirements",
        query: {
          job: JSON.stringify(this.job), // 🔥 safer for routing
        },
      });
    },

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
    display(val) {
      return val ? val : "None Required";
    },
  },
};
</script>

<style scoped>
/* ROW */
/* EACH CELL */
.row {
  display: grid;
  grid-template-columns: 92px 1fr;
  justify-content: start;
  align-items: start;
  align-content: start;
  padding: 8px 12px;
}

.row span {
  font-weight: 500;
  font-size: 15px;
  white-space: nowrap;
  align-self: start;
  padding: 7px 5px;
}

.row b {
  text-align: right;
  font-weight: 100;
  font-size: 14px !important;
  word-break: break-word;
  text-align: right;
  align-self: start;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding: 7px 5px;
}

/* DETAILS */
.details {
  flex: 1;
  overflow-y: auto;
  flex-direction: column;
  gap: 10px;
  padding: 7px 4px;
  flex: 1;
}
.section {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin: 0;
}

.section h4 {
  font-size: 15px;
  font-weight: 400;
}
.section b {
  opacity: 0.8;
  font-weight: 100;
  white-space: nowrap;
  font-size: 14px;
}

.section-content {
  opacity: 0.9;
  font-weight: 100;
  font-size: 14px !important;
  margin-left: 10px;
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

  /* 🔥 FIX 1: dynamic height (mobile safe) */
  min-height: 100dvh; /* modern fix */
  min-height: 100vh; /* fallback */

  width: 100%;

  /* 🔥 FIX 2: background behavior */
  background-image: url("../../assets/img/bg_img.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  /* 🔥 FIX 3: prevent cutoff */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  overflow: hidden; /* prevents scroll issues */
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
}

/* HEADER */
.header1 {
  position: relative;
  color: white;
  text-align: center;
  max-width: 700px;
  font-size: 22px;
  margin-top: 15px;
}

.carousel-container {
  position: relative;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

/* BUTTON BASE */
.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 55px;
  height: 55px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.25);
  color: white;
  font-size: 22px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: 0.3s;
  z-index: 10;
}

/* LEFT SIDE */
.nav-btn.left {
  left: -70px;
}

/* RIGHT SIDE */
.nav-btn.right {
  right: -70px;
}

/* DEFAULT: HIDE MOBILE NAV */
.nav-mobile {
  display: none;
}

/* =========================
   MOBILE FIX
========================= */
@media (max-width: 768px) {
  /* ❌ HIDE SIDE BUTTONS */
  .nav-btn.left,
  .nav-btn.right {
    display: none;
  }

  /* ✅ SHOW BOTTOM BUTTONS */
  .nav-mobile {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
    position: relative;
    z-index: 20;
  }

  .nav-mobile .nav-btn {
    position: relative; /* remove absolute */
    top: auto;
    transform: none;
    width: 45px;
    height: 45px;
  }
}
.nav-btn:hover {
  background: rgba(255, 255, 255, 0.4);
}
/* VIEWPORT */
.viewport {
  overflow: hidden;
  width: 100%;
  padding: 40px 100px;
  box-sizing: border-box;
}

/* TRACK */
.track {
  display: flex;
  gap: 150px;
  transition: transform 0.5s ease;
}

/* GRID */
.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px 40px;
  align-items: start;
}
/* CARD */
.card {
  width: 700px;
  box-sizing: border-box;
  max-height: 650px;
  border-radius: 20px;
  padding: 20px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  transition: all 0.4s ease;
}
.top {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.top h3 {
  font-size: 25px !important;
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
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 100%;
}
.footer {
  margin-top: auto;
}
.pill {
  display: flex;
  justify-content: center;
  width: 60%;
  background: #147452;
  padding: 7px 10px;
  border-radius: 20px;
  font-size: 12px;
  line-height: 1;
  white-space: nowrap;
}
.btn {
  width: 25%;
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
  margin-top: auto;
  margin-left: auto;
  margin-right: auto;
}
.btn:hover {
  background: rgba(255, 255, 255, 0.4);
}
.nav-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  width: 100%;
  margin-top: 25px;
}

.nav-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.25);
  color: white;
  font-size: 20px;
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

/* OVERLAY */
.privacy-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  padding: 15px;
}

/* MODAL */
.privacy-modal {
  width: 500px;
  max-width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 18px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: white;
  animation: fadeIn 0.3s ease;
}

/* TEXT FIX */
.privacy-modal p {
  font-size: 14px;
  opacity: 0.9;
  margin: 10px 0;
  text-align: justify;
}

/* HEADINGS */
.privacy-modal h2 {
  font-size: 18px !important;
  font-weight: 600;
  text-align: center;
  margin-bottom: 20px;
}

/* ACTIONS */
.privacy-modal .actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
  flex-wrap: wrap;
}
/* ACTIONS */
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.cancel,
.apply {
  font-size: 14px;
  padding: 8px 15px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  transition: 0.3s;
}

.cancel {
  background: rgba(255, 255, 255, 0.3);
  color: white;
}

.cancel:hover {
  background: rgba(255, 255, 255, 0.4);
}

.apply {
  background: #147452;
  color: white;
}

.apply:hover {
  background: rgba(20, 116, 82, 0.4);
}
/* ✅ FIXED RESPONSIVE (NO BREAK) */
/* =========================
   TABLET
========================= */
@media (max-width: 1024px) {
  .viewport {
    padding: 40px 100px;
  }

  .track {
    gap: 80px;
  }

  .card {
    max-width: 600px;
  }
}

/* =========================
   MOBILE
========================= */
@media (max-width: 768px) {
  .viewport {
    padding: 20px;
  }
  .track {
    gap: 10px;
  }

  /* 🔥 SINGLE COLUMN */
  .grid {
    grid-template-columns: 1fr;
  }

  /* TEXT SIZE */
  .header1 {
    font-size: 18px;
    padding: 0 10px;
  }

  .top h3 {
    font-size: 20px !important;
  }

  /* NAV SMALL */
  .nav-btn {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }

  /* BUTTON CENTER */
  .btn {
    margin: 20px auto 0;
  }
}

/* =========================
   SMALL MOBILE
========================= */
@media (max-width: 480px) {
  .viewport {
    padding: 20px;
  }

  .card {
    width: 380px;
  }
  .track {
    gap: 20px;
  }

  .card {
    max-width: 100%;
    padding: 15px;
  }

  .header1 {
    font-size: 14px;
  }

  .row {
    grid-template-columns: 80px 1fr;
    padding: 6px 8px;
  }

  .row span {
    font-size: 13px;
  }

  .row b {
    font-size: 13px !important;
  }

  .section h4 {
    font-size: 14px;
  }

  .section-content {
    font-size: 13px !important;
  }

  .btn {
    width: 100%;
  }
}

@media (max-width: 320px) {
  .viewport {
    padding: 20px;
  }

  .card {
    height: 400px;
  }
}
</style>
