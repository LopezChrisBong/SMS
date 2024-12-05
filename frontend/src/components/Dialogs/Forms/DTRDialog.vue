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
          Add Employee DTR <v-spacer></v-spacer>
          <v-btn icon dark @click="close()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text
          style="max-height: 780px; max-width:1300px; margin: 0 auto; "
          class="mt-4"
        >
          <v-row>
            <v-col cols="6" class="">
              <div class="text-h6 d-flex item-center">
                <div class="mx-2"></div>
                <!-- <span>{{ formatDate(dateToSave) }}</span> -->
                <!-- <v-select
                  class=" mt-2"
                  label="Year"
                  color="#5a67da"
                  dense
                  @change="filterPlantillaEmployees()"
                  outlined
                  v-model="yearSelected"
                  :items="years"
                ></v-select> -->
              </div>
            </v-col>
            <v-col cols="6">
              <v-file-input
                @change="parseCSV()"
                clearable
                outlined
                dense
                label="Upload File"
                accept=".csv"
                class="rounded-lg"
                v-model="csv_file"
              ></v-file-input>
            </v-col>
            <!-- <v-col cols="6" class="d-flex justify-end">
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                outlined
                prepend-inner-icon="search"
                label="Search"
                single-line
                hide-details
                class="mx-1 rounded-lg"
                color="#5a67da"
                dense
              ></v-text-field>
              <v-btn
                @click="addData()"
                color="#5a67da"
                class="mx-1 white--text"
              >
                <v-icon>mdi-plus</v-icon>
                add
              </v-btn>
            </v-col> -->
          </v-row>

          <v-card class="my-5 dt-container" elevation="0" outlined>
            <v-data-table
              :headers="headers"
              :items="csv_results.data"
              :items-per-page="10"
              :search="search"
              :options.sync="options"
              :loading="loading"
              @pagination="pagination"
              hide-default-footer
            >
              <template v-slot:[`item.empID`]="{ item }">
                {{ getName(item.empID) }}
              </template>
              <template v-slot:[`item.action`]="{ item, index }">
                <v-btn
                  @click="edit(item, index)"
                  class="mx-1"
                  x-small
                  color="#5a67da"
                  outlined
                >
                  edit </v-btn
                ><v-btn
                  @click="remove(index)"
                  class="mx-1"
                  x-small
                  color="red"
                  outlined
                >
                  Remove
                </v-btn>
              </template>
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
                :color="$vuetify.theme.themes.light.submitBtns"
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
            :loading="btnLoading"
            :disabled="btnLoading"
            :color="$vuetify.theme.themes.light.submitBtns"
            class="white--text"
            @click="submit()"
          >
            <v-icon>mdi-check-circle</v-icon>
            SUBMIT
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
import Papa from "papaparse";
export default {
  props: {
    data: null,
    action: null,
  },
  data() {
    return {
      dialog: false,
      options: {},
      csv_results: [],
      csv_file: null,
      parsed: false,
      search: "",
      paginationData: {},

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
          text: "Date",
          value: "theDate",
          align: "center",
          valign: "center",
        },

        {
          text: "Employee ID",
          value: "employee_id",
          align: "start",
          valign: "center",
        },
        {
          text: "Employee",
          value: "employee",
          align: "center",
          valign: "center",
        },

        {
          text: "AM IN",
          value: "amIn",
          align: "center",
          valign: "center",
        },
        {
          text: "AM OUT",
          value: "amOut",
          align: "center",
          valign: "center",
        },
        {
          text: "PM IN",
          value: "pmIn",
          align: "center",
          valign: "center",
        },
        {
          text: "PM OUT",
          value: "pmOut",
          align: "end",
          valign: "end",
        },
      ],

      loading: false,
      employeeList: [],
      addedEmployees: [],
      btnLoading: false,
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
        this.csv_file = null;
        this.csv_results = [];
        this.dialog = true;
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
    parseCSV() {
      Papa.parse(this.csv_file, {
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
          console.log("results", results);
          this.csv_results = results;
          this.parsed = true;
        }.bind(this),
      });
    },

    // decodeCSV(result) {
    //   this.csv_results = result.data;
    //   //   console.log(data);
    //   if (this.csv_results) {
    //     for (let i = 0; i < this.csv_results.length; i++) {
    //       if (
    //         this.csv_results[i].NAME == "" ||
    //         this.csv_results[i].NAME == null
    //         // this.csv_results[i].LAST_NAME == "" ||
    //         // this.csv_results[i].LAST_NAME == null
    //       ) {
    //         this.csv_results.splice(i, 1);
    //       }
    //     }
    //   }
    // },

    initialize() {},

    close() {
      this.eventHub.$emit("closeDTRDialog", false);
      this.dialog = false;
    },

    submit() {
      this.btnLoading = true;
      if (this.csv_results.data.length > 0) {
        let data = {
          dtrData: JSON.stringify(this.csv_results.data),
        };
        this.axiosCall("/dtr", "POST", data).then((res) => {
          if (res.data.status == 201) {
            // if (res.data.nameList.length > 0) {
            //   this.nameList = res.data.nameList;
            //   this.nameListDialog = true;
            // } else {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.close();
            // }
          } else if (res.data.status == 400) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
          }
          this.btnLoading = false;
        });
      } else {
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.header = "System Message";
        this.fadeAwayMessage.message = "No employee added!";
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
