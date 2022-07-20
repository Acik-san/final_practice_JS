"use strict";

const cardsSection = document.getElementById("cards-section");
const cardsWrapper = document.getElementById("cards-wrapper");
const socialMap = new Map();

socialMap.set("www.facebook.com", "fa-facebook-f");
socialMap.set("twitter.com", "fa-twitter");
socialMap.set("www.instagram.com", "fa-instagram");

fetch("./assets/js/data.json")
  .then((response) => response.json())
  .then((actors) => {
    const HTMLCollectionActors = actors.map((actor) => createActorCard(actor));
    cardsWrapper.append(...HTMLCollectionActors);
    cardsSection.append(createChoosedList());
  })
  .catch(() => {
    cardsWrapper.append(errorMessage());
  });

const createActorCard = (actor) => {
  const socialIcons = actor.contacts.map((contacts) => {
    const hostName = new URL(contacts).hostname;
    const socialIconItem = createElement("div", {
      classNames: [
        socialMap.get(hostName),
        "fa",
        "fa-stack-1x",
        "white-text-color",
      ],
    });
    const socialIconCircle = createElement("div", {
      classNames: ["fa", "fa-circle", "fa-stack-2x"],
    });
    const socialLink = createElement(
      "a",
      {
        classNames: ["fa-stack", "fa-2xs"],
        attributes: { href: contacts, target: "_blank" },
      },
      socialIconCircle,
      socialIconItem
    );
    return socialLink;
  });
  const actorName =
    actor.firstName || actor.lastName
      ? `${actor.firstName} ${actor.lastName}`
      : "Unknown";
  const actorsName = createElement(
    "h3",
    {
      classNames: ["actors-name"],
      attributes: { id: actor.id, "data-id": actor.id },
    },
    actorName
  );
  const photoInnerImg = createElement("img", {
    classNames: ["photo-inner-img"],
    attributes: {
      src: actor.profilePicture,
      alt: actorName,
      "data-id": actor.id,
    },
    events: { error: handlerPhotoLoadError, load: handlerPhotoLoad },
  });
  const photoInnerInitials = createElement("div", {
    classNames: ["photo-inner-initials", "white-text-color"],
    attributes: { "data-id": actor.id },
    name: [actor.firstName, actor.lastName],
  });
  const photoWrapper = createElement(
    "div",
    {
      classNames: ["photo-wrapper"],
      attributes: { "data-id": actor.id, id: `wrapper-id-${actor.id}` },
    },
    photoInnerInitials,
    photoInnerImg
  );
  const cardsInner = createElement(
    "article",
    {
      classNames: ["cards-inner"],
      attributes: { "data-id": actor.id },
      events: { click: handlerChoosedList },
    },
    photoWrapper,
    actorsName,
    ...socialIcons
  );
  return cardsInner;
};

const createChoosedList = () => {
  const choosedList = createElement("ul", {
    classNames: ['choosed-list'],
    attributes: { id: "choosed-list" },
  });
  const choosedListHeader = createElement(
    "h2",
    { classNames: ["choosed-header"] },
    document.createTextNode("you choosed")
  );
  const choosedWrapper = createElement(
    "article",
    { classNames: ["choosed-wrapper"] },
    choosedListHeader,
    choosedList
  );
  return choosedWrapper;
};

const errorMessage = () => {
  const errorMessageText2 = createElement(
    "p",
    { classNames: ["error-message-inner"] },
    document.createTextNode("Actors cards are temporary out.")
  );
  const errorMessageText1 = createElement(
    "p",
    { classNames: ["error-message-inner"] },
    document.createTextNode("Sorry, some technical problems...")
  );
  const errorMessage = createElement(
    "article",
    { classNames: ["error-message-wrapper"] },
    errorMessageText1,
    errorMessageText2
  );
  return errorMessage;
};

//-------------------------------createElement function-----------------------------

const createElement = (
  tag,
  { classNames = [], attributes = {}, events = {}, name = [] },
  ...children
) => {
  const element = document.createElement(tag);
  if (classNames.length) {
    element.classList.add(...classNames);
  }
  for (const [nameAttr, valueAttr] of Object.entries(attributes)) {
    element.setAttribute(nameAttr, valueAttr);
  }
  for (const [typeEvent, handleEvent] of Object.entries(events)) {
    element.addEventListener(typeEvent, handleEvent);
  }
  if (name.length) {
    element.style.backgroundColor = stringToColour(...name);
    element.append(document.createTextNode(getInitials(name)));
  }
  element.append(...children);
  return element;
};

//------------------------------------Handlers----------------------------------------

const handlerPhotoLoad = ({ target }) => {
  document.getElementById(`wrapper-id-${target.dataset.id}`).append(target);
};

const handlerPhotoLoadError = ({ target }) => {
  target.remove();
};

const actorsNames = [];

const handlerChoosedList = ({ target }) => {
  const actorsName = document.getElementById(target.dataset.id).textContent;
  if (actorsNames.includes(actorsName)) {
    return;
  }
  actorsNames.push(actorsName);
  const actorsNameListItem = createElement(
    "li",
    { classNames: ["choosed-actors-name"] },
    actorsName
  );
  const choosedList = document.getElementById("choosed-list");
  choosedList.append(actorsNameListItem);
};

//----------------------------------tooltips-----------------------------------------

const getInitials = (arr) => {
  return (
    arr
      .toString()
      .split(",")
      .map((string) => string.slice(0, 1))
      .join("") || "U"
  );
};

const stringToColour = (string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += ("00" + value.toString(16)).slice(-2);
  }
  return colour;
};
