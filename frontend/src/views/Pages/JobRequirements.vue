<template>
  <div class="apply-page">
    <div class="overlay"></div>
    <!-- Loading Overlay -->
    <div v-if="loadingState" class="loading-overlay">
      <div class="spinner"></div>
      <p>Loading, please wait...</p>
    </div>
    <div class="glass-container">
      <!-- TITLE -->
      <h2 class="title" style="text-transform: uppercase">
        Application for {{ jobData.position_title || "Position" }}
      </h2>
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
          <v-form ref="form1">
            <p class="instruction">
              <strong>Instruction:</strong>
              Please enter "N/A" in any required field that does not apply to
              you.
            </p>

            <div class="grid">
              <div class="form-group">
                <label><span class="red--text">*</span> First Name</label>
                <!-- <input v-model="form.firstName" :rules="[formRules.required]" /> -->
                <v-text-field
                  v-model="form.firstname"
                  outlined
                  color="green"
                  class="rounded-lg custom-input"
                  :rules="[formRules.required]"
                />
              </div>

              <div class="form-group">
                <label> Middle Name (Optional)</label>
                <!-- <input v-model="form.middleName" /> -->
                <v-text-field
                  v-model="form.mi"
                  class="rounded-lg custom-input"
                  outlined
                  color="green"
                />
              </div>

              <div class="form-group">
                <label><span class="red--text">*</span> Last Name</label>
                <!-- <input v-model="form.lastName" /> -->
                <v-text-field
                  v-model="form.lastname"
                  class="rounded-lg custom-input"
                  outlined
                  color="green"
                  :rules="[formRules.required]"
                />
              </div>

              <div class="form-group">
                <label>Suffix (Optional)</label>
                <!-- <input v-model="form.suffix" /> -->
                <v-text-field
                  v-model="form.suffix"
                  class="rounded-lg custom-input"
                  outlined
                  color="green"
                />
              </div>

              <div class="form-group">
                <label><span class="red--text">*</span> Email Address</label>
                <!-- <input v-model="form.email" /> -->
                <v-text-field
                  v-model="form.email"
                  class="rounded-lg custom-input"
                  outlined
                  color="green"
                  type="email"
                  :rules="[formRules.required, formRules.email]"
                />
              </div>

              <div class="form-group">
                <label><span class="red--text">*</span> Phone Number</label>
                <!-- <input v-model="form.phone" /> -->
                <v-text-field
                  v-model="form.number"
                  class="rounded-lg custom-input"
                  color="green"
                  type="text"
                  maxlength="11"
                  @keypress="onlyDigits"
                  @input="cleanDigits"
                  :rules="[contactNoRule]"
                  outlined
                />
              </div>

              <div class="form-group">
                <label><span class="red--text">*</span> Religion</label>
                <!-- <input v-model="form.religion" /> -->
                <v-text-field
                  v-model="form.religion"
                  class="rounded-lg custom-input"
                  color="green"
                  outlined
                  :rules="[formRules.required]"
                />
              </div>

              <div class="form-group">
                <label><span class="red--text">*</span> SOGIE</label>
                <!-- <input v-model="form.sex" /> -->
                <v-select
                  v-model="form.gender"
                  class="rounded-lg custom-input"
                  color="green"
                  :items="genderOptions"
                  outlined
                  :rules="[formRules.required]"
                />
              </div>

              <div class="form-group">
                <label><span class="red--text">*</span> Birth Date</label>
                <!-- <input type="date" v-model="form.birthDate" /> -->
                <v-text-field
                  outlined
                  v-model="form.birth"
                  :rules="[formRules.required]"
                  required
                  type="date"
                  :max="BdaymaxDate"
                  class="text-uppercase rounded-lg custom-input"
                  @input="calculateAge(form.birth)"
                />
              </div>

              <div class="form-group full">
                <label
                  ><span class="red--text">*</span> Address
                  (Prk./Brgy./City/Municipality)</label
                >
                <!-- <input v-model="form.address" /> -->
                <v-text-field
                  v-model="form.address"
                  class="rounded-lg custom-input"
                  outlined
                  color="green"
                  :rules="[formRules.required]"
                />
              </div>
            </div>
          </v-form>
        </div>

        <!-- STEP 2 -->
        <div v-if="currentStep === 1">
          <v-form ref="form2">
            <p class="instruction">
              <strong>Instruction:</strong> Please enter "N/A" in any required
              field that does not apply to you.
            </p>
            <div class="grid1">
              <div class="form-group full1">
                <label
                  ><span class="red--text">*</span> Highest Educational
                  Attainement</label
                >
                <!-- <input v-model="form.highest_education" /> -->
                <v-select
                  v-model="form.educQualification"
                  :items="educationOptions"
                  class="rounded-lg custom-input"
                  color="green"
                  outlined
                  :rules="[formRules.required]"
                />
              </div>
              <div
                class="form-group"
                v-if="
                  form.educQualification == 'Vocational' ||
                  form.educQualification == 'College Level'
                "
              >
                <label><span class="red--text">*</span> Course </label>
                <!-- <input type="date" v-model="form.bachelor" /> -->
                <v-text-field
                  v-model="form.educQualificationGrad"
                  class="rounded-lg custom-input"
                  color="green"
                  outlined
                  :rules="
                    form.educQualification == 'Vocational' ||
                    form.educQualification == 'College Level'
                      ? [formRules.required]
                      : []
                  "
                />
              </div>
              <div
                class="form-group"
                v-if="form.educQualification == 'College Level'"
              >
                <label><span class="red--text">*</span> Earned Unit </label>
                <!-- <input type="date" v-model="form.bachelor_year_unit" /> -->
                <v-text-field
                  v-model="form.earnedUnits"
                  class="rounded-lg custom-input"
                  color="green"
                  :rules="
                    form.educQualification == 'College Level'
                      ? [formRules.required]
                      : []
                  "
                  outlined
                />
              </div>
              <div
                class="form-group"
                v-if="
                  form.educQualification == 'College Graduate' ||
                  form.educQualification == 'Post Graduate'
                "
              >
                <label><span class="red--text">*</span> Bachelors Degree</label>
                <!-- <input type="date" v-model="form.masters" /> -->
                <v-text-field
                  v-model="form.collegeGradCourse"
                  class="rounded-lg custom-input"
                  outlined
                  :rules="
                    form.educQualification == 'College Graduate' ||
                    form.educQualification == 'Post Graduate'
                      ? [formRules.required]
                      : []
                  "
                  color="green"
                />
              </div>
              <div
                class="form-group"
                v-if="
                  form.educQualification == 'College Graduate' ||
                  form.educQualification == 'Post Graduate'
                "
              >
                <label
                  ><span class="red--text">*</span> Year Graduated/Earned
                  Unit</label
                >
                <!-- <input type="date" v-model="form.bachelor_year_unit" /> -->
                <v-text-field
                  v-model="form.yearGraduated"
                  class="rounded-lg custom-input"
                  outlined
                  color="green"
                  :rules="
                    form.educQualification == 'College Graduate' ||
                    form.educQualification == 'Post Graduate'
                      ? [formRules.required]
                      : []
                  "
                />
              </div>
              <div
                class="form-group"
                v-if="form.educQualification == 'Post Graduate'"
              >
                <label><span class="red--text">*</span> Master's Degree </label>
                <!-- <input type="date" v-model="form.masters" /> -->
                <v-text-field
                  v-model="form.masterGradCourse"
                  class="rounded-lg custom-input"
                  outlined
                  color="green"
                  :rules="
                    form.educQualification == 'Post Graduate'
                      ? [formRules.required]
                      : []
                  "
                />
              </div>
              <div
                class="form-group"
                v-if="form.educQualification == 'Post Graduate'"
              >
                <label
                  ><span class="red--text">*</span> Year Graduated/Earned
                  Unit</label
                >
                <!-- <input type="date" v-model="form.bachelor_year_unit" /> -->
                <v-text-field
                  v-model="form.yearGraduatedMasteral"
                  class="rounded-lg custom-input"
                  outlined
                  color="green"
                  :rules="
                    form.educQualification == 'Post Graduate'
                      ? [formRules.required]
                      : []
                  "
                />
              </div>
              <div
                class="form-group"
                v-if="form.educQualification == 'Post Graduate'"
              >
                <label><span class="red--text">*</span> Doctorate Degree</label>
                <!-- <input type="date" v-model="form.bachelor" /> -->
                <v-text-field
                  v-model="form.doctoralGradCourse"
                  class="rounded-lg custom-input"
                  color="green"
                  outlined
                  :rules="
                    form.educQualification == 'Post Graduate'
                      ? [formRules.required]
                      : []
                  "
                />
              </div>
              <div
                class="form-group"
                v-if="form.educQualification == 'Post Graduate'"
              >
                <label
                  ><span class="red--text">*</span> Year Graduated/Earned
                  Unit</label
                >
                <!-- <input type="date" v-model="form.bachelor_year_unit" /> -->
                <v-text-field
                  v-model="form.yearGraduatedDoctoral"
                  class="rounded-lg custom-input"
                  outlined
                  color="green"
                  :rules="
                    form.educQualification == 'Post Graduate'
                      ? [formRules.required]
                      : []
                  "
                />
              </div>
            </div>
          </v-form>
        </div>

        <!-- STEP 3 -->
        <div v-if="currentStep === 2" class="gaps">
          <v-form ref="form3">
            <p class="instruction">
              <strong>Instruction:</strong> Please enter "N/A" in any required
              field that does not apply to you.
            </p>
            <div class="grid">
              <div class="form-group full">
                <label
                  ><span class="red--text">*</span> Latest Company/Agency</label
                >
                <!-- <input v-model="form.highest_education" /> -->
                <v-text-field
                  v-model="form.companyAgency"
                  class="rounded-lg custom-input"
                  color="green"
                  outlined
                  :rules="[formRules.required]"
                />
              </div>
            </div>
            <div class="grid1">
              <div class="form-group">
                <label
                  ><span class="red--text">*</span> Present/Latest
                  Position</label
                >
                <!-- <input v-model="form.latest_organization" /> -->
                <v-text-field
                  v-model="form.presentposition"
                  class="rounded-lg custom-input"
                  color="green"
                  outlined
                  :rules="[formRules.required]"
                />
              </div>

              <div class="form-group">
                <label
                  ><span class="red--text">*</span> Status of Employment</label
                >
                <!-- <input type="text" v-model="form.status_employement" /> -->
                <v-text-field
                  v-model="form.statusEmployment"
                  class="rounded-lg custom-input"
                  color="green"
                  outlined
                  :rules="[formRules.required]"
                />
              </div>
            </div>
            <div class="form-group full1">
              <label><span class="red--text">*</span> Eligibility</label>
              <!-- <input v-model="form.eligibility" /> -->
              <v-text-field
                v-model="form.eligibilityForm"
                color="green"
                class="rounded-lg custom-input"
                outlined
                :rules="[formRules.required]"
              />
            </div>
            <p class="instruction">
              <strong>Instruction:</strong> Kindly check if you belong to any of
              the following:
            </p>

            <div class="checkbox-group">
              <!-- Pregnant -->
              <label class="checkbox-item">
                <input type="checkbox" v-model="form.pregnant" />
                Pregnant
              </label>
              <!-- PWD -->
              <label class="checkbox-item">
                <input type="checkbox" v-model="form.pwdChecked" />
                Person with Disability - if yes, specify
              </label>
              <!-- <input
                v-if="form.pwdChecked"
                type="text"
                class="full"
                placeholder="Please specify"
                v-model="form.pwd"
              /> -->
              <v-text-field
                v-model="form.pwd"
                placeholder="Please specify"
                outlined
                class="full rounded-lg custom-input"
                color="green"
                :rules="[formRules.required]"
                v-if="form.pwdChecked"
              />

              <!-- Indigenous -->
              <label class="checkbox-item">
                <input type="checkbox" v-model="form.indigenousChecked" />
                Indigenous community - if yes, specify
              </label>
              <!-- <input
                v-if="form.isIndigenous"
                type="text"
                class="full"
                placeholder="Specify Indigenous community"
                v-model="form.indigenousDetails"
              /> -->
              <v-text-field
                v-if="form.indigenousChecked"
                v-model="form.indigenous"
                placeholder="Specify Indigenous community"
                outlined
                class="full rounded-lg custom-input"
                color="green"
                :rules="[formRules.required]"
              />
            </div>
          </v-form>
        </div>

        <!-- STEP 4 -->
        <div v-if="currentStep === 3">
          <v-form ref="form4">
            <p class="instruction">
              <strong>Instruction:</strong> Upload PDF files only. If multiple
              pages, merge into one (1) file.
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
                    <span v-if="item.required">*</span>
                    {{ item.label }}
                  </label>
                </div>

                <!-- BOX -->
                <div class="upload-box">
                  <v-file-input
                    v-model="form[item.key]"
                    accept="application/pdf"
                    prepend-icon="mdi-file-pdf-box"
                    show-size
                    counter
                    @change="handleFile($event, item.key)"
                    clearable
                    :rules="[
                      ...(item.required ? [formRules.required] : []),
                      (file) =>
                        !file ||
                        file.type === 'application/pdf' ||
                        'Only PDF files are allowed',
                    ]"
                    :label="item.label + (item.required ? ' ' : '')"
                  >
                  </v-file-input>

                  <!-- FILE PREVIEW -->
                  <!-- <div v-if="form[item.key]" class="file-preview">
                    <span class="file-tag">
                      {{ form[item.key].name }}
                    </span>

                    <span class="file-size">
                      ({{ formatSize(form[item.key].size) }})
                    </span>

                    <button @click="removeFile(item.key)">✕</button>
                  </div> -->
                </div>
              </div>
            </div>
          </v-form>
        </div>

        <!-- STEP 5 -->
        <div v-if="currentStep === 4" class="review-container">
          <!-- PERSONAL -->
          <v-form ref="form5">
            <div class="review-section">
              <h3>Personal Information</h3>

              <div class="review-grid">
                <div class="review-item">
                  <span class="label">Full Name</span>
                  <span class="value">
                    {{ form.firstname }} {{ form.mi }}
                    {{ form.lastname }}
                  </span>
                </div>

                <div class="review-item">
                  <span class="label">Email</span>
                  <span class="value">{{ form.email }}</span>
                </div>

                <div class="review-item">
                  <span class="label">Phone</span>
                  <span class="value">{{ form.number }}</span>
                </div>

                <div class="review-item">
                  <span class="label">SOGIE</span>
                  <span class="value">{{ form.gender }}</span>
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
                  <span class="value">{{ form.educQualification }}</span>
                </div>

                <div class="review-item">
                  <span class="label">Bachelor</span>
                  <span class="value">{{
                    form.educQualification == "College Graduate"
                      ? form.collegeGradCourse
                      : form.educQualification == "Post Graduate"
                      ? form.doctoralGradCourse
                        ? form.doctoralGradCourse
                        : form.masterGradCourse
                      : form.educQualification == "Vocational"
                      ? form.educQualificationGrad
                      : form.educQualification == "College Level"
                      ? form.educQualificationGrad
                      : "N/A"
                  }}</span>
                </div>
              </div>
            </div>

            <!-- EMPLOYMENT -->
            <div class="review-section">
              <h3>Employment</h3>

              <div class="review-grid">
                <div class="review-item">
                  <span class="label">Latest Company/Agency </span>
                  <span class="value">{{ form.companyAgency }}</span>
                </div>

                <div class="review-item">
                  <span class="label">Latest Position</span>
                  <span class="value">{{ form.presentposition }}</span>
                </div>

                <div class="review-item">
                  <span class="label">Eligibility</span>
                  <span class="value">{{ form.eligibilityForm }}</span>
                </div>

                <!-- CHECKBOX INFO -->
                <div class="review-item full" v-if="form.pwdChecked">
                  <span class="label">PWD</span>
                  <span class="value">{{ form.pwd }}</span>
                </div>

                <div class="review-item" v-if="form.pregnant">
                  <span class="label">Pregnant</span>
                  <span class="value">Yes</span>
                </div>

                <div class="review-item full" v-if="form.indigenousChecked">
                  <span class="label">Indigenous</span>
                  <span class="value">{{ form.indigenous }}</span>
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
          </v-form>
        </div>
      </div>

      <!-- ACTIONS -->
      <div class="actions">
        <button class="cancel" @click="prevStep">
          {{ currentStep == 0 ? "Return" : "Back" }}
        </button>

        <button class="apply" @click="nextStep" :loading="BTNloading">
          {{ currentStep === 4 ? "Submit" : "Next" }}
        </button>
      </div>
    </div>
    <div v-if="returnDialog" class="privacy-overlay">
      <div class="privacy-modal">
        <h2>Return Confirmation!</h2>
        <p outlined class="mt-4">
          You have made changes into this form! do you want to return? all
          changes will be reset.
        </p>

        <div class="actions">
          <button class="cancel1" @click="returnDialog = false">Cancel</button>

          <button class="apply1" @click="close()">Confirm</button>
        </div>
      </div>
    </div>
    <div v-if="successSubmitDialog" class="privacy-overlay">
      <div class="privacy-modal">
        <h2>Successfully submitted.</h2>
        <p outlined class="mt-4">
          An email has been sent to the email address provided in your
          application. Please check your spam or junk folder in case the message
          was filtered.
        </p>

        <div class="actions">
          <!-- <button class="cancel1" @click="returnDialog = false">Cancel</button> -->

          <button class="apply1" @click="ok()">OK</button>
        </div>
      </div>
    </div>
    <fade-away-message-component
      displayType="variation2"
      v-model="fadeAwayMessage.show"
      :message="fadeAwayMessage.message"
      :header="fadeAwayMessage.header"
      :top="fadeAwayMessage.top"
      :type="fadeAwayMessage.type"
    ></fade-away-message-component>
  </div>
