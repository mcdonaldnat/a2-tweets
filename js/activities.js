function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	// update the activity information sections
	document.getElementById('numberActivities').innerText = getAllActivityTypes(tweet_array); // 16
	//document.getElementById('firstMost').innerText = getMostActivity(1, tweet_array);
	document.getElementById('secondMost').innerText = 4;
	document.getElementById('thirdMost').innerText = 4;

	getAllActivityTypes(tweet_array);

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": tweet_array
	  }
	  //TODO: Add mark and encoding
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
}

//---- PART 2.1: Determining activity type and distance ----

// get the most acitvity by rank (1 - first, 2 - second, 3 - third)
function getMostActivity(rank, total_array){
	var completed_tweets = getCategoryArray('completed_event', total_array)

	var W_count = 0; // walk
	var R_count = 0; // run
	var B_count = 0; // bike
	var other_count = 0; // other

	for (var i = 0; i < completed_tweets.length; i++){
		var tweet_type = completed_tweets[i].activityType;
		if (tweet_type == "walk"){
			W_count += 1;
		}
		else if (tweet_type == "run"){
			R_count += 1;
		}
		else if (tweet_type == "bike"){
			B_count += 1;
		}
		else if (tweet_type == "other"){
			other_count += 1;
		}
	}
	
	var counts_array = [];
	counts_array.push(map.get("walk"));
	counts_array.push(map.get("run"));
	counts_array.push(map.get("bike"));
	counts_array.push(map.get("other"));
	var counts_sorted = counts_array.sort(); 

	// return based on rank specified
	if (rank == 1){
		return counts_sorted[0];
	}
	else if (rank == 2){
		return counts_sorted[1];
	}
	else if (rank == 3){
		return counts_sorted[2];
	}
	else{
		return "ERROR";
	}


}

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

// return the number of activity types in the whole tweet array
function getAllActivityTypes(tweet_array){
	var type_array = new Set();
	for (var i = 0; i < tweet_array.length; i++){
		type_array.add(tweet_array[i].activityType);
	}

	//type_array.forEach(v => console.log(v));
	//console.log(type_array.size);
	return type_array.size;
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});