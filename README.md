simple CRUD app to check priority date of greencard application

MVP:
- Use proxy to spy on page source data from official site
http://travel.state.gov/content/visas/en/immigrate/immigrant-process/approved/checkdate.html
- grab the data and upload to firebase
    - Convert upcomingmonth | this month to actual month number based on scrapper date
    - Parse prority date data
    - Validate JSON format
    - insert to database
- render priority date view for this month and next month

More features for usability:
- simple user profile: country of birth, sponsor type: (family/emplyment)
- user authentication
- render past priority date in graph based on user's profile
- browser notification 
- progressive web app
- integrate with IFTT, google calendar, Gmail

Tech debt:
- web scrapper: jsDom (window.upComingMonths)
- create 4 versions of the same app in Angular v1.48, Angular v2, React, Polymer ,Web Components
- tools: webpack, babel, node, ES6, D3
- database: firebase