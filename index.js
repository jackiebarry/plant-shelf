     // Big: want to add the move functionality
        //need unique ids - right before dragging give it an id - after dragging take  away id  ---- 
        //changed filled status after dragging 

      // Need: store plants in shelves
      // Need: want to add fallback image for plants with no image
      // Need: improve wait time on API calls
      // Want: add shelf button
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

function dragStart(event) {
  event.dataTransfer.setData('Text', event.target.id);
  console.log(event.currentTarget.parentElement);



};

function allowDrop(event) {
  //this needs an if else statement to handle boxes being filled 

  event.preventDefault();

};

function drop(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData("Text");
  event.target.appendChild(document.getElementById(data));

  // let eventIndex = event.currentTarget.id; 
  // let plantBoxObj = plantBoxObjects[eventIndex]

  // console.log(eventIndex);
  // console.log(plantBoxObj);

  // plantBoxObj.filled = true;

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
    
    if (plantData[buttonIndex].default_image.thumbnail === null) {
    let image = document.createElement("img");

      image.setAttribute('src', "images/stock-plant.jpeg");
      image.setAttribute('class', 'plantImage');
      image.setAttribute('class', 'card-img-top');
      image.setAttribute('draggable', false);
    } 
    else {
      let plantImage = plantData[buttonIndex].default_image.thumbnail;

      let image = document.createElement("img");

      image.setAttribute('src', plantImage);
      image.setAttribute('class', 'plantImage');
      image.setAttribute('class', 'card-img-top');
      image.setAttribute('draggable', false);
    };
    // let plantImage = plantData[buttonIndex].default_image.thumbnail;

    let plantName = plantData[buttonIndex].common_name;

    let index = plantBoxObjects.findIndex( (obj) => !obj.filled )

    if (index === -1) {

      addShelf()
      index = plantBoxObjects.findIndex( (obj) => !obj.filled )
     
    }  

    let plantBoxObj = plantBoxObjects[index]

    let imageCard = document.createElement("div");
    imageCard.setAttribute('class', 'imageCard');
    imageCard.setAttribute('draggable', true); 
    imageCard.setAttribute('id', 'dragTarget') // `dragTarget-${myRandomNumber}`
    imageCard.addEventListener("dragstart", dragStart);


    let image = document.createElement("img");

  //   if (plantImage === null) {
  //     image.setAttribute('src', "images/stock-plant.jpeg");
  //   } else {
  //   image.setAttribute('src', plantImage);
  // };

    image.setAttribute('class', 'plantImage');
    image.setAttribute('class', 'card-img-top');
    image.setAttribute('draggable', false);
    
    let name = document.createElement("p");
    name.setAttribute('class', 'card-title');
    name.setAttribute('class', 'plantName');

    name.innerHTML = plantName;

    let deleteButton = document.createElement("button");
    deleteButton.setAttribute('class', 'btn btn-danger btn-floating');
    deleteButton.setAttribute('id', index)
    console.log('index here', index)

    deleteButton.addEventListener('click', deletePlant)

    let buttonIcon = document.createElement("span");
    buttonIcon.setAttribute('class', 'fas fa-skull fa-2x');
    deleteButton.appendChild(buttonIcon);
   
    console.log(plantBoxObj);

    imageCard.appendChild(image);
    imageCard.appendChild(name);
    imageCard.appendChild(deleteButton);

    plantBoxObj.element.appendChild(imageCard);
    plantBoxObj.filled = true;

    console.log(plantBoxObj);
}; 
 
const deletePlant = (event) => {
let eventIndex = event.currentTarget.id; 
let plantBoxObj = plantBoxObjects[eventIndex]

//index of plant box objects 
console.log(eventIndex);
console.log(plantBoxObj);

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

  for(i=0; i<5; i++) {
    let newBox = document.createElement("div");
    newBox.setAttribute('class', 'plantBox');
    newBox.addEventListener("drop", drop);
    newBox.addEventListener("dragover", allowDrop);
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

let populatePlantBoxObjects = () => {
  let shelves = document.getElementById("shelves").children
  for(let i=0; i<shelves.length; i++){
    let shelf = shelves[i].children[0].children
    console.log(shelf);
    
    for(let j=0; j<shelf.length; j++){
      shelf[j].setAttribute('id', `${i}, ${j}`);
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


// imageCard.addEventListener('onmousedown', () => {

// })




let onLoad = async () => {
  for(let i=0; i<3; i++){
    addShelf();
  };
    populatePlantBoxObjects();
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