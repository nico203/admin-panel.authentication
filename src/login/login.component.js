function loginController($scope) {
    
    this.$postLink = function() {
        $('login').foundation();
    };
}

angular.module('adminPanel.authentication').component('login', {
    templateUrl: 'components/admin-panel/modules/authorization/login/login.template.html',
    controller: ['$scope', loginController]
});