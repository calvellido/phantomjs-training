var page = require('webpage').create();

// Callbacks
page.onError = function (msg, trace) {
    console.log(msg);
    trace.forEach(function(item) {
        console.log('  ', item.file, ':', item.line);
    });
};
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
  console.log('Page load finished');
};


// Open page action
console.log('Page load started');
page.open('http://github.com/trending', function(status) {

  if (status === 'success') {

    // The context inside evaluate is sandboxed
    let repo_data_list = page.evaluate(() => {

      // Some functions
      function extractStars(node) {
        // TODO: Add checkings to see if this is a valid nodeElement
        return parseInt(node.innerText.replace(/,/g,''));
      }

      function extractLink(node) {
        // TODO: Add checkings to see if this is a valid nodeElement
        return node.attributes['href'].value;
      }

      let links_nodelist = document.querySelectorAll('ol.repo-list > li > *:first-child a');
      let links_nodelist_array = [];
      for (var i = 0; i < links_nodelist.length; i++) {
        links_nodelist_array[i] = (extractLink(links_nodelist[i]));
      }

      let stars_nodelist = document.querySelectorAll('ol.repo-list > li > *:last-child > span:last-child');
      let stars_nodelist_array = [];
      for (var i = 0; i < stars_nodelist.length; i++) {
        stars_nodelist_array[i] = (extractStars(stars_nodelist[i]));
      }

      let repo_data = [];
      for (var i = 0; i < stars_nodelist.length; i++) {
        repo_data[i] = {
          link: links_nodelist_array[i],
          stars: stars_nodelist_array[i]
        };
      }

      return repo_data;

    });

    let base_href = 'https://github.com';

    // Now we filter the data to only get the ones that got between 100 and 200 stars
    let filtered_repo_data_list = repo_data_list.filter((elem) => elem.stars >= 100 && elem.stars <= 200);

    // Here we fill the links with the base href
    filtered_repo_data_list.map((elem) => elem.link = `${base_href}${elem.link}`)

    filtered_repo_data_list.forEach((elem) => console.log(`repo: ${elem.link}, stars: ${elem.stars}`));

    let most_starred_repo = filtered_repo_data_list[0];

    console.log(`The most trending starred repo today between 100 and 200 stars is: ${most_starred_repo.link} with ${most_starred_repo.stars} stars`);
    console.log('Visiting it...');
    // Now we follow the link of the most starred repo to get a screenshot of it
    console.log('Page load started');
    page.open('https://github.com/airbnb/lottie-android', function(status) {

      if (status === 'success') {
        page.render('most_starred_repo.png');
        phantom.exit();
      }
      else {
        console.log(`Unable to connect to ${most_starred_repo.link}`);
        phantom.exit();
      }
    });

  }
  else {
    console.log('Unable to connect to github.com');
    phantom.exit();
  }

});
