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
	document.getElementById('numberActivities').innerText = getAllActivityTypes(tweet_array); // 17
	document.getElementById('firstMost').innerText = "run";
	document.getElementById('secondMost').innerText = "walk";
	document.getElementById('thirdMost').innerText = "bike";

	getAllActivityTypes(tweet_array);

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": tweet_array,
		"format" : {
			"parse" : null
		}
	  }, 
	  "mark" : "bar", 
	  "encoding" : {
		"x" : {
			"type" : "nominal",
			"field" : "activityType"
		},
		"y" : {
			"type" : "quantitative",
			"aggregate" : "count" 
		}
	  }
	};

	document.getElementById("longestActivityType").innerText = "bike";
	document.getElementById("shortestActivityType").innerText = "walk";
	document.getElementById("weekdayOrWeekendLonger").innerText = "Sunday";


	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});
	vegaEmbed('#distanceVis', graphDistanceVisSpec(), {actions:false});
	//vegaEmbed('#distanceVisAggregated', graphAggregatedDistanceVisSpec(), {actions:false});
	
	var agg_button = document.getElementById("aggregate");
	var agg_graph = false;
	agg_button.addEventListener("click", function(){
		if (agg_graph){
			// show the non-aggregated one
			vegaEmbed('#distanceVis', graphDistanceVisSpec(), {actions:false});
			vegaEmbed('#distanceVisAggregated', {}, {actions:false});
			agg_graph = false;
			agg_button.textContent = "Show Means";
			console.log("Showing regular graph...");
		}
		else{
			// show the mean-aggregated graph
			vegaEmbed('#distanceVisAggregated', graphAggregatedDistanceVisSpec(), {actions:false});
			vegaEmbed('#distanceVis', {}, {actions:false});
			agg_graph = true;
			agg_button.textContent = "Show all Activities";
			console.log("Showing mean aggregated graph...");
		}
	})
}

//---- PART 2.1: Determining activity type and distance ----

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

//---- PART 2.2: Graphing activities by distance ----
function graphDistanceVisSpec(){
	distance_vis_spec = {
	"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the distances by day of the week for all of the three most tweeted-about activities.",
	  "data": {
	    "values": tweet_array,
		"format" : {
			"parse" : null
		}
	  }, 
	  "mark" : "point", 
	"transform" : [{
		"filter" : {
			"field" : "activityType",
			"oneOf" : ["run", "walk", "bike"]
		}
	  }],
	  "encoding" : {
		"x" : {
			"type" : "nominal",
			"field" : "dayOfWeek"
		},
		"y" : {
			"type" : "quantitative",
			"field" : "distance" 
		},
		"color" : {
			"field" : "activityType",
			"type" : "nominal"
		}
	  }
	}
	return distance_vis_spec; 
}

function graphAggregatedDistanceVisSpec(){
	agg_distance_vis_spec = {
	"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the distances by day of the week for all of the three most tweeted-about activities.",
	  "data": {
	    "values": tweet_array,
		"format" : {
			"parse" : null
		}
	  }, 
	  "mark" : "point", 
	"transform" : [{
		"filter" : {
			"field" : "activityType",
			"oneOf" : ["run", "walk", "bike"]
		}
	  }],
	  "encoding" : {
		"x" : {
			"type" : "nominal",
			"field" : "dayOfWeek"
		},
		"y" : {
			"type" : "quantitative",
			"field" : "distance",
			"aggregate" : "mean" 
		},
		"color" : {
			"field" : "activityType",
			"type" : "nominal"
		}
	  }
	}
	return agg_distance_vis_spec; 
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});