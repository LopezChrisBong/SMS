<template>
  <div class="apply-page">
    <div class="overlay"></div>

    <div class="glass-container">
      <!-- TITLE -->
      <h2 class="title">Application for {{ jobTitle || "Position" }}</h2>
      <div class="steps-wrapper" :style="{ '--steps': steps.length }">
        <!-- PROGRESS LINE -->
        <div class="progress-line">
          <div
            class="progress-fill"
            :style="{ width: progressWidth + '%' }"
          ></div>
        </div>

        <!-- STEPS -->
        <div class="steps">
          <div
            v-for="(step, index) in steps"
            :key="index"
            class="step"
            :class="{
              active: currentStep === index,
              done: currentStep > index,
            }"
          >
            <div class="circle">
              <span v-if="currentStep > index">✔</span>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <span>{{ step }}</span>
          </div>
        </div>
      </div>

      <!-- FORM CONTENT -->
      <div class="form-box">
        <!-- STEP 1 -->
        <div v-if="currentStep === 0">
          <p class="instruction">
            Instruction: Please enter "N/A" in any required field that does not
            apply to you.
          </p>

          <div class="grid">
            <div class="form-group">
              <label>First Name</label>
              <input v-model="form.firstName" />
            </div>

            <div class="form-group">
              <label>Middle Name</label>
              <input v-model="form.middleName" />
            </div>

            <div class="form-group">
              <label>Last Name</label>
              <input v-model="form.lastName" />
            </div>

            <div class="form-group">
              <label>Suffix</label>
              <input v-model="form.suffix" />
            </div>

            <div class="form-group">
              <label>Email Address</label>
              <input v-model="form.email" />
            </div>

            <div class="form-group">
              <label>Phone Number</label>
              <input v-model="form.phone" />
            </div>

            <div class="form-group">
              <label>Religion</label>
              <input v-model="form.religion" />
            </div>

            <div class="form-group">
              <label>Sex</label>
              <input v-model="form.sex" />
            </div>

            <div class="form-group">
              <label>Birth Date</label>
              <input type="date" v-model="form.birthDate" />
            </div>

            <div class="form-group full">
              <label>Address (Prk./Brgy./City/Municipality)</label>
              <input v-model="form.address" />
            </div>
          </div>
        </div>

        <!-- STEP 2 -->
        <div v-if="currentStep === 1">
          <p class="instruction">
            Instruction: Please enter "N/A" in any required field that does not
            apply to you.
          </p>
          <div class="grid1">
            <div class="form-group full1">
              <label>Highest Educational Attainement</label>
              <input v-model="form.highest_education" />
            </div>
            <div class="form-group">
              <label>Bachelor Degree/Course </label>
              <input type="date" v-model="form.bachelor" />
            </div>
            <div class="form-group">
              <label>Year Graduated/Earned Unit</label>
              <input type="date" v-model="form.bachelor_year_unit" />
            </div>
            <div class="form-group">
              <label>Master's Degree </label>
              <input type="date" v-model="form.masters" />
            </div>
            <div class="form-group">
              <label>Year Graduated/Earned Unit</label>
              <input type="date" v-model="form.bachelor_year_unit" />
            </div>
            <div class="form-group">
              <label>Doctorate Degree</label>
              <input type="date" v-model="form.bachelor" />
            </div>
            <div class="form-group">
              <label>Year Graduated/Earned Unit</label>
              <input type="date" v-model="form.bachelor_year_unit" />
            </div>
          </div>
        </div>

        <!-- STEP 3 -->
        <div v-if="currentStep === 2" class="gaps">
          <p class="instruction">
            Instruction: Please enter "N/A" in any required field that does not
            apply to you.
          </p>
          <div class="grid">
            <div class="form-group full">
              <label>Highest Educational Attainement</label>
              <input v-model="form.highest_education" />
            </div>
          </div>
          <div class="grid1">
            <div class="form-group">
              <label>Present/Latest Position</label>
              <input v-model="form.latest_organization" />
            </div>

            <div class="form-group">
              <label>Status of Employment</label>
              <input type="text" v-model="form.status_employement" />
            </div>
          </div>
          <div class="form-group full1">
            <label>Eligibility</label>
            <input v-model="form.eligibility" />
          </div>
          <p class="instruction">
            Instruction: Kindly check if you belong to any of the following:
          </p>

          <div class="checkbox-group">
            <!-- PWD -->
            <label class="checkbox-item">
              <input type="checkbox" v-model="form.isPwd" />
              Person with Disability - if yes, specify
            </label>
            <input
              v-if="form.isPwd"
              type="text"
              class="full"
              placeholder="Please specify"
              v-model="form.pwdDetails"
            />

            <!-- Pregnant -->
            <label class="checkbox-item">
              <input type="checkbox" v-model="form.isPregnant" />
              Pregnant
            </label>

            <!-- Indigenous -->
            <label class="checkbox-item">
              <input type="checkbox" v-model="form.isIndigenous" />
              Indigenous community - if yes, specify
            </label>
            <input
              v-if="form.isIndigenous"
              type="text"
              class="full"
              placeholder="Specify Indigenous community"
              v-model="form.indigenousDetails"
            />
          </div>
        </div>

        <!-- STEP 4 -->
        <div v-if="currentStep === 3">
          <p class="instruction">
            INSTRUCTION: Upload PDF files only. If multiple pages, merge into
            one (1) file.
          </p>

          <div class="upload-list">
            <div
              class="upload-item"
              v-for="item in uploadFields"
              :key="item.key"
            >
              <!-- LABEL -->
              <div class="upload-header">
                <label>
                  {{ item.label }}
                  <span v-if="item.required">*</span>
                </label>
              </div>

              <!-- BOX -->
              <div class="upload-box">
                <input
                  type="file"
                  accept="application/pdf"
                  @change="handleFile($event, item.key)"
                />

                <!-- EMPTY STATE -->
                <div v-if="!form[item.key]" class="upload-placeholder">
                  Click to upload PDF
                </div>

                <!-- FILE PREVIEW -->
                <div v-else class="file-preview">
                  <span class="file-tag">
                    {{ form[item.key].name }}
                  </span>

                  <span class="file-size">
                    ({{ formatSize(form[item.key].size) }})
                  </span>

                  <button @click="removeFile(item.key)">✕</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 5 -->
        <div v-if="currentStep === 4" class="review-container">
          <!-- PERSONAL -->
          <div class="review-section">
            <h3>Personal Information</h3>

            <div class="review-grid">
              <div class="review-item">
                <span class="label">Full Name</span>
                <span class="value">
                  {{ form.firstName }} {{ form.middleName }} {{ form.lastName }}
                </span>
              </div>

              <div class="review-item">
                <span class="label">Email</span>
                <span class="value">{{ form.email }}</span>
              </div>

              <div class="review-item">
                <span class="label">Phone</span>
                <span class="value">{{ form.phone }}</span>
              </div>

              <div class="review-item">
                <span class="label">Sex</span>
                <span class="value">{{ form.sex }}</span>
              </div>

              <div class="review-item full">
                <span class="label">Address</span>
                <span class="value">{{ form.address }}</span>
              </div>
            </div>
          </div>

          <!-- EDUCATION -->
          <div class="review-section">
            <h3>Education</h3>

            <div class="review-grid">
              <div class="review-item">
                <span class="label">Highest Attainment</span>
                <span class="value">{{ form.highest_education }}</span>
              </div>

              <div class="review-item">
                <span class="label">Bachelor</span>
                <span class="value">{{ form.bachelor }}</span>
              </div>
            </div>
          </div>

          <!-- EMPLOYMENT -->
          <div class="review-section">
            <h3>Employment</h3>

            <div class="review-grid">
              <div class="review-item">
                <span class="label">Latest Position</span>
                <span class="value">{{ form.latest_organization }}</span>
              </div>

              <div class="review-item">
                <span class="label">Status</span>
                <span class="value">{{ form.status_employement }}</span>
              </div>

              <div class="review-item">
                <span class="label">Eligibility</span>
                <span class="value">{{ form.eligibility }}</span>
              </div>

              <!-- CHECKBOX INFO -->
              <div class="review-item full" v-if="form.isPwd">
                <span class="label">PWD</span>
                <span class="value">{{ form.pwdDetails }}</span>
              </div>

              <div class="review-item" v-if="form.isPregnant">
                <span class="label">Pregnant</span>
                <span class="value">Yes</span>
              </div>

              <div class="review-item full" v-if="form.isIndigenous">
                <span class="label">Indigenous</span>
                <span class="value">{{ form.indigenousDetails }}</span>
              </div>
            </div>
          </div>

          <!-- FILES -->
          <div class="review-section">
            <h3>Uploaded Files</h3>

            <div class="file-list">
              <div
                v-for="item in uploadedFiles"
                :key="item.key"
                class="file-row"
              >
                <span class="file-label">{{ item.label }}</span>

                <span class="file-tag">
                  {{ form[item.key].name }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ACTIONS -->
      <div class="actions">
        <button class="cancel" @click="prevStep" :disabled="currentStep === 0">
          Return
        </button>

        <button class="apply" @click="nextStep">
          {{ currentStep === 4 ? "Submit" : "Next" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      jobTitle: "",
      currentStep: 0,
      steps: [
        "Personal Info",
        "Education",
        "Employment",
        "Upload Files",
        "Review",
      ],
      uploadFields: [
        {
          key: "applicationLetter",
          label: "Application Letter",
          required: true,
        },
        { key: "pds", label: "Personal Data Sheet (PDS)", required: true },
        { key: "performance", label: "Performance Rating", required: false },
        {
          key: "eligibilityFile",
          label: "Certificate of Eligibility/Rating",
          required: true,
        },
        { key: "tor", label: "Transcript of Records", required: true },
        { key: "coe", label: "Certificate of Employment", required: false },
        {
          key: "training",
          label: "Certificate/s of Training",
          required: false,
        },
      ],

      form: {
        firstName: "",
        middleName: "",
        lastName: "",
        suffix: "",
        email: "",
        phone: "",
        religion: "",
        sex: "",
        birthDate: "",
        address: "",
        education: "",
        school: "",
        yearGrad: "",
        company: "",
        position: "",
        experience: "",
        isPwd: false,
        pwdDetails: "",
        isPregnant: false,
        isIndigenous: false,
        indigenousDetails: "",
        applicationLetter: null,
        pds: null,
        performance: null,
        eligibilityFile: null,
        tor: null,
        coe: null,
        training: null,
      },
    };
  },
  computed: {
    progressWidth() {
      const total = this.steps.length - 1;
      return (this.currentStep / total) * 100;
    },
    uploadedFiles() {
      return this.uploadFields.filter((item) => this.form[item.key]);
    },
  },

  methods: {
    handleFile(event, field) {
      const file = event.target.files[0];

      if (file && file.type !== "application/pdf") {
        alert("Only PDF files are allowed.");
        return;
      }

      this.form[field] = file;
    },

    removeFile(field) {
      this.form[field] = null;
    },

    formatSize(size) {
      return (size / 1024).toFixed(1) + " kb";
    },
    nextStep() {
      if (this.currentStep < 4) {
        this.currentStep++;
      } else {
        alert("Submitted!");
      }
    },

    prevStep() {
      if (this.currentStep > 0) {
        this.currentStep--;
      }
    },
  },
  mounted() {
    if (this.$route.query.title) {
      this.jobTitle = this.$route.query.title;
    }
  },
};
</script>

