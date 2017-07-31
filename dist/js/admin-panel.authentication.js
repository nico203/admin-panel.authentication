
angular.module('adminPanel.authentication', [
    'ngStorage',
    'ngRoute',
    'adminPanel'
]).config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/login', {});
}]).config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('AuthenticationInterceptor');
}]);;angular.module('adminPanel.authentication').directive('apUser',[
    'AuthenticationService', '$location', function(AuthenticationService, $location) {
        return {
            restrict: 'A',
            transclude: true,
            link: function(scope) {
                function chekIfUserLogged() {
                    scope.user = AuthenticationService.checkLogin();
                    if(scope.user && $location.path() === '/login') {
                        $location.path('/');
                    }
                }
                
                chekIfUserLogged();
                
                scope.$on('$routeChangeStart', function() {
                    chekIfUserLogged();
                });
            },
            templateUrl: 'directive/user.template.html'
        };
    }
]);;function loginFormController($scope, $location, AuthenticationService) {
    $scope.username = '';
    $scope.password = '';
    $scope.error = '';
    
    $scope.submit = function() {
        $scope.error = '';
        if($scope.form.$valid) {
            $scope.$emit('apLoad:start');
            AuthenticationService.login($scope.username, $scope.password, function (result) {
                $scope.$emit('apLoad:finish');
                if (result === true) {
                    $location.path('/');
                } else {
                    $scope.error = 'Usuario o contraseña incorrectos';
                }
            });
        }
    };
 
    this.$onInit = function() {
        // reset login status
        if(!AuthenticationService.checkLogin()) {
            AuthenticationService.logout();
        }
    };
    
    this.$postLink = function() {
        $('login-form').foundation();
    };
}

angular.module('adminPanel.authentication').component('loginForm', {
    templateUrl: 'login-form/login-form.template.html',
    controller: ['$scope','$location', 'AuthenticationService', loginFormController]
});;function loginController($scope) {
    
    this.$postLink = function() {
        $('login').foundation();
    };
}

