<script setup>
  import ServerInfo from './components/views/ServerInfo.vue'
  import Login from './components/modals/Login.vue'
  import IconLastChronicle from './components/icons/IconLastChronicle.vue'
</script>

<template>
  <header>
    <i color="var(--color-text)"><IconLastChronicle/></i>
  </header>
  <main>
    <ServerInfo />
    <Login />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

main {
  display:grid;
  gap:10px;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>