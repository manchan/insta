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



// Object.keys(data.data).forEach(function (key) {
//   console.log(key + "は" + data.data[key] + "と鳴いた！");
// });


        jQuery.each(data.data, function (index, row) {
           $('.imagesInsta').append('<div class="example switch"><div><p class="turnBoxButton">OFF</p></div><div><p class="turnBoxButton turnBoxButtonPrev">ON</p></div>');
    }).promise().done( function(){ alert("All was done"); } );


        $scope.populars = [];
        angular.forEach(data.data, function(row, i){
            row.created_time = new Date(row.created_time*1000);
                    // this.push(row);



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


        // $(".example").turnBox({
        //     width: 320,
        //     height: 320,
        //     axis: "X"
        // });


$(function() {
    $(document).on('click', '.example', function(){

        // $(".example").turnBox({
        //     width: 320,
        //     height: 320,
        //     axis: "X"
        // });
    });
});


