angular.module('adminPanel.authentication').directive('apUser',[
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
            templateUrl: 'components/admin-panel/modules/authorization/directive/user.template.html'
        };
    }
]);