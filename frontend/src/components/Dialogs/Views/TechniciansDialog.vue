<template>
   <v-dialog
      v-model="dialog"
      scrollable
      max-width="1200px"
    >
     <v-card>
        <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">
            <span>{{data.firstName}} {{data.lastName}} - {{data.city.name}}, {{data.country.name}}</span>
        <v-spacer></v-spacer>
       <v-btn
            icon
            dark
            @click="dialog = false"
        >
            <v-icon>mdi-close</v-icon>
        </v-btn>
          </v-card-title>
    <v-col>
      <v-tabs
        color="#239FAB"
        background-color="transparent"
        show-arrows
      >
        <v-tabs-slider color="#239FAB"></v-tabs-slider>
        <v-tab
          v-for="tab in tabs"
          :key="tab.id"
          @click="changeTab(tab)"
        >
        <v-icon class="mr-2">mdi-check-circle-outline</v-icon>
          {{ tab.description }}
        </v-tab>
      </v-tabs>
      </v-col>
       <v-col class="pl-8 pr-8">
        <h2 class="text-h6">{{tab.description}}</h2>
        <v-divider></v-divider>
      </v-col>

  <v-card-text style="max-height: 700px;" class="my-4">
   <div v-if="tab.id == 1">
    <v-container>
            <v-row class="ml-2 mr-2">
                <v-col>
                <span class="text-body-1 font-weight-medium">
                    <span class="red--text">* </span>First Name
                </span>
                  <v-text-field 
                    dense
                    outlined
                    required
                    color="#239FAB"
                    ></v-text-field>
                </v-col>
               <v-col>
                <span class="text-body-1 font-weight-medium">
                    Middle Name <span class="grey--text"> (optional)</span> 
                </span>
                  <v-text-field
                    dense
                    outlined
                    color="#239FAB"
                    ></v-text-field>
                </v-col>
                <v-col>
                <span class="text-body-1 font-weight-medium">
                     <span class="red--text">* </span>Last Name 
                </span>
                  <v-text-field
                    dense
                    outlined
                    required
                    color="#239FAB"
                    ></v-text-field>
                </v-col>
                <v-col>
                <span class="text-body-1 font-weight-medium">
                    Suffix <span class="grey--text"> (optional)</span> 
                </span>
                  <v-text-field
                    dense
                    outlined
                    color="#239FAB"
                    ></v-text-field>
                </v-col>
            </v-row>
    </v-container>
    <v-container>
            <v-row class="ml-2 mr-2">
                <v-col>
                <span class="text-body-1 font-weight-medium">
                   <span class="red--text">* </span>Country
                </span>
                  <v-text-field
                    dense
                    outlined
                    required
                    color="#239FAB"
                    ></v-text-field>
                </v-col>
               <v-col>
                <span class="text-body-1 font-weight-medium">
                   <span class="red--text">* </span>City
                </span>
                  <v-text-field
                    dense
                    outlined
                    required
                    color="#239FAB"
                    ></v-text-field>
                </v-col>
                <v-col md="6">
                <span class="text-body-1 font-weight-medium">
                    <span class="red--text">* </span>Complete Address
                </span>
                  <v-text-field
                    dense
                    outlined
                    required
                    color="#239FAB"
                    ></v-text-field>
                </v-col>
            </v-row>
    </v-container>
    <v-container>
            <v-row class="ml-2 mr-2">
                <v-col>
                <span class="text-body-1 font-weight-medium">
                    <span class="red--text">* </span>Personal Email Address
                </span>
                  <v-text-field
                    dense
                    outlined
                    required
                    color="#239FAB"
                    ></v-text-field>
                </v-col>
               <v-col>
                <span class="text-body-1 font-weight-medium">
                   <span class="red--text">* </span>DSH Email Address
                </span>
                  <v-text-field
                    dense
                    outlined
                    required
                    color="#239FAB"
                    ></v-text-field>
                </v-col>
                <v-col>
                <span class="text-body-1 font-weight-medium">
                    <span class="red--text">* </span>Cell/ Phone Number
                </span>
                  <v-text-field
                    dense
                    outlined
                    required
                    color="#239FAB"
                    ></v-text-field>
                </v-col>
            </v-row>
    </v-container>
    <v-container>
            <v-row class="ml-2 mr-2">
                <v-col cols="4">
                <span class="text-body-1 font-weight-medium">
                    Status
                </span>
                  <v-select
                    dense
                    :items="items"
                    label="Active"
                    outlined
                  ></v-select>
                </v-col>
            </v-row>
    </v-container>
  </div>

  <div v-if="tab.id == 2">
    <v-container>
            <v-row class="ml-2 mr-2">
                <v-col>
                <span class="text-body-1 font-weight-medium">
                    Select Date
                </span>
                   <v-menu
                    ref="work_dates_menu"
                    :close-on-content-click="false"
                    :return-value.sync="formdata.work_dates"
                    transition="scale-transition"
                    offset-y
                    >
                    <template v-slot:activator="{ on, attrs }">
                        <v-combobox
                        outlined
                        v-model="formdata.work_dates"
                        prepend-inner-icon="mdi-calendar"
                        label="Availability Date"
                        readonly
                        single-line
                        v-bind="attrs"
                        v-on="on"
                        color="#239FAB"
                        class="rounded-lg"
                        hide-details
                        dense
                        ></v-combobox>
                    </template>
                    <v-date-picker
                        v-model="formdata.work_dates"
                        no-title
                        scrollable
                        range
                        color="#239FAB"
                    >
                        <v-spacer></v-spacer>
                        <v-btn outlined color="#239FAB" @click="work_dates_menu = false">
                        Cancel
                        </v-btn>
                        <v-btn
                        color="#239FAB"
                        class="white--text"
                        @click="$refs.work_dates_menu.save(formdata.work_dates)"
                        >
                        OK
                        </v-btn>
                    </v-date-picker>
                    </v-menu>
                </v-col>
               <v-col>
                <span class="text-body-1 font-weight-medium">
                    Select Day 
                </span>
                  <v-text-field
                    dense
                    outlined
                    color="#239FAB"
                    ></v-text-field>
                </v-col>
                <v-col>
                <span class="text-body-1 font-weight-medium">
                    Set Time
                </span>
                  <v-text-field
                    dense
                    outlined
                    required
                    color="#239FAB"
                    ></v-text-field>
                </v-col>
                <v-col>
                <span class="text-body-1 font-weight-medium">
                  Type 
                </span>
                  <v-text-field
                    dense
                    outlined
                    color="#239FAB"
                    ></v-text-field>
                </v-col>
            </v-row>
    </v-container>
  </div>

  <div v-if="tab.id == 3">
      <v-container>
            <v-row class="ml-2 mr-2">
                <v-col>
                <span class="text-body-1 font-weight-medium">
                   Curriculum Vitae (CV) <span class="grey--text"> (optional)</span>
                </span>
                  <v-text-field
                    dense
                    outlined
                    required
                    color="#239FAB"
                    ></v-text-field>
                </v-col>
               <v-col>
                <span class="text-body-1 font-weight-medium">
                    SA <span class="grey--text"> (optional)</span>
                </span>
                  <v-text-field
                    dense
                    outlined
                    color="#239FAB"
                    ></v-text-field>
                </v-col>
                <v-col>
                <span class="text-body-1 font-weight-medium">
                    NDA <span class="grey--text"> (optional)</span>
                </span>
                  <v-text-field
                    dense
                    outlined
                    required
                    color="#239FAB"
                    ></v-text-field>
                </v-col>
                <v-col>
                <span class="text-body-1 font-weight-medium">
                    Tech Info <span class="grey--text"> (optional)</span>
                </span>
                  <v-text-field
                    dense
                    outlined
                    color="#239FAB"
                    ></v-text-field>
                </v-col>
            </v-row>
    </v-container>
    <v-container>
            <v-row class="ml-2 mr-2">
                <v-col>
                <span class="text-body-1 font-weight-medium">
                   Language Level in English
                </span>
                  <v-text-field
                    dense
                    outlined
                    required
                    color="#239FAB"
                    ></v-text-field>
                </v-col>
               <v-col>
                <span class="text-body-1 font-weight-medium">
                   Language Level in Japanese
                </span>
                  <v-text-field
                    dense
                    outlined
                    color="#239FAB"
                    ></v-text-field>
                </v-col>
            </v-row>
    </v-container>
  </div>
      </v-card-text>    
     </v-card>      
    </v-dialog>
</template>

<script>
export default {
    props: {
        data: null,
        action: null,
    },
    data () {
      return {
        dialog: false,
        formdata: [],
        work_dates_menu: false,
        tabs: [
           { id: 1, description: 'Technician Infomation' },
           { id: 2, description: 'Availability' },
           { id: 3, description: 'Onboarding Docs' },
        ],
        tab: { id: 1, description: 'Technician Infomation' },
      }
    },
    watch: {
      data: {
        handler (data) {
        if(data){
            this.dialog = true;
        }
        },
        deep: true,
      },
    },
    methods: {
      changeTab(data){
        this.tab = data;
      }
    },
}
</script>