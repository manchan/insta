var app = angular.module('insta', [
    'ng',
    'infinite-scroll',
    'ngRoute'
]);

app.config(['$routeProvider',
    function($routeProvider) {

        $routeProvider.
            when('/info/', {
                controller: 'FromViewController',
                templateUrl: 'templates/info.html'
            }).
            when('/toView/'  , {
                controller: 'ToViewController',
                templateUrl: 'templates/ToView.html'
            }).
            // default
            otherwise({
                templateUrl: 'templates/pics-list.html',
                controller: 'MainController'
            });
    }]);

app.run(function(){
    var tag = document.createElement('script');
});


$(function(){

    // Web Storage get
    if(window.sessionStorage){
        var local_storage = window.localStorage;
        $("body").css("background", sessionStorage.getItem("bg_color"));
    }

});

