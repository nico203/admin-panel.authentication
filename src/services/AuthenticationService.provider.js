angular.module('adminPanel.authentication').provider('AuthenticationService', function() {
    var excludePaths = ['/login'];
    var apiPath = null;
    var maxSessionTime = 3600;

    this.setApiPath = function(path) {
        if(!(path instanceof String) && typeof(path) !== 'string') {
            throw 'The path must be a String.';
        }
        apiPath = path;
        
        return this;
    };
    this.excludePaths = function(paths) {
        if(!(paths instanceof Array)) {
            throw 'The paths must be an Array of Strings';
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


    this.$get = [
        '$http', 'UserService', 'FirewallService',
        function($http, User, Firewall) {
            if(apiPath === null) {
                throw 'The path must be initialized.';
            }
            
            Firewall.setExcludePaths(excludePaths);
            
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

});