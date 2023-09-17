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
    let plantName = plantData[buttonIndex].common_name;

    let index = plantBoxObjects.findIndex( (obj) => !obj.filled )

    if (index === -1) {

      addShelf()
      index = plantBoxObjects.findIndex( (obj) => !obj.filled )

      // need to add something for when you've reached all 15 being full to add a shelf with all its stuff
      // (objects) and then add that image to the first obj that is !filled
      // need to add the move functionality
      // delete plants?

     
    }  
    let plantBoxObj = plantBoxObjects[index]

    let image = document.createElement("img");
    image.setAttribute('src', plantImage);
    image.setAttribute('class', 'plantImage');
    image.setAttribute('class', 'card-img-top');
    let name = document.createElement("p");
    // let textNode = document.createTextNode(plantName);
    // textNode.setAttribute('class', 'plantName');
    name.setAttribute('class', 'card-title');
    name.setAttribute('class', 'plantName');

    name.innerHTML = plantName;

    // name.appendChild(textNode)
    plantBoxObj.element.appendChild(image);
    plantBoxObj.element.appendChild(name);
    plantBoxObj.filled = true;

}

addShelf = () => {
  let newShelf = document.createElement("div");
  newShelf.setAttribute('class', 'shelfContainer');

  let shelfImage = document.createElement("img");
    shelfImage.setAttribute('src', "images/wooden-shelf.png");
    shelfImage.setAttribute('class', 'shelf');

  let newBoxes = document.createElement("div");
  newBoxes.setAttribute('class', 'plantBoxes');

  for(i=0; i<5; i++) {
    let newBox = document.createElement("div");
    newBox.setAttribute('class', 'plantBox');
    plantBoxObjects.push(
      {
        element: newBox, 
        filled: false
      }
    ) 
    newBoxes.appendChild(newBox);

  }

  newShelf.appendChild(newBoxes);
  newShelf.appendChild(shelfImage);

  let shelves = document.getElementById("shelves")
  shelves.appendChild(newShelf);

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