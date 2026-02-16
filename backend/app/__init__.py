from flask import Flask
from flask_cors import CORS
from .config import Config
from .extensions import db, jwt, migrate

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)

    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    # Import models so Flask-Migrate can detect them
    from .models.User import User
    from .models.Room import Room
    from .models.Booking import Booking
    from .models.Review import Review

    from .routes.auth_routes import auth_bp
    from .routes.room_routes import room_bp
    from .routes.booking_routes import booking_bp
    from .routes.review_routes import review_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(room_bp, url_prefix="/api/rooms")
    app.register_blueprint(booking_bp, url_prefix="/api/bookings")
    app.register_blueprint(review_bp, url_prefix="/api/reviews")

    return app