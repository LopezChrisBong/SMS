<template>
  <div>
    <v-dialog v-model="dialog" scrollable max-width="700px">
      <v-card>
        <v-card-title dark class="dialog-header">
          Request for Documents
          <v-spacer></v-spacer>
          <v-btn icon dark @click="close()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-col> </v-col>
        <v-card-text style="max-height: 800px">
          <v-form ref="MyRequestsFormref" @submit.prevent>
            <v-container>
              <v-row>
                <v-col cols="12" class="py-2 d-flex justify-end">
                  <v-autocomplete
                    outlined
                    dense
                    v-model="requestModel.reqType"
                    :rules="[formRules.required]"
                    label="Document Request Type"
                    :items="requestTypeList"
                    item-text="type"
                    item-value="id"
                    required
                    class="rounded-lg"
                    color="#6DB249"
                    small-chips
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" class="py-2 d-flex justify-end">
                  <v-autocomplete
                    outlined
                    dense
                    v-model="requestModel.officeID"
                    :rules="[formRules.required]"
                    label="Office"
                    :items="officeList"
                    item-text="name"
                    item-value="id"
                    required
                    class="rounded-lg"
                    color="#6DB249"
                    small-chips
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" class="py-2 d-flex justify-end">
                  <v-autocomplete
                    outlined
                    dense
                    v-model="requestModel.designationID"
                    :rules="[formRules.required]"
                    label="Designation"
                    :items="designationList"
                    item-text="description"
                    item-value="id"
                    required
                    class="rounded-lg"
                    color="#6DB249"
                    small-chips
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" class="py-0">
                  <v-text-field
                    v-model="requestModel.contact_num"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    label="Contact Number"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" class="py-2 d-flex justify-end">
                  <v-autocomplete
                    outlined
                    v-model="requestModel.document_requested_id"
                    dense
                    :rules="[formRules.required]"
                    label="Requested Documents"
                    :items="
                      requestModel.reqType == 1
                        ? request201FileList
                        : requestsList
                    "
                    item-text="type"
                    item-value="id"
                    required
                    class="rounded-lg"
                    color="#6DB249"
                    small-chips
                  ></v-autocomplete>
                </v-col>

                <v-col
                  cols="6"
                  class="py-0"
                  v-if="
                    requestModel.reqType == 2 &&
                      (requestModel.document_requested_id == 1 ||
                        requestModel.document_requested_id == 3)
                  "
                >
                  <v-menu
                    ref="dateFromRef"
                    :close-on-content-click="false"
                    :return-value.sync="requestModel.docu_req_from"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        color="#6DB249"
                        dense
                        v-model="requestModel.docu_req_from"
                        :rules="
                          requestModel.reqType == 2 &&
                          (requestModel.document_requested_id == 1 ||
                            requestModel.document_requested_id == 3)
                            ? [formRules.required]
                            : []
                        "
                        chips
                        small-chips
                        label="Date from"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="requestModel.docu_req_from"
                      no-title
                      scrollable
                      color="#6DB249"
                    >
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        color="#6DB249"
                        @click="
                          $refs.dateFromRef.save(requestModel.docu_req_from)
                        "
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col
                  cols="6"
                  class="py-0"
                  v-if="
                    requestModel.reqType == 2 &&
                      (requestModel.document_requested_id == 1 ||
                        requestModel.document_requested_id == 3)
                  "
                >
                  <v-menu
                    ref="dateToRef"
                    :close-on-content-click="false"
                    :return-value.sync="requestModel.docu_req_to"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        color="#6DB249"
                        dense
                        v-model="requestModel.docu_req_to"
                        :rules="
                          requestModel.reqType == 2 &&
                          (requestModel.document_requested_id == 1 ||
                            requestModel.document_requested_id == 3)
                            ? [formRules.required]
                            : []
                        "
                        chips
                        small-chips
                        label="Date To"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="requestModel.docu_req_to"
                      no-title
                      scrollable
                      color="#6DB249"
                    >
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        color="#6DB249"
                        @click="$refs.dateToRef.save(requestModel.docu_req_to)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>

                <v-col cols="12" class="py-0">
                  <v-textarea
                    :rules="[formRules.required]"
                    v-model="requestModel.purpose"
                    dense
                    outlined
                    required
                    label="Purpose(s)"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-textarea>
                </v-col>

                <v-col cols="12" class="py-0" v-if="requestModel.reqType == 1">
                  <v-text-field
                    :rules="
                      requestModel.reqType == 1 ? [formRules.required] : []
                    "
                    dense
                    outlined
                    required
                    label="Number of Copies needed"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" class="py-0" v-if="requestModel.reqType == 1">
                  <v-menu
                    ref="dateNeededRef"
                    :close-on-content-click="false"
                    :return-value.sync="requestModel.docu_req_from"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        color="#6DB249"
                        dense
                        v-model="requestModel.docu_req_from"
                        :rules="
                          requestModel.reqType == 1 ? [formRules.required] : []
                        "
                        chips
                        small-chips
                        label="Date needed"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="requestModel.docu_req_from"
                      no-title
                      scrollable
                      color="#6DB249"
                    >
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        color="#6DB249"
                        @click="
                          $refs.dateNeededRef.save(requestModel.docu_req_from)
                        "
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <!-- <v-col cols="12" class="py-0">
                  <v-textarea
                    :rules="[formRules.required]"
                    readonly
                    dense
                    outlined
                    required
                    label="Remarks"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-textarea>
                </v-col> -->
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-5">
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="close()">
            <v-icon>mdi-close-circle-outline</v-icon>
            Close
          </v-btn>
          <v-btn
            color="#5a67da"
            class="white--text"
            v-if="(tab == 1 || tab == 2) && action == 'Add'"
            @click="add()"
          >
            <v-icon>mdi-check-circle</v-icon>
            Send Request
          </v-btn>
          <v-btn
            color="#5a67da"
            class="white--text"
            v-if="tab == 1 && action == 'Update'"
            @click="edit()"
          >
            <v-icon>mdi-check-circle</v-icon>
            Update
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
    tab: null,
  },
  data() {
    return {
      dialog: false,
      requestModel: {
        id: null,
        reqType: null,
        date_requested: null,
        time_requested: null,
        requestor: null,
        controll_num: null,
        officeID: null,
        designationID: null,
        contact_num: null,
        document_requested_id: null,
        docu_req_from: null,
        docu_req_to: null,
        purpose: null,
        remarks: null,
        date_prepared: null,
        date_claimed: null,
        request_docu_others: null,
      },
      officeList: [],
      designationList: [],
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
      request201FileList: [
        {
          id: 1,
          type: "PDS",
        },
        {
          id: 2,
          type: "PDF",
        },
        {
          id: 3,
          type: "CSC Appointment Form",
        },
        {
          id: 4,
          type: "Credentials(TOR, Diploma)",
        },
        {
          id: 5,
          type: "Others: Please specify",
        },
      ],
      requestTypeList: [
        {
          id: 1,
          type: "Personal Files",
        },
        {
          id: 2,
          type: "HR Records",
        },
      ],
      selected: 1,
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
          console.log(data);
          this.dialog = true;
          if (data.id != null) {
            this.requestModel.id = data.id;
            this.requestModel.officeID = data.officeID;
            this.requestModel.designationID = data.designationID;
            this.requestModel.contact_num = data.contact_num;
            this.requestModel.document_requested_id =
              data.document_requested_id;
            this.requestModel.docu_req_from = data.docu_req_from;
            this.requestModel.docu_req_to = data.docu_req_to;
            this.requestModel.purpose = data.purpose;
            this.requestModel.reqType = data.reqType;
          }
          this.initialize();
        }
      },
      deep: true,
    },
  },
  methods: {
    initialize() {
      this.getDesignations();
      this.getOffices();
    },
    close() {
      this.dialog = false;
      this.$refs.MyRequestsFormref.reset();
      this.eventHub.$emit("closeMyRequestsDialog", false);
    },
    getDirectHead() {
      this.axiosCall("/my-direct-head/getMyDirectHead", "GET").then((res) => {
        if (res.data) {
          this.locatorModel.approvedBy = res.data[0].name;
          this.locatorModel.approvedByID = res.data[0].userID;
        }
      });
    },

    getOffices() {
      this.axiosCall("/offices", "GET").then((res) => {
        this.officeList = res.data;
      });
    },

    getDesignations() {
      this.axiosCall("/designations", "GET").then((res) => {
        this.designationList = res.data;
      });
    },

    add() {
      if (this.$refs.MyRequestsFormref.validate()) {
        let data = {
          officeID: this.requestModel.officeID,
          designationID: this.requestModel.designationID,
          contact_num: this.requestModel.contact_num,
          document_requested_id: this.requestModel.document_requested_id,
          docu_req_from: this.requestModel.docu_req_from,
          docu_req_to: this.requestModel.docu_req_to,
          request_docu_others: this.requestModel.request_docu_others,
          purpose: this.requestModel.purpose,
          reqType: this.requestModel.reqType,
        };
        this.axiosCall("/document-requests", "POST", data).then((res) => {
          if (res.data.status == 201) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.message = res.data.msg;
            this.fadeAwayMessage.header = "System Message";
            this.close();
            // this.$emit("reloadTable");
          } else if (res.data.status == 400) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.close();
            // this.$emit("reloadTable");
          }
        });
      }
    },

    edit() {
      if (this.$refs.MyRequestsFormref.validate()) {
        let data = {
          officeID: this.requestModel.officeID,
          designationID: this.requestModel.designationID,
          contact_num: this.requestModel.contact_num,
          document_requested_id: this.requestModel.document_requested_id,
          docu_req_from: this.requestModel.docu_req_from,
          docu_req_to: this.requestModel.docu_req_to,
          request_docu_others: this.requestModel.request_docu_others,
          purpose: this.requestModel.purpose,
          reqType: this.requestModel.reqType,
        };
        this.axiosCall(
          "/document-requests/" + this.requestModel.id,
          "PATCH",
          data
        ).then((res) => {
          if (res.data.status == 200) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.message = res.data.msg;
            this.fadeAwayMessage.header = "System Message";
            this.close();
            // this.$emit("reloadTable");
          } else if (res.data.status == 400) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.close();
            // this.$emit("reloadTable");
          }
        });
      }
    },
  },
};
</script>
