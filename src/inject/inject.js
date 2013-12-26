var app = app || {};

//remebers state of the app
app.contextOn = true;

//stores all data from api calls to prevent making same call twice
//consider using local database here
app.snippets = {};

app.contextBox = "<button id='showContext' class='btn showContext'>Context</button>" +
									"<div id='contextBoxWrapper' class='contextBoxWrapper'>" +
										"<div id='title' class='title'>" +
											"<h1><a href='http://jeshua.co'>Context</a></h1>" +
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
	$('#hideContext').on('click', app.hideContext);
	$('#showContext').on('click', app.showContext);
	//hover event listener that triggers context
	$('#mw-content-text p a').on("mouseenter", app.getContext);
}

//This doesn't do anything practical (yet)
app.scanSuitableLinks = function() {
	app.links = [];
	$('#mw-content-text p a').each(function(i, a) {
		app.links.push(a);
	});
}

//when context is turned off
app.hideContext = function() {
	app.contextOn = !app.contextOn;
	$('#contextBoxWrapper').slideUp(200);
}

//when context is turned on
app.showContext = function() {
	app.contextOn = !app.contextOn;
	$('#contextBoxWrapper').slideDown(200);
}

//initiates context search
app.getContext = function() {
	//show a loading gif in the context box
	$('#contextBox').html(app.loadingGif);
	//isolate the page name
	page = this.getAttribute("href").substring(6); //substring(6) removes /wiki/ from url
	//use the array if it has the relevant snippet
	if(app.snippets[page] !== undefined) {
		app.populateContextBox(page)
	} else {
		//get the data
		app.getData(page);
	}
}

//make api call to wikipedia
app.getData = function(page) {
	if(app.contextOn) {
		var url = "http://en.wikipedia.org/w/api.php?action=parse&format=json&section=0&prop=text&page=" + page;
		$.ajax({
			url: url,
		}).done(function(data) {
			app.processData(data, page);
		});
	}
}

//save data into app.snippets
app.processData = function(data, page) {
	console.log('process');
	app.fullText = data.parse.text["*"];
	app.text = [];
	app.fullText.replace(/<p>(.*?)<\/p>/g, function () {
		app.snippets[page] = {};
		app.snippets[page].url = "/wiki/" + page;
		app.snippets[page].title = page.replace(/_/g, " ");	//replace underscores with spaces
		app.snippets[page].text = arguments;
		app.populateContextBox(page);
	});
}

//show context snippet
app.populateContextBox = function(page) {
	$('#contextBox').html(app.snippets[page].text[0]).removeClass('hidden');
	$('#title h1 a').attr('href', app.snippets[page].url);
	$('#title h1 a').html(app.snippets[page].title);
}

//must go last
$(document).ready(app.main);