<template>
  <div style="margin-top: 8pt;">
    <v-row class="mx-2">
      <v-col cols="12" md="4" class="d-flex justify-space-between">
        <v-autocomplete
          v-model="section"
          :rules="[formRules.required]"
          dense
          outlined
          @change="changeValueSection($event)"
          label="Section"
          class="rounded-lg gboFonts"
          item-text="room_section"
          item-value="id"
          color="#93CB5B"
          :items="sectionList"
        >
        </v-autocomplete>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12" md="8" class="d-flex justify-end">
        <v-btn
          style="width: 150pt; background-color: #F5B027;"
          class="white--text ml-2 rounded-lg gboFonts"
          :color="$vuetify.theme.themes.light.submitBtns"
          v-if="this.$store.state.user.user.isAdminApproved == 1"
          @click="classProgramms()"
        >
          <v-icon class="gboFonts" left> mdi-printer-outline </v-icon>
          Class Program
        </v-btn>
        <v-btn
          style="width: 125pt; background-color: #F5B027;"
          class="white--text ml-2 rounded-lg gboFonts"
          :color="$vuetify.theme.themes.light.submitBtns"
          v-if="this.$store.state.user.user.isAdminApproved == 1"
          @click="add()"
        >
          <v-icon class="gboFonts" left> mdi-plus-box-outline </v-icon>
          Add New
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="mx-2" style="margin-top: -40px;">
      <v-col cols="12" md="8" class="flex-items">
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
    </v-row>
    <v-card class="ma-5 dt-container" elevation="0" outlined>
      <v-container fluid>
        <!-- Tabs -->
        <v-tabs
          v-model="activeDay"
          background-color="transparent"
          color="orange darken-2 gboFontsTable"
          grow
          slider-color="orange darken-2"
        >
          <v-tab
            v-for="(items, day) in groupedByDay"
            :key="day"
            :href="'#' + day"
            class="gboFontsTable"
          >
            {{ day }}
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="activeDay" class="mt-4">
          <v-tab-item
            v-for="(items, day) in groupedByDay"
            :key="day"
            :value="day"
          >
            <v-card class="ma-1 dt-container" elevation="3" outlined>
              <v-data-table
                class="custom-table"
                :headers="headers"
                :items="items"
                :items-per-page="10"
              >
              
                <template v-slot:item.time="{ item }">
                  {{ formatTime(item.times_slot_from)}} -  {{ formatTime(item.times_slot_to)}}
                </template>
                <template v-slot:item.action="{ item }">
                  <div class="text-no-wrap">
                    <!-- Update -->
                    <v-btn
                      block
                      small
                      color="blue"
                      outlined
                      class="mx-1 my-1 gboFontsTable"
                      @click="editItem(item)"
                    >
                      <v-icon class="gboFontsTable" small>mdi-pencil-outline</v-icon>&nbsp;Update
                    </v-btn>

                    <!-- Conflict Menu -->
                    <v-menu
                      v-if="item.hasConflict"
                      v-model="menuStates[item.availId]"
                      offset-y
                      transition="scale-transition"
                      close-on-content-click="false"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          block
                          small
                          color="orange"
                          class="white--text mx-1 my-1 gboFontsTable"
                          dark
                          v-bind="attrs"
                          v-on="on"
                          @click.stop="toggleMenu(item)"
                        >
                          <v-icon class="gboFontsTable" small>mdi-alert-outline</v-icon>&nbsp;Conflict
                        </v-btn>
                      </template>

                      <v-card
                        class="pa-4"
                        max-width="500"
                        style="width: 500px;"
                      >
                        <v-card-title class="headline gboFonts">
                          Conflict Information
                        </v-card-title>
                        <v-card-text>
                          <div v-if="conflictData">
                            <v-row
                              v-for="(c, index) in conflictData.conflictData"
                              :key="c.id"
                              class="elevation-2 mb-2 pa-2"
                            >
                              <v-col cols="12" class="gboFonts">
                                <v-chip color="red" class="white--text gboFonts">
                                  {{ index + 1 }}
                                </v-chip>
                                Room Name: {{ c.room_section }}
                              </v-col>
                              <v-col cols="12" class="gboFonts"
                                >Subject: {{ c.subject_title }}</v-col
                              >
                              <v-col cols="12" class="gboFonts"
                                >Time: {{ c.times_slot_from }} -
                                {{ c.times_slot_to }}</v-col
                              >
                              <v-col cols="12" class="gboFonts">Day: {{ c.day }}</v-col>
                              <v-col cols="12" class="gboFonts"
                                >Grade: {{ c.grade_level }}</v-col
                              >
                            </v-row>
                          </div>
                          <div v-else>Loading conflict info...</div>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn
                          class="gboFonts"
                            small
                            text
                            color="primary"
                            @click="menuStates[item.id] = false"
                          >
                            Close
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-menu>

                    <!-- Delete -->
                    <v-btn
                      block
                      small
                      color="#C62828"
                      class="white--text mx-1 my-1 gboFontsTable"
                      @click="confirmDelete(item)"
                    >
                      <v-icon class="gboFontsTable" small>mdi-trash-can-outline</v-icon>&nbsp;Delete
                    </v-btn>
                  </div>
                </template>
                <template v-slot:[`item.name`]="{ item }">
                  <span>{{ item.name }}</span>
                </template>
                <template v-slot:[`item.subject_title`]="{ item }">
                  <span>{{ item.subject_title }}</span>
                </template>
              </v-data-table>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-container>
    </v-card>

    <ClassroomProgramDialog
      :data="facultyLoadData"
      :action="action"
      :grade="grade"
      :section="section"
      :filter="filter"
    />
    <FacultyLoadDialog
      :data="addFacultyLoadData"
      :action="action"
      :grade="grade"
      :section="section"
      :filter="filter"
    />

    <v-dialog v-model="confirmDialog" persistent max-width="350">
      <v-card color="white">
        <div class="pa-4 #3a3b3a--text">
          <div class="text-h6 mb-1">WARNING!</div>
          <div class="text-body-1 mb-1">
            <p style="text-align: justify">
              <b>This action is irreversible.</b>
            </p>
          </div>
        </div>

        <!-- <v-card-title class="text-h5">
            Are you sure you want to proceed?
          </v-card-title> -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="confirmDialog = false">
            Close to Cancel
          </v-btn>
          <v-btn color="green" class="white--text" @click="deleteItem()">
            Confirm Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 
    <v-overlay :value="showOverlay" opacity="0.1" class="elevation-1">
      <v-card class="pa-4 mx-auto" max-width="550">
        <v-card-title>Information</v-card-title>
        <v-card-text>
          This behaves like a dialog but is just an overlay.
          <div>{{ conflictData }}</div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small text color="primary" @click="showOverlay = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-overlay> -->

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
  components: {
    FacultyLoadDialog: () =>
      import("../../components/Dialogs/Forms/FacultyLoadDialog.vue"),
    ClassroomProgramDialog: () =>
      import("../../components/Dialogs/Forms/ClassroomProgramDialog.vue"),
  },
  data: () => ({
    search: "",
    groupedByDay: {},
    conflictData: null,
    headers: [
      {
        text: "Time",
        value: "time",
        align: "start",
        valign: "start",
        sortable: false,
      },
      {
        text: "Faculty Name",
        value: "name",
        align: "center",
        valign: "center",
        sortable: false,
      },

      // {
      //   text: "Day",
      //   value: "day",
      //   align: "center",
      //   valign: "center",
      //   sortable: false,
      // },

      {
        text: "Subject",
        value: "subject_title",
        align: "center",
        valign: "center",
        sortable: false,
      },

      {
        text: "Action",
        value: "action",
        align: "end",
        valign: "end",
        width: 40,
        sortable: false,
      },
    ],

    data: [],
    verified: [],
    activeDay: null,
    perPageChoices: [
      { text: "5", value: 5 },
      { text: "10", value: 10 },
      { text: "20", value: 20 },
      { text: "50", value: 50 },
      { text: "100", value: 100 },
      { text: "250", value: 250 },
      { text: "500", value: 500 },
    ],
    grade: null,
    activeTab: { id: 1, name: "Grade 7" },
    tab: 1,
    tabList: [
      { id: 1, name: "Grade 7" },
      { id: 2, name: "Grade 8" },
      { id: 3, name: "Grade 9" },
      { id: 4, name: "Grade 10" },
      { id: 5, name: "Grade 11" },
      { id: 6, name: "Grade 12" },
    ],
    section: null,
    firstLoad: true,
    menu: {},
    openMenuId: null,
    menuStates: {},
    sectionList: [],
    addFacultyLoadData: null,
    facultyLoadData: null,
    filter: null,
    designationData: null,
    totalCount: 0,
    deleteData: null,
    updateData: null,
    loading: false,
    options: {},
    action: null,
    paginationData: {},
    showOverlay: false,
    formdata: [],
    work_dates_menu: false,
    confirmDialog: false,
    fadeAwayMessage: {
      show: false,
      type: "success",
      header: "Successfully Deleted!",
      message: "",
      top: 10,
    },
  }),
  computed: {
    // Filtered data based on selected category
    filteredItems() {
      if (!this.section) {
        return this.data; // Show all items if no category is selected
      }
      return this.data.filter((item) => item.roomId === this.section);
    },
    filterYear() {
      return this.$store.getters.getFilterSelected;
    },
  },

  mounted() {
    this.initialize();
    this.eventHub.$on("closeAddScheduleDialog", () => {
      this.getClassroom(this.section);
    });
    this.eventHub.$on("closeFacultyLoadDialog", () => {
      this.getClassroom(this.section);
    });
  },
  beforeDestroy() {
    this.eventHub.$off("closeAddScheduleDialog");
    this.eventHub.$off("closeFacultyLoadDialog");
  },

  watch: {
    section(category) {
      this.getClassroom(category);
    },
    options: {
      handler() {
        if (this.firstLoad) {
          this.firstLoad = false; // ignore initial run
          return;
        }
        this.initialize();
      },
      deep: true,
    },
    filterYear: {
      handler(newData, oldData) {
        if (oldData != newData) {
          // console.log(oldData, newData);
          this.getClassroom(this.section);
        }
      },
      deep: true,
    },
  },

  methods: {
    pagination(data) {
      this.paginationData = data;
    },

    initialize() {
      this.getClassListed();
    },

    async getClassListed() {
      if (this.loadingSections) return;
      if (!this.activeTab?.name) return; // Prevent undefined requests

      this.loadingSections = true;

      try {
        const res = await this.axiosCall(
          "/rooms-section/" + this.activeTab.name,
          "GET"
        );

        if (res.data.length > 0) {
          this.sectionList = res.data;
          this.section = res.data[0].id;
          this.getClassroom(this.section);
        } else {
          if (
            this.sectionList.length === 0 ||
            this.activeTab.name === "Grade 7"
          )
            this.sectionList = [];
        }
      } finally {
        this.loadingSections = false;
      }
    },
    groupByDay(items) {
      const grouped = {};
      items.forEach((item) => {
        if (!grouped[item.day]) grouped[item.day] = [];
        grouped[item.day].push(item);
      });
      return grouped;
    },
    async getClassroom(section) {
      this.loading = true;
      let filter = this.$store.getters.getFilterSelected;
      let grade =
        this.tab == 1
          ? "Grade 7"
          : this.tab == 2
          ? "Grade 8"
          : this.tab == 3
          ? "Grade 9"
          : this.tab == 4
          ? "Grade 10"
          : this.tab == 5
          ? "Grade 11"
          : "Grade 12";

      try {
        const res = await this.axiosCall(
          `/enroll-student/getClassProgramm/${grade}/${section}/${filter}`,
          "GET"
        );

        if (res) {
          this.data = res.data;
          this.groupedByDay = this.groupByDay(this.data);
          await Promise.all(
            this.data.map(async (item, index) => {
              const hasConflict = await this.checkConflict(item);
              this.$set(this.data[index], "hasConflict", hasConflict);
            })
          );
        }
      } catch (error) {
        console.error("Error fetching classroom data:", error);
      } finally {
        this.loading = false;
      }
    },

    changeValueSection(data) {
      this.section = data;
    },

    switchItem(item) {
      if (this.tab == 1) {
        this.axiosCall("/my-core-time/toggleActive/" + item.id, "PATCH").then(
          (res) => {
            if (res) {
              if (res.data.status == 200) {
                this.fadeAwayMessage.show = true;
                this.fadeAwayMessage.type = "success";
                this.fadeAwayMessage.header = "System Message";
                this.fadeAwayMessage.message = res.data.msg;
                this.initialize();
              } else {
                this.fadeAwayMessage.show = true;
                this.fadeAwayMessage.type = "error";
                this.fadeAwayMessage.header = "System Message";
                this.fadeAwayMessage.message = res.data.msg;
              }
            }
          }
        );
      } else if (this.tab == 2) {
        this.axiosCall("/my-designation/toggleActive/" + item.id, "PATCH").then(
          (res) => {
            if (res) {
              if (res.data.status == 200) {
                this.fadeAwayMessage.show = true;
                this.fadeAwayMessage.type = "success";
                this.fadeAwayMessage.header = "System Message";
                this.fadeAwayMessage.message = res.data.msg;
                this.initialize();
              } else {
                this.fadeAwayMessage.show = true;
                this.fadeAwayMessage.type = "error";
                this.fadeAwayMessage.header = "System Message";
                this.fadeAwayMessage.message = res.data.msg;
              }
            }
          }
        );
      }
    },
    changeTab(tab) {
      this.activeTab = tab;

      // if (tab.id == 1) {

      this.tab = tab.id;
      this.initialize();
      // } else if (tab.id == 2) {
      //   this.getVerifiedUsers();
      //   this.tab = tab.id;
      // }
    },
    add() {
      let filter = this.$store.getters.getFilterSelected;
      if (this.tab == 1) {
        this.addFacultyLoadData = [{ id: null }];
        this.action = "Add";
        this.grade = "Grade 7";
        this.section;
        this.filter = filter;
      } else if (this.tab == 2) {
        this.addFacultyLoadData = [{ id: null }];
        this.action = "Add";
        this.grade = "Grade 8";
        this.section;
        this.filter = filter;
      } else if (this.tab == 3) {
        this.addFacultyLoadData = [{ id: null }];
        this.action = "Add";
        this.grade = "Grade 9";
        this.section;
        this.filter = filter;
      } else if (this.tab == 4) {
        this.addFacultyLoadData = [{ id: null }];
        this.action = "Add";
        this.grade = "Grade 10";
        this.section;
        this.filter = filter;
      } else if (this.tab == 5) {
        this.addFacultyLoadData = [{ id: null }];
        this.action = "Add";
        this.grade = "Grade 11";
        this.section;
        this.filter = filter;
      } else if (this.tab == 6) {
        this.addFacultyLoadData = [{ id: null }];
        this.action = "Add";
        this.grade = "Grade 12";
        this.section;
        this.filter = filter;
      }
    },
    editItem(item) {
      // console.log("Update", item);
      let filter = this.$store.getters.getFilterSelected;
      if (this.tab == 1) {
        this.facultyLoadData = item;
        this.action = "Update";
        this.grade = "Grade 7";
        this.section;
        this.filter = filter;
      } else if (this.tab == 2) {
        this.facultyLoadData = item;
        this.action = "Update";
        this.grade = "Grade 8";
        this.section;
        this.filter = filter;
      } else if (this.tab == 3) {
        this.facultyLoadData = item;
        this.action = "Update";
        this.grade = "Grade 9";
        this.section;
        this.filter = filter;
      } else if (this.tab == 4) {
        this.facultyLoadData = item;
        this.action = "Update";
        this.grade = "Grade 10";
        this.section;
        this.filter = filter;
      } else if (this.tab == 5) {
        this.facultyLoadData = item;
        this.action = "Update";
        this.grade = "Grade 11";
        this.section;
        this.filter = filter;
      } else if (this.tab == 6) {
        this.facultyLoadData = item;
        this.action = "Update";
        this.grade = "Grade 12";
        this.section;
        this.filter = filter;
      }
    },

    viewItem(item) {
      this.facultyLoadData = item;
      this.action = "View";
    },

    deleteItem() {
      this.axiosCall(
        "/enroll-student/deleteAvailabilitySchedule/" + this.deleteData.availId,
        "DELETE"
      ).then((res) => {
        if (res.data.status == 200) {
          this.dialog = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
          this.confirmDialog = false;
          this.initialize();
          this.getClassroom(this.section);
        } else if (res.data.status == 400) {
          this.confirmDialog = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
        }
      });
    },
    confirmDelete(item) {
      this.confirmDialog = true;
      this.deleteData = item;
    },
    toggleMenu(item) {
      // Close all other menus first
      Object.keys(this.menuStates).forEach((key) => {
        this.$set(this.menuStates, key, false);
      });

      // Toggle the clicked one
      const isCurrentlyOpen = this.menuStates[item.id];
      this.$set(this.menuStates, item.id, !isCurrentlyOpen);

      // Load conflict info if opened
      if (!isCurrentlyOpen) {
        this.viewConflict(item);
      }
    },
    async checkConflict(item) {
      try {
        const res = await this.axiosCall(
          "/enroll-student/checkConflict/" + JSON.stringify(item),
          "GET"
        );
        this.conflictData = res.data;
        if (res.data.status == 200) {
          return false;
        } else {
          return true;
        }
      } catch (error) {
        console.error("Error checking conflict:", error);
        return false;
      }
    },
    async viewConflict(item) {
      this.showOverlay = true;
      await this.checkConflict(item);
      console.log(this.conflictData);
    },
    classProgramms() {
      let filter = this.$store.getters.getFilterSelected;
      let userStatus = this.$store.state.user.status;
      let grade;
      if (this.tab == 1) {
        grade = "Grade 7";
      } else if (this.tab == 2) {
        grade = "Grade 8";
      } else if (this.tab == 3) {
        grade = "Grade 9";
      } else if (this.tab == 4) {
        grade = "Grade 10";
      } else if (this.tab == 5) {
        grade = "Grade 11";
      } else if (this.tab == 6) {
        grade = "Grade 12";
      }

      console.log(userStatus, filter, grade, this.section);
      window.open(
        process.env.VUE_APP_SERVER +
          "/pdf-generator/getClassProgramm/" +
          filter +
          "/" +
          userStatus +
          "/" +
          grade +
          "/" +
          this.section +
          "",
        "_blank"
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
