

// Selecting elements
const home = document.querySelector(".home");
const earth = document.querySelector(".earth");
const search = document.querySelector(".search");
const danger = document.querySelector(".danger");

const searchBox = document.querySelector("#textBox");
const btn = document.querySelector("#butt");
const pokemonSprite = document.querySelector("#PS");
let Home = document.querySelector("#homepage");
let allPoekmonContainer = document.querySelector("#allPokemonContainer");
let bottomNav = document.querySelector("#bottomNavBar");

btn.addEventListener("click", throttle(fetchPokemon, 1500));

// Performance Improvement-1 : implemented throttling to reduce the number of API calls
function throttle(func, delay) {
  let lastCall = 0;
  // this args is used so that if fetchPokemon have any arguments it can go here
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func.apply(this, args);
    }
  };
}

// feature-1 : fetch pokemon image and description when clicked on the button , based on user input of any pokemon name

async function fetchPokemon() {
  try {
    let PokemonName = searchBox.value.toLowerCase();
    // Fetching the Pokémon data
    let response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${PokemonName}`
    );

    if (!response.ok) throw new Error("Pokemon not found");

    let spriteImg = await response.json();
    pokemonSprite.src = spriteImg.sprites.front_default;

    document.querySelector("#pokeball").style.backgroundImage = "url('')";
    // Fetching the Pokémon species data for flavor text
    let a = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${PokemonName}/`
    );

    if (!a.ok) throw new Error("Pokemon species data not found");

    let b = await a.json();

    // Displaying flavor text in the designated element
    document.querySelector("#info p").innerText =
      b.flavor_text_entries[0].flavor_text;
  } catch (error) {
    console.error("Error fetching data:", error);
    alert(
      "Error fetching Pokemon data. Please check the Pokemon name and try again."
    );
  }
}

// feature-2 : create a shiny button to toggle bewteen shiny pokemon and normal pokemon sprites

pokemonSprite.addEventListener("dblclick", fetchShinyPokemon);

document.querySelector("#stars").addEventListener("click", fetchShinyPokemon);
let toggleShiny = 0;

async function fetchShinyPokemon() {
  if (toggleShiny == 0) {
    try {
      let PokemonName = searchBox.value.toLowerCase();
      let shinyName = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${PokemonName}`
      );

      if (!shinyName.ok) throw new Error("Pokemon not found");

      let ans = await shinyName.json();

      pokemonSprite.src = ans.sprites.front_shiny;
    } catch (error) {
      console.error("Error fetching shiny Pokemon:", error);
      alert(
        "Error fetching shiny version. Please check the Pokemon name and try again."
      );
    }
    toggleShiny++;
  } else {
    let PokemonName = searchBox.value.toLowerCase();
    let response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${PokemonName}`
    );

    if (!response.ok) {
      throw new Error("Pokemon not found");
    }

    let spriteImg = await response.json();
    pokemonSprite.src = spriteImg.sprites.front_default;

    toggleShiny = 0;
  }
}

// feature-3 : display all pokemon when clicked on the logo on top.

document.querySelector("#pokeImg").addEventListener("click", getAllPokemon);

async function getAllPokemon() {
  //disappearing our homepage
  Home.style.display = "none";

  // styling the bottom nav bar
  bottomNav.style.position = "sticky";
  bottomNav.style.bottom = "0px";
  bottomNav.style.top = "0px";
  bottomNav.style.borderRadius = "0px";

  let TotalnumberOfPokemon = 100;
  try {
    let resp = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${TotalnumberOfPokemon}&offset=0`
    );

    // error handling
    if (!resp.ok) {
      throw new Error("could not fetch all pokemon data");
    }

    let ans = await resp.json();

    // used to access all the pokemon

    // for(let x in ans.results){
    //     console.log(ans.results[x].name);
    // }

    // Clear previous contents to avoid duplication when clicking multiple times
    allPokemonContainer.innerHTML = "";

    // here x is only the key m  which indicate pokemon number
    for (let x in ans.results) {
      let div = document.createElement("div");
      div.classList.add("innerContainer");
      let Para = document.createElement("div");
      Para.classList.add("Pname");
      Para.innerText = ans.results[x].name;

      try {
        let A = await fetch(ans.results[x].url);
        if (!A.ok) {
          throw new Error("could not get images of pokemon !");
        }

        let B = await A.json();

        let pokeimg = document.createElement("img");
        pokeimg.src = B.sprites.front_default;

        div.appendChild(pokeimg);
      } catch (err) {
        console.log(err.message);
      }

      div.appendChild(Para);

      allPoekmonContainer.appendChild(div);
    }
  } catch (error) {
    console.error("Error fetching all Pokemon:", error.message);
    alert("There was an error fetching the list of Pokemon.");
  }
}






// some important functions for navigation bar

function goToHome() {
  allPoekmonContainer.innerHTML = "";
  Home.style.display = "flex";
  bottomNav.style.borderRadius = "0px 0px 20px 20px";
}

function goToAllPokemon() {
  getAllPokemon();
}

function goToSearch() {}

function goToDanger() {}

// Function to handle adding and removing classes
function handleClick(clickedElement, classToAdd) {
  // Add the appropriate class to the clicked element
  clickedElement.classList.add(classToAdd);

  // Remove the classes from other elements
  if (clickedElement !== home) home.classList.remove("home_A");
  if (clickedElement !== earth) earth.classList.remove("earth_A");
  if (clickedElement !== search) search.classList.remove("search_A");
  if (clickedElement !== danger) danger.classList.remove("danger_A");
}

// Event listeners for each element
home.addEventListener("click", () => {
  handleClick(home, "home_A");
  console.log("Home is clicked");
  goToHome();
});

earth.addEventListener("click", () => {
  handleClick(earth, "earth_A");
  console.log("Earth is clicked");
  getAllPokemon().then(()=>{

    const allPokemoncnt = document.querySelectorAll(".innerContainer");
    for(let i=0 ;i<allPokemoncnt.length;i++){
        allPokemoncnt[i].addEventListener('click',()=>{
            
            

            async function updateSearchBoxAndFetch() {
                try {
                    // Update searchBox value and call fetchPokemon
                    searchBox.value = allPokemoncnt[i].lastElementChild.innerText;
                    await fetchPokemon(); // Awaiting if fetchPokemon is an async function
            
                    // After fetchPokemon completes, call goToHome
                    goToHome();
                } catch (error) {
                    console.error("An error occurred:", error);
                }
            }
            
            // Call the async function
            updateSearchBoxAndFetch();
            
            
            
        })
    }


    console.log(allPokemoncnt);
    console.log(allPokemoncnt[0].lastElementChild.innerText);
  });
  
});

search.addEventListener("click", () => {
  handleClick(search, "search_A");
  console.log("Search is clicked");
  goToHome();
  searchBox.focus();
});

danger.addEventListener("click", () => {
  handleClick(danger, "danger_A");
  console.log("Danger is clicked");
});

// feature-4 : double tap to evolve a pokemon and any small button to go to previous state.

// feature-5 : implement spell correct , and name suggestions

// feature-6 :
