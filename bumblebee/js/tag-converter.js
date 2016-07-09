var app = angular.module( 'TagConverter', [] );

app.controller( 'TagConverterController', function ( $scope ) {

	$scope.Number = window.Number;

	$scope.showGrid = false;
	$scope.toggleShowGrid = function () {
		$scope.showGrid = !$scope.showGrid;
	};

	$scope.id = 53;

	$scope.digits = [ 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1 ];
	$scope.dataBits = [ 2, 4, 5, 6, 8, 9, 10 ];
	$scope.parityBits = { e1: 0, e2: 1, e4: 3, e8: 7, p: 11 };

	$scope.flipDigit = function ( index ) {
		$scope.digits[ index ] = $scope.digits[ index ] ^ 1;
		$scope.toId();
	};

	$scope.toId = function () {
		var sum = 0;
		sum += $scope.digits[  2 ] * Math.pow( 2, 6 );
		sum += $scope.digits[  4 ] * Math.pow( 2, 5 );
		sum += $scope.digits[  5 ] * Math.pow( 2, 4 );
		sum += $scope.digits[  6 ] * Math.pow( 2, 3 );
		sum += $scope.digits[  8 ] * Math.pow( 2, 2 );
		sum += $scope.digits[  9 ] * Math.pow( 2, 1 );
		sum += $scope.digits[ 10 ] * Math.pow( 2, 0 );
		$scope.id = sum;
	};

	$scope.toDigits = function () {
		$scope.dataBits.forEach( function ( bit ) {
			$scope.digits[ bit ] = 0;
		} );
		var int = $scope.id;
		var i = 6;
		while ( int > 0 ) {
			$scope.digits[ $scope.dataBits[ i ] ] = ( int & 1 );
			int >>= 1;
			i--;
		}
		$scope.digits[ $scope.parityBits[ 'e1' ] ] = calculateParity( 'e1' );
		$scope.digits[ $scope.parityBits[ 'e2' ] ] = calculateParity( 'e2' );
		$scope.digits[ $scope.parityBits[ 'e4' ] ] = calculateParity( 'e4' );
		$scope.digits[ $scope.parityBits[ 'e8' ] ] = calculateParity( 'e8' );
		$scope.digits[ $scope.parityBits[ 'p'  ] ] = calculateParity( 'p' );
	};

	var parity = function ( bits ) {
		var sum = 0;
		bits.forEach( function ( bit ) {
			sum = sum ^ $scope.digits[ bit ];
		} );
		return sum;
	};

	var calculateParity = function ( bit ) {
		if ( bit === 'e1' ) {
			return parity( [ 2, 4, 6, 8, 10 ] );
		} else if ( bit === 'e2' ) {
			return parity( [ 2, 5, 6, 9, 10 ] );
		} else if ( bit === 'e4' ) {
			return parity( [ 4, 5, 6 ] );
		} else if ( bit === 'e8' ) {
			return parity( [ 8, 9, 10 ] );
		} else if ( bit === 'p' ) {
			return parity( [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ] );
		}
	};

	$scope.checkParity = function ( bit ) {
		return $scope.digits[ $scope.parityBits[ bit ] ] === calculateParity( bit );
	};

});

