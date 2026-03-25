<template>
  <div>
    <div v-if="isLaptopUp">
      <JobPostLaptopView />
    </div>
    <div v-else style="width: 100%">
      <JobPostMobileView />
    </div>
  </div>
</template>

<script>
export default {
  components: {
    JobPostLaptopView: () => import("./JobPostLaptopView.vue"),
    JobPostMobileView: () => import("./JobPostMobileView.vue"),
  },
  data() {
    return {
      width: window.innerWidth,
    };
  },
  computed: {
    isLaptopUp() {
      return this.width >= 1280;
    },
  },

  mounted() {
    this.initialize();
    localStorage.setItem("lockedMode", "true");
    window.addEventListener("resize", () => {
      this.width = window.innerWidth;
    });
  },
};
</script>