<style scoped>
.apply-page {
  position: relative;
  min-height: 100vh;
  background-image: url("../../assets/img/bg_img.png");
  background-size: cover;
  display: flex;
  justify-content: center;

  font-family: "Poppins", sans-serif;
  font-weight: 100;
  align-items: flex-start;
  padding-top: 130px;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
}
.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 12px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}
/* WRAPPER */
.steps-wrapper {
  position: relative;
  margin-bottom: 25px;
}

/* LINE BACKGROUND */
.progress-line {
  position: absolute;
  top: 15px;

  left: calc(100% / (2 * var(--steps)));
  right: calc(100% / (2 * var(--steps)));

  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  z-index: 1;
}
/* LINE FILL (ANIMATED) */
.progress-fill {
  height: 100%;
  background: #147452;
  border-radius: 10px;
  transition: width 0.4s ease;
}

/* STEPS */
.steps {
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 2;
}

.step {
  text-align: center;
  flex: 1;
  opacity: 0.5;
  transition: 0.3s;
}

.step.active,
.step.done {
  opacity: 1;
}

/* CIRCLE */
.circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: gray;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s;
}

/* ACTIVE */
.step.active .circle {
  background: #147452;
}

/* DONE */
.step.done .circle {
  background: #147452;
  color: white;
  font-weight: bold;
}

