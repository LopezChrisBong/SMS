<template>
  <div>
    <v-dialog v-model="dialog" eager persistent scrollable fullscreen>
      <v-card>
        <v-card-title dark class="dialog-header pt-2 pb-2 pl-6">
          <span>Preview and Edit Service Record</span>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="closeD()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text style="max-height: 900px" class="my-4">
          <v-container>
            <v-row>
              <!-- <v-col cols="12">
                <img
                  src="../../../assets/img/HR.png"
                  alt=""
                  style="width:100%; height: 150px; "
                />
                <v-divider></v-divider>
                <h2
                  class="mt-2 d-flex justify-center black--text"
                  style="font-family:'Times New Roman'"
                >
                  SERVICE RECORD
                </h2>
              </v-col> -->

              <!-- <v-col cols="1">
                Name:
              </v-col>
              <v-col cols="8" class="d-flex">
                <div style="display:grid; width:30%" class="mr-1">
                  <div style="border-bottom:1px solid grey">asdasd</div>
                  <div>Surname</div>
                </div>
                <div style="display:grid; width:30%" class="mr-1">
                  <div style="border-bottom:1px solid grey">asdasd</div>
                  <div>Given Name</div>
                </div>
                <div style="display:grid; width:30%">
                  <div style="border-bottom:1px solid grey">asdasd</div>
                  <div>Middle Name</div>
                </div>
              </v-col>
              <v-col cols="3">
                ( If married woman, give also full maiden name )
              </v-col> -->
              <v-col cols="12">
                <table style="width:100%">
                  <tr>
                    <td width="7%" rowspan="2"><div>Name:</div></td>
                    <td width="15%">
                      <div style="border-bottom:1px solid grey ">
                        {{ lname }}
                      </div>
                      <div>Surname</div>
                    </td>
                    <td width="15%">
                      <div style="border-bottom:1px solid grey  ">
                        {{ fname }}
                      </div>
                      <div>Given Name</div>
                    </td>
                    <td width="15%">
                      <div style="border-bottom:1px solid grey ">
                        {{ mname }}
                      </div>
                      <div>Middle Name</div>
                    </td>
                    <td width="10%"></td>
                    <td width="38%" rowspan="2">
                      ( If married woman, give also full maiden name )
                    </td>
                  </tr>
                </table>
              </v-col>

              <v-col cols="12">
                <table>
                  <tr>
                    <td width="8%"><div>Birth:</div></td>
                    <td width="40%">
                      <div style="border-bottom:1px solid grey">
                        {{ formatDate(bdate) }}
                      </div>
                    </td>
                    <td width="10%"></td>
                    <td width="50%" rowspan="2">
                      (Date herein should be checked from birth or baptismal
                      certificate or some other reliable materials)
                    </td>
                  </tr>
                  <tr>
                    <td width="8%"><div>Place:</div></td>
                    <td width="40%">
                      <div style="border-bottom:1px solid grey">
                        {{ bplace }}
                      </div>
                    </td>
                    <td width="10%"></td>
                  </tr>
                </table>
              </v-col>

              <v-col cols="12"
                >This is to certify that the employee named hereabove actually
                renderd services in this Office as shown by the service record
                below, each line of which is supported by appointment and other
                papers issued by this Office and approved by the Authorities
                concerned.
              </v-col>

              <v-col cols="12">
                <div id="sr_table">
                  <table>
                    <tr>
                      <td
                        colspan="2"
                        class="font-14"
                        style="border-bottom: none;"
                        width="20%"
                      >
                        <span class="font-weight-bold">Service</span>
                      </td>
                      <td colspan="3" class="font-weight-bold" width="30%">
                        RECORD OF APPOINTMENT
                      </td>
                      <td class="font-weight-bold" width="30%">
                        OFFICE/ENTITY/DIVISION
                      </td>
                      <td width="10%" rowspan="3">Leave of absence w/o pay</td>
                      <td width="10%" rowspan="3">Remarks</td>
                      <td width="10%" rowspan="3">Action</td>
                    </tr>
                    <tr>
                      <td class="font-12" style="border-top: none;" colspan="2">
                        (Inclusive years)
                      </td>
                      <td rowspan="2">Designation</td>
                      <td rowspan="2">Status</td>
                      <td rowspan="2">Salary <br />(p.a)</td>
                      <td rowspan="2">Station/Place <br />of Employment</td>
                    </tr>
                    <tr>
                      <td>From</td>
                      <td>To</td>
                    </tr>
                    <tr v-for="(item, i) in serviceRecordData" :key="item.id">
                      <td>{{ formatDate4(item.date_from) }}</td>

                      <td>
                        {{
                          item.is_present_date_to
                            ? formatDate4(getDateToday)
                            : formatDate4(item.date_to)
                        }}
                      </td>
                      <td>{{ item.position }}</td>
                      <td>{{ item.appointment_status }}</td>
                      <td>
                        {{
                          item.appointment_status == "Coterminous" ||
                          item.appointment_status == "Job Order"
                            ? item.rate_per_day
                              ? formatPrice(item.rate_per_day) + "/day"
                              : ""
                            : formatPrice(computeAnnual(item.month_salary))
                        }}
                      </td>
                      <td>{{ item.company }}</td>
                      <td>none</td>
                      <td>{{ item.remarks }}</td>

                      <td>
                        <v-btn @click="editItem(i, item)"
                          ><v-icon color="#5a67da">mdi-pencil</v-icon></v-btn
                        >
                      </td>
                    </tr>
                    <tr>
                      <td colspan="9" align="center">
                        <i>(nothing follows)</i>
                      </td>
                    </tr>
                  </table>
                </div>

                <div>
                  Issued in compliance with Executive Order No. 54 dated August
                  10, 1954 and in accordance with Circular no. 58 dated August
                  10, 1954 of the System.
                </div>
              </v-col>
              <v-col cols="12" class="mt-5">
                <div class="d-flex" style="width:100%;">
                  <div style="width:50%">
                    <div style="display: grid; width:30%;">
                      <div class="font-12" style="visibility: hidden;">
                        XX
                      </div>
                      <br />
                      <br />
                      <div
                        style="text-align: center;border-bottom:1px solid black"
                      >
                        {{ formatDate4(getDateToday) }}
                      </div>
                      <div class="font-12" style="text-align: center;">
                        Date
                      </div>
                    </div>
                  </div>
                  <div style="display: grid; width:50%">
                    <div style="width:30%">
                      <div>Certified correct:</div>
                      <br />
                      <br />
                      <div
                        class="font-weight-bold"
                        style="border-bottom:1px solid  black"
                      >
                        {{
                          empStatus == 3 || empStatus == 5
                            ? "RAQUEL J. EDJEC"
                            : "REIR ERLINDA E. CUTAD"
                        }}
                      </div>
                      <div class="">
                        {{
                          empStatus == 3 || empStatus == 5
                            ? "Admin Officer V (HRMO III)"
                            : "VP Admin & Finance"
                        }}
                      </div>
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>

        <v-card-actions class="pa-5">
          <v-spacer></v-spacer>
          <!-- <v-btn
            color="#5a67da"
            class="white--text"
            @click="saveServiceRecord()"
          >
            <v-icon>mdi-printer</v-icon>
            Save
          </v-btn> -->
          <v-btn
            color="#5a67da"
            class="white--text"
            @click="printServiceRecord()"
          >
            <v-icon>mdi-printer</v-icon>
            Print
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="addRemarksDialog" persistent max-width="400">
      <v-card color="white">
        <v-form ref="RemarksFormref" @submit.prevent>
          <v-card-title dark class="dialog-header pt-2 pb-2 pl-6">
            <span>Add Remarks</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="addRemarksDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 400px" class="my-4"> </v-card-text>
          <v-container>
            <v-row>
              <!-- <v-col cols="12" v-if="isSalaryEditable">
                <v-text-field
                  v-model="salary"
                  :rules="isSalaryEditable ? [formRules.required] : []"
                  dense
                  label="Salary"
                  outlined
                  required
                  class="rounded-lg"
                  color="#6DB249"
                ></v-text-field>
              </v-col> -->
              <v-col cols="12">
                <v-text-field
                  v-model="remarks"
                  :rules="[formRules.required]"
                  dense
                  label="Remarks"
                  outlined
                  required
                  class="rounded-lg"
                  color="#6DB249"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" outlined @click="addRemarksDialog = false">
              Close
            </v-btn>
            <v-btn color="green" class="white--text" @click="saveUpdate()">
              Save
            </v-btn>
          </v-card-actions>
        </v-form>
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
      addRemarksDialog: false,
      dialog: false,
      id: null,
      fname: null,
      mname: null,
      lname: null,
      bdate: null,
      bplace: null,
      requestorID: null,
      date_requested: null,
      docu_req_from: null,
      docu_req_to: null,
      empStatus: null,
      remarks: null,
      salary: null,
      isSalaryEditable: false,
      serviceRecordData: [],

      indexToUpdate: null,
      fadeAwayMessage: {
        show: false,
        type: "success",
        header: "Successfully Added!",
        message: "",
        top: 10,
      },
    };
  },
  computed: {
    getDateToday() {
      let d = new Date();
      let date =
        d.getFullYear() +
        "-" +
        (d.getMonth() + 1 <= 9 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1) +
        "-" +
        d.getDate();
      return date;
      // return moment(date).format("YY/MM/DD");
    },
  },
  watch: {
    data: {
      handler(data) {
        this.dialog = true;
        console.log(data);
        this.id = data.id;
        this.fname = data.fname;
        this.mname = data.mname;
        this.lname = data.lname;
        this.getBdateBplace(data.id);
        this.docu_req_from = data.date_from ? data.date_from : null;
        this.docu_req_to = data.date_to ? data.date_to : null;

        this.loadServiceRecord();
        this.getEmploymentStatus();
      },
      deep: true,
    },
  },

  methods: {
    computeAnnual(value) {
      var annual = 0;
      for (let index = 0; index < 12; index++) {
        annual += parseFloat(value);
      }
      return annual;
    },
    confirmDialogBtn(action) {
      this.confirmAction = action;
      this.confirmDialog = true;
    },

    loadServiceRecord() {
      if (this.docu_req_from && this.docu_req_to) {
        this.axiosCall(
          "/work-experience/getServiceRecord/" +
            this.id +
            "?from=" +
            this.docu_req_from +
            "&to=" +
            this.docu_req_to,
          "GET"
        ).then((res) => {
          if (res) {
            console.log(res.data);
            this.serviceRecordData = res.data;
          }
        });
      } else {
        this.axiosCall(
          "/work-experience/getServiceRecord/" + this.id,
          "GET"
        ).then((res) => {
          if (res) {
            console.log(res.data);
            this.serviceRecordData = res.data;
          }
        });
      }
    },

    getEmploymentStatus() {
      this.axiosCall("/employee/getEmploymentStatus/" + this.id, "GET").then(
        (res) => {
          if (res) {
            this.empStatus = res.data.positionID;
          }
        }
      );
    },

    getBdateBplace(id) {
      this.axiosCall("/user-details/getBdateBplace/" + id, "GET").then(
        (res) => {
          if (res.data) {
            console.log(res.data);
            this.bdate = res.data.bdate;
            this.bplace = res.data.bplace;
          }
        }
      );
    },

    printServiceRecord() {
      let data = {
        date_to: this.date_to ? this.date_to : null,
        date_from: this.date_from ? this.date_from : null,
        user_detailID: this.id,
        json_data: this.serviceRecordData,
      };
      this.axiosCall("/generated-service-record", "POST", data).then((res) => {
        if (res) {
          if (res.data.status == 201 || res.data.status == 200)
            console.log(res.data);
          this.serviceRecordData = res.data.records.json_data;
          let url =
            process.env.VUE_APP_SERVER +
            "/pdf-generator/printServiceRecord/" +
            res.data.records.id;
          window.open(url);
        }
      });
    },

    editItem(index, item) {
      this.addRemarksDialog = true;
      this.remarks = item.remarks;
      // if (
      //   item.appointment_status == "Casual" ||
      //   item.appointment_status == "Job Order"
      // ) {
      //   this.isSalaryEditable = true;
      // } else {
      //   this.isSalaryEditable = false;
      // }

      this.indexToUpdate = index;
      this.$refs.RemarksFormref.reset();
      console.log(index, item);
    },

    saveUpdate() {
      if (this.$refs.RemarksFormref.validate()) {
        this.serviceRecordData[this.indexToUpdate].remarks = this.remarks;
        this.serviceRecordData[this.indexToUpdate].rate_per_day = this.salary;
        this.addRemarksDialog = false;
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
      this.eventHub.$emit("closeViewPreviewServiceRecordDialog", false);
      this.dialog = false;
    },
  },
};
</script>
<style scoped>
.line_border {
  border-bottom: 1px solid darkgray;
}
#sr_table table,
#sr_table td {
  border-collapse: collapse !important;
  border: 1px solid black;
  text-align: center;
}
</style>
