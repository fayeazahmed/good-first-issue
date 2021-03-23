from flask import Flask
from scraper import getResults
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)


@app.route('/search/<int:p>/<string:query>', methods=['GET'])
@cross_origin()
def search(p, query):
    return getResults(p, query)


if __name__ == "__main__":
    app.run(debug=True)
