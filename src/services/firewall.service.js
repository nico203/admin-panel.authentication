angular.module('adminPanel.authentication').service('FirewallService', [
    function() {
        var excludePaths = null;
        
        var checkPaths = function(path) {
            for(var i = 0; i < excludePaths.length; i++) {
                if(path.match(excludePaths[i])) {
                    return true;
                }
            }
            return false;
        };
        
        this.setExcludePaths = function(paths) {
            excludePaths = paths;
        };
        
        this.isAllowedPath = function (path) {
            console.log('excludePaths',excludePaths);
            console.log('path',path);
            if(excludePaths !== null) {
                var ret = checkPaths(path);
                console.log(ret);
                return ret;
            }
            return false;
        };
    }
]);
