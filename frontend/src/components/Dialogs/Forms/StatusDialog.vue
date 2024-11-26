<template>
<div>
   <v-dialog
      v-model="dialog"
      scrollable
      max-width="750px"
    >
      <v-card>
        <v-card-title  dark class="dialog-header pt-5 pb-5 pl-6">
        <span v-if="action == 'Add'" >Add New Status</span>
        <span v-if="action == 'Update'">Update Status</span>
        <v-spacer></v-spacer>
       <v-btn
            icon
            dark
            @click="closeDialog(); dialog = false"
        >
            <v-icon>mdi-close</v-icon>
        </v-btn>
          </v-card-title>
        <v-col>
            <h2 class="mt-1 pl-5 text-h6">Status Information</h2>
            <v-divider class="ml-5 mr-5"></v-divider>
        </v-col>
        <v-card-text style="max-height: 700px;" class="my-4">

<v-form ref="Formref">    
        <v-container>
            <v-row class="ml-2 mr-2">
                <v-col cols="12" md="6">
                <span class="text-body-1 font-weight-medium">
                    <span class="red--text">* </span>Description
                </span>
                  <v-text-field
                    v-model="statusModel.description"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    required
                    class="rounded-lg"
                    color="#239FAB"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                <span class="text-body-1 font-weight-medium">
                    <span class="red--text">* </span> Status Type
                </span>
                   <v-autocomplete
                      v-model="statusModel.statusTypeID"
                      :rules="[formRules.required]"
                      dense
                      outlined
                      class="rounded-lg"
                      item-text="description"
                      item-value="id"
                      placeholder="Select a status type"
                      color="#239FAB"
                      :items="statustype">
                    </v-autocomplete>
                </v-col>
            </v-row>
    </v-container>
</v-form>   

      </v-card-text>
      <v-divider></v-divider>
    <v-card-actions v-if="action == 'Add'" class="pa-5">
            <v-spacer></v-spacer>
          <v-btn
            color="red"
            outlined
            @click="closeDialog(); dialog = false"
          >
          <v-icon>mdi-close-circle-outline</v-icon>
            Cancel
          </v-btn>
          <v-btn
            color="#239FAB"
            class="white--text"
            @click="addStatus()"
          >
          <v-icon>mdi-check-circle</v-icon>
            Save Details
          </v-btn>
        </v-card-actions>
        
     <v-card-actions v-if="action == 'Update'" class="pa-5">
            <v-spacer></v-spacer>
          <v-btn
            color="red"
            outlined
            @click="closeDialog();  dialog = false"
          >
          <v-icon>mdi-close-circle-outline</v-icon>
            Cancel
          </v-btn>
          <v-btn
            color="#239FAB"
            class="white--text"
            @click="updateStatus()"
          >
          <v-icon>mdi-check-circle</v-icon>
            Update Details
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
        action: null
    },
    data () {
      return {
        dialog: false,
        statusModel:{
            description: null,
            statusTypeID: null,
        },
        statustype: null,
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
            this.dialog = true;
            if(data.id != null){
                this.statusModel = data
            }
        }
        },
        deep: true,
      },
    },
    methods: {
       initialize(){
             this.axiosCall("/status-type", "GET",).then((res) => {
              if (res){
                  this.statustype = res.data
              }
            });
       },
       addStatus(){
          if(this.$refs.Formref.validate()){
              this.axiosCall("/status/add_status", "POST", this.statusModel).then((res) => {
                if(res){ 
                  this.dialog = false
                  this.fadeAwayMessage.show = true
                  this.fadeAwayMessage.type = 'success'
                  this.fadeAwayMessage.header = "Successfully Added!"
                  this.$refs.Formref.reset();
                  this.closeDialog()
                }
            });
          }
       },
       updateStatus(){
          if(this.$refs.Formref.validate()){
              this.axiosCall("/status/" + this.data.id, "PATCH", this.statusModel).then((res) => {
                if(res){
                  this.dialog = false
                  this.fadeAwayMessage.show = true
                  this.fadeAwayMessage.type = 'success'
                  this.fadeAwayMessage.header = "Successfully Update!"
                  this.closeDialog()
                }
            });
          }
       },
    },
     mounted() {
        this.initialize();
    },
  
}
</script>

