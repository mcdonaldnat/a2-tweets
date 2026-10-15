function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	
	// update the earliest and latest tweet text
	document.getElementById('firstDate').innerText = findEarlistTweet(tweet_array);
	document.getElementById('lastDate').innerText = findLatestTweet(tweet_array);
	//update percentage values
	document.getElementsByClass('completedEventsPct').innerText = 1;
	document.getElementsByClass('liveEventsPct').innerText = 2;
	document.getElementsByClass('achievementsPct').innerText = 3;
	document.getElementsByClass('miscellaneousPct').innerText = 4;


}

//---- PART 1.1: Tweet Dates ----

// find the earliest date and returns it as a .toLocaleDateString
function findEarlistTweet(tweet_array){
	var earliestDate = tweet_array[0].time; // the Date obj of when the tweet was created
	tweet_array.forEach(elem => {
		if (elem.time < earliestDate){
			earliestDate = elem.time;
		}
	})

	// Format the long date like "Monday, January 4th, 2005"
	const options = {
	weekday: "long",
	year: "numeric",
	month: "long",
	day: "numeric",
	};

	return earliestDate.toLocaleDateString("en-US", options); 
}

// find the latest date and returns it as a .toLocaleDateString
function findLatestTweet(tweet_array){
	var latestDate = tweet_array[0].time; // the Date obj of when the tweet was created
	tweet_array.forEach(elem => {
		if (elem.time > latestDate){
			latestDate = elem.time;
		}
	})

	// Format the long date like "Monday, January 4th, 2005"
	const options = {
	weekday: "long",
	year: "numeric",
	month: "long",
	day: "numeric",
	};

	return latestDate.toLocaleDateString("en-US", options); 

}

//---- PART 1.2: Tweet Categories ----

function updateDocumentPercentages(class_name){
	
}


//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});