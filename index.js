
      // Need: store plants in shelves
        //start with plantboxobjs and plants 

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
  event.dataTransfer.setData('Text', event.target.id);
  // console.log(event.currentTarget.parentElement);

  let eventIndex = event.currentTarget.parentElement.id
  let plantBoxObj = plantBoxObjects[eventIndex]

  console.log(plantBoxObj);

  plantBoxObj.filled = false;
};

function allowDrop(event) {
  console.log(event.currentTarget.id);

  let eventIndex = event.currentTarget.id;
  let plantBoxObj = plantBoxObjects[eventIndex]

  console.log(plantBoxObj)
  if (plantBoxObj.filled === false){
  //this needs an if else statement to handle boxes being filled 
  // console.log(plantBoxObjects[]);  
  event.preventDefault();}
  else {
    event
  }
};

function drop(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData("Text");
  event.target.appendChild(document.getElementById(data));

  let eventIndex = event.currentTarget.id; 
  let plantBoxObj = plantBoxObjects[eventIndex]

  plantBoxObj.filled = true;

};


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
    deleteButton.setAttribute('class', 'btn btn-danger btn-floating');
    deleteButton.setAttribute('id', index)
    deleteButton.addEventListener('click', deletePlant)

    let deleteButtonIcon = document.createElement("span");
    deleteButtonIcon.setAttribute('class', 'fas fa-skull fa-2x');
    deleteButton.appendChild(deleteButtonIcon);



    //   let waterData = plantData[buttonIndex].watering;

    // let waterButton = document.createElement("button");
    // waterButton.setAttribute('class', 'btn btn-floating btn-info');
    // waterButton.setAttribute('id', index);
    // waterButton.addEventListener('mousedown', displayWaterData);

    // let waterButtonIcon = document.createElement("span");
    // waterButtonIcon.setAttribute('class', 'fas fa-droplet fa-2x');
    // waterButton.appendChild(waterButtonIcon);

    imageCard.appendChild(image);
    imageCard.appendChild(name);
    imageCard.appendChild(deleteButton);
    // imageCard.appendChild(waterButton);

    plantBoxObj.element.appendChild(imageCard);
    plantBoxObj.filled = true;
}; 

// const displayWaterData = (event) => {
//   let eventIndex = event.currentTarget.id

// }

const deletePlant = (event) => {
let eventIndex = event.currentTarget.id; 
let plantBoxObj = plantBoxObjects[eventIndex]


plantBoxObj.element.children[0].remove();

plantBoxObj.filled = false;

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

}

const shelfButton = document.getElementById("shelfButton");
shelfButton.addEventListener("click", addShelf);

let onLoad = async () => {
  for(let i=0; i<3; i++){
    addShelf();
  };
    // populatePlantBoxObjects();

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

const storePlants = () => {
  let storePlantTarget = document.getElementById(`dragTarget-${Date.now()}`);
  localStorage.setItem("storedPlants", storePlantTarget);
};

const accessStoredPlants = () => {
storedPlants = JSON.parse(localStorage.getItem("storedPlants"));
};


// let getPlantData = async () => {
//   // can change some lets to consts
//   const API_KEY = 'sk-hhUC648f17aaee2f71312'
//   let plants = [] 
//   let localArray = JSON.parse(localStorage.getItem("plants"));
//       if (localArray && localArray.length) {
//       plants = localArray
//       } else {
//         for(i=1; i<=101; i++) {
//               let response = await fetch(`https://perenual.com/api/species-list?page=${i}&key=${API_KEY}`);
//               let data = await response.json();
      
//               plants = plants.concat(data.data);
//           };
//       };
//   localStorage.setItem("plants", JSON.stringify(plants));
//   return plants;
// };


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

storePlants();
