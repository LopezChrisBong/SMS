<template>
  <div class="error-wrapper">
    <!-- Floating Background Text -->
    <div class="bg-text">404</div>

    <v-card class="error-card text-center" elevation="0" rounded="xl">
      <v-icon size="72" color="primary" class="mb-4 pulse-icon">
        mdi-alert-circle-outline
      </v-icon>

      <div class="error-code">404</div>

      <h1 class="mb-3 font-weight-bold">
        Page Not Found
      </h1>

      <p class="error-message mb-8">
        The page you are looking for might have been removed, renamed, or is
        temporarily unavailable.
      </p>

      <div class="btn-group">
        <v-btn
          @click="goHome"
          large
          outlined
          rounded="xl"
          color="white"
          class="px-6 white--text"
        >
          <v-icon left>mdi-home</v-icon>
          Home
        </v-btn>

        <v-btn
          @click="goBack"
          large
          outlined
          rounded="xl"
          color="white"
          class="px-6"
        >
          <v-icon left>mdi-arrow-left</v-icon>
          Go Back
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  methods: {
    goHome() {
      this.$router.push("/landing");
    },
    goBack() {
      this.$router.push("/landing");
    },
  },
};
</script>

<style scoped>
.error-wrapper {
  position: relative;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  overflow: hidden;

  background: linear-gradient(-45deg, #1976d2, #42a5f5, #64b5f6, #e3f2fd);
  background-size: 400% 400%;
  animation: gradientBG 12s ease infinite;
}

/* Centered floating 404 */
.bg-text {
  position: absolute;
  font-size: clamp(10rem, 25vw, 22rem);
  font-weight: 900;
  color: rgba(255, 255, 255, 0.06);
  z-index: 0;
  user-select: none;
}

/* Glass Card */
.error-card {
  position: relative;
  z-index: 1;
  max-width: 520px;
  width: 100%;
  padding: 60px 40px;
  border-radius: 20px;

  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(18px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);

  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.error-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
}

.error-code {
  font-size: 4.5rem;
  font-weight: 900;
  letter-spacing: 5px;
  color: #1976d2;
}

.error-message {
  color: #555;
  font-size: 1.05rem;
  line-height: 1.6;
}

/* Button group spacing */
.btn-group {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

/* Icon subtle pulse */
.pulse-icon {
  animation: pulse 2.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.08);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Gradient animation */
@keyframes gradientBG {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .error-card {
    background: rgba(30, 30, 30, 0.85);
    color: #fff;
  }

  .error-message {
    color: #ddd;
  }
}
</style>
