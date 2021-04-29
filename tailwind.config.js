module.exports = {
  // purge: [],
	purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  // theme: {
  //   extend: {},
  // },
	plugins: [
    require('daisyui'),
  ],

  // OPTIONAL: if you want to use DaisyUI colors everywhere
  theme: {
    extend: {
      colors: require('daisyui/colors'),
    },
  },
	// config (optional)
  daisyui: {
    styled: true,
    themes: false,
    rtl: false,
  },
  variants: {
    extend: {},
  },
  // plugins: [],
}
