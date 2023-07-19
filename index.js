const plantButton = document.getElementById('navbarDropdownMenuLink');
const searchInputDropdown = document.getElementById('search-input-dropdown');
const dropdownOptions = document.querySelectorAll('.dropdown-item');
const plantOptions = document.getElementById('plantOptions');
let plantData

plantButton.addEventListener("click", function(e){
    // we would like to get the data of one plant

    console.log(plantData[29])
});


    async function sendApiRequest1() { // might want to rename to say getPlantData because now not everyone is sending request anymore

    // can make these lets consts
    let API_KEY = 'sk-hhUC648f17aaee2f71312'
    let plants = [] 
    let localArray = JSON.parse(localStorage.getItem("plants"));

       if (localArray && localArray.length) {
        plants = localArray
       } else {
          for(i=1; i<=2; i++) { // want this to be 100
                let response = await fetch(`https://perenual.com/api/species-list?page=${i}&key=${API_KEY}`);
                let data = await response.json();
        
                plants = plants.concat(data.data)
            };
       };

    localStorage.setItem("plants", JSON.stringify(plants));
    return plants;
    };


async function onLoad() {
    plantData = await sendApiRequest1()

    // put this functionality in a loop to see all plantData (hint: forEach)
    // note: might want to add some vertical overflow styling to the ul
    const li = document.createElement("li");
    const button = document.createElement("button");
    li.appendChild(button);
    const textnode = document.createTextNode(plantData[0].common_name);
    button.setAttribute('class','dropdown-item')
    button.appendChild(textnode);
    plantOptions.appendChild(li)

    console.log(plantData)
};


onLoad();

searchInputDropdown.addEventListener('input', () => {
  const filter = searchInputDropdown.value.toLowerCase();
  showOptions();
  const valueExist = !!filter.length;

  if (valueExist) {
    dropdownOptions.forEach((el) => {
      const elText = el.textContent.trim().toLowerCase();
      const isIncluded = elText.includes(filter);
      if (!isIncluded) {
        el.style.display = 'none';
      }
    });
  }
});

const showOptions = () => {
  dropdownOptions.forEach((el) => {
    el.style.display = 'flex';
  })
};