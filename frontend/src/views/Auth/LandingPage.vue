<template>
  <div class="page">
    <div class="container">
      <!-- LEFT -->
      <div class="left">
        <div class="group-1">
          <div class="title">WE ARE <span>HIRING!</span></div>

          <p class="subtitle">Shape the future with us.</p>

          <p class="description">
            Davao del Norte State College is now accepting applications from
            qualified individuals for various teaching, non-teaching, and
            support positions.
          </p>
        </div>
        <div class="group-2">
          <button class="apply-btn" @click="ApplyNow">APPLY NOW</button>
        </div>

        <!-- CATEGORY BAR -->

        <div class="category-bar group-3">
          <div class="category">
            <div class="icon">
              <img src="../../assets/img/teaching.png" alt="" />
            </div>
            <div class="label">
              <strong>TEACHING</strong>
              <small>POSITIONS</small>
            </div>
          </div>

          <div class="divider"></div>

          <div class="category">
            <div class="icon">
              <img src="../../assets/img/non_teaching.png" alt="" />
            </div>
            <div class="label">
              <strong>NON-TEACHING</strong>
              <small>POSITIONS</small>
            </div>
          </div>

          <div class="divider"></div>

          <div class="category">
            <div class="icon">
              <img src="../../assets/img/support.png" alt="" />
            </div>
            <div class="label">
              <strong>SUPPORT</strong>
              <small>POSITIONS</small>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT -->
      <div class="right">
        <div class="requirements-card">
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
              Certificate of Training/Seminar/Conference as proof of
              training/seminars attended declared in PDS.
            </li>
          </ul>
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
  background-size: cover; /* fill the whole screen */
  background-position: center; /* center the image */
  background-repeat: no-repeat; /* prevent tiling */

  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Poppins", sans-serif;
}

/* MAIN CONTAINER */
.container {
  width: 92%;
  max-width: 2100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 150px;
  color: white;
}

/* GROUPS  */

.group-1 {
  display: flex;
  flex-direction: column;
  gap: -20px; /* 👈 controls spacing inside the group */
}

/* LEFT SIDE */
.left {
  flex: 1;
  max-width: 1500px;

  display: flex;
  flex-direction: column;
  gap: 75px; /* 👈 controls spacing between group-1, group-2, group-3 */
}

/* TITLE */
.title {
  font-size: 80px !important;
  font-weight: 800;
  letter-spacing: 1px;
  line-height: 1.1; /* important */
}

.title span {
  color: #e5ff1f;
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
  margin-top: 25px;
  background: white;
  color: #065f46;
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

/* CATEGORY BAR */
.category-bar {
  margin-top: 35px;
  display: flex;
  align-items: center;
  width: 90%;
  height: 130px;

  background: rgba(20, 116, 82, 0.9); /* 👈 use rgba */
  backdrop-filter: blur(2px); /* stronger blur */
  -webkit-backdrop-filter: blur(10px); /* Safari support */

  border-radius: 16px;
  overflow: hidden;
}

.category {
  flex: 1;
  text-align: center;
  padding: 18px 20px;
}

.icon {
  font-size: 22px;
  margin-bottom: 1px;
}

.icon img {
  width: 40px;
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

/* CARD */
.requirements-card {
  width: 620px;
  background: rgba(255, 255, 255, 0.92);
  color: #333;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
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
  gap: 25px;
}

.requirements-card li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 18px;
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

  background: #16a34a;
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

  .category-bar {
    width: 100%;
    justify-content: center;
  }

  .requirements-card {
    width: 100%;
    max-width: 850px;
  }
}

/* ===== TABLET (≤ 1024px) ===== */
@media (max-width: 1024px) {
  .container {
    gap: 60px;
  }

  .title {
    font-size: 48px;
  }

  .subtitle,
  .description {
    font-size: 25px;
  }

  .category-bar {
    height: auto;
    padding: 10px;
  }

  .category {
    padding: 10px;
  }
}

/* ===== MOBILE (≤ 768px) ===== */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
    gap: 30px;
  }

  .left,
  .right {
    width: 100%;
  }

  .left {
    align-items: flex-start;
    gap: 12px;
  }

  .title {
    font-size: 32px;
    margin-top: 10px;
  }

  .subtitle,
  .description {
    font-size: 20px;
  }

  .apply-btn {
    font-size: 13px;
  }

  .category-bar {
    width: 100%;
    height: auto;
    overflow-x: auto;
    gap: 10px;
  }

  .category {
    min-width: 100px;
    padding: 8px;
  }

  .icon img {
    width: 28px;
  }

  .label strong {
    font-size: 12px;
  }

  .requirements-card {
    padding: 18px;
  }

  .requirements-card h2 {
    font-size: 18px;
  }

  .requirements-card li {
    font-size: 14px;
  }
}

/* ===== SMALL MOBILE (≤ 480px) ===== */
@media (max-width: 480px) {
  .container {
    gap: 20px;
  }

  .title {
    font-size: 26px;
  }

  .apply-btn {
    width: 100%;
  }
}
</style>
