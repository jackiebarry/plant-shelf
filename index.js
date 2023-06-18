const plantButton = document.getElementById('plantSearch')

plantButton.addEventListener("click", function(e){
    
})

async function sendApiRequest1(array) {
    let API_KEY = 'sk-hhUC648f17aaee2f71312'
    let resoponse = await fetch('https://perenual.com/api/species-list?page=1&key=sk-hhUC648f17aaee2f71312&q=monstera');
    let data = await Response.json();
    useApiData(data)
};