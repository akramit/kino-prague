import os
import logging
from logging.handlers import RotatingFileHandler
from flask import Flask, jsonify, request
from flask_cors import CORS
from scrapper import get_theatres_data

def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app, origins=[
        "http://localhost:5173",    # React local dev server
        "https://kino-prague.vercel.app"    # Production site
    ])
    app.config["APP_NAME"] = os.getenv("APP_NAME", "kino-prague-server")

    # --- logging (stdout + optional rotating file) ---
    app.logger.setLevel(logging.INFO)
    handler = logging.StreamHandler()
    handler.setFormatter(logging.Formatter(
        "%(asctime)s %(levelname)s %(name)s %(message)s"
    ))
    app.logger.addHandler(handler)

    log_file = os.getenv("LOG_FILE")
    if log_file:
        file_handler = RotatingFileHandler(log_file, maxBytes=1_000_000, backupCount=3)
        file_handler.setFormatter(handler.formatter)
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)

    # --- routes ---
    @app.get("/healthz")
    def healthz():
        return jsonify(status="ok", app=app.config["APP_NAME"]), 200

    @app.get("/v1/hello")
    def hello():
        name = request.args.get("name", "world")
        return jsonify(message=f"Hello, {name}!"), 200
    
    @app.get('/theatres')
    def theatres_data () :
        try :
            theatres_data = get_theatres_data()
            return jsonify(data=theatres_data), 200
        except Exception as e:
             return jsonify(error = e)

    # --- JSON errors ---
    @app.errorhandler(404)
    def not_found(e):
        return jsonify(error="not_found", detail="Route not found"), 404

    @app.errorhandler(500)
    def server_error(e):
        app.logger.exception("Unhandled error")
        return jsonify(error="internal_error", detail="Something went wrong"), 500

    return app

# WSGI entrypoint for Gunicorn: `gunicorn app:app`
app = create_app()

# if __name__ == '__main__':
#     app.run(host="0.0.0.0", port=5001, debug=True)
