from flask import Blueprint

api_bp = Blueprint("api", __name__)

@api_bp.route("/api/test", methods=["GET"])
def test_route():
    return {"message": "Hello from Flask!"}
