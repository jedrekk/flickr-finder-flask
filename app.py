from flask import Flask, request, session, g, redirect, make_response, render_template, abort, url_for
import flickrapi
import json
from functools import wraps
from random import shuffle, choice
from werkzeug._internal import _log


app = Flask(__name__)
app.config.from_object(__name__)


api_key = '' # get your api key 
api_secret = '' # along with your secret at http://flickr.com/services/apps/create/apply

app.secret_key = '' # 24 char string, secret salt for sessions

def add_response_headers(headers={}):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            resp = make_response(f(*args, **kwargs))
            h = resp.headers
            for header, value in headers.items():
                h[header] = value
            return resp
        return decorated_function
    return decorator


def json_headers(f):
    @wraps(f)
    @add_response_headers({'Content-type': 'application/json'})
    def decorated_function(*args, **kwargs):
        return f(*args, **kwargs)
    return decorated_function

def error_handler(error=""):
    if (error == 'flickr_auth'):
        return "error_flickr_auth"
    else:
        return "error_generic"

def random_initial_user():
    initial_user = ["14280625@N03", "26168434@N02", "26540085@N08", "32662406@N03", "33783444@N05", "34365925@N05", "38177870@N00", "42128445@N00", "48848351@N00", "53519312@N08", "54167581@N00", "59254826@N00", "59697550@N00", "60529400@N06", "60898119@N00", "60899775@N00", "7227415@N07", "7710444@N03", "9511843@N02"]
    return choice(initial_user)


@app.route('/clear')
def clear():
    session.clear()
    return "clear"



@app.route('/auth')
@app.route('/auth/<fav>')
def flickr_auth(fav = ""):
    flickr = flickrapi.FlickrAPI(api_key, api_secret, store_token=False)

    if fav != 'fav':
        session['perms'] = 'read'
        return redirect(flickr.web_login_url('read'))
    else:
        session['perms'] = 'write'
        return redirect(flickr.web_login_url('write'))


@app.route('/auth/callback')
def flickr_auth_callback():
    flickr = flickrapi.FlickrAPI(api_key, api_secret, store_token=False)
    session['token'] = flickr.get_token(request.args.get('frob'))
    return redirect(url_for('index'))


@app.route('/api/get_photos', methods=['GET'])
@app.route('/api/get_photos/<user_id>', methods=['GET'])
@json_headers
# @flickr_interface
def get_photos(user_id = '14280625@N03'):

    can_fav = 0

    chain = ['start']

    if 'token' in session:
        chain.append('has_token')
        flickr = flickrapi.FlickrAPI(api_key, api_secret, token=session['token'], store_token=False)

        if 'perms' in session:
            chain.append('has_perms')
            if session['perms'] == 'write':
                can_fav = 1

        try:
            chain.append('check_token')
            flickr.auth_checkToken(token=session['token'])
        except flickrapi.FlickrError:
            session.clear()
            can_fav = 0
            flickr = flickrapi.FlickrAPI(api_key, api_secret, store_token=False)
    else:
        chain.append('has_no_token')
        flickr = flickrapi.FlickrAPI(api_key, api_secret, store_token=False)
        if user_id == 'me':
            user_id = random_initial_user()



    if user_id == 'me' and 'token' in session:
        chain.append('me and token')
        ps = flickr.favorites_getList(format='json', nojsoncallback=1, extras='url_m, url_z, path_alias, url_c')
    else:
        chain.append('not me and token')
        ps = flickr.favorites_getPublicList(user_id=user_id, format='json', nojsoncallback=1, extras='url_m, url_z, path_alias, url_c')


    results = json.loads(ps)



    photos = results['photos']['photo']

    export_photos = []

    for photo in photos:
        tmp_photo = {}
        if 'url_m' not in photo:
            pass
        tmp_photo['f'] = can_fav
        tmp_photo['u'] = photo['url_m'] # .rsplit('.',1)[0] --- don't strip the extension, what were you thinking....
        tmp_photo['fl'] = photo['id']
        tmp_photo['o'] = photo['owner']
        export_photos.append(tmp_photo)


    shuffle(export_photos)

    return(json.dumps(export_photos[0:20]))

@app.route('/api/fav/<photo_id>')
def fav(photo_id):
    if 'token' in session:
        flickr = flickrapi.FlickrAPI(api_key, api_secret, token=session['token'], store_token=False)
    else:
        return error_handler('flickr_auth')

    try:
        flickr.favorites_add(api_key=api_key, photo_id=photo_id)
    except flickrapi.FlickrError:
        return error_handler('flickr_auth')


    return ""


@app.route("/")
def index():
    if 'token' in session:
        flickr = flickrapi.FlickrAPI(api_key, api_secret, token=session['token'], store_token=False)
        try:
            flickr.auth_checkToken(token=session['token'])
        except flickrapi.FlickrError:
            session.clear()

    error = None
    return render_template('index.html', error=error)



if __name__ == '__main__':
    app.run(host='0.0.0.0')
