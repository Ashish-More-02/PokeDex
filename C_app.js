// Selecting elements
const home = document.querySelector(".home");
const earth = document.querySelector(".earth");
const search = document.querySelector(".search");
const danger = document.querySelector(".danger");

const pokeDex = document.querySelector("#pokeDex");
const searchBox = document.querySelector("#textBox");
const btn = document.querySelector("#butt");
const pokemonSprite = document.querySelector("#PS");
const homePage = document.querySelector("#homepage");
const allPokemonContainer = document.querySelector("#allPokemonContainer");
const bottomNav = document.querySelector("#bottomNavBar");
const pokeLogo = document.querySelector("#pokeImg");
const shinyToggleBtn = document.querySelector("#stars");

home.classList.add("home_A");

// Throttle function to reduce the number of API calls
function throttle(func, delay) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func.apply(this, args);
    }
  };
}

btn.addEventListener("click", throttle(fetchPokemon, 1500));

// Fetch Pokemon Data and Display
async function fetchPokemon() {
  try {
    const PokemonName = searchBox.value.toLowerCase();
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${PokemonName}`
    );

    document.querySelector("#pokeball").style.backgroundImage = "url('')";

    if (!response.ok) throw new Error("Pokemon not found");

    const spriteImg = await response.json();
    pokemonSprite.src = spriteImg.sprites.front_default;

    // Fetching the Pokémon species data for flavor text
    const speciesResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${PokemonName}/`
    );
    if (!speciesResponse.ok) throw new Error("Pokemon species data not found");

    const speciesData = await speciesResponse.json();
    document.querySelector("#info p").innerText =
      speciesData.flavor_text_entries[0].flavor_text;

    home.classList.add("home_A");
    earth.classList.remove("earth_A");
  } catch (error) {
    console.error("Error fetching data:", error);
    alert(
      "Error fetching Pokemon data. Please check the Pokemon name and try again."
    );
  }
}

// Fetch Shiny Version of Pokemon
pokemonSprite.addEventListener("dblclick", fetchShinyPokemon);
shinyToggleBtn.addEventListener("click", fetchShinyPokemon);

let toggleShiny = false;

async function fetchShinyPokemon() {
  try {
    const PokemonName = searchBox.value.toLowerCase();
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${PokemonName}`
    );

    if (!response.ok) throw new Error("Pokemon not found");

    const spriteData = await response.json();
    pokemonSprite.src = toggleShiny
      ? spriteData.sprites.front_default
      : spriteData.sprites.front_shiny;

    if (toggleShiny == false) {
      confetti({
        particleCount: 70,
        spread: 50,
      });
    }
    toggleShiny = !toggleShiny; // Toggle the state
  } catch (error) {
    console.error("Error fetching shiny Pokemon:", error);
    alert(
      "Error fetching shiny version. Please check the Pokemon name and try again."
    );
  }
}

// Display All Pokémon on Click of the Logo
pokeLogo.addEventListener("click", getAllPokemon);

async function getAllPokemon() {
  try {
    homePage.style.display = "none"; // Hide homepage
    setupBottomNavBar(); // Setup navigation bar style

    const resp = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=151&offset=0`
    );
    if (!resp.ok) throw new Error("Could not fetch all Pokemon data");

    const pokemonList = await resp.json();
    allPokemonContainer.innerHTML = ""; // Clear existing content

    for (const pokemon of pokemonList.results) {
      const pokemonDiv = createPokemonDiv(pokemon);
      allPokemonContainer.appendChild(pokemonDiv);
    }
  } catch (error) {
    console.error("Error fetching all Pokemon:", error.message);
    alert("There was an error fetching the list of Pokemon.");
  }
}

// Create a Pokémon div element
function createPokemonDiv(pokemon) {
  const div = document.createElement("div");
  div.classList.add("innerContainer");

  const Para = document.createElement("div");
  Para.classList.add("Pname");
  Para.innerText = pokemon.name;

  fetchPokemonImage(pokemon.url, div);
  div.appendChild(Para);

  // Add click event to update searchBox and fetch specific Pokemon
  div.addEventListener("click", async () => {
    searchBox.value = Para.innerText;
    await fetchPokemon();
    goToHome();
  });

  return div;
}



// Fetch Pokémon Image
async function fetchPokemonImage(url, div) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Could not get images of Pokemon!");

    const data = await response.json();
    const pokeImg = document.createElement("img");
    pokeImg.src = data.sprites.front_default;
    div.appendChild(pokeImg);
  } catch (err) {
    console.log(err.message);
  }
}

// Setup bottom navigation bar style
function setupBottomNavBar() {
  bottomNav.style.position = "sticky";
  bottomNav.style.bottom = "0px";
  bottomNav.style.borderRadius = "0px";
}

// Navigation functions
function goToHome() {
  allPokemonContainer.innerHTML = "";
  homePage.style.display = "flex";
  bottomNav.style.borderRadius = "0px 0px 20px 20px";
}

function goTodanger(){

  alert("pokedex will go in self destruct mode in about 5 seconds!");
  setTimeout(()=>{
    pokeDex.classList.add("selfDestruct");
    let div = document.createElement("div");
    div.innerHTML = "☠️";
    div.classList.add("selfDestruct");
    pokeDex.style.justifyContent = "center";
    pokeDex.innerHTML ="";
    pokeDex.appendChild(div);
    
  },3000);
}

// Handle click events for navigation elements
function handleClick(clickedElement, classToAdd) {
  clickedElement.classList.add(classToAdd);

  // Remove the classes from other elements
  if (clickedElement !== home) home.classList.remove("home_A");
  if (clickedElement !== earth) earth.classList.remove("earth_A");
  if (clickedElement !== search) search.classList.remove("search_A");
  if (clickedElement !== danger) danger.classList.remove("danger_A");
}

// Event listeners for navigation elements
home.addEventListener("click", () => {
  handleClick(home, "home_A");
  goToHome();
});

earth.addEventListener("click", () => {
  handleClick(earth, "earth_A");
  getAllPokemon();
});

search.addEventListener("click", () => {
  handleClick(search, "search_A");
  goToHome();
  searchBox.focus();
});

danger.addEventListener("click", () => {
  handleClick(danger, "danger_A");
  console.log("Danger is clicked");
  goTodanger();
});
