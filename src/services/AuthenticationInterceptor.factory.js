angular.module('adminPanel.authentication').factory('AuthenticationInterceptor',[
    '$q', '$location', 'UserService', 'FirewallService', function($q, $location, User, Firewall) {
        function redirectLogin() {
            if($location.path() !== '/login') {
                $location.path('/login');
            }
        }
        
        return {
            request: function(config) {
                User.setLogged(null);
                var isAllowedPath = Firewall.isAllowedPath($location.path());
                if(isAllowedPath) {
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
