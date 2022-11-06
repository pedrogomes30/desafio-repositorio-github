// example

export default async function getRepo (user){
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };      
    var call = fetch(`https://api.github.com/users/${user}/repos`, requestOptions)
        .then(response => {
            if(!response.ok) throw new Error(`Dados não encontrados`);
            return response.json()
        })
        .then(result => {
            return result
        })
        .catch(error => console.log('error', error));
    return call
}