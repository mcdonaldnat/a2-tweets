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
	updateDocumentInnerText("completedEventsPct", calculateCategoryPercentage("completed_event", tweet_array) + "%");
	updateDocumentInnerText("liveEventsPct", calculateCategoryPercentage("live_event", tweet_array) + "%");
	updateDocumentInnerText("achievementsPct", calculateCategoryPercentage("achievement", tweet_array) + "%");
	updateDocumentInnerText("miscellaneousPct", calculateCategoryPercentage("miscellaneous", tweet_array) + "%");
	// update count values
	updateDocumentInnerText("completedEvents", getCategoryCount("completed_event", tweet_array));
	updateDocumentInnerText("liveEvents", getCategoryCount("live_event", tweet_array));
	updateDocumentInnerText("achievements", getCategoryCount("achievement", tweet_array));
	updateDocumentInnerText("miscellaneous", getCategoryCount("miscellaneous", tweet_array));
	// update written and writtenPCT
	updateDocumentInnerText("written", getCountByWritten(tweet_array, true));
	var written_pct = (getCountByWritten(tweet_array, true) / getCategoryCount("completed_event", tweet_array)) * 100; 
	updateDocumentInnerText("writtenPct", math.format(written_pct, 2) + "%");
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

// sets the .innerText to the text_to_set (str/int) for each element in the HTML class by class_name (str)
function updateDocumentInnerText(class_name, text_to_set){
	var elements = document.getElementsByClassName(class_name);
	for (var i = 0; i < elements.length; i++){
		elements[i].innerText = text_to_set;
	}
}


// gets the count of all tweets in a certain category using category_name
function getCategoryCount(category_name, total_array){
	var category_count = 0;
	var total_count = total_array.length;

	for (var i = 0; i < total_count; i++){
		var tw = total_array[i].source;
		if (tw.toLowerCase() == category_name.toLowerCase()){
			category_count += 1; 
		}
	}

	return category_count;
}


// calculates the percentage of the tweet category in the total_tweet_array
function calculateCategoryPercentage(category_name, total_tweet_array){
	var category_count = getCategoryCount(category_name, total_tweet_array);
	var total_count = total_tweet_array.length;

	// format the result to 2 decimal points
	var percent = (category_count/total_count) * 100;
	return math.format(percent, 2);
}


//---- PART 1.3: User-Written Tweets ----


// returns an array of all tweets in a category by category_name
function getCategoryArray(category_name, tweet_array){
	var category_array = [];
	var total_count = tweet_array.length;

	for (var i = 0; i < total_count; i++){
		var tw = tweet_array[i].source;
		if (tw.toLowerCase() == category_name.toLowerCase()){
			category_array.push(tweet_array[i]);
		}
	}

	return category_array;
}


// returns the count of the completed_events based on the boolean written (true if user-written, false if not)
function getCountByWritten(tweet_array, written){
	var completed_tweets = getCategoryArray('completed_event', tweet_array);
	console.log(completed_tweets.length);
	var user_written = 0;
	var not_written = 0;

	for (var i = 0; i < completed_tweets.length; i++){
		var tw = completed_tweets[i];
		if (tw.written){
			user_written += 1;
		}
		else if (!tw.written){
			not_written += 1;
		}
	}

	if (written){
		return user_written;
	}
	else {
		return not_written;
	}

}


//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});