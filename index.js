const cheerio = require('cheerio');
const axios = require('axios');
const { Configuration, OpenAIApi } = require("openai");

// Create a key.js file with the API key stored in a 'const key' and export it with, module.exports.apikey = key;
const apikey = require('./key');
const key = apikey.OpenAIAPI;


var text, url;

chrome.tabs.query(
  {
    currentWindow: true,    // currently focused window
    active: true            // selected tab
  },
  function (foundTabs) {
    if (foundTabs.length > 0) {
      url = foundTabs[0].url + "/blob/main/README.md";
      async function getData() {
        if (url.startsWith('https://github.com/')) {

          try {

            const response = await axios.get(url);
            const $ = cheerio.load(response.data);
            const data = $('article').text();
            text = data;


          }
          catch (error) {
            text = "error";
            console.error(error);
          }

        }
        else {
          text = "error";
          console.log('Invalid URL');
        }


        const configuration = new Configuration({
          apiKey: key,
        });


        const openai = new OpenAIApi(configuration);

        async function runCompletion() {
          const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: "Generate 10 keywords from the following :\n\n" + text,
            max_tokens: 200,
          });


          chrome.tabs.query(
            {
              currentWindow: true,    // currently focused window
              active: true            // selected tab
            },
            function (foundTabs) {
              if (foundTabs.length > 0) {

                document.querySelector('#keyPoints').innerHTML = completion.data.choices[0].text;

              } else {
                console.log("error");
              }
            });
        }
        runCompletion();
      }

      getData();

    } else {
      console.log("error");
    }
  }
);


      // // document.querySelector('#keyPoints').innerHTML = completion.data.choices[0].text;
