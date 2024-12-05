<template>
  <div>
    <v-dialog
      v-model="dialog"
      scrollable
      persistent
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-card-title dark class="dialog-header">
          {{ action == "Add" ? "Add" : isHrReceived == 0 ? "Update" : "View" }}
          ILDP
          <v-spacer></v-spacer>
          <v-btn icon dark @click="close()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text style="max-height: 900px" class="">
          <v-alert
            v-if="!hasDirectHead"
            dense
            border="right"
            color="red"
            dismissible
            type="warning"
            class="text-caption"
          >
            You haven't set who's your direct head yet. Click
            <span @click="redirectTo()" class="clickme">here</span> to
            set.</v-alert
          >
          <v-form ref="MyILDPFormref" @submit.prevent>
            <v-row class="mt-2">
              <v-col cols="12" class="pa-0 pt-2 px-4" v-if="action == 'Add'">
                <v-autocomplete
                  :rules="action == 'Add' ? [formRules.required] : []"
                  v-model="ildpCalendarID"
                  dense
                  outlined
                  class="rounded-lg"
                  :item-text="concatYear"
                  @change="selectItem()"
                  item-value="id"
                  label="Calendar Year"
                  color="#6DB249"
                  :items="ildpCalendarList"
                >
                </v-autocomplete>
              </v-col>
              <v-col cols="12" class="pa-0 pt-2 px-4 text-right">
                <v-btn
                  :disabled="isHrReceived == 1"
                  color="#6DB249"
                  class="white--text"
                  @click="addNewLND()"
                >
                  Add LND Activity</v-btn
                >
              </v-col>

              <!--  <v-col cols="12" class="pa-0 pt-2 px-4">
                <v-text-field
                  v-model="title"
                  :disabled="isHrReceived == 1"
                  dense
                  outlined
                  required
                  label="Title of Seminars, Workshops and Conferences"
                  class="rounded-lg"
                  color="#6DB249"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="pa-0 pt-2 px-4">
                <v-select
                  v-model="year"
                  :items="years"
                  :disabled="isHrReceived == 1"
                  dense
                  outlined
                  required
                  label="Year"
                  class="rounded-lg"
                  color="#6DB249"
                ></v-select>
              </v-col>
              <v-col cols="12" class="pa-0 pt-2 px-4">
                <v-autocomplete
                  v-model="ld_actID"
                  :disabled="isHrReceived == 1"
                  dense
                  outlined
                  class="rounded-lg"
                  item-text="title"
                  @change="selectItem()"
                  item-value="id"
                  label="Learning and Development Activities"
                  color="#6DB249"
                  :items="lndActivity"
                >
                </v-autocomplete>
              </v-col> -->
              <!-- <v-col cols="12" class="pa-0 pt-2 px-4 text-right">
                <v-btn
                  v-if="isEditing"
                  color="red"
                  class="mr-2"
                  outlined
                  @click="cancel()"
                >
                  <v-icon>mdi-close-circle-outline</v-icon>
                  cancel
                </v-btn>
                <v-btn
                  :disabled="isHrReceived == 1"
                  v-if="!isEditing"
                  color="#6DB249"
                  class="white--text"
                  @click="addNewLND()"
                >
                  Add LND Activity</v-btn
                >
                <v-btn
                  v-if="isEditing"
                  color="#6DB249"
                  class="white--text"
                  @click="updateData()"
                >
                  Edit LND Activity</v-btn
                >
              </v-col> -->
              <v-col cols="12">
                <div class="elevation-4 rounded-lg">
                  <div class="d-flex ">
                    <div
                      style="border : 1px solid #5a67da; width:30%; background-color:#5a67da; "
                      class="text-center white--text rounded-tl-lg"
                    >
                      Learning and Development Activity
                    </div>
                    <div
                      style="border : 1px solid #5a67da; width:70%; background-color:#5a67da;"
                      class="text-center white--text  rounded-tr-lg"
                    >
                      (Indicate Target Completion Dates for Advanced Studies &
                      Skills Certification/Licensure/Eligibilities) <br />(Write
                      the specific title of the Seminar, Workshops, Training &
                      Conferences)
                    </div>
                  </div>
                  <div class="d-flex">
                    <div
                      style="border : 1px solid #9E9E9E; width:30%; "
                      class="text-center py-2 grey--text"
                    >
                      <span style="visibility:hidden">X</span>
                    </div>
                    <div
                      style="border : 1px solid #9E9E9E; width:70%; "
                      class="text-center grey--text d-flex"
                    >
                      <div
                        class="text-center grey--text year"
                        v-for="year in years"
                        :key="year"
                      >
                        {{ year }}
                      </div>
                    </div>
                  </div>
                  <div class="d-flex">
                    <div
                      style="border : 1px solid #9E9E9E; width:30%; "
                      class="text-left pl-2 py-4 grey--text"
                    >
                      Seminars, Workshops, Training and Conferences
                    </div>
                    <div
                      style="border : 1px solid #9E9E9E; width:70%; "
                      class="text-center grey--text d-flex"
                    >
                      <div
                        class="text-center grey--text year"
                        v-for="yr in years"
                        :key="yr"
                      >
                        <div
                          v-for="(item, i) in ildpCreated"
                          :key="i"
                          class="d-flex "
                        >
                          <div
                            v-if="item.ld_actID == 1 && item.year == yr"
                            style="width:80%"
                            class="pa-2 text-left lndList"
                          >
                            {{ item.title }}
                          </div>

                          <div
                            v-if="
                              item.ld_actID == 1 &&
                                item.year == yr &&
                                isHrReceived == 0
                            "
                            style="width:20%"
                            class="px-2 text-right"
                          >
                            <v-btn @click="edit(item, i)" icon>
                              <v-icon>mdi-pencil</v-icon></v-btn
                            >
                            <v-btn @click="remove(item, i)" icon color="error">
                              <v-icon>mdi-trash-can-outline</v-icon></v-btn
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="d-flex">
                    <div
                      style="border : 1px solid #9E9E9E; width:30%; "
                      class="text-left pl-2 py-4 grey--text"
                    >
                      Advanced Studies/ Professional Development
                    </div>
                    <div
                      style="border : 1px solid #9E9E9E; width:70%; "
                      class="text-center grey--text d-flex"
                    >
                      <div
                        class="text-center grey--text year"
                        v-for="yr in years"
                        :key="yr"
                      >
                        <div
                          v-for="(item, i) in ildpCreated"
                          :key="i"
                          class="d-flex"
                        >
                          <div
                            v-if="item.ld_actID == 2 && item.year == yr"
                            style="width:80%"
                            class="pa-2 text-left lndList"
                          >
                            {{ item.title }}
                          </div>
                          <div
                            v-if="
                              item.ld_actID == 2 &&
                                item.year == yr &&
                                isHrReceived == 0
                            "
                            style="width:20%"
                            class="px-2 text-right"
                          >
                            <v-btn @click="edit(item, i)" icon>
                              <v-icon>mdi-pencil</v-icon></v-btn
                            >
                            <v-btn @click="remove(item, i)" icon color="error">
                              <v-icon>mdi-trash-can-outline</v-icon></v-btn
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="d-flex">
                    <div
                      style="border : 1px solid #9E9E9E; width:30%; "
                      class="text-left pl-2 py-4 grey--text"
                    >
                      Skills Certification/ Licensure/Eligibilities
                    </div>
                    <div
                      style="border : 1px solid #9E9E9E; width:70%; "
                      class="text-center grey--text d-flex"
                    >
                      <div
                        class="text-center grey--text year"
                        v-for="yr in years"
                        :key="yr"
                      >
                        <div
                          v-for="(item, i) in ildpCreated"
                          :key="i"
                          class="d-flex"
                        >
                          <div
                            v-if="item.ld_actID == 3 && item.year == yr"
                            style="width:80%"
                            class="pa-2 text-left lndList"
                          >
                            {{ item.title }}
                          </div>
                          <div
                            v-if="
                              item.ld_actID == 3 &&
                                item.year == yr &&
                                isHrReceived == 0
                            "
                            style="width:20%"
                            class="px-2 text-right"
                          >
                            <v-btn @click="edit(item, i)" icon>
                              <v-icon>mdi-pencil</v-icon></v-btn
                            >
                            <v-btn @click="remove(item, i)" icon color="error">
                              <v-icon>mdi-trash-can-outline</v-icon></v-btn
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="d-flex">
                    <div
                      style="border : 1px solid #9E9E9E; width:30%; "
                      class="text-left pl-2 py-4 grey--text  rounded-bl-lg"
                    >
                      Research, Extension, Production, Administration and Other
                      Interests
                    </div>
                    <div
                      style="border : 1px solid #9E9E9E; width:70%; "
                      class="text-center grey--text d-flex  rounded-br-lg"
                    >
                      <div
                        class="text-center grey--text year "
                        v-for="yr in years"
                        :key="yr"
                      >
                        <div
                          v-for="(item, i) in ildpCreated"
                          :key="i"
                          class="d-flex"
                        >
                          <div
                            v-if="item.ld_actID == 4 && item.year == yr"
                            style="width:80%"
                            class="pa-2 text-left lndList"
                          >
                            {{ item.title }}
                          </div>
                          <div
                            v-if="
                              item.ld_actID == 4 &&
                                item.year == yr &&
                                isHrReceived == 0
                            "
                            style="width:20%"
                            class="px-2 text-right"
                          >
                            <v-btn @click="edit(item, i)" icon>
                              <v-icon>mdi-pencil</v-icon></v-btn
                            >
                            <v-btn @click="remove(item, i)" icon color="error">
                              <v-icon>mdi-trash-can-outline</v-icon></v-btn
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" class="pt-5" v-if="action == 'Add'">
                <h1>Signatories</h1>
              </v-col>
              <!-- <v-col cols="12" class="pa-0 pt-4 px-4" v-if="action == 'Add'">
                <v-autocomplete
                  :rules="[formRules.required]"
                  v-model="prog_head_userID"
                  dense
                  outlined
                  class="rounded-lg"
                  item-text="name"
                  item-value="id"
                  label="Program Head"
                  color="#6DB249"
                  :items="usersList"
                >
                </v-autocomplete>
              </v-col> -->
              <v-col cols="12" class="pa-0 pt-2 px-4" v-if="action == 'Add'">
                <!-- <v-autocomplete
                  :rules="[formRules.required]"
                  v-model="dean_userID"
                  dense
                  outlined
                  class="rounded-lg"
                  item-text="name"
                  item-value="id"
                  label="Immediate Head/Supervisor"
                  color="#6DB249"
                  :items="usersList"
                >
                </v-autocomplete> -->
                <v-text-field
                  v-model="dean_name"
                  readonly
                  dense
                  outlined
                  required
                  label="Immediate Head/Supervisor"
                  class="rounded-lg"
                  color="#6DB249"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="pa-0 pt-2 px-4" v-if="action == 'Add'">
                <v-autocomplete
                  :rules="[formRules.required]"
                  dense
                  outlined
                  class="rounded-lg"
                  item-text="name"
                  item-value="userID"
                  label="Vice President"
                  color="#6DB249"
                  v-model="vp_userID"
                  :items="vpList"
                >
                </v-autocomplete>
              </v-col>
              <v-col cols="12" class="pa-0 pt-2 px-4" v-if="action == 'Add'">
                <v-text-field
                  v-model="president_name"
                  readonly
                  dense
                  outlined
                  required
                  label="President"
                  class="rounded-lg"
                  color="#6DB249"
                ></v-text-field>
                <!-- <v-autocomplete
                  :rules="[formRules.required]"
                  dense
                  outlined
                  class="rounded-lg"
                  item-text="name"
                  item-value="id"
                  label="President"
                  v-model="president_userID"
                  color="#6DB249"
                  :items="usersList"
                >
                </v-autocomplete> -->
              </v-col>
            </v-row>
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
            v-if="action == 'Add'"
            color="#5a67da"
            class="white--text"
            @click="add()"
          >
            <v-icon>mdi-check-circle</v-icon>
            Save
          </v-btn>

          <v-btn
            v-if="action == 'Update' && isHrReceived == 0"
            color="#5a67da"
            class="white--text"
            @click="update()"
          >
            <v-icon>mdi-check-circle</v-icon>
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ILDP SELECTION DIALOG -->
    <v-dialog
      v-model="lndSelectionDialog"
      eager
      scrollable
      persistent
      max-width="800px"
      transition="dialog-bottom-transition"
    >
      <v-form ref="lndSelectionFormref" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>{{ internal_action }} Learning and Development Activity</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="lndSelectionDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 800px" class="my-4">
            <v-row>
              <v-col cols="12" class="pa-0 pt-2 px-4 mt-5">
                <v-textarea
                  v-model="title"
                  :disabled="isHrReceived == 1"
                  dense
                  :rules="[formRules.required]"
                  outlined
                  required
                  label="Title of Seminars, Workshops and Conferences"
                  class="rounded-lg"
                  color="#6DB249"
                ></v-textarea>
              </v-col>
              <v-col cols="12" class="pa-0 pt-2 px-4">
                <v-select
                  v-model="year"
                  :items="years"
                  :rules="[formRules.required]"
                  :disabled="isHrReceived == 1"
                  dense
                  outlined
                  required
                  label="Year"
                  class="rounded-lg"
                  color="#6DB249"
                ></v-select>
              </v-col>
              <v-col cols="12" class="pa-0 pt-2 px-4">
                <v-autocomplete
                  v-model="ld_actID"
                  :rules="[formRules.required]"
                  :disabled="isHrReceived == 1"
                  dense
                  outlined
                  class="rounded-lg"
                  item-text="title"
                  @change="selectItem()"
                  item-value="id"
                  label="Learning and Development Activities"
                  color="#6DB249"
                  :items="lndActivity"
                >
                </v-autocomplete>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions class="pa-5">
            <v-spacer></v-spacer>
            <v-btn color="red" outlined @click="closeILPDSelection()">
              Close
            </v-btn>
            <v-btn
              v-if="internal_action == 'Add'"
              color="#5a67da"
              class="white--text"
              @click="addILPD()"
            >
              Add
            </v-btn>
            <v-btn
              v-if="internal_action == 'Update'"
              color="#5a67da"
              class="white--text"
              @click="updateData()"
            >
              Update
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <!-- END OF SELCTION DIALOG -->
    <!-- CONFIRM DELETE DIALOG -->
    <v-dialog v-model="confirmDeleteDialog" persistent max-width="390">
      <v-card color="white">
        <div class="pa-4 #3a3b3a--text">
          <div class="text-overline mb-1">WARNING!</div>
          <div class="text-body-1 mb-1">
            <p style="text-align: justify">
              <v-icon class="mt-n2" color="white">mdi-alert</v-icon> &nbsp; Are
              you sure you want to remove this and proceed?
            </p>
          </div>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="cancelDelete()">
            Close
          </v-btn>
          <v-btn color="green" class="white--text" @click="proceedDelete()">
            YES
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- END OF CONFIRM DELETE DIALOG -->
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
    isHrReceived: null,
  },
  data() {
    return {
      dialog: false,
      id: null,
      title: null,
      year: null,
      ld_actID: null,
      ildpCalendarID: null,
      isEditing: false,
      ildpCalendarList: [],
      // prog_head_userID: null,
      dean_userID: null,
      dean_name: null,
      hasDirectHead: null,
      vp_userID: null,
      president_userID: null,
      president_name: null,
      ildpCalendarSelected: [],
      itemsToRemove: [],
      usersList: [],
      indexToUpdate: null,
      years: [],
      ildpCreated: [],
      vpList: [],
      lndActivity: [
        {
          id: 1,
          title: "Seminars, Workshops, Training and Conferences",
        },
        {
          id: 2,
          title: "Advanced Studies/ Professional Development",
        },
        {
          id: 3,
          title: "Skills Certification/ Licensure/Eligibilities",
        },
        {
          id: 4,
          title:
            "Research, Extension, Production, Administration and Other Interests",
        },
      ],
      lndSelectionDialog: false,
      confirmDeleteDialog: false,
      internal_action: null,
      itemToDelete: null,
      itemIndexToDelete: null,
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
        this.getILDPCalendar();
        this.getUsers();
        this.getDirectHead();
        this.getVicePresident();
        this.getPresident();
        this.title = null;
        this.year = null;
        this.ld_actID = null;
        this.dialog = true;
        if (data.id != null) {
          this.ildpCalendarID = data.id;
          this.loadData(data.id, data.yearFrom, data.yearTo);
        } else {
          this.$refs.MyILDPFormref.reset();
          (this.ildpCalendarID = null),
            (this.vp_userID = null),
            (this.ildpCreated = []);
          this.years = [];
        }
        // this.selectItem();
      },
      deep: true,
    },
  },
  methods: {
    close() {
      this.dialog = false;

      this.eventHub.$emit("closeMyIldpDialog", false);
    },

    redirectTo() {
      var usertype = this.$store.state.user.usertype.description;
      if (this.$store.state.user.user.user_roleID == 5) {
        this.$router.push("/superadmin/my-direct-head");
      } else {
        this.$router.push("/" + usertype.toLowerCase() + "/my-direct-head");
      }
    },

    selectItem() {
      this.years = [];
      for (let i = 0; i < this.ildpCalendarList.length; i++) {
        const element = this.ildpCalendarList[i];
        if (element.id == this.ildpCalendarID) {
          this.ildpCalendarSelected = element;
        }
      }
      for (
        let i = parseInt(this.ildpCalendarSelected.yearFrom);
        i <= parseInt(this.ildpCalendarSelected.yearTo);
        i++
      ) {
        this.years.push(i);
      }
    },
    concatYear(item) {
      return item.yearFrom + " - " + item.yearTo;
    },
    getILDPCalendar() {
      console.log("trig");
      this.axiosCall("/my-ildp/getILDPYear", "GET").then((res) => {
        this.ildpCalendarList = res.data;
      });
    },

    loadData(id, yearFrom, yearTo) {
      this.axiosCall("/ildp/loadILDPYear/" + id, "GET").then((res) => {
        this.ildpCreated = res.data;

        this.years = [];
        // for (let i = 0; i < this.ildpCalendarList.length; i++) {
        //   const element = this.ildpCalendarList[i];
        //   if (element.id == this.ildpCalendarID) {
        //     this.ildpCalendarSelected = element;
        //   }
        // }
        for (let i = parseInt(yearFrom); i <= parseInt(yearTo); i++) {
          this.years.push(i);
        }
      });
    },

    addNewLND() {
      if (this.ildpCalendarID == null) {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message = "Please select a Calendar Year!";
      } else {
        this.lndSelectionDialog = true;
        this.internal_action = "Add";
        this.$refs.lndSelectionFormref.reset();
      }
    },

    addILPD() {
      if (this.$refs.lndSelectionFormref.validate()) {
        let data = {
          year: this.year,
          title: this.title,
          ld_actID: this.ld_actID,
        };
        this.ildpCreated.push(data);
        this.year = null;
        this.title = null;
        this.ld_actID = null;
        this.lndSelectionDialog = false;
      } else {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message = "Please fill out all fields!";
      }
    },

    closeILPDSelection() {
      this.year = null;
      this.title = null;
      this.ld_actID = null;
      this.isEditing = false;
      this.lndSelectionDialog = false;
    },

    updateData() {
      if (this.$refs.lndSelectionFormref.validate()) {
        for (let i = 0; i < this.ildpCreated.length; i++) {
          if (i == this.indexToUpdate) {
            this.ildpCreated[i].title = this.title;
            this.ildpCreated[i].year = this.year;
            this.ildpCreated[i].ld_actID = this.ld_actID;
          }
        }
        this.closeILPDSelection();
      }
      // this.cancel();
    },

    edit(item, index) {
      this.title = item.title;
      this.year = parseInt(item.year);
      this.ld_actID = item.ld_actID;
      this.isEditing = true;
      this.indexToUpdate = index;
      this.lndSelectionDialog = true;
      this.internal_action = "Update";
    },

    proceedDelete() {
      if (this.itemToDelete.id) {
        this.itemsToRemove.push(this.itemToDelete.id);
        this.ildpCreated.splice(this.itemIndexToDelete, 1);
      } else {
        this.ildpCreated.splice(this.itemIndexToDelete, 1);
      }
      this.confirmDeleteDialog = false;
    },

    remove(item, index) {
      this.itemToDelete = item;
      this.itemIndexToDelete = index;

      this.confirmDeleteDialog = true;
    },
    cancelDelete() {
      this.itemToDelete = null;
      this.itemIndexToDelete = null;
      this.confirmDeleteDialog = false;
    },

    getDirectHead() {
      this.axiosCall("/my-direct-head/getMyDirectHead", "GET").then((res) => {
        if (res.data) {
          if (res.data.length == 0) {
            this.hasDirectHead = false;
          } else {
            this.hasDirectHead = true;
            this.dean_name = res.data[0].name;
            this.dean_userID = res.data[0].userID;
          }
        }
      });
    },

    getVicePresident() {
      this.axiosCall("/user-details/getVicePres", "GET").then((res) => {
        if (res.data) {
          this.vpList = res.data;
        }
      });
    },

    getPresident() {
      this.axiosCall("/user-details/getCollegePres", "GET").then((res) => {
        if (res.data) {
          this.president_name = res.data.name;
          this.president_userID = res.data.userID;
        }
      });
    },

    getUsers() {
      this.axiosCall("/user-details/getAllUserDetail", "GET").then((res) => {
        this.usersList = res.data;
        // console.log(res.data);
      });
    },

    add() {
      let data = {
        ildp_calendarID: this.ildpCalendarSelected.id,
        ildps: JSON.stringify(this.ildpCreated),
        // prog_head_userID: this.prog_head_userID,
        dean_userID: this.dean_userID,
        vp_userID: this.vp_userID,
        president_userID: this.president_userID,
      };

      this.axiosCall("/ildp", "POST", data).then((res) => {
        if (res.data.status == 201) {
          this.dialog = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.message = res.data.msg;
          this.fadeAwayMessage.header = "System Message";
          this.close();
        } else if (res.data.status == 400) {
          this.dialog = false;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = res.data.msg;
          // this.close();
        }
      });
    },
    update() {
      let data = {
        ildp_calendarID: this.ildpCalendarSelected.id,
        ildps: JSON.stringify(this.ildpCreated),
        itemsToRemove: JSON.stringify(this.itemsToRemove),
      };
      this.axiosCall("/ildp/updateILPD", "POST", data).then((res) => {
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
          // this.close();
          // this.$emit("reloadTable");
        }
      });
    },
  },
};
</script>

<style scoped>
.clickme {
  text-decoration: underline;
  cursor: pointer;
  text-underline-offset: 2px;
}
.year {
  border: 1px solid #9e9e9e;
  border-bottom: none;
  border-top: none;
  width: 100%;
}
.lndList {
  display: list-item;

  list-style-position: inside;
}
</style>
