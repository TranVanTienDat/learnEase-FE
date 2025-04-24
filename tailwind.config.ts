import type { Config } from "tailwindcss";
import { PluginAPI } from "tailwindcss/types/config";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1354px'
  		}
  	},
  	extend: {
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'var(--foreground)',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			tertiary: {
  				DEFAULT: 'var(--tertiary)',
  				foreground: 'hsl(var(--tertiary-foreground))'
  			},
  			quaternary: {
  				DEFAULT: 'hsl(var(--quaternary))',
  				foreground: 'hsl(var(--quaternary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			'dash-rotate': {
  				'0%': {
  					transform: 'rotate(0deg)'
  				},
  				'100%': {
  					transform: 'rotate(360deg)'
  				}
  			},
  			run: {
  				'0%': {
  					left: '0'
  				},
  				'48%': {
  					transform: 'rotateY(0deg)'
  				},
  				'50%': {
  					left: 'calc(100% - 100px)',
  					transform: 'rotateY(180deg)'
  				},
  				'90%': {
  					transform: 'rotateY(180deg)'
  				},
  				'100%': {
  					left: '0',
  					transform: 'rotate(0deg)'
  				}
  			},
  			'rotate-around': {
  				'0%': {
  					transform: 'translateX(0)'
  				},
  				'25%': {
  					transform: 'translateX(5px)'
  				},
  				'50%': {
  					transform: 'translate(5px, 5px)'
  				},
  				'75%': {
  					transform: 'translate(0, 5px)'
  				},
  				'100%': {
  					transform: 'translate(0)'
  				}
  			},
  			rotate: {
  				'0%': {
  					transform: 'rotate(0deg)'
  				},
  				'100%': {
  					transform: 'rotate(1turn)'
  				}
  			},
  			'run-background': {
  				'0%': {
  					backgroundPosition: '0 0'
  				},
  				'100%': {
  					backgroundPosition: '-1000px 0'
  				}
  			},
  			'bounce-in-right': {
  				'0% ': {
  					opacity: '0',
  					transform: 'translateY(-200px)'
  				},
  				'60%': {
  					opacity: '1',
  					transform: 'translateY(30px)'
  				},
  				'100%': {
  					transform: 'translateY(100px)'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'dash-rotate': 'dash-rotate 40s infinite linear',
  			run: 'run 20s infinite linear',
  			'rotate-around': 'rotate-around 6s infinite linear',
  			rotate: 'rotate 10s linear infinite',
  			'run-background': 'run-background 10s linear infinite',
  			'bounce-in-right': 'bounce-in-right 0.4s ease infinite'
  		},
  		backgroundColor: {
  			'slot-outer-yellow': '#ffbf1f'
  		},
  		screens: {
  			'max-1599': {
  				max: '1599px'
  			},
  			'max-1199': {
  				max: '1199px'
  			},
  			'max-575': {
  				max: '575px'
  			},
  			'custom-576-767': {
  				min: '576px',
  				max: '767px'
  			}
  		},
  		boxShadow: {
  			'slot-shadow': '0.625rem 0.625rem 0 rgba(0, 0, 0, 0.2)'
  		}
  	}
  },
  plugins: [
    require("tailwindcss-animate"),
    function ({ addUtilities }: PluginAPI) {
      const newUtilities = {
        ".translate-z-0": {
          transform: "translateZ(0)",
        },
        ".translate-scaleX-1": {
          transform: "scaleX(-1)",
        },
        ".bg-slot-gradient": {
          background:
            "linear-gradient(180deg, hsla(0, 0%, 100%, 0.1) 0.13%, rgba(0, 0, 0, 0.1))",
        },
      };
      addUtilities(newUtilities, {
        respectPrefix: true,
        respectImportant: true,
      });
    },
  ],
} satisfies Config;

export default config;
