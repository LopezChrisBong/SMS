<template>
  <div class="page">
    <!-- LEFT -->
    <div class="left">
      <div class="group-1">
        <div class="title">WE ARE <span>HIRING!</span></div>
        <div class="requirements-card">
          <img src="../../assets/img/dnsc_logo.png" alt="" />
          <h2>Application <span>Requirements</span></h2>

          <ul>
            <li>
              Application Letter (addressed to the College President - DR. JOY
              M. SOROSSA)
            </li>
            <li>
              <div>
                Fully accomplished Personal Data Sheet (PDS) with recent
                passport-sized picture (CS Form No. 212, Revised 2017), which
                can be downloaded at
                <a
                  href="https://www.csc.gov.ph"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="link"
                >
                  www.csc.gov.ph
                </a>
              </div>
            </li>
            <li>
              Performance rating in the present position for one (1) year (if
              applicable).
            </li>
            <li>
              Certificate of Eligibility/Rating or Professional License as proof
              of Eligibility.
            </li>
            <li>
              Transcript of Records, including Diploma, Special Order and/or
              Certificate of Authenticity and Validity (CAV) as proof of highest
              education attained declared in PDS.
            </li>
            <li>
              Certificate of Employment/Service Contract as proof of experience;
              and
            </li>
            <li>
              Certificate of Training/Seminar/Conference as proof of training,
              seminars attended declared in PDS.
            </li>
          </ul>
        </div>
        <div class="group-2">
          <button class="apply-btn" @click="ApplyNow">
            View Open Positions
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HiringPage",
  components: {},
  data() {
    return {
      applyNow: false,
    };
  },
  methods: {
    ApplyNow() {
      this.$router.push("/joblist");
    },
  },
};
</script>

<style scoped>
/* PAGE BASE */
.page {
  min-height: 100vh;
  background-image: url("../../assets/img/bg_img.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  font-family: "Poppins", sans-serif;
}

/* MAIN CONTAINER */
.container {
  display: flex;
  width: 700px;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  color: white;
}

/* GROUPS  */

.group-1 {
  display: flex;
  flex-direction: column;
}

/* LEFT SIDE */
.left {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* TITLE */
.title {
  font-size: 70px !important;
  font-weight: 800;
  letter-spacing: 1px;
  line-height: 1.1; /* important */
  margin-bottom: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  gap: 10px;
  color: white;
}

.title span {
  color: #fcd212;
}

/* TEXT */
.subtitle {
  margin-top: 15px;
  font-size: 26px;
  opacity: 0.9;
}

.description {
  margin-top: 12px;
  max-width: 850px;
  line-height: 1.4;
  font-size: 26px;
  opacity: 0.95;
  font-weight: 300;
}

/* BUTTON */
.apply-btn {
  margin-top: 30px;
  background: white;
  color: #147452;
  border: none;
  padding: 10px 50px;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.3s;
}

.apply-btn:hover {
  transform: scale(1.05);
}

.label strong {
  display: block;
  font-size: 18px;
}

.label small {
  font-size: 11px;
  opacity: 0.8;
}

/* DIVIDER */
.divider {
  width: 1px;
  background: rgba(255, 255, 255, 0.3);
  height: 50px;
}

/* RIGHT SIDE */
.right {
  flex: 1;
  display: flex;
  justify-content: center;
}

.group-2 {
  width: 100%;
  display: flex;
  justify-content: center; /* 🔥 */
}

/* CARD */
.requirements-card {
  width: 620px;
  background: rgba(255, 255, 255, 0.92);
  color: #333;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}
.requirements-card img {
  width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 8px;
}
/* CARD TITLE */
.requirements-card h2 {
  font-size: 25px;
  margin-bottom: 15px;
  text-align: center;
}

.requirements-card span {
  color: #147452;
  font-weight: 700;
}

/* LIST */
.requirements-card ul {
  list-style: none; /* remove default bullets */
  padding: 0;
  margin: 0;

  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: justify;
}

.requirements-card li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 15px;
  line-height: 1.5;
}
/* CIRCLE CHECK ICON */
/* ICON */
.requirements-card li::before {
  content: "✔";
  display: flex;
  align-items: center;
  justify-content: center;

  width: 22px;
  height: 22px;
  min-width: 22px; /* 👈 IMPORTANT */

  background: #147452;
  color: white;
  font-size: 12px;
  font-weight: bold;

  border-radius: 50%;
  margin-top: 4px;

  flex-shrink: 0; /* 👈 prevents shrinking */
}

/* ========================= */
/* RESPONSIVE */
/* ========================= */

/* ===== LARGE (≤ 1424px) ===== */
@media (max-width: 1424px) {
  .title {
    margin-top: 20px;
  }

  .requirements-card {
    width: 500px;
  }
}

/* ===== LAPTOP (≤ 1265px) ===== */
@media (max-width: 1265px) {
  .container {
    flex-direction: column;
    align-items: center;
    gap: 50px;
    text-align: center;
  }

  .title {
    font-size: 60px;
    margin-top: 30px;
  }

  .requirements-card {
    width: 100%;
    max-width: 850px;
  }
}

/* ========================= */
/* RESPONSIVE */
/* ========================= */

/* TABLET */
@media (max-width: 1024px) {
  .container {
    flex-direction: column;
    gap: 30px;
  }
}

/* MOBILE */
@media (max-width: 768px) {
  .page {
    padding: 15px;
  }

  .requirements-card {
    padding: 16px;
  }

  .requirements-card h2 {
    font-size: 18px;
  }

  .requirements-card li {
    font-size: 13px;
  }

  .apply-btn {
    width: 100%;
  }
}

/* SMALL MOBILE */
@media (max-width: 480px) {
  .title {
    font-size: 35px !important;
  }
}
/* SMALL MOBILE */
@media (max-width: 320px) {
  .requirements-card {
    width: 100%;
  }
  .title {
    font-size: 35px !important;
  }
}
</style>
