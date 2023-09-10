const plantButton = document.getElementById('navbarDropdownMenuLink');
const searchInputDropdown = document.getElementById('search-input-dropdown');
const plantOptions = document.getElementById('plantOptions');

let plantData = [];
let dropdownOptions = [];
let plantBoxObjects = [];

// thoughts: could set up "prettier" in project, and specify for example yes to semicolons
//           this can be set up to be automatic on save in VSCode

let getPlantData = async () => {
    // can change some lets to consts
    const API_KEY = 'sk-hhUC648f17aaee2f71312'
    let plants = [] 
    let localArray = JSON.parse(localStorage.getItem("plants"));

        if (localArray && localArray.length) {
        plants = localArray
        } else {
          for(i=1; i<=101; i++) {
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

    let index = plantBoxObjects.findIndex( (obj) => !obj.filled )

    // need to add something for when you've reached all 15 being full to add a shelf with all its stuff
    // (objects) and then add that image to the first obj that is !filled
    // need to add the move functionality
    // delete plants?

    let plantBoxObj = plantBoxObjects[index]

    let image = document.createElement("img");
    image.setAttribute('src', plantImage);
    image.setAttribute('class', 'plantImage')
    plantBoxObj.element.appendChild(image);
    plantBoxObj.filled = true;

    console.log(plantBoxObj.filled)
}

populatePlantBoxObjects = () => {
  let shelves = document.getElementById("shelves").children
  for(let i=0; i<shelves.length; i++){
    let shelf = shelves[i].children[0].children
    console.log(shelf);
    
    for(let j=0; j<shelf.length; j++){
      plantBoxObjects.push(
          {
            element: shelf[j], 
            filled: false
          }
        ) 
    }
  }
  console.log(plantBoxObjects)
}

let onLoad = async () => {
    populatePlantBoxObjects();
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