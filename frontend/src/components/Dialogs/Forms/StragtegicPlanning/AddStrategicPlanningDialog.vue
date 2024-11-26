<template>
  <div>
    <v-dialog v-model="dialog" persistent eager scrollable max-width="900px">
      <v-form ref="AddStrategicPriority" @submit.prevent>
        <v-card>
          <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>{{ action }} Strategic Planning</span>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="closeD()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text style="max-height: 700px" class="my-4">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-textarea
                    label="Title"
                    outlined
                    v-model="title"
                    dense
                    :rules="[formRules.required]"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-textarea>
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    v-model="dateFrom"
                    dense
                    outlined
                    class="rounded-lg"
                    item-text="description"
                    item-value="id"
                    label="Year From"
                    color="#93CB5B"
                    @change="onChangeDateFrom($event)"
                    :items="yearListFrom"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="dateTo"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    readonly
                    label="Year To"
                    class="rounded-lg"
                    color="#6DB249"
                  ></v-text-field>
                </v-col>
                <v-col cols="12"> </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions class="pa-5">
            <v-spacer></v-spacer>

            <v-btn color="red" outlined @click="closeD()">
              <v-icon>mdi-close-circle-outline</v-icon>
              Cancel
            </v-btn>

            <v-btn
              color="#519043"
              class="white--text"
              v-if="action == 'Add'"
              @click="addnew()"
            >
              <v-icon>mdi-check-circle</v-icon>
              Add
            </v-btn>
            <v-btn
              color="#519043"
              class="white--text"
              v-if="action == 'Update'"
              @click="update()"
            >
              <v-icon>mdi-check-circle</v-icon>
              Update
            </v-btn>
          </v-card-actions>
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
      :timeout="3000"
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
      id: null,
      dialog: false,
      fadeAwayMessage: {
        show: false,
        type: "success",
        header: "Successfully Added!",
        message: "",
        top: 10,
      },
      yearListFrom: [],
      period: null,
      assessed_by_user: null,
      final_rating_by_user: null,
      dateFrom: null,
      dateTo: null,
      minimumRequired: null,
      periodList: [
        {
          id: 1,
          description: "January to June",
        },
        {
          id: 2,
          description: "July to December",
        },
        {
          id: 3,
          description: "January to December",
        },
      ],
      title: null,
      presidentUser: null,
      isHeadPresident: null,
      usersList: [],
      recommendingUsersList: [],
    };
  },
  watch: {
    data: {
      handler(data) {
        console.log("Year Form", data.yearFrom);
        this.dialog = true;
        this.loadYearFrom();
        this.getUsers();
        if (data.id) {
          this.period = data.period;
          this.id = data.id;
          this.year = data.year;
          this.title = data.title;
          this.dateFrom = data.yearFrom;
          this.dateTo = data.yearTo;
        } else {
          this.period = null;
          this.id = null;
          this.year = null;
          this.title = data.title;
          this.dateFrom = data.yearFrom;
          this.dateTo = data.yearTo;
        }
      },

      deep: true,
    },
  },

  methods: {
    initialize() {},

    getUsers() {
      this.axiosCall("/user-details/getDeanDirAboveUsers", "GET").then(
        (res) => {
          let data = res.data;
          data.forEach((element, i) => {
            data[i].name = this.toTitleCase(element.name);
          });
          this.usersList = data;
          // console.log(res.data);
        }
      );
    },

    loadYearFrom() {
      let d = new Date();

      let yr = d.getFullYear();

      for (let i = yr; i < yr + 10; i++) {
        this.yearListFrom.push(i);
      }
    },
    onChangeDateFrom(data) {
      this.dateTo = data + 4;
    },

    closeD() {
      this.eventHub.$emit("closeStrategicPriority", false);
      this.dialog = false;
    },

    addnew() {
      if (this.$refs.AddStrategicPriority.validate()) {
        let data = {
          title: this.title,
          yearFrom: this.dateFrom,
          yearTo: this.dateTo,
        };

        this.axiosCall("/strategic-planning", "POST", data).then((res) => {
          if (res.data.status == 201) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.closeD();
          } else {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
          }
        });
      }
    },

    update() {
      if (this.$refs.AddStrategicPriority.validate()) {
        let data = {
          title: this.title,
          yearFrom: this.dateFrom,
          yearTo: this.dateTo,
        };

        this.axiosCall(
          "/strategic-planning/updateStrategicPlanning/" + this.id,
          "PATCH",
          data
        ).then((res) => {
          if (res.data.status == 200) {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.closeD();
          } else {
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
          }
        });
      }
    },
  },
};
</script>
