from flask import Blueprint, request, jsonify
from flask_login import login_user, login_required, logout_user
from werkzeug.datastructures import MultiDict

from auth_backend.forms import SignUpForm, LoginForm
from auth_backend.models import db, bcrypt, User

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


def _first_error(form):
    for field_errors in form.errors.values():
        if field_errors:
            return field_errors[0]
    return "Invalid input."


# POST /auth/signup  endpoint to signup a user
@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json(silent=True) or {}
    username = str(data.get("username") or "").strip()
    email = str(data.get("email") or "").strip().lower()
    password = str(data.get("password") or "")

    form = SignUpForm(formdata=MultiDict({"username": username, "email": email, "password": password}))
    if not form.validate():
        return jsonify({"error": _first_error(form)}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists. Please choose a different one."}), 409

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered. Please use a different one."}), 409

    hashed = bcrypt.generate_password_hash(password).decode("utf-8")
    user = User(username=username, email=email, password=hashed)
    db.session.add(user)
    db.session.commit()
    return jsonify({"msg": "User created. Please log in.", "username": username, "email": email}), 201


# POST /auth/login  endpoint to login a user
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    username = str(data.get("username") or "").strip()
    password = str(data.get("password") or "")

    form = LoginForm(formdata=MultiDict({"username": username, "password": password}))
    if not form.validate():
        return jsonify({"error": _first_error(form)}), 400

    user = User.query.filter_by(username=username).first()
    if user and bcrypt.check_password_hash(user.password, password):
        login_user(user)
        return jsonify({"msg": "Logged in.", "username": user.username}), 200
    return jsonify({"error": "Invalid username or password."}), 401


# POST /auth/logout  the endpoint to logout a user
@auth_bp.route("/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    return jsonify({"msg": "Logged out."}), 200