/* GLASS CONTAINER */
.glass-container {
  width: 1020px;
  max-width: 95%;
  padding: 25px;
  border-radius: 20px;

  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);

  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;

  will-change: transform;
  transform: translateZ(0);
}

/* TITLE */
.title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px !important;
}

/* STEPS */
.steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.step {
  text-align: center;
  flex: 1;
  opacity: 0.5;
  transition: 0.3s;
}

.step.active {
  opacity: 1;
}

.step.done {
  opacity: 1;
}

/* CIRCLE */
.circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgb(148, 148, 148);
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s;
}

/* ACTIVE */
.step.active .circle {
  background: #147452;
}

/* DONE ✔ */
.step.done .circle {
  background: #147452;
  color: white;
  font-weight: bold;
}

/* FORM */
.form-box {
  /* background: rgba(255, 255, 255, 0.15); */
  background: white;
  padding: 20px;
  max-height: 50vh;
  overflow-y: scroll;
  border-radius: 15px;
}

.instruction {
  color: black;
  font-size: 14px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}
.grid1 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);

  gap: 15px;
}
.review-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* SECTION CARD */
.review-section {
  background: #fafafa;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #eee;
}

.review-section h3 {
  margin-bottom: 12px;
  font-size: 16px;
  color: #147452;
}

