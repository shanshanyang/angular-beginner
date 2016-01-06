angular.module('project', ['ngRoute', 'firebase'])
 
.value('fbURL', 'https://ssyang.firebaseio.com/')
.service('fbRef', function(fbURL) {
  return new Firebase(fbURL)
})
.service('fbAuth', function($q, $firebase, $firebaseAuth, fbRef) {
  var auth;
  return function () {
      if (auth) return $q.when(auth);
      var authObj = $firebaseAuth(fbRef);
      if (authObj.$getAuth()) {
        return $q.when(auth = authObj.$getAuth());
      }
      var deferred = $q.defer();
      authObj.$authAnonymously().then(function(authData) {
          auth = authData;
          deferred.resolve(authData);
      });
      return deferred.promise;
  }
})
 
.service('Projects', function($q, $firebase,fbRef, fbAuth, $window) {
  var self = this;
  this.fetch = function () {
    if (this.projects) return $q.when(this.projects);
    return fbAuth().then(function(auth) {
      var deferred = $q.defer();
      var ref = fbRef;
      var $projects = $firebase(ref);
      ref.on('value', function(snapshot) {
        if (snapshot.val() === null) {
            
          var priority = [
              {
              "month": {
                "display": $window.moment().format("MM/YYYY"),
                "date": $window.moment().format()
              }, //the month new priority date is finalized
              "sponsor": "family",
              "type": "F1",
              "country": "philippines",
              "priority": {
                "display": $window.moment(new Date("01JUN03")).format("MM/DD/YYYY"),
                "date": $window.moment(new Date("01JUN03")).format()
                }
              },
              {
              "month": {
                "display": $window.moment().format("MM/YYYY"),
                "date": $window.moment().format()
              },
              "sponsor": "family",
              "type": "F1",
              "country": "chinaMLB",
              "priority": {
                "display": $window.moment(new Date("15MAY08")).format("MM/DD/YYYY"),
                "date": $window.moment(new Date("15MAY08")).format()
                }
              },
              {
              "month": {
                "display": $window.moment().format("MM/YYYY"),
                "date": $window.moment().format()
              }, //the month new priority date is finalized
              "sponsor": "family",
              "type": "F1",
              "country": "mexico",
              "priority": {
                "display": $window.moment(new Date("22DEC94")).format("MM/DD/YYYY"),
                "date": $window.moment(new Date("22DEC94")).format()
                }
              },
              {
              "month": {
                "display": $window.moment().format("MM/YYYY"),
                "date": $window.moment().format()
              }, //the month new priority date is finalized
              "sponsor": "family",
              "type": "F1",
              "country": "india",
              "priority": {
                "display": $window.moment(new Date("15MAY08")).format("MM/DD/YYYY"),
                "date": $window.moment(new Date("15MAY08")).format()
                }
              },
              {
              "month": {
                "display": $window.moment().format("MM/YYYY"),
                "date": $window.moment().format()
              }, //the month new priority date is finalized
              "sponsor": "family",
              "type": "F1",
              "country": "allExcept",
              "priority": {
                "display": $window.moment(new Date("15MAY08")).format("MM/DD/YYYY"),
                "date": $window.moment(new Date("15MAY08")).format()
                }
              }
             ];
          $projects.$set(priority);
        }
        self.projects = $projects.$asArray();
        deferred.resolve(self.projects);
      });
 
      //Remove projects list when no longer needed.
      ref.onDisconnect().remove();
      return deferred.promise;
    });
  };
})
 
.config(function($routeProvider) {
  var resolveProjects = {
    projects: function (Projects) {
      return Projects.fetch();
    }
  };
 
  $routeProvider
    .when('/', {
      controller:'ProjectListController as projectList',
      templateUrl:'list.html',
      resolve: resolveProjects
    })
    .when('/edit/:projectId', {
      controller:'EditProjectController as editProject',
      templateUrl:'user.html',
      resolve: resolveProjects
    })
    .when('/add', {
      controller:'NewProjectController as editProject',
      templateUrl:'user.html',
      resolve: resolveProjects
    })
    .otherwise({
      redirectTo:'/'
    });
})
 
.controller('ProjectListController', function(projects) {
  var projectList = this;
  projectList.projects = projects;
})
 
.controller('NewProjectController', function($location, projects) {
  var editProject = this;
  editProject.save = function() {
      projects.$add(editProject.project).then(function(data) {
          $location.path('/');
      });
  };
})
 
.controller('EditProjectController',
  function($location, $routeParams, projects) {
    var editProject = this;
    var projectId = $routeParams.projectId,
        projectIndex;
 
    editProject.projects = projects;
    projectIndex = editProject.projects.$indexFor(projectId);
    editProject.project = editProject.projects[projectIndex];
 
    editProject.destroy = function() {
        editProject.projects.$remove(editProject.project).then(function(data) {
            $location.path('/');
        });
    };
 
    editProject.save = function() {
        editProject.projects.$save(editProject.project).then(function(data) {
           $location.path('/');
        });
    };
});