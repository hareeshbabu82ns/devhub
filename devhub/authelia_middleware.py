import requests
from devhub.settings import ENV, AUTH_API

import logging
logger = logging.getLogger(__name__)

AUTHELIA_USER_KEY = 'authelia_user'


class AutheliaMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        # One-time configuration and initialization.
        self.user = {'id': '', 'display_name': ''}
        if ENV == 'local' or AUTH_API == '':
            self.user['id'] = 'local'
            self.user['display_name'] = 'local'

    def __call__(self, request):
        # Code to be executed for each request before
        # the view (and later middleware) are called.

        user = request.session.get(AUTHELIA_USER_KEY)
        if not user:
            logger.warn('fetching auth user')
            user = self.fetch_authelia_user(request)
            if user:
                self.user = user
            request.session[AUTHELIA_USER_KEY] = self.user

        response = self.get_response(request)

        # Code to be executed for each request/response after
        # the view is called.

        return response

    def fetch_authelia_user(self, request):
        user = None
        if AUTH_API:
            r = requests.get(AUTH_API + '/api/state', cookies=request.COOKIES)
            if r.status_code == 200:
                json_data = r.json()['data']
                user['id'] = json_data['username']

            r = requests.get(AUTH_API + '/api/user/info',
                             cookies=request.COOKIES)
            if r.status_code == 200:
                json_data = r.json()['data']
                user['display_name'] = json_data['display_name']

        # logger.warning(user)
        return user
