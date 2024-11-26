<template>
  <div>
    <v-dialog v-model="dialog" eager persistent scrollable max-width="900px">
      <v-form ref="CoreTimeFormref" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>Core Time and Designation </span>
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
                  {{ isDesignated ? designation.description : "N/A" }}
                </v-col>
                <v-col cols="6" class=" pt-2 px-4 font-weight-medium">
                  Office
                </v-col>
                <v-col cols="6" class=" pt-2 px-2 line_border">
                  {{ office ? office.name : null }}
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
      wfh: null,
      isDesignated: null,
      name: null,
      empID: null,
      coreTimeFrom: null,
      coreTimeTo: null,
      designation: null,
      office: null,
      units: null,
      effectivityDate: null,
      specialOrderNo: null,
      assigned_office: null,
      office_name: null,
      // schoolYearFrom: null,
      // schoolYearTo: null,
      schoolYear: null,
      sem: null,
      isActive: null,

      ctd_headers: [
        {
          text: "Work Schedule",
          value: "workSched",
          align: "start",
        },
        { text: "Time Schedule/s", value: "schedTimeList", align: "center" },
        // { text: "To", value: "timeOut", align: "center" },
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
        console.log(data);
        this.schedList = data.coreTimeSched ? data.coreTimeSched : [];
        this.id = data.id;
        this.isDesignated = data.isDesignated;
        this.name = data.name;
        this.empID = data.empID;
        this.designation = data.designation;
        this.office = data.office;
        this.schoolYear = data.SY.syFrom + " - " + data.SY.syTo;
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
    getPart(id) {
      let prt;
      for (let i = 0; i < this.tapTimeList.length; i++) {
        if (this.tapTimeList[i].id == id) {
          prt = this.tapTimeList[i].title;
        }
      }
      return prt;
    },
    closeD() {
      this.eventHub.$emit("closeViewEmployeeCTDDialog", false);
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
