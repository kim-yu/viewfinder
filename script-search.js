var SOURCES_LOC = [['Alchemist', '84 Massachusetts Ave, MIT Stratton Student Center Lawn, Cambridge, MA 02139', 'alchemist'],['MIT\'s Great Dome','77 Massachusetts Ave, Cambridge, MA 02139','dome'],['MIT\'s Great Dome','77 Massachusetts Ave, Cambridge, MA 02139','dome2'],['Kresge Auditorium','48 Massachusetts Ave, Cambridge, MA 02139','kresge'],['For Marjorie','500 Memorial Drive, Cambridge, MA 02139','redsculpture'],['McCormick Hall', '320 Memorial Drive, Cambridge, MA 02139','river'],['Simmons Hall', '229 Vassar St, Cambridge, MA 02139','simmons'],['Stata Center', '32 Vassar St, Cambridge, MA 02139','stata2'],['Aesop\'s Fables, II', '32 Vassar St, Cambridge, MA 02139','stata3']];

var MIN_NUM_PHOTOS = 2
var NUM_MAPS = 3

var currentNumFilters = 0;

$(document).ready(function() {
	var random = Math.floor(Math.random()*NUM_MAPS) + 1;

	var map = document.createElement('img');
	map.setAttribute('id', 'mapimage');
	map.setAttribute('src', 'images/map'+random+'.png');
	map.setAttribute('width', '100%');
	map.setAttribute('class', 'map');
	document.getElementById('mapcontainer').appendChild(map);

	window.setTimeout(function() {
		var FILTERS = $(".searchinput").tagsinput('items');
		if (FILTERS) {
			if (FILTERS.length > 0) {
				currentNumFilters = FILTERS.length;
				refreshImages();
			}
		}
	}, 1);

	window.setTimeout(function() {
		if ($(".bootstrap-tagsinput input").length > 0) {
			$(".bootstrap-tagsinput input").get(0).focus();
			console.log($(".bootstrap-tagsinput input").get(0))
		}
	}, 400);

	// document.getElementsByClassName('searchinput')[0].focus();
});

$(document).on('click', '.heart', function(evt)
{
	toastr.options = {
	  "closeButton": false,
	  "debug": false,
	  "newestOnTop": false,
	  "progressBar": false,
	  "positionClass": "toast-bottom-right",
	  "preventDuplicates": false,
	  "onclick": null,
	  "showDuration": "100",
	  "hideDuration": "100",
	  "timeOut": "2000",
	  "extendedTimeOut": "100",
	  "showEasing": "swing",
	  "hideEasing": "linear",
	  "showMethod": "fadeIn",
	  "hideMethod": "fadeOut"
	}

	var heart = evt.target;
	if (heart.className == 'heart unheart') {
		heart.setAttribute('src', './images/heart.png');
		heart.className = 'heart faved';

		toastr.success('Added ' + evt.target.getAttribute('title') + ' to Inspirations');

	} else {
		heart.setAttribute('src', './images/whiteheart.png');
		heart.className = 'heart unheart';

  		toastr.success('Removed ' + evt.target.getAttribute('title') + ' from Inspirations');
	}
});

$(document).on('click', '.pinimage', function(evt)
{
	toastr.options = {
	  "closeButton": false,
	  "debug": false,
	  "newestOnTop": false,
	  "progressBar": false,
	  "positionClass": "toast-bottom-right",
	  "preventDuplicates": false,
	  "onclick": null,
	  "showDuration": "100",
	  "hideDuration": "100",
	  "timeOut": "2000",
	  "extendedTimeOut": "100",
	  "showEasing": "swing",
	  "hideEasing": "linear",
	  "showMethod": "fadeIn",
	  "hideMethod": "fadeOut"
	}

	if (evt.target.getAttribute('class').indexOf('unpinned')>=0) {
		evt.target.setAttribute('class', 'pinimage pinned');

		toastr.success('Added ' + evt.target.getAttribute('title') + ' to Pinned');

		// Show pin
		var mapX = evt.target.getAttribute('mapx');
		var mapY = evt.target.getAttribute('mapy');

		var pin = document.getElementById('realpinimg-'+mapX+'-'+mapY);
		pin.setAttribute('src', './pin.png');
	} else {
		evt.target.setAttribute('class', 'pinimage unpinned');
		toastr.success('Removed ' + evt.target.getAttribute('title') + ' Pin');

		// Hide pin
		var mapX = evt.target.getAttribute('mapx');
		var mapY = evt.target.getAttribute('mapy');

		var pin = document.getElementById('realpinimg-'+mapX+'-'+mapY);
		pin.setAttribute('src', './images/mappin.png');
	}
});

