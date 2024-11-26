<template>
   <v-dialog
      v-model="dialog"
      scrollable
      max-width="1000px"
    >
     <v-card>
        <v-card-title dark class="dialog-header pt-5 pb-5 pl-6">{{data.fname}} {{data.lname}} - {{data.position}}
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
            <h2 class="mt-1 pl-5 text-h6">DSH Team/ User Information</h2>
            <v-divider class="ml-5 mr-5"></v-divider>
        </v-col>
        <v-card-text style="max-height: 700px;" class="my-4">
        <v-container>
            <v-row class="ml-2 mr-2">
                <v-col>
                <span class="text-body-1 font-weight-medium">
                  First Name
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
                    Middle Name 
                </span>
                  <v-text-field
                    dense
                    outlined
                    color="#239FAB"
                    ></v-text-field>
                </v-col>
                <v-col>
                <span class="text-body-1 font-weight-medium">
                    Last Name 
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
                    Suffix 
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
                    Position
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
                    Designation
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
                     DSH Username
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
                  Personal Email Address
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
                  DSH Email Address
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
                  Cell / Phone Number
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
                <v-col col="12" md="4">
                <span class="text-body-1 font-weight-medium">
                   User Role
                </span>
                  <v-text-field
                    dense
                    outlined
                    required
                    color="#239FAB"
                    hint=" The Super Admin can only Assign Roles"
                    persistent-hint
                    ></v-text-field> 
                </v-col>
            </v-row>
    </v-container>
      </v-card-text>
     </v-card>      
    </v-dialog>
</template>

<script>
export default {
    props: {
        data: null
    },
    data () {
      return {
        dialog: false,
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
}
</script>