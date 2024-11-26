<template>
    <div>
        <div class="pa-5">
    <v-card class="card-style" >
    <v-row>

      <v-col cols="12">
      <v-tabs
        color="#239FAB"
        background-color="transparent"
        show-arrows
        class="mx-5 mt-5"
      >
        <v-tabs-slider color="#239FAB"></v-tabs-slider>
  
        <v-tab
          v-for="tab in tabs"
          :key="tab.id"
          @click="changeTab(tab)"
        >
        <v-icon class="mr-2">{{ tab.icon }}</v-icon>
          {{ tab.description }}
        </v-tab>
      </v-tabs>
    </v-col>  

    <v-col v-if="tab.id == 1" cols="12">
      <v-toolbar flat class="rounded-xl mb-7">
       <v-toolbar-title><strong>Request Type Details</strong></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
      class="white--text rounded-lg"
      color="#239FAB"
      @click="addRequest()"
      >
      <v-icon left>
        mdi-plus-box-outline
      </v-icon>
       Add New Type of Request
    </v-btn>
      </v-toolbar>
     <RequestTypeDataTable/>
    </v-col>

    <v-col v-if="tab.id == 2" cols="12">
      <v-toolbar flat class="rounded-xl mb-7">
       <v-toolbar-title><strong>Work Method Details</strong></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
      class="white--text rounded-lg"
      color="#239FAB"
      @click="addMethod()"
      >
      <v-icon left>
        mdi-plus-box-outline
      </v-icon>
       Add New Work Method
    </v-btn>
      </v-toolbar>
     <WorkMethodDataTable/>
    </v-col>


    </v-row>
    </v-card>
  </div>
  <RequestTypeDialog :data="typeData" :action="action"/>
   <WorkMethodDialog :data="methodData" :action="action"/>
    </div>
</template>

<script>
export default {
   name: 'RequestType',
    components: {
        RequestTypeDataTable : () => import('../../components/Utils/RequestTypeDataTable.vue'), 
        RequestTypeDialog : () => import('../../components/Dialogs/Forms/RequestTypeDialog.vue'),
        WorkMethodDataTable : () => import('../../components/Utils/WorkMethodDataTable.vue'),
        WorkMethodDialog : () => import('../../components/Dialogs/Forms/WorkMethodDialog.vue'),
    },
    data: () => ({
      typeData: [],
      methodData: [],
      action: null,
      tabs: [
           { id: 1, description: 'Request Type', icon: 'mdi-briefcase-variant' },
           { id: 2, description: 'Work Method', icon: 'mdi-briefcase-search' },
        ],
      tab: { id: 1, description: 'Request Type', icon: 'mdi-briefcase-variant' },
    }),
    methods: {
       addRequest(){
           this.typeData = [{id: null}]
           this.action = 'Add'
       },
       addMethod(){
          this.methodData = [{id: null}]
          this.action = 'Add'
       },
       changeTab(data){
        this.tab = data;
      }
    }
}
</script>

<style>

</style>