$(document).on('click', '#searchgobutton', function(evt)
{
	refreshImages();
});

// $(document).on('click', '#searchphotoimg', function(evt)
// {
// 	window.location.href = "./directions.html";
// });

$(document).on('click', '.mappin', function(evt)
{
	var placeName = evt.target.getAttribute('location');
	link = "./directions.html?place="+placeName;
	window.open(link, '_blank');
});

$(document).on('click', function(evt)
{
	setTimeout(function(){
		var FILTERS = $(".searchinput").tagsinput('items');
		if (FILTERS) {
			var length = FILTERS.length;

			if (currentNumFilters != length) {
				currentNumFilters = length;
		  	refreshImages();
			}
		}
  }, 1);
});

$(document).on('mouseenter', '.searchphotodiv', function(evt)
{
	var pinText = document.getElementById(evt.currentTarget.getAttribute('pintextid'));
	pinText.style.visibility=  "visible";
});

$(document).on('mouseleave', '.searchphotodiv', function(evt)
{
	var pinText = document.getElementById(evt.currentTarget.getAttribute('pintextid'));
	pinText.style.visibility=  "hidden";
});

$(document).on('mouseenter', '.pin-div', function(evt)
{
	var pinText = document.getElementById('text-' + evt.currentTarget.getAttribute('id'));
	pinText.style.visibility=  "visible";
});

$(document).on('mouseleave', '.pin-div', function(evt)
{
	var pinText = document.getElementById('text-' + evt.currentTarget.getAttribute('id'));
	pinText.style.visibility=  "hidden";
});

$(document).on('keydown', function(evt)
{
  if (evt.keyCode == 13/*enter*/ ||
  	  evt.keyCode == 8/*delete*/) {
  	setTimeout(function(){
			var FILTERS = $(".searchinput").tagsinput('items');
			var length = FILTERS.length;

			if (currentNumFilters != length) {
				currentNumFilters = length;
		  	refreshImages();
			}
    }, 1);
  }
});

