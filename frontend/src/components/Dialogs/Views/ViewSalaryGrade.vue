<template>
  <v-dialog v-model="dialog" fullscreen scrollable>
    <v-card>
      <v-card-title dark class="dialog-header">
        <h2 class="mt-1 text-h6 white--text">Salary Grade Information</h2>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text style="max-height: 700px;  " class="">
        <v-row class="mt-2">
          <v-col cols="12" md="6" class="flex-items pa-0">
            <h3 class="px-2">Salary Grade : {{ selectedSG }}</h3>
          </v-col>
          <v-col cols="12" md="3" class="pa-0"> </v-col>
          <v-col cols="12" md="3" class="pa-0">
            <v-autocomplete
              @change="changeSalaryGrade()"
              v-model="sgNum"
              :rules="[]"
              :items="sgList"
              dense
              outlined
              required
              label="Salary Grade"
              class="rounded-lg pt-5"
              color="#6DB249"
            ></v-autocomplete>
          </v-col>
          <!-- <v-col cols="12">
            <v-btn
              style="float: right"
              color="#6DB249"
              class="white--text"
              @click="add()"
            >
              Add
            </v-btn>
          </v-col> -->
          <v-col cols="12">
            <v-card>
              <v-data-table
                :headers="headers"
                :items="dataToView"
                :items-per-page="8"
                hide-default-footer
              >
                <template v-slot:[`item.monthly_salary`]="{ item }">
                  {{
                    item.monthly_salary
                      ? numberWithCommas(item.monthly_salary)
                      : null
                  }}
                </template>

                <template v-slot:[`item.actions`]="{ item }">
                  <v-btn x-small color="grey" outlined @click="editItem(item)">
                    Edit
                  </v-btn>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="pa-5">
        <v-spacer></v-spacer>

        <v-btn
          color="#5a67da"
          class="white--text"
          @click="save()"
          v-if="hasEdited"
        >
          <v-icon>mdi-check-circle</v-icon>
          Save Details
        </v-btn>
      </v-card-actions>
    </v-card>

    <MonthlySalaryDialog :data="itemToUpdate" />
    <fade-away-message-component
      displayType="variation2"
      v-model="fadeAwayMessage.show"
      :message="fadeAwayMessage.message"
      :header="fadeAwayMessage.header"
      :top="fadeAwayMessage.top"
      :type="fadeAwayMessage.type"
    ></fade-away-message-component>
    <v-dialog v-model="confirmDialog" persistent max-width="400">
      <v-card color="#EB6B00">
        <v-card-item>
          <div class="pa-4 white--text">
            <div class="text-overline mb-1">WARNING!</div>
            <div class="text-h6 mb-1">
              <p style="text-align: justify">
                <v-icon class="mt-n2" color="white">mdi-alert</v-icon> &nbsp;
                Are you sure you dont want to save your works ?
              </p>
            </div>
          </div>
        </v-card-item>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" class="white--text" @click="confirmDialog = false">
            Cancel
          </v-btn>
          <v-btn
            color="#5a67da"
            class="white--text"
            @click="
              confirmDialog = true;
              hasEdited = false;
              close();
            "
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script>
export default {
  props: {
    data: null,
  },
  components: {
    MonthlySalaryDialog: () => import("../Forms/MonthlySalaryDialog.vue"),
  },
  data() {
    return {
      dialog: false,
      sgNum: 1,
      hasEdited: false,
      selectedSG: null,
      salaryGuideID: null,
      confirmDialog: false,
      sgList: [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
        32,
        33,
      ],
      datas: [],
      dataToView: [],
      itemToUpdate: [],
      fadeAwayMessage: {
        show: false,
        type: "success",
        header: "",
        message: "",
        top: 10,
      },
      headers: [
        { text: "Step", value: "stepId", align: "start" },
        // { text: "FY (from)", value: "fy_from", align: "start" },
        // { text: "FY (to)", value: "fy_to", align: "start" },
        { text: "Monthly Salary", value: "monthly_salary", align: "center" },
        {
          text: "Actions",
          value: "actions",
          align: "center",
          sortable: false,
          width: 200,
        },
      ],
    };
  },
  watch: {
    data: {
      handler(data) {
        if (data.id) {
          this.dialog = true;
          this.initialize(data.id);
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.eventHub.$on("closeMonthlySalaryDialog", () => {
      // this.initialize();
    });
  },
  beforeDestroy() {
    this.eventHub.$off("closeMonthlySalaryDialog");
  },
  methods: {
    close() {
      if (this.hasEdited) {
        this.confirmDialog = true;
      } else {
        this.eventHub.$emit("closeViewSalaryGrade", true);
        this.dialog = false;
      }
    },
    initialize(id) {
      this.hasEdited = false;
      this.salaryGuideID = id;
      this.sgNum = 1;
      this.axiosCall("/salary-grade/" + id, "GET").then((res) => {
        if (res) {
          // console.log(res.data);
          this.datas = res.data;
          this.selectedSG = res.data[0].id;
          this.dataToView = res.data[0].steps;
        }
      });
    },
    changeSalaryGrade() {
      this.selectedSG = this.sgNum;
      this.dataToView = this.datas[this.sgNum - 1].steps;
    },
    editItem(item) {
      this.hasEdited = true;
      this.itemToUpdate = item;
    },
    save() {
      let data = {
        salarydetails: JSON.stringify(this.datas),
        salaryGuideID: this.salaryGuideID,
      };
      this.axiosCall("/salary-grade/", "POST", data).then((res) => {
        // console.log(res);
        if (res.data.status == 200) {
          // this.dialog = false;
          this.initialize(this.salaryGuideID);
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
        } else if (res.data.status == 400) {
          // this.dialog = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
          // this.$refs.InstituteFormref.reset();
        }
      });
    },
  },
};
</script>
