//*1= ku shubida API keys ka santuuqyo(variables) kala duwan.
const apiKey = "0d954f84a3msh862c9a704d7501dp1bf402jsnca760c6210dd";
const apiHost = "microsoft-translator-text-api3.p.rapidapi.com";

//*2= Samaynta function asyncronous aan ku helayo luuqadaha markaas la heli karo.

//1=Get Method Adeegsigiis
const getAvailableLanguages = async () => {
  const url =
    "https://microsoft-translator-text-api3.p.rapidapi.com/languages?api-version=3.0";
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": apiHost,
    },
  };
  try {
    const response = await fetch(url, options);
    // Waxaan hubinayaa in jawaabta aan helayo ay tahay mid aan ok ahayn
    if (!response.ok) {
      throw new Error(
        `Error fetching languages. Status: ${response.status}-${response.statusText}`
      );
    }
    const result = await response.json();
    // Assuming 'translation' contains the language data

    if (result && result.translation) {
      return result.translation;
    } else {
      throw new Error("Invalid response format for languages");
    }
  } catch (error) {
    console.error("Error fetching languages:", error);
  }
};

//*3= Samaynta function gacanta ku hayndoona wax turjumista

// 2=Post Method Adeegsigiis
const translateText = async (fromLanguage, toLanguage, text) => {
  const url = `https://microsoft-translator-text-api3.p.rapidapi.com/translate?to=${toLanguage}&from=${fromLanguage}&textType=plain`;
  const options = {
    method: "POST",
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": apiHost,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([{ text: text }]),
  };
  try {
    const response = await fetch(url, options);

    //Hubinta in falcelintu ay tahay mid ok ah
    if (!response.ok) {
      throw new Error(`Error in translation. Status: ${response.status}-${response.statusText}`);
    }

    const result = await response.json();

    // Checking for valid translation response
    if (result && result[0] && result[0].translations && result[0].translations[0]) {
      return result[0].translations[0].text; // Accessing the translated text
    } else {
      throw new Error("Invalid translation response format");
    }
  } catch (error) {
    console.error("Error in translation", error);
    return "Translation failed: " + error.message;
  }
};

//*4= Samaynta function is siiyana doorashooyinka aan dooran karo luuqadaha adduunka ee ugu caansan.

const populateLanguageOptions = async () => {
  const languages = await getAvailableLanguages();

  if (languages) {
    const fromLanguageSelect = document.querySelector("#from-language");
    const toLanguageSelect = document.querySelector("#to-language");

    // Populate the "from" and "to" language dropdowns
    Object.keys(languages).forEach(languageCode => {
      const optionFrom = document.createElement("option");
      const optionTo = document.createElement("option");

      optionFrom.value = languageCode;
      optionTo.value = languageCode;

      optionFrom.textContent = languages[languageCode].name;
      optionTo.textContent = languages[languageCode].name;

      fromLanguageSelect.appendChild(optionFrom);
      toLanguageSelect.appendChild(optionTo);
    });
  } else {
    console.error("Failed to populate languages: No language data available.");
  }
};

//*5= Function to handle the translation button click 

document.querySelector(".translated-button").addEventListener("click", async () => {
  const fromLanguage = document.querySelector("#from-language").value;
  const toLanguage = document.querySelector("#to-language").value;
  const textInput = document.querySelector("#text-input").value;

  if (textInput.trim() === "") {
    alert("Please enter some text to translate");
    return;
  }

  // Show loading text
  const translateTextElement = document.querySelector(".translated-text");
  translateTextElement.textContent = "Translating...";

  // Call the translateText function and display the result 
  const translatedText = await translateText(fromLanguage, toLanguage, textInput);

  // Display the translated text in the result area
  translateTextElement.textContent = translatedText;
});

// Initialize the language options on page load
document.addEventListener("DOMContentLoaded", () => {
  populateLanguageOptions();
});
