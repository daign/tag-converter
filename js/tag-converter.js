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

	var calculateDecimal = function ( digits, mode ) {
		var sum = 0;
		digits.forEach( function ( v, i ) {
			var s = $scope.modeDefs[ mode ].significance[ i ];
			if ( Number.isInteger( s ) ) {
				sum += v * Math.pow( 2, s );
			}
		} );
		return sum;
	};
	var calculateBinary = function ( digits, mode ) {
		var array = [];
		$scope.modeDefs[ mode ].significance.forEach( function ( s, i ) {
			if ( Number.isInteger( s ) ) {
				array[ s ] = digits[ i ];
			}
		} );
		return array.reverse().join( '' );
	};
	var decimalToBinary = function ( decimal, mode ) {
		if ( mode === 0 ) {
			var array = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
		} else if ( mode === 1 ) {
			var array = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
		} else {
			return '';
		}
		var i = 0;
		while ( decimal > 0 ) {
			array[ i ] = ( decimal & 1 );
			decimal >>= 1;
			i++;
		}
		return array.reverse().join( '' );
	};
	var binaryToDigits = function ( binary, mode ) {
		var digits = [];
		var array = binary.split( '' ).reverse();
		$scope.modeDefs[ mode ].significance.forEach( function ( s, i ) {
			if ( Number.isInteger( s ) ) {
				digits[ i ] = array[ s ];
			}
		} );
		return digits;
	};


	$scope.decoderDecimal = 705;
	$scope.decoderBinary = '001011000001';

	$scope.preparationDecimal = 1155;
	$scope.preparationBinary = '10010000011';
	$scope.preparationParity = '0';

	$scope.$watchCollection( 'digits', function () {
		$scope.decoderDecimal = calculateDecimal( $scope.digits, 0 );
		$scope.decoderBinary  = calculateBinary(  $scope.digits, 0 );
		$scope.preparationDecimal = calculateDecimal( $scope.digits, 1 );
		$scope.preparationBinary  = calculateBinary(  $scope.digits, 1 );
		$scope.preparationParity = $scope.digits[ 8 ];
	} );
	$scope.$watch( 'decoderDecimal', function () {
		$scope.decoderBinary = decimalToBinary( $scope.decoderDecimal, 0 );
	} );
	$scope.$watch( 'preparationDecimal', function () {
		$scope.preparationBinary = decimalToBinary( $scope.preparationDecimal, 1 );
	} );
	$scope.$watch( 'decoderBinary', function () {
		$scope.decoderBinary = $scope.decoderBinary.replace( /[^01]/g, '' );
		$scope.digits = binaryToDigits( $scope.decoderBinary, 0 );
	} );
	$scope.$watch( 'preparationBinary', function () {
		$scope.digits = binaryToDigits( $scope.preparationBinary, 1 );
	} );
	$scope.$watch( 'preparationParity', function () {
		$scope.digits[ 8 ] = $scope.preparationParity;
	} );

	$scope.checkParity = function () {
		var sum = $scope.digits.reduce( function ( a, b, i ) {
			return a + ( i !== 8 ? b : 0 );
		} );
		return ( parseInt( $scope.preparationParity ) === ( sum & 1 ) );
	};

	( function () {
		// Tests
		var digits = [ 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0 ];
		var decoderDecimal = 705;
		var decoderBinary = '001011000001';
		var preparationDecimal = 1155;
		var preparationBinary = '10010000011';
		var preparationParity = '0';

		console.assert( calculateDecimal( digits, 0 ) === decoderDecimal,                        'Error in calculateDecimal' );
		console.assert( calculateDecimal( digits, 1 ) === preparationDecimal,                    'Error in calculateDecimal' );
		console.assert( calculateBinary( digits, 0 ) === decoderBinary,                          'Error in calculateBinary' );
		console.assert( calculateBinary( digits, 1 ) === preparationBinary,                      'Error in calculateBinary' );
		console.assert( decimalToBinary( decoderDecimal, 0 ) === decoderBinary,                  'Error in decimalToBinary' );
		console.assert( decimalToBinary( preparationDecimal, 1 ) === preparationBinary,          'Error in decimalToBinary' );
		console.assert( binaryToDigits( decoderBinary, 0 ).join( '' ) === digits.join( '' ),     'Error in binaryToDigits' );
		console.assert( binaryToDigits( preparationBinary, 1 ).join( '' ) === digits.join( '' ), 'Error in binaryToDigits' );
	} )();

});

