from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, create_refresh_token
from werkzeug.security import generate_password_hash, check_password_hash
from .models import User, Vocabulary, Progress
from . import db
import datetime
from sqlalchemy import func


api_bp = Blueprint("api", __name__)


@api_bp.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    print(data)
    hashed_password = generate_password_hash(data["password"], method="pbkdf2:sha256")
    new_user = User(username=data["username"], email=data["email"], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201


@api_bp.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data["email"]).first()
    if not user or not check_password_hash(user.password, data["password"]):
        return jsonify({"message": "Invalid credentials"}), 401
    access_token = create_access_token(identity=user.id, expires_delta=datetime.timedelta(minutes=1))
    refresh_token = create_refresh_token(identity=user.id)

    return jsonify({"access_token": access_token, "refresh_token": refresh_token}), 200

@api_bp.route("/api/token/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh_token():
    user_id = get_jwt_identity()
    new_access_token = create_access_token(identity=user_id, expires_delta=datetime.timedelta(minutes=15))

    return jsonify({"access_token": new_access_token}), 200


@api_bp.route("/api/vocabulary", methods=["GET", "POST"])
@jwt_required()
def manage_vocabulary():
    user_id = get_jwt_identity()

    if request.method == "POST":
        data = request.get_json()

        new_word = Vocabulary(word=data["word"], definition=data["definition"], part_of_speech=data.get("part_of_speech"), user_id=user_id)
        db.session.add(new_word)
        db.session.commit()

        new_progress = Progress(
            user_id=user_id,
            vocabulary_id=new_word.id,
            last_reviewed=datetime.datetime.now(),
            proficiency=1
        )
        db.session.add(new_progress)
        db.session.commit()

        return jsonify({"message": "Word added to vocabulary and progress initialized"}), 201
    
    elif request.method == "GET":
        page = request.args.get("page", 1, type=int)
        size = request.args.get("size", 10, type=int)

        vocabulary_query = Vocabulary.query.filter_by(user_id=user_id)
        total_items = vocabulary_query.count()
        vocabulary = vocabulary_query.order_by(Vocabulary.id).paginate(page, size, False)

        vocabulary_list = [
            {
                "id": word.id,
                "word": word.word,
                "definition": word.definition,
                "part_of_speech": word.part_of_speech
            } for word in vocabulary.items
        ]

        return jsonify({
            "vocabulary": vocabulary_list,
            "total_items": total_items,
            "page": page,
            "size": size,
        }), 200


@api_bp.route("/api/vocabulary/review", methods=["GET"])
@jwt_required()
def review_vocabulary():
    user_id = get_jwt_identity()
    now = datetime.datetime.now()

    vocab_to_review = (
        db.session.query(Vocabulary, Progress)
        .join(Progress, Vocabulary.id == Progress.vocabulary_id)
        .filter(Progress.user_id == user_id)
        .filter(func.julianday(now) - func.julianday(Progress.last_reviewed) >= Progress.proficiency)
        .order_by(Progress.proficiency)
        .all()
    )

    review_list = [
        {"id": vocab.id, "word": vocab.word, "definition": vocab.definition, "part_of_speech": vocab.part_of_speech}
        for vocab, progress in vocab_to_review
    ]

    return jsonify(review_list), 200


@api_bp.route("/api/vocabulary/progress", methods=["POST"])
@jwt_required()
def update_progress():
    user_id = get_jwt_identity()
    data = request.get_json()
    vocab_id = data["vocab_id"]
    remembered = data["remembered"]

    progress = Progress.query.filter_by(user_id=user_id, vocabulary_id=vocab_id).first()

    if not progress:
        return jsonify({"error": "Progress record not found"}), 404
    
    progress.last_reviewed = datetime.datetime.now()
    if remembered:
        progress.proficiency = min(progress.proficiency + 1, 5)
    else:
        progress.proficiency = max(progress.proficiency - 1, 0)

    db.session.commit()

    return jsonify({"message": "Progress updated"}), 200
