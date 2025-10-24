<template>
  <div>
    <v-row class="mx-2">
      <v-col cols="12">
        <v-btn
          class="white--text ml-2 rounded-lg"
          :color="$vuetify.theme.themes.light.submitBtns"
          v-if="this.$store.state.user.user.isAdminApproved == 1"
          @click="classProgramms()"
        >
          <v-icon left> mdi-printer-outline </v-icon>
          Class Programm
        </v-btn>
      </v-col>
      <v-col cols="12" md="8" class="flex-items">
        <v-tabs
          v-model="activeTab"
          show-arrows
          color="#EA7142"
          align-tabs="left"
        >
          <v-tab v-for="tab in tabList" :key="tab.id" @click="changeTab(tab)">{{
            tab.name
          }}</v-tab>
        </v-tabs>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12" md="4" class="d-flex justify-space-between">
        <v-autocomplete
          v-model="section"
          :rules="[formRules.required]"
          dense
          outlined
          @change="changeValueSection($event)"
          label="Section"
          class="rounded-lg"
          item-text="room_section"
          item-value="id"
          color="#93CB5B"
          :items="sectionList"
        >
        </v-autocomplete>

        <!-- <v-text-field
            v-model="search"
            outlined
            prepend-inner-icon="search"
            label="Search"
            single-line
            hide-details
            class="rounded-lg"
            color="#239FAB"
            dense
          ></v-text-field> -->
        <v-btn
          class="white--text ml-2 rounded-lg"
          :color="$vuetify.theme.themes.light.submitBtns"
          v-if="this.$store.state.user.user.isAdminApproved == 1"
          @click="add()"
        >
          <v-icon left> mdi-plus-box-outline </v-icon>
          Add New
        </v-btn>
      </v-col>
    </v-row>
    <v-card class="ma-5 dt-container" elevation="0" outlined>
      <v-container fluid>
        <!-- Tabs -->
        <v-tabs
          v-model="activeDay"
          background-color="transparent"
          color="orange darken-2"
          grow
          slider-color="orange darken-2"
        >
          <v-tab
            v-for="(items, day) in groupedByDay"
            :key="day"
            :href="'#' + day"
            class="text-subtitle-1 font-weight-bold"
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
            <v-card outlined class="pa-3">
              <v-data-table
                :headers="headers"
                :items="items"
                :items-per-page="50"
                dense
                class="elevation-1"
              >
                <template v-slot:item.action="{ item }">
                  <div class="text-no-wrap">
                    <!-- Update -->
                    <v-btn
                      block
                      x-small
                      color="blue"
                      outlined
                      class="mx-1 my-1"
                      @click="editItem(item)"
                    >
                      <v-icon small>mdi-pencil-outline</v-icon> Update
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
                          x-small
                          color="orange"
                          class="white--text mx-1 my-1"
                          dark
                          v-bind="attrs"
                          v-on="on"
                          @click.stop="toggleMenu(item)"
                        >
                          <v-icon small>mdi-alert-outline</v-icon> Conflict
                        </v-btn>
                      </template>

                      <v-card
                        class="pa-4"
                        max-width="500"
                        style="width: 500px;"
                      >
                        <v-card-title class="headline">
                          Conflict Information
                        </v-card-title>
                        <v-card-text>
                          <div v-if="conflictData">
                            <v-row
                              v-for="(c, index) in conflictData.conflictData"
                              :key="c.id"
                              class="elevation-2 mb-2 pa-2"
                            >
                              <v-col cols="12">
                                <v-chip color="red" class="white--text">
                                  {{ index + 1 }}
                                </v-chip>
                                Room Name: {{ c.room_section }}
                              </v-col>
                              <v-col cols="12"
                                >Subject: {{ c.subject_title }}</v-col
                              >
                              <v-col cols="12"
                                >Time: {{ c.times_slot_from }} -
                                {{ c.times_slot_to }}</v-col
                              >
                              <v-col cols="12">Day: {{ c.day }}</v-col>
                              <v-col cols="12"
                                >Grade: {{ c.grade_level }}</v-col
                              >
                            </v-row>
                          </div>
                          <div v-else>Loading conflict info...</div>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn
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
                      x-small
                      color="#C62828"
                      class="white--text mx-1 my-1"
                      @click="confirmDelete(item)"
                    >
                      <v-icon small>mdi-trash-can-outline</v-icon> Delete
                    </v-btn>
                  </div>
                </template>
              </v-data-table>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-container>
    </v-card>
    <v-row class="mb-2 mx-5" align="center">
      <v-col cols="auto" class="mr-auto text-truncate flex-items" no-gutters>
        <span class="px-2">Show</span>
        <span>
          <v-select
            dense
            outlined
            color="#EA7142"
            hide-details
            :value="options.itemsPerPage"
            style="max-width: 90px"
            class="rounded-lg"
            @change="options.itemsPerPage = parseInt($event, 10)"
            :items="perPageChoices"
          >
          </v-select>
        </span>
        <span class="px-2"> Entries </span>
      </v-col>

      <v-col cols="auto" class="mr-auto text-truncate" no-gutters>
        Showing {{ paginationData.pageStart + 1 }} to
        {{ paginationData.pageStop }} of
        {{ paginationData.itemsLength }} entries
      </v-col>
      <v-col cols="auto">
        <v-pagination
          v-model="options.page"
          class="rounded-lg"
          :total-visible="7"
          :color="$vuetify.theme.themes.light.submitBtns"
          :length="paginationData.pageCount"
        >
        </v-pagination>
      </v-col>
    </v-row>
    <FacultyLoadDialog
      :data="addFacultyLoadData"
      :action="action"
      :grade="grade"
      :section="section"
      :filter="filter"
    />

    <ClassroomProgramDialog
      :data="addProgramData"
      :action="action"
      :grade="grade"
      :section="section"
      :filter="filter"
      :adviser="adviser"
    />
    <!-- <MyDesignationDialog :data="designationData" :action="action" /> -->

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

      {
        text: "Day",
        value: "day",
        align: "center",
        valign: "center",
        sortable: false,
      },

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
        align: "center",
        valign: "center",
        width: 40,
        sortable: false,
      },
    ],

    data: [],
    adviser: null,
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
    grade: null,
    addFacultyLoadData: null,
    activeTab: { id: 7, name: "Kinder 1" },
    tab: 7,
    tabList: [
      { id: 7, name: "Kinder 1" },
      { id: 8, name: "Kinder 2" },
      { id: 1, name: "Grade 1" },
      { id: 2, name: "Grade 2" },
      { id: 3, name: "Grade 3" },
      { id: 4, name: "Grade 4" },
      { id: 5, name: "Grade 5" },
      { id: 6, name: "Grade 6" },
    ],
    section: null,
    activeDay: null,
    firstLoad: true,
    menu: {},
    openMenuId: null,
    menuStates: {},
    sectionList: [],
    addProgramData: null,
    filter: null,
    designationData: null,
    totalCount: 0,
    deleteData: null,
    updateData: null,
    loading: false,
    options: {},
    action: null,
    paginationData: {},
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
        this.initialize();
      },
      deep: true,
    },
    filterYear: {
      handler(newData, oldData) {
        if (oldData != newData) {
          console.log(oldData, newData);
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
          ? "Grade 1"
          : this.tab == 2
          ? "Grade 2"
          : this.tab == 3
          ? "Grade 3"
          : this.tab == 4
          ? "Grade 4"
          : this.tab == 5
          ? "Grade 5"
          : this.tab == 6
          ? "Grade 6"
          : this.tab == 7
          ? "Kinder 1"
          : "Kinder 2";
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
    // getVerifiedUsers() {
    //   this.loading = true;

    //   this.axiosCall("/user-details/getAllVerifiedUser", "GET").then((res) => {
    //     if (res) {
    //       this.data = [];

    //       this.data = res.data;
    //       this.loading = false;
    //     }
    //   });
    // },

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
        if (this.adviser == null) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message =
            "No adviser for this classroom please select adviser";
        } else {
          this.addFacultyLoadData = [{ id: null }];
          this.action = "Add";
          this.grade = "Grade 1";
          this.adviser;
          this.section;
          this.filter = filter;
        }
      } else if (this.tab == 2) {
        if (this.adviser == null) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message =
            "No adviser for this classroom please select adviser";
        } else {
          this.addFacultyLoadData = [{ id: null }];
          this.action = "Add";
          this.grade = "Grade 2";
          this.adviser;
          this.section;
          this.filter = filter;
        }
      } else if (this.tab == 3) {
        if (this.adviser == null) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message =
            "No adviser for this classroom please select adviser";
        } else {
          this.addFacultyLoadData = [{ id: null }];
          this.action = "Add";
          this.grade = "Grade 3";
          this.adviser;
          this.section;
          this.filter = filter;
        }
      } else if (this.tab == 4) {
        if (this.adviser == null) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message =
            "No adviser for this classroom please select adviser";
        } else {
          this.addFacultyLoadData = [{ id: null }];
          this.action = "Add";
          this.grade = "Grade 4";
          this.adviser;
          this.section;
          this.filter = filter;
        }
      } else if (this.tab == 5) {
        this.addFacultyLoadData = [{ id: null }];
        this.action = "Add";
        this.grade = "Grade 5";
        this.adviser;
        this.section;
        this.filter = filter;
      } else if (this.tab == 6) {
        this.addFacultyLoadData = [{ id: null }];
        this.action = "Add";
        this.grade = "Grade 6";
        this.adviser;
        this.section;
        this.filter = filter;
      } else if (this.tab == 7) {
        if (this.adviser == null) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message =
            "No adviser for this classroom please select adviser";
        } else {
          this.addFacultyLoadData = [{ id: null }];
          this.action = "Add";
          this.grade = "Kinder 1";
          this.adviser;
          this.section;
          this.filter = filter;
        }
      } else if (this.tab == 8) {
        if (this.adviser == null) {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message =
            "No adviser for this classroom please select adviser";
        } else {
          this.addFacultyLoadData = [{ id: null }];
          this.action = "Add";
          this.grade = "Kinder 2";
          this.adviser;
          this.section;
          this.filter = filter;
        }
      }
    },
    editItem(item) {
      console.log("Update", item);
      let filter = this.$store.getters.getFilterSelected;
      if (this.tab == 1) {
        this.addProgramData = item;
        this.action = "Update";
        this.grade = "Grade 1";
        this.adviser;
        this.section;
        this.filter = filter;
      } else if (this.tab == 2) {
        this.addProgramData = item;
        this.action = "Update";
        this.grade = "Grade 2";
        this.adviser;
        this.section;
        this.filter = filter;
      } else if (this.tab == 3) {
        this.addProgramData = item;
        this.action = "Update";
        this.grade = "Grade 3";
        this.adviser;
        this.section;
        this.filter = filter;
      } else if (this.tab == 4) {
        this.addProgramData = item;
        this.action = "Update";
        this.grade = "Grade 4";
        this.adviser;
        this.section;
        this.filter = filter;
      } else if (this.tab == 5) {
        this.addProgramData = item;
        this.action = "Update";
        this.grade = "Grade 5";
        this.adviser;
        this.section;
        this.filter = filter;
      } else if (this.tab == 6) {
        this.addProgramData = item;
        this.action = "Update";
        this.grade = "Grade 6";
        this.adviser;
        this.section;
        this.filter = filter;
      } else if (this.tab == 7) {
        this.addProgramData = item;
        this.action = "Update";
        this.adviser;
        this.grade = "Kinder 1";
        this.section;
        this.filter = filter;
      } else if (this.tab == 8) {
        this.addProgramData = item;
        this.action = "Update";
        this.grade = "Kinder 2";
        this.adviser;
        this.section;
        this.filter = filter;
      }
    },

    viewItem(item) {
      this.addProgramData = item;
      this.action = "View";
    },

    deleteItem() {
      this.axiosCall(
        "/enroll-student/deleteAvailabilitySchedule/" + this.deleteData.availId,
        "DELETE"
      ).then((res) => {
        if (res.data.status == 200) {
          this.initialize();
          this.getClassroom(this.section);
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
          this.confirmDialog = false;
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
        grade = "Grade 1";
      } else if (this.tab == 2) {
        grade = "Grade 2";
      } else if (this.tab == 3) {
        grade = "Grade 3";
      } else if (this.tab == 4) {
        grade = "Grade 4";
      } else if (this.tab == 5) {
        grade = "Grade 5";
      } else if (this.tab == 6) {
        grade = "Grade 6";
      } else if (this.tab == 7) {
        grade = "Kinder 1";
      } else if (this.tab == 8) {
        grade = "Kinder 2";
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
