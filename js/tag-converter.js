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

	var toDecimal = function ( digits, mode ) {
		var sum = 0;
		digits.forEach( function ( v, i ) {
			var s = $scope.modeDefs[ mode ].significance[ i ];
			if ( Number.isInteger( s ) ) {
				sum += v * Math.pow( 2, s );
			}
		} );
		return sum;
	};
	var toBinary = function ( digits, mode ) {
		var array = [];
		$scope.modeDefs[ mode ].significance.forEach( function ( s, i ) {
			if ( Number.isInteger( s ) ) {
				array[ s ] = digits[ i ];
			}
		} );
		return array.reverse().join( '' );
	};
	var toParity = function ( digits, mode ) {
		if ( mode === 1 ) {
			return digits[ 8 ];
		} else {
			return null;
		}
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
	var binaryToDigits = function ( binary, parity, mode ) {
		var digits = [];
		var array = binary.split( '' ).reverse();
		$scope.modeDefs[ mode ].significance.forEach( function ( s, i ) {
			if ( Number.isInteger( s ) ) {
				digits[ i ] = parseInt( array[ s ] );
			} else if ( s === 'parity' ) {
				digits[ i ] = parseInt( parity );
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
		$scope.decoderDecimal = toDecimal( $scope.digits, 0 );
		$scope.decoderBinary  = toBinary(  $scope.digits, 0 );
		$scope.preparationDecimal = toDecimal( $scope.digits, 1 );
		$scope.preparationBinary  = toBinary(  $scope.digits, 1 );
		$scope.preparationParity  = toParity(  $scope.digits, 1 ) + '';
	} );

	$scope.fromDecoderDecimal = function () {
		$scope.decoderBinary = decimalToBinary( $scope.decoderDecimal, 0 );
		$scope.digits = binaryToDigits( $scope.decoderBinary, null, 0 );
	};
	$scope.fromDecoderBinary = function () {
		if ( $scope.myForm.decoderBinaryInput.$valid ) {
			$scope.digits = binaryToDigits( $scope.decoderBinary, null, 0 );
		}
	};
	$scope.fromPreparationDecimal = function () {
		$scope.preparationBinary = decimalToBinary( $scope.preparationDecimal, 1 );
		$scope.digits = binaryToDigits( $scope.preparationBinary, $scope.preparationParity, 1 );
	};
	$scope.fromPreparationBinary = function () {
		if ( $scope.myForm.preparationBinaryInput.$valid ) {
			$scope.digits = binaryToDigits( $scope.preparationBinary, $scope.preparationParity, 1 );
		}
	};
	$scope.fromPreparationParity = function () {
		if ( $scope.myForm.preparationParityInput.$valid ) {
			$scope.digits = binaryToDigits( $scope.preparationBinary, $scope.preparationParity, 1 );
		}
	};

	$scope.checkParity = function () {
		var sum = $scope.digits.reduce( function ( a, b, i ) {
			return a + ( i !== 8 ? b : 0 );
		} );
		return ( parseInt( $scope.preparationParity ) === ( sum & 1 ) );
	};

	( function () {
		var runTest = function ( digits, decoderDecimal, decoderBinary, preparationDecimal, preparationBinary, preparationParity ) {
			console.assert( toDecimal( digits, 0 ) === decoderDecimal,                'Error in toDecimal' );
			console.assert( toDecimal( digits, 1 ) === preparationDecimal,            'Error in toDecimal' );
			console.assert( toBinary( digits, 0 )  === decoderBinary,                 'Error in toBinary' );
			console.assert( toBinary( digits, 1 )  === preparationBinary,             'Error in toBinary' );
			console.assert( toParity( digits, 0 )  === null,                          'Error in toParity' );
			console.assert( toParity( digits, 1 )  === parseInt( preparationParity ), 'Error in toParity' );
			console.assert( decimalToBinary( decoderDecimal, 0 )                                 === decoderBinary,     'Error in decimalToBinary' );
			console.assert( decimalToBinary( preparationDecimal, 1 )                             === preparationBinary, 'Error in decimalToBinary' );
			console.assert( binaryToDigits( decoderBinary, null, 0 ).join( '' )                  === digits.join( '' ), 'Error in binaryToDigits' );
			console.assert( binaryToDigits( preparationBinary, preparationParity, 1 ).join( '' ) === digits.join( '' ), 'Error in binaryToDigits' );
		};

		runTest( [ 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0 ],  705, '001011000001', 1155, '10010000011', '0' );
		runTest( [ 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0 ], 1316, '010100100100',  548, '01000100100', '1' );
		runTest( [ 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1 ], 2779, '101011011011', 1499, '10111011011', '0' );
	} )();

});

