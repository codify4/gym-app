/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        'poppins': 'Poppins',
        'poppins-bold': 'Poppins-Bold',
        'poppins-medium': 'Poppins-Medium',
        'poppins-semibold': 'Poppins-SemiBold',
        'poppins-light': 'Poppins-Light',
        'poppins-black': 'Poppins-Black',
        'poppins-extrabold': 'Poppins-ExtraBold',
      }
    },
  },
  plugins: [],
}