</template>

<script>
export default {
  data() {
    return {
      jobData: "",
      currentStep: 0,
      returnDialog: false,
      genderOptions: ["Man", "Woman", "Non-binary", "Prefer not to say"],
      steps: [
        "Personal Info",
        "Education",
        "Employment",
        "Upload Files",
        "Review",
      ],
      loadingState: false,
      toReturn: true,
      educationOptions: [
        "Elementary Level",
        "Elementary Graduate",
        "High School Level",
        "High School Graduate",
        "Vocational",
        "College Level",
        "College Graduate",
        "Post Graduate",
      ],
      successSubmitDialog: false,
      form: {
        firstname: "",
        mi: "",
        lastname: "",
        suffix: "",
        email: "",
        number: "",
        religion: "",
        gender: null,
        birth: null,
        address: "",
        educQualification: null,
        educQualificationGrad: "",
        companyAgency: "",
        presentposition: "",
        statusEmployment: "",
        eligibilityForm: "",
        pwdChecked: false,
        pwd: "",
        pregnant: false,
        indigenousChecked: false,
        indigenous: "",
        application: null,
        pds: null,
        performance: null,
        eligibility: null,
        TOR: null,
        employment: null,
        seminars: null,
        earnedUnits: null,
        collegeGradCourse: null,
        yearGraduated: null,
        masterGradCourse: null,
        yearGraduatedMasteral: null,
        doctoralGradCourse: null,
        yearGraduatedDoctoral: null,
      },
      BTNloading: false,
      fadeAwayMessage: {
        show: false,
        type: "success",
        header: "Successfully Added!",
        message: "",
        top: 10,
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
    uploadFields() {
      return [
        {
          key: "application",
          label: "Application Letter",
          required: true,
        },
        {
          key: "pds",
          label: "Personal Data Sheet (PDS)",
          required: true,
        },
        {
          key: "performance",
          label: "Performance Rating",
          required:
            this.jobData?.performance_rating
              ?.toString()
              .toLowerCase()
              .trim() === "required"
              ? true
              : false,
        },
        {
          key: "eligibility",
          label: "Certificate of Eligibility/Rating",
          required:
            this.jobData?.certificate_eligibility
              ?.toString()
              .toLowerCase()
              .trim() === "required"
              ? true
              : false,
        },
        {
          key: "TOR",
          label: "Transcript of Records",
          required:
            this.jobData?.transcript_record?.toString().toLowerCase().trim() ===
            "required"
              ? true
              : false,
        },
        {
          key: "employment",
          label: "Certificate of Employment",
          required:
            this.jobData?.certificate_employment
              ?.toString()
              .toLowerCase()
              .trim() === "required"
              ? true
              : false,
        },
        {
          key: "seminars",
          label: "Certificate/s of Training",
          required:
            this.jobData?.certificate_training
              ?.toString()
              .toLowerCase()
              .trim() === "required"
              ? true
              : false,
        },
      ];
    },
    BdaymaxDate() {
      return new Date().toISOString().split("T")[0];
    },
    contactNoRule() {
      return (v) => {
        if (!v || v.length !== 11) return "Contact number must be 11 digits";
        if (!/^0/.test(v)) return "Contact number must start with 0.";
        return true;
      };
    },
  },

  methods: {
    // handleFile(event, field) {
    //   const file = event.target.files[0];

    //   if (file && file.type !== "application/pdf") {
    //     alert("Only PDF files are allowed.");
    //     return;
    //   }

    //   this.form[field] = file;
    //   // console.log(this.form);
    // },
    handleFile(file, field) {
      if (file && file.type !== "application/pdf") {
        this.form[field] = null;
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message = "Only PDF files are allowed.";
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
      if (this.currentStep === 0) {
        if (this.$refs.form1.validate()) {
          this.currentStep++;
        } else {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "Please fill in the required fields.";
        }
      } else if (this.currentStep === 1) {
        if (this.$refs.form2.validate()) {
          this.currentStep++;
        } else {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "Please fill in the required fields.";
        }
      } else if (this.currentStep === 2) {
        if (this.$refs.form3.validate()) {
          this.currentStep++;
        } else {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "Please fill in the required fields.";
        }
      } else if (this.currentStep === 3) {
        if (this.$refs.form4.validate()) {
          this.currentStep++;
        } else {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "Please upload a valid PDF file only.";
        }
      } else {
        this.submit();
      }
    },

    prevStep() {
      if (this.currentStep > 0) {
        this.currentStep--;
      } else {
        if (this.toReturn) {
          localStorage.removeItem("jobData");
          this.$router.push("/joblist");
        } else {
          this.returnDialog = true;
        }
      }
    },
    close() {
      localStorage.removeItem("jobData");
      this.$router.push("/joblist");
    },
    ok() {
      this.loadingState = true;
      setTimeout(() => {
        this.loadingState = false;
        localStorage.removeItem("jobData");
        this.$router.push("/joblist");
      }, 1500);
    },
    onlyDigits(event) {
      if (!/^\d$/.test(event.key)) {
        event.preventDefault();
      }
    },
    cleanDigits(event) {
      event.target.value = event.target.value.replace(/\D/g, "");
    },
    calculateAge(birthDate) {
      if (!birthDate) return;

      const currentDate = new Date();
      if (new Date(birthDate) > currentDate) {
        this.form.birth = null;
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message = "Invalid Input. Check your date entry";
      }

      const diffTime = currentDate - new Date(birthDate);
      const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      this.form.age = Math.floor(totalDays / 365.25);
      // this.months = Math.floor((totalDays % 365.25) / 30.4375);
      // this.days = Math.floor((totalDays % 365.25) % 30.4375);
    },
    submit() {
      this.BTNloading = true;
      this.loadingState = true;
      this.checkFileHaveValue();
      const fd = new FormData();
      let application = this.form.application;
      let pds = this.form.pds;
      let performance = this.form.performance;
      let eligibility = this.form.eligibility;
      let tor = this.form.TOR;
      let employment = this.form.employment;
      let seminars = this.form.seminars;
      const arrayData = [
        application,
        pds,
        performance,
        eligibility,
        tor,
        employment,
        seminars,
      ];
      for (let i = 0; i < arrayData.length; i++) {
        const element = arrayData[i];
        fd.append("file", element);
      }
      let data = {
        firstname: this.form.firstname,
        position: this.jobData.position_title,
        positionID: this.jobData.id,
        mi: this.form.mi,
        lastname: this.form.lastname,
        suffix: this.form.suffix,
        email: this.form.email,
        phone_number: this.form.number,
        relegion: this.form.religion,
        sogie_value: this.form.gender,
        birth: this.form.birth,
        education: this.jobData.education
          ? this.jobData.education
          : this.jobData.job_posting_content,
        address: this.form.address,
        educ_qualification: this.form.educQualification,
        educ_qualification_grad: this.form.educQualificationGrad,
        company_agency: this.form.companyAgency,
        present_position: this.form.presentposition,
        status_employment: this.form.statusEmployment,
        eligibility_form: this.form.eligibilityForm,
        pwd_check: this.form.pwdChecked == false ? "" : "checked",
        pwd_value: this.form.pwd,
        pregnant_check: this.form.pregnant == false ? "" : "checked",
        indigenous_check: this.form.indigenousChecked == false ? "" : "checked",
        indigenous_value: this.form.indigenous,
        earned_Units: this.form.earnedUnits,
        college_grad_course: this.form.collegeGradCourse,
        year_graduated: this.form.yearGraduated,
        master_grad_course: this.form.masterGradCourse,
        year_graduated_masteral: this.form.yearGraduatedMasteral,
        doctoral_grad_course: this.form.doctoralGradCourse,
        year_graduated_doctoral: this.form.yearGraduatedDoctoral,
        work_experience: this.jobData.experience,
        work_eligibility: this.jobData.eligibility,
        work_training: this.jobData.training,
        item: this.jobData.plantilla_item,
        unit_department: this.jobData.unit_department,
        inclusive_from: this.jobData.date_from,
        inclusive_to: this.jobData.date_to,
      };
      fd.append("body", JSON.stringify(data));
      console.log(data, fd);
      this.axiosCall("/job-applicant/multiple", "POST", fd).then((res) => {
        if (res.data.status == 200 || res.data.status == 201) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.message = res.data.msg;
          this.fadeAwayMessage.header = "System Message";

          setTimeout(() => {
            this.loadingState = false;
            this.successSubmitDialog = true;
            // this.$router.push("/job-posting");
          }, 1500);
        } else {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
        }
      });
    },
    checkFileHaveValue() {
      if (this.form.application) {
        let originalFile = null;

        if (this.form.application) {
          originalFile = this.form.application;
        }

        if (originalFile) {
          const cleanLastName = this.form.lastname
            .replace(/\s/g, "")
            .replace(/%20/g, "");

          const renamedFile = new File(
            [originalFile],
            `ApplicationLetter_${cleanLastName}.pdf`,
            {
              type: originalFile.type,
              lastModified: originalFile.lastModified,
            },
          );

          renamedFile.file_type_uploaded = "application";

          this.form.application = renamedFile;
        }
      } else {
        const cleanLastName = this.form.lastname
          .replace(/\s/g, "")
          .replace(/%20/g, "");
        this.form.application = new File(
          ["default content"],
          `defaultApplication_${cleanLastName}.pdf`,
          {
            type: "application/pdf",
          },
        );
      }
      if (this.form.pds) {
        let originalFile = null;

        if (this.form.pds) {
          originalFile = this.form.pds;
        }

        if (originalFile) {
          const cleanLastName = this.form.lastname
            .replace(/\s/g, "")
            .replace(/%20/g, "");

          const renamedFile = new File(
            [originalFile],
            `PDSLetter_${cleanLastName}.pdf`,
            {
              type: originalFile.type,
              lastModified: originalFile.lastModified,
            },
          );

          renamedFile.file_type_uploaded = "application";

          this.form.pds = renamedFile;
        }
      } else {
        const cleanLastName = this.form.lastname
          .replace(/\s/g, "")
          .replace(/%20/g, "");
        this.form.pds = new File(
          ["default content"],
          `defaultPds_${cleanLastName}.pdf`,
          {
            type: "application/pdf",
          },
        );
      }
      if (this.form.performance) {
        let originalFile = null;

        if (this.form.performance) {
          originalFile = this.form.performance;
        }

        if (originalFile) {
          const cleanLastName = this.form.lastname
            .replace(/\s/g, "")
            .replace(/%20/g, "");

          const renamedFile = new File(
            [originalFile],
            `PerformanceLetter_${cleanLastName}.pdf`,
            {
              type: originalFile.type,
              lastModified: originalFile.lastModified,
            },
          );

          renamedFile.file_type_uploaded = "application";

          this.form.performance = renamedFile;
        }
      } else {
        const cleanLastName = this.form.lastname
          .replace(/\s/g, "")
          .replace(/%20/g, "");
        this.form.performance = new File(
          ["default content"],
          `defaultPerformance_${cleanLastName}.pdf`,
          {
            type: "application/pdf",
          },
        );
      }
      if (this.form.eligibility) {
        let originalFile = null;

        if (this.form.eligibility) {
          originalFile = this.form.eligibility;
        }

        if (originalFile) {
          const cleanLastName = this.form.lastname
            .replace(/\s/g, "")
            .replace(/%20/g, "");

          const renamedFile = new File(
            [originalFile],
            `EligibilityLetter_${cleanLastName}.pdf`,
            {
              type: originalFile.type,
              lastModified: originalFile.lastModified,
            },
          );

          renamedFile.file_type_uploaded = "application";

          this.form.eligibility = renamedFile;
        }
      } else {
        const cleanLastName = this.form.lastname
          .replace(/\s/g, "")
          .replace(/%20/g, "");
        this.form.eligibility = new File(
          ["default content"],
          `defaultEligibility_${cleanLastName}.pdf`,
          {
            type: "application/pdf",
          },
        );
      }
      if (this.form.TOR) {
        let originalFile = null;

        if (this.form.TOR) {
          originalFile = this.form.TOR;
        }

        if (originalFile) {
          const cleanLastName = this.form.lastname
            .replace(/\s/g, "")
            .replace(/%20/g, "");

          const renamedFile = new File(
            [originalFile],
            `TORLetter_${cleanLastName}.pdf`,
            {
              type: originalFile.type,
              lastModified: originalFile.lastModified,
            },
          );

          renamedFile.file_type_uploaded = "application";

          this.form.TOR = renamedFile;
        }
      } else {
        const cleanLastName = this.form.lastname
          .replace(/\s/g, "")
          .replace(/%20/g, "");
        this.form.TOR = new File(
          ["default content"],
          `defaultTOR_${cleanLastName}.pdf`,
          {
            type: "application/pdf",
          },
        );
      }
      if (this.form.employment) {
        let originalFile = null;

        if (this.form.employment) {
          originalFile = this.form.employment;
        }

        if (originalFile) {
          const cleanLastName = this.form.lastname
            .replace(/\s/g, "")
            .replace(/%20/g, "");

          const renamedFile = new File(
            [originalFile],
            `EmploymentLetter_${cleanLastName}.pdf`,
            {
              type: originalFile.type,
              lastModified: originalFile.lastModified,
            },
          );

          renamedFile.file_type_uploaded = "application";

          this.form.employment = renamedFile;
        }
      } else {
        const cleanLastName = this.form.lastname
          .replace(/\s/g, "")
          .replace(/%20/g, "");
        this.form.employment = new File(
          ["default content"],
          `defaultEmployment_${cleanLastName}.pdf`,
          {
            type: "application/pdf",
          },
        );
      }
      if (this.form.seminars) {
        let originalFile = null;

        if (this.form.seminars) {
          originalFile = this.form.seminars;
        }

        if (originalFile) {
          const cleanLastName = this.form.lastname
            .replace(/\s/g, "")
            .replace(/%20/g, "");

          const renamedFile = new File(
            [originalFile],
            `SeminarLetter_${cleanLastName}.pdf`,
            {
              type: originalFile.type,
              lastModified: originalFile.lastModified,
            },
          );

          renamedFile.file_type_uploaded = "application";

          this.form.seminars = renamedFile;
        }
      } else {
        const cleanLastName = this.form.lastname
          .replace(/\s/g, "")
          .replace(/%20/g, "");
        this.form.seminars = new File(
          ["default content"],
          `defaultSeminar_${cleanLastName}.pdf`,
          {
            type: "application/pdf",
          },
        );
      }
    },
  },
  watch: {
    form: {
      handler(newVal, oldVal) {
        console.log("Form changed", newVal, oldVal);
        this.toReturn = false;
      },
      deep: true,
    },
  },
  mounted() {
    if (!localStorage.getItem("jobData")) {
      if (this.$route.query && this.$route.query.job) {
        this.jobData = this.$route.query.job;
        localStorage.setItem("jobData", JSON.stringify(this.$route.query.job));
      }
    } else {
      this.jobData = JSON.parse(localStorage.getItem("jobData"));
    }
    console.log(this.jobData);
  },
};
</script>

<style scoped>
/* ========================= */
/* GLOBAL */
/* ========================= */
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
  margin-bottom: 20px;
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
  row-gap: 15px;
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
  width: 450px;
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
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 15px;
}

strong {
  font-weight: 600;
  opacity: 0.8;
}

.apply-page {
  position: relative;
  min-height: 100vh;
  background-image: url("../../assets/img/bg_img.png");
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  font-family: "Poppins", sans-serif;
}

/* OVERLAY */
.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
}

