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
