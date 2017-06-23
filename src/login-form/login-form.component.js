function loginFormController($scope, $location, AuthenticationService) {
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

angular.module('adminPanel.authorization').component('loginForm', {
    templateUrl: 'components/admin-panel/modules/authorization/login-form/login-form.template.html',
    controller: ['$scope','$location', 'AuthenticationService', loginFormController]
});