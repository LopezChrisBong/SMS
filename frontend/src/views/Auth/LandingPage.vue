<template>
  <div>
    <v-container fluid fill-height class="content">
      <v-row align="center" justify="center">
        <v-col align="center" cols="12" md="6">
          <v-form ref="Formref">
            <v-row class="mx-5 pt-6">
              <v-col cols="12" class="pa-0 mb-2">
                <div
                  :style="
                    $vuetify.breakpoint.smAndDown
                      ? 'margin:0 auto; width:50%'
                      : 'margin:0 auto; width:35%'
                  "
                  class="pa-2"
                >
                  <v-img src="../../assets/img/limbaanlogo.png"></v-img>
                </div>

                <div
                  :class="
                    $vuetify.breakpoint.smAndDown ? 'text-h5' : 'text-h3 mb-5'
                  "
                  color="#123E4D"
                  align="center"
                >
                  <b style="color: #EA7142"
                    >Welcome to <span style="color: #EA7142"></span>LIFE!</b
                  >
                </div>
                <div
                  :class="
                    $vuetify.breakpoint.smAndDown
                      ? 'text-subtitle-1 mb-3 mt-3'
                      : 'text-h5 mb-5'
                  "
                  color="#123E4D"
                  align="center"
                >
                  <b
                    >Limbaan Integrated Faculty
                    <br v-if="$vuetify.breakpoint.smAndDown" />
                    <span v-else> - </span> Loading and Enrollment System</b
                  >
                </div>
              </v-col>

              <v-col cols="12" md="6" class="pa-0 px-4 mt-n2">
                <div class="d-flex justify-center mb-3">
                  <v-btn
                    :color="$vuetify.theme.themes.light.submitBtns"
                    class="white--text font-size-14 rounded-lg"
                    :class="$vuetify.breakpoint.smAndDown ? 'pa-5' : ' pa-8'"
                    :loading="isLoading"
                    style="width: 300px;"
                    @click="dologin('Elementary')"
                    >LIMBAAN ELEMENTARY SCHOOL</v-btn
                  >
                </div>
              </v-col>
              <v-col cols="12" md="6" class="pa-0 px-4 mt-n2">
                <div class="d-flex justify-center mb-3">
                  <v-btn
                    :color="$vuetify.theme.themes.light.submitBtns"
                    class="white--text font-size-14 rounded-lg"
                    :class="$vuetify.breakpoint.smAndDown ? 'pa-5' : ' pa-8'"
                    :loading="isLoading"
                    style="width: 300px;"
                    :style="
                      $vuetify.breakpoint.smAndDown
                        ? 'margin-top:1rem'
                        : 'width: 300px;'
                    "
                    @click="dologin('High School')"
                    >LIMBAAN NATIONAL HIGH SCHOOL</v-btn
                  >
                </div>
              </v-col>
            </v-row>
          </v-form>
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
    this.getSchoolYear();
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
    dologin(item) {
      localStorage.setItem("level", item);
      this.$router.push("/login");
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
  /* background-color: #EA7142; */
  background: url("../../assets/img/bglogin.jpg");
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
