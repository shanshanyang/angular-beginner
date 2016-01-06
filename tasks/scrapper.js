var cheerio = require('cheerio');
var request = require('request');

// request scrapper page
request('http://travel.state.gov/content/visas/en/immigrate/immigrant-process/approved/checkdate.html',
  function (error, response, body) {
  if (!error && response.statusCode == 200) {
      var $ = cheerio.load(body);
      var upcomingmonth = $('script:contains("upComingMonths")')
                          .eq(1).text()
                          .split(';')[1]
                          // .split('\n\t\t\t')
                          // .join('')
                          .split('\n\t')
                          .join('')
                          .split('upComingMonths');
      // clean up the data
      var familysponsored = upcomingmonth[1]
                            .replace('.', '')
                            .replace('=', ':');
      var employmentBased = upcomingmonth[2]
                            .replace('thisMonths = {}', '')
                            .replace('.', '')
                            .replace('=', ':');
                            
      // add double quote to all words
      var regex = /\w+(?= :)/g;
      var addQuote = function(match) {
        return '"' + match + '"';
      }
      familysponsored = JSON.parse('{'+
                          familysponsored.replace(regex, addQuote)
                        +'}');
      employmentBased = JSON.parse('{'+
                          employmentBased.replace(regex, addQuote)
                        +'}');
      
  }
});

module.exports = {
  upcoming: function() {
    return Object.assign(familysponsored, employmentBased);
  }
}