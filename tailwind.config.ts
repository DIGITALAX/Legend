import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        offBlack: "#111313",
        naran: "#FF9147",
        amar: "#FFD86D",
        azul: "#A9E7FF",
        offWhite: "#EFEFEF",
        viol: "#D07BF7",
        quemo: "#363636",
        zana: "#FBDB86",
        vela: "#71D526",
        mar: "#1A08F1",
        suelo: "#0091FF",
        marron: "#D49E78",
        cafe: "#222222",
        lima: "#CAED00",
        emeral: "#6DD400",
        enferm: "#1301E9",
        gris: "#B3C4C4",
        arco: "#C9CBFB",
        lig: "#FFF2CF",
      },
      fontFamily: {
        dog: "Dogica",
        vcr: "Vcr",
        gam: "Gamer",
        net: "Network",
      },
      fontSize: {
        size: "0.3rem",
        super: "0.4rem",
        xxs: "0.6rem",
      },
      height: {
        110: "35rem",
      },
      screens: {
        tablet: "900px",
        galaxy: "300px",
        pre: "400px",
        otro: "1350px",
      },
      backgroundImage: {
        grant:
          "url('https://thedial.infura-ipfs.io/ipfs/QmbfG7S6A5AgCJroYU5NethPrtyVPuz3LwiGDfwGeyCsdp')",
      },
    },
  },
  plugins: [],
};
export default config;
