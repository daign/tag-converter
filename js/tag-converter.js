var app = angular.module( 'TagConverter', [] );

app.controller( 'TagConverterController', function ( $scope ) {
	$scope.id = 705;
	$scope.showGrid = false;
	$scope.digits = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ];
	$scope.getBinaryDigit = function ( pos ) {
		return ( $scope.id & Math.pow( 2, pos ) ) && 1;
	};
	$scope.setBinaryDigit = function ( pos ) {
		$scope.id = $scope.id ^ Math.pow( 2, pos );
	};
	$scope.switchGrid = function () {
		$scope.showGrid = !$scope.showGrid;
	};
});

