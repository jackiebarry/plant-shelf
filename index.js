
      // Need: improve wait time on API calls
      // Want: could add water info
      // Want: could add card flip functionality

// thoughts: could set up "prettier" in project, and specify for example yes to semicolons
//           this can be set up to be automatic on save in VSCode


const plantButton = document.getElementById('navbarDropdownMenuLink');
const searchInputDropdown = document.getElementById('search-input-dropdown');
const plantOptions = document.getElementById('plantOptions');

let plantData = []; 
let dropdownOptions = [];
let plantBoxObjects = [];
let storedPlants = [];

function dragStart(event) {
  console.log( event.target.id)
  event.dataTransfer.setData('Text', event.target.id);

  let eventIndex = event.currentTarget.parentElement.id
  let plantBoxObj = plantBoxObjects[eventIndex]

  console.log(plantBoxObj);

  plantBoxObj.filled = false;
};

function allowDrop(event) {

  let eventIndex = event.currentTarget.id;
  let plantBoxObj = plantBoxObjects[eventIndex]

  if (plantBoxObj.filled === false){
   
  event.preventDefault();}
  else {
    event
  }
};

function drop(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData("Text");
  console.log(data);
  event.target.appendChild(document.getElementById(data));

  console.log('event.currentTarget.id', event.currentTarget.id)
  let eventIndex = event.currentTarget.id; 
  let plantBoxObj = plantBoxObjects[eventIndex]


  plantBoxObj.filled = true;

  let deleteButton = plantBoxObj.element.children[0].children[2]
  deleteButton.setAttribute('id', eventIndex);

  let waterButton = plantBoxObj.element.children[0].children[3];
  waterButton.setAttribute('id', eventIndex);

  storePlants();

};


