const sveltePreprocess = require('svelte-preprocess')
const globalCSS = require( 'svelte-preprocess-css-global' )

module.exports = {
  preprocess: sveltePreprocess({
    // postcss: true,
		style: globalCSS()
  }),
  // ...other svelte options
}
