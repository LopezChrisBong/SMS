<template>
  <div>
    <v-dialog
      v-model="dialog"
      eager
      scrollable
      persistent
      max-width="800px"
      transition="dialog-bottom-transition"
    >
      <v-form ref="ILDPApprovalFormref" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span
              >{{ tab == 1 ? "Request For Document" : "Released Document" }}
            </span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="closeD()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 800px" class="my-4">
            <v-row>
              <v-col cols="6"></v-col>
              <v-col cols="6" class="d-flex justify-end">
                <v-row>
                  <v-col cols="6"> Control Number :</v-col>
                  <v-col cols="6"
                    ><div
                      class="line_border"
                      :class="control_num ? '' : 'mt-5'"
                    >
                      {{ control_num }}
                    </div></v-col
                  >
                </v-row>
              </v-col>
              <v-col cols="6">
                <v-row>
                  <v-col cols="4"> Date of Request: </v-col>
                  <v-col cols="8"
                    ><div class="line_border">
                      {{ formatDate(date_requested) }}
                    </div></v-col
                  >
                </v-row>
              </v-col>
              <v-col cols="6">
                <v-row>
                  <v-col cols="4"> Time :</v-col>
                  <v-col cols="8"
                    ><div class="line_border">{{ time_requested }}</div></v-col
                  >
                </v-row>
              </v-col>
              <v-col cols="12"
                ><v-row>
                  <v-col cols="4">Name of Requestor:</v-col>
                  <v-col cols="8"
                    ><div class="line_border" :class="requestor ? '' : 'mt-5'">
                      {{ requestor }}
                    </div></v-col
                  >
                </v-row>
              </v-col>
              <v-col cols="12"
                ><v-row>
                  <v-col cols="4">Office: </v-col>
                  <v-col cols="8"
                    ><div class="line_border" :class="office ? '' : 'mt-5'">
                      {{ office }}
                    </div></v-col
                  >
                </v-row>
              </v-col>
              <v-col cols="12"
                ><v-row>
                  <v-col cols="4">Designation: </v-col>
                  <v-col cols="8"
                    ><div
                      class="line_border"
                      :class="designation ? '' : 'mt-5'"
                    >
                      {{ designation }}
                    </div></v-col
                  >
                </v-row>
              </v-col>
              <v-col cols="12">
                <v-row>
                  <v-col cols="4">Contact Number: </v-col>
                  <v-col cols="8"
                    ><div
                      class="line_border"
                      :class="contact_num ? '' : 'mt-5'"
                    >
                      {{ contact_num }}
                    </div></v-col
                  >
                </v-row>
              </v-col>
              <v-col cols="12">
                <v-row>
                  <v-col cols="4"> Requested Documents: </v-col>
                  <v-col cols="8"
                    ><div class="line_border">
                      {{ getDocumentRequestType(document_requested_id) }}
                      {{
                        document_requested_id == 1 || document_requested_id == 3
                          ? "(" +
                            formatDate(docu_req_from) +
                            " - " +
                            formatDate(docu_req_to) +
                            ")"
                          : ""
                      }}
                    </div></v-col
                  >
                </v-row>
              </v-col>
              <v-col cols="12">
                <v-row>
                  <v-col cols="4">Purpose(s):</v-col>
                  <v-col cols="8"
                    ><div class="line_border" :class="purpose ? '' : 'mt-5'">
                      {{ purpose }}
                    </div></v-col
                  >
                </v-row>
              </v-col>
              <v-col cols="12">
                <v-row>
                  <v-col cols="4"> Remarks: </v-col>
                  <v-col cols="8"
                    ><div class="line_border" :class="remarks ? '' : 'mt-5'">
                      {{ remarks }}
                    </div></v-col
                  >
                </v-row>
              </v-col>
              <v-col cols="12">
                <v-row>
                  <v-col cols="4">Signature of Requestor: </v-col>
                  <v-col cols="8"
                    ><div class="line_border mt-5"></div
                  ></v-col> </v-row
                ><span></span>
              </v-col>
              <v-col cols="12">
                <v-row>
                  <v-col cols="4">Date Prepared:</v-col>
                  <v-col cols="8"
                    ><div
                      class="line_border"
                      :class="date_prepared ? '' : 'mt-5'"
                    >
                      {{ date_prepared }}
                    </div></v-col
                  >
                </v-row>
                <span></span>
              </v-col>
              <v-col cols="12">
                <v-row>
                  <v-col cols="4"> Date Claimed/Signature:</v-col>
                  <v-col cols="8"
                    ><div
                      class="line_border"
                      :class="date_claimed ? '' : 'mt-5'"
                    >
                      {{ date_claimed }}
                    </div></v-col
                  >
                </v-row>
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

            <v-btn color="#519043" @click="preview()" class="white--text">
              Preview and Edit
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <ViewPreviewServiceRecordDialog :data="dataToEdit" />
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
import ViewPreviewServiceRecordDialog from "./ViewPreviewServiceRecordDialog.vue";
export default {
  props: {
    data: null,
    action: null,
    toApproveType: null,
    tab: null,
  },
  components: {
    ViewPreviewServiceRecordDialog,
  },
  data() {
    return {
      dataToEdit: [],
      dialog: false,
      id: null,
      date_requested: null,
      time_requested: null,
      requestor: null,
      requestorID: null,
      control_num: null,
      office: null,
      designation: null,
      contact_num: null,
      document_requested_id: null,
      docu_req_from: null,
      docu_req_to: null,
      purpose: null,
      remarks: null,
      date_prepared: null,
      date_claimed: null,
      request_docu_others: null,
      requestsList: [
        {
          id: 1,
          type: "Service Record",
        },
        {
          id: 2,
          type: "Certificate of Employment",
        },
        {
          id: 3,
          type: "Certificate of Leave Credits",
        },
        {
          id: 4,
          type: "Certification of No Pending Administrative/Criminal Case/s",
        },
        {
          id: 5,
          type:
            "Certificate of Income Derived from Salary, Pera, ADCOM and Others",
        },
        {
          id: 6,
          type: "Pay slip / Certification of Net pay",
        },
        {
          id: 7,
          type: "Others: Please specify",
        },
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
  mounted() {
    this.eventHub.$on("closeViewPreviewServiceRecordDialog", () => {
      this.initialize(this.id);
    });
  },
  beforeDestroy() {
    this.eventHub.$off("closeViewPreviewServiceRecordDialog");
  },
  watch: {
    data: {
      handler(data) {
        this.dialog = true;

        if (data.id) {
          this.id = data.id;
          console.log(data);
          this.formatYearData(data.yearFrom, data.yearTo);
          this.initialize(data.id);
        }
      },
      deep: true,
    },
  },
  methods: {
    initialize(id) {
      this.axiosCall(
        "/document-requests/getRequestedDocument/" + id,
        "GET"
      ).then((res) => {
        if (res.data) {
          console.log(res.data);
          this.id = res.data.id;
          this.date_requested = res.data.created_at;
          this.time_requested = res.data.time_requested;
          this.requestorID = res.data.requestorID;
          this.requestor = res.data.requestor;
          this.control_num = res.data.control_num;
          this.office = res.data.office;
          this.designation = res.data.designation;
          this.contact_num = res.data.contact_num;
          this.document_requested_id = res.data.document_requested_id;
          this.docu_req_from = res.data.docu_req_from;
          this.docu_req_to = res.data.docu_req_to;
          this.purpose = res.data.purpose;
          this.remarks = res.data.remarks;
          this.date_prepared = res.data.date_prepared;
          this.date_claimed = res.data.date_claimed;
          this.request_docu_others = res.data.request_docu_others;
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

    getDocumentRequestType(id) {
      for (let i = 0; i < this.requestsList.length; i++) {
        const element = this.requestsList[i];
        if (element.id == id) {
          return element.type;
        }
      }
    },

    formatYearData(from, to) {
      this.years = [];
      for (let i = parseInt(from); i <= parseInt(to); i++) {
        this.years.push(i);
      }
    },

    preview() {
      this.dataToEdit = [
        {
          id: this.id,
          requestorID: this.requestorID,
          date_requested: this.date_requested,
          docu_req_from: this.docu_req_from,
          docu_req_to: this.docu_req_to,
        },
      ];
    },

    print() {
      const url =
        process.env.VUE_APP_SERVER +
        "/pdf-generator/printServiceRecord/" +
        this.requestorID;
      window.open(url);
    },

    closeD() {
      this.eventHub.$emit("closeViewDocumentRequest", false);
      this.dialog = false;
    },

    receive() {
      let data = {
        status: 1,
        id: this.id,
      };
      this.axiosCall("/my-ildp/approval/hr", "POST", data).then((res) => {
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
  },
};
</script>

<style scoped>
.line_border {
  border-bottom: 1px solid gray;
}
</style>
