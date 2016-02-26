angular.module('project', ['ngRoute', 'firebase'])
 
.value('fbURL', 'https://ssyang.firebaseio.com/')
.service('fbRef', function(fbURL) {
  return new Firebase(fbURL);
})
.service('fbAuth', function($q, $firebase, $firebaseAuth, fbRef) {
  var auth;
  return {
    auth: function () {
      // TODO: create User; authObj.$createUser()
      // TODO: authObj.$onAuth(), $requireAuth(), $sendPasswordResetEmail(), $waitForAuth()
      if (auth) return $q.when(auth); 
      
      var authObj = $firebaseAuth(fbRef);
      if (authObj.$getAuth()) {
        
        // console.log(authObj.$getAuth().uid, authObj.$getAuth().provider);
        
        return $q.when(auth = authObj.$getAuth());
      }
      var deferred = $q.defer();
      /************ 
         facebook
      *************/
      // var ref = new Firebase("https://ssyang.firebaseio.com");
      fbRef.authWithOAuthPopup("facebook", function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          console.log("Authenticated successfully with payload:", authData);
        }
      }, {
        remember: "sessionOnly",
        scope: "email" // the permissions requested
      }).then(function(authData) {
        console.log(authData.facebook);
                auth = authData;
                deferred.resolve(authData);
            });
      
      return deferred.promise;
    },
    unauth: function () {
      var authObj = $firebaseAuth(fbRef);
      console.log(authObj, authObj.$getAuth());
      if (authObj.$getAuth()) {
        authObj.$unauth();
        // console.log(authObj.$getAuth().uid, authObj.$getAuth().provider);
        
        // return $q.when(auth = authObj.$getAuth());
      }
      
    }
  }
})
.service('Profile', function($q, $firebase,$firebaseAuth,fbRef, fbAuth, $window) {
  var self = this;
  this.load = function () {
    console.log($q, this);
    if (this.profile) return $q.when(this.profile);
   
    return fbAuth.auth().then(function(profile) {
      
      var $profile = $firebase(fbRef);
      var user = this;
      var $provider = profile.auth.provider; 
      user.email = profile[$provider].email;
    
      $firebaseAuth(fbRef).$createUser(user.email, "password").then(function() {
        console.info("User created successfully!");
      }).catch(function(error) {
        console.warn("Error:", error);
      });
      
      return profile;
    });
  };
})
.service('Projects', function($q, $firebase,fbRef, fbAuth, $window) {
  var self = this;
  this.fetch = function () {
    if (this.projects) return $q.when(this.projects);
    return fbAuth.auth().then(function(auth) {
      var deferred = $q.defer();
      var ref = fbRef; //.child('data/' + auth.auth.uid);
      var $projects = $firebase(ref);
      ref.on('value', function(snapshot) {
        if (snapshot.val() === null) {
            
          var priority = [
              {
              "month": {
                "display": $window.moment().format("MM/YYYY"),
                "timestamp": $window.moment().format()
              }, //the month new priority date is finalized
              "sponsor": "family",
              "type": "F1",
              "country": "philippines",
              "priority": {
                "display": $window.moment(new Date("01JUN03")).format("MM/DD/YYYY"),
                "timestamp": $window.moment(new Date("01JUN03")).format()
                }
              },
              {
              "month": {
                "display": $window.moment().format("MM/YYYY"),
                "timestamp": $window.moment().format()
              },
              "sponsor": "family",
              "type": "F1",
              "country": "chinaMLB",
              "priority": {
                "display": $window.moment(new Date("15MAY08")).format("MM/DD/YYYY"),
                "timestamp": $window.moment(new Date("15MAY08")).format()
                }
              },
              {
              "month": {
                "display": $window.moment().format("MM/YYYY"),
                "timestamp": $window.moment().format()
              }, //the month new priority date is finalized
              "sponsor": "family",
              "type": "F1",
              "country": "mexico",
              "priority": {
                "display": $window.moment(new Date("22DEC94")).format("MM/DD/YYYY"),
                "timestamp": $window.moment(new Date("22DEC94")).format()
                }
              },
              {
              "month": {
                "display": $window.moment().format("MM/YYYY"),
                "timestamp": $window.moment().format()
              }, //the month new priority date is finalized
              "sponsor": "family",
              "type": "F1",
              "country": "india",
              "priority": {
                "display": $window.moment(new Date("15MAY08")).format("MM/DD/YYYY"),
                "timestamp": $window.moment(new Date("15MAY08")).format()
                }
              },
              {
              "month": {
                "display": $window.moment().format("MM/YYYY"),
                "timestamp": $window.moment().format()
              }, //the month new priority date is finalized
              "sponsor": "family",
              "type": "F1",
              "country": "allExcept",
              "priority": {
                "display": $window.moment(new Date("15MAY08")).format("MM/DD/YYYY"),
                "timestamp": $window.moment(new Date("15MAY08")).format()
                }
              }
             ];
          $projects.$set(priority);
          // $projects = snapshot.val();
        }
        self.projects = $projects.$asArray();
        deferred.resolve(self.projects);
      });
 
      //Remove projects list when no longer needed.
      // ref.onDisconnect().remove();
      return deferred.promise;
    });
  };
})
 
.config(function($routeProvider) {
  var resolveProjects = {
    projects: function (Projects) { //'Projects' is the service
      return Projects.fetch();
    }
  };
  
  var resolveProfile = {
    profile: function (Profile) {
      return Profile.load();
    }
  };
 
  $routeProvider
    .when('/list', {
      controller:'ProjectListController as projectList',
      templateUrl:'list.html',
      resolve: resolveProjects
    })
    .when('/user', {
      controller:'ProfileController as profile',
      templateUrl:'user.html',
      resolve: resolveProfile
    })
    .otherwise({
      redirectTo:'/'
    });
})
 
.controller('ProfileController', ['$scope', 'profile', 'fbAuth', 'fbRef','$firebaseAuth','$location', function($scope, profile, fbAuth, fbRef, $firebaseAuth, $location) {
  var user = this;
  var $provider = profile.auth.provider; 
  
  user.displayName = profile[$provider].displayName;
  user.profileImageURL = profile[$provider].profileImageURL;
  user.provider = $provider;
  
  // create User
  
  // logout method
  $scope.logout = function() {
    // kill session
    // $firebaseAuth(fbRef).$unauth();
    fbAuth.unauth();
    $location.path('/');
  };
  return user;
}])
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