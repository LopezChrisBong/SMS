<template>
  <div class="pa-5">
    <v-card class="card-style" >
    <v-row>
    <v-col cols="12">
      <v-toolbar flat class="rounded-xl">
       <v-toolbar-title><strong>Scheduled Works</strong></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
      class="white--text rounded-lg mt-3"
      dense
      color="#239FAB"
      @click="dispatch()"
    >
      <v-icon left>
        mdi-plus-box-outline
      </v-icon>
      Schedule Work
    </v-btn>
      </v-toolbar>
    </v-col>
    <v-col cols="12">
      <ScheduledWorksDataTable />
    </v-col>
    </v-row>
    </v-card>
      <ScheduledWorksDialog :data="dispatchingData" />
  </div>
</template>

<script>
  export default {
    components: {
        ScheduledWorksDataTable : () => import('../../components/Utils/ScheduledWorksDataTable.vue'),
        ScheduledWorksDialog : () => import('../../components/Dialogs/Forms/ScheduledWorksDialog.vue'),
    },
    data: () => ({
      dispatchingData: []
    }),
    methods: {
      dispatch(){
        this.dispatchingData = [{id: null}];
      }
    },

  }
</script>