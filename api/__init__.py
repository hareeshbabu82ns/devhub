from ariadne import graphql_sync
from ariadne.constants import PLAYGROUND_HTML
from flask import Flask, request, jsonify
from flask_cors import CORS

from flask import Flask
from api.schema import schema
from .database import dbConnection

app = Flask(__name__)
CORS(app)
# app.debug = True
# app.config['HOST'] = '127.0.0.1'
# app.config['PORT'] = 5000


@app.route("/graphql", methods=["GET"])
def graphql_playground():
    return PLAYGROUND_HTML, 200


@app.route("/graphql", methods=["POST"])
def graphql_server():
    data = request.get_json()
    context = {
        'request': request,
        'apiVersion': 'v1.0',
        'dbConnection': dbConnection,
        'extras': ''
    }

    # Note: Passing the request to the context is optional.
    # In Flask, the current request is always accessible as flask.request
    success, result = graphql_sync(
        schema,
        data,
        context_value=context,
        debug=app.debug
    )

    status_code = 200 if success else 400
    return jsonify(result), status_code
