const plantButton = document.getElementById('navbarDropdownMenuLink');
const searchInputDropdown = document.getElementById('search-input-dropdown');
const plantOptions = document.getElementById('plantOptions');

let plantData = [];
let dropdownOptions = [];
let plantBoxes = [];

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

    // rather than accessing one plantBox div, will want an array (or array of array?) of plantBox divs
    // let plantBox = document.getElementById("shelves").children[2].children[0].children[0];

    // TODO: get the next available div from plantBoxes to add image to and call it plantBox
    let plantBox = plantBoxes[2]

    console.log(plantImage);

    let image = document.createElement("img");
    image.setAttribute('src', plantImage);
    image.setAttribute('class', 'plantImage')
    plantBox.appendChild(image);
}
let onLoad = async () => {
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

    
    //populate plant boxes function goes here

    // the for loop where we populate plants in getPlantData is helpful, with a couple of differences

    // for plantBoxes, we could have a double loop
    //     outer one to get each shelf: children[i].children[0].children    -----> might be able to only loop once here and use concat
    //     inner one to get each plantBox on a shelf: children[i].children[0].children[j]
    // want to append each of those children to plantBoxes (actually using method append)

    // or could have a single loop
    //     to get each shelf: children[i].children[0].children
    // want to concat that array (array?????) of children to plantBoxes (actually using method concat)




    // we are making this
    // [<div>, <div>, <div>, <div>, <div>, <div>]

    // do we need to make this?
    // [
    //   {
    //     element: <div>,
    //     filled: true,
    //   },
    //   {
    //     element: <div>,
    //     filled: true,
    //   },
    //   {
    //     element: <div>,
    //     filled: true,
    //   },
    //   {
    //     element: <div>,
    //     filled: true,
    //   },
    //   {
    //     element: <div>,
    //     filled: true,
    //   },
    //   {
    //     element: <div>,
    //     filled: false,
    //   }
    // ]

    
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