/* GRID */
.review-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.review-item {
  display: flex;
  flex-direction: column;
}

.review-item.full {
  grid-column: span 2;
}

/* TEXT */
.label {
  font-size: 12px;
  color: #888;
}

.value {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

/* FILE LIST */
.file-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.file-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.file-label {
  font-size: 13px;
  color: #555;
}

.file-tag {
  background: #147452;
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
}
.upload-instruction {
  color: #d32f2f;
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 20px;
}

/* LIST */
.upload-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* HEADER */
.upload-header label {
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

.upload-header span {
  color: red;
  margin-left: 4px;
}

/* BOX */
.upload-box {
  position: relative;
  border: 1px dashed #dcdcdc;
  border-radius: 10px;
  padding: 14px;
  background: #fafafa;

  transition: 0.3s;
}

.upload-box:hover {
  border-color: #147452;
  background: #f5fbf8;
}

/* HIDDEN INPUT */
.upload-box input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

/* PLACEHOLDER */
.upload-placeholder {
  text-align: center;
  font-size: 13px;
  color: #999;
}

/* FILE PREVIEW */
.file-preview {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

/* GREEN TAG */
.file-tag {
  background: #147452;
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* SIZE */
.file-size {
  font-size: 12px;
  color: #666;
}

/* REMOVE BUTTON */
.file-preview button {
  margin-left: auto;
  background: transparent;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #999;
  transition: 0.2s;
}

.file-preview button:hover {
  color: red;
}

.gaps {
  display: flex;
  flex-direction: column;
  gap: 10px; /* adjust spacing */
}
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: black;
  font-size: 14px;
}

.checkbox-item input[type="checkbox"] {
  width: 16px;
  height: 16px;
}
.full1 {
  grid-column: span 2;
}

.full {
  grid-column: span 3;
}

/* INPUT */
input {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid rgb(233, 233, 233);
  outline: none;
  font-size: 14px;
}

/* ACTIONS */
.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.cancel,
.apply {
  padding: 8px 20px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

.cancel {
  background: rgba(255, 255, 255, 0.3);
  color: white;
}

.apply {
  background: #147452;
  color: white;
} /* ========================= */
/* ✅ RESPONSIVE FIXES ONLY */
/* ========================= */

/* TABLET */
@media (max-width: 1024px) {
  .apply-page {
    padding-top: 80px;
  }

  .glass-container {
    padding: 20px;
  }

  .form-box {
    max-height: 60vh; /* ✅ more space for tablet */
  }
}

/* MOBILE */
@media (max-width: 768px) {
  /* 🔥 STACK ALL GRIDS */
  .grid {
    grid-template-columns: 1fr;
  }

  .grid1 {
    grid-template-columns: 1fr;
  }

  .full,
  .full1 {
    grid-column: span 1;
  }

  /* 🔥 STEP LABELS SMALLER */
  .step span {
    font-size: 11px;
  }

  .circle {
    width: 26px;
    height: 26px;
    font-size: 12px;
  }

  /* 🔥 TITLE */
  .title {
    font-size: 20px !important;
  }

  /* 🔥 FORM */
  .form-box {
    padding: 15px;
    max-height: 65vh;
  }

  /* 🔥 REVIEW GRID */
  .review-grid {
    grid-template-columns: 1fr;
  }

  .review-item.full {
    grid-column: span 1;
  }

  /* 🔥 FILE ROW STACK */
  .file-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  /* 🔥 ACTION BUTTONS */
  .actions {
    flex-direction: column;
    gap: 10px;
  }

  .cancel,
  .apply {
    width: 100%;
  }
}

/* SMALL PHONES */
@media (max-width: 480px) {
  .apply-page {
    padding-top: 60px;
  }

  .glass-container {
    padding: 15px;
  }

  .form-box {
    padding: 12px;
    max-height: 70vh;
  }

  /* 🔥 STEP TEXT WRAP */
  .step span {
    font-size: 10px;
    white-space: normal;
  }

  /* 🔥 PROGRESS LINE ALIGN FIX */
  .progress-line {
    top: 13px;
  }
}

/* EXTRA SMALL DEVICES */
@media (max-width: 360px) {
  .title {
    font-size: 18px !important;
  }

  .circle {
    width: 24px;
    height: 24px;
    font-size: 11px;
  }
}
</style>
