var path = require( 'path' );
var glob = require( 'glob' );
var sander = require( 'sander' );
var _postcss = require( 'postcss' );

var Promise = sander.Promise;

function identity ( input ) {
	return input;
}

module.exports = function postcss ( inputdir, outputdir, options ) {
	var processor = _postcss( options.plugins );

	var files = glob.sync( options.src || '**/*.css', {
		cwd: inputdir
	});

	if ( typeof options.dest === 'string' && ( typeof options.src !== 'string' || !~options.src.indexOf( '*' ) ) ) {
		throw new Error( 'options.dest can only be a string if options.src is a string, and not a glob pattern' );
	}

	var getDest = typeof options.dest === 'string' ?
		function () { return options.dest; } :
		typeof options.dest === 'function' ?
			options.dest :
			identity;

	var map = options.map && options.map.inline === false;

	var promises = files.map( function ( src ) {
		var dest = getDest( src );

		return sander.readFile( inputdir, src )
			.then( function ( css ) {
				return processor.process( css, {
					from: path.join( inputdir, src ),
					to: path.join( outputdir, dest ),
					map: options.map
				}).then( function ( result ) {
					var promises = [ sander.writeFile( outputdir, dest, result.css ) ];
					if ( map ) {
						promises.push( sander.writeFile( outputdir, dest + '.map', result.map ) );
					}
					return Promise.all( promises );
				});
			});
	});

	return Promise.all( promises );
};