/* ========================= */
/* CONTAINER */
/* ========================= */
.glass-container {
  width: 65%;
  max-width: 1100px;
  min-height: 80vh; /* ✅ FIX */
  height: auto;
  padding: 25px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
}

/* TITLE */
.title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px !important;
}

/* ========================= */
/* STEPPER */
/* ========================= */
.steps-wrapper {
  position: relative;
  margin-bottom: 25px;
}

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

.progress-fill {
  height: 100%;
  background: #147452;
  border-radius: 10px;
  transition: width 0.4s ease;
}

.steps {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap; /* ✅ FIX */
  gap: 10px;
  position: relative;
  z-index: 2;
}

.step {
  text-align: center;
  flex: 1 1 60px; /* ✅ FIX */
  opacity: 0.5;
}

.step.active,
.step.done {
  opacity: 1;
}

.circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: gray;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step.active .circle,
.step.done .circle {
  background: #147452;
  color: white;
}

/* ========================= */
/* FORM */
/* ========================= */
.form-box {
  background: white;
  padding: 20px;
  border-radius: 15px;

  min-height: 300px;
  height: 60vh; /* ✅ FIX */
  overflow-y: auto;
}

.instruction {
  color: black;
  font-size: 14px;
}

/* GRID */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 25px;
}

