function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//TODO: Filter to just the written tweets
	// collect into global var
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table

	const searchBar = document.getElementById("textFilter");

	searchBar.addEventListener("input", function(event){
		// search is event.target.value
		// filter the tweets using the written tweets and search
		// .includes(search)
		// display the results in the table
		// update the text
	})
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});