<!-- <script>
import { Line } from "vue-chartjs";

export default {
  extends: Line,
  data() {
    return {
      gradient: null,
      gradient2: null,
      gradient3: null,
    };
  },
  mounted() {
    this.gradient = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);
    this.gradient2 = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);
    this.gradient3 = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);
    this.gradient.addColorStop(0, "rgba(255, 0,0, 0.5)");
    this.gradient.addColorStop(0.5, "rgba(255, 0, 0, 0.25)");
    this.gradient.addColorStop(1, "rgba(255, 0, 0, 0)");

    this.gradient2.addColorStop(0, "rgba(0, 231, 255, 0.9)");
    this.gradient2.addColorStop(0.5, "rgba(0, 231, 255, 0.25)");
    this.gradient2.addColorStop(1, "rgba(0, 231, 255, 0)");

    this.gradient3.addColorStop(0, "rgba(00, 128, 128, 0.9)");
    this.gradient3.addColorStop(0.5, "rgba(0, 128, 128, 0.25)");
    this.gradient3.addColorStop(1, "rgba(0, 128, 128, 0)");

    this.renderChart(
      {
        labels:
          this.$store.state.user.user.assignedModuleID == 3
            ? [
                "Grade 7",
                "Grade 8",
                "Grade 9",
                "Grade 10",
                "Grade 11",
                "Grade 12",
              ]
            : [
                "Kindergarten",
                "Grade 1",
                "Grade 2",
                "Grade 3",
                "Grade 4",
                "Grade 5",
                "Grade 6",
              ],
        datasets: [
          {
            label: "Verification",
            borderColor: "#008080",
            pointBackgroundColor: "white",
            pointBorderColor: "white",
            borderWidth: 1,
            backgroundColor: this.gradient3,
            data: [6, 59, 2, 5, 20, 30, 15, 6, 59, 2, 5, 20, 30, 15],
          },
          {
            // label: "Emergency Loan",
            label: "Enrolled",
            borderColor: "#FC2525",
            pointBackgroundColor: "white",
            borderWidth: 1,
            pointBorderColor: "white",
            backgroundColor: this.gradient,
            data: [40, 39, 10, 40, 39, 80, 40, 40, 39, 10, 40, 39, 80, 40],
          },
          {
            label: "Droped/Transferred",
            borderColor: "#05CBE1",
            pointBackgroundColor: "white",
            pointBorderColor: "white",
            borderWidth: 1,
            backgroundColor: this.gradient2,
            data: [60, 55, 32, 10, 2, 12, 53, 60, 55, 32, 10, 2, 12, 53],
          },
        ],
      },
      { responsive: true, maintainAspectRatio: false },
    );
  },
};
</script> -->
<!--Dynamic-->
<script>
import { Line } from "vue-chartjs";

export default {
  extends: Line,

  data() {
    return {
      gradient: null,
      gradient2: null,
      gradient3: null,
    };
  },
  watch: {
    "$store.getters.getFilterSelected"() {
      this.getDataListed();
    },
  },
  mounted() {
    this.createGradients();
    this.getDataListed(); // render AFTER fetch
  },

  methods: {
    createGradients() {
      const ctx = this.$refs.canvas
        ? this.$refs.canvas.getContext("2d")
        : this.$el.getContext("2d");

      this.gradient = ctx.createLinearGradient(0, 0, 0, 450);
      this.gradient2 = ctx.createLinearGradient(0, 0, 0, 450);
      this.gradient3 = ctx.createLinearGradient(0, 0, 0, 450);

      this.gradient.addColorStop(0, "rgba(255,0,0,0.5)");
      this.gradient.addColorStop(1, "rgba(255,0,0,0)");

      this.gradient2.addColorStop(0, "rgba(0,231,255,0.9)");
      this.gradient2.addColorStop(1, "rgba(0,231,255,0)");

      this.gradient3.addColorStop(0, "rgba(0,128,128,0.9)");
      this.gradient3.addColorStop(1, "rgba(0,128,128,0)");
    },

    getDataListed() {
      let filter = this.$store.getters.getFilterSelected;
      const moduleId = this.$store.state.user.user.assignedModuleID;

      const levelType = moduleId === 21 ? "Elementary" : "High School";
      this.axiosCall(
        `/enroll-student/getEnrollmentChart/${filter}?levelType=${levelType}`,
        "GET",
      ).then((res) => {
        const response = res.data;
        console.log("love", res.data);
        this.renderChart(
          {
            labels: response.categories,

            datasets: [
              {
                label: "Verification",
                borderColor: "#FC2525",
                backgroundColor: this.gradient,
                data: response.series[0].data,
                fill: true,
              },
              {
                label: "Enrolled/Listed",
                borderColor: "#008080",
                backgroundColor: this.gradient3,
                data: response.series[1].data,
                fill: true,
              },
              {
                label: "Dropped/Transferred",
                borderColor: "#05CBE1",
                backgroundColor: this.gradient2,
                data: response.series[2].data,
                fill: true,
              },
            ],
          },
          { responsive: true, maintainAspectRatio: false },
        );
      });
    },
  },
};
</script>
