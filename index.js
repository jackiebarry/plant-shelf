const plantButton = document.getElementById('plantSearch')
let plantData 

plantButton.addEventListener("click", function(e){
    // we would like to get the data of one plant

    console.log(plantData[29])
})

async function sendApiRequest1() {
    // can make these lets consts
    let API_KEY = 'sk-hhUC648f17aaee2f71312'
    // we will want to loop, and fetch page=1 to page=100. We can store all the results plantData
    let response = await fetch(`https://perenual.com/api/species-list?page=10&key=${API_KEY}`);
    let data = await response.json();

    return data.data
};


async function onLoad() {
    plantData = await sendApiRequest1()
    console.log(plantData)
}

onLoad()