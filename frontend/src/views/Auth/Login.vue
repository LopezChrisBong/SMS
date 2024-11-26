<template>
  <div>
    <v-container fluid fill-height class="content">
      <v-row align="center" justify="center">
        <v-col align="center" cols="12" md="6">
          <v-card max-width="430" class="rounded-card" align="start">
            <v-form ref="Formref">
              <v-row class="mx-5 pt-6">
                <v-col cols="12" class="pa-0 mb-2">
                  <div style="margin:0 auto; width:45%" class="pa-2">
                    <v-img
                      src="../../assets/img/AsuncionNationalHighSchool.png"
                    ></v-img>
                  </div>

                  <div class="text-subtitle1" color="#123E4D" align="center">
                    <b class="text-subtitle1" style="color: #5a67da"
                      >Welcome to <span style="color: #5a67da">SMS</span>!</b
                    >
                    | Sign In
                  </div>
                </v-col>
                <v-col cols="12" class="pa-0 px-4">
                  <v-text-field
                    color="#93CB5B"
                    class="font-size-14 rounded-lg"
                    v-model="email"
                    :rules="[formRules.required, formRules.email]"
                    label="Email address"
                    required
                    dense
                    outlined
                    @keyup.enter="dologin()"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="pa-0 px-4 mt-n2">
                  <v-text-field
                    color="#93CB5B"
                    class="font-size-14 rounded-lg "
                    v-model="password"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[formRules.required]"
                    :type="show1 ? 'text' : 'password'"
                    name="input-10-1"
                    dense
                    label="Password"
                    outlined
                    @keyup.enter="dologin()"
                    @click:append="show1 = !show1"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" class="pa-0 px-4 mt-n2">
                  <div class="d-flex justify-center ">
                    <v-btn
                      block
                      :color="$vuetify.theme.themes.light.submitBtns"
                      class="white--text font-size-14 rounded-lg"
                      :loading="isLoading"
                      @click="dologin()"
                      >Sign In</v-btn
                    >
                  </div>
                </v-col>

                <v-col cols="12" class="mt-5 ">
                  <div
                    style="font-size:14px; margin-top:15px"
                    class="d-flex justify-center  text-gray-100"
                  >
                    Don't have an account yet?
                    <b
                      style="color: #147452"
                      @click="doRegister()"
                      class="registerLink ml-2"
                      >Register Now</b
                    >
                  </div>
                  <!-- <div
                    style="font-size:14px"
                    class="d-flex justify-center  text-gray-100 mt-2"
                  >
                    <span
                      style="color: #1976d2"
                      @click="doForgotPassword()"
                      class="registerLink ml-2"
                      >Forgot password?</span
                    >
                  </div> -->
                </v-col>
                <!-- <v-col cols="12" class="py-8  ">
                  <div style="width:60%;margin:-10px auto" class="pa-2">
                    <v-img
                      style=""
                      src="../../assets/img/seals_logo.png"
                    ></v-img>
                  </div>
                </v-col> -->
              </v-row>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
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
// import axios from "axios";
export default {
  name: "login",
  mounted() {
    if (this.$store.state.user) {
      if (!this.$store.state.user.usertype.id) {
        //this.deleteToken();
        setTimeout(function() {
          location.reload();
        }, 0);
      }
    }
  },
  methods: {
    dologin() {
      if (this.$refs.Formref.validate()) {
        this.isLoading = true;
        let data = {
          email: this.email,
          password: this.password,
        };
        this.axiosCall("/auth/login", "POST", data).then((res) => {
          this.isLoading = false;
          if (
            res.data.status == 200 ||
            res.data.status == 201 ||
            res.data.status == 202
          ) {
            localStorage.setItem("token", res.data.token);
            this.$store.commit("setExpiryDate");
            location.reload();
            // setTimeout(() => {
            //   axios({
            //     method: "GET",
            //     url: process.env.VUE_APP_SERVER + "/employee/my-details",

            //     headers: { Authorization: `Bearer ${res.data.token}` },
            //   }).then((resp) => {
            //     this.$store.dispatch("setEmp", resp.data);
            //   });
            // }, 500);
          } else {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.message = res.data.message;
            this.fadeAwayMessage.header = "System Message";
          }
        });
      }
    },
    doRegister() {
      this.$router.push("/register");
    },
    doForgotPassword() {
      this.$router.push("/forgot-pw");
    },
  },
  data: () => ({
    isLoading: false,
    email: "",
    password: "",
    show1: false,
    show2: false,
    fadeAwayMessage: {
      show: false,
      type: "success",
      header: "Successfully Added!",
      message: "",
      top: 10,
    },
  }),
};
</script>

<style scoped>
.registerLink:hover {
  cursor: pointer;
  text-decoration: underline;
}
.content {
  background-color: #5a67da;
  /* background: url("../../assets/img/new_bg.png"); */
  background-position: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100vw 100vh;
}
.title {
  color: #fff;
  font-size: 35px !important;
  position: relative;
  font-weight: bold;
  line-height: 40px;
}
.title .underline {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}
.title .underline .u1 {
  background: #fff;
  width: 70%;
  height: 5px;
  margin: 0 5px;
}
.title .underline .u2 {
  background: #fff;
  width: 5%;
  height: 5px;
  margin: 0 5px;
}
.lp-img {
  -webkit-filter: drop-shadow(5px 5px 5px rgba(0, 0, 0, 0.09));
  filter: drop-shadow(5px 5px 5px rgba(0, 0, 0, 0.09));
  border-radius: 50%;
  background: #fff;
}
.rounded-card {
  border-radius: 20px;
}
</style>
