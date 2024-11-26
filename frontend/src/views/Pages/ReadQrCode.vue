<template>
  <div class="mx-2 ">
    <v-card class="mt-2 pb-8">
      <v-row class="px-6 pt-10">
        <v-col v-if="toAlert" cols="12">
          <v-alert
            v-model="toAlert"
            type="warning"
            icon="mdi-alert-circle-outline"
            dense
          >
            <p class="text-subtitle-2">
              {{ alertMsg }}
            </p>
          </v-alert>
        </v-col>
        <v-col xs="12" sm="5" class="pa-4">
          <v-row>
            <v-col cols="12">
              <div class="px-1 d-flex justify-space-between">
                <v-btn
                  @click="reset()"
                  :disabled="!hasSelected"
                  color="#519043"
                  class="white--text"
                >
                  <v-icon>mdi-backup-restore</v-icon>
                  Reset
                </v-btn>
                <v-btn
                  :color="
                    hasSelected
                      ? isIn == true && isOut == false
                        ? '#519043'
                        : 'grey'
                      : '#519043'
                  "
                  class="white--text"
                  :disabled="isOut == true && isIn == false"
                  @click="timeIn()"
                >
                  <v-icon>mdi-clock-in</v-icon>
                  In
                </v-btn>
                <v-btn
                  :color="
                    hasSelected
                      ? isOut == true && isIn == false
                        ? '#519043'
                        : 'grey'
                      : '#519043'
                  "
                  class="white--text"
                  :disabled="isIn == true && isOut == false"
                  @click="timeOut()"
                >
                  <v-icon>mdi-clock-out</v-icon>
                  Out
                </v-btn>
              </div>
            </v-col>
            <v-col cols="12" class="d-flex justify-center">
              <div
                v-if="!hasSelected"
                class="mb-10 init"
                style="
                  height: 400px;
                  width: 400px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
              >
                <div class="text-init">Please select in / out</div>
              </div>
              <div
                v-else
                class="mb-10"
                style="
                  height: 400px;
                  width: 400px;
                  display: flex;
                  background-color: black;
                "
              >
                <qrcode-stream
                  :camera="camera"
                  @decode="onDecode"
                  @init="onInit"
                  v-if="!destroyed"
                >
                  <div
                    class="scan"
                    v-if="!validationFailure && !validationSuccess"
                  >
                    <div class="scanner"></div>
                    <div id="content" class="pa-16">
                      <p></p>
                    </div>
                  </div>

                  <div v-if="validationSuccess" class="validation-success">
                    <img
                      style="margin: auto; width: 80%; height: 80%"
                      src="../../assets/img/check-mark.png"
                      alt=""
                    />
                    QR Code captured
                  </div>

                  <div v-if="validationFailure" class="validation-failure">
                    <img
                      style="margin: auto; width: 80%; height: 80%"
                      src="../../assets/img/x-mark.png"
                      alt=""
                    />
                    This is NOT a valid QR code!
                  </div>

                  <!-- <div v-if="validationPending" class="validation-pending">
                    <img
                      style="margin: auto; width: 80%; height: 80%"
                      src="../../assets/img/x-mark.png"
                      alt=""
                    />
                    Camera turned off
                  </div> -->
                </qrcode-stream>
              </div>
            </v-col>
          </v-row>
        </v-col>
        <v-col xs="12" sm="7" class="elevation-4">
          <v-row class="px-4">
            <v-col cols="12">
              <!-- <img
                style="width: 100%"
                src="../../../src/assets/img/HR.png"
                alt=""
              /> -->
            </v-col>
            <v-col cols="12" class="pa-0">
              <h3 class="d-flex justify-center">LOCATOR SLIP</h3>
            </v-col>
            <v-col cols="5" class="pa-0 d-flex justify-center">
              <v-checkbox
                v-model="locator_type"
                :checked="locator_type == 1 ? true : false"
                label="PERSONAL TRANSACTION"
                color="#519043"
                :value="1"
              ></v-checkbox>
            </v-col>
            <v-col cols="2" class="pa-0">
              <!-- <v-checkbox
                v-model="locator_type"
                :checked="locator_type == 2 ? true : false"
                label="OFFICIAL TIME"
                color="#519043"
                :value="2"
              ></v-checkbox> -->
            </v-col>
            <v-col cols="4" class="pa-0 d-flex justify-center">
              <v-checkbox
                v-model="locator_type"
                :checked="locator_type == 3 ? true : false"
                label="OFFICIAL BUSINESS"
                color="#519043"
                :value="3"
              ></v-checkbox>
            </v-col>
            <v-col cols="12">
              <v-row>
                <v-col cols="4">Name:</v-col>
                <v-col cols="8" class="border_underline">{{ name }}</v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-row>
                <v-col cols="4">Position:</v-col>
                <v-col cols="8" class="border_underline">{{ position }}</v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-row>
                <v-col cols="4">Destination:</v-col>
                <v-col cols="8" class="border_underline">{{
                  destination
                }}</v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-row>
                <v-col cols="4">Purpose:</v-col>
                <v-col cols="8" class="border_underline">{{ purpose }}</v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-row>
                <v-col cols="4">Inclusive Date:</v-col>
                <v-col cols="8" class="border_underline">{{
                  formatDate(inclusiveDate)
                }}</v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-row>
                <v-col cols="3">Out:</v-col>
                <v-col cols="3" class="border_underline">{{
                  formatTime(log_out)
                }}</v-col>
                <v-col cols="3">In:</v-col>
                <v-col cols="3" class="border_underline">{{
                  formatTime(log_in)
                }}</v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-row>
                <v-col cols="4">Requested By:</v-col>
                <v-col cols="8" class="border_underline">
                  <div style="position:relative;">
                    <img
                      v-if="esig"
                      :src="esig"
                      style="position:absolute; top:-20px;width: 60px; height : 60px;"
                    />
                    <div style="position:absolute;top:10px;">
                      {{ is_requested_by_me == 1 ? name : requestedBy }}
                    </div>
                  </div>
                  <!-- <div style="display:grid" :class="esig ? 'mt-n5' : ''">
                    <img
                      style="transform:translate(50%,50%)"
                      v-if="esig"
                      :src="esig"
                      width="40"
                      height="40"
                    />{{ is_requested_by_me == 1 ? name : requestedBy }}
                    
                  </div> -->
                </v-col>
              </v-row>
            </v-col>
            <!-- <v-col cols="12">
              <v-row>
                <v-col cols="4">Recommending Approval:</v-col>
                <v-col cols="8" class="border_underline">{{
                  recommendingApproval
                }}</v-col>
              </v-row>
            </v-col> -->
            <v-col cols="12">
              <v-row>
                <v-col cols="4">Approved:</v-col>
                <v-col cols="8" class="border_underline">
                  <div style="position:relative;">
                    <img
                      v-if="approvedBy_esig"
                      :src="approvedBy_esig"
                      style="position:absolute; top:-20px;width: 60px; height : 60px;"
                    />
                    <div style="position:absolute;top:10px;">
                      {{ approvedBy }}
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-col>
            <v-col></v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
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
      isValid: undefined,
      camera: "auto",
      result: null,
      isIn: false,
      isOut: false,
      is_requested_by_me: null,
      hasSelected: false,
      destroyed: false,
      locator_type: null,
      name: null,
      position: null,
      destination: null,
      purpose: null,
      inclusiveDate: null,
      requestedBy: null,
      recommendingApproval: null,
      approvedBy: null,
      log_in: null,
      log_out: null,
      esig: null,
      approvedBy_esig: null,
      toAlert: false,
      alertMsg: null,
      fadeAwayMessage: {
        show: false,
        type: "success",
        header: "System Message!",
        message: "",
        top: 10,
      },
    };
  },

  created() {
    // console.log("created");
    if (this.$store.state.expiryDate < Date.now()) {
      this.$store.dispatch("setUser", null);
      this.$store.dispatch("setIsAuthenticated", 0);
      this.render = true;
      this.$router.push("/");
      // location.reload();
    }
  },

  computed: {
    validationPending() {
      return this.isValid === undefined && this.camera === "off";
    },

    validationSuccess() {
      return this.isValid === true;
    },

    validationFailure() {
      return this.isValid === false;
    },
  },

  methods: {
    onInit(promise) {
      promise.catch(console.error).then(this.resetValidationState);
    },

    resetValidationState() {
      this.isValid = undefined;
    },

    async timeOut() {
      this.hasSelected = true;
      this.turnCameraOn();
      this.isOut = true;
      this.isIn = false;
    },

    async timeIn() {
      this.turnCameraOn();
      this.hasSelected = true;
      this.isIn = true;
      this.isOut = false;
    },

    async reload() {
      this.destroyed = true;

      await this.$nextTick();

      this.destroyed = false;
    },

    async onDecode(content) {
      this.result = content;

      // pretend it's taking really long
      await this.timeout(1000);
      this.getLocator(content);
      this.turnCameraOff();
      // this.isValid = content.startsWith("http");

      // some more delay, so users have time to read the message
      await this.timeout(2000);

      // this.turnCameraOn();
    },

    getLocator(id) {
      let type = "";
      if (this.isIn == true && this.isOut == false) {
        type = "IN";
      }
      if (this.isIn == false && this.isOut == true) {
        type = "OUT";
      }

      let data = {
        id: id,
        logType: type,
      };
      this.axiosCall("/my-locator-slip/logLocatorAct", "POST", data).then(
        (res) => {
          console.log(res.data);
          if (res.data.status == 200) {
            if (res.data.hasData == true) {
              this.isValid = true;

              this.locator_type = res.data.locatorData.locator_type;
              this.name = res.data.locatorData.name;
              this.position = res.data.locatorData.description;
              this.destination = res.data.locatorData.destination;
              this.purpose = res.data.locatorData.purpose;
              this.inclusiveDate = res.data.locatorData.inclusive_date;
              this.is_requested_by_me = res.data.locatorData.is_requested_by_me;
              this.requestedBy = res.data.locatorData.requested_by;
              this.recommendingApproval =
                res.data.locatorData.recommending_approval;

              if (
                res.data.locatorData.approvedBy &&
                res.data.locatorData.approvedBy ==
                  res.data.locatorData.approved_by_userID
              ) {
                this.approvedBy = res.data.locatorData.approvingUser;
              } else if (
                res.data.locatorData.approvedBy &&
                res.data.locatorData.approvedBy ==
                  res.data.locatorData.recommending_approval
              ) {
                this.approvedBy = res.data.locatorData.approvingUser;
              } else if (
                !res.data.locatorData.approvedBy &&
                res.data.locatorData.approvedBy ==
                  res.data.locatorData.approved_by_userID
              ) {
                this.approvedBy = res.data.locatorData.approvedBy;
              } else if (
                !res.data.locatorData.approvedBy &&
                res.data.locatorData.approvedBy ==
                  res.data.locatorData.recommending_approval
              ) {
                this.approvedBy = res.data.locatorData.approvingUser;
              }

              // this.approvedBy = res.data.locatorData.approvedBy;
              this.log_in = res.data.locatorData.in;
              this.log_out = res.data.locatorData.out;

              this.esig = res.data.user_esig
                ? process.env.VUE_APP_SERVER +
                  "/e-sigs/getEsign/" +
                  res.data.user_esig.esign_filename
                : null;
              this.approvedBy_esig = res.data.approved_by_user_esig
                ? process.env.VUE_APP_SERVER +
                  "/e-sigs/getEsign/" +
                  res.data.approved_by_user_esig.esign_filename
                : null;
              // this.esig = this.getBufferString(res.data.esig.esign);
            } else if (res.data.hasData == false) this.isValid = false;
          } else if (res.data.status == 400) {
            this.toAlert = true;
            this.alertMsg = res.data.msg;
            setTimeout(() => {
              this.toAlert = false;
              this.alertMsg = null;
              this.reset();
            }, 3000);
          }
        }
      );
    },

    getBufferString(buff) {
      var buffer = new Buffer(buff);
      return buffer.toString("base64");
    },

    reset() {
      this.hasSelected = false;
      this.esig = null;
      this.isIn = null;
      this.isOut = null;
      this.turnCameraOff();
      this.resetValidationState();
      this.locator_type = null;
      this.name = null;
      this.position = null;
      this.destination = null;
      this.purpose = null;
      this.inclusiveDate = null;
      this.requestedBy = null;
      this.recommendingApproval = null;
      this.approvedBy = null;
      this.log_in = null;
      this.log_out = null;
    },

    turnCameraOn() {
      this.camera = "auto";
    },

    turnCameraOff() {
      this.camera = "off";
    },

    timeout(ms) {
      return new Promise((resolve) => {
        window.setTimeout(resolve, ms);
      });
    },
  },
};
</script>

