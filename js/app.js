var app = angular.module('insta', ['ng']);


app.run(function(){
    var tag = document.createElement('script');
    // tag.src = "http://www.youtube.com/iframe_api";
    // var first_tag = document.getElementsByTagName('script')[0];
    // first_tag.parentNode.insertBefore(tag, first_tag);
});

app.controller('controller', function($scope, $location, $http) {
    $scope.title = 'insta';
    $scope.number = '';

    $('#form .typeahead').typeahead({
        name : 'artist',
        remote : {
            url: 'http://ws.audioscrobbler.com/2.0/?api_key=6a6281367c3ad09f1b4a7c15dc50675b'
                + '&method=artist.search&limit=5&artist=%QUERY&format=json',
            dataType : 'jsonp',
            template: '<p><strong>{{name}}</strong></p>',
            filter : function(res){
                var results = [];
                if(res.results.artistmatches) {
                    var artists = res.results.artistmatches.artist;
                    $.each(artists, function(){
                        results.push(this.name);
                    });
                }
                return results;
            }
        }
    }).on('typeahead:selected typeahead:autocompleted', function (e, datum) {
        $scope.artist = datum.value;
        $scope.submit(true);
    });

    $scope.errors = [];
    $scope.item_data = [];

    // remove all error messages
    $scope.errors.splice(0, $scope.errors.length);
    $scope.item_data.splice(0, $scope.item_data.length);

    $http.post('http://insta-auth.appspot.com/popular.php'
        ).success(function(data, status, headers, config) {

            // Data Get Success
            if (data != ''){
                console.log(data.data);
                $scope.populars = [];
                angular.forEach(data.data, function(row, i){
                    this.push(row);
                }, $scope.populars);
            }
            // Failure
            else{
                //                    $scope.errors.push(data.error);
            }
        }).error(function(data, status) { // called asynchronously if an error occurs
            // or server returns response with an error status.
            $scope.errors.push(status);
        });
});