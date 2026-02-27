<template>
  <v-container fluid class="login-wrapper">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="10" md="6" lg="4">
        <v-card
          class="pa-8 login-card"
          max-width="430"
          elevation="10"
          rounded="xl"
        >
          <div class="text-center mb-6">
            <v-icon size="60" color="orange">mdi-account-school</v-icon>
            <h2 class="font-weight-bold mt-3">Student Portal Access</h2>
            <p class="grey--text">
              Enter your details to verify your identity.
            </p>
          </div>

          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="form.firstName"
              label="First Name"
              outlined
              dense
              :rules="[rules.required]"
            ></v-text-field>

            <v-text-field
              v-model="form.middleInitial"
              label="Middle Name (Optional)"
              outlined
              dense
            ></v-text-field>

            <v-text-field
              v-model="form.lastName"
              label="Last Name"
              outlined
              dense
              :rules="[rules.required]"
            ></v-text-field>

            <v-select
              v-model="form.suffix"
              :items="suffixOptions"
              label="Suffix (Optional)"
              outlined
              clearable
              dense
            ></v-select>

            <!-- <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="form.dob"
                  label="Date of Birth"
                  readonly
                  outlined
                  dense
                  v-bind="attrs"
                  v-on="on"
                  :rules="[rules.required]"
                ></v-text-field>
              </template>

              <v-date-picker
                v-model="form.dob"
                @input="menu = false"
                :max="today"
              ></v-date-picker>
            </v-menu> -->
            <v-text-field
              label="* Birth Date"
              v-model="form.dob"
              :rules="[formRules.required]"
              outlined
              required
              type="date"
              class="text-uppercase"
            />
            <v-text-field
              v-model="form.studentId"
              label="LRN / Student ID"
              outlined
              dense
              :rules="[rules.required]"
            ></v-text-field>

            <v-text-field
              v-model="form.code"
              label="Code"
              outlined
              dense
              :rules="[rules.required]"
            ></v-text-field>

            <v-btn
              block
              large
              color="orange"
              rounded="xl"
              class="mt-4 white--text"
              :loading="loading"
              @click="submit"
            >
              Verify & Access
            </v-btn>
            <v-col cols="12" class="">
              <div
                style="font-size:14px;"
                class="d-flex justify-center  text-gray-100"
              >
                Do you want to enroll?
                <b
                  style="color: #f5b027"
                  @click="openModalEnroll = true"
                  class="enrollLink ml-2"
                  >Enroll Now</b
                >
              </div>
            </v-col>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="openModalEnroll" persistent max-width="400">
      <v-card class="rounded-xl pa-2">
        <v-card-title class="d-flex align-center gap-2 pb-2">
          <span class="text-h6 font-weight-bold">
            Select Grade Level
          </span>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class=" py-3">
          <div
            class=" text-justify text-body-1 mb-4 pa-2"
            style="border: 1px solid orange; border-radius: 10px;"
          >
            Please select grade level accordingly beacuse it is the basis for
            your enrollment.
          </div>
          <div class=" pa-6">
            <v-btn
              @click="doEnroll('Elementary')"
              block
              color="orange"
              class="white--text"
              >elementary</v-btn
            >
            <v-btn
              @click="doEnroll('High School')"
              block
              color="orange"
              class="white--text my-6"
              >high school</v-btn
            >
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="px-6 py-4">
          <v-btn @click="openModalEnroll = false" outlined color="red"
            >Close</v-btn
          >
          <v-spacer></v-spacer>

          <!-- <v-btn @click="doEnroll()" color="pink" outlined>
            Confirm
          </v-btn> -->
        </v-card-actions>
      </v-card>
    </v-dialog>
    <fade-away-message-component
      displayType="variation2"
      v-model="fadeAwayMessage.show"
      :message="fadeAwayMessage.message"
      :header="fadeAwayMessage.header"
      :top="fadeAwayMessage.top"
      :type="fadeAwayMessage.type"
    ></fade-away-message-component>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      valid: false,
      loading: false,
      openModalEnroll: false,
      menu: false,
      today: new Date().toISOString().substr(0, 10),

      form: {
        firstName: null,
        middleInitial: null,
        lastName: null,
        suffix: null,
        dob: null,
        studentId: null,
        code: null,
      },

      suffixOptions: ["Jr.", "Sr.", "II", "III", "IV"],
      fadeAwayMessage: {
        show: false,
        type: "success",
        header: "Successfully Deleted!",
        message: "",
        top: 10,
      },
      rules: {
        required: (v) => !!v || "This field is required",
      },
    };
  },

  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        this.axiosCall(
          "/enroll-student/studentPortalLogin/" +
            this.form.firstName.toLowerCase() +
            "/" +
            this.form.lastName.toLowerCase() +
            "/" +
            this.form.dob +
            "/" +
            this.form.studentId +
            "/" +
            this.form.code,
          "GET",
        ).then((res) => {
          if (res.data.data) {
            setTimeout(() => {
              this.loading = false;

              localStorage.setItem(
                "studentData",
                JSON.stringify(res.data.data),
              );

              localStorage.setItem("lockedAccount", "true");

              this.$router.replace("/student-dashboard");
            }, 1500);
          } else {
            this.loading = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
          }
        });
      }
    },
    doEnroll(item) {
      localStorage.setItem("level", item);
      this.$router.push("/student-enroll");
    },
  },
};
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  /* background: linear-gradient(135deg, #ff7315, #fff6a6); */
  background: url("../../assets/img/bglogin.jpg");
}

.login-card {
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.95);
}
</style>
