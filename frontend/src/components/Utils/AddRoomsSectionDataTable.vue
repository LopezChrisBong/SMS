<template >
  <div style="margin-top: 8pt;">
    <v-row class="mx-2">
      <v-col cols="12" md="4" class="d-flex justify-space-between gboFonts">
        <v-text-field
          v-model="search"
          outlined
          prepend-inner-icon="search"
          label="Search"
          single-line
          hide-details
          class="rounded-lg gboFonts"
          color="#f5b027"
          dense
        ></v-text-field>
        <!-- <v-btn
          class="white--text ml-2 rounded-lg gboFonts"
          :class="
            generatedCount != 0
              ? 'd-none'
              : gradeName == 'Grade 11'
              ? ''
              : gradeName == 'Grade 12'
              ? ''
              : 'd-none'
          "
          :color="$vuetify.theme.themes.light.submitBtns"
          :style="$vuetify.breakpoint.smAndUp ? {} : { fontSize: '10px' }"
          @click="dummyGenerate()"
        >
          <v-icon class="gboFonts" left> mdi-database-check-outline </v-icon>
          &nbsp;Generate Class List
        </v-btn> -->

      </v-col>
      <v-col cols="12" md="8" class="flex-items justify-end">
                <v-btn
          class="white--text ml-2 rounded-lg gboFonts"
          :class="
            generatedCount != 0
              ? 'd-none'
              : gradeName == 'Grade 11'
              ? ''
              : gradeName == 'Grade 12'
              ? ''
              : ''
          "
          :color="$vuetify.theme.themes.light.submitBtns"
          v-if="this.$store.state.user.user.isAdminApproved == 1"
          :style="$vuetify.breakpoint.smAndUp ? {} : { fontSize: '10px' }"
          @click="generateClassRecord()"
        >
          <v-icon left> mdi-database-check-outline </v-icon>
          Generate Class List
        </v-btn>
        <v-btn
          style="width: 125pt; background-color: #F5B027;"
          class="white--text ml-2 rounded-lg"
          :color="$vuetify.theme.themes.light.submitBtns"
          v-if="this.$store.state.user.user.isAdminApproved == 1"
          :style="$vuetify.breakpoint.smAndUp ? {} : { fontSize: '10px' }"
          @click="add()"
        >
          <v-icon class="gboFonts" left> mdi-plus-box-outline </v-icon>
          Add New
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="mx-2">
      <v-col cols="12" md="8" class="flex-items gboFonts">
        <v-tabs
          v-model="activeTab"
          show-arrows
          color="#f5b027"
          align-tabs="left"
        >
          <v-tab class="gboFontsTab" v-for="tab in tabList" :key="tab.id" @click="changeTab(tab)">{{
            tab.name
          }}</v-tab>
        </v-tabs>
      </v-col>
      <v-spacer></v-spacer>

    </v-row>
    <v-card class="ma-5 dt-container" elevation="0" outlined >
      <v-data-table
        class="custom-table"
        :headers="tab == 7 ? header1 : headers"
        :items="data"
        :items-per-page="10"
        :search="search"
        :options.sync="options"
        :loading="loading"
        @pagination="pagination"
        hide-default-footer
      >
        <template v-slot:[`item.index`]="{ index }">
          <span>{{ index + 1 }}</span>
        </template>
        <template v-slot:[`item.room_section`]="{ item }">
          <span>{{ item.room_section }}</span>
        </template>
        <template v-slot:[`item.name`]="{ item }">
          <span>{{ item.name }}</span>
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <div class="text-no-wrap gboFontsTable" style="padding: 4px;">
            <v-btn
              small
              color="blue"
              :class="generatedCount == 0 ? 'd-none' : ''"
              class="my-2 mx-2 gboFontsTable"
              outlined
              @click="addStudent(item)"
            >
              <v-icon class="gboFontsTable" size="20">mdi-eye-outline</v-icon>&nbsp;Students
            </v-btn>
            <v-btn
              small
              color="blue"
              :class="generatedCount == 0 ? 'd-none' : ''"
              class="my-2 mx-2 gboFontsTable"
              outlined
              @click="printClassList(item)"
            >
              <v-icon class="gboFontsTable" size="20">mdi-printer-outline</v-icon>&nbsp;Print
            </v-btn>
            <v-btn
              small
              color="blue"
              class="my-2 mx-2 gboFontsTable"
              outlined
              @click="editItem(item)"
            >
              <v-icon class="gboFontsTable" size="20">mdi-pencil-outline</v-icon>&nbsp;Update
            </v-btn>
            <v-btn
              v-if="generatedCount == 0"
              small
              color="red"
              outlined
              class="my-2 mx-2 gboFontsTable"
              @click="confirmDelete(item)"
            >
              <v-icon class="gboFontsTable" size="20">mdi-delete-off</v-icon>&nbsp;Delete
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>
    <v-row class="mb-2 mx-5" align="center">
      <v-col cols="auto" class="mr-auto text-truncate flex-items" no-gutters>
        <span class="px-2 gboFonts">Show</span>
        <span>
          <v-select
            dense
            outlined
            color="#f5b027"
            hide-details
            :value="options.itemsPerPage"
            style="max-width: 90px"
            class="rounded-lg gboFonts"
            @change="options.itemsPerPage = parseInt($event, 10)"
            :items="perPageChoices"
          >
          </v-select>
        </span>
        <span class="px-2 gboFonts"> Entries </span>
      </v-col>

      <v-col cols="auto" class="mr-auto text-truncate gboFonts" no-gutters>
        Showing {{ paginationData.pageStart + 1 }} to
        {{ paginationData.pageStop }} of
        {{ paginationData.itemsLength }} entries
      </v-col>
      <v-col cols="auto">
        <v-pagination
          v-model="options.page"
          class="rounded-lg gboFonts"
          :total-visible="7"
          :color="$vuetify.theme.themes.light.submitBtns"
          :length="paginationData.pageCount"
        >
        </v-pagination>
      </v-col>
    </v-row>

    <AddRoomSectionDialog
      :data="studentData"
      :action="action"
      :grade="gradeName"
    />
    <!-- <MyJobApplication :data="designationData" :action="action" />
    <ApplicantOfJobDialog :data="applicantData" :action="action" />-->
    <ClassRoomGeneratedListDialog
      :data="taggingData"
      :action="action"
      :grade="gradeName"
      :filter="passfilter"
    />

    <v-dialog v-model="generateSeniorClassRecord" persistent max-width="550">
      <v-card color="white">
        <div class="pa-4 #3a3b3a--text">
          <div class="text-h6 mb-1">
            Please choose strand to generate class list!
          </div>
          <div class="text-body-1 mb-1 mt-10">
            <v-autocomplete
              v-model="strandId"
              :rules="[formRules.required]"
              dense
              outlined
              label="Strand"
              class="rounded-lg"
              item-text="strand_name"
              item-value="id"
              color="#93CB5B"
              :items="strandList"
            >
            </v-autocomplete>
          </div>
        </div>

        <!-- <v-card-title class="text-h5">
                Are you sure you want to proceed?
              </v-card-title> -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red"
            outlined
            @click="generateSeniorClassRecord = false"
          >
            Close
          </v-btn>
          <v-btn
            color="#f5b027"
            class="white--text"
            @click="generateByStrand()"
          >
            Generate
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="confirmDelete" persistent max-width="350">
      <v-card color="white">
        <div class="pa-4 #3a3b3a--text">
          <div class="text-h6 mb-1">WARNING!</div>
          <div class="text-body-1 mb-1">
            <p style="text-align: justify">
              <v-icon class="mt-n2" color="white">mdi-alert</v-icon> &nbsp; Are
              you sure you want to delete this information?<br /><br />
              Please note that
              <b>this action is irreversible.</b>
            </p>
          </div>
        </div>

        <!-- <v-card-title class="text-h5">
                Are you sure you want to proceed?
              </v-card-title> -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="confirmDelete = false">
            Close
          </v-btn>
          <v-btn color="#f5b027" class="white--text" @click="deleteItem()">
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
      :timeout="5000"
    ></fade-away-message-component>
  </div>
