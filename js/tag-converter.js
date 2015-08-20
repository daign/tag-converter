var app = angular.module( 'TagConverter', [] );

app.controller( 'TagConverterController', function ( $scope ) {

	$scope.digits = [ 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0 ];
	$scope.flipDigit = function ( index ) {
		$scope.digits[ index ] = $scope.digits[ index ] ^ 1;
	};

	$scope.showGrid = true;
	$scope.toggleShowGrid = function () {
		$scope.showGrid = !$scope.showGrid;
	};

	$scope.readingMode = 1;
	$scope.setReadingMode = function ( mode ) {
		$scope.readingMode = mode;
	};

	$scope.decoderId = 705;
	$scope.decoderDigits = [ 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0 ];
	$scope.preparationId = 101;
	$scope.preparationDigits = [ 9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7 ];

});

