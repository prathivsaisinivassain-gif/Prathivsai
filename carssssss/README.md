# Car Data Dashboard

An award-winning, web-based storytelling data dashboard for car datasets built with pure HTML/CSS/JS.

## Features

- **Animated Hero Section**: Live odometer-style counter displaying total cars analyzed
- **Scrollytelling Narrative**: Sections reveal as you scroll with GSAP animations
- **Interactive Charts**: Bar, radar, scatter, and doughnut charts using Chart.js
- **Filterable Data Table**: Search and filter cars with animated rows
- **3D Flip Cards**: Car stat cards with 3D perspective flip animations
- **Parallax Depth Layers**: Multi-layer parallax background effects
- **Magnetic Cursor**: Custom cursor that follows mouse movement
- **SVG Progress Indicator**: Animated road path showing scroll progress
- **Glassmorphism UI**: Modern glass-like panels with backdrop blur
- **Neon Accent Lighting**: Cinematic dark theme with amber/red racing accents
- **Staggered Animations**: Entrance animations on all elements

## Dataset

The dashboard uses a CSV file (`data_500_rows.csv`) with the following fields:
- Make (Brand)
- Model (Car Name)
- Year
- Engine Fuel Type
- Engine HP (Horsepower)
- Highway MPG
- City MPG
- Popularity
- MSRP (Price)

## Technologies Used

- **HTML5/CSS3**: Structure and styling
- **Vanilla JavaScript**: Logic and interactivity
- **GSAP (GreenSock)**: Motion graphics and scroll-triggered animations
- **Chart.js**: Interactive data visualizations
- **CSV Parsing**: Client-side data loading

## Setup

1. Ensure all files are in the same directory:
   - `index.html`
   - `style.css`
   - `script.js`
   - `data_500_rows.csv`

2. Open `index.html` in a modern web browser

3. The dashboard will automatically load the CSV data and initialize all components

## Browser Compatibility

Works best in modern browsers that support:
- ES6+ JavaScript
- CSS Grid and Flexbox
- CSS Backdrop-filter (for glassmorphism)
- Web Animations API

## Customization

- Modify `data_500_rows.csv` to use your own dataset
- Adjust colors and styling in `style.css`
- Customize animations and interactions in `script.js`
- Update chart configurations for different data visualizations

## Performance Notes

- Large datasets may impact initial load time
- Animations are optimized for 60fps performance
- Charts are rendered client-side for interactivity