// Global Variables
const addTerm = document.querySelector(".search-container__search");
const searchInput = document.querySelector(".search-container__input");
const container = document.querySelector(".cards-container");
const trigger = document.querySelector(".trigger");
const errorText = document.querySelector(".search-container__error");

// Functions

const createElement = (type, appendLocation, className) => {
  const component = document.createElement(`${type}`);
  if (className) {
    component.classList.add(className);
  }
  appendLocation.appendChild(component);
  return component;
};

const removeCard = (card) => {
  card.parentElement.parentElement.remove();
};

const createHeaderComponents = (cardHeader) => {
  const cardWord = createElement("h3", cardHeader, "card__word");
  const cardPhonetic = createElement("p", cardHeader, "card__phonetic");
  const cardRemoverImg = createElement("img", cardHeader, "card__remove");
  cardRemoverImg.setAttribute("src", "./assets/svgs/remove.svg");
  cardRemoverImg.setAttribute("alt", "remove definition");
  cardRemoverImg.setAttribute("onclick", "removeCard(this)");
  return [cardWord, cardPhonetic];
};

const writeHeaderComponents = (word, phonetic, locations) => {
  locations[0].innerText = word;
  locations[1].innerText = phonetic;
};

const createMainComponents = (cardMain) => {
  const cardDefinitionTitle = createElement("p", cardMain, "card__defintion");
  cardDefinitionTitle.innerText = "Definition:";
  const cardOl = createElement("ol", cardMain);
  return cardOl;
};

const writeDefinitions = (definitions, location) => {
  definitions.forEach((definition) => {
    location.innerHTML += `<li>${definition}</li?`;
  });
};

const createCard = (cardData) => {
  const card = createElement("div", container, "card");
  const cardHeader = createElement("div", card, "card__header");
  const cardMain = createElement("div", card, "card__main");

  const headerComponents = createHeaderComponents(cardHeader);
  const mainOl = createMainComponents(cardMain);

  writeHeaderComponents(cardData.word, cardData.phonetic, headerComponents);
  writeDefinitions(cardData.definitions, mainOl);
};

const createNewCardObject = (wordObject) => {
  const newCardObject = {};
  newCardObject.word = wordObject.word;
  newCardObject.phonetic = `[${wordObject.phonetic.substring(
    1,
    wordObject.phonetic.length - 1
  )}]`;
  newCardObject.definitions = [];
  wordObject.meanings.forEach((meaning) => {
    meaning.definitions.forEach((object) => {
      newCardObject.definitions.push(object.definition);
    });
  });
  return newCardObject;
};

const waitToRemove = () => {
  setTimeout(() => {
    errorText.classList.remove("search-container__error--show");
  }, 5000);
};

const dealWithError = () => {
  errorText.classList.add("search-container__error--show");
  waitToRemove();
};

const getDefinition = async (possibleWord) => {
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${possibleWord}`;
  const response = await fetch(url);
  if (!response.ok) {
    dealWithError();
    return;
  }
  const data = await response.json();
  return data[0];
};

const dealWithAddTerm = async () => {
  const searchTerm = searchInput.value;
  const newVocabObject = await getDefinition(searchTerm);
  if (!newVocabObject) {
    return;
  }
  const cardObject = createNewCardObject(newVocabObject);
  createCard(cardObject);
};

// Logic
addTerm.addEventListener("click", dealWithAddTerm);