.grid1 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.full {
  grid-column: span 3;
}

.full1 {
  grid-column: span 2;
}

/* FORM GROUP */
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

/* ========================= */
/* REVIEW */
/* ========================= */
.review-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.review-section {
  background: #fafafa;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #eee;
}

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

.label {
  font-size: 12px;
  color: #888;
}

.value {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

/* ========================= */
/* FILE */
/* ========================= */
.file-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.file-tag {
  background: #147452;
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
}

/* ========================= */
/* ACTIONS */
/* ========================= */
.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.cancel,
.apply {
  width: 100px;
  padding: 10px;
  border-radius: 20px;
  border: none;
}

.cancel {
  background: rgba(255, 255, 255, 0.3);
  color: white;
}

.apply {
  background: #147452;
  color: white;
}
.cancel1,
.apply1 {
  width: 20%;
  padding: 10px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

.cancel1 {
  background: rgba(255, 255, 255, 0.3);
  color: white;
}

.apply1 {
  background: #147452;
  color: white;
}
/* ========================= */
/* INPUT FIX */
/* ========================= */
::v-deep(.custom-input.v-text-field),
::v-deep(.custom-input.v-select) {
  width: 100%;
}
/* 🔥 APPLY TO BOTH TEXT + SELECT */
::v-deep(.custom-input.v-text-field .v-input__control),
::v-deep(.custom-input.v-select .v-input__control) {
  min-height: 36px !important;
  font-size: 14px !important;
}

/* 🔥 MAIN BOX */
::v-deep(.custom-input .v-input__slot) {
  min-height: 36px !important;
  height: 48px !important;
  padding: 0 10px !important;
  display: flex;
  align-items: center;
}

/* 🔥 INPUT TEXT */
::v-deep(.custom-input input) {
  padding: 0 !important;
  margin: 0 !important;
  height: 100%;
}

/* 🔥 SELECT TEXT ALIGNMENT */
::v-deep(.custom-input.v-select .v-select__selections) {
  padding: 0 !important;
  margin: 0 !important;
  height: 100%;
  display: flex;
  align-items: center;
}

/* 🔥 DROPDOWN ICON ALIGN */
::v-deep(.custom-input .v-input__append-inner) {
  margin-top: 0 !important;
  align-items: center;
  display: flex;
}

/* 🔥 LABEL FIX */
::v-deep(.custom-input .v-label) {
  top: 8px;
  font-size: 12px;
}
/* ========================= */
/* TABLET */
/* ========================= */
@media (max-width: 1024px) {
  .glass-container {
    width: 85%;
  }
}

/* ========================= */
/* MOBILE */
/* ========================= */
@media (max-width: 768px) {
  .glass-container {
    width: 100%;
    padding: 15px;
  }

  .grid,
  .grid1 {
    grid-template-columns: 1fr;
  }

  .full,
  .full1 {
    grid-column: span 1;
  }

  .review-grid {
    grid-template-columns: 1fr;
  }

  .review-item.full {
    grid-column: span 1;
  }

  .file-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .actions {
    flex-direction: row;
    gap: 10px;
  }

  .cancel,
  .apply {
    width: 15%;
  }

  .form-box {
    max-height: none; /* ✅ FIX */
  }
}

/* ========================= */
/* SMALL DEVICES */
/* ========================= */
@media (max-width: 480px) {
  .title {
    font-size: 18px !important;
  }

  .step span {
    font-size: 10px;
  }

  .circle {
    width: 24px;
    height: 24px;
  }

  /* WRAPPER */
  .steps-wrapper {
    position: relative;
    margin-bottom: 25px;
  }

  /* LINE BACKGROUND */
  .progress-line {
    position: absolute;
    top: 12px;

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
    flex-wrap: wrap;
  }

  .step {
    flex: 1 1 60px;
    text-align: center;
    flex: 1;
    opacity: 0.5;
    transition: 0.3s;
  }

  .step.active,
  .step.done {
    opacity: 1;
  }

  .cancel,
  .apply {
    font-size: 13px !important;
    width: 25%;
  }

  .cancel1,
  .apply1 {
    width: 30%;
  }
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 6px solid #ccc;
  border-top: 6px solid #1976d2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
</style>
