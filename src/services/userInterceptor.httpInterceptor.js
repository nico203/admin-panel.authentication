angular.module('adminPanel.authorization').factory('UserInterceptor',[
    '$q', '$location', 'UserService', 'FirewallService', function($q, $location, User, Firewall) {
        function redirectLogin() {
            if($location.path() !== '/login') {
                $location.path('/login');
            }
        }
        
        return {
            request: function(config) {
                if(Firewall.isAllowedPath($location.path())) {
                    return config;
                }
                if(!config.headers['Authorization']) {
                    if(User.isLogged()) {
                        config.headers['Authorization'] = 'Bearer ' + User.getToken();
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
