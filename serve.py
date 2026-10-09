# Local preview server that never caches, so every refresh shows your latest edits.
# Run from this folder:   python serve.py      then open http://localhost:8080
# Different port:         python serve.py 8081
import http.server, os, sys

os.chdir(os.path.dirname(os.path.abspath(__file__)))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        super().end_headers()

# Threaded, so big GIFs downloading in one tab never block other requests
with http.server.ThreadingHTTPServer(("", PORT), NoCacheHandler) as httpd:
    print(f"Previewing at http://localhost:{PORT}  (Ctrl+C to stop)")
    httpd.serve_forever()
