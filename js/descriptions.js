var writtenTweets = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//TODO: Filter to just the written tweets
	runkeeper_tweets.forEach(tw =>{
		var newTweet = new Tweet(tw.text, tw.created_at);
		if (newTweet.written){
			writtenTweets.push(newTweet);
		}
	});
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table

	const searchBar = document.getElementById("textFilter");

	searchBar.addEventListener("input", function(event){
		var search = event.target.value;
		var filteredTws = [];

		writtenTweets.forEach(tw => {
			if (tw.text.includes(search)){
				filteredTws.push(tw);
			}
		});

		// .getElementsByTagName('tbody')[0]

		var DOMtable = document.getElementsByClassName("table")[0];

		// filteredTws.length
		for (var i = 1; i <= 20; i++){
			var newRow = DOMtable.insertRow();
			newRow.innerHTML = filteredTws[i].getHTMLTableRow(i);
		}

		console.log(filteredTws.length);
		console.log(filteredTws.slice(0, 20));
	})
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});