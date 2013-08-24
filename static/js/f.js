jQuery(document).ready(function(){

;(function($){var h=$.scrollTo=function(a,b,c){$(window).scrollTo(a,b,c)};h.defaults={axis:'xy',duration:parseFloat($.fn.jquery)>=1.3?0:1,limit:true};h.window=function(a){return $(window)._scrollable()};$.fn._scrollable=function(){return this.map(function(){var a=this,isWin=!a.nodeName||$.inArray(a.nodeName.toLowerCase(),['iframe','#document','html','body'])!=-1;if(!isWin)return a;var b=(a.contentWindow||a).document||a.ownerDocument||a;return/webkit/i.test(navigator.userAgent)||b.compatMode=='BackCompat'?b.body:b.documentElement})};$.fn.scrollTo=function(e,f,g){if(typeof f=='object'){g=f;f=0}if(typeof g=='function')g={onAfter:g};if(e=='max')e=9e9;g=$.extend({},h.defaults,g);f=f||g.duration;g.queue=g.queue&&g.axis.length>1;if(g.queue)f/=2;g.offset=both(g.offset);g.over=both(g.over);return this._scrollable().each(function(){if(e==null)return;var d=this,$elem=$(d),targ=e,toff,attr={},win=$elem.is('html,body');switch(typeof targ){case'number':case'string':if(/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(targ)){targ=both(targ);break}targ=$(targ,this);if(!targ.length)return;case'object':if(targ.is||targ.style)toff=(targ=$(targ)).offset()}$.each(g.axis.split(''),function(i,a){var b=a=='x'?'Left':'Top',pos=b.toLowerCase(),key='scroll'+b,old=d[key],max=h.max(d,a);if(toff){attr[key]=toff[pos]+(win?0:old-$elem.offset()[pos]);if(g.margin){attr[key]-=parseInt(targ.css('margin'+b))||0;attr[key]-=parseInt(targ.css('border'+b+'Width'))||0}attr[key]+=g.offset[pos]||0;if(g.over[pos])attr[key]+=targ[a=='x'?'width':'height']()*g.over[pos]}else{var c=targ[pos];attr[key]=c.slice&&c.slice(-1)=='%'?parseFloat(c)/100*max:c}if(g.limit&&/^\d+$/.test(attr[key]))attr[key]=attr[key]<=0?0:Math.min(attr[key],max);if(!i&&g.queue){if(old!=attr[key])animate(g.onAfterFirst);delete attr[key]}});animate(g.onAfter);function animate(a){$elem.animate(attr,f,g.easing,a&&function(){a.call(this,targ,g)})}}).end()};h.max=function(a,b){var c=b=='x'?'Width':'Height',scroll='scroll'+c;if(!$(a).is('html,body'))return a[scroll]-$(a)[c.toLowerCase()]();var d='client'+c,html=a.ownerDocument.documentElement,body=a.ownerDocument.body;return Math.max(html[scroll],body[scroll])-Math.min(html[d],body[d])};function both(a){return typeof a=='object'?a:{top:a,left:a}}})(jQuery);


	function photoInterface()  {


		this.init = function() {
			$('#photoHolder').on('click', '.js-load-more', this.loadMorePhotos);
			// $('#photoHolder').on('click', '.js-flickr-page', this.gotoFlickrPage);
			$('#photoHolder').on('click', '.js-fav', this.addFav);
			$('#photoHolder').on('click', '.js-big-pic', this.lightboxDisplay);
			$('#photoHolder').on('mouseenter', '.js-photo', this.showPhotoNav);
			$('#photoHolder').on('mouseleave', '.js-photo', this.hidePhotoNav);

			this.getPhotos('me');
		}

		this.gotoFlickrPage = function() {
			var flickrURL = 'http://www.flickr.com/photos/' + $(this).closest('.js-photo').data('photoid') + '/';
			window.open(flickrURL, "_blank");
		}

		this.addFav = function() {
			_popup.hidePopup();
			var favURL = '/api/fav/' + $(this).closest('.js-photo').data('photoid');
			$(this).closest('.js-photo').data('faved' , 1);
			$.get(favURL, _photo.onAddFav)
			$(this).addClass('faved');
		}

		this.onAddFav = function(results) {
			if (results == 'error_flickr_auth') {
				_error.showError('flickr authentication failed', 'You have not authorized ffffl*ckr to write to your flickr account, sorry.');
			}
		}

		this.lightboxDisplay = function() {
			_popup.hidePopup();
			$.colorbox({ href: $(this).closest('.js-photo').data('url'), transition:"fade" } );
		}

		this.showPhotoNav = function() {

			var box = $(this).find('.over-nav');

			var flickrURL = 'http://www.flickr.com/photo.gne?id=' + $(this).closest('.js-photo').data('photoid');

			box.html(_photo.makeOverNav(flickrURL, $(this).closest('.js-photo').data('fav')));
			var newButtonHeight = ($(this).height() - 131) > box.find('.js-load-more').height() ? ($(this).height() - 131) : box.find('.js-load-more').height();

			if ($(this).closest('.js-photo').data('faved') == 1) {
				box.find('.js-fav').addClass('faved');
			}

			box.find('.js-load-more').css('height', newButtonHeight);
			box.find('.js-load-more').find('.nav-bg').css('height', newButtonHeight);
			box.find('.js-load-more').find('.nav-content').css('height', newButtonHeight);
			box.find('.js-load-more').find('.nav-content').css('padding-top', (newButtonHeight - 52) / 2);

			$(this).closest('.photo img').css('opacity', '0.5');
			box.show();
		}

		this.hidePhotoNav = function() {
			$(this).find('.over-nav').html('');
			$(this).find('.over-nav').hide();
			$(this).closest('.photo img').css('opacity', '1');
		}

		this.loadMorePhotos = function() {
			$.scrollTo($("#photoHolder").last(), 1000, { offset: -80 + $(window).height(), axis: "y"});
			_photo.getPhotos($(this).closest('.js-photo').data('owner'));
		}

		this.getPhotos = function(user_id) {
			_popup.hidePopup();
			_preloader.show();
			// user_id = typeof user_id !== 'undefined' ? user_id : _photo.getRandomUser();
			$.get('/api/get_photos/' + user_id, _photo.onGetPhotos);


		};

		this.getRandomUser = function() {
			initUserList = ["14280625@N03", "26168434@N02", "26540085@N08", "32662406@N03", "33783444@N05", "34365925@N05", "38177870@N00", "42128445@N00", "48848351@N00", "53519312@N08", "54167581@N00", "59254826@N00", "59697550@N00", "60529400@N06", "60898119@N00", "60899775@N00", "7227415@N07", "7710444@N03", "9511843@N02"];
			return initUserList[Math.floor(Math.random()*initUserList.length)];
		}


		this.onGetPhotos = function(results) {

			for (var i = 0; i < results.length; i++) {
				_photo.renderPhoto(results[i]);
			}
			_preloader.hide();


		};


		this.makeOverNav = function(flickrURL, can_fav) {
			var navHTML = '';

			if (can_fav == 1) {
				navHTML += '<div class="js-flickr-page flickr-page narrow"><div class="nav-bg"></div><a href="' + flickrURL + '" target="_blank"><div class="icon-popup nav-content"></div></a></div>';
				navHTML += '<div class="js-fav fav narrow second"><div class="nav-bg"></div><div class="icon-star nav-content"></div></div>';
			} else {
				navHTML += '<div class="js-flickr-page flickr-page"><div class="nav-bg"></div><a href="' + flickrURL + '" target="_blank"><div class="icon-popup nav-content"></div></a></div>';
			}
			navHTML += '<div style="clear: both" class="js-big-pic big-pic"><div class="nav-bg"></div><div class="icon-resize-full-alt nav-content"></div></div>';
			navHTML += '<div class="js-load-more load-more"><div class="nav-bg"></div><div class="icon-down-big nav-content"></div></div>';

			return navHTML;
		}



		this.renderPhoto = function(photo) {

			var thumbnail_url = photo.u;

			var photo_url_a = photo.u.split('.')
			photo_url_a[photo_url_a.length - 2] = photo_url_a[photo_url_a.length - 2] + '_b';
			var photo_url = photo_url_a.join('.');

			var photoHTML = $('<div data-fav="' + photo.f + '" data-url="' + photo_url + '" data-photoid="' + photo.fl + '" data-owner="' + photo.o + '" class="js-photo photo"><div class="over-nav"></div><img src="' + thumbnail_url + '"></div>');

			$("#photoHolder").gridalicious('append', photoHTML);
		}



	};

	function popupHandler() {

		this.init = function() {
			$("#fffflckrinfo").click(this.showPopup);
			$('.js-close-popup').click(this.hidePopup);

			$(document).keyup(function(e) {
				if (e.keyCode == 27) { _popup.hidePopup(); } 
			});
		}


		this.showPopup = function() {

			$('.js-info-popup').fadeIn();

		}

		this.hidePopup = function() {
			$('.js-info-popup').fadeOut(); 
		}


	}


	function errorHandler() {

		this.init = function() {
			$('#error').on('click', '.button', _error.hideError);
		}

		this.showError = function(error_title, error_text) {
			$('#error h3').html(error_title);
			$('#error p').html(error_text);
			$('#error').fadeIn();
			setTimeout(this.hideError, 5000);

		}

		this.hideError = function() {
			$('#error').fadeOut();
		}


	}

	function init() {

		$("#photoHolder").gridalicious({
			width: 322,
			gutter: 0,
			selector: '.js-photo',
			animate: true,
				animationOptions: {
				queue: true,
				speed: 200,
				duration: 300,
				effect: 'fadeInOnAppear'
			}
		});


		_photo.init();
		_error.init();
		_popup.init();

	};
	
	var _popup = new popupHandler();
	var _photo = new photoInterface();
	var _preloader = $('#preloader');
	var _error = new errorHandler();

	init();


});