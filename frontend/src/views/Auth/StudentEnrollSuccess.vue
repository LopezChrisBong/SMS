<template>
  <div>
    <v-container fluid fill-height class="content">
      <v-row align="center" justify="center">
        <v-col align="center" cols="12" md="6">
          <v-card max-width="500" class="rounded-card">
            <div class="justify-center pa-4">
              <h3 style="color: #EA7142; width: 70%" class="mb-4 mt-4">
                You have successfully submitted your partial enrollment form!
              </h3>
              <p
                class="text-caption text-gray-100"
                style="width: 85%; font-size: 10px"
              >
                Please submit the following documents on the registrars office!
                <!-- Note that within six days of not submitting you required
                document to pass your pending enrollment will be deleted! -->
              </p>
            </div>

            <div>
              <!-- <img width="200" src="../../assets/img/review.png" /> -->
              <p style="font-size: 12px" class="text-gray-100">
                This page will close automatically in
                <span class="text-green-6DB249">{{ timerCounts }}s</span>
              </p>
            </div>

            <v-col cols="12" class="pa-0">
              <div
                class="
                    d-flex
                    justify-center
                    pt-8
                    pb-3
                    text-caption text-gray-100
                  "
              >
                <!-- Already have an account?
                   <router-link class="pl-2" to="/login"> Sign In</router-link> -->
              </div>
            </v-col>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  watch: {
    timerCounts: {
      handler(value) {
        if (value > 0) {
          setTimeout(() => {
            this.timerCounts--;
          }, 1000);
        } else {
          this.$router.push("/");
        }
      },
      immediate: true, // This ensures the watcher is triggered upon creation
    },
  },
  data: () => ({
    timerCounts: 20,
  }),

  methods: {},
};
</script>

<style scoped>
.content {
  background: url("../../assets/img/bglogin.jpg");
  /* background-color: #EA7142; */
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
}
.title .underline {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}
.title .underline .u1 {
  background: #fff;
  width: 40%;
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
  border-radius: 10px;
}
</style>
