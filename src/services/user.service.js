angular.module('adminPanel.authentication').service('UserService', [
    '$localStorage', function($localStorage) {
        var logged = false;
        this.login = login;
        this.logout = logout;
        this.getUsername = getUsername;
        this.isLogged = isLogged;
        this.setLogged = setLogged;
        this.getToken = getToken;
        this.setToken = setToken;
        this.isGranted = isGranted;
        
        function login (object) {
            object.timestamp = new Date().getTime();
            $localStorage.currentUser = object;
        }
        
        function logout() {
            delete $localStorage.currentUser;
        }
        


        function getUsername() {
            if($localStorage.currentUser) {
                return $localStorage.currentUser.username;
            }
            return '';
        }
        
        function setLogged(val) {
            logged = val;
        }
        
        function isLogged() {
            if(logged === true) return true;
            var now = new Date().getTime();
            if($localStorage.currentUser && 
                    now - $localStorage.currentUser.timestamp < $localStorage.currentUser.maxSessionTime * 1000) {
                return true;
            }
            logout();
            return false;
        }
        
        function getToken() {
            if($localStorage.currentUser) {
                return $localStorage.currentUser.token;
            }
            return '';
        }
        
        function setToken(token) {
            if(!$localStorage.currentUser) {
                return false;
            }
            $localStorage.currentUser.token = token;
            
            return true;
        }
        
        function isGranted(role) {
            if($localStorage.currentUser && $localStorage.currentUser.roles) {
                return $localStorage.currentUser.roles.indexOf(role) !== -1;
            }
            return false;
        }
    }
]);
