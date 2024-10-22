import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        // Add your custom colors using CSS variables
        'bg-gradient-start': 'hsl(var(--bg-gradient-start))', // Example color
        'bg-gradient-end': 'hsl(var(--bg-gradient-end))', // Example color
        'btn-bg': 'hsl(var(--btn-bg))', // Button background color
        'btn-bg-hover': 'hsl(var(--btn-bg-hover))', // Button hover color
        'btn-text-color': 'hsl(var(--btn-text-color))', // Button text color
        'card-bg': 'hsl(var(--card-bg))', // Card background color
        'icon-color': 'hsl(var(--icon-color))', // Icon color
        'footer-bg': 'hsl(var(--footer-bg))', // Footer background color
		"color-light":     "hsl(var(--color-light))",
		"color-dark":     "hsl(var(--color-dark))", /* or your chosen dark color */ /* or your chosen dark color */
		"color-darker":     "hsl(var(--color-darker))", /* or your chosen darker color */ /* or your chosen darker color */
		"color-muted":     "hsl(var(--color-muted))", /* or your chosen muted color */ /* or your chosen muted color */
		"background-color": "hsl(var(--background-color))",
		"card-flipped": "hsl(var(--card-flipped))",
		"text-color":  "hsl(var(--text-color))",
		"text-muted":"hsl(var(--text-muted))",
		"border-radius": "hsl(var(--border-radius))",
		"card-bg-color": "hsl(var(--card-bg-color))",
		"heading-color": "hsl(var(--heading-color))",
		"padding": "hsl(var(--padding))",
		"container-bg-color":"hsl(var(--container-bg-color))",
		"label-color":"hsl(var(--label-color))",
		"border-color":"hsl(var(--border-color))",
		"disabled-bg-color":"hsl(var(--disabled-bg-color))",
		"button-bg-gradient-start":"hsl(var(--button-bg-gradient-start))",
		"button-bg-gradient-end":"hsl(var(--button-bg-gradient-end))",
		"cashout-bg-gradient-start":"hsl(var(--cashout-bg-gradient-start))",
		"cashout-bg-gradient-end":"hsl(var(--cashout-bg-gradient-end))",
		"shadow-color":"hsl(var(--shadow-color))"
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
