# ffff*lckr

[ffff*lckr](http://fffflckr.com) is a simple, web-based app dedicated to helping users find great photography on [flickr](http://flickr.com).

## Requirements and installation

ffffl*ckr is built on Python and [Flask](http://flask.pocoo.org/) and uses the [flickrapi](http://stuvel.eu/flickrapi) interface. Every Flask installation I've used has been different, so find out what you need to do with your host. You will need to [get an API key from flickr](http://flickr.com/services/apps/create/apply). Point the authentication endpoint at `http://application.com/auth/callback`.

Then just set up your Flask instance and 
````
python app.py
````

No sort of data backend is needed.

The current version of ffff*lckr uses [Nexa Free Light](http://fontfabric.com/nexa-free-font/) and a custom symbol font from [fontello](http://fontello.com). As I'm not sure what the exact licensing is past personal use, I have not included these on github, sorry.

## License

The source code to ffff*lckr is released under the MIT License, meaning you can pretty much do whatever you want with it. I'd rather you didn't actually sell it, cause that would just be lame, but use it in any projects you want.