function refreshImages()
{
	var column1 = document.getElementById('search-col-1');
	column1.innerHTML = '';
	var column2 = document.getElementById('search-col-2');
	column2.innerHTML = '';

	// Remove pins.
	var pins = document.getElementsByClassName('pin-div');
	var pinsToRemove = [];
	for (p=0; p<pins.length; p++) {
		var pin = pins[p];
		pinsToRemove.push(pin);
	}
	for (p=0; p<pinsToRemove.length; p++) {
		var pin = pinsToRemove[p];
		document.getElementById('mapcontainer').removeChild(pin);
	}

	var FILTERS = $(".searchinput").tagsinput('items');
	if (FILTERS.length == 0) {
		return;
	}

	var NUM_PHOTOS = MIN_NUM_PHOTOS + Math.floor(Math.random()*4);
	for (p=0; p<NUM_PHOTOS; p++) {
		var available = SOURCES_LOC.slice(0);

		var random = Math.floor(Math.random()*available.length);
		var src = './images/'+available[random][2]+'.jpg';

		var photoDiv = document.createElement('div');
		photoDiv.setAttribute('class', 'searchphotodiv');

		var photo = document.createElement('div');
		photo.setAttribute('id', 'photo-'+p);
		photo.setAttribute('class', 'photo');

		var img = document.createElement('img');
		img.setAttribute('id', 'searchphotoimg');
		img.setAttribute('class', 'directionsRedirect');
		img.setAttribute('src', src);
		img.setAttribute('width', '200px');
		img.setAttribute('height', '200px');
		photo.appendChild(img);

		var button = document.createElement('div');
		button.setAttribute('class', 'heart-div');

		var heart = document.createElement('input');
		heart.setAttribute('type', 'image');
		heart.setAttribute('src', './images/whiteheart.png');
		heart.setAttribute('class', 'heart unheart');
		heart.setAttribute('title', available[random][0]);
		button.appendChild(heart);
		photo.appendChild(button);

		var pic = document.createElement('div');
		pic.setAttribute('id', 'inspr-'+p);
		pic.setAttribute('class', 'pic');
		photo.appendChild(pic);

		var div = document.createElement('div');
		photo.appendChild(div);

		var titleHolder = document.createElement('div');
		titleHolder.setAttribute('id', 'titleHolder');
		var pin = document.createElement('input');
		pin.setAttribute('type', 'image');
		pin.setAttribute('src', './pin.png');
		pin.setAttribute('class', 'pinimage unpinned');
		pin.setAttribute('title', available[random][0]);
		//pin.style.filter = 'contrast(100%)'

	  var map = document.getElementById('mapimage');
		var mapWidth = map.clientWidth;
		var mapHeight = map.clientHeight;
		var randomX = 64 + Math.floor(Math.random()*(mapWidth - 128))-16;
		var randomY = 64 + Math.floor(Math.random()*(mapHeight - 128))-32;
		pin.setAttribute('mapX', randomX);
		pin.setAttribute('mapY', randomY);
		titleHolder.appendChild(pin);

		var title = document.createElement('h4');
		titleHolder.setAttribute('class','searchtitleholder')
		title.setAttribute('class','title directionsRedirect');
		title.innerHTML = available[random][0];
		titleHolder.appendChild(title)

		// Create pin
		var button = document.createElement('div');
		button.setAttribute('id', 'realpin-'+randomX+'-'+randomY);
		button.setAttribute('class', 'pin-div');
		button.setAttribute('location', title.innerHTML);
		button.style.left = randomX + 'px';
		button.style.top = randomY + 'px';

		var pin = document.createElement('input');
		pin.setAttribute('id', 'realpinimg-'+randomX+'-'+randomY);
		pin.setAttribute('class', 'mappin directionsRedirect');
		pin.setAttribute('type', 'image');
		pin.setAttribute('src', './images/mappin.png');
		pin.setAttribute('location', title.innerHTML);
		button.appendChild(pin);
		document.getElementById('mapcontainer').appendChild(button);

		var pinText = document.createElement('label');
		pinText.setAttribute('class', 'searchpintext');
		pinText.setAttribute('id', 'text-realpin-' + randomX + '-' + randomY);
		pinText.setAttribute('location', title.innerHTML);
		pinText.innerHTML = title.innerHTML;
		pinText.style.visibility=  "hidden";
		button.appendChild(pinText);

		photoDiv.appendChild(photo);
		photoDiv.appendChild(titleHolder);
		photoDiv.setAttribute('pintextid', 'text-realpin-' + randomX + '-' + randomY);

		if (p%2 == 0) {
			var column = document.getElementById('search-col-1');
			column.appendChild(photoDiv);
		} else {
			var column = document.getElementById('search-col-2');
			column.appendChild(photoDiv);
		}

		available.splice(random,1);
	}

	var pins = document.getElementsByClassName('pinimage');
	for (p=0; p<pins.length; p++) {
		var pin = pins[p];
		pin.setAttribute('class', 'pinimage unpinned');
	}
}

$(document).on('click', '.directionsRedirect', function(evt)
{
	var placeName = evt.target.parentElement.parentElement.childNodes[1].childNodes[0].title;
	// window.location.href = "./directions.html?place="+placeName;
	var link = "./directions.html?place="+placeName;
	window.open(link, '_blank');
});