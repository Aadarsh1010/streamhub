#!/usr/bin/env python3
"""
StreamHub - A Moviebox-style Streaming Website
Flask Backend API Proxy with enhanced streaming support
"""

from flask import Flask, jsonify, request, send_from_directory, render_template, Response
from flask_cors import CORS
import httpx
import os
import asyncio
from functools import wraps
import requests

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)

# API Configuration - Updated working endpoints
API_HOST = os.getenv('MOVIEBOX_API_HOST_V2', 'h5-api.aoneroom.com')
API_BASE_URL = f'https://{API_HOST}'
REFERER = 'https://videodownloader.site/'

DEFAULT_HEADERS = {
    'X-Client-Info': '{"timezone":"Africa/Nairobi"}',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept': 'application/json, text/plain, */*',
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0',
    'Referer': REFERER,
    'Origin': REFERER,
}

def async_route(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        return asyncio.run(f(*args, **kwargs))
    return wrapper

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/home')
@async_route
async def get_home():
    """Fetch homepage content"""
    async with httpx.AsyncClient(follow_redirects=True, timeout=30.0) as client:
        try:
            url = f'{API_BASE_URL}/wefeed-h5api-bff/home?host=moviebox.ph'
            print(f"Fetching: {url}")
            response = await client.get(url, headers=DEFAULT_HEADERS)
            print(f"Response status: {response.status_code}")
            return jsonify(response.json())
        except Exception as e:
            print(f"Error: {e}")
            return jsonify({'error': str(e), 'code': -1}), 500

@app.route('/api/search')
@async_route
async def search():
    """Search for movies/series"""
    query = request.args.get('q', '')
    subject_type = request.args.get('type', '')
    page = request.args.get('page', 1)
    per_page = request.args.get('per_page', 20)
    
    async with httpx.AsyncClient(follow_redirects=True, timeout=30.0) as client:
        try:
            params = {
                'keyWord': query,
                'page': page,
                'perPage': per_page
            }
            if subject_type:
                params['subjectType'] = subject_type
            
            url = f'{API_BASE_URL}/wefeed-h5api-bff/subject/search'
            print(f"Searching: {url} with params {params}")
            
            response = await client.get(url, params=params, headers=DEFAULT_HEADERS)
            print(f"Search response status: {response.status_code}")
            return jsonify(response.json())
        except Exception as e:
            print(f"Search error: {e}")
            return jsonify({'error': str(e), 'code': -1}), 500

@app.route('/api/search-suggest')
@async_route
async def search_suggest():
    """Search suggestions"""
    query = request.args.get('q', '')
    
    async with httpx.AsyncClient(follow_redirects=True, timeout=30.0) as client:
        try:
            url = f'{API_BASE_URL}/wefeed-h5api-bff/subject/search-suggest'
            response = await client.get(url, params={'keyWord': query}, headers=DEFAULT_HEADERS)
            return jsonify(response.json())
        except Exception as e:
            return jsonify({'error': str(e), 'code': -1}), 500

@app.route('/api/details/<path:detail_path>')
@async_route
async def get_details(detail_path):
    """Get item details"""
    async with httpx.AsyncClient(follow_redirects=True, timeout=30.0) as client:
        try:
            url = f'{API_BASE_URL}/{detail_path}'
            print(f"Fetching details: {url}")
            response = await client.get(url, headers=DEFAULT_HEADERS)
            return jsonify(response.json())
        except Exception as e:
            print(f"Details error: {e}")
            return jsonify({'error': str(e), 'code': -1}), 500

@app.route('/api/stream')
@async_route
async def get_stream():
    """Get streaming URL for a movie/episode"""
    url = request.args.get('url')
    if not url:
        return jsonify({'error': 'URL required'}), 400
    
    return jsonify({'stream_url': url, 'success': True})

@app.route('/proxy/video')
def proxy_video():
    """Proxy video streams to bypass CORS and handle range requests"""
    url = request.args.get('url')
    if not url:
        return jsonify({'error': 'URL required'}), 400
    
    try:
        # Headers for video requests
        video_headers = {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:137.0) Gecko/20100101 Firefox/137.0',
            'Accept': '*/*',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'identity',
            'Referer': REFERER,
            'Origin': REFERER,
            'Connection': 'keep-alive',
        }
        
        # Handle range requests for seeking support
        range_header = request.headers.get('Range')
        if range_header:
            video_headers['Range'] = range_header
        
        # Make request
        req = requests.get(url, headers=video_headers, stream=True, timeout=60, allow_redirects=True)
        
        # Prepare response headers
        response_headers = {}
        
        # Copy important headers
        for header in ['Content-Type', 'Content-Length', 'Content-Range', 'Accept-Ranges', 'Cache-Control']:
            if header in req.headers:
                response_headers[header] = req.headers[header]
        
        # Ensure Content-Type is set
        if 'Content-Type' not in response_headers:
            if '.m3u8' in url:
                response_headers['Content-Type'] = 'application/vnd.apple.mpegurl'
            elif '.mpd' in url:
                response_headers['Content-Type'] = 'application/dash+xml'
            else:
                response_headers['Content-Type'] = 'video/mp4'
        
        # Add CORS headers
        response_headers['Access-Control-Allow-Origin'] = '*'
        response_headers['Access-Control-Allow-Headers'] = 'Range'
        
        # Return appropriate status code
        status_code = req.status_code
        
        def generate():
            for chunk in req.iter_content(chunk_size=8192):
                if chunk:
                    yield chunk
        
        return Response(generate(), headers=response_headers, status=status_code)
        
    except Exception as e:
        print(f"Video proxy error: {e}")
        return jsonify({'error': str(e)}), 500

# CORS preflight handler for video proxy
@app.route('/proxy/video', methods=['OPTIONS'])
def proxy_video_options():
    response_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Range, Content-Type',
        'Access-Control-Max-Age': '86400',
    }
    return Response('', headers=response_headers)

# Static file serving
@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
