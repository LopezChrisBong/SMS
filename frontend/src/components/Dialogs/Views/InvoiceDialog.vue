<template>
<div>
    <v-dialog
      v-model="dialog"
      scrollable
      persistent
      width="1500"
    >
      <v-card class="overflow-x-hidden">
        <v-card-title dark class="dialog-header" v-if="data.client">{{data.invoice_no}} - {{data.client.name}}
        <v-spacer></v-spacer>
       <v-btn
            icon
            dark
            @click="closeDialog()"
        >
            <v-icon>mdi-close</v-icon>
        </v-btn>
          </v-card-title>
        <v-card-text style="max-height: 800px;" class="my-4">
    <v-row>
      <v-col cols="12">
        <h2 class="mb-2 mt-5">Invoice Details</h2>
        <v-divider></v-divider>
      </v-col>
      <v-col cols="12">
        <v-row class="mx-1">
          <v-col cols="12" md="6" lg="4">
            Invoice Number: <b>{{data.invoice_no}}</b>
          </v-col>
          <v-col cols="12" md="6" lg="4">
            Client: <b v-if="data.client">{{data.client.name}}</b>
          </v-col>
          <v-col cols="12" md="6" lg="4">
            Details: <b>{{data.details}}</b>
          </v-col>
          <v-col cols="12" md="6" lg="4">
            Amount: <b>{{data.amount}}</b>
          </v-col>
          <v-col cols="12" md="6" lg="4">
            PO Number: <b>{{data.PO}}</b>
          </v-col>
          <v-col cols="12" md="6" lg="4">
            Line Number: <b>{{data.line_no}}</b>
          </v-col>
          <v-col cols="12">
            Notes: <b>{{data.notes}}</b>
            <v-divider class="mt-4"></v-divider>
          </v-col>
          <v-col cols="12" md="6" lg="4">
            Date Created: <b>{{formatDateTime(data.created_at)}}</b>
          </v-col>
          <v-col cols="12" md="6" lg="4">
            Date Approved: <b>{{formatDateTime(data.approve_date)}}</b>
          </v-col>
          <v-col cols="12" md="6" lg="4">
            Date Mailed: <b>{{formatDateTime(data.date_client_sent)}}</b>
          </v-col>
          <v-col cols="12" md="6" lg="4">
            Date Paid: <b>{{formatDateTime(data.date_date)}}</b>
          </v-col>
          <v-col cols="12" md="6" lg="4">
            Date Acknowledged: <b>{{formatDateTime(data.acknowledge_date)}}</b>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-toolbar flat class="px-n2">
                <h2 class="mb-2 mt-5">Works Details</h2>
                <v-spacer></v-spacer>
                <v-btn
                  color="#239FAB"
                  class="white--text"
                  @click="summary()"
                  :disabled="selectedWorks.length == 0"
                >
                  <v-icon>mdi-check-circle</v-icon>
                  Summary
                </v-btn>
                </v-toolbar>
            <v-divider></v-divider>
          </v-col>
          <v-col cols="12">
            <v-data-table
                :headers="headers"
                :items="selectedWorks"
                item-key="id"
                :loading="loading"
                class="elevation-1"
              >
                <template v-slot:item.technician="{ item }">
                  <span>{{getTechNames(item.technician).join(', ')}}</span>
                </template>
                <template v-slot:item.wdate="{ item }">
                  {{ formatDate(item.wdate) }}
                </template>
                <template v-slot:item.end_client="{ item }">
                  {{ item.endClient.name }}
                </template>
                <template v-slot:item.status="{ item }">
                  {{ item.status.description }}
                </template>
                <template v-slot:item.action="{ item }">
                  <v-btn small color="grey" icon class="mr-2" @click="view(item)">
                    <v-icon>mdi-eye</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-5">
          Status: 
          <v-chip v-if="data.statusID == 10" class="chip-status-1">
              <span>{{data.status.description}}</span>
          </v-chip>
          <v-chip v-if="data.statusID == 11 && data.overdue" class="chip-status-2">
              <span>{{data.status.description}}</span>
          </v-chip>
          <v-chip v-if="data.statusID == 11 && !data.overdue" class="chip-status-3">
              <span>Overdue</span>
          </v-chip>
          <v-chip v-if="data.statusID == 13" class="chip-status-4">
            <span>{{data.status.description}}</span>
          </v-chip>
          <v-chip v-if="data.statusID == 14" class="chip-status-5">
            <span>Completed</span>
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
    <DispatchingCompletedDialog :data="viewData" />
    <InvoiceSummaryDialog :data="summaryData" />
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
    components: {
      DispatchingCompletedDialog : () => import('./DispatchingCompletedDialog.vue'),
      InvoiceSummaryDialog : () => import("./InvoiceSummaryDialog.vue"),
    },
    data () {
      return {
        dialog: false,
        forApproval: false,
        fadeAwayMessage: {
        show: false,
        type: "success",
        header: "Successfully Added!",
        message: "",
        top: 10,
        },
        selectedWorks: [],
        loading: false,
        headers: [
          { text: "Work Order Ticket", value: "wticket_order" },
          { text: "Work Date", value: "wdate" },
          { text: "Work Description", value: "work_desc" },
          { text: "Technician", value: "technician" },
          { text: "End Client", value: "end_client" },
          { text: "Status", value: "status" },
          { text: "Action", value: "action" },
          { text: "", value: "month" , align: ' d-none'},
        ],
        viewData: [],
        summaryData: [],
      }
    },
    watch: {
      data: {
        handler (data) {
        if(data){
            this.initialize();
            this.dialog = true;
            if(data.approval){
                this.forApproval = true;
              }
        }
        },
        deep: true,
      },
    },
    mounted() {
    this.eventHub.$on('closeDispatchingDialog', ()=>{
        this.initialize();
      });
    this.eventHub.$on('closeSummaryDialog', ()=>{
        this.summaryData = [];
      });
    },
    beforeDestroy() {
         this.eventHub.$off('closeDispatchingDialog');
         this.eventHub.$off('closeSummaryDialog');
    },
    methods: {
      closeDialog() {
        this.dialog = false;
        this.eventHub.$emit('closeInvoiceDialog', false);
      },
      getTechNames(data){
        let names = [];
        data.forEach(item => {
          names.push(item.firstName + ' ' + item.lastName)
        });
        return names;
       },
      initialize(){
        this.getSelectedWorks(this.data.wd_ID)
      },
      view(data){
        this.viewData = data;
      },
      summary(){
        let ids = [];
        this.selectedWorks.forEach((item) => {
            ids.push(item.id);
        });
        this.summaryData = ids;
      },
      getSelectedWorks(ids) {
      let data = {
        wd_ID: ids
      }
      this.axiosCall("/work-details/getManyWorkDetails", "POST", data).then((res) => {
        if (res) {
          this.selectedWorks = res.data;
          this.selectedWorks.forEach(item => {
            let [year, month, day] = item.wdate.split("-");
            console.log(day)
            item.month = month + '-' + year;
          });
        }
      });
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
    },
  }
</script>
<style scoped>
.chip-status-1 {
  background-color: #e6e6e6 !important;
  color: #404040 !important;
}
.chip-status-2 {
  background-color: #ebfdff !important;
  color: #1abbb9 !important;
}
.chip-status-3 {
  background-color: #fff0f0 !important;
  color: #eb5757 !important;
}
.chip-status-4 {
  background-color: #fdffcc !important;
  color: #e6a400 !important;
}

.chip-status-5{ 
  background-color: #F0FFF8 !important;
  color: #18AB56 !important;

}
</style>