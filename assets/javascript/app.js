// Setting up the Firebase.
var tableData = new Firebase("https://api-project.firebaseio.com/")

// Setting up variables that will be pushed to the Firebase.
var currentDay = moment().format("MM/DD");
var functionName = "";
var language = "";
var syntax = "";
var description = "";

// This is the big search button on the page. It currently does nothing.
$("#submitbutton").click(function() {

});

// All of this happens when you click the "add a function/method button"...
$("#functionButton").click(function() {
	
	// Takes the values from the input boxes and stores them as variables.
	functionName = $("#nameBox").val()
	language = $("#languageBox").val()
	syntax = $("#syntaxBox").val()
	description = $("#descriptionBox").val()

	// Clears all of the input boxes.
	$("#nameBox").val(null)
	$("#languageBox").val(null)
	$("#syntaxBox").val(null)
	$("#descriptionBox").val(null)

	// Pushes all of the saved variables into the Firebase. 
	tableData.push ({
			functionName: functionName,
			language: language,
			syntax: syntax,
			description: description,
			date: currentDay
	});

});

// All of this happens when the page loads, and then again when a new child is added. The code runs for each child in the database. 
tableData.on('child_added', function(childSnapshot, prevChildKey) {

	// Setting up a variable for the table row.
	var tableEntry = $("<tr>")

	// Creates a <td> for function/method name and adds it. 
	var nameTD = $("<td>")
	nameTD.append(childSnapshot.val().functionName)

	// Creates a <td> for the language and adds it. 
	var languageTD = $("<td>")
	languageTD.append(childSnapshot.val().language)

	// Creates a <td> for the description and adds it. 
	var descriptionTD = $("<td>")
	descriptionTD.append(childSnapshot.val().description)

	// Creates a <td> for the syntax and adds it. 
	var syntaxTD = $("<td>")
	syntaxTD.append(childSnapshot.val().syntax)

	// Creates a <td> for the resource links. 
	var resourceTD = $("<td>")


	// ------YouTube------

		// The variable for the YouTube link.
		var link = $("<a>")
		// link.text("YouTube")

		// var youtubeIcon = $("<img>")
		// youtubeIcon.attr("src", )

		var youtubeIcon = $("<i>")
		youtubeIcon.addClass("fa fa-youtube-square")
		youtubeIcon.appendTo(link)

		// This is the code that will make the modal appear when you click the link.
		link.attr("data-toggle", "modal")
		link.attr("data-target", ".bs-example-modal-lg")

		// Adds a click function for the YouTube link.
		link.click(function() {
			
			// Emptys the modal body.
			$("#modalbody").empty();

			$("#modalbody").addClass("text-center");
			
			// Changes the title on the modal.
			$("#myModalLabel").html("Additional Resources - YouTube")

			// Creates the url that will be used for the YouTube API call. 
			var queryURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + childSnapshot.val().functionName + "+" + childSnapshot.val().language + "&key=AIzaSyDhXnzU5IOira_ZSXqhw1wI84bHucG7YNI";

			// The API call for YouTube.
			$.ajax({url: queryURL, method: 'GET'}).done(function(data) {

				// Stuff for testing.
				console.log("-----YouTube API call-----");
				console.log(queryURL);
				console.log(data);

				// Saves the video ID of the first result into a variable.
				var videoID = data.items[0].id.videoId;

				// Appends the appropriate video to the modal.
				$("#modalbody").append('<iframe width="560" height="315" src="http://www.youtube.com/embed/' + videoID + '" frameborder="0" allowfullscreen></iframe>');

			});

		})

		// Adds the link to the resources <td>
		resourceTD.append(link)

	// ------YouTube------

	// ------Reddit------

		// The varriable for the Reddit Link.
		var redditLink = $("<a>")
		// redditLink.text("Reddit")

		var redditIcon = $("<i>")
		redditIcon.addClass("fa fa-reddit-square")
		redditIcon.appendTo(redditLink)

		// This is the code that will make the modal appear when you click the link.
		redditLink.attr("data-toggle", "modal")
		redditLink.attr("data-target", ".bs-example-modal-lg")

		// Adds a click function for the Reddit link.
		redditLink.click(function() {

			// Emptys the modal body.
			$("#modalbody").empty();

			$("#modalbody").removeClass("text-center");

			// Changes the title on the modal.
			$("#myModalLabel").html("Additional Resources - Reddit")

			// The url for the Reddit API call.
			var redditURL = 'https://api.pushshift.io/reddit/search/submission?q="' + childSnapshot.val().functionName + '"&subreddit=javascript&limit=5';

			// The Reddit API call.
			$.ajax({url: redditURL, method: 'GET'}).done(function(response) {

				// Stuff for testing.
				console.log("-----Reddit API call-----");
				console.log(redditURL);
				console.log(response);
		
				var ol = $("<ol>")
				// This code makes links out of the first 5 results from Reddit.
				for ( x = 0; x < 5; x++ ) {
					
					var li = $("<li>")
					var linky = $("<a>")
					linky.text(response.data[x].title)
					linky.attr("href", response.data[x].url)
					linky.attr("target", "_blank")
					linky.addClass("link")

					$(li).append(linky)
					$(ol).append(li)
					$("#modalbody").append( ol );
					// $("#modalbody").append( "<br>" );
				};

			});

		});

		// Adds the reddit link to the table.
		// resourceTD.append("<br>")
		resourceTD.append(redditLink)

	// ------Reddit------

	// ------Stack Overflow------

		// The varriable for the Stack Overflow Link.
		var stackLink = $("<a>")
		// stackLink.text("StackOverflow")

		var stackIcon = $("<i>")
		stackIcon.addClass("fa fa-stack-overflow")
		stackIcon.appendTo(stackLink)

		// This is the code that will make the modal appear when you click the link.
		stackLink.attr("data-toggle", "modal")
		stackLink.attr("data-target", ".bs-example-modal-lg")

		// Adds a click function for the Stack Overflow link.
		stackLink.click(function() {

			// Emptys the modal body.
			$("#modalbody").empty();

			$("#modalbody").removeClass("text-center");

			// Changes the title on the modal.
			$("#myModalLabel").html("Additional Resources - Stack Overflow")

			// Removes the '.' from the function/method name before searching. The '.' would mess with the API call url and prevent it from working.
			var term = childSnapshot.val().functionName
			term = term.replace(/[.]/g, '')

			// Search url of tagged posts name and language.
			// var stackURL = 'http://api.stackexchange.com/2.2/questions?order=desc&sort=votes&tagged=' + term +'+' + childSnapshot.val().language + '&site=stackoverflow';

			// Search url with just the name of the method.
			// var stackURL = 'http://api.stackexchange.com/2.2/search/advanced?order=desc&sort=votes&q=' + term + '&site=stackoverflow';

			// The url for the Stack Overflow API call. Searches the name of the function/method and the language for more specific results. 
			var stackURL = 'http://api.stackexchange.com/2.2/search/advanced?order=desc&sort=votes&q=' + term + '+' + childSnapshot.val().language + '&site=stackoverflow';

			// The Stack Overflow API call. 
			$.ajax({url: stackURL, method: 'GET'}).done(function(response) {

				// For testing.
				console.log("-----Stack Overflow API call-----");
				console.log(stackURL);
				console.log(response);
		
				var ol = $("<ol>")
				// This code makes links out of the first 5 results from Stack Overflow.
				for ( x = 0; x < 5; x++ ) {

					var li = $("<li>")
					var linky = $("<a>")
					linky.text(response.items[x].title)
					linky.attr("href", response.items[x].link)
					linky.attr("target", "_blank")

					$(li).append(linky)
					$(ol).append(li)
					$("#modalbody").append( ol );
					// $("#modalbody").append( "<br>" );
				}

			});

		});

		// Adds the Stack Overflow link to the table.
		// resourceTD.append("<br>")
		resourceTD.append(stackLink)

	// ------Stack Overflow------

	// Creates a <td> for the current date and adds it.
	var dateTD = $("<td>")
	dateTD.append(childSnapshot.val().date)

	// Adds all of the individual <td>s we created to the <tr>.
	tableEntry.append(nameTD)
	tableEntry.append(languageTD)
	tableEntry.append(descriptionTD)
	tableEntry.append(syntaxTD)
	tableEntry.append(resourceTD)
	tableEntry.append(dateTD)
	
	// Adds the <tr> (table row) to the table. FINALLY!
	// $("#theTable").append(tableEntry)
	$("#tbody").append(tableEntry)


// Error handling
}, function(errorObject){

		console.log("Errors handled: " + errorObject.code);

});

// Emptys the modal when you click one of the close buttons. This stops the YouTube videos from playing! They still play when you click off the modal however..
$(".stopvideo").click(function() {
	$("#modalbody").empty();
})

// This is the code that makes the DataTable work... DEFINITELY not supposed to be using a time out but I have no idea how to make the function run after the data is loaded.
var lel = function() {
	$(document).ready(function(){
	    $('#theTable').DataTable();
	});
};

setTimeout(lel, 700);
