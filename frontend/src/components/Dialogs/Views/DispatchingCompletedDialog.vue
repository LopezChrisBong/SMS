<template>
<div>
    <v-dialog
      v-model="dialog"
      scrollable
      persistent
      width="1000"
    >
      <v-card class="overflow-x-hidden">
        <v-card-title dark class="dialog-header">{{tab.description || tabs[tab].description}}
        <v-spacer></v-spacer>
       <v-btn
            icon
            dark
            @click="closeDialog()"
        >
            <v-icon>mdi-close</v-icon>
        </v-btn>
          </v-card-title>
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
        <v-icon class="mr-2">{{tab.icon}}</v-icon>
          {{ tab.description }}
        </v-tab>
      </v-tabs>
        <v-card-text style="max-height: 800px;" class="my-4">
    <v-row>
      <v-col cols="12">
        <h2 class="mb-2 mt-5">{{tab.description}}</h2>
        <v-divider></v-divider>
      </v-col>
      <v-col cols="12">
      <v-form ref="work_detail_form">
        <v-row v-if="tab.id == 1" class="mx-1">
          <v-col cols="12" md="6">
            Work Ticket Order: <b>{{data.wticket_order}}</b>
          </v-col>
          <v-col cols="12" md="6">
            Type of Request: <b v-if="data.requesttype">{{data.requesttype.description}}</b>
          </v-col>
          <v-col cols="12" md="6">
            Method: <b v-if="data.workMethodId">{{data.workMethodId}}</b>
          </v-col>
          <v-col cols="12" md="6">
            Ticket No.: <b>{{data.ticket_no}}</b>
          </v-col>
          <v-col cols="12" md="12">
            Work Description: <b>{{data.work_desc}}</b>
          </v-col>
          <v-col cols="12">
            <h4>Client Details</h4>
            <v-divider></v-divider>
          </v-col>
          <v-col cols="12" md="6">
            Client: <b v-if="data.client">{{data.client.name}}</b>
          </v-col>
          <v-col cols="12" md="6">
            End Client: <b v-if="data.endclient">{{data.endclient.name}}</b>
          </v-col>
          <v-col cols="12" md="6">
            Client Address: <b v-if="data.client && data.city">{{data.client.address + ', ' + data.city.name}}</b>
          </v-col>
          <v-col cols="12" md="6">
            End-Client Address: <b v-if="data.endclient && data.city">{{data.endclient.address + ', ' + data.city.name}}</b>
          </v-col>
          <v-col cols="12">
            <h4>Technician/s</h4>
            <v-divider></v-divider>
          </v-col>
          <v-col cols="12" md="12">
            All Technicians: <b v-if="data.technician">{{getTechNames(data.technician).join(', ') }}</b>
          </v-col>
          <v-col cols="12" md="12" v-if="data.tag_technician">
            Main Technician/s: <b>{{getTechNames(data.tag_technician).join(', ')}}</b>
          </v-col>
          <v-col cols="12">
            <h4>Schedule</h4> 
            <v-divider></v-divider>
          </v-col>
          <v-col cols="12" md="6">
            Work Date: <b>{{formatDate(data.wdate)}}</b>
          </v-col>
          <v-col cols="12" md="6">
            Schedule of Request: <b v-if="data.requestsched">{{data.requestsched.description}}</b>
          </v-col>
          <v-col cols="12" md="6">
            Rate Schedule: <b v-if="data.ratesched">{{data.ratesched.description}}</b>
          </v-col>
          <v-col cols="12" md="6">
            Estimated Time of Arrival: <b>{{data.eta}}</b>
          </v-col>
          <v-col cols="12" md="6">
            Start Time: <b>{{data.start_time}}</b>
          </v-col>
          <v-col cols="12" md="6">
            End Time: <b>{{data.end_time}}</b>
          </v-col>
          <v-col cols="12" md="6">
            Break Time: <b>{{data.break_time}}</b>
          </v-col>
          <v-col cols="12" md="6">
            Total Work Hours: <b>{{data.total_work_time}}</b>
          </v-col>
          <v-col cols="12" md="6">
            Actual Work Hours: <b>{{data.actual_work_hour}}</b>
          </v-col>
        </v-row>
        <v-row v-if="tab.id == 2" class="mx-1">
          <v-col cols="12" md="6">
            Whatsapp GC Created? <b>{{getStatus(data.workbefore.GC_created)}}</b>
          </v-col>
          <v-col cols="12" md="6">
            WO Ticket Provided? <b>{{getStatus(data.workbefore.WOTicketProvided)}}</b>
          </v-col>
          <v-col cols="12" md="6">
            Site Location and POC Confirmed? <b>{{getStatus(data.workbefore.SiteandPOConfirmed)}}</b>
          </v-col>
          <v-col cols="12" md="6">
            Reminded Tech a Day Before? <b>{{getStatus(data.workbefore.TechReminded)}}</b>
          </v-col>
          <v-col cols="12" md="12">
            Facebook Link: <b>{{getStatus(data.workbefore.FBLink)}}</b>
          </v-col>
        </v-row>
        <v-row v-if="tab.id == 3" class="mx-1">
          <v-col cols="12" md="4">
            Work Completed? <b>{{getStatus(data.workafter.WorkCompleted)}}</b>
          </v-col>
          <v-col cols="12" md="4">
            Released by RE? <b>{{getStatus(data.workafter.ReleasedByRE)}}</b>
          </v-col>
          <v-col cols="12" md="4">
            Service Work Report Signed? <b>{{getStatus(data.workafter.SWRSigned)}}</b>
          </v-col>
          <v-col cols="12" md="4">
            FE Report Created? <b>{{getStatus(data.workafter.FERepCreated)}}</b>
          </v-col>
          <v-col cols="12" md="4">
            Service Work Report Sent? <b>{{getStatus(data.workafter.SWRSent)}}</b>
          </v-col>
          <v-col cols="12" md="4">
            FE Report Sent? <b>{{getStatus(data.workafter.FERepSent)}}</b>
          </v-col>
          <v-col cols="12" md="4">
            Supportive Photo Sent? <b>{{getStatus(data.workafter.SupportPhotoSent)}}</b>
          </v-col>
          <v-col cols="12" md="4">
            Save Report on GDrive? <b>{{getStatus(data.workafter.SavedReptoGDrive)}}</b>
          </v-col>
          <v-col cols="12" md="4">
            Saved Photos on GDrive? <b>{{getStatus(data.workafter.SavedPhotostoGDrive)}}</b>
          </v-col>
          <v-col cols="12" md="12">
            GDrive Link: <b>{{data.workafter.GDriveLink}}</b>
          </v-col>
        </v-row>
        <v-row v-if="tab.id == 4" class="mx-1">
          <v-col cols="12" md="12">
            Note: <b>{{data.worknote.note}}</b><br /><br />
            Resolution: <b>{{data.worknote.resolution}}</b>
          </v-col>
        </v-row>
        <v-row v-if="tab.id == 5" class="mx-1">
          <v-col cols="12" md="4">
            Rates: <b>{{data.workaccount.rates}}</b>
          </v-col>
          <v-col cols="12" md="4">
            Travel Time: <b>{{data.workaccount.travel_time}}</b>
          </v-col>
          <v-col cols="12" md="4">
            Travel Cost: <b>{{data.workaccount.travel_cost}}</b>
          </v-col>
          <v-col cols="12">
            <v-divider></v-divider>
            <v-data-table
              :headers="headers"
              :items="other_expenses"
              item-key="name"
              hide-default-footer
            >
            <template v-slot:item.num="{ index }">
                  {{index + 1}}
            </template>
            <template v-slot:item.total="{ item }">
                  {{item.qty * item.amount}}
            </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-form>
      </v-col>
    </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-5">
          Status: 
          <v-chip v-if="data.status" :class="'ml-2 chip-status-' + data.status.id">
            <span>{{ data.status.description }}</span>
          </v-chip>
            <v-spacer></v-spacer>
          <v-btn
            color="#239FAB"
            outlined
            @click="closeDialog()"
          >
          <v-icon>mdi-close</v-icon>
            Close
          </v-btn>
          <v-btn
            color="#239FAB"
            class="white--text"
            v-if="forApproval"
            @click="approve()"
          >
          <v-icon>mdi-check-circle</v-icon>
            Approve
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
        data: null
    },
    data () {
      return {
        dialog: false,
        tabs: [
           { id: 1, description: 'Work Details', icon: 'mdi-file-account-outline' },
           { id: 2, description: 'Before Task', icon: 'mdi-format-list-checks' },
           { id: 3, description: 'After Task', icon: 'mdi-list-status' },
           { id: 4, description: 'Notes', icon: 'mdi-note-edit-outline' },
           { id: 5, description: 'Accounts', icon: 'mdi-account-circle-outline' },
        ],
        tab: { id: 1, description: 'Work Details', icon: 'mdi-file-account-outline' },
        technicians: [],
        clients: [],
        end_clients: [],
        status: [],
        task_status: [],
        request_types: [],
        request_schedules: [],
        time: null,
        menu2: false,
        menu3: false,
        work_date_menu: false,
        other_expenses: [],
        headers: [
          { text: '#', value: 'num' },
          { text: 'type', value: 'expenseType' },
          { text: 'Description', value: 'description' },
          { text: 'Quantity', value: 'qty' },
          { text: 'Amount', align: 'start', sortable: false, value: 'amount'},
          { text: 'Total', align: 'start', sortable: false, value: 'total'},
        ],
        forApproval: false,
        fadeAwayMessage: {
        show: false,
        type: "success",
        header: "Successfully Added!",
        message: "",
        top: 10,
        },
      }
    },
    watch: {
      data: {
        handler (data) {
        if(data){
            this.initialize();
            if(data.id){
              this.data.workbefore = data.workbefore || {};
              this.data.workafter = data.workafter || {};
              this.data.worknote = data.worknote || {};
              this.data.workaccount = data.workaccount || {};
              this.other_expenses = data.expenses || {};
              if(data.approval){
                this.forApproval = true;
              }
            }
            this.dialog = true;
        }
        console.log(data)
        },
        deep: true,
      },
    },
    methods: {
      closeDialog() {
        this.dialog = false;
        this.eventHub.$emit('closeDispatchingDialog', false);
      },
      initialize(){
        this.getTaskStatus();
      },
      getStatus(id){
        let res = null;
        this.task_status.forEach(item => {
          if(item.id == id){
            res = item.description;
          }
        });
        return res
      },
      getTaskStatus() {
      this.axiosCall("/status/status-type/2", "GET").then((res) => {
        if (res) {
          this.task_status = res.data;
        }
      });
    },
      changeTab(data){
        this.tab = data;
      },
      approve() {
        let data = {
          wd_ID: parseInt(this.data.id)
        };
      this.axiosCall("/work-after-task/workdetail", "POST", data).then((res) => {
          if(res.status == 200 || res.status == 201){
            this.fadeAwayMessage.show = true
            this.fadeAwayMessage.type = 'success'
            this.fadeAwayMessage.header = "Work Successfully aprroved!"
            this.closeDialog()
          }
      }); 
    },
    getTechNames(data){
        let names = [];
        data.forEach(item => {
          names.push(item.firstName + ' ' + item.lastName)
        });
        return names;
       }
    },
  }
</script>
<style scoped>
.chip-status-1 {
  background-color: #ebfdff !important;
  color: #1abbb9 !important;
}
.chip-status-2 {
  background-color: #fff0f0 !important;
  color: #eb5757 !important;
}
.chip-status-3 {
  background-color: #fdffcc !important;
  color: #e6a400 !important;
}
.chip-status-4 {
  background-color: #e6e6e6 !important;
  color: #404040 !important;
}
.chip-status-5 {
  background-color: #fff0f0 !important;
  color: #ff3300 !important;
}

.chip-status-6{ 
  background-color: #F0FFF8 !important;
  color: #18AB56 !important;

}
</style>