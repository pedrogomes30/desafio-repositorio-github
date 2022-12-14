<template>
    <div>
        <v-row class="px-5 pt-5">
            <v-col cols="4" class="d-flex flex-row pl-5">
                <v-avatar >
                <img
                    v-if="(profileImg !== '' )"
                    :src="profileImg"
                    :alt="user"
                >
                <v-icon color="red" size="45" v-else>fa-regular fa-circle-xmark</v-icon>
                </v-avatar>
                <v-text-field 
                    label="Repósitorio de:" 
                    v-model="user"
                    class="pa-5 "
                    @change="updateRepositories()"
                />
            </v-col>
            <v-col class="pr-5">
                <v-text-field 
                    label="Pesquisar" 
                    v-model="search"
                />
                <div class="d-flex flex-row">
                    <v-checkbox
                        v-model="disabled"
                        label="Inativos"
                        class="px-2"
                        @change="updateRepositories()"
                        ></v-checkbox>
                        <v-checkbox
                        v-model="archived"
                        label="Arquivados"
                        @change="updateRepositories()"
                    ></v-checkbox>
                    <v-select
                        label="Linguagem Programação"
                        hide-details="auto"
                        v-model='language'
                        item-text="language"
                        item-value="language"
                        :items="languageIcons"
                        clearable
                        class="pl-5"
                        color="var(--primary)"
                        :prepend-icon='languageIcons.icon'
                        @change="updateRepositories()">
                    </v-select>
                </div>
            </v-col>
        </v-row>
        <v-data-table
        :items="repositories"
        :search="search" 
        :headers="headers"
        :loading="loading"
        hide-default-footer
        :items-per-page="-1"
        dense
        :no-data-text="nDText"
        :no-results-text="rText"
        id="repo-table"
        style="height:60vh;"
        class="overflow-y-auto pa-5"
        >
        <template v-slot:item="row">
            <tr >
                <td >
                    <div class="d-flex flex-row">
                        <v-btn elevation="3" icon color="blue" class='ma-1' small outlined title="Acessar repositório" @click="gotoRepository(row.item.html_url)">
                            <v-icon size="15" >fa-solid fa-link</v-icon>
                        </v-btn>
                        <v-btn v-if="row.item.forks_count > 0 "  elevation="3" icon color="gray" small class='ma-1' outlined title="Fork" >
                            <v-badge color="#71990b" :content="row.item.stargazers_count" overlap>
                                <v-icon size="15">fa-solid fa-code-fork</v-icon>
                            </v-badge>
                        </v-btn>
                        <v-btn v-if="row.item.stargazers_count > 0 " elevation="3" icon color="gray" small class='ma-1' outlined title="Stars">
                            <v-badge color="#71990b" :content="row.item.stargazers_count" overlap>
                                <v-icon size="15">fa-solid fa-star</v-icon>
                            </v-badge>
                        </v-btn>
                    </div>
                </td>
                <td>{{row.item.name}}<br></td>
                <td>{{row.item.description ? row.item.description : "sem descrição"}}</td>
                <td>{{dateFormat(row.item.created_at)}}</td>
                <td>{{dateFormat(row.item.updated_at)}}</td>
                <td>
                    <v-btn elevation="3" icon :color="getLanguageColor(row.item.language)" class='ma-1' outlined >
                        <v-icon size="20" :color="getLanguageColor(row.item.language)" :title="row.item.language ? row.item.language : 'não definido'">{{getLenguageIcon(row.item.language)}}</v-icon>
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
        //ui variables
        headers: [
            { text: '', value: 'html_url' },
            { text: 'Nome', value: 'name' },
            { text: 'Descricao', value: 'description' },
            { text: 'Criado em:', value: 'created_at' },
            { text: 'Último commit:', value: 'updated_at' },
            { text: 'Linguagem', value: 'language' },
        ],
        loading:false,
        rText: "resultado não encontrado",
        nDText: "repositórios não encontrados",
        languageIcons: [
            {language:"PHP",icon:'fa-brands fa-php',color:'#600b99'},
            {language:"Java",icon:'fa-brands fa-java',color:'#f50737'},
            {language:"TypeScript",icon:'fa-brands fa-square-js',color:'#076ef5'},
            {language:"JavaScript",icon:'fa-brands fa-square-js',color:'#bec712'},
            {language:"HTML",icon:'fa-brands fa-html5',color:'#d65109'},
            {language:"CSS",icon:'fa-brands fa-css3-alt',color:'#2204e0'},
            {language:"Vue",icon:'fa-brands fa-vuejs',color:'#2d9c4b'},
        ],
        //search filter variables
        search:'',
        disabled: false,
        archived:false,
        language:'',
        //user case variables
        repositories: [],
        user:'pedrogomes30',//default
        profileImg:'',
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
            return 'fa-solid fa-code'
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
                var filtred;
                this.profileImg = this.repositories[0].owner.avatar_url
                //filters
                if(this.language !== '' && typeof(this.language) !== 'object'){
                    filtred = this.repositories.filter((repo)=>repo.language === this.language);
                    this.repositories = filtred
                }
                if(this.disabled){
                    filtred = this.repositories.filter((repo)=>repo.disabled === true);
                    this.repositories = filtred.length === 0 ? []  : filtred
                }
                if(this.archived){
                    filtred = this.repositories.filter((repo)=>repo.archived === true);
                    this.repositories = filtred.length === 0 ? []  : filtred
                }
            }catch(e){
                this.rText = e.getmesasage
                this.profileImg = ''
            }
            console.log("REPO",this.repositories)
            this.loading = false
        },   
    },
    async beforeMount() {
        await this.updateRepositories();
    },
}
</script>