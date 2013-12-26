var app = app || {};

app.contextBox = "<button id='showContext' class='btn showContext'>Context</button>" +
									"<div id='contextBoxWrapper' class='contextBoxWrapper'>" +
										"<div id='title' class='title'>" +
											"<h1>Context</h1>" +
											"<button id='hideContext' class='btn hideContext'>Hide</button>" +
										"</div>" +
										"<div id='contextBox' class='hidden'></div>" +
									"</div>";

app.loadingGif = "<p>Loading...</p>";//"<img src='img/loading.gif'/>";

app.contextOn = true;

app.main = function() {
	//add classes to links suitable for creating tooltips for for efficiency
	app.scanSuitableLinks();
	//put the context UI in the DOM
	app.addContextBox();
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
	//console.log(app.links);
}

app.hideContext = function() {
	app.contextOn = !app.contextOn;
	$('#contextBoxWrapper').hide();
}

app.showContext = function() {
	app.contextOn = !app.contextOn;
	$('#contextBoxWrapper').show();
}

app.addContextBox = function() {
	$("body").append(app.contextBox)
}

app.getContext = function() {
	//show a loading gif in the context box
	$('#contextBox').html(app.loadingGif);
	//get the data
	var page = this.getAttribute("href").substring(6); //substring(6) removes /wiki/ from url
	app.getData(page);
}

//make api call to wikipedia
app.getData = function(page) {
	if(app.contextOn) {
	var url = "http://en.wikipedia.org/w/api.php?action=parse&format=json&section=0&prop=text&page=" + page;
	$.ajax({
		url: url,
	}).done(app.populateContextBox);
	}
}

//
app.populateContextBox = function(data) {
	console.log('populate');
	app.fullText = data.parse.text["*"];
	app.text = [];
	app.fullText.replace(/<p>(.*?)<\/p>/g, function () {
		app.text.push(arguments[1]);
		console.log(app.text);
		$('#contextBox').html(app.text).removeClass('hidden');
	});
	var title = $($('#contextBox b')[0]).html();
	$('#title h1').html(title);
}

//must go last
$(document).ready(app.main);