<style scoped>
.border_underline {
  border-bottom: 1px solid black;
}
.validation-success,
.validation-failure,
.validation-pending {
  position: absolute;
  width: 100%;
  height: 100%;

  background-color: rgba(255, 255, 255, 0.8);
  text-align: center;
  font-weight: bold;
  font-size: 1.4rem;
  padding: 10px;

  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
}
.validation-success {
  color: green;
}
.validation-failure {
  color: red;
}
.init {
  color: white;
  background-color: grey;
}
.text-init {
  font-size: 1.4rem;

  /* text-align: center; */
  /* transform: translate(50%, 40%); */
}
#content {
  position: relative;
  width: 100%;
  height: 100%;
  /* transform: translate(50%, 50%); */
}
#content:before,
#content:after,
#content > :first-child:before,
#content > :first-child:after {
  position: absolute;
  width: 50px;
  height: 50px;

  border-color: #519043; /* or whatever colour */
  border-style: solid; /* or whatever style */
  border-width: thick;

  content: " ";
}
#content:before {
  top: 0;
  left: 0;
  border-width: 2px 0 0 2px;
  border-radius: 2px;
}
#content:after {
  top: 0;
  right: 0;
  border-width: 2px 2px 0 0;
  border-radius: 2px;
}
#content > :first-child:before {
  bottom: 0;
  right: 0;
  border-width: 0 2px 2px 0;
  border-radius: 2px;
}
#content > :first-child:after {
  bottom: 0;
  left: 0;
  border-width: 0 0 2px 2px;
  border-radius: 2px;
}

.scan {
  width: 50%;
  height: 50%;
  margin: 25% auto;
}
.scanner {
  content: "";
  background: rgb(23, 162, 74);
  height: 0.25em;
  width: 50%;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  margin: auto;
  opacity: 7;
  z-index: 2;
  animation: 2s infinite ease-in-out roll;
}

@keyframes roll {
  0% {
    transform: translateY(-100px);
  }
  50% {
    transform: translateY(100px);
  }
  100% {
    transform: translateY(-100px);
  }
}
</style>
