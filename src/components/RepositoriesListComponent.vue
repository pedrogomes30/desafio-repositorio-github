<template>
    <div>
        <v-row class="px-5">
            <v-text-field 
                label="Repósitorio de:" 
                v-model="user"
                class="pa-5 "
                @change="updateRepositories()"
            />
            <v-text-field 
                label="Pesquisar:" 
                v-model="search"
                class="pa-5 pl-5"
            />
        </v-row>
        <v-data-table
        :items="repositories"
        :search="search" 
        :headers="headers"
        :loading="loading"
        fixed-header
        dense
        :no-data-text="nDText"
        :no-results-text="rText"
        id="repo-table"
        class="overflow-y-auto pa-5"
        style="{height: 60vh}"
        >
        <!-- tive que por stylo aqui pois o github pages não estava encontrando o CSS -->
        <template v-slot:item="row">
            <tr >
                <td>
                <v-btn elevation="3" icon color="blue" class='ma-1' outlined title="Acessar repositório" @click="gotoRepository(row.item.html_url)">
                    <v-icon size="20" >fa-solid fa-link</v-icon>
                </v-btn>
                </td>
                <td>{{row.item.name}}<br></td>
                <td>{{row.item.description ? row.item.description : "sem descrição"}}</td>
                <td>{{dateFormat(row.item.created_at)}}</td>
                <td>{{dateFormat(row.item.updated_at)}}</td>
                <td>
                    <v-btn elevation="3" icon :color="getLanguageColor(row.item.language)" class='ma-1' outlined >
                        <v-icon size="20" :color="getLanguageColor(row.item.language)" :title="row.item.language">{{getLenguageIcon(row.item.language)}}</v-icon>
                    </v-btn>
                </td>
            </tr>
        </template>
        </v-data-table>
    </div>
</template>

<script>
import getRepo from '../services/githubApi'
import { format } from 'date-fns'
export default {
    data: () => ({
        headers: [
            { text: 'Endereço', value: 'html_url' },
            { text: 'Nome', value: 'name' },
            { text: 'Descricao', value: 'description' },
            { text: 'Criado em:', value: 'created_at' },
            { text: 'Último commit:', value: 'updated_at' },
            { text: 'Linguagem', value: 'language' },
        ],
        search:'',
        repositories: [],
        user:'pedrogomes30',
        loading:false,
        rText: "resultado não encontrado",
        nDText: "repositórios não encontrados",
        languageIcons: [
            {language:"PHP",icon:'fa-brands fa-php',color:'#9607f5'},
            {language:"Java",icon:'fa-brands fa-java',color:'#f50737'},
            {language:"TypeScript",icon:'fa-brands fa-square-js',color:'#076ef5'},
            {language:"HTML",icon:'fa-brands fa-html5',color:'#d65109'},
            {language:"CSS",icon:'fa-brands fa-css3-alt',color:'#2204e0'},
        ],
    }),
    methods:{
        //interface methods
        dateFormat(dateString) {
            dateString = new Date(dateString);
            return format(dateString, "dd/MM/yyyy HH:mm:ss");
        },
        gotoRepository(url){
            window.open(url, '_blank').focus()
        },
        getLenguageIcon(language){
            let exists = this.languageIcons.findIndex(x => x.language === language);
            if(exists !== -1){
                return this.languageIcons[exists].icon
            }
            return 'fa-regular fa-file'
        },
        getLanguageColor(language){
            let exists = this.languageIcons.findIndex(x => x.language === language);
            if(exists !== -1){
                return this.languageIcons[exists].color
            }
            return "#0a0908"
        },
        //use case methods
        async updateRepositories(){
            this.loading = true;
            this.repositories = []
            try{
                var result = await getRepo(this.user)
                this.repositories = result
            }catch(e){
                this.rText = e.getmesasage
            }
            this.loading = false
        },
    },
    async beforeMount() {
        await this.updateRepositories();
    },
}
</script>