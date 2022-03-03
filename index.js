// https://dictionaryapi.dev/

// Array of card objects
// in each card:
// card__word - word: "perplex"
// card__phonetic - phonetic: "[per-pleks]"
// card__definition - definition: ["def1", "def2"]

// cards = [
//   {
//     word: "string",
//     phonetic: "[string]",
//     definition: "string[array]",
//   },
// ];

// Global Variables
const addTerm = document.querySelector(".search-container__search");
const searchInput = document.querySelector(".search-container__input");
const container = document.querySelector(".cards-container");

// Functions

const createElement = (type, appendLocation, className) => {
  const component = document.createElement(`${type}`);
  if (className) {
    component.classList.add(className);
  }
  appendLocation.appendChild(component);
  return component;
};

const createCard = (cardData) => {
  //   console.log(cardData);
  const card = createElement("div", container, "card");
  const cardHeader = createElement("div", card, "card__header");
  const cardMain = createElement("div", card, "card__main");
  // Header Components
  const cardWord = createElement("h3", cardHeader, "card__word");
  const cardPhonetic = createElement("p", cardHeader, "card__phonetic");
  const cardRemoverImg = createElement("img", cardHeader, "card__remove");
  cardRemoverImg.setAttribute("src", "./assets/svgs/remove.svg");
  cardRemoverImg.setAttribute("alt", "remove definition");
  // Main components
  const cardDefinitionTitle = createElement("p", cardMain, "card__defintion");
  cardDefinitionTitle.innerText = "Definition:";
  const cardOl = createElement("ol", cardMain);
};

const createNewCardObject = (wordObject) => {
  const newCardObject = {};
  // Word
  newCardObject.word = wordObject.word; // Is this a deep copy?
  // Phonetic
  newCardObject.phonetic = `[${wordObject.phonetic.substring(
    1,
    wordObject.phonetic.length - 1
  )}]`;
  // Definition
  newCardObject.definitions = [];
  wordObject.meanings.forEach((meaning) => {
    meaning.definitions.forEach((object) => {
      newCardObject.definitions.push(object.definition);
    });
  });
  return newCardObject;
};

const getDefinition = async (possibleWord) => {
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${possibleWord}`;
  const response = await fetch(url);
  const data = await response.json();
  return data[0];
};

const dealWithAddTerm = async () => {
  const searchTerm = searchInput.value;
  const newVocabObject = await getDefinition(searchTerm);
  const cardObject = createNewCardObject(newVocabObject);
  //   console.log(cardObject);
  createCard(cardObject);
};

// Logic
addTerm.addEventListener("click", dealWithAddTerm);
