import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: "class",
	content: [
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		"./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				primary: {
					light: "#67e8f9",
					DEFAULT: "#06b6d4",
					dark: "#0e7490",
				},
				secondary: {
					light: "#67e8f9",
					DEFAULT: "#06b6d4",
					dark: "#0e7490",
				},
			},
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
		},
	},
	plugins: [nextui()],
};
export default config;
