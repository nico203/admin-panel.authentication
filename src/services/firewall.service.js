angular.module('adminPanel.authorization').service('FirewallService', [
    function() {
        var excludePaths = null;
        
        this.setExcludePaths = function(paths) {
            excludePaths = paths;
        };
        
        this.isAllowedPath = function (path) {
            if(excludePaths !== null) {
                return excludePaths.indexOf(path) !== -1;
            }
            return false;
        };
    }
]);
