<template>
  <div>
    <v-dialog v-model="dialog" persistent scrollable max-width="700px">
      <v-card>
        <v-card-title dark class="dialog-header">
          Locator Slip
          <v-spacer></v-spacer>
          <v-btn icon dark @click="close()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-col> </v-col>
        <v-card-text style="max-height: 800px">
          <v-form ref="MyLocatorSlipFormref" @submit.prevent>
            <v-container>
              <v-row>
                <v-col cols="1"></v-col>
                <v-col cols="4" class="mb-2">
                  <v-checkbox
                    v-model="type"
                    label="PERSONAL"
                    color="#6DB249"
                    :value="1"
                    readonly
                    :checked="type == 1 ? true : false"
                  ></v-checkbox>
                </v-col>
                <v-col cols="2"></v-col>
                <!-- <v-col cols="4" class="mb-2">
                  <v-checkbox
                    v-model="type"
                    label="OFFICIAL TIME"
                    color="#6DB249"
                    :value="2"
                    readonly
                    :checked="type == 2 ? true : false"
                  ></v-checkbox>
                </v-col> -->
                <v-col cols="4" class="mb-2">
                  <v-checkbox
                    v-model="type"
                    label="OFFICIAL BUSINESS"
                    color="#6DB249"
                    :value="3"
                    readonly
                    :checked="type == 3 ? true : false"
                  ></v-checkbox>
                </v-col>
                <v-col cols="12" class="py-0">
                  <v-row>
                    <v-col cols="4">Name: </v-col>
                    <v-col cols="8"
                      ><div class="border-bottom">
                        {{ getUserName(userID) }}
                      </div></v-col
                    >
                    <v-col cols="4">Position: </v-col>
                    <v-col cols="8"
                      ><div class="border-bottom">{{ position }}</div></v-col
                    >
                    <v-col cols="4">Destination: </v-col>
                    <v-col cols="8"
                      ><div class="border-bottom">{{ destination }}</div></v-col
                    >
                    <v-col cols="4">Purpose(s): </v-col>
                    <v-col cols="8"
                      ><div class="border-bottom">{{ purpose }}</div></v-col
                    >
                    <v-col cols="4">Inclusive Dates: </v-col>
                    <v-col cols="8"
                      ><div class="border-bottom">
                        {{ formatDate(inclusive_date) }}
                      </div></v-col
                    >
                    <v-col cols="6">
                      <v-row>
                        <v-col cols="3">OUT:</v-col>
                        <v-col cols="9"
                          ><div class="border-bottom">
                            <span
                              v-if="ls_out == null"
                              style="visibility: hidden"
                              >X</span
                            >
                            <span v-if="ls_out != null">
                              {{ formatTime(ls_out) }}</span
                            >
                          </div></v-col
                        >
                      </v-row>
                    </v-col>
                    <v-col cols="6"
                      ><v-row>
                        <v-col cols="3">IN:</v-col>
                        <v-col cols="9"
                          ><div class="border-bottom">
                            <span
                              v-if="ls_in == null"
                              style="visibility: hidden"
                              >X</span
                            >
                            <span v-if="ls_in != null">
                              {{ formatTime(ls_in) }}</span
                            >
                          </div></v-col
                        >
                      </v-row></v-col
                    >

                    <!-- <v-col cols="4">Recommending Approval: </v-col>
                    <v-col cols="8"
                      ><div class="border-bottom">
                        <span
                          v-if="recommendingApprovalID == null"
                          style="visibility: hidden"
                          >X</span
                        >
                        <span v-if="recommendingApprovalID != null">
                          {{ getUserName(recommendingApprovalID) }}</span
                        >
                      </div></v-col
                    > -->
                    <v-col cols="4">APPROVED: </v-col>
                    <v-col cols="8" style="display: grid"
                      ><div class="border-bottom" style="text-align: center">
                        {{
                          approvedBy
                            ? getUserName(approvedBy)
                            : getUserName(approvedByID)
                        }}
                      </div>
                      <div style="text-align: center">
                        President/VPAR/VPAF/Dean/Director
                      </div></v-col
                    >
                  </v-row>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-text
          style="
            display: flex;
            justify-content: space-between;
            border-top: 1px solid rgb(187, 183, 183);
            padding: 16px;
          "
        >
          <v-menu top>
            <template v-slot:activator="{ on }">
              <v-btn
                color="#519043"
                fab
                dark
                left
                small
                class="v-btn--example"
                v-on="on"
              >
                <v-icon>mdi-comment-processing-outline</v-icon>
              </v-btn>
            </template>

            <v-card
              class="mx-auto"
              width="400"
              max-width="400"
              max-height="600"
            >
              <v-card-title class="dialog-header white--text">
                <span class="text-h6">Remarks</span>
              </v-card-title>
              <v-card-text class="py-0">
                <v-timeline dense v-if="remarksData.length > 0">
                  <v-timeline-item
                    v-for="item in remarksData"
                    :key="item.id"
                    color="#519043"
                    icon="mdi-comment-processing-outline"
                    fill-dot
                  >
                    <!-- <template v-slot:opposite> Opposite </template>
                    Content -->
                    <div style="font-weight: 800" class="me-3">
                      {{
                        $store.getters.getUserData.id ==
                        item.remarks_maker_userID
                          ? "You"
                          : item.remarks_by
                      }}
                    </div>
                    <div class="text-body-2">
                      {{ item.message }}
                    </div>
                    <div class="text-caption">
                      <i>{{ formatDate(item.created_at) }}</i>
                    </div>
                    <!-- <v-alert :value="true">
                      
                    </v-alert> -->
                  </v-timeline-item>
                </v-timeline>
                <v-timeline dense v-if="remarksData.length == 0">
                  <v-timeline-item
                    color="#519043"
                    icon="mdi-comment-processing-outline"
                    fill-dot
                  >
                    <div class="me-3" style="margin-top: 7px">
                      No remarks found.
                    </div>
                    <!-- <v-alert :value="true">
                     
                    </v-alert> -->
                  </v-timeline-item>
                </v-timeline>
              </v-card-text>
            </v-card>
          </v-menu>
          <div>
            <v-btn class="mx-1" color="red" outlined @click="close()">
              <v-icon>mdi-close-circle-outline</v-icon>
              Close
            </v-btn>
            <!-- <v-btn
              v-if="status == 2 && ls_out != null && ls_in != null"
              class="mx-1"
              color="#6DB249"
              outlined
              @click="print()"
            >
              <v-icon>mdi-printer</v-icon>
              Print
            </v-btn> -->
          </div>
        </v-card-text>

        <!-- <v-card-actions class="pa-5">
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="close()">
            <v-icon>mdi-close-circle-outline</v-icon>
            Close
          </v-btn>
        </v-card-actions> -->
      </v-card>
    </v-dialog>

    <v-dialog v-model="warningDialog" persistent max-width="390">
      <v-card color="white">
        <div class="pa-4 #3a3b3a--text">
          <div class="text-overline mb-1">WARNING!</div>
          <div class="text-body-1 mb-1">
            <p style="text-align: justify">
              <v-icon class="mt-n2" color="white">mdi-alert</v-icon> &nbsp;{{
                warningMsg
              }}
            </p>
          </div>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="warningDialog = false">
            Close
          </v-btn>
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
  </div>
</template>

<script>
export default {
  props: {
    data: null,
    displayFor: null,
  },
  data() {
    return {
      dialog: false,
      id: null,
      warningDialog: false,
      warningMsg: null,
      userID: null,
      approval_name: null,
      position: null,
      destination: null,
      purpose: null,
      inclusive_date: null,
      status: null,
      ls_out: null,
      ls_in: null,
      recommendingApprovalID: null,
      approvedByID: null,
      approvedBy: null,
      type: null,
      hasUserEsig: false,
      hasApprovedByUserEsig: false,
      positionList: [],
      usersList: [],
      remarksData: [],
      fadeAwayMessage: {
        show: false,
        type: "success",
        header: "Successfully Added!",
        message: "",
        top: 10,
      },
    };
  },
  watch: {
    data: {
      handler(data) {
        if (data) {
          this.dialog = true;

          this.id = data.id;
          this.status = data.status;
          this.userID = data.userID;
          this.destination = data.destination;
          this.purpose = data.purpose;
          this.inclusive_date = data.inclusive_date;
          this.ls_out = data.out;
          this.ls_in = data.in;
          this.recommendingApprovalID = data.recommending_approval;
          this.approvedByID = data.approved_by_userID;
          this.approvedBy = data.approvedBy;
          this.type = data.locator_type;
          this.getUsers();
          this.getUserPosition(data.userID);
          this.loadRemarks(data.id);

          if (data.status == 2) {
            this.checkUserEsig(data.userID);
            this.checkApprovingUserEsig(data.approvedBy);
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    loadRemarks(id) {
      this.axiosCall("/remarks/" + id + "/Locator Slip", "GET").then((res) => {
        if (res.data) {
          this.remarksData = res.data;
        }
      });
    },

    close() {
      this.dialog = false;
      this.$refs.MyLocatorSlipFormref.reset();
      this.eventHub.$emit("closeViewLocatorSlipDialog", false);
    },

    redirectTo() {
      var usertype = this.$store.state.user.usertype.description;
      if (this.$store.state.user.user.user_roleID == 5) {
        this.$router.push("/superadmin/my-direct-head");
      } else {
        this.$router.push("/" + usertype.toLowerCase() + "/my-direct-head");
      }
    },

    async print() {
      if (this.hasUserEsig && this.hasApprovedByUserEsig) {
        let url =
          process.env.VUE_APP_SERVER +
          "/pdf-generator/print-locator-slip/" +
          this.id;
        window.open(url);
      } else if (!this.hasUserEsig && this.hasApprovedByUserEsig) {
        this.warningMsg = "You have not uploaded your E-signature yet!";
        this.warningDialog = true;
      } else if (this.hasUserEsig && !this.hasApprovedByUserEsig) {
        this.warningMsg =
          "Your approving user has not uploaded an e-signature yet!";
        this.warningDialog = true;
      } else if (!this.hasUserEsig && !this.hasApprovedByUserEsig) {
        this.warningMsg =
          "You and your approving user has not uploaded an e-signature yet!";
        this.warningDialog = true;
      }
    },

    checkUserEsig(id) {
      this.axiosCall("/e-sigs/checkForEsig/" + id, "GET").then((res) => {
        this.hasUserEsig = res.data;
      });
    },
    checkApprovingUserEsig(id) {
      this.axiosCall("/e-sigs/checkForEsig/" + id, "GET").then((res) => {
        this.hasApprovedByUserEsig = res.data;
      });
    },

    getUserName(id) {
      for (let i = 0; i < this.usersList.length; i++) {
        if (this.usersList[i].id == id) {
          return this.usersList[i].name;
        }
      }
    },

    getUsers() {
      this.axiosCall("/user-details/getAllUserDetail", "GET").then((res) => {
        if (res.data) {
          this.usersList = res.data;
        }
      });
    },

    getUserPosition(id) {
      this.axiosCall("/positions/getUserPosition/" + id, "GET").then((res) => {
        this.position = res.data.position;
      });
    },
  },
};
</script>
<style scoped>
.clickme {
  text-decoration: underline;
  cursor: pointer;
  text-underline-offset: 2px;
}
.border-bottom {
  border-bottom: 1px solid black;
  width: 100%;
}
</style>
