var app = angular.module( 'TagConverter', [] );

app.controller( 'TagConverterController', function ( $scope ) {

	$scope.Number = window.Number;

	$scope.digits = [ 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0 ];
	$scope.flipDigit = function ( index ) {
		$scope.digits[ index ] = $scope.digits[ index ] ^ 1;
	};

	$scope.showGrid = false;
	$scope.toggleShowGrid = function () {
		$scope.showGrid = !$scope.showGrid;
	};

	$scope.mode = 0;
	$scope.setMode = function ( mode ) {
		$scope.mode = mode;
	};
	$scope.modeDefs = [
		{
			significance: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ],
			read: { dir: -1, rot: -75 },
			sig:  { dir:  1, rot:  15 }
		},
		{
			significance: [ 7, 6, 5, 4, 3, 2, 1, 0, 'parity', 10, 9, 8 ],
			read: { dir:  1, rot: -75 },
			sig:  { dir: -1, rot: 165 }
		}
	];

	var toInt = function ( mode ) {
		var sum = 0;
		$scope.digits.forEach( function ( v, i ) {
			var s = $scope.modeDefs[ mode ].significance[ i ];
			if ( Number.isInteger( s ) ) {
				sum += v * Math.pow( 2, s );
			}
		} );
		return sum;
	};
	var toArray = function ( int, mode ) {
		var result = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
		var i = 0;
		while ( int > 0 ) {
			result[ i ] = ( int & 1 );
			int >>= 1;
			i++;
		}
		$scope.modeDefs[ mode ].significance.forEach( function ( s, i ) {
			if ( Number.isInteger( s ) ) {
				$scope.digits[ i ] = result[ s ];
			}
		} );
	};

	$scope.decoderId = 705;
	$scope.$watchCollection( 'digits', function () { $scope.decoderId = toInt( 0 ); } );
	$scope.$watch( 'decoderId', function () { toArray( $scope.decoderId, 0 ); } );

	$scope.preparationId = 1155;
	$scope.$watchCollection( 'digits', function () { $scope.preparationId = toInt( 1 ); } );
	$scope.$watch( 'preparationId', function () {
		var p = $scope.parity();
		toArray( $scope.preparationId, 1 );
		if ( $scope.parity() !== p ) {
			$scope.digits[ 8 ] = $scope.digits[ 8 ] ^ 1;
		}
	} );

	$scope.parity = function () {
		var sum = $scope.digits.reduce( function ( a, b, i ) {
			return a + ( i !== 8 ? b : 0 );
		} );
		return $scope.digits[ 8 ] === ( sum & 1 );
	};

});

