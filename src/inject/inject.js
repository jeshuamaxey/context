var app = app || {};

//remebers state of the app
app.on = false;
//debug mode
app.debug = true;
//how to trigger context
app.trigger = "click"; //mouseenter";

//CSS selector used to scan links
app.linkSelector = "#mw-content-text p a.contextEligible";

//stores all data from api calls to prevent making same call twice
//consider using local database here
app.contexts = {};

app.contextBox = 	"<button id='showContext' class='btn showContext'>Context</button>" +
										"<div id='contextBoxWrapperInner' class='contextBoxWrapperInner'>" +
											"<div id='title' class='title'>" +
												"<h2><a href='http://jeshua.co'>Context</a></h2>" +
												"<button id='hideContext' class='btn hideContext'>Hide</button>" +
											"</div>" +
											"<div id='contextBox' class='hidden'></div>" +
										"</div>";

//shown when making API calls
app.loadingGif = "<p>Loading...</p>";

//run on page load
app.main = function() {
	//add classes to links suitable for creating tooltips for for efficiency
	app.scanSuitableLinks();
	//put the context UI in the DOM
	$("body").append(app.contextBox)
	//add event listeners to turn context on/off
	$('#hideContext').on('click', app.contextOff);
	$('#showContext').on('click', app.contextOn);
	//fire it up
	app.contextOn();
}

//This doesn't do anything practical (yet)
app.scanSuitableLinks = function() {
	app.links = [];
	$("#mw-content-text p a").each(function(i, a) {
		var contextURL = this.getAttribute("href").substring(6); //substring(6) removes /wiki/ from url
		var title = app.decode_utf8(contextURL).replace(/_/g, " ");	//replace underscores with spaces;
		if(contextURL.substring(0,5) == "Help:") return;
		else {
			$(this).addClass('contextEligible');
			$(this).attr('contextURL', contextURL);
			$(this).attr('contextTitle', title);
			app.contexts[title] = {
				'contextURL' : contextURL,
				'wikiURL' : '/wiki/' + contextURL
			};
		}
	});
}

//when context is turned off
app.contextOff = function() {
	app.on = !app.on;
	$('#contextBoxWrapperInner').slideUp(200);
	//remove event handler so clicks work as normal
	$(app.linkSelector).unbind(app.trigger);
	$('body').removeClass('contextOn');
}

//when context is turned on
app.contextOn = function() {
	app.on = !app.on;
	$('#contextBoxWrapperInner').slideDown(200);
	//add event listener to override link clicks
	$(app.linkSelector).on(app.trigger, app.getContext);
	$('body').addClass('contextOn');
}

//initiates context search
app.getContext = function(e) {
	//stop links being followed when clicked
	e.preventDefault();
	//highlight the link in the wikipedia article
	$(app.linkSelector).removeClass('contextSubject');
	$(this).addClass('contextSubject');
	//show a loading gif in the context box
	$('#contextBox').html(app.loadingGif);
	//isolate the contextURL
	title = $(this).attr('contextTitle');
	//use the array if it has the relevant snippet
	if(app.contexts[title].text !== undefined) {
		app.populateContextBox(title)
	} else {
		//get the data
		app.getData(title);
	}
}

//make api call to wikipedia
app.getData = function(title) {
	if(app.contextOn) {
		var url = "http://en.wikipedia.org/w/api.php?action=parse&format=json&section=0&prop=text&page=" + app.contexts[title].contextURL;
		$.ajax({
			url: url,
		}).done(function(data) {
			app.processData(data, title);
		}).error(function(err) {
			alert('ERROR!\n'+err);
		});
	}
}

//save data into app.contexts
app.processData = function(data, title) {
	app.contexts[title].data = data;
	app.contexts[title].fullText = data.parse.text["*"].wiki2html();
	//clever parsing could occur here to exclude images conditionally
	//for now, css is used to selectively hide specific elements
	app.contexts[title].text = app.contexts[title].fullText;
	app.populateContextBox(title);
}

//show context snippet
app.populateContextBox = function(title) {
	$('#contextBox').html(app.contexts[title].text).removeClass('hidden');
	$('#title h2 a').attr('href', app.contexts[title].wikiURL);
	$('#title h2 a').html(title);
}

//for URL to title manipulation
app.encode_utf8 = function(s) {
  return unescape(s);
}

//for URL to title manipulation
app.decode_utf8 = function(s) {
  return decodeURIComponent(s);
}

//must go last
$(document).ready(app.main);