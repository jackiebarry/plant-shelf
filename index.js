const plantButton = document.getElementById('navbarDropdownMenuLink');
const searchInputDropdown = document.getElementById('search-input-dropdown');
const plantOptions = document.getElementById('plantOptions');
const imageLocation = document.querySelector(".shelves");


// declare variable "plantBoxDivs", populate it onLoad


let plantData = [];
let dropdownOptions = [];

// thoughts: could make all functions consistently arrow functions
// thoughts: could set up "prettier" in project, and specify for example yes to semicolons
//           this can be set up to be automatic on save in VSCode

async function getPlantData() {
    // can make these lets consts 
    const API_KEY = 'sk-hhUC648f17aaee2f71312'
    let plants = [] 
    let localArray = JSON.parse(localStorage.getItem("plants"));

        if (localArray && localArray.length) {
        plants = localArray
        } else {
          for(i=1; i<=101; i++) { // want this to be 100
                let response = await fetch(`https://perenual.com/api/species-list?page=${i}&key=${API_KEY}`);
                let data = await response.json();
        
                plants = plants.concat(data.data);
            };
        };
    localStorage.setItem("plants", JSON.stringify(plants));
    return plants;
};

const addPlantImage = (event) => {
    const buttonIndex = event.target.id;
    let plantImage = plantData[buttonIndex].default_image.thumbnail;

    // rather than accessing one plantBox div, will want an array (or array of array?) of plantBox divs
    let plantShelf = document.getElementById("shelf1").children[0].children[0];

    console.log(plantImage);

    let image = document.createElement("img");
    image.setAttribute('src', plantImage);
    plantShelf.appendChild(image);
    // now: put the image on the shelves
}

async function onLoad() {
    plantData = await getPlantData()
    console.log(plantData);

    // note: might want to add some vertical overflow styling to the ul
    plantData.forEach((plant, plantIndex) => {
        const li = document.createElement("li");
        const button = document.createElement("button");
        li.appendChild(button);
        let textnode = document.createTextNode(plant.common_name);
        button.setAttribute('class','dropdown-item');
        button.setAttribute('id', plantIndex);
        button.appendChild(textnode);
        button.addEventListener('click', addPlantImage);
        plantOptions.appendChild(li);
    })
    dropdownOptions = document.querySelectorAll('.dropdown-item');
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