let getPlantData = async () => {
    const API_KEY = 'sk-hhUC648f17aaee2f71312'
    let plants = [] 
    let localArray = JSON.parse(localStorage.getItem("plants"));
        if (localArray && localArray.length) {
        plants = localArray
        } else {
          // for(i=1; i<=101; i++) {
            for(i=75; i<=80; i++) {

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

    let index = plantBoxObjects.findIndex( (obj) => !obj.filled )

    if (index === -1) {

      addShelf()
      index = plantBoxObjects.findIndex( (obj) => !obj.filled )
     
    }  

    let plantBoxObj = plantBoxObjects[index]

    let imageCard = document.createElement("div");
    imageCard.setAttribute('class', 'imageCard');
    imageCard.setAttribute('draggable', true); 
    imageCard.setAttribute('id', `dragTarget-${Date.now()}`); 
    imageCard.addEventListener("dragstart", dragStart);

    console.log(imageCard.id);

    let plantImage = plantData[buttonIndex].default_image?.thumbnail

    let image = document.createElement("img")
    image.setAttribute('src', plantImage ? plantImage : "images/stock-plant.jpeg");
    image.setAttribute('class', 'plantImage');
    image.setAttribute('class', 'card-img-top');
    image.setAttribute('draggable', false);
  
  
    let plantName = plantData[buttonIndex].common_name;

    let name = document.createElement("p");
    name.setAttribute('class', 'card-title');
    name.setAttribute('class', 'plantName');
    name.innerHTML = plantName;

    let deleteButton = document.createElement("button");
    deleteButton.setAttribute('class', 'btn btn-danger btn-floating btn-sm');
    deleteButton.setAttribute('id', index)
    deleteButton.addEventListener('click', deletePlant)

    let deleteButtonIcon = document.createElement("span");
    deleteButtonIcon.setAttribute('class', 'fas fa-skull fa-sm');
    deleteButton.appendChild(deleteButtonIcon);

    // let waterData = plantData[buttonIndex].watering;

    // const displayWaterData = () => {
    //   let waterInfo = document.createElement("p"); 
    //   waterInfo.setAttribute('class', 'water-details');
    //   waterInfo.innerHTML = waterData;
    //   imageCard.appendChild(waterInfo)
    //   };
    //   console.log("water info here", displayWaterData);

// plantBoxObj will need water shown yes / no which will be toggled and then change of icon to droplet-slash to hide water info 

    let waterButton = document.createElement("button");
    waterButton.setAttribute('class', 'btn btn-info btn-floating btn-sm');
    waterButton.setAttribute('id', index);
    waterButton.addEventListener('click', displayWaterData);

    let waterButtonIcon = document.createElement("span");
    waterButtonIcon.setAttribute('class', 'fas fa-droplet fa-sm');
    waterButton.appendChild(waterButtonIcon);

    imageCard.appendChild(image);
    imageCard.appendChild(name);
    imageCard.appendChild(deleteButton);
    imageCard.appendChild(waterButton);

    plantBoxObj.element.appendChild(imageCard);
    plantBoxObj.filled = true;

    console.log(plantBoxObjects);
    storePlants();
}; 


const displayWaterData = (event) => {
  let buttonIndex = event.currentTarget.id;
  let waterData = plantData[buttonIndex].watering;
  let plantBoxObj = plantBoxObjects[buttonIndex];
  let waterInfo = document.createElement("p"); 
  waterInfo.setAttribute('class', 'water-details');
  waterInfo.innerHTML = waterData;

  let imageCard = plantBoxObj.element.children[0]

  imageCard.appendChild(waterInfo);
  };

const deletePlant = (event) => {
let eventIndex = event.currentTarget.id; 
console.log(eventIndex);
let plantBoxObj = plantBoxObjects[eventIndex]

plantBoxObj.element.children[0].remove();

plantBoxObj.filled = false;

storePlants();
};

const storePlants = () => {

  localStorage.setItem("storedPlants", JSON.stringify(
    plantBoxObjects.map((plantBox) => {
      return {
        filled: plantBox.filled,
        element: plantBox.element.outerHTML
      }
    })
  ));


};

const addShelf = () => {
  let newShelf = document.createElement("div");
  newShelf.setAttribute('class', 'shelfContainer');

  let shelfImage = document.createElement("img");
    shelfImage.setAttribute('src', "images/wooden-shelf.png");
    shelfImage.setAttribute('class', 'shelf');

  let newBoxes = document.createElement("div");
  newBoxes.setAttribute('class', 'plantBoxes');

  const shelvesCount = document.getElementById("shelves").children.length;

  for(i=0; i<5; i++) {
    let newBox = document.createElement("div");
    newBox.setAttribute('class', 'plantBox');
    newBox.addEventListener("drop", drop);
    newBox.addEventListener("dragover", allowDrop);

    newBox.setAttribute('id', ((shelvesCount * 5) + i));
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

  storePlants();
}

const shelfButton = document.getElementById("shelfButton");
shelfButton.addEventListener("click", addShelf);

let onLoad = async () => {

  let storedPlants = JSON.parse(localStorage.getItem("storedPlants"))
  if (storedPlants) {
    storedPlants = storedPlants.map((storedPlant) => {
    
      let wrapper = document.createElement('div');
      wrapper.innerHTML = storedPlant.element;
      const div = wrapper.firstChild; 

      return {
        filled: storedPlant.filled,
        element: div
      }
    })

    plantBoxObjects = storedPlants;

    for (let i=0; i<Math.ceil(storedPlants.length / 5); i++) {
      let newShelf = document.createElement("div");
      newShelf.setAttribute('class', 'shelfContainer');

      let shelfImage = document.createElement("img");
      shelfImage.setAttribute('src', "images/wooden-shelf.png");
      shelfImage.setAttribute('class', 'shelf');
  
      let newBoxes = document.createElement("div");
      newBoxes.setAttribute('class', 'plantBoxes');

      for(j = (i * 5); j<((i * 5) + 5); j++) {
        const box = plantBoxObjects[j].element

        console.log(box)

        box.addEventListener("drop", drop);
        box.addEventListener("dragover", allowDrop);

        if(box.children[0]) {
        box.children[0].addEventListener("dragstart", dragStart);
        box.children[0].children[2].addEventListener('click', deletePlant);
        box.children[0].children[3].addEventListener('click', displayWaterData);
        }

        newBoxes.appendChild(box);
      }

      newShelf.appendChild(newBoxes);
      newShelf.appendChild(shelfImage);

      let shelves = document.getElementById("shelves");
      shelves.appendChild(newShelf);
    }
  }

  else {
    for(let i=0; i<3; i++){
      addShelf();
    };
  }

    console.log(plantBoxObjects);
    plantData = await getPlantData();
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

