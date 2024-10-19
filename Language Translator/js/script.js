const fromtext = document.querySelector(".from-text"),
  toText = document.querySelector(".to-text"),
  selectTag = document.querySelectorAll("select"),
  exchangeIcon = document.querySelector(".exchange"),
  translatebtn = document.querySelector("button"),
  icons = document.querySelectorAll(".row i");

selectTag.forEach((tag, id) => {
  for (const country_code in countries) {
    //selecting english by default as from language and hindi as to language
    let selected;
    if (id == 0 && country_code == "en-GB") {
      selected = "selected";
    } else if (id == 1 && country_code == "hi-IN") {
      selected = "selected";
    }
    let option = `<option value="${country_code}" ${selected}>${countries[country_code]}</option>`;
    tag.insertAdjacentHTML("beforeend", option); //adding options tags inside select tag
  }
});

exchangeIcon.addEventListener("click", () => {
  //exchange textarea and select tag values
  let tempText = fromtext.value,
    templang = selectTag[0].value;
  fromtext.value = toText.value;
  selectTag[0].value = selectTag[1].value;
  toText.value = tempText.value;
  selectTag[1].value = templang;
});

translatebtn.addEventListener("click", () => {
  let text = fromtext.value,
    translateFrom = selectTag[0].value, //getting fromselect tag value
    translateTo = selectTag[1].value; //getting toselect tag value
    if(!text) return;
    toText.setAttribute("placeholder","Translating...");
  let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
  //fetching api response and returning it with parsing into js obj
  //and in another then method receiving that obj
  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      toText.value = data.responseData.translatedText;
      toText.setAttribute("placeholder", "Translation");
    });
});
icons.forEach((icon) => {
  icon.addEventListener("click", ({ target }) => {
    if (target.classList.contains("fa-copy")) {
        // if clicked icon has from id, copy the fromtextarea value else copy the totextarea value
      if (target.id == "from") {
        navigator.clipboard.writeText(fromtext.value);
      } else {
        navigator.clipboard.writeText(toText.value);
      }
    } else {
        let utterance;
        // if clicked icon has from id , speak  the fromtextarea value else speak the totextarea value 
    if (target.id == "from") {
      utterance = new SpeechSynthesisUtterance(fromtext.value);
      utterance.lang = selectTag[0].value; //setting utterance language to fromselect tag value
    } else {
      utterance = new SpeechSynthesisUtterance(toText.value);
      utterance.lang = selectTag[1].value;  // setting utterance language to toselect tag value
    }
    speechSynthesis.speak(utterance);//speak the passed utterance
    }
  });
});
