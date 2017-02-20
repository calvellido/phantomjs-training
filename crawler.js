"use strict";

var page = require('webpage').create();

// Callbacks
page.onResourceRequested = function(request) {
  // console.log('Request ' + JSON.stringify(request, undefined, 4));
};
page.onResourceReceived = function(response) {
  // console.log('Receive ' + JSON.stringify(response, undefined, 4));
};
page.onConsoleMessage = function(msg) {
  console.log(msg);
};
page.onLoadFinished = function(msg) {
  console.log("Load finished");
};

// Open page action
page.open('http://github.com/trending', function(status) {
  console.log("Status: " + status)
  if (status === "success") {
    // page.render("github.png");

    let repo_href = page.evaluate(function() {
      return document.querySelector("ol.repo-list > li:first-child > *:first-child a").attributes["href"].value;
    });

    let repo_stars_today = page.evaluate(function() {
      return parseInt(document.querySelector("ol.repo-list > li:first-child > *:last-child > span:last-child").innerText.replace(/,/g,''));
    });

    let link = "https://github.com" + repo_href;

    console.log(link);
    console.log(repo_stars_today);
  }
  else {
    console.log("Unable to connect to github.com");
  }
  phantom.exit();
});
