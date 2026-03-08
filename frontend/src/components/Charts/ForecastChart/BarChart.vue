<script>
import { Bar } from "vue-chartjs";

export default {
  extends: Bar,
  props: {
    chartData: Object,
  },

  mounted() {
    this.renderChart(this.chartData, {
      responsive: true,
      maintainAspectRatio: false,
    });
  },
};
</script>