</template>
<script>
export default {
  components: {
    // CoreTimeDesignationDialog: () =>
    //   import("../../components/Dialogs/Forms/CoreTimeDesignationDialog.vue"),
    // ApplicantOfJobDialog: () =>
    //   import("../../components/Dialogs/Forms/ApplicantOfJobDialog.vue"),
    // MyJobApplication: () =>
    //   import("../../components/Dialogs/Forms/MyJobApplicationDialog.vue"),
    AddRoomSectionDialog: () =>
      import("../../components/Dialogs/Forms/AddRoomSectionDialog.vue"),
    ClassRoomGeneratedListDialog: () =>
      import("../../components/Dialogs/Forms/ClassRoomGeneratedListDialog.vue"),
  },
  data: () => ({
    search: "",
    taggingData: null,
    fullname: null,
    applicantData: null,
    strandId: null,
    strandList: [],
    confirmDelete: false,
    generateSeniorClassRecord: false,
    headers: [
      {
        text: "#",
        value: "index",
        align: "start",
        valign: "start",
        sortable: false,
        width: 20,
      },
      {
        text: "Room Name",
        value: "room_section",
        align: "center",
        valign: "center",
        sortable: false,
      },

      {
        text: "Adviser",
        value: "name",
        align: "center",
        valign: "center",
        sortable: false,
      },

      {
        text: "Action",
        value: "action",
        align: "end",
        valign: "end",
        sortable: false,
      },
    ],
    header1: [
      {
        text: "#",
        value: "index",
        align: "start",
        valign: "start",
        sortable: false,
        width: 20,
      },
      {
        text: "Grade Level",
        value: "grade_level",
        align: "center",
        valign: "center",
        sortable: false,
      },
      {
        text: "Room Name",
        value: "room_section",
        align: "center",
        valign: "center",
        sortable: false,
      },

      {
        text: "Adviser",
        value: "name",
        align: "center",
        valign: "center",
        sortable: false,
      },
    ],

    data: [],
    gradeName: null,
    printData: [],
    verified: [],
    perPageChoices: [
      { text: "5", value: 5 },
      { text: "10", value: 10 },
      { text: "20", value: 20 },
      { text: "50", value: 50 },
      { text: "100", value: 100 },
      { text: "250", value: 250 },
      { text: "500", value: 500 },
    ],
    activeTab: { id: 7, name: "All Rooms" },
    tab: 7,
    tabList: [
      { id: 7, name: "All Rooms" },
      { id: 1, name: "Grade 7" },
      { id: 2, name: "Grade 8" },
      { id: 3, name: "Grade 9" },
      { id: 4, name: "Grade 10" },
      { id: 5, name: "Grade 11" },
      { id: 6, name: "Grade 12" },
    ],
    studentData: null,
    designationData: null,
    totalCount: 0,
    deleteData: null,
    updateData: null,
    loading: false,
    options: {},
    action: null,
    toPrint: null,
    reportTypeList: [],
    jobitem: null,
    jobitemsList: [],
    selectedYear: null,
    selectedMonth: null,
    paginationData: {},
    formdata: [],
    work_dates_menu: false,
    confirmDialog: false,
    JobPostPrint: false,
    generatedCount: null,
    conflict: null,
    passfilter: null,
    fadeAwayMessage: {
      show: false,
      type: "success",
      header: "Successfully Deleted!",
      message: "",
      top: 10,
    },
    yearList: [],
    monthsList: [
      { id: 0, name: "All" },
      { id: 1, name: "January" },
      { id: 2, name: "February" },
      { id: 3, name: "March" },
      { id: 4, name: "April" },
      { id: 5, name: "May" },
      { id: 6, name: "June" },
      { id: 7, name: "July" },
      { id: 8, name: "August" },
      { id: 9, name: "September" },
      { id: 10, name: "October" },
      { id: 11, name: "November" },
      { id: 12, name: "December" },
    ],
  }),

  mounted() {
    // this.eventHub.$on("closeMyJobApplicationDialog", () => {
    //   this.initialize();
    // });

    this.eventHub.$on("closeAddSubjectDialog", () => {
      this.initialize();
    });
    this.eventHub.$on("closeaddStudentClassRoomDialog", () => {
      this.initialize();
    });
    // this.eventHub.$on("closeMyJobApplicationDialog", () => {
    //   this.initialize();
    // });
    // this.eventHub.$on("closeShortListDialog", () => {
    //   this.initialize();
    // });

    // this.eventHub.$on("closeMyDesignationDialog", () => {
    //   this.initialize();
    // });
  },

  beforeDestroy() {
    this.eventHub.$off("closeaddStudentClassRoomDialog");
    this.eventHub.$off("closeAddSubjectDialog");
    // this.eventHub.$off("closeApplicantJobList");
    // this.eventHub.$off("closeMyJobApplicationDialog");
    // this.eventHub.$off("closeShortListDialog");

    // this.eventHub.$off("closeMyDesignationDialog");
  },

  watch: {
    options: {
      handler() {
        this.initialize();
        this.getAlreadyGeanerate();
      },
      deep: true,
    },
    filterYear: {
      handler(newData, oldData) {
        if (oldData != newData) {
          this.initialize();
          this.getAlreadyGeanerate();
        }
      },
      deep: true,
    },
  },
  computed: {
    filterYear() {
      return this.$store.getters.getFilterSelected;
    },

    //   // filterPrintData() {
    //   //   return this.paginate(
    //   //     this.data.filter((data) =>
    //   //       data.employee.toLowerCase().match(this.search.toLowerCase())
    //   //     )
    //   //   );
    //   // },
  },
  methods: {
    initialize() {
      this.loading = true;
      // let filter = this.$store.getters.getFilterSelected;
      // console.log("Filted", filter);

      if (this.tab == 1) {
        this.gradeName = "Grade 7";
        this.axiosCall("/rooms-section/" + "Grade 7", "GET").then((res) => {
          if (res) {
            console.log("Love", res.data);
            this.data = res.data;
            this.loading = false;
          }
        });
      } else if (this.tab == 2) {
        this.gradeName = "Grade 8";

        this.axiosCall("/rooms-section/" + "Grade 8", "GET").then((res) => {
          if (res) {
            console.log("Love", res.data);
            this.data = res.data;
            this.loading = false;
          }
        });
      } else if (this.tab == 3) {
        this.gradeName = "Grade 9";

        this.axiosCall("/rooms-section/" + "Grade 9", "GET").then((res) => {
          if (res) {
            console.log("Love", res.data);
            this.data = res.data;
            this.loading = false;
          }
        });
      } else if (this.tab == 4) {
        this.gradeName = "Grade 10";

        this.axiosCall("/rooms-section/" + "Grade 10", "GET").then((res) => {
          if (res) {
            console.log("Love", res.data);
            this.data = res.data;
            this.loading = false;
          }
        });
      } else if (this.tab == 5) {
        this.gradeName = "Grade 11";

        this.axiosCall("/rooms-section/" + "Grade 11", "GET").then((res) => {
          if (res) {
            console.log("Love", res.data);
            this.data = res.data;
            this.loading = false;
          }
        });
      } else if (this.tab == 6) {
        this.gradeName = "Grade 12";

        this.axiosCall("/rooms-section/" + "Grade 12", "GET").then((res) => {
          if (res) {
            console.log("Love", res.data);
            this.data = res.data;
            this.loading = false;
          }
        });
      } else if (this.tab == 7) {
        this.axiosCall("/rooms-section/findAllAddedRooms", "GET").then(
          (res) => {
            if (res) {
              console.log("Love", res.data);
              this.data = res.data;
              this.loading = false;
            }
          }
        );
      }
    },
    dummyGenerate() {
      let filter = this.$store.getters.getFilterSelected;
      this.axiosCall(
        "/enroll-student/getSchoolYear/toGenerate/" +
          this.gradeName +
          "/" +
          filter,
        "GET"
      ).then((res) => {
        this.conflict = res.data[0].conflict;

        console.log("Strand Conflict", this.conflict);
        if (this.conflict == 0) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message =
            "No Student Enrolled in this School Year or Grade Level";
        } else {
          this.generateSeniorClassRecord = true;
          this.getAllStrand();
        }
      });
    },
    generateByStrand() {
      let filter = this.$store.getters.getFilterSelected;
      this.axiosCall(
        "/rooms-section/getConflictStrand/" +
          this.gradeName +
          "/" +
          filter +
          "/" +
          this.strandId,
        "GET"
      ).then((res) => {
        console.log("conflict", res.data);

        if (res.data != 0) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message =
            "Please select another strand to generate, class list already exist!";
        } else {
          console.log("wala pa");
          this.axiosCall(
            "/rooms-section/genStrandRecord/seniorHigh/" +
              this.gradeName +
              "/" +
              filter +
              "/" +
              this.strandId,
            "POST"
          ).then((res) => {
            if (res) {
              if (res.data.status == 201) {
                this.dialog = false;
                this.fadeAwayMessage.show = true;
                this.fadeAwayMessage.type = "success";
                this.fadeAwayMessage.header = "System Message";
                this.fadeAwayMessage.message = res.data.msg;
                this.confirmDialog = false;
                this.initialize();
              } else if (res.data.status == 400) {
                this.confirmDialog = false;
                this.fadeAwayMessage.show = true;
                this.fadeAwayMessage.type = "error";
                this.fadeAwayMessage.header = "System Message";
                this.fadeAwayMessage.message = res.data.msg;
              }
            }
          });
        }
      });
    },

    generateClassRecord() {
      let filter = this.$store.getters.getFilterSelected;
      this.axiosCall(
        "/enroll-student/getSchoolYear/toGenerate/" +
          this.gradeName +
          "/" +
          filter,
        "GET"
      ).then((res) => {
        if (res) {
          this.conflict = res.data[0].conflict;

          if (this.conflict == 0) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message =
              "No Student Enrolled in this School Year or Grade Level";
          } else {
            if (this.tab == 1) {
              this.gradeName = "Grade 7";

              this.axiosCall(
                "/rooms-section/generateClassRecord/byGrade/level/" +
                  this.gradeName +
                  "/" +
                  filter,
                "POST"
              ).then((res) => {
                if (res) {
                  if (res.data.status == 201) {
                    this.dialog = false;
                    this.fadeAwayMessage.show = true;
                    this.fadeAwayMessage.type = "success";
                    this.fadeAwayMessage.header = "System Message";
                    this.fadeAwayMessage.message = res.data.msg;
                    this.confirmDialog = false;

                    setTimeout(() => {
                      window.location.reload();
                    }, 2000);
                  } else if (res.data.status == 400) {
                    this.confirmDialog = false;
                    this.fadeAwayMessage.show = true;
                    this.fadeAwayMessage.type = "error";
                    this.fadeAwayMessage.header = "System Message";
                    this.fadeAwayMessage.message = res.data.msg;
                  }
                }
              });
            } else if (this.tab == 2) {
              this.gradeName = "Grade 8";

              this.axiosCall(
                "/rooms-section/generateClassRecord/byGrade/level/" +
                  this.gradeName +
                  "/" +
                  filter,
                "POST"
              ).then((res) => {
                if (res) {
                  if (res.data.status == 201) {
                    this.dialog = false;
                    this.fadeAwayMessage.show = true;
                    this.fadeAwayMessage.type = "success";
                    this.fadeAwayMessage.header = "System Message";
                    this.fadeAwayMessage.message = res.data.msg;
                    this.confirmDialog = false;

                    setTimeout(() => {
                      window.location.reload();
                    }, 2000);
                  } else if (res.data.status == 400) {
                    this.confirmDialog = false;
                    this.fadeAwayMessage.show = true;
                    this.fadeAwayMessage.type = "error";
                    this.fadeAwayMessage.header = "System Message";
                    this.fadeAwayMessage.message = res.data.msg;
                  }
                }
              });
            } else if (this.tab == 3) {
              this.gradeName = "Grade 9";

              this.axiosCall(
                "/rooms-section/generateClassRecord/byGrade/level/" +
                  this.gradeName +
                  "/" +
                  filter,
                "POST"
              ).then((res) => {
                if (res) {
                  if (res.data.status == 201) {
                    this.dialog = false;
                    this.fadeAwayMessage.show = true;
                    this.fadeAwayMessage.type = "success";
                    this.fadeAwayMessage.header = "System Message";
                    this.fadeAwayMessage.message = res.data.msg;
                    this.confirmDialog = false;

                    setTimeout(() => {
                      window.location.reload();
                    }, 2000);
                  } else if (res.data.status == 400) {
                    this.confirmDialog = false;
                    this.fadeAwayMessage.show = true;
                    this.fadeAwayMessage.type = "error";
                    this.fadeAwayMessage.header = "System Message";
                    this.fadeAwayMessage.message = res.data.msg;
                  }
                }
              });
            } else if (this.tab == 4) {
              this.gradeName = "Grade 10";

              this.axiosCall(
                "/rooms-section/generateClassRecord/byGrade/level/" +
                  this.gradeName +
                  "/" +
                  filter,
                "POST"
              ).then((res) => {
                if (res) {
                  if (res.data.status == 201) {
                    this.dialog = false;
                    this.fadeAwayMessage.show = true;
                    this.fadeAwayMessage.type = "success";
                    this.fadeAwayMessage.header = "System Message";
                    this.fadeAwayMessage.message = res.data.msg;
                    this.confirmDialog = false;
                    setTimeout(() => {
                      window.location.reload();
                    }, 2000);
                  } else if (res.data.status == 400) {
                    this.confirmDialog = false;
                    this.fadeAwayMessage.show = true;
                    this.fadeAwayMessage.type = "error";
                    this.fadeAwayMessage.header = "System Message";
                    this.fadeAwayMessage.message = res.data.msg;
                  }
                }
              });
            } else if (this.tab == 5) {
              this.gradeName = "Grade 11";

              this.axiosCall(
                "/rooms-section/generateClassRecord/byGrade/level/" +
                  this.gradeName +
                  "/" +
                  filter,
                "POST"
              ).then((res) => {
                if (res) {
                  if (res.data.status == 201) {
                    this.dialog = false;
                    this.fadeAwayMessage.show = true;
                    this.fadeAwayMessage.type = "success";
                    this.fadeAwayMessage.header = "System Message";
                    this.fadeAwayMessage.message = res.data.msg;
                    this.confirmDialog = false;
                    setTimeout(() => {
                      window.location.reload();
                    }, 2000);
                  } else if (res.data.status == 400) {
                    this.confirmDialog = false;
                    this.fadeAwayMessage.show = true;
                    this.fadeAwayMessage.type = "error";
                    this.fadeAwayMessage.header = "System Message";
                    this.fadeAwayMessage.message = res.data.msg;
                  }
                }
              });
            } else if (this.tab == 6) {
              this.gradeName = "Grade 12";

              this.axiosCall(
                "/rooms-section/generateClassRecord/byGrade/level/" +
                  this.gradeName +
                  "/" +
                  filter,
                "POST"
              ).then((res) => {
                if (res) {
                  if (res.data.status == 201) {
                    this.dialog = false;
                    this.fadeAwayMessage.show = true;
                    this.fadeAwayMessage.type = "success";
                    this.fadeAwayMessage.header = "System Message";
                    this.fadeAwayMessage.message = res.data.msg;
                    this.confirmDialog = false;
                    setTimeout(() => {
                      window.location.reload();
                    }, 2000);
                  } else if (res.data.status == 400) {
                    this.confirmDialog = false;
                    this.fadeAwayMessage.show = true;
                    this.fadeAwayMessage.type = "error";
                    this.fadeAwayMessage.header = "System Message";
                    this.fadeAwayMessage.message = res.data.msg;
                  }
                }
              });
            }
          }
        }
      });
    },

    pagination(data) {
      this.paginationData = data;
    },

    changeTab(tab) {
      this.activeTab = tab;

      // if (tab.id == 1) {

      this.tab = tab.id;
      this.initialize();
      this.getAlreadyGeanerate();
      // } else if (tab.id == 2) {
      //   this.getVerifiedUsers();
      //   this.tab = tab.id;
      // }
    },

    getAlreadyGeanerate() {
      let filter = this.$store.getters.getFilterSelected;

      if (this.tab == 1) {
        this.gradeName = "Grade 7";
        this.axiosCall(
          "/rooms-section/getCountGen/" + this.gradeName + "/" + filter,
          "GET"
        ).then((res) => {
          if (res) {
            this.generatedCount = res.data[0].count_gen;
            console.log(this.generatedCount);
            this.loading = false;
          }
        });
      } else if (this.tab == 2) {
        this.gradeName = "Grade 8";

        this.axiosCall(
          "/rooms-section/getCountGen/" + this.gradeName + "/" + filter,
          "GET"
        ).then((res) => {
          if (res) {
            this.generatedCount = res.data[0].count_gen;
            console.log(this.generatedCount);
            this.loading = false;
          }
        });
      } else if (this.tab == 3) {
        this.gradeName = "Grade 9";

        this.axiosCall(
          "/rooms-section/getCountGen/" + this.gradeName + "/" + filter,
          "GET"
        ).then((res) => {
          if (res) {
            this.generatedCount = res.data[0].count_gen;
            console.log(this.generatedCount);
            this.loading = false;
          }
        });
      } else if (this.tab == 4) {
        this.gradeName = "Grade 10";

        this.axiosCall(
          "/rooms-section/getCountGen/" + this.gradeName + "/" + filter,
          "GET"
        ).then((res) => {
          if (res) {
            this.generatedCount = res.data[0].count_gen;
            console.log(this.generatedCount);
            this.loading = false;
          }
        });
      } else {
        if (this.tab == 5) {
          this.gradeName = "Grade 11";

          this.axiosCall(
            "/rooms-section/getCountGen/" + this.gradeName + "/" + filter,
            "GET"
          ).then((res) => {
            if (res) {
              this.generatedCount = res.data[0].count_gen;
              this.loading = false;
            }
          });
        } else if (this.tab == 6) {
          this.gradeName = "Grade 12";
          this.axiosCall(
            "/rooms-section/getCountGen/" + this.gradeName + "/" + filter,
            "GET"
          ).then((res) => {
            if (res) {
              this.generatedCount = res.data[0].count_gen;
              this.loading = false;
            }
          });
        }
      }
    },

    add() {
      this.studentData = [{ id: null }];
      this.action = "Add";
    },
    editItem(item) {
      this.studentData = item;
      this.action = "Update";
    },
    printClassList(item) {
      console.log(item);
      // this.fadeAwayMessage.show = true;
      // this.fadeAwayMessage.type = "info";
      // this.fadeAwayMessage.header = "System Message";
      // this.fadeAwayMessage.message = "This Feature is to be followed";

      let filter = this.$store.getters.getFilterSelected;
      window.open(
        process.env.VUE_APP_SERVER +
          "/pdf-generator/getAllStudenList/" +
          filter +
          "/" +
          item.id +
          "/" +
          this.gradeName +
          "",
        "_blank"
      );
    },

    addStudent(item) {
      let filter = this.$store.getters.getFilterSelected;
      this.taggingData = item;
      this.action = "View";
      this.passfilter = filter;
    },
    viewApplicant(item) {
      this.applicantData = item;
      this.action = 1;
    },
    viewHiredApplicant(item) {
      this.applicantData = item;
      this.action = 2;
    },
    viewItem(item) {
      if (this.tab == 1) {
        this.studentData = item;
        this.action = "View";
      } else {
        this.designationData = item;
        this.action = "View";
      }
    },

    deleteItem() {
      this.axiosCall("/rooms-section/" + this.deleteData.id, "DELETE").then(
        (res) => {
          if (res.data.status == 200) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.confirmDialog = false;
            this.initialize();
          } else if (res.data.status == 400) {
            this.confirmDialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
          }
        }
      );
    },
    confirmDelete(item) {
      this.confirmDialog = true;
      this.deleteData = item;
    },

    getAllStrand() {
      this.axiosCall("/rooms-section/AllStrand/Data/strand", "GET").then(
        (res) => {
          if (res) {
            let data = [];

            for (let index = 0; index < res.data.length; index++) {
              console.log();
              const arr = {
                id: res.data[index].id,
                strand_name: res.data[index].strand_name,
                trackId: res.data[index].trackId,
              };
              data.push(arr);
            }
            this.strandList = data;
            console.log("All Strand", res.data);
          }
        }
      );
    },
  },
};
</script>

<style scoped>

.gboFonts{
  font-family: 'Segoe UI', !important;
  font-size: 11pt;
}

.gboFontsTab{
  font-family: 'Segoe UI', !important;
  font-size: 12pt;
}

.gboFontsTable{
  font-family: 'Segoe UI', !important;
  font-size: 10.5pt;
}

.custom-table :deep(th) { 
  font-size: 11pt !important; 
  line-height: 1.5;
} 

</style>
