
angular.module('adminPanel.authentication', [
    'ngStorage',
    'ngRoute',
    'adminPanel'
]).config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/login', {});
}]).config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('AuthenticationInterceptor');
}]);