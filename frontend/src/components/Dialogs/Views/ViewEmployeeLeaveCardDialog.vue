<template>
  <div>
    <v-dialog v-model="dialog" eager persistent scrollable fullscreen>
      <v-card>
        <v-card-title dark class="dialog-header pt-2 pb-2 pl-6">
          <span>Employee Leave Card</span>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="closeD()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text style="max-height: 900px" class="my-4">
          <v-container>
            <v-row>
              <v-col cols="12"
                ><div class="d-flex">
                  <div style="width:20%" class="text-subtitle-1">Name:</div>

                  <div
                    style="width:80%"
                    class="text-subtitle-1 font-weight-bold"
                  >
                    {{ name }}
                  </div>
                </div>
              </v-col>
              <!-- <v-col cols="6"
                ><div class="d-flex">
                  <div style="width:20%" class="text-subtitle-1">Name:</div>

                  <div style="width:80%" class="text-subtitle-1">
                    {{ name }}
                  </div>
                </div>
              </v-col> -->
              <v-col cols="12">
                <table class="table mt-5 mx-2">
                  <thead>
                    <tr>
                      <th
                        align="center"
                        class="text-caption px-4 font-weight-bold py-2"
                        rowspan="2"
                        colspan="2"
                      >
                        Period
                      </th>
                      <th
                        align="center"
                        class="text-caption font-weight-bold py-2"
                        colspan="2"
                      >
                        Particulars
                      </th>
                      <th
                        align="center"
                        class="text-caption font-weight-bold py-2"
                        colspan="4"
                      >
                        Vacation Leave
                      </th>
                      <th
                        align="center"
                        class="text-caption font-weight-bold py-2"
                        colspan="4"
                      >
                        Sick Leave
                      </th>
                      <th
                        align="center"
                        class="text-caption font-weight-bold py-2"
                        rowspan="2"
                      >
                        Total
                      </th>
                      <th
                        align="center"
                        class="text-caption font-weight-bold py-2"
                        rowspan="2"
                      >
                        Date Filed
                      </th>
                      <th
                        align="center"
                        class="text-caption font-weight-bold py-2"
                        rowspan="2"
                      >
                        Remarks
                      </th>
                      <th
                        v-if="toEdit"
                        align="center"
                        class="text-caption font-weight-bold py-2"
                        rowspan="2"
                      >
                        Action
                      </th>
                    </tr>
                    <tr>
                      <th
                        align="center"
                        class="text-caption font-weight-bold py-1"
                      >
                        Type
                      </th>
                      <th
                        align="center"
                        class="text-caption font-weight-bold py-1"
                      >
                        Days
                      </th>
                      <th
                        align="center"
                        class="text-caption font-weight-bold py-1"
                      >
                        Earned
                      </th>
                      <th
                        align="center"
                        class="text-caption font-weight-bold py-1"
                      >
                        Abs.<br />
                        W/P
                      </th>
                      <th
                        align="center"
                        class="text-caption font-weight-bold py-1"
                      >
                        Bal.
                      </th>
                      <th
                        align="center"
                        class="text-caption font-weight-bold py-1"
                      >
                        Abs.<br />
                        W/OP
                      </th>
                      <th
                        align="center"
                        class="text-caption font-weight-bold py-1"
                      >
                        Earned
                      </th>
                      <th
                        align="center"
                        class="text-caption font-weight-bold py-1"
                      >
                        Abs.<br />
                        W/P
                      </th>
                      <th
                        align="center"
                        class="text-caption font-weight-bold py-1"
                      >
                        Bal.
                      </th>

                      <th
                        align="center"
                        class="text-caption font-weight-bold py-1"
                      >
                        Abs.<br />
                        W/OP
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, i) in leave_card_data" :key="i">
                      <td align="left" class="text-caption pa-2 ">
                        {{ item.period_earned }}
                      </td>
                      <td align="center" class="text-caption pa-2 ">
                        {{ item.period }}
                      </td>
                      <td
                        :colspan="item.type == 'Balance Forwarded' ? 2 : 1"
                        align="center"
                        class="text-caption py-2"
                      >
                        {{ item.type }}
                      </td>
                      <td
                        v-if="item.type != 'Balance Forwarded'"
                        align="center"
                        class="text-caption py-2"
                      >
                        {{ item.days }}
                      </td>
                      <td align="center" class="text-caption py-2">
                        {{
                          item.vl_earned
                            ? formatNumberValue(item.vl_earned, 3)
                            : item.vl_earned
                        }}
                      </td>
                      <td align="center" class="text-caption py-2">
                        {{ item.vl_auwp }}
                      </td>
                      <td align="center" class="text-caption py-2">
                        {{
                          item.vl_bal
                            ? formatNumberValue(item.vl_bal, 3)
                            : item.vl_bal
                        }}
                      </td>
                      <td align="center" class="text-caption py-2">
                        {{ item.vl_auwop }}
                      </td>
                      <td align="center" class="text-caption py-2">
                        {{
                          item.sl_earned
                            ? formatNumberValue(item.sl_earned, 3)
                            : item.sl_earned
                        }}
                      </td>
                      <td align="center" class="text-caption py-2">
                        {{ item.sl_auwp }}
                      </td>
                      <td align="center" class="text-caption py-2">
                        {{
                          item.sl_bal
                            ? formatNumberValue(item.sl_bal, 3)
                            : item.sl_bal
                        }}
                      </td>
                      <td align="center" class="text-caption py-2">
                        {{ item.sl_auwop }}
                      </td>
                      <td align="center" class="text-caption py-2">
                        {{
                          item.total
                            ? formatNumberValue(item.total, 3)
                            : item.total
                        }}
                      </td>
                      <td align="center" class="text-caption py-2">
                        {{ item.date_filed ? formatDate(item.date_filed) : "" }}
                      </td>
                      <td align="center" class="text-caption py-2">
                        <div style="width:100px" class="text-wrap text-justify">
                          {{ item.remarks }}
                        </div>
                      </td>
                      <td
                        v-if="toEdit"
                        align="center"
                        class="text-caption py-2"
                      >
                        <div
                          v-if="item.leave_id"
                          style="width:100px"
                          class="text-wrap text-justify"
                        >
                          <v-btn
                            x-small
                            class="white--text"
                            @click="confirmRestore(item.leave_id)"
                            color="#6DB249"
                          >
                            restore
                          </v-btn>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>

        <v-card-actions class="pa-5" v-if="viewFrom != 'audit'">
          <v-spacer></v-spacer>
          <v-btn
            class="white--text"
            v-if="!toEdit"
            @click="toEdit = !toEdit"
            color="#6DB249"
          >
            Edit
          </v-btn>

          <v-btn v-if="!toEdit" color="red" outlined @click="closeD()">
            Close
          </v-btn>

          <v-btn v-if="toEdit" color="red" outlined @click="toEdit = false">
            cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- confirmation -->
    <v-dialog v-model="confirmDialog" persistent max-width="400">
      <v-card color="white">
        <div class="pa-4 #3a3b3a--text">
          <div class="text-h6 mb-1">WARNING!</div>

          <!-- error message-->
          <div class="text-body-1 mb-1">
            <p style="text-align: justify">
              <v-icon class="mt-n2" color="white">mdi-alert</v-icon> &nbsp; Are
              you sure you want to restore this leave credits?
            </p>
          </div>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="confirmDialog = false">
            Close
          </v-btn>

          <v-btn
            color="green"
            class="white--text"
            :loading="submitBtnLoading"
            :disabled="submitBtnLoading"
            @click="restore()"
          >
            Yes
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
    viewFrom: null,
  },
  data() {
    return {
      dialog: false,
      submitBtnLoading: false,
      confirmDialog: false,
      itemToRestore: null,
      id: null,
      empID: null,
      name: null,
      filter: null,
      toEdit: false,
      leave_card_data: [],
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
        this.toEdit = false;
        console.log(data);
        this.name = data.name;
        this.empID = data.empID;
        this.filter = this.$store.getters.getFilterSelected;
        this.loadEmployeeLeaveCard();
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

    loadEmployeeLeaveCard() {
      this.axiosCall(
        "/leave-credits/getLeaveCardByEmpID/" + this.empID + "/" + this.filter,
        "GET"
      ).then((res) => {
        if (res) {
          console.log(res.data);
          this.leave_card_data = res.data;
        }
      });
    },

    confirmRestore(leaveID) {
      this.itemToRestore = leaveID;
      this.confirmDialog = true;
    },

    restore() {
      this.axiosCall("/leaves/restore-credit", "POST", {
        leaveID: this.itemToRestore,
      }).then((res) => {
        if (res) {
          this.confirmDialog = false;
          this.itemToRestore = null;
          this.toEdit = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
          this.loadEmployeeLeaveCard();
        }
      });
    },

    closeD() {
      this.eventHub.$emit("closeViewEmployeeLeaveCardDialog", false);
      this.dialog = false;
    },
  },
};
</script>
<style scoped>
.table {
  width: 100%;
  border-collapse: collapse;
}
table,
td {
  border-bottom: 1px solid rgb(206, 202, 202);
}
tr:first-child th:first-child {
  border-top-left-radius: 10px;
}
tr:first-child th:last-child {
  border-top-right-radius: 10px;
}

tr:last-child td:first-child {
  border-bottom-left-radius: 10px;
}
tr:last-child td:last-child {
  border-bottom-right-radius: 10px;
}

/* tr:nth-child(2) th:first-child {
  border-top-left-radius: none;
}
tr:nth-child(2) th:last-child {
  border-top-right-radius: none;
} */

tr td:first-child {
  border-left: 1px solid rgb(206, 202, 202);
}
tr td:last-child {
  border-right: 1px solid rgb(206, 202, 202);
}
</style>
