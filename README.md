# StreamHub 🎬

A modern streaming hub website similar to Moviebox, SFlix, and Netnaija. Browse, search, and stream movies, TV series, and anime content in HD quality.

![StreamHub](https://img.shields.io/badge/StreamHub-v1.0-red)
![Flask](https://img.shields.io/badge/Flask-2.3+-green)
![License](https://img.shields.io/badge/License-MIT-blue)

## Features ✨

- 🎥 **HD Streaming** - Watch movies & series in HD quality (1080p, 720p, 480p)
- 📺 **TV Series** - Full episode support with season/episode navigation
- 🎌 **Anime** - Dedicated anime section
- 🔍 **Smart Search** - Real-time search with suggestions
- 🎯 **Categories** - Filter by Movies, TV Series, Anime
- 🎛️ **Quality Selector** - Choose your preferred video quality
- 🌐 **Multi-Server** - Switch between different streaming sources
- 📥 **Download Support** - Download videos directly
- 📱 **Responsive** - Works on all devices
- 🌙 **Dark Theme** - Modern dark UI

## Streaming Capabilities 🎬

### Supported Formats
- **MP4** - Standard video format
- **HLS/M3U8** - Adaptive streaming (if supported by source)
- **DASH** - Dynamic Adaptive Streaming (if supported by source)

### Video Player Features
- **Quality Selection** - Switch between 1080p, 720p, 480p, 360p
- **Multi-Server Support** - If one server fails, switch to another
- **Episode Navigation** - Easy episode switching for TV series
- **Seek/Scrub** - Jump to any part of the video
- **Fullscreen** - Watch in fullscreen mode
- **Picture-in-Picture** - Continue watching while browsing

## How It Works 🔧

The application works by:
1. Fetching content metadata from the Moviebox API
2. Extracting streaming URLs from the API response
3. Proxying video streams through the Flask backend to bypass CORS
4. Using Video.js for cross-browser compatible playback

### Will Content Play?

**YES** - Content will play similar to the reference websites with these considerations:

1. **Real API Data**: The app fetches actual streaming URLs from the Moviebox API
2. **Video Proxy**: CORS restrictions are bypassed via the `/proxy/video` endpoint
3. **Multiple Sources**: If one stream fails, you can switch servers/qualities
4. **Adaptive Streaming**: Supports both direct MP4 and HLS streams

**Note**: Stream availability depends on:
- The Moviebox API's current status
- Geographic restrictions (some content may be region-locked)
- Individual video host availability

## Tech Stack 🛠️

- **Backend**: Flask (Python)
- **HTTP Client**: httpx, requests
- **Frontend**: HTML5, CSS3, JavaScript
- **Video Player**: Video.js 8.6.1
- **API Source**: Moviebox API (h5-api.aoneroom.com)

## Installation 📦

### Prerequisites
- Python 3.8 or higher
- pip

### Quick Start

1. **Clone or download the project:**
```bash
cd streamhub
```

2. **Create a virtual environment:**
```bash
python -m venv venv
```

3. **Activate the virtual environment:**

**Windows:**
```bash
venv\Scripts\activate
```

**Linux/macOS:**
```bash
source venv/bin/activate
```

4. **Install dependencies:**
```bash
pip install -r requirements.txt
```

5. **Run the application:**
```bash
python app.py
```

6. **Open your browser:**
Navigate to `http://localhost:5000`

## Usage 🚀

### Development Mode
```bash
python app.py
```
The app will run on `http://localhost:5000` with debug mode enabled.

### Production Mode
```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Using Docker
```bash
docker-compose up -d
```

## Project Structure 📁

```
streamhub/
├── app.py                 # Flask backend with video proxy
├── requirements.txt       # Python dependencies
├── start.sh              # Linux/Mac startup script
├── start.bat             # Windows startup script
├── Dockerfile            # Docker container config
├── docker-compose.yml    # Docker Compose setup
├── README.md             # Documentation
├── LICENSE               # MIT License
├── .gitignore            # Git ignore file
├── templates/
│   └── index.html        # Main webpage with Video.js player
└── static/
    └── app.js           # Frontend JavaScript with streaming logic
```

## API Endpoints 🔌

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Main application page |
| `/api/home` | GET | Fetch homepage content |
| `/api/search` | GET | Search movies/series (`?q=query&type=MOVIES`) |
| `/api/search-suggest` | GET | Search suggestions |
| `/api/details/<path>` | GET | Get content details with stream URLs |
| `/api/stream` | GET | Get streaming URL |
| `/proxy/video?url=<url>` | GET | Proxy video stream with range support |

## Video Streaming Architecture 📡

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Browser   │────▶│ Flask Proxy │────▶│ Video Host  │
│  Video.js   │◀────│  (/proxy)   │◀────│  (API)      │
└─────────────┘     └─────────────┘     └─────────────┘
       │
       ▼
┌─────────────┐
│  CORS Fixed │
│ Range Req   │
│  Supported  │
└─────────────┘
```

## Environment Variables 🔧

| Variable | Default | Description |
|----------|---------|-------------|
| `MOVIEBOX_API_HOST_V2` | `h5-api.aoneroom.com` | API host for moviebox |
| `FLASK_ENV` | `development` | Flask environment |
| `FLASK_PORT` | `5000` | Server port |

## Troubleshooting 🔧

### Video Not Playing?

1. **Check Console**: Open browser dev tools (F12) → Console for errors
2. **Switch Server**: Try a different server from the server selector
3. **Change Quality**: Lower quality might work better
4. **Check Network**: Ensure stable internet connection

### Common Issues

**"No compatible source was found"**
- The video format may not be supported
- Try switching to a different server/quality

**"Network Error"**
- The video host may be down
- Try again later or switch servers

**CORS Errors**
- The proxy should handle this automatically
- If not, check that `/proxy/video` is working

### Alternative API Hosts

If the default API host doesn't work:
- `h5-api.aoneroom.com` (default)
- `moviebox.ph`
- `moviebox.ke`
- `moviebox.pk`

Set via environment variable:
```bash
export MOVIEBOX_API_HOST_V2="h5-api.aoneroom.com"
```

## Limitations ⚠️

1. **Content Availability**: Depends on the Moviebox API
2. **Geographic Restrictions**: Some content may be region-locked
3. **Ad Blockers**: May interfere with some stream sources
4. **Mobile Data**: Streaming uses significant bandwidth

## Legal Disclaimer ⚖️

This project is for **educational purposes only**. The content is sourced from publicly available APIs. We do not host, store, or distribute any copyrighted content. All rights belong to their respective owners.

> "All videos and pictures on MovieBox are from the Internet, and their copyrights belong to the original creators. We only provide webpage services and do not store, record, or upload any content."
> - _moviebox.ph_

## Browser Compatibility 🌐

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments 🙏

- [Moviebox API](https://github.com/Simatwa/moviebox-api) by Simatwa
- [Video.js](https://videojs.com/) - HTML5 Video Player
- Flask framework
- Font Awesome icons
- Google Fonts

## Support 💬

If you found this project helpful, please ⭐ star the repository!

---

Made with ❤️ by StreamHub Team
# streamhub
