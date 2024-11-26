<template>
  <div>
    <v-dialog v-model="dialog" eager persistent scrollable max-width="900px">
      <v-form ref="CoreTimeFormref" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>Core Time Approval</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="closeD()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 700px" class="my-4">
            <v-container>
              <v-row>
                <v-col cols="6" class=" pt-2 px-4 font-weight-medium">
                  Name
                </v-col>
                <v-col cols="6" class=" pt-2 px-2 line_border">
                  {{ name }}
                </v-col>
                <v-col cols="6" class=" pt-2 px-4 font-weight-medium">
                  Academic Year/Calendar Year
                </v-col>
                <v-col cols="6" class=" pt-2 px-2 line_border">
                  <!-- {{ getYear(schoolYearFrom) + " - " + getYear(schoolYearTo) }} -->
                  {{
                    cyFrom && cyTo
                      ? formatDate(cyFrom) + " - " + formatDate(cyTo)
                      : ""
                  }}
                </v-col>
                <v-col cols="6" class=" pt-2 px-4 font-weight-medium">
                  Semester
                </v-col>
                <v-col cols="6" class=" pt-2 px-2 line_border">
                  {{
                    ctType == 1
                      ? sem == 1
                        ? "First Semester"
                        : sem == 2
                        ? "Second Semester"
                        : "Summer"
                      : "N/A"
                  }}
                </v-col>
                <v-col cols="6" class=" pt-2 px-4 font-weight-medium">
                  Status
                </v-col>
                <v-col cols="6" class=" pt-2 px-2 line_border">
                  {{ isActive }}
                </v-col>
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
                          <div style="width:25%">
                            {{ getPart(time.tapTimePartID) }}
                          </div>

                          <div style="width:75%">
                            {{ formatTime(time.timeFrom) }} -
                            {{ formatTime(time.timeTo) }}
                          </div>
                        </div>
                      </template>
                    </v-data-table>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions class="pa-5" v-if="action == 'for_approval'">
            <v-spacer></v-spacer>
            <v-btn
              :color="$vuetify.theme.themes.light.submitBtns"
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
    <!-- confirmation pending-->
    <v-dialog v-model="confirmDialog" persistent max-width="390">
      <v-card color="white">
        <div class="pa-4 #3a3b3a--text">
          <div class="text-h6 mb-1">WARNING!</div>
          <div class="text-body-1 mb-1" v-if="confirmAction == 'approve'">
            <p style="text-align: justify">
              <v-icon class="mt-n2" color="white">mdi-alert</v-icon> &nbsp; Are
              you sure you want to <b>APPROVE</b> this core-time?
            </p>
          </div>

          <div class="text-body-1 mb-1" v-if="confirmAction == 'pending'">
            <p style="text-align: justify">
              <v-icon class="mt-n2" color="white">mdi-alert</v-icon> &nbsp; Are
              you sure you want to <b>PENDING</b> this core-time?
            </p>
          </div>
        </div>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="confirmDialog = false">
            Close
          </v-btn>
          <v-btn
            v-if="confirmAction == 'approve'"
            color="green"
            class="white--text"
            @click="approve()"
          >
            Confirm
          </v-btn>
          <v-btn
            v-if="confirmAction == 'pending'"
            color="green"
            class="white--text"
            @click="openPending()"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- pending input dialog -->
    <v-dialog v-model="pendingDialog" persistent max-width="500">
      <v-form ref="pendingFormRef" @submit.prevent>
        <v-card color="white">
          <v-card-title dark>
            <span>Pending Message</span>
            <v-spacer></v-spacer>
          </v-card-title>
          <v-card-text>
            <v-textarea
              outlined
              :rules="[formRules.required]"
              dense
              color="#519043"
              v-model="pendingMsg"
              placeholder="Type here...."
              rows="5"
            ></v-textarea>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" outlined @click="pendingDialog = false">
              Close
            </v-btn>
            <v-btn color="green" class="white--text" @click="confirmPending()">
              Save
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
  },
  data() {
    return {
      confirmDialog: false,
      confirmAction: null,
      pendingDialog: false,
      pendingMsg: null,
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
      ctType: null,
      cyFrom: null,
      cyTo: null,
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
        console.log("adss", data);

        this.schedList = data.coreTimeSched ? data.coreTimeSched : [];
        this.id = data.id;
        this.name = data.name;
        this.ctType = data.ctType;
        this.cyFrom = data.cyFrom;
        this.cyTo = data.cyTo;
        this.schoolYear = data.SY;
        // this.schoolYearTo = data.schoolYearTo;
        this.sem = data.sem;

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
      this.axiosCall("/my-core-time/update-status", "POST", data).then(
        (res) => {
          if (res.data.status == 200) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.confirmAction = null;
            this.confirmDialog = false;
            this.closeD();
          } else if (res.data.status == 400) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
          }
        }
      );
    },

    openPending() {
      this.confirmDialog = false;
      this.pendingDialog = true;
    },

    confirmPending() {
      if (this.$refs.pendingFormRef.validate()) {
        let data = {
          id: this.id,
          status: 3,
          remarks: this.pendingMsg,
        };
        this.axiosCall("/my-core-time/update-status", "POST", data).then(
          (res) => {
            if (res.data.status == 200) {
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "success";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
              this.pendingMsg = null;
              this.pendingDialog = false;
              this.closeD();
            } else if (res.data.status == 400) {
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "error";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
            }
          }
        );
      }
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
      this.eventHub.$emit("closeCoreTimeApprovalDialog", false);
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
