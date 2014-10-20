app.controller('MainController', function($scope, $location, $http, Insta, $timeout) {

    $scope.title = 'insta';
    $('#form .typeahead').typeahead({
        name : 'tag',
        highlight: true,
        remote : {
            url: 'http://insta-auth.appspot.com/tags.php?keywords=%QUERY',
            timeout: 15000,
            template: '<p><strong>{{name}}</strong> <p style="float:right">{{media_count}}</p></p>',
            filter : function(res){

                var results = [];
                if(res.data) {
                    var tags = res.data;
                    $.each(tags, function(){
                        results.push(this.name);
                    });
                }
                return results;
            }
        }
    }).on('typeahead:selected typeahead:autocompleted', function (e, datum) {
            $scope.tag = datum.value;
            $scope.submit(true);
        });

    $scope.insta = new Insta();
    $scope.submit = function(autoplay, query){
        $scope.tag = query || angular.element('.tt-query').val() || $location.search().q;
        $scope.insta.nextPage($scope.tag);
    };


    $scope.autoStop = 1;
    $scope.layoutDone = function() {
        $timeout(function() {
            autoscroll($scope.autoStop);
        });
    };

    $scope.sctrollCtl = function() {

        if($("#scrollBt").hasClass("btn-info")){
            $("#scrollBt").addClass("btn-warning").removeClass("btn-info").text("Stop");
            autoscroll($scope.autoStop = 0);
        }
        else{
            $("#scrollBt").addClass("btn-info").removeClass("btn-warning").text("Auto Scroll");
            autoscroll($scope.autoStop = 1);
        }
    };
});

app.controller('FromViewController', function($scope, $location) {

    $scope.backClick = function() {
        $location.path( '/');
    };
});
app.controller('ToViewController', function($scope) {
    var fugaChangeWatcher = $scope.$on('fugaChange', function(event, args) {
        $scope.fromViewValue = args[0];
    });
    var destroyWatcher =  $scope.$on('$destroy', function() {
        fugaChangeWatcher();
        destroyWatcher();
    });
});


// Insta constructor function to encapsulate HTTP and pagination logic
app.factory('Insta', function($http) {
    var Insta = function() {
        this.items = [];
        this.busy = false;
        this.before = '';
        this.after = '';
        this.query = '';
        this.next_url = '';
        this.tagsearch_cnt = 0;
    };

    Insta.prototype.nextPage = function(query) {

        if (this.busy) return;
        this.busy = true;
        if(this.query || query){
            // init tagsearch count
            if (this.query != query && query != undefined ) this.tagsearch_cnt = 0;
            // set this.query
            if (!this.query || query) this.query = query;
            // init items
            if (this.tagsearch_cnt == 0) {
                this.tagsearch_cnt++;
                this.items = [];
                Insta.bind(this);
            }

            var url = 'https://api.instagram.com/v1/tags/'+this.query+'/media/recent';
            if(this.next_url) url = this.next_url;
            $http.post('http://insta-auth.appspot.com/recenttag.php', {
                    'next_url': this.next_url ?this.next_url:"",
                    'query': this.query,
                    'format' : 'json',
                    'count' : 20
                }
            ).success(function(data, status, headers, config) {
                    this.next_url = data.pagination.next_url;
                    var items = data.data;
                    if(items){
                        for (var i = 0; i < items.length; i++) {
                            this.items.push(items[i]);
                        }
                    }else{
                        alert("Reload browser please.");
                        Insta.prototype.nextPage();
                    }
                    this.busy = false;
                }.bind(this))
                .error(function(data, status) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    $scope.errors.push(status);
                });
        }
        else{

            var url = "http://insta-auth.appspot.com/popular.php";
            $http.post(url).success(function(data) {
                var items = data.data;
                if(items){
                    for (var i = 0; i < items.length; i++) {
                        this.items.push(items[i]);
                    }
                }else{
                    alert("reload browser please.");
                    Insta.prototype.nextPage();
                }
                this.busy = false;
            }.bind(this));
        }
        console.log("bind finish !!!!");
    };
    return Insta;
});

app.directive('repeatDone', function() {
    return function(scope, element, attrs) {
        if (scope.$last) { // all are rendered
            scope.$eval(attrs.repeatDone);
        }
    }
});

app.directive('ngElementReady', [function() {

    return {
        priority: -1000,
        restrict: "A",
        link: function($scope, $element, $attributes) {
            $scope.$eval($attributes.ngElementReady); // execute the expression in the attribute.

            $(".instpics").turnBox({
                width: 320,
                height: 320,
                axis: "X",
                duration: 400,
            });
        }
    };
}]);

function switchColor(target) {

    var colorArray = new Array(
        "#5082e5",
        "#be5fb6",
        "#ff5867",
        "#33ccbe",
        "#68bf60",
        "#ff794d",
        "#6caff1",
        "#cccc52",
        "#7870cc",
        "#f279ac",
        "#548899",
        "#ffaf40",
        "#f0ffff"
    );

    // var colorArray = new Array("#ea0070","#e5c900","#6ec10e","#3566a0", "#0094ef", "#0093b1");
    var color = colorArray[Math.floor( Math.random() * colorArray.length)];

    // bg color set
    if(sessionStorage.getItem("box_color") != undefined && sessionStorage.getItem("box_color") != "")
        $(target.nextSibling).css('backgroundColor', sessionStorage.getItem("box_color"));
    else
        $(target.nextSibling).css('backgroundColor', color);
}

function onSnsBt() {
}

function autoscroll(stop){

    if(!stop){
        var speed = 10000;
        $('body,html').animate({scrollTop:$(document).height()}, speed, 'swing');
        return false;
    }
    else{
        $('body,html').stop();
    }
}