angular.module('adminPanel.authentication').component('login', {
    templateUrl: 'login/login.template.html',
    controller: ['$scope', loginController]
});;angular.module('adminPanel.authentication').factory('AuthenticationInterceptor',[
    '$q', '$location', 'UserService', 'FirewallService', function($q, $location, User, Firewall) {
        function redirectLogin() {
            if($location.path() !== '/login') {
                $location.path('/login');
            }
        }
        
        return {
            request: function(config) {
                User.setLogged(null);
                if(Firewall.isAllowedPath($location.path())) {
                    User.setLogged(true);
                    return config;
                }
                if(!config.headers.Authorization) {
                    if(User.isLogged()) {
                        config.headers.Authorization = 'Bearer ' + User.getToken();
                    } else {
                        redirectLogin();
                    }
                }
                return config;
            },
            responseError: function (response) {
                if (response.status === 401){
                    User.logout();
                    redirectLogin();
                }
                return $q.reject(response);
            }
        };
    }
]);
;angular.module('adminPanel.authentication').provider('AuthenticationService', function() {
    var excludePaths = ['/login'];
    var apiPath = null;
    var maxSessionTime = 3600;
    var debugMode = false;

    this.setApiPath = function(path) {
        if(!(path instanceof String) && typeof(path) !== 'string') {
            throw 'The path must be a String.';
        }
        apiPath = path;
        
        return this;
    };
    this.excludePaths = function(paths) {
        if(!(paths instanceof Array)) {
            throw 'The paths must be an Array of Regex';
        }
        excludePaths = paths;
        
        return this;
    };
    this.setMaxSessionTime = function(time) {
        if(!(time instanceof Number) && typeof(time) !== 'number') {
            throw 'The time must be numeric';
        }
        maxSessionTime = time;
        
        return this;
    };
    this.enableDebugMode = function () {
        debugMode = true;
    };
    

    this.$get = [
        '$http', 'UserService', 'FirewallService',
        function($http, User, Firewall) {
            if(apiPath === null) {
                throw 'The path must be initialized.';
            }
            
            if(debugMode) {
                Firewall.setExcludePaths([/^./]);
            } else {
                Firewall.setExcludePaths(excludePaths);
            }
            
            return {
                login: Login,
                logout: Logout,
                checkLogin: checkLogin
            };
            
            function checkLogin() {
                if(User.isLogged()) {
                    $http.defaults.headers.common.Authorization = 'Bearer ' + User.getToken();
                    return true;
                }
                return false;
            }
            
            function Login(username, password, callback) {
                var promise = $http.post(apiPath + '/login', { _username: username, _password: password });
                promise.then(function (response) {
                    if (response.data && response.data.token) {
                        User.login({
                            username: username, 
                            token: response.data.token,
                            maxSessionTime: maxSessionTime,
                            excludePaths: excludePaths
                        });

                        $http.defaults.headers.common.Authorization = 'Bearer ' + response.data.token;

                        callback(true);
                    } else {
                        callback(false);
                    }
                }, function(error) {
                    callback(false, error);
                });
            }

            function Logout() {
                User.logout();
                $http.defaults.headers.common.Authorization = '';
            }
        }
    ];

});;angular.module('adminPanel.authentication').service('FirewallService', [
    function() {
        var excludePaths = null;
        
        var checkPaths = function(path) {
            for(var i = 0; i < excludePaths.length; i++) {
                if(path.match(excludePaths[i])) {
                    return true;
                }
            }
            return false;
        };
        
        this.setExcludePaths = function(paths) {
            excludePaths = paths;
        };
        
        this.isAllowedPath = function (path) {
            if(excludePaths !== null) {
                return checkPaths(path);
            }
            return false;
        };
    }
]);
;angular.module('adminPanel.authentication').service('UserService', [
    '$localStorage', function($localStorage) {
        var logged = false;
        this.login = login;
        this.logout = logout;
        this.getUsername = getUsername;
        this.isLogged = isLogged;
        this.setLogged = setLogged;
        this.getToken = getToken;
        this.setToken = setToken;
        this.isGranted = isGranted;
        
        function login (object) {
            object.timestamp = new Date().getTime();
            $localStorage.currentUser = object;
        }
        
        function logout() {
            delete $localStorage.currentUser;
        }
        


        function getUsername() {
            if($localStorage.currentUser) {
                return $localStorage.currentUser.username;
            }
            return '';
        }
        
        function setLogged(val) {
            logged = val;
        }
        
        function isLogged() {
            if(logged === true) return true;
            var now = new Date().getTime();
            if($localStorage.currentUser && 
                    now - $localStorage.currentUser.timestamp < $localStorage.currentUser.maxSessionTime * 1000) {
                return true;
            }
            logout();
            return false;
        }
        
        function getToken() {
            if($localStorage.currentUser) {
                return $localStorage.currentUser.token;
            }
            return '';
        }
        
        function setToken(token) {
            if(!$localStorage.currentUser) {
                return false;
            }
            $localStorage.currentUser.token = token;
            
            return true;
        }
        
        function isGranted(role) {
            if($localStorage.currentUser && $localStorage.currentUser.roles) {
                return $localStorage.currentUser.roles.indexOf(role) !== -1;
            }
            return false;
        }
    }
]);
;angular.module('adminPanel.authentication').run(['$templateCache', function ($templateCache) {
  $templateCache.put("directive/user.template.html",
    "<div ng-if=!user><login></login></div><div ng-if=user ng-transclude></div>");
  $templateCache.put("login-form/login-form.template.html",
    "<form name=form ng-submit=submit() data-abide novalidate><div ng-if=error class=\"alert callout\"><p><i class=\"fa fa-warning\"></i><span ng-bind=error></span></p></div><label>Usuario <input name=username type=text ng-model=username required><span class=form-error>El usuario es requerido</span></label><label>Contraseña <input name=password type=password ng-model=password required><span class=form-error>La contraseña es requerida</span></label><label><input type=submit class=button value=Login></label></form>");
  $templateCache.put("login/login.template.html",
    "<div class=background><div class=top></div><div class=bottom></div></div><div class=container><ap-box class=login-form title=Login init=init()><login-form></login-form></ap-box></div>");
}]);
