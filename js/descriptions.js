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

	// update the page text
	document.getElementById("searchText").innerText = ""; 
	document.getElementById("searchCount").innerText = "";
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table

	const searchBar = document.getElementById("textFilter");

	searchBar.addEventListener("input", function(event){
		var search = event.target.value;
		var filteredTws = [];

		// update the page text
		document.getElementById("searchText").innerText = search; 

		// if the search is empty and we already have rows in the table, delete them
		var DOMtable = document.getElementsByClassName("table")[0];
		var rowCount = DOMtable.rows.length;
		if (rowCount >= 2){
			for (var i = rowCount - 1; i >= 1; i--){
					DOMtable.deleteRow(i);
			}
			//console.log("ALL ROWS DELETED");
		}

		// get the tweets that match the user's search
		writtenTweets.forEach(tw => {
			if (tw.text.includes(search)){
				filteredTws.push(tw);
			}
		});

		// update the page text with the count
		document.getElementById("searchCount").innerText = filteredTws.length - 1; 
		//console.log(filteredTws.length);

		// update the DOM table if the search is not empty
		if (search != ""){
			for (var i = 1; i <= filteredTws.length; i++){
				var newRow = DOMtable.insertRow(-1);
				newRow.innerHTML = filteredTws[i].getHTMLTableRow(i);
			}
		}
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});