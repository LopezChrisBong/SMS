<template>
  <div>
    <v-dialog v-model="dialog" eager persistent scrollable max-width="900px">
      <v-form ref="CoreTimeFormref" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>Core Time and Designation Approval</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="closeD()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 700px" class="my-4">
            <v-container>
              <v-row>
                <v-col cols="12" class=" pt-2 px-4">
                  <v-card>
                    <v-data-table
                      :headers="ctd_headers"
                      :items="schedList"
                      :items-per-page="8"
                      hide-default-footer
                    >
                      <template v-slot:[`item.schedTimeList`]="{ item }">
                        <div
                          class="d-flex justify-space-around pa-2"
                          v-for="(time, index) in item.schedTimeList"
                          :key="index"
                        >
                          <div style="width:40%">
                            {{ getPart(time.tapTimePartID) }}
                          </div>

                          <div style="width:40%">
                            {{ formatTime(time.timeFrom) }} -
                            {{ formatTime(time.timeTo) }}
                          </div>
                        </div>
                      </template>
                    </v-data-table>
                  </v-card>
                </v-col>
                <v-col cols="6" class=" pt-2 px-4 font-weight-medium">
                  Designation
                </v-col>
                <v-col cols="6" class=" pt-2 px-2 line_border">
                  {{ isDesignated ? designation : "N/A" }}
                </v-col>
                <v-col cols="6" class=" pt-2 px-4 font-weight-medium">
                  Office
                </v-col>
                <v-col cols="6" class=" pt-2 px-2 line_border">
                  {{ office_name }}
                </v-col>
                <v-col cols="6" class=" pt-2 px-4 font-weight-medium">
                  Units Deload
                </v-col>
                <v-col cols="6" class=" pt-2 px-2 line_border">
                  {{ isDesignated ? units : "N/A" }}
                </v-col>
                <v-col cols="6" class=" pt-2 px-4 font-weight-medium">
                  Special Order
                </v-col>
                <v-col cols="6" class=" pt-2 px-2 line_border">
                  {{ isDesignated ? specialOrderNo : "N/A" }}
                </v-col>
                <v-col cols="6" class=" pt-2 px-4 font-weight-medium">
                  Effectivity Date
                </v-col>
                <v-col cols="6" class=" pt-2 px-2 line_border">
                  {{ isDesignated ? formatDate(effectivityDate) : "N/A" }}
                </v-col>
                <v-col cols="6" class=" pt-2 px-4 font-weight-medium">
                  School Year
                </v-col>
                <v-col cols="6" class=" pt-2 px-2 line_border">
                  <!-- {{ getYear(schoolYearFrom) + " - " + getYear(schoolYearTo) }} -->
                  {{ schoolYear }}
                </v-col>
                <v-col cols="6" class=" pt-2 px-4 font-weight-medium">
                  Semester
                </v-col>
                <v-col cols="6" class=" pt-2 px-2 line_border">
                  {{
                    sem == 1
                      ? "First Semester"
                      : sem == 2
                      ? "Second Semester"
                      : "Summer"
                  }}
                </v-col>
                <v-col cols="6" class=" pt-2 px-4 font-weight-medium">
                  Status
                </v-col>
                <v-col cols="6" class=" pt-2 px-2 line_border">
                  {{ isActive }}
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions class="pa-5" v-if="action == 'for_approval'">
            <v-spacer></v-spacer>
            <v-btn
              color="#5a67da"
              class="white--text"
              @click="confirmDialogBtn('approve')"
            >
              Approve
            </v-btn>

            <v-btn
              color="#C62828"
              class="white--text"
              @click="confirmDialogBtn('pending')"
            >
              Pending
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <v-dialog v-model="confirmDialog" persistent max-width="290">
      <v-card color="white">
        <div class="pa-4 #3a3b3a--text">
          <div class="text-overline mb-1">WARNING!</div>
          <div class="text-body-1 mb-1">
            <p style="text-align: justify">
              <v-icon class="mt-n2" color="white">mdi-alert</v-icon> &nbsp; Are
              you sure you want to proceed?
            </p>
          </div>
        </div>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="confirmDialog = false">
            Close
          </v-btn>
          <v-btn color="green" class="white--text" @click="saveUpdate()">
            Confirm
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
    action: null,
  },
  data() {
    return {
      confirmDialog: false,
      confirmAction: null,
      schedDialog: false,
      schedTimeIn: null,
      schedTimeOut: null,
      schedWfh: null,
      schedAction: null,
      schedIndexToUpdate: null,
      schedList: [],
      dialog: false,
      id: null,
      isDesignated: null,
      wfh: null,
      name: null,
      empID: null,
      coreTimeFrom: null,
      coreTimeTo: null,
      designation: null,
      units: null,
      effectivityDate: null,
      specialOrderNo: null,
      assigned_office: null,
      office_name: null,
      schoolYear: null,
      // schoolYearTo: null,
      sem: null,
      isActive: null,

      ctd_headers: [
        {
          text: "Work Schedule",
          value: "workSched",
          align: "start",
        },
        { text: "Time Schedule/s", value: "schedTimeList", align: "center" },
      ],
      tapTimeList: [
        { id: 1, title: "First Part" },
        { id: 2, title: "Second Part" },
        { id: 3, title: "Overtime" },
      ],

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

        this.isDesignated = data.isDesignated;
        this.schedList = data.coreTimeSched ? data.coreTimeSched : [];
        this.id = data.id;
        this.name = data.name;
        this.empID = data.empID;
        this.designation = data.description;
        this.schoolYear = data.schoolYear;
        // this.schoolYearTo = data.schoolYearTo;
        this.sem = data.sem;
        this.units = data.units == 0 ? "0" : data.units;
        this.effectivityDate = data.effectivityDate;
        this.specialOrderNo = data.specialOrderNo;
        this.assigned_office = data.assigned_office;
        this.office_name = data.office_name;
        this.isActive = data.isActive ? "Active" : "Inactive";
      },
      deep: true,
    },
  },

  methods: {
    confirmDialogBtn(action) {
      this.confirmAction = action;
      this.confirmDialog = true;
    },
    getPart(id) {
      let prt;
      for (let i = 0; i < this.tapTimeList.length; i++) {
        if (this.tapTimeList[i].id == id) {
          prt = this.tapTimeList[i].title;
        }
      }
      return prt;
    },

    saveUpdate() {
      if (this.confirmAction == "approve") {
        this.approve();
        this.confirmDialog = false;
      } else if (this.confirmAction == "pending") {
        this.pending();
        this.confirmDialog = false;
      }
    },

    approve() {
      let data = {
        id: this.id,
        status: 2,
      };
      this.axiosCall(
        "/core-time-designation/update-ctd-approval",
        "POST",
        data
      ).then((res) => {
        if (res.data.status == 200) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
          this.closeD();
        } else if (res.data.status == 400) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
        }
      });
    },
    pending() {
      let data = {
        id: this.id,
        status: 3,
      };
      this.axiosCall(
        "/core-time-designation/update-ctd-approval",
        "POST",
        data
      ).then((res) => {
        if (res.data.status == 200) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
          this.closeD();
        } else if (res.data.status == 400) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
        }
      });
    },

    closeD() {
      this.eventHub.$emit("closeViewCTDApprovalDialog", false);
      this.dialog = false;
    },
  },
};
</script>
<style scoped>
.line_border {
  border-bottom: 1px solid darkgray;
}
</style>
