#!/usr/bin/env python3

from api import app

if __name__ == '__main__':
    app.run(
        debug=True,
        host=app.config['HOST'],
        port=app.config['PORT']
    )
