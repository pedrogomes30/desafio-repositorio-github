<template>
  <v-app>
    <v-main id="main" class='d-flex justify-center align-center'>
      <RepositoriesPage />
    </v-main>
  </v-app>
</template>

<script>
import RepositoriesPage from './pages/RepositoriesPage';


export default {
  name: 'App',

  components: {
    RepositoriesPage
},

  data: () => ({
    //
  }),
};
</script>
<style>
#main{
  background:radial-gradient( #063970 , #21130d);
  height: 100vh;
  width: 100vw;
}
</style>