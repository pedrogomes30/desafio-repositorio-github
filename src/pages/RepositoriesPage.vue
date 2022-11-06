<template>
  <v-container >
    <v-card>
      <v-card-title class="d-flex justify-center">
        <v-icon size="45" class="mr-5">fa-brands fa-github</v-icon>
        <h1 >Listagem de repositórios do github</h1>
      </v-card-title>
      <RepositoriesListComponent/>
    </v-card>
  </v-container>
</template>

<script>
import RepositoriesListComponent from '@/components/RepositoriesListComponent.vue';

export default {
  data:()=>({    
    
  }),
  components: { RepositoriesListComponent }
}
</script>