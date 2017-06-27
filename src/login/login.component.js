function loginController($scope) {
    
    this.$postLink = function() {
        $('login').foundation();
    };
}

angular.module('adminPanel.authentication').component('login', {
    templateUrl: 'login/login.template.html',
    controller: ['$scope', loginController]
});