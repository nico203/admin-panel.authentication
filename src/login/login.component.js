function loginController($scope) {
    
    this.$postLink = function() {
        $('login').foundation();
    };
}

angular.module('adminPanel.authorization').component('login', {
    templateUrl: 'components/admin-panel/modules/authorization/login/login.template.html',
    controller: ['$scope', loginController]
});