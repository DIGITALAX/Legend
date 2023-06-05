/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        azul: "#BED2F3",
        beige: "#F6F2E4",
        gris: "#27272B",
        purp: "#4F30E8",
        rosa: "#E2AFD5",
        mal: "#FECF01",
        mora: "#DC75F9",
        otra: "#DAD2D2",
        medio: "#EAE5D8",
        mazul: "#172534",
        mold: "#FEF6E1",
        lily: "#F6F2E6",
        darker: "#0100F4",
        offWhite: "#FEFEFE",
        oscura: "#F3F3F7",
        lez: "#FEF6E2",
        blez: "#CEE2E3",
        glez: "#06B4BD",
        mist: "#4B4BF0",
      },
      fontFamily: {
        vcr: "VCR",
        earl: "Earls Revenge",
        mega: "Megamax Jones",
      },
      width: {
        90: "22rem",
        98: "28rem",
        100: "32rem",
        128: "42rem",
      },
      height: {
        90: "22rem",
        100: "32rem",
        128: "42rem",
      },
      zIndex: {
        0.5: "0.5",
        1: "1",
        2: "2",
      },
    },
  },
  plugins: [],
};
