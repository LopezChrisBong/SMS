<template>
  <div>
    <v-dialog
      v-model="dialog"
      eager
      scrollable
      persistent
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-form ref="ILDPApprovalFormref" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>ILPD Approval</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="closeD()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 800px" class="my-4">
            <v-row>
              <v-col cols="12">
                <v-stepper alt-labels class="elevation-0">
                  <v-stepper-header>
                    <!-- <v-stepper-step
                      step="1"
                      :complete="prog_head_approval_status == 2 ? true : false"
                      color="#6DB249"
                    >
                      <h3 class="text-gray-200 text-body-2">
                        {{ prog_head_name }}
                      </h3>
                      <small>Program Head/Immediate Supervisor </small>
                    </v-stepper-step>

                    <v-divider></v-divider> -->

                    <v-stepper-step
                      step="1"
                      class="pa-5"
                      :complete="dean_approval_status == 2 ? true : false"
                      color="#6DB249"
                    >
                      {{ dean_name }}
                      <small
                        >Immediate Head / Supervisor <br />
                        {{
                          dean_approval_date
                            ? formatDate(dean_approval_date)
                            : ""
                        }}</small
                      >
                    </v-stepper-step>

                    <v-divider></v-divider>

                    <v-stepper-step
                      class="pa-5"
                      step="2"
                      :complete="vp_approval_status == 2 ? true : false"
                      color="#6DB249"
                    >
                      {{ vp_name }}
                      <small
                        >Vice President <br />
                        {{
                          vp_approval_date ? formatDate(vp_approval_date) : ""
                        }}</small
                      >
                    </v-stepper-step>
                    <v-divider></v-divider>

                    <v-stepper-step
                      class="pa-5"
                      step="3"
                      :complete="president_approval_status == 2 ? true : false"
                      color="#6DB249"
                    >
                      {{ president_name }}
                      <small
                        >President<br />
                        {{
                          president_approval_date
                            ? formatDate(president_approval_date)
                            : ""
                        }}</small
                      >
                    </v-stepper-step>
                  </v-stepper-header>
                </v-stepper>
              </v-col>
              <v-col cols="12">
                <div class="d-flex">
                  <div class="label text-body-1 font-weight-bold  py-1 ">
                    Name
                  </div>
                  <div class="data  py-2">{{ user_name }}</div>
                </div>
                <div class="d-flex">
                  <div class="label text-body-1 font-weight-bold py-1">
                    Current Rank
                  </div>
                  <div class="data  py-2">{{ user_rank }}</div>
                </div>
                <div class="d-flex">
                  <div class="label text-body-1 font-weight-bold py-1">
                    Educational Attainment
                  </div>
                  <div class="data d-flex">
                    <div class="educ-data text-body-1 font-weight-bold py-1">
                      Program
                    </div>
                    <div class="educ-data text-body-1 font-weight-bold py-1">
                      Highest Level/Units Earned
                    </div>
                    <div class="educ-data text-body-1 font-weight-bold py-1">
                      Year Graduated
                    </div>
                    <div class="educ-data text-body-1 font-weight-bold py-1">
                      Name of School(Write in full) & Address
                    </div>
                    <div class="educ-data text-body-1 font-weight-bold py-1">
                      Period of Attendance<br />
                      (From/To)
                    </div>
                  </div>
                </div>
                <div class="d-flex">
                  <div class="label text-body-1 font-weight-bold py-1">
                    Bachelor's Degreee
                  </div>
                  <div class="data ">
                    <div v-for="(item, i) in user_educBg" :key="i">
                      <div v-if="item.level == 'College'" class="d-flex">
                        <div class="educ-data py-1">{{ item.educ_course }}</div>
                        <div class="educ-data py-1">
                          {{ item.units_earned }}
                        </div>
                        <div class="educ-data py-1">
                          {{ item.year_graduated }}
                        </div>
                        <div class="educ-data py-1">{{ item.school_name }}</div>
                        <div class="educ-data py-1">
                          {{ item.period_of_attendance }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="d-flex">
                  <div class="label text-body-1 font-weight-bold py-1">
                    Masters Degreee
                  </div>
                  <div class="data ">
                    <div v-for="(item, i) in user_educBg" :key="i">
                      <div
                        v-if="
                          item.level == 'Graduate Studies' &&
                            item.grad_study_type == 'Masteral'
                        "
                        class="d-flex"
                      >
                        <div class="educ-data py-1">{{ item.educ_course }}</div>
                        <div class="educ-data py-1">
                          {{ item.units_earned }}
                        </div>
                        <div class="educ-data py-1">
                          {{ item.year_graduated }}
                        </div>
                        <div class="educ-data py-1">{{ item.school_name }}</div>
                        <div class="educ-data py-1">
                          {{ item.period_of_attendance }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="d-flex">
                  <div class="label text-body-1 font-weight-bold py-1">
                    Doctorate Degreee
                  </div>
                  <div class="data ">
                    <div v-for="(item, i) in user_educBg" :key="i">
                      <div
                        v-if="
                          item.level == 'Graduate Studies' &&
                            item.grad_study_type == 'Doctorate'
                        "
                        class="d-flex"
                      >
                        <div class="educ-data py-1">{{ item.educ_course }}</div>
                        <div class="educ-data py-1">
                          {{ item.units_earned }}
                        </div>
                        <div class="educ-data py-1">
                          {{ item.year_graduated }}
                        </div>
                        <div class="educ-data py-1">{{ item.school_name }}</div>
                        <div class="educ-data py-1">
                          {{ item.period_of_attendance }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </v-col>
              <v-col cols="12">
                <div class="d-flex">
                  <div
                    style="border : 1px solid #519043; width:30%; background-color:#519043; "
                    class="text-center white--text"
                  >
                    Learning and Development Activity
                  </div>
                  <div
                    style="border : 1px solid #519043; width:70%; background-color:#519043;"
                    class="text-center white--text"
                  >
                    (Indicate Target Completion Dates for Advanced Studies &
                    Skills Certification/Licensure/Eligibilities) <br />(Write
                    the specific title of the Seminar, Workshops, Training &
                    Conferences)
                  </div>
                </div>
                <div class="d-flex">
                  <div
                    style="border : 1px solid #9E9E9E; width:30%; "
                    class="text-center grey--text"
                  >
                    <span style="visibility:hidden"
                      >Seminars, Workshops, Training and Conferences</span
                    >
                  </div>
                  <div
                    style="border : 1px solid #9E9E9E; width:70%; "
                    class="text-center grey--text d-flex"
                  >
                    <div
                      class="text-center grey--text year"
                      v-for="year in years"
                      :key="year"
                    >
                      {{ year }}
                    </div>
                  </div>
                </div>
                <div class="d-flex">
                  <div
                    style="border : 1px solid #9E9E9E; width:30%; "
                    class="text-center grey--text"
                  >
                    Seminars, Workshops, Training and Conferences
                  </div>
                  <div
                    style="border : 1px solid #9E9E9E; width:70%; "
                    class="text-center grey--text d-flex"
                  >
                    <div
                      class="text-center grey--text year"
                      v-for="yr in years"
                      :key="yr"
                    >
                      <div v-for="(item, i) in ildpCreated" :key="i">
                        <div
                          v-if="item.ld_actID == 1 && item.year == yr"
                          class="px-2 py-2 text-left lndList"
                        >
                          {{ item.title }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="d-flex">
                  <div
                    style="border : 1px solid #9E9E9E; width:30%; "
                    class="text-center grey--text"
                  >
                    Advanced Studies/ Professional Development
                  </div>
                  <div
                    style="border : 1px solid #9E9E9E; width:70%; "
                    class="text-center grey--text d-flex"
                  >
                    <div
                      class="text-center grey--text year"
                      v-for="yr in years"
                      :key="yr"
                    >
                      <div v-for="(item, i) in ildpCreated" :key="i">
                        <div
                          v-if="item.ld_actID == 2 && item.year == yr"
                          class="px-2 py-2 text-left lndList"
                        >
                          {{ item.title }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="d-flex">
                  <div
                    style="border : 1px solid #9E9E9E; width:30%; "
                    class="text-center grey--text"
                  >
                    Skills Certification/ Licensure/Eligibilities
                  </div>
                  <div
                    style="border : 1px solid #9E9E9E; width:70%; "
                    class="text-center grey--text d-flex"
                  >
                    <div
                      class="text-center grey--text year"
                      v-for="yr in years"
                      :key="yr"
                    >
                      <div v-for="(item, i) in ildpCreated" :key="i">
                        <div
                          v-if="item.ld_actID == 3 && item.year == yr"
                          class="px-2 py-2 text-left lndList"
                        >
                          {{ item.title }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="d-flex">
                  <div
                    style="border : 1px solid #9E9E9E; width:30%; "
                    class="text-center grey--text"
                  >
                    Research, Extension, Production, Administration and Other
                    Interests
                  </div>
                  <div
                    style="border : 1px solid #9E9E9E; width:70%; "
                    class="text-center grey--text d-flex"
                  >
                    <div
                      class="text-center grey--text year"
                      v-for="yr in years"
                      :key="yr"
                    >
                      <div v-for="(item, i) in ildpCreated" :key="i">
                        <div
                          v-if="item.ld_actID == 4 && item.year == yr"
                          class="px-2 py-2 text-left lndList"
                        >
                          {{ item.title }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions class="pa-5" v-if="tab == 1">
            <v-spacer></v-spacer>
            <!-- <v-btn color="red" outlined @click="pending(toApproveType)">
              <v-icon>mdi-close-circle-outline</v-icon>
              Pending
            </v-btn> -->

            <!-- <v-btn
              color="#519043"
              v-if="toApproveType == 'ProgHead'"
              class="white--text"
              @click="ProgHeadApprovalBtn()"
            >
              <v-icon>mdi-check-circle</v-icon>
              Approve
            </v-btn> -->

            <v-btn
              color="#519043"
              @click="DeanDirApprovalBtn()"
              v-if="toApproveType == 'Dean/Dir'"
              class="white--text"
            >
              <v-icon>mdi-check-circle</v-icon>
              Approve
            </v-btn>
            <v-btn
              color="#519043"
              v-if="toApproveType == 'VP'"
              class="white--text"
              @click="VPApprovalBtn()"
            >
              <v-icon>mdi-check-circle</v-icon>
              Approve
            </v-btn>
            <v-btn
              color="#519043"
              @click="PresidentApprovalBtn()"
              v-if="toApproveType == 'President'"
              class="white--text"
            >
              <v-icon>mdi-check-circle</v-icon>
              Approve
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
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
    action: null,
    toApproveType: null,
    tab: null,
  },
  components: {},
  data() {
    return {
      dialog: false,

      id: null,
      ildpCalendarID: null,
      user_name: null,
      user_rank: null,
      user_educBg: [],
      ildpCalendarList: [],
      prog_head_userID: null,
      dean_userID: null,
      vp_userID: null,
      president_userID: null,
      prog_head_name: null,
      dean_name: null,
      vp_name: null,
      president_name: null,
      prog_head_approval_status: null,
      dean_approval_status: null,
      vp_approval_status: null,
      president_approval_status: null,
      dean_approval_date: null,
      vp_approval_date: null,
      president_approval_date: null,
      years: [],
      ildpCreated: [],

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
        this.dialog = true;

        // this.$refs.TOApprovalFormref.reset();
        // this.$refs.TOApprovalFormref.resetValidation();

        if (data.id) {
          this.id = data.id;
          // console.log(data.dean_approval_date);

          this.formatYearData(data.yearFrom, data.yearTo);
          this.initialize(data.id);
          // this.getRecommendingApproval(data.recommending_approval_userID);
          // this.getFinanceDir(data.finance_dir_userID);
          // this.getCollegePres(data.president_userID);
          // this.getTOAttachments(data.id);
        }
      },
      deep: true,
    },
  },
  methods: {
    initialize(id) {
      this.axiosCall("/my-ildp/ildpToApprove/" + id, "GET").then((res) => {
        if (res.data) {
          this.ildpCreated = res.data;
        }
      });

      this.axiosCall("/my-ildp/" + id, "GET").then((res) => {
        if (res.data) {
          console.log(res.data);
          // this.prog_head_approval_status = res.data.prog_head_approval_status;
          this.dean_approval_date = res.data.dean_approval_date;
          this.vp_approval_date = res.data.vp_approval_date;
          this.president_approval_date = res.data.president_approval_date;
          this.dean_approval_status = res.data.dean_approval_status;
          this.vp_approval_status = res.data.vp_approval_status;
          this.president_approval_status = res.data.president_approval_status;
          // this.getProgHeadName(res.data.prog_head_userID);
          this.getDeanDirName(res.data.dean_userID);
          this.getVPName(res.data.vp_userID);
          this.getPresName(res.data.president_userID);
          this.getUserEducBackground(res.data.userdetailID);
        }
      });
    },

    getUserEducBackground(id) {
      this.user_name = null;
      this.user_rank = null;
      this.user_educBg = [];
      this.axiosCall("/user-details/getUserEducBackground/" + id, "GET").then(
        (res) => {
          if (res.data) {
            console.log(res.data);
            this.user_name = res.data.name;
            this.user_rank = res.data.cur_rank;
            this.user_educBg = res.data.education;
          }
        }
      );
    },

    formatYearData(from, to) {
      this.years = [];
      for (let i = parseInt(from); i <= parseInt(to); i++) {
        this.years.push(i);
      }
    },

    closeD() {
      this.eventHub.$emit("closeViewILDPApproval", false);
      this.dialog = false;
    },

    pending(approver) {
      let data = {
        TO_id: this.TOModel.id,
        approver: approver,
      };

      this.axiosCall("/travel-order/pendingTo", "POST", data).then((res) => {
        if (res.data.status == 200) {
          this.dialog = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
          this.closeD();
        } else if (res.data.status == 400) {
          this.dialog = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;

          this.closeD();
        }
      });
    },

    // ProgHeadApprovalBtn() {
    //   let data = {
    //     status: 2,
    //     id: this.id,
    //   };
    //   this.axiosCall("/my-ildp/approval/proghead", "POST", data).then((res) => {
    //     if (res.data.status == 200) {
    //       this.dialog = false;
    //       this.fadeAwayMessage.show = true;
    //       this.fadeAwayMessage.type = "success";
    //       this.fadeAwayMessage.header = "System Message";
    //       this.fadeAwayMessage.message = res.data.msg;
    //       this.closeD();
    //     } else if (res.data.status == 400) {
    //       this.dialog = false;
    //       this.fadeAwayMessage.show = true;
    //       this.fadeAwayMessage.type = "error";
    //       this.fadeAwayMessage.header = "System Message";
    //       this.fadeAwayMessage.message = res.data.msg;

    //       this.closeD();
    //     }
    //   });
    // },

    DeanDirApprovalBtn() {
      let data = {
        status: 2,
        id: this.id,
      };
      this.axiosCall("/my-ildp/approval/deandir", "POST", data).then((res) => {
        if (res.data.status == 200) {
          this.dialog = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
          this.closeD();
        } else if (res.data.status == 400) {
          this.dialog = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
          this.$refs.PositionFormref.reset();
          this.closeD();
        }
      });
    },

    VPApprovalBtn() {
      let data = {
        status: 2,
        id: this.id,
      };
      this.axiosCall("/my-ildp/approval/vp", "POST", data).then((res) => {
        if (res.data.status == 200) {
          this.dialog = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
          this.closeD();
        } else if (res.data.status == 400) {
          this.dialog = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
          this.$refs.PositionFormref.reset();
          this.closeD();
        }
      });
    },

    PresidentApprovalBtn() {
      let data = {
        status: 2,
        id: this.id,
      };
      this.axiosCall("/my-ildp/approval/president", "POST", data).then(
        (res) => {
          if (res.data.status == 200) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.closeD();
          } else if (res.data.status == 400) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;

            this.closeD();
          }
        }
      );
    },

    // getProgHeadName(id) {
    //   this.axiosCall("/my-direct-head/getPersonnelName/" + id, "GET").then(
    //     (res) => {
    //       if (res.data) {
    //         this.prog_head_name = res.data.name;
    //       }
    //     }
    //   );
    // },

    getDeanDirName(id) {
      this.axiosCall("/my-direct-head/getPersonnelName/" + id, "GET").then(
        (res) => {
          if (res.data) {
            this.dean_name = res.data.name;
          }
        }
      );
    },

    getVPName(id) {
      this.axiosCall("/my-direct-head/getPersonnelName/" + id, "GET").then(
        (res) => {
          if (res.data) {
            this.vp_name = res.data.name;
          }
        }
      );
    },

    getPresName(id) {
      this.axiosCall("/my-direct-head/getPersonnelName/" + id, "GET").then(
        (res) => {
          if (res.data) {
            this.president_name = res.data.name;
          }
        }
      );
    },
  },
};
</script>

<style scoped>
.year {
  border: 1px solid #9e9e9e;
  border-bottom: none;
  border-top: none;
  width: 100%;
}
.lndList {
  display: list-item;

  list-style-position: inside;
}
.label,
.data {
  border: 1px solid #9e9e9e;
  text-indent: 5px;
}
.label {
  width: 20%;
}
.data {
  width: 80%;
}
.educ-data {
  width: 20%;
  padding-left: 2px;
  padding-right: 2px;
  border-left: 1px solid #9e9e9e;
  border-right: 1px solid #9e9e9e;
  text-align: center;
}
.tableBg {
  background-color: #519043;
  color: white;
}
</style>
