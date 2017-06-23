
angular.module('adminPanel.authorization', [
    'ngStorage',
    'ngRoute'
]).config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/login', {});
}]).config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('UserInterceptor');
}]);