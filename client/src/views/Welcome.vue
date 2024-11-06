<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <img src="..\assets\Patroena.png" alt="Patreon Logo" class="patreon-logo" />
        <h1>Join the Creative Community</h1>
        <p>Support your favorite creators and gain access to exclusive content and experiences.</p>
        <button @click="goToSignIn" class="btn-signin">Sign In</button>
      </div>
    </section>

    <!-- Explore Section -->
    <section class="explore">
      <h2>Discover the Possibilities</h2>
      <p>Access exclusive content and experiences crafted directly by the creators you admire.</p>
      <div class="features">
        <div class="feature">
          <h3>Exclusive Content</h3>
          <p>Access unique videos, articles, and other content available only to supporters.</p>
        </div>
        <div class="feature">
          <h3>Community Engagement</h3>
          <p>Join communities of like-minded fans and interact with your favorite creators.</p>
        </div>
        <div class="feature">
          <h3>Personalized Experiences</h3>
          <p>Choose a membership tier that suits you and unlock tailored benefits.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  methods: {
    goToSignIn() {
      this.$router.push({ name: 'SignIn' });
    },
  },
};
</script>

<style lang="scss">
.landing-page {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  color: #f4efe1;
  background-color: #131313;

  .hero {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: url('https://i.pinimg.com/564x/83/df/1d/83df1d516c0fba80261c19350c2e5a5a.jpg') center/cover no-repeat;
    height: 80vh;
    position: relative;
    padding: 2em;

    .patreon-logo {
      width: 400px; /* Adjust size as needed */
      margin-bottom: 1em;
    }

    .hero-content {
      max-width: 700px;
      background: rgba(0, 0, 0, 0.8);
      padding: 3em;
      border-radius: 12px;
      transform: translateY(-20px);
      transition: transform 0.5s ease;

      &:hover {
        transform: translateY(-30px);
      }

      h1 {
        font-size: 30px;
        margin-bottom: 0.5em;
        font-weight: bold;
        color: #f4efe1;
      }

      p {
        font-size: 1.3em;
        margin-bottom: 1.2em;
        color: #d0cec1;
      }

      .btn-signin {
        background-color: #f4efe1;
        color: #131313;
        padding: 14px 28px;
        font-size: 1em;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.3s ease;

        &:hover {
          background-color: #dcd3b5;
        }
      }
    }
  }

  .explore {
    padding: 4em 2em;
    background-color: #252525;
    text-align: center;
    color: #f4efe1;

    h2 {
      font-size: 2.4em;
      margin-bottom: 1em;
      font-weight: bold;
      color: #f4efe1;
    }

    p {
      font-size: 1.15em;
      margin-bottom: 2.5em;
      color: #d0cec1;
    }

    .features {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      gap: 1.5em;

      .feature {
        flex: 1 1 300px;
        background: #131313;
        padding: 2em;
        margin: 1em;
        border-radius: 12px;
        box-shadow: 0 8px 12px rgba(0, 0, 0, 0.5);
        transition: transform 0.3s ease, box-shadow 0.3s ease;

        &:hover {
          transform: translateY(-10px);
          box-shadow: 0 12px 16px rgba(0, 0, 0, 0.6);
        }

        h3 {
          font-size: 1.6em;
          margin-bottom: 0.5em;
          color: #f4efe1;
          font-weight: bold;
        }

        p {
          font-size: 1.05em;
          color: #b5b5b5;
        }
      }
    }
  }
}
</style>
