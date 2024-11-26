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
            <span>Used Leave Credits</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 800px" class="my-4 pa-4">
            <v-row class="mx-4">
              <v-col cols="12" class="d-flex">
                <table>
                  <tr>
                    <th width="40%" align="center">Type of Leave</th>
                    <th width="30%" align="center">Credit Balance</th>
                    <th width="30%" align="center">Used this Year</th>
                  </tr>
                  <tr v-for="(item, i) in leaveData" :key="i">
                    <td>{{ item.type }}</td>
                    <td align="center" v-if="item.id == 1">
                      {{ formatNumberValue(creditBal.VL_TOTAL, 3) }}
                    </td>
                    <td align="center" v-else-if="item.id == 3">
                      {{ formatNumberValue(creditBal.SL_TOTAL, 3) }}
                    </td>
                    <td align="center" v-else-if="item.id == 6">
                      {{ 3 - creditBal.SPL_TOTAL }}
                    </td>
                    <td align="center" v-else-if="item.id == 14">
                      {{ creditBal.CTO_TOTAL - creditBal.CTO_TOTAL_DEDUCT }}
                    </td>
                    <td v-else></td>

                    <td align="center">{{ item.count }}</td>
                  </tr>
                </table>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions class="pa-5">
            <v-spacer></v-spacer>
            <!-- <v-btn color="red" outlined @click="pending(toApproveType)">
              <v-icon>mdi-close-circle-outline</v-icon>
              Pending
            </v-btn> -->

            <v-btn
              color="red"
              outlined
              @click="dialog = false"
              class="white--text"
            >
              <v-icon>mdi-close-circle</v-icon>
              Close
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
  components: {},
  data() {
    return {
      dialog: false,
      leaveData: [],
      creditBal: [],
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

        if (data) {
          this.initialize(data);
          this.loadLeaveCredits(data);
        }
      },
      deep: true,
    },
  },
  methods: {
    initialize(data) {
      this.axiosCall(
        "/leaves/getUsedLeave/" + data.empID + "/" + data.id,
        "GET"
      ).then((res) => {
        if (res.data) {
          this.leaveData = res.data;
        }
      });
    },

    loadLeaveCredits(data) {
      this.axiosCall(
        "/employee-accum-leaves/getEmployeeLeaveCreditsAsOf/" +
          data.empID +
          "/" +
          data.id,
        "GET"
      ).then((res) => {
        if (res) {
          console.log("ress", res.data);
          this.creditBal = res.data;
        }
      });
    },

    closeD() {
      this.eventHub.$emit("closeViewEmployeeLeaveDialog", false);
      this.dialog = false;
    },
  },
};
</script>

<style scoped>
.line_border {
  border-bottom: 1px solid darkgray;
}
table {
  width: 100%;
}
td {
  padding: 10px;
}
table,
th,
td {
  border-collapse: collapse !important;
  border: 1px solid grey;
}
</style>
