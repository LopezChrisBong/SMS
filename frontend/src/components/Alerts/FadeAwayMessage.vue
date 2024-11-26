<template>
	

	<div
		v-if="display"
		class="fade-away-message-container rounded-lg elevation-1 d-inline-flex justify-space-between align-center"
		:class="{
			show : showClass,
			hide : !showClass,
			variation1 : showVariation1Class,
			variation2 : showVariation2Class,
			variation3 : showVariation3Class,
			variation4 : showVariation4Class,
			variation5 : showVariation5Class
		}"
		:style="{
			'top' : top+'%',
			'min-height' : (header && message) ? '100px' : '60px' ,
			'width' : width+'px'
		}"
	>	

		<div class="icon-container pa-2 d-flex" v-if="displayType == 'variation2'">
			<div class="left-line" :class="background"></div>
			<v-icon :class="background"  class="icon">{{mdiIcon}}</v-icon>
		</div>
		<div class="icon-container pa-2" :class="background" v-else>
			<v-icon  class="icon mx-0">{{mdiIcon}}</v-icon>
		</div>
		<div class="message-container pa-2 " >
			<div class="title-message-wrapper">
				<div :class="headerClasses " v-if="header" >{{header}}</div>
				<div class="message " style="color:black; font-weight: 500;" v-if="message" >{{message}}</div>
			</div>
		</div>
		<div class="close-container pa-2 d-flex align-center justify-center" >
			<v-btn id="fadeawayclose" fab small text @click="clickClose">
				<v-icon dark >mdi-close</v-icon>
			</v-btn>
		</div>
	</div>


</template>


<script>
	
export default {

	name : 'FadeAwayMessage',
	props : {
		value : {
			type : Boolean,
			default : true
		},
		header : {
			type : String,
			default : 'SERVER ERROR'
		},
		message : {
			type : String,
			default : 'Something went wrong!'
		},
		timeout : {
			type : [Number, String],
			default : 1500
		},
		type : {
			type : String,
			default : 'success'
		},
		top : {
			type : [Number, String],
			default : 20
		},
		backgroundClass : {
			type : String,
			default : 'primary'
		},
		textColorClass : {
			type : String,
			default : 'white--text'
		},
		displayType : {
			type : String,
			default : 'default'
		},
		width : {
			type : [Number, String],
			default: 600
		}
	},

	watch : {

		type : function(val){
			this.setType(val);
		},

		value : function(val){
			this.display = val;
		},

		display : function(val){

			if( val ){
				this.showBox();
			}else{
				this.clickClose();
			}

		}

	},

	mounted : function(){
		this.display = this.value;
	},

	data : () => ({
		display : false,
		mdiIcon : 'mdi-check',
		background : 'teal darken-3',
		headerClasses : 'title',
		mainContainerClasses : {},

		showClass : false,
		showVariation1Class : false,
		showVariation2Class : false,
		showVariation3Class : false,
		showVariation4Class : false,
		showVariation5Class : false
	}),

	methods : {

		showBox : function(){
			this.$emit('input', true);
			this.headerClasses = 'title';
			if( this.message && this.header ){
				this.headerClasses += ' mb-2 ';
			}

			this.setType();
			this.setMainContainerClass();

			setTimeout(() => {
				this.showClass = true;
				setTimeout(() => {
					this.clickClose();
				}, this.timeout)
			}, 10);
		},

		clickClose : function(){
			this.showClass = false;

			setTimeout(() => {		
				this.display = false;
				this.$emit('input', false);
			}, 1000)

		},

		setMainContainerClass : function(){

			this.showVariation1Class = false;
			this.showVariation2Class = false;
			this.showVariation3Class = false;
			this.showVariation4Class = false;
			this.showVariation5Class = false;

			switch( this.displayType ){
				case 'variation1' :
					this.showVariation1Class = true;
					break;
				case 'variation2' :
					this.showVariation2Class = true;
					break;
				case 'variation3' :
					this.showVariation3Class = true;
					break;
				case 'variation4' :
					this.showVariation4Class = true;
					break;
				case 'variation5' :
					this.showVariation5Class = true;
					break;
			}
		},

		setType : function(type){
			switch(type){
				case 'success' :
				case 'primary' :
					this.background = 'primary';
					this.mdiIcon = 'mdi-check';
					break;
				case 'warning' :
					this.background = 'amber';
					this.mdiIcon = 'mdi-alert-circle-outline';
					break;
				case 'danger' : 
				case 'error' : 
					this.background = 'error';
					this.mdiIcon = 'mdi-alert-octagon-outline';
					break;
			}
			
		}

	}



};



</script>

<style scoped>
	
.fade-away-message-container {
	position: fixed;
	top: 20%;
	min-width: 530px;
	background-color: #fefefe;
	right: 50%;
	transform: translate(-50%, -50%);
	left: 50%;
	border-radius: 5px;
	z-index: 9999;
	height: 40px;
	overflow: hidden;
	transition: all 0.4s ease;
	opacity: 0;
}

	.fade-away-message-container.show{
		opacity: 1;
	}

	.fade-away-message-container.hide{
		opacity: 0;
	}

	.message-container{
		width: 100%;
		height: 100%;
		position: relative;
	}

	.message-container .title-message-wrapper{
		position: absolute;
		top: 50%;
		left: 50%;
		right: -50%;
		transform: translate(-50%, -50%);
	}

	.message-container .message,
	.message-container .title{
		line-height: 15px;
	}

	.close-container{
		height: 100%;
		overflow: hidden;
		width: 15%;
	}

	.icon-container{
		width: 20%;
		position: relative;
		height: 100%;
	}

	.icon{
		font-size: 40px;
		margin: 0 auto;
		position: absolute;
		top: 50%;
		left: 50%;
		right: -50%;
		transform: translate(-50%, -50%);
	}

	.title{
		font-size: 14px !important;
		letter-spacing: 0px !important;
		color: rgb(31, 30, 30) !important;
		font-weight: 600;
		font-family: "Arimo", sans-serif !important;
	}

	.close-container button i{
		color: #ababab !important;
	}


	.variation1 .icon-container{
		width: 17%;
	}
	
	.variation1 .icon-container .icon{
		font-size: 35px;
		color: #fff;
	}

	.variation1 .title-message-wrapper{
		padding: 0px 30px;
	}

	.variation1 .message{
		color: #666;
	}

	.variation1 .message,
	.variation2 .message{
		font-weight: lighter;
		font-size: 13px;
		letter-spacing: 0.8px;
		color: #959595;
	}

	.variation1 .close-container button{
		background-color: #fff !important;
	}

	.variation1 .close-container button i{
		font-size: 18px;
	}

	.variation2{
		/* border-radius: 0px !important; */
		padding: 0px;
	}

	.left-line {
	width: 24px;
	}

	.variation2 .icon-container{
		padding: 0px !important;
	}

	.variation2 .icon-container i{
		width: 40px;
		height: 40px;
		border-radius: 50px;
		font-size: 25px;
		color: #fff;
		margin: 0px 15px;
	}

	.variation2 .title-message-wrapper{
	padding: 0px 10px;
	}

	.variation2 .close-container button{
		background-color: #fff !important;
		/* top: 20% !important; */
	}

</style>