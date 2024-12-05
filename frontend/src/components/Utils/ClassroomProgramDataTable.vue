<template>
  <div>
    <v-row class="mx-2">
      <v-col cols="12" md="8" class="flex-items">
        <v-tabs v-model="activeTab" color="#519043" align-tabs="left">
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
      <v-data-table
        :headers="headers"
        :items="filteredItems"
        :items-per-page="10"
        :search="search"
        :options.sync="options"
        :loading="loading"
        @pagination="pagination"
        hide-default-footer
      >
        <template v-slot:[`item.ctType`]="{ item }">
          {{
            item.ctType == 1
              ? "Academic Year"
              : item.ctType == 2
              ? "Calendar Year"
              : ""
          }}
        </template>
        <template v-slot:[`item.SY`]="{ item }">
          {{
            item.cyFrom && item.cyTo
              ? formatDate(item.cyFrom) + " - " + formatDate(item.cyTo)
              : ""
          }}
        </template>

        <template v-slot:[`item.effectivityDate`]="{ item }">
          {{ formatDate(item.effectivityDate) }}
        </template>

        <template v-slot:[`item.sem`]="{ item }">
          {{
            item.ctType == 1
              ? item.sem == 1
                ? "First Semester"
                : item.sem == 2
                ? "Second Semester"
                : "Summer"
              : "N/A"
          }}
        </template>

        <template v-slot:[`item.isActive`]="{ item }">
          <v-chip
            class="white--text"
            :color="item.isActive == 1 ? '#519043' : 'grey'"
            x-small
          >
            {{ item.isActive == 1 ? "Active" : "Inactive" }}
          </v-chip>
        </template>

        <template v-slot:[`item.status`]="{ item }">
          <v-chip
            :color="
              item.status == 1 ? 'grey' : item.status == 2 ? '#519043' : 'red'
            "
            class="ma-2 white--text"
            x-small
          >
            {{
              item.status == 1
                ? "For Approval"
                : item.status == 2
                ? "Approved"
                : "Pending"
            }}
          </v-chip>
        </template>
        <!-- <template v-slot:[`item.switch`]="{ item }">
            <v-switch
              v-if="item.status == 2"
              :value="true"
              :input-value="item.isActive == 1 ? true : false"
              @change="switchItem(item)"
              color="#519043"
            ></v-switch>
          </template> -->
        <template v-slot:[`item.action`]="{ item }">
          <div class="text-no-wrap">
            <v-btn
              x-small
              color="grey"
              class="mx-1"
              v-if="item.status != 2"
              outlined
              @click="editItem(item)"
            >
              <v-icon size="14">mdi-pencil-outline</v-icon>Update
            </v-btn>
            <!-- <v-btn
              x-small
              color="grey"
              class="mx-1"
              outlined
              @click="viewItem(item)"
            >
              <v-icon size="14">mdi-eye-outline</v-icon>View
            </v-btn> -->
            <v-btn
              x-small
              color="#C62828"
              class="white--text mx-1"
              @click="confirmDelete(item)"
            >
              <v-icon size="14">mdi-trash-can-outline</v-icon> Delete
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>
    <v-row class="mb-2 mx-5" align="center">
      <v-col cols="auto" class="mr-auto text-truncate flex-items" no-gutters>
        <span class="px-2">Show</span>
        <span>
          <v-select
            dense
            outlined
            color="#519043"
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

    <ClassroomProgramDialog
      :data="coreTimeData"
      :action="action"
      :grade="grade"
      :section="section"
      :filter="filter"
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
    // CoreTimeDesignationDialog: () =>
    //   import("../../components/Dialogs/Forms/CoreTimeDesignationDialog.vue"),
    // MyDesignationDialog: () =>
    //   import("../../components/Dialogs/Forms/MyDesignationDialog.vue"),
    ClassroomProgramDialog: () =>
      import("../../components/Dialogs/Forms/ClassroomProgramDialog.vue"),
  },
  data: () => ({
    search: "",
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
        sortable: false,
      },
    ],

    data: [],
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
    sectionList: [],
    coreTimeData: null,
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
    this.eventHub.$on("closeAddScheduleDialog", () => {
      this.getClassroom(this.section);
    });
    // this.eventHub.$on("closeMyDesignationDialog", () => {
    //   this.initialize();
    // });
  },
  beforeDestroy() {
    this.eventHub.$off("closeAddScheduleDialog");
    // this.eventHub.$off("closeMyDesignationDialog");
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
      this.getClassroom(this.section);
    },

    getClassListed() {
      this.loading = true;
      this.axiosCall("/rooms-section/" + this.activeTab.name, "GET").then(
        (res) => {
          console.log("Classroom List", res.data);
          this.sectionList = res.data;
          this.section = res.data[0].id;
        }
      );
    },
    getClassroom(section) {
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
      this.axiosCall(
        "/enroll-student/getClassProgramm/" +
          grade +
          "/" +
          section +
          "/" +
          filter,
        "GET"
      ).then((res) => {
        if (res) {
          this.data = res.data;
          this.loading = false;
        }
      });
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
        this.coreTimeData = [{ id: null }];
        this.action = "Add";
        this.grade = "Grade 7";
        this.section;
        this.filter = filter;
      } else if (this.tab == 2) {
        this.coreTimeData = [{ id: null }];
        this.action = "Add";
        this.grade = "Grade 8";
        this.section;
        this.filter = filter;
      } else if (this.tab == 3) {
        this.coreTimeData = [{ id: null }];
        this.action = "Add";
        this.grade = "Grade 9";
        this.section;
        this.filter = filter;
      } else if (this.tab == 4) {
        this.coreTimeData = [{ id: null }];
        this.action = "Add";
        this.grade = "Grade 10";
        this.section;
        this.filter = filter;
      } else if (this.tab == 5) {
        this.coreTimeData = [{ id: null }];
        this.action = "Add";
        this.grade = "Grade 11";
        this.section;
        this.filter = filter;
      } else if (this.tab == 6) {
        this.coreTimeData = [{ id: null }];
        this.action = "Add";
        this.grade = "Grade 12";
        this.section;
        this.filter = filter;
      }
    },
    editItem(item) {
      console.log("Update", item);
      let filter = this.$store.getters.getFilterSelected;
      if (this.tab == 1) {
        this.coreTimeData = item;
        this.action = "Update";
        this.grade = "Grade 7";
        this.section;
        this.filter = filter;
      } else if (this.tab == 2) {
        this.coreTimeData = item;
        this.action = "Update";
        this.grade = "Grade 8";
        this.section;
        this.filter = filter;
      } else if (this.tab == 3) {
        this.coreTimeData = item;
        this.action = "Update";
        this.grade = "Grade 9";
        this.section;
        this.filter = filter;
      } else if (this.tab == 4) {
        this.coreTimeData = item;
        this.action = "Update";
        this.grade = "Grade 10";
        this.section;
        this.filter = filter;
      } else if (this.tab == 5) {
        this.coreTimeData = item;
        this.action = "Update";
        this.grade = "Grade 11";
        this.section;
        this.filter = filter;
      } else if (this.tab == 6) {
        this.coreTimeData = item;
        this.action = "Update";
        this.grade = "Grade 12";
        this.section;
        this.filter = filter;
      }
    },

    viewItem(item) {
      this.coreTimeData = item;
      this.action = "View";
    },

    deleteItem() {
      this.axiosCall(
        "/enroll-student/deleteAvailabilitySchedule" + this.deleteData.availId,
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
  },
};
</script>
