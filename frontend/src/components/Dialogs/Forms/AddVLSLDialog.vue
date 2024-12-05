<template>
  <div>
    <v-dialog
      v-model="dialog"
      fullscreen
      persistent
      scrollable
      max-width="800px"
    >
      <v-card>
        <v-card-title dark class="dialog-header">
          Add VL/SL Credits <v-spacer></v-spacer>
          <v-btn icon dark @click="close()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text
          style="max-height: 780px; max-width:1300px; margin: 0 auto; "
          class="mt-4"
        >
          <v-row>
            <v-col cols="12" class="d-flex justify-end">
              <div
                class="text-body-1 d-flex justify-space-evenly align-center "
              >
                <span class="mr-2 ">For the month of</span>
                <v-autocomplete
                  @change="loadPlantillaEmployees()"
                  v-model="selectedMonth"
                  item-text="text"
                  :rules="[formRules.required]"
                  item-value="num"
                  dense
                  outlined
                  class="rounded-lg mt-5"
                  color="#5a67da"
                  :items="monthsArr"
                >
                </v-autocomplete>
                <span class="ml-2 font-weight-bold ">{{ creditsFor }}</span>
              </div>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                outlined
                prepend-inner-icon="search"
                label="Search"
                single-line
                hide-details
                class="rounded-lg"
                color="#5a67da"
                dense
              ></v-text-field>
            </v-col>
          </v-row>

          <v-card class="my-5 dt-container" elevation="0" outlined>
            <v-data-table
              :headers="headers"
              :items="employeeList"
              :items-per-page="10"
              :search="search"
              :options.sync="options"
              :loading="loading"
              @pagination="pagination"
              hide-default-footer
            >
              <template v-slot:[`item.action`]="{ item }">
                <v-btn
                  class="mx-1"
                  color="grey"
                  outlined
                  x-small
                  @click="editItem(item)"
                >
                  <v-icon size="14">mdi-pencil</v-icon>
                  Edit</v-btn
                >
                <v-btn
                  class="mx-1"
                  color="red"
                  outlined
                  x-small
                  @click="removeItem(item)"
                >
                  <v-icon size="14">mdi-trash-can</v-icon>
                  remove</v-btn
                >
              </template>

              <template v-slot:[`item.name`]="{ item }">
                {{ toTitleCase(item.name) }}
              </template>
              <!-- <template v-slot:[`item.vl`]="{ item }">
                {{ item.vl ? 1.25 : 1.25 }}
              </template>
              <template v-slot:[`item.sl`]="{ item }">
                {{ item.sl ? 1.25 : 1.25 }}
              </template> -->
            </v-data-table>
          </v-card>
          <v-row class="mb-2 mx-5" align="center">
            <v-col
              cols="auto"
              class="mr-auto text-truncate flex-items"
              no-gutters
            >
              <span class="px-2">Show</span>
              <span>
                <v-select
                  dense
                  outlined
                  hide-details
                  :value="options.itemsPerPage"
                  style="max-width: 90px"
                  class="rounded-lg"
                  color="#5a67da"
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
                color="#5a67da"
                :length="paginationData.pageCount"
              >
              </v-pagination>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-5">
          <v-spacer></v-spacer>
          <v-btn
            color="red"
            outlined
            @click="
              close();
              dialog = false;
            "
          >
            <v-icon>mdi-close-circle-outline</v-icon>
            Cancel
          </v-btn>
          <v-btn
            :color="$vuetify.theme.themes.light.submitBtns"
            class="white--text"
            @click="confirmSubmit()"
          >
            <v-icon>mdi-check-circle</v-icon>
            SUBMIT
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- edit credits dialog -->
    <v-dialog v-model="editCreditDialog" persistent max-width="400">
      <v-card color="white">
        <v-form ref="CreditsFormref" @submit.prevent>
          <v-card-title dark class="dialog-header pt-2 pb-2 pl-6">
            <span>Edit Credit</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="editCreditDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 400px" class="my-4"> </v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="12"
                v-if="itemToEdit ? itemToEdit.isPlainFaculty == 0 : ''"
              >
                <v-text-field
                  dense
                  outlined
                  label="Vacation Leave Credit"
                  v-model="vlInput"
                  :rules="
                    itemToEdit
                      ? itemToEdit.isPlainFaculty == 0
                        ? [formRules.numberRequired]
                        : []
                      : ''
                  "
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  dense
                  outlined
                  label="Sick Leave Credit"
                  v-model="slInput"
                  :rules="[formRules.numberRequired]"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" outlined @click="editCreditDialog = false">
              Close
            </v-btn>
            <v-btn
              @click="saveEdit()"
              :color="$vuetify.theme.themes.light.submitBtns"
              class="white--text"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- confirmation dialog -->
    <v-dialog v-model="confirmDialog" persistent max-width="390">
      <v-card color="white">
        <div class="pa-4 #3a3b3a--text">
          <div class="text-h6 mb-1">WARNING!</div>
          <div class="text-body-1 mb-1">
            <p style="text-align: justify">
              <v-icon class="mt-n2" color="white">mdi-alert</v-icon> &nbsp; Are
              you sure you want to save this and proceed?
            </p>
          </div>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="confirmDialog = false">
            Close
          </v-btn>
          <v-btn
            :color="$vuetify.theme.themes.light.submitBtns"
            :loading="btnLoading"
            :disabled="btnLoading"
            class="white--text"
            @click="proceedAction()"
          >
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- delete confirmation -->
    <v-dialog v-model="confirmRemoveDialog" persistent max-width="390">
      <v-card color="white">
        <div class="pa-4 #3a3b3a--text">
          <div class="text-h6 mb-1">WARNING!</div>
          <div class="text-body-1 mb-1">
            <p style="text-align: justify">
              <v-icon class="mt-n2" color="white">mdi-alert</v-icon> &nbsp; Are
              you sure you want to remove
              <span class="font-weight-bold">{{
                toDelete ? toDelete.name : ""
              }}</span>
              ?
            </p>
          </div>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" outlined @click="confirmRemoveDialog = false">
            Close
          </v-btn>
          <v-btn
            :color="$vuetify.theme.themes.light.submitBtns"
            :loading="btnLoading"
            :disabled="btnLoading"
            class="white--text"
            @click="proceedDelete()"
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
  },
  data() {
    return {
      confirmDialog: false,
      dialog: false,
      options: {},
      search: "",
      paginationData: {},
      editCreditDialog: false,
      confirmRemoveDialog: false,
      vlInput: null,
      slInput: null,
      itemToEdit: null,
      perPageChoices: [
        { text: "5", value: 5 },
        { text: "10", value: 10 },
        { text: "20", value: 20 },
        { text: "50", value: 50 },
        { text: "100", value: 100 },
        { text: "250", value: 250 },
        { text: "500", value: 500 },
      ],
      headers: [
        {
          text: "Name",
          value: "name",
          align: "start",
          valign: "center",
        },
        {
          text: "Vacation Leave",
          value: "vlCredit",
          align: "center",
          valign: "center",
        },
        {
          text: "Sick Leave",
          value: "slCredit",
          align: "center",
          valign: "center",
        },
        {
          text: "Action",
          value: "action",
          align: "center",
          valign: "center",
        },
      ],
      monthsArr: [
        {
          num: "01",
          text: "January",
        },
        {
          num: "02",
          text: "February",
        },
        {
          num: "03",
          text: "March",
        },
        {
          num: "04",
          text: "April",
        },
        {
          num: "05",
          text: "May",
        },
        {
          num: "06",
          text: "June",
        },
        {
          num: "07",
          text: "July",
        },
        {
          num: "08",
          text: "August",
        },
        {
          num: "09",
          text: "September",
        },
        {
          num: "10",
          text: "October",
        },
        {
          num: "11",
          text: "November",
        },
        {
          num: "12",
          text: "December",
        },
      ],
      loading: false,
      btnLoading: false,
      toDelete: null,
      employeeList: [],
      credits: null,
      creditsFor: null,
      selectedMonth: null,
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
        // if (data) {
        console.log(data);
        this.initialize();
        this.selectedMonth = null;
        this.employeeList = [];
        this.dialog = true;
        // this.loadPlantillaEmployees();
      },
      deep: true,
    },
    options: {
      handler() {},
      deep: true,
    },
  },
  methods: {
    pagination(data) {
      this.paginationData = data;
    },
    initialize() {
      var d = new Date();
      d.setMonth(d.getMonth() - 1);
      // let dd = new Date(d.toLocaleDateString());
      // let y =
      this.creditsFor = d.getFullYear();
    },

    loadPlantillaEmployees() {
      this.employeeList = [];
      this.loading = true;
      this.axiosCall(
        "/leave-credits/getPlantillaEmployeesToAddCredits/" +
          this.selectedMonth +
          "/" +
          this.creditsFor,
        "GET"
      ).then((res) => {
        this.employeeList = res.data;
        for (let i = 0; i < this.employeeList.length; i++) {
          if (this.employeeList[i].isPlainFaculty == 1) {
            Object.assign(this.employeeList[i], {
              vlCredit: null,
              slCredit: 1.25,
            });
          } else {
            Object.assign(this.employeeList[i], {
              vlCredit: 1.25,
              slCredit: 1.25,
            });
          }
        }
        // console.log(this.employeeList);
        this.loading = false;
      });
    },

    close() {
      this.eventHub.$emit("closeAddVLSLDialog", false);
      this.confirmDialog = false;
      this.dialog = false;
    },

    getName(id) {
      let name;
      for (let i = 0; i < this.employeeList.length; i++) {
        if (this.employeeList[i].empID == id) {
          name = this.employeeList[i].name;
        }
      }
      return name;
    },

    editItem(item) {
      this.itemToEdit = item;
      this.vlInput = item.vlCredit;
      this.slInput = item.slCredit;
      this.editCreditDialog = true;
    },

    removeItem(item) {
      this.toDelete = item;
      this.confirmRemoveDialog = true;
    },

    saveEdit() {
      if (this.$refs.CreditsFormref.validate()) {
        if (this.itemToEdit.isPlainFaculty == 0) {
          for (let i = 0; i < this.employeeList.length; i++) {
            if (this.itemToEdit.empID == this.employeeList[i].empID) {
              this.employeeList[i].vlCredit = this.vlInput;
              this.employeeList[i].slCredit = this.slInput;
            }
          }
        } else {
          for (let i = 0; i < this.employeeList.length; i++) {
            if (this.itemToEdit.empID == this.employeeList[i].empID) {
              this.employeeList[i].slCredit = this.slInput;
            }
          }
        }
        this.$refs.CreditsFormref.resetValidation();
        this.$refs.CreditsFormref.reset();
        this.editCreditDialog = false;
      }
    },

    confirmSubmit() {
      this.confirmDialog = true;
    },
    proceedAction() {
      this.btnLoading = true;
      this.addCredits();
    },

    proceedDelete() {
      for (let i = 0; i < this.employeeList.length; i++) {
        if (this.employeeList[i].empID == this.toDelete.empID) {
          this.employeeList.splice(i, 1);
        }
      }

      this.toDelete = null;
      this.confirmRemoveDialog = false;
    },

    addCredits() {
      if (this.employeeList.length > 0) {
        if (this.selectedMonth != null) {
          let data = {
            mnth: this.selectedMonth,
            yr: this.creditsFor,
            employeeList: this.employeeList,
          };
          this.axiosCall("/leave-credits/", "POST", data).then((res) => {
            this.btnLoading = false;
            if (res.data.status == 201) {
              this.dialog = false;
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "success";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;

              this.close();
            } else if (res.data.status == 400) {
              this.fadeAwayMessage.show = true;
              this.fadeAwayMessage.type = "error";
              this.fadeAwayMessage.header = "System Message";
              this.fadeAwayMessage.message = res.data.msg;
            }
          });
        } else {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.header = "System Message";
          this.fadeAwayMessage.message = "Please select Month to save credit!";
        }
      } else {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message = "Employee list is empty!";
      }
    },

    getOffices() {
      this.axiosCall("/offices", "GET").then((res) => {
        this.officeList = res.data;
      });
    },

    getTypeOfLeaves() {
      this.axiosCall("/types-of-leave", "GET").then((res) => {
        this.type_of_leave_list = res.data;
      });
    },
  },
};
</script>
<style scoped>
table {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
}
table tr th,
table tr td {
  border-right: 1px solid #bbb;
  border-bottom: 1px solid #bbb;
  padding: 5px;
}

table tr th:first-child,
table tr td:first-child {
  border-left: 1px solid #bbb;
}
table tr th {
  background: #eee;

  border-top: solid 1px #bbb;
}

/* top-left border-radius */
table tr:first-child th:first-child {
  border-top-left-radius: 6px;
}

/* top-right border-radius */
table tr:first-child th:last-child {
  border-top-right-radius: 6px;
}

/* bottom-left border-radius */
table tr:last-child td:first-child {
  border-bottom-left-radius: 6px;
}

/* bottom-right border-radius */
table tr:last-child td:last-child {
  border-bottom-right-radius: 6px;
}
</style>
