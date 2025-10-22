<template>
  <div>
    <!-- Button to trigger SweetAlert -->
    <button @click="showAlert" :class="buttonClass">{{ buttonText }}</button>
  </div>
</template>

<script>
import Swal from "sweetalert2";

export default {
  name: "SweetAlert",
  props: {
    title: {
      type: String,
      default: "Are you sure?",
    },
    text: {
      type: String,
      default: "You won't be able to revert this!",
    },
    icon: {
      type: String,
      default: "warning", // options: 'success', 'error', 'warning', 'info', 'question'
    },
    confirmButtonText: {
      type: String,
      default: "Yes, do it!",
    },
    cancelButtonText: {
      type: String,
      default: "Cancel",
    },
    showCancelButton: {
      type: Boolean,
      default: true,
    },
    buttonText: {
      type: String,
      default: "Click Me",
    },
    buttonClass: {
      type: String,
      default: "btn btn-primary",
    },
  },
  methods: {
    async showAlert() {
      try {
        const result = await Swal.fire({
          title: this.title,
          text: this.text,
          icon: this.icon,
          showCancelButton: this.showCancelButton,
          confirmButtonText: this.confirmButtonText,
          cancelButtonText: this.cancelButtonText,
        });

        if (result.isConfirmed) {
          this.$emit("confirmed");
          Swal.fire("Done!", "Your action has been completed.", "success");
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          this.$emit("cancelled");
        }
      } catch (error) {
        console.error("Error displaying SweetAlert:", error);
      }
    },
  },
};
</script>

<style>
/* Add optional styling for the button */
.btn {
  padding: 10px 15px;
  font-size: 14px;
  cursor: pointer;
  border-radius: 4px;
}
</style>
