<template>
  <div>
    <v-dialog v-model="dialog" persistent eager scrollable max-width="600px">
      <v-form ref="AddSchoolYear" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>{{ action }} School Year</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="closeD()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 700px" class="my-4">
            <v-container>
              <v-row>
                <v-col cols="12" md="12" v-if="action != 'Update'">
                  <v-autocomplete
                    v-model="school_year_from"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    class="rounded-lg"
                    item-text="description"
                    item-value="id"
                    label="Year From"
                    color="#93CB5B"
                    :items="year_fromList"
                    @change="onChangeDateFrom($event)"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" md="12" v-if="action != 'Update'">
                  <v-text-field
                    v-model="school_year_to"
                    dense
                    outlined
                    readonly
                    label="School Year To:"
                    class="rounded-lg"
                    item-text="description"
                    item-value="id"
                    color="#93CB5B"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="12" v-if="action == 'Update'">
                  <v-autocomplete
                    v-model="status"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    class="rounded-lg"
                    item-text="name"
                    item-value="id"
                    label="Status"
                    color="#93CB5B"
                    :items="[
                      { id: 1, name: 'Activate' },
                      { id: 0, name: 'Inactive' },
                    ]"
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
              color="#f5b027"
              class="white--text"
              v-if="action == 'Add'"
              @click="checkConflict('ADD')"
            >
              <v-icon>mdi-check-circle</v-icon>
              Add
            </v-btn>
            <v-btn
              color="#f5b027"
              class="white--text"
              v-if="action == 'Update'"
              @click="checkConflict('UPDATE')"
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
    <!-- schedule day of week  -->
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    data: null,
    action: null,
    grade: null,
  },
  data() {
    return {
      status: null,
      applicantNumber: null,
      seniorJunior: null,
      grade_level: null,
      subject_title: null,
      trackId: null,
      tracks_name: null,
      strand_name: null,
      trackList: [],
      year_fromList: [],
      dateFrom: null,
      dateTo: null,
      room_section: null,
      updateID: null,
      departmentData: null,
      officeData: null,
      menu: false,
      menu2: false,
      remarksData: [],
      confirmSubmissionDialog: false,
      submitBtnLoading: false,
      schedTimeDialog: false,
      schedDialog: false,
      schedList: [],
      schedTimeList: [],
      tempSelectedDays: [],
      school_year_to: null,
      school_year_from: null,
      dialog: false,
      timePicker1: null,
      timePicker2: null,
      yearSelection: [],
      confirmSubmit: {
        error: false,
        msg: null,
        type: null,
        show: false,
      },

      fadeAwayMessage: {
        show: false,
        type: "success",
        header: "Successfully Added!",
        message: "",
        top: 10,
      },
    };
  },

  computed: {},
  watch: {
    data: {
      handler(data) {
        this.dialog = true;
        if (data.id) {
          console.log("School Year", data);
          this.initialize();
          this.updateID = data.id;
          this.school_year_from = data.school_year_from;
          this.school_year_to = data.school_year_to;
          this.status = data.status;
        } else {
          this.$refs.AddSchoolYear.reset();
          this.initialize();
          this.school_year_from = data.school_year_from;
          this.school_year_to = data.school_year_to;
        }
      },
      deep: true,
    },
  },

  methods: {
    initialize() {
      this.getTrackList();
      this.loadYearFrom();
    },

    closeD() {
      this.confirmSubmissionDialog = false;
      this.confirmSubmit.type = null;
      this.confirmSubmit.error = false;
      this.confirmSubmit.msg = null;
      this.eventHub.$emit("closeAddSchoolYearDialog", false);
      this.dialog = false;
    },
    loadYearFrom() {
      // let d = new Date();

      // let yr = d.getFullYear();

      // for (let i = yr; i < yr + 10; i++) {
      //   this.year_fromList.push(i);
      // }
      this.year_fromList.push(new Date().getFullYear());
    },
    onChangeDateFrom(data) {
      this.school_year_to = data + 1;
    },

    checkConflict(type) {
      if (type == "ADD") {
        let data = {
          school_year_from: this.school_year_from,
          school_year_to: this.school_year_to,
        };
        // console.log(data);
        this.axiosCall("/enroll-student/addSchoolYear", "POST", data).then(
          (res) => {
            if (res.data.status == 201) {
              this.closeD();
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "success";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = "Successfully Added Subject!";
              location.reload();
            } else if (res.data.status == 400) {
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "error";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
            }
          }
        );
      } else if (type == "UPDATE") {
        // alert("UPDATED");

        let data = {
          school_year_from: this.school_year_from,
          school_year_to: this.school_year_to,
          status: this.status,
        };
        console.log(data);
        this.axiosCall(
          "/enroll-student/updateSchoolYear/" + this.updateID,
          "PATCH",
          data
        ).then((res) => {
          console.log(res.data);
          if (res.data.status == 200) {
            this.closeD();
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = "Successfully updated subject!";
          } else if (res.data.status == 400) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
          }
          location.reload();
        });
      }
    },

    async getTrackList() {
      this.axiosCall("/rooms-section/getAlltracks/Data/tracks", "GET").then(
        (res) => {
          this.trackList = res.data;
        }
      );
    },
  },
};
</script>
