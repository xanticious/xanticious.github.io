# Custom New Tab Page

A customizable browser new tab page that provides quick access to frequently visited websites, organized in categories with multiple visual themes and a built-in search functionality.

## Features

- **Organized Link Categories**: Websites grouped into logical categories (Favorites, Work, Tools, Documentation, Streaming Services, etc.)
- **Multiple Visual Themes**: 20+ different visual styles including dark, light, minimal, seasonal, and themed variants
- **Integrated Search**: Built-in Google search with different search types (All, Images, Videos, News, Maps)
- **Link Search**: Quick filtering of saved links
- **Work Mode**: Toggle between personal and work-focused link sets
- **Responsive Design**: Works across different screen sizes
- **Settings Panel**: Easy customization of themes and preferences

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6 modules)
- **Data Storage**: JSON files for configuration and link data
- **Styling**: Custom CSS with multiple theme variants
- **Fonts**: Google Fonts (Bad Script, Cagliostro)
- **Icons**: Custom favicon collection for each website

## Development

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/xanticious/xanticious.github.io.git
   cd xanticious.github.io
   ```

2. No build process required - this is a pure client-side application

### Local Development

Since this uses ES6 modules, you need to serve the files through a web server (not file:// protocol):

**Option 1: VS Code Live Server Extension**

1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html` and select "Open with Live Server"
3. The page will open in your browser and auto-reload on changes

**Option 2: Python HTTP Server**

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then open `http://localhost:8000` in your browser

## Deployment

This project is designed to be deployed as a static website:

1. **GitHub Pages**: Already configured for deployment at `xanticious.github.io`
2. **Any Static Host**: Upload all files to your web server
3. **Local Browser**: Set as your browser's new tab page by pointing to the deployed URL

## Testing

Currently using manual testing procedures:

### Test Checklist

- [ ] All link categories load correctly
- [ ] Theme switching works in settings panel
- [ ] Google search functionality works for all search types
- [ ] Link search/filtering works
- [ ] Work mode toggle functions properly
- [ ] Responsive design works on mobile/tablet
- [ ] All website icons display correctly
- [ ] Settings persist between sessions

### Browser Compatibility

Tested on:

- Chrome/Chromium-based browsers

## Project Structure

```
├── index.html              # Main page
├── settings.html           # Settings configuration page
├── data/                   # JSON configuration files
│   ├── categories.json     # Link categories definition
│   ├── styles.json         # Available themes
│   └── urls/              # Website links data
├── images/                # Website favicons and theme assets
├── styles/                # CSS theme files
└── src/                   # JavaScript modules
    ├── app.js             # Main application entry point
    ├── settings-app.js    # Settings page logic
    ├── modules/           # Core functionality modules
    └── utils/             # Utility functions
```
