module.exports = {
    mode: 'jit',
    purge: [
        './public/**/*.html',
        './src/**/*.{js,jsx,ts,tsx,vue}'
    ],
    theme: {
        extend: {
            opacity: {
                '64': '.64'
            },
            maxWidth: {
                '1/4': '25%',
                '2/5': '40%',
                '3/5': '60%',
                '3/4': '75%',
                '180': '180px',
                '90%': "90%",
                '10': "2.5rem"
            },
            minWidth: {
                '0': '0',
                '1/6': '16.66667%',
                '1/4': '25%',
                '2/5': '40%',
                '1/2': '50%',
                '3/4': '75%',
                'full': '100%',
                '180': '180px',
                '10': "2.5rem"
            },
            minHeight: {
                'full': '100%',
                '180': '180px',
                '10': "2.5rem"
            },
            maxHeight: {
                'full': '100%',
                '180': '180px',
                '10': "2.5rem"
            },
            colors: {
                'primary-color': '#0E6DC5',
                // 'secondary-color' : '#134A81',
                // 'primary-dark-color': '#374151',
                'primary-color-light': '#267BCA',
                'primary-font-color': '#323334',
                'primary-font-color-light': '#676A6C',
                // 'secondary-font-color': '#6B6A6A',
                'disable': '#fafbfb',
                'gray-default': '#EEF0F1',
                'gray-light': '#F9FAFB',
                'supplemental': '#DAF0F1',
                'error-color': '#AC2020',
                'border-color': '#CDD0D2',
                'color-item-0': '#F275F4',
                'color-item-1': '#8de8e8',
                'color-item-2': '#8f56c4',
                'color-item-3': '#f4a1be',
                'color-item-4': '#d9f293',
                'color-item-5': '#099e18',
                'color-item-6': '#fcc7f8',
                'color-item-7': '#d06ff7',
                'color-item-8': '#f7b5ff',
                'color-item-9': '#204787'
            },
            screens: {
                xs: '300px',
                // => @media (min-width: 300px) { ... }

                ms: [{max: '380px'}, {min: '640px', max: '1024px'}],
                // => @media (max-width: 380px) and (max-width: 1280px, min-width: 640px ) { ... }

                sm: '640px',
                // => @media (min-width: 640px) { ... }

                md: '768px',
                // => @media (min-width: 768px) { ... }

                lg: '1024px',
                // => @media (min-width: 1024px) { ... }

                xl: '1280px',
                // => @media (min-width: 1280px) { ... }

                '2xl': '1536px',
                // => @media (min-width: 1536px) { ... }

                '3xl': '1636px'
            },
            borderWidth: {
                '1.5': '1.5px'
            }
        },
        scale: {
            0: '0',
            25: '.25',
            50: '.5',
            75: '.75',
            90: '.9',
            95: '.95',
            100: '1',
            101: '1.01',
            102: '1.02',
            105: '1.05',
            110: '1.1',
            125: '1.25',
            150: '1.5',
            200: '2'
        }
    },
    variants: {
        extend: {
            cursor: ['hover'],
            borderWidth: ['hover', 'focus'],
            borderColor: ['active', 'hover'],
            margin: ['first'],
            bgColor: ['hover']
        }
    },
    plugins: [require("@tailwindcss/line-clamp")]
}
