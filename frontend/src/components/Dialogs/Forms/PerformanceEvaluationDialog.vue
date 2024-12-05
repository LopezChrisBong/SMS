<template>
  <div>
    <v-dialog v-model="dialog" persistent eager scrollable max-width="900px">
      <v-form ref="PerformanceTarget" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>{{ action }} IPCR</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="closeD()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 700px" class="my-4">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-select
                    label="Year"
                    outlined
                    v-model="year"
                    dense
                    :rules="[formRules.required]"
                    class="rounded-lg"
                    color="#6DB249"
                    :items="yearList"
                  ></v-select>
                </v-col>
                <v-col cols="6">
                  <v-autocomplete
                    v-model="periodFrom"
                    dense
                    outlined
                    class="rounded-lg"
                    item-text="mnth"
                    item-value="val"
                    label="Period (FROM)"
                    color="#93CB5B"
                    :items="periodList"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="6">
                  <v-autocomplete
                    v-model="periodTo"
                    dense
                    outlined
                    class="rounded-lg"
                    item-text="mnth"
                    item-value="val"
                    label="Period (TO)"
                    color="#93CB5B"
                    :items="getRemainingPeriodList"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    @change="checkIfHeadIsPresident()"
                    :label="isHeadPresident ? 'Final Rating By' : 'Assessed By'"
                    v-model="assessed_by_user"
                    :rules="[formRules.required]"
                    dense
                    :readonly="action == 'View'"
                    outlined
                    class="rounded-lg"
                    item-text="name"
                    item-value="user_detailID"
                    color="#93CB5B"
                    :items="recommendingUsersList"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col v-if="!isHeadPresident" cols="12">
                  <v-autocomplete
                    label="Final Rating By"
                    v-model="final_rating_by_user"
                    :rules="!isHeadPresident ? [formRules.required] : []"
                    dense
                    :readonly="action == 'View'"
                    outlined
                    class="rounded-lg"
                    item-text="name"
                    item-value="id"
                    color="#93CB5B"
                    :items="usersList"
                  >
                  </v-autocomplete>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions class="pa-5">
            <v-spacer></v-spacer>

            <v-btn color="red" outlined @click="closeD()">
              <v-icon>mdi-close-circle-outline</v-icon>
              Cancel
            </v-btn>

            <v-btn
              color="#5a67da"
              class="white--text"
              v-if="action == 'Add'"
              @click="addnew()"
            >
              <v-icon>mdi-check-circle</v-icon>
              Add
            </v-btn>
            <v-btn
              color="#5a67da"
              class="white--text"
              v-if="action == 'Update'"
              @click="update()"
            >
              <v-icon>mdi-check-circle</v-icon>
              Update
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
      :timeout="3000"
    ></fade-away-message-component>
  </div>
</template>

<script>
export default {
  props: {
    data: null,
    action: null,
  },

  data() {
    return {
      id: null,
      dialog: false,
      fadeAwayMessage: {
        show: false,
        type: "success",
        header: "Successfully Added!",
        message: "",
        top: 10,
      },
      yearList: [],
      period: null,
      assessed_by_user: null,
      final_rating_by_user: null,
      // periodList: [
      //   {
      //     id: 1,
      //     description: "January to June",
      //   },
      //   {
      //     id: 2,
      //     description: "July to December",
      //   },
      //   {
      //     id: 3,
      //     description: "January to December",
      //   },
      // ],
      periodFrom: null,
      periodTo: null,
      periodList: [
        {
          val: "1",
          mnth: "January",
        },
        {
          val: "2",
          mnth: "February",
        },
        {
          val: "3",
          mnth: "March",
        },
        {
          val: "4",
          mnth: "April",
        },
        {
          val: "5",
          mnth: "May",
        },
        {
          val: "6",
          mnth: "June",
        },
        {
          val: "7",
          mnth: "July",
        },
        {
          val: "8",
          mnth: "August",
        },
        {
          val: "9",
          mnth: "September",
        },
        {
          val: "10",
          mnth: "October",
        },
        {
          val: "11",
          mnth: "November",
        },
        {
          val: "12",
          mnth: "December",
        },
      ],
      year: null,
      presidentUser: null,
      isHeadPresident: null,
      usersList: [],
      recommendingUsersList: [],
    };
  },
  watch: {
    data: {
      handler(data) {
        this.dialog = true;
        this.loadYear();
        this.loadRecommendingOfficers();
        this.getUsers();
        if (data.id) {
          this.period = data.period;
          this.id = data.id;
          this.year = data.year;
        } else {
          this.periodFrom = null;
          this.periodTo = null;
          this.id = null;
          this.year = null;
        }
      },

      deep: true,
    },
  },

  computed: {
    getRemainingPeriodList() {
      let rem = [];
      if (this.periodFrom) {
        rem = this.periodList.slice(this.periodFrom);
      }
      return rem;
    },
  },

  methods: {
    initialize() {},
    loadRecommendingOfficers() {
      this.axiosCall("/my-direct-head/loadRecommendingOfficers", "GET").then(
        (res) => {
          if (res.data) {
            console.log("recommendingListsss", res.data);
            this.presidentUser = res.data.pres_emp;
            let data = res.data.heads;
            data.forEach((element, i) => {
              data[i].name = this.toTitleCase(element.name);
            });
            this.recommendingUsersList = data;

            this.recommending_userID = res.data.heads[0].user_detailID;
            this.checkIfHeadIsPresident();
          }
        }
      );
    },

    checkIfHeadIsPresident() {
      if (this.presidentUser.user_detailID && this.recommending_userID) {
        if (this.presidentUser.user_detailID == this.recommending_userID) {
          this.isHeadPresident = true;
        } else {
          this.isHeadPresident = false;
        }
      }
    },

    getUsers() {
      this.axiosCall("/user-details/getDeanDirAboveUsers", "GET").then(
        (res) => {
          let data = res.data;
          data.forEach((element, i) => {
            data[i].name = this.toTitleCase(element.name);
          });
          this.usersList = data;
          // console.log(res.data);
        }
      );
    },

    loadYear() {
      let d = new Date();

      let yr = d.getFullYear();

      for (let i = yr; i >= 2020; i--) {
        this.yearList.push(i);
      }
    },
    closeD() {
      this.eventHub.$emit("closePerformanceEvaluationDialog", false);
      this.dialog = false;
    },

    addnew() {
      if (this.$refs.PerformanceTarget.validate()) {
        let data = {
          periodFrom: this.periodFrom,
          periodTo: this.periodTo,
          year: this.year,
          assessed_by_user: this.assessed_by_user,
          final_rating_by_user: this.final_rating_by_user,
        };

        this.axiosCall("/ipcr", "POST", data).then((res) => {
          if (res.data.status == 201) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.closeD();
          } else {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
          }
        });
      }
    },

    update() {
      if (this.$refs.PerformanceTarget.validate()) {
        let data = {
          period: this.period,
          year: this.year,
        };

        this.axiosCall("/ipcr/" + this.id, "PATCH", data).then((res) => {
          if (res.data.status == 200) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.closeD();
          } else {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
          }
        });
      }
    },
  },
};
</script>
