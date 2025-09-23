<template>
  <div>
    <v-dialog
      v-model="dialog"
      fullscreen
      persistent
      eager
      scrollable
      max-width="1200px"
    >
      <v-form ref="UserVerifyFormref" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header">
            <span>{{ action }} Student Attendance</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="closeD()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 700px" class="my-5">
            <v-row class="ma-5">
              <v-col cols="12" md="4">
                <v-menu
                  ref="attendance_menu"
                  :close-on-content-click="false"
                  :return-value.sync="attendance_date"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="auto"
                  dense
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-combobox
                      outlined
                      v-model="attendance_date"
                      :rules="[formRules.required]"
                      prepend-inner-icon="mdi-calendar"
                      label="Attendance Date"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      color="#239FAB"
                      hide-details
                      class="rounded-lg"
                      dense
                    ></v-combobox>
                  </template>
                  <v-date-picker
                    v-model="attendance_date"
                    no-title
                    color="#239FAB"
                    :allowed-dates="allowedDates"
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                      color="#239FAB"
                      class="white--text"
                      @click="
                        $refs.attendance_menu.save(attendance_date);
                        attendance_date != null ? changeDate() : '';
                      "
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="4">
                <v-btn
                  class=""
                  medium
                  color="#dc0b70"
                  outlined
                  @click="viewAttendance()"
                >
                  <v-icon size="18" class="mx-2">mdi-printer-eye</v-icon>
                  Atendance
                </v-btn>
              </v-col>

              <v-col cols="12">
                <!-- <div class="d-flex justify-space-between align-center">
                  <span class="text-red-lighten-2 text-caption">
                    {{ messageSaved }}</span
                  >
                  <v-btn
                    class="ma-2"
                    x-small
                    color="#dc0b70"
                    outlined
                    @click="viewAttendance()"
                  >
                    <v-icon size="18" class="mx-2">mdi-printer-eye</v-icon>
                    Atendance
                  </v-btn>
                </div> -->

                <v-data-table
                  :headers="headers"
                  :items="studentAttendance"
                  :search="search"
                  :options="options"
                  :loading="loading"
                >
                  <template v-slot:[`item.attendance`]="{ item }">
                    <div class="d-flex">
                      <v-radio-group
                        v-model="item.attendance"
                        row
                        :disabled="!attendance_date"
                      >
                        <!-- <v-radio label="Excused" :value="3"></v-radio>
                        <v-radio label="Late" :value="2"></v-radio> -->
                        <v-radio label="Present" :value="1"></v-radio>
                        <v-radio label="Absent" :value="0"></v-radio>
                      </v-radio-group>
                    </div>
                  </template>
                  <template v-slot:[`item.actions`]="{ item }">
                    <v-btn
                      class="mx-2"
                      x-small
                      color="orange"
                      outlined
                      @click="viewQRItem(item)"
                    >
                      <v-icon size="14">mdi-qrcode</v-icon>
                      QR
                    </v-btn>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions class="pa-5">
            <v-btn v-if="update || edit" color="blue" @click="turnCameraOn()"
              >Scan QR Code</v-btn
            >
            <v-spacer></v-spacer>
            <v-btn color="red" outlined @click="closeD()">
              <v-icon>mdi-close-circle-outline</v-icon>
              Close
            </v-btn>
            <v-btn
              v-if="update"
              :color="$vuetify.theme.themes.light.submitBtns"
              class="white--text"
              @click="updateAttendance()"
            >
              <v-icon>mdi-check-circle</v-icon>Update
            </v-btn>
            <!-- <v-btn
              v-if="edit"
              :color="$vuetify.theme.themes.light.submitBtns"
              class="white--text"
              @click="submitAttendance()"
            >
              <v-icon>mdi-check-circle</v-icon>
              Submit
            </v-btn> -->
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <v-dialog v-model="attendanceDialog" fullscreen eager scrollable>
      <v-card>
        <v-card-title class="d-flex dialog-header align-center">
          <span> Student Attendance All Month</span>
          <v-spacer></v-spacer>
          <v-btn
            icon
            dark
            @click="
              attendanceDialog = false;
              currentMonth = new Date();
            "
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text style="max-height: 700px" class="">
          <v-row>
            <v-col cols="12" class="mt-2">
              <div>
                <div class="d-flex justify-space-between mb-4">
                  <v-btn
                    color="green"
                    class="white--text"
                    small
                    @click="prevMonth"
                    >Previous Month</v-btn
                  >
                  <span class="text-title">{{ currentMonthLabel }}</span>
                  <v-btn
                    color="green"
                    class="white--text"
                    small
                    @click="nextMonth"
                    >Next Month</v-btn
                  >
                </div>
                <v-data-table
                  :headers="filteredHeaders"
                  :items="filteredItems"
                  item-key="student_name"
                  class="rotate-header"
                  dense
                >
                  <template v-slot:body="{ items }">
                    <tbody>
                      <tr v-for="item in items" :key="item.student_name">
                        <td>
                          <strong>{{ item.student_name }}</strong>
                        </td>
                        <td
                          v-for="header in headerSemester.filter(
                            (h) => h.key !== 'student_name'
                          )"
                          :key="header.key"
                        >
                          <span
                            :class="item[header.key] && item[header.key].cls"
                          >
                            {{ item[header.key] ? item[header.key].text : "" }}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-data-table>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="orange" class="white--text" @click="printSF2()">
            <v-icon>mdi-printer</v-icon>
            Print
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="qrCodedialog" max-width="400px">
      <v-card>
        <v-card-title dark class="dialog-header">
          <span>QR Code</span>
          <v-spacer></v-spacer>
          <!-- <v-btn icon dark @click="qrCodedialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn> -->
          <v-btn color="orange" class="white--text" @click="printQRCode()">
            <!-- <v-icon>mdi-printer</v-icon> -->
            Print
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col class="mt-2 mb-1 d-flex justify-center">
              <qr-code :size="150" :text="qrText"></qr-code>
            </v-col>
            <v-col class=" d-flex justify-center" cols="12" v-if="viewData"
              ><h2>Student: {{ "  " + viewData.name }}</h2></v-col
            >
          </v-row>
        </v-card-text>
        <!--    <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="orange" class="white--text" @click="printQRCode()">
            <v-icon>mdi-printer</v-icon> 
            Print
          </v-btn>
        </v-card-actions>-->
      </v-card>
    </v-dialog>

    <v-dialog v-model="scanDialog" max-width="600px" persistent>
      <v-card>
        <v-card-title>
          <span>Scan QR</span>
          <v-spacer />
          <v-btn
            icon
            @click="
              stopQRCodeScan();
              scanDialog = false;
            "
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div class="d-flex justify-center align-center">
            <div
              v-if="scannerLoad == true"
              style="position: absolute;   width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; z-index: 100; top: 0; left: 0;background-color: rgba(0, 0, 0, 0.7); "
            >
              <v-row>
                <v-col cols="12">
                  <div class="d-flex justify-center">
                    <h1 style="color: white;">{{ student_name }}</h1>
                  </div>
                </v-col>
                <v-col cols="12">
                  <div class="d-flex justify-center">
                    <h5 style="color: white;">
                      Successfully scanned, please wait for the next scan.
                    </h5>
                  </div>
                </v-col>
                <v-col cols="12">
                  <div class="d-flex justify-center">
                    <v-progress-circular
                      indeterminate
                      color="primary"
                    ></v-progress-circular>
                  </div>
                </v-col>
              </v-row>
            </div>
            <video
              v-if="loading == false"
              ref="video"
              autoplay
              playsinline
              style="width: 100%; max-width: 500px;"
            />
            <div v-else>
              <div class="d-flex justify-center">
                <h4>Closing modal, please open scanner again.</h4>
              </div>
              <div class="d-flex justify-center">
                <v-progress-circular
                  indeterminate
                  color="primary"
                ></v-progress-circular>
              </div>
            </div>
          </div>
        </v-card-text>
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
import QrScanner from "qr-scanner";
export default {
  props: {
    data: null,
    action: null,
  },

  data() {
    return {
      readonly: true,
      qrCodedialog: false,
      attendance_date: null,
      attendance_menu: false,
      messageSaved: null,
      scanDialog: false,
      camera: "auto",
      student_name: null,
      scanner: null,
      qrText: "",
      stream: null,
      menu: false,
      loading: false,
      scannerLoad: false,
      search: "",
      studentAttendance: [],
      oldStudentAttendance: [],
      attendanceDialog: false,
      scannerLoadError: false,
      edit: false,
      options: {},
      update: false,
      dialog: false,
      viewData: null,
      filter: null,
      userRoleID: null,
      headerSemester: [],
      tableItems: [],
      currentMonth: new Date(),
      headers: [
        { text: "Student Name", value: "name", align: "start" },
        {
          text: "Attendance",
          value: "attendance",
          align: "end",
          sortable: false,
          width: 250,
        },
        { text: "QR Code", value: "actions", align: "end", width: 100 },
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
        this.initialize();
        this.$refs.UserVerifyFormref.resetValidation();
        if (data.id) {
          console.log("Love", data);
        }
      },
      deep: true,
    },
    options: {
      handler() {
        this.initialize();
      },
      deep: true,
    },
  },
  computed: {
    currentMonthLabel() {
      if (!(this.currentMonth instanceof Date)) return "";
      return this.currentMonth.toLocaleString(undefined, {
        month: "long",
        year: "numeric",
      });
    },
    filteredHeaders() {
      return this.headerSemester.filter((header) => {
        if (header.key === "student_name") return true;
        const date = new Date(header.key);
        return (
          date.getMonth() === this.currentMonth.getMonth() &&
          date.getFullYear() === this.currentMonth.getFullYear()
        );
      });
    },
    filteredItems() {
      const allowedKeys = this.filteredHeaders.map((h) => h.key);
      return this.tableItems.map((item) => {
        const newItem = {};
        allowedKeys.forEach((key) => {
          // replace ?? with safe fallback
          newItem[key] =
            item[key] !== undefined && item[key] !== null ? item[key] : "";
        });
        return newItem;
      });
    },
  },
  methods: {
    initialize() {
      this.filter = this.$store.getters.getFilterSelected;
      this.userRoleID = this.$store.state.user.id;
      this.getTaggedStudent();
    },

    async turnCameraOn() {
      try {
        this.scanDialog = true;
        const videoElement = this.$refs.video;

        this.qrScanner = new QrScanner(
          videoElement,
          (result) => {
            console.log("QR scanned:", result.data);
            this.handleQrResult(result.data);
            // this.stopQRCodeScan();
            // this.scanDialog = false;
          },
          {
            preferredCamera: "environment",
            highlightScanRegion: true,
            highlightCodeOutline: true,
          }
        );

        await this.qrScanner.start();
      } catch (err) {
        console.error("QR Scanner start failed:", err);
        alert("Unable to access camera. Please allow permissions.");
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.scanDialog = false;
          this.stopQRCodeScan();
        }, 3000);
      }
    },

    stopQRCodeScan() {
      if (this.qrScanner) {
        this.qrScanner.stop();
        this.qrScanner.destroy();
        this.qrScanner = null;
      }
    },

    handleQrResult(decodedText) {
      this.presenAttendance(decodedText);
    },

    presenAttendance(item) {
      // alert("Scanned QR: " + item);
      if (this.studentAttendance.length > 0) {
        for (let i = 0; i < this.studentAttendance.length; i++) {
          if (item == this.studentAttendance[i].id) {
            this.$set(this.studentAttendance[i], "attendance", 1);
            this.student_name = this.studentAttendance[i].name;
            this.scannerLoad = true;
            setTimeout(() => {
              this.scannerLoad = false;
            }, 3000);
            if (this.edit) {
              this.submitAttendance();
            } else {
              this.updateAttendance();
            }
          } else {
            alert("Invalid QR Code!");
          }
        }
      } else {
        alert("No Classlist to fetch!");
      }
    },

    viewQRItem(item) {
      console.log(item);
      this.viewData = item;
      this.qrCodedialog = true;
      if (item.id) {
        this.qrText = item.id.toString();
        this.dialog = true;
      }
    },
    printQRCode() {
      const url =
        process.env.VUE_APP_SERVER + "/pdf-generator/getQRCode/" + this.qrText;
      window.open(url);
    },
    printSF2() {
      console.log(this.data);

      let filter = this.$store.getters.getFilterSelected;
      let date = this.currentMonth.getMonth() + 1;
      window.open(
        process.env.VUE_APP_SERVER +
          "/pdf-generator/getSchoolForm2/" +
          filter +
          "/" +
          this.data.roomId +
          "/" +
          this.data.subjectId +
          "/" +
          date +
          "/" +
          this.data.teacherID +
          "",
        "_blank"
      );
    },
    closeD() {
      this.eventHub.$emit("closeStudentAttendanceDialog", true);
      this.dialog = false;
      this.readonly = true;
      this.attendance_date = null;
      this.edit = false;
      this.update = false;
    },
    prevMonth() {
      this.currentMonth = new Date(
        this.currentMonth.getFullYear(),
        this.currentMonth.getMonth() - 1,
        1
      );
    },
    nextMonth() {
      this.currentMonth = new Date(
        this.currentMonth.getFullYear(),
        this.currentMonth.getMonth() + 1,
        1
      );
    },
    getTaggedStudent() {
      this.axiosCall(
        "/rooms-section/getMyStudentAttendance/" +
          this.userRoleID +
          "/" +
          this.filter +
          "/" +
          this.data.roomId,
        "GET"
      ).then((res) => {
        console.log("Data Students", res.data);
        if (res.data) {
          this.studentAttendance = res.data;
          this.oldStudentAttendance = res.data;
        }
      });
    },

    submitAttendance() {
      let userId = this.$store.state.user.id;
      let data = {
        data: JSON.stringify(this.studentAttendance),
        attendanceDate: this.formatDate3(this.attendance_date),
        subjectID: this.data.subjectId,
        teacherID: userId,
      };
      console.log(data);
      this.axiosCall("/rooms-section/studentAttendance", "POST", data).then(
        (res) => {
          console.log(res);
          if (res.data.status == 201) {
            // if (this.scanDialog == false) {
            //   this.fadeAwayMessage.show = true;
            //   this.fadeAwayMessage.type = "success";
            //   this.fadeAwayMessage.header = "System Message";
            //   this.fadeAwayMessage.message = res.data.msg;
            //   this.attendanceDate = null;
            // }

            this.changeDate();
            this.dialogConfirmSave = false;
          } else if (res.data.status == 400) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
          }
        }
      );
    },
    updateAttendance() {
      console.log("updated");
      let data = {
        data: JSON.stringify(this.studentAttendance),
        // attendanceDate: this.formatDate3(this.attendanceDate),
        subjectID: this.data.subjectId,
      };
      console.log(data);
      this.axiosCall(
        "/rooms-section/updateAttendance/" +
          this.formatDate3(this.attendance_date),
        "PATCH",
        data
      ).then((res) => {
        console.log(res.data);
        if (res.data.status == 200) {
          this.changeDate();
          this.dialogConfirmSave = false;
          if (this.scanDialog == false) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = "Successfully updated attendance!";
          }
          // location.reload();
        } else if (res.data.status == 400) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
        }
      });
    },
    changeData(data) {
      let updated = data.map((row) => {
        let newRow = { ...row };
        for (let key in newRow) {
          if (key !== "student_name" && key !== "subject") {
            newRow[key] =
              newRow[key] === "0"
                ? {
                    text: "✖",
                    cls: "text-h6 red--text d-flex justify-center align-center",
                  }
                : newRow[key] === "1"
                ? {
                    text: "✔",
                    cls:
                      "text-h6 green--text d-flex justify-center align-center",
                  }
                : newRow[key] === "2"
                ? {
                    text: "◩",
                    cls:
                      "text-h4 black--text d-flex justify-center align-center",
                  }
                : {
                    text: "◪",
                    cls:
                      "text-h4 blue--text d-flex justify-center align-center",
                  };
          }
        }
        return newRow;
      });
      let rawData = updated;

      const dates = Array.from(
        new Set(
          rawData.flatMap((r) =>
            Object.keys(r).filter((k) => k !== "student_name")
          )
        )
      );
      const grouped = {};
      rawData.forEach((row) => {
        const name = row.student_name;
        if (!grouped[name]) {
          grouped[name] = { student_name: name };
          dates.forEach((date) => (grouped[name][date] = "")); // empty default
        }
        Object.entries(row).forEach(([key, value]) => {
          if (key !== "student_name") {
            grouped[name][key] = value;
          }
        });
      });
      const tableItems = Object.values(grouped);
      const headers = [
        {
          text: "Name",
          key: "student_name",
          align: "start",
          sortable: false,
          width: 100,
        },
        ...dates.map((date) => ({
          text: this.noYearFormatDate(date),
          key: date,
        })),
      ];
      this.headerSemester = headers;
      this.tableItems = tableItems;
      console.log(headers);
      console.log(tableItems);
    },
    viewAttendance() {
      console.log(this.data.subjectId, this.data.roomId);
      this.getAllAttendanceSemester();
      this.attendanceDialog = true;
    },
    getAllAttendanceSemester() {
      this.axiosCall(
        "/rooms-section/getAllAttendanceWholeSemester/" +
          this.data.roomId +
          "/" +
          this.data.subjectId,
        "GET"
      ).then((res) => {
        let data = res.data;
        this.changeData(data);
      });
    },

    allowedDates(date) {
      const today = new Date();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const current = new Date(date);
      return current >= sixMonthsAgo && current <= today;
    },
    save(id) {
      if (this.attendanceDate == null) {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message = "Please select date before saving!";
      } else {
        console.log(id);
      }
    },
    isWithinTwoDaysBeforeToday(dateStr) {
      const today = new Date();
      const threeDaysBefore = new Date();
      threeDaysBefore.setDate(today.getDate() - 2);

      const givenDate = new Date(dateStr);

      // Check if givenDate is >= threeDaysBefore and < today
      return givenDate >= threeDaysBefore && givenDate < today;
    },
    isWithinFiveDaysBeforeToday(dateStr) {
      const today = new Date();
      const threeDaysBefore = new Date();
      threeDaysBefore.setDate(today.getDate() - 5);

      const givenDate = new Date(dateStr);

      // Check if givenDate is >= threeDaysBefore and < today
      return givenDate >= threeDaysBefore && givenDate < today;
    },
    changeDate() {
      // console.log(this.data.subjectId, this.data.roomId, this.attendance_date);
      this.axiosCall(
        "/rooms-section/getAllAttendanceByDate/" +
          this.attendance_date +
          "/" +
          this.data.roomId +
          "/" +
          this.data.subjectId,
        "GET"
      ).then((res) => {
        // console.log("Data Students", res.data);

        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          this.studentAttendance = res.data;
          this.edit = false;
          this.messageSaved =
            "Attendance for " +
            this.formatDate(this.attendance_date) +
            " has already been recorded. Only attendance within 2 days before the current date can be updated.";
          if (this.isWithinTwoDaysBeforeToday(this.attendance_date)) {
            this.update = true;
          } else {
            this.update = false;
          }
        } else {
          this.initialize();

          if (this.isWithinTwoDaysBeforeToday(this.attendance_date)) {
            // if (this.isWithinFvieDaysBeforeToday(this.attendance_date)) {
            this.edit = true;
            this.submitAttendance();
            // this.changeDate();
          } else {
            this.edit = false;
          }
          this.update = false;
        }
      });
    },
  },
};
</script>
<style scoped>
.sticky-first-col :deep(.v-table__wrapper) {
  overflow-x: auto;
}

.sticky-first-col :deep(table) {
  border-collapse: separate;
  border-spacing: 0;
}

.sticky-first-col :deep(th:first-child),
.sticky-first-col :deep(td:first-child) {
  position: sticky;
  left: 0;
  background: #fff;
  background: rgb(var(--v-theme-surface));
  z-index: 2;

  min-width: 180px;
}
.sticky-first-col :deep(thead th:first-child) {
  z-index: 3;
}

.sticky-first-col :deep(td:first-child) {
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.06);
}

/* Target the table header cells */
.v-data-table.rotate-header th {
  writing-mode: vertical-rl; /* make text vertical */
  transform: rotate(180deg); /* flip so it's upright */
  text-align: center;
  white-space: nowrap;
  padding: 8px 4px; /* tighter space */
  max-width: 40px; /* narrow column */
}
.v-data-table.rotate-header th:first-child {
  writing-mode: horizontal-tb !important;
  transform: none !important;
}
</style>
