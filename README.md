# gobble-postcss

Post-process CSS files with gobble and [postcss](https://github.com/postcss/postcss).

## Installation

First, you need to have gobble installed - see the [gobble readme](https://github.com/gobblejs/gobble) for details. Then,

```bash
npm i -D gobble-postcss
```

## Usage

```js
var gobble = require( 'gobble' );
module.exports = gobble( 'src/styles' ).transform( 'postcss', {
  plugins: [
    require( 'postcss-import' ),
    require( 'autoprefixer-core', { browsers: [ 'last 2 versions' ] }),
    require( 'cssnano' )
  ],

  // if `src` is omitted, all CSS files will be processed. If you're
  // using `postcss-import`, that's probably not what you want. It
  // can be a glob pattern
  src: 'main.css',

  // `dest` can be a string if `src` is supplied and is *not* a glob
  // pattern. Otherwise it must be a function. If omitted, dest name
  // will be same is src name
  dest: function ( src ) {
    // e.g. main.css -> main.min.css
	return src.replace( '.css', '.min.css' );
  },

  // sourcemap options. `true` (default) means the sourcemap will
  // be inlined, `false` means no sourcemap
  map: false
});
```


## License

MIT. Copyright 2015 Rich Harris
