<template>
  <div class="details-page">
    <div class="overlay"></div>

    <div class="modal" v-if="job">
      <!-- HEADER -->
      <h2 class="title">{{ display(job.title) }}</h2>
      <div class="badge">Available</div>

      <!-- TOP GRID -->
      <div class="grid">
        <!-- LEFT -->
        <div class="card">
          <div class="row">
            <span>Item No.:</span>
            <b>{{ display(job.item_no) }}</b>
          </div>

          <div class="row">
            <span>Salary Grade:</span>
            <b :class="job.salara_grade ? 'pill' : ''">
              {{ display(job.salara_grade) }}
            </b>
          </div>

          <div class="row">
            <span>Monthly Salary:</span>
            <b>{{ display(job.salary) }}</b>
          </div>

          <div class="row">
            <span>Department:</span>
            <b>{{ display(job.department) }}</b>
          </div>
        </div>

        <!-- RIGHT -->
        <div class="card">
          <div class="row">
            <span>Assignment:</span>
            <b>{{ display(job.assignment) }}</b>
          </div>

          <div class="row">
            <span>Eligibility:</span>
            <b>{{ display(job.eligibility) }}</b>
          </div>

          <div class="row">
            <span>Competency:</span>
            <b class="wrap">{{ display(job.competency) }}</b>
          </div>
        </div>
      </div>

      <!-- DETAILS -->
      <div class="details">
        <div class="section">
          <b>Experience:</b>
          <p>{{ display(job.experience) }}</p>
        </div>

        <div class="section">
          <b>Education:</b>
          <p>{{ display(job.education) }}</p>
        </div>

        <div class="section">
          <b>Training:</b>
          <p>{{ display(job.training) }}</p>
        </div>
      </div>

      <!-- ACTIONS -->
      <div class="actions">
        <button class="cancel" @click="goBack">Cancel</button>
        <button class="apply" @click="dataPrivacy">Apply</button>
      </div>
    </div>

    <div v-else class="modal">
      <h2>No Job Data Found</h2>
      <button class="cancel" @click="goBack">← Back</button>
    </div>
    <!-- DATA PRIVACY MODAL -->
    <div v-if="showDataPrivacy" class="privacy-overlay">
      <div class="privacy-modal">
        <h2>Data Privacy Consent</h2>
        <h4>Data Privacy Statement</h4>
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
export default {
  data() {
    return {
      job: null,
      showDataPrivacy: false,
    };
  },

  mounted() {
    if (this.$route.params && this.$route.params.job) {
      this.job = this.$route.params.job;
    }
  },

  methods: {
    dataPrivacy() {
      this.showDataPrivacy = true; // always open
    },

    proceedApply() {
      this.showDataPrivacy = false;

      this.$router.push({
        path: "/jobrequirements",
        query: {
          title: this.job.title, // ✅ send title
        },
      });
    },
    display(val) {
      return val ? val : "None Required";
    },
    goBack() {
      this.$router.back();
    },
  },
};
</script>

<style scoped>
.details-page {
  position: relative;
  min-height: 100vh;
  background-image: url("../../assets/img/bg_img.png");
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Poppins", sans-serif;

  padding: 20px; /* ✅ prevents edge cut on small screens */
}

/* OVERLAY */
.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
}

/* MODAL */
.modal {
  width: 950px;
  max-width: 100%;
  padding: 20px;
  border-radius: 20px;

  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(3px);

  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;

  animation: fadeIn 0.4s ease;
}

/* HEADER */
.title {
  text-align: center;
  font-size: 25px !important;
  font-weight: 600;
  margin-bottom: 4px;
}

.badge {
  background: #147452;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  margin: 1px auto 12px;
  width: fit-content;
}

/* GRID */
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

/* CARDS */
.card {
  padding: 25px;
  border-radius: 15px;

  background: rgba(20, 116, 82, 0.01);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);

  border: 1px solid rgba(255, 255, 255, 0.2);

  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);

  position: relative;
  overflow: hidden;
}

/* ROW */
.row {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 10px;
  align-items: start;
}

.row span {
  opacity: 0.8;
  font-weight: 100;
  white-space: nowrap;
  font-size: 14px;
  margin-bottom: 18px;
}

.row b {
  justify-self: end;
  text-align: right;
  font-weight: 100;
  word-break: break-word;
  font-size: 14px;
  margin-bottom: 18px;
}

/* PILL */
.pill {
  background: #147452;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
}

/* DETAILS */
.details {
  margin-top: 20px;
}

.section {
  margin-bottom: 15px;
  font-weight: 100;
  font-size: 15px !important;
}

.section p {
  margin: 10px 0 0;
  opacity: 0.9;
  font-weight: 100;
  font-size: 15px !important;
  margin-left: 10px;
}

/* ACTIONS */
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap; /* ✅ prevents overflow */
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
/* OVERLAY */
.privacy-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 999;

  padding: 15px; /* ✅ prevent edge cut on small devices */
}

/* MODAL */
.privacy-modal {
  width: 500px;
  max-width: 100%;
  max-height: 90vh; /* ✅ prevent overflow */

  overflow-y: auto; /* ✅ scroll inside modal */

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
  text-align: justify; /* ✅ better readability */
}

/* HEADINGS */
.privacy-modal h2 {
  font-size: 18px !important;
  font-weight: 600;
  text-align: center;
}

.privacy-modal h4 {
  font-size: 15px !important;
  font-weight: 300;
  margin: 10px 0;
  text-align: left;
}

/* ACTIONS */
.privacy-modal .actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
  flex-wrap: wrap; /* ✅ prevents button overflow */
}

/* MOBILE FIX */
@media (max-width: 600px) {
  .privacy-modal {
    padding: 15px;
  }

  .privacy-modal h2 {
    font-size: 16px !important;
  }

  .privacy-modal p {
    font-size: 13px;
  }
}
/* ========================= */
/* ✅ RESPONSIVE FIXES ONLY */
/* ========================= */

/* Tablet */
@media (max-width: 900px) {
  .grid {
    grid-template-columns: 1fr; /* ✅ stack cards */
  }

  .modal {
    padding: 18px;
  }
}

/* Mobile */
@media (max-width: 600px) {
  .modal {
    padding: 15px;
  }

  .title {
    font-size: 20px !important;
  }

  /* 🔥 KEY FIX: rows stack properly */
  .row {
    grid-template-columns: 1fr; /* label on top */
  }

  .row span {
    margin-bottom: 5px;
  }

  .row b {
    justify-self: start;
    text-align: left;
    margin-bottom: 12px;
  }

  .card {
    padding: 18px;
  }
}

/* Small phones */
@media (max-width: 400px) {
  .modal {
    padding: 12px;
  }

  .card {
    padding: 15px;
  }
}

/* ANIMATION */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
