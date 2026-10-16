class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        var tweetText = this.text.toLowerCase();

        if (this.text == null){
            return "miscellaneous"; // ASK IN SLACK what to return on error
        }
        else if (tweetText.includes("completed") || tweetText.includes("posted")){ // Just completed/posted ...
            return "completed_event";
        }
        else if (tweetText.includes("right now")){ // Watch my run/walk right now ...
            return "live_event";
        }
        else if (tweetText.startsWith("achieved")){ // Achieved a ...
            return "achievement";
        }
        else{
            return "miscellaneous"; // anything else
        }
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        if (this.text.includes(" - ")){
            return true;
        }
        return false;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        
        var start_index = this.text.indexOf(" - "); 
        var end_index = this.text.indexOf("http");

        return this.text.substring(start_index + 2, end_index);
    }

    // All acitvities: walk, run, bike, swim, yoga, actvity, hike, pilates session, skate, 
    // workout (crossfit, stairmaster/stepwell, strength, elliptical, core)
    // Acitvities possibly returned: walk, run, bike, other
    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }

        var use_text = this.text.toLowerCase();

        // if it's user-written, strip the written part of the tweet in case it messes with the activity type
        if (this.written){
            var end_index = this.text.indexOf(" - ");
            use_text = this.text.substring(0, end_index);
        }

        if (use_text.includes(" run ")){
            return "run";
        }
        else if (use_text.includes(" walk ")){
            return "walk";
        }
        else if (use_text.includes(" bike ")){
            return "bike";
        }
        else{
            return "other";
        }
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }

        var use_text = this.text.toLowerCase();

        // if it's user-written, strip the written part of the tweet in case it messes with the activity type
        if (this.written){
            var end_index = this.text.indexOf(" - ");
            use_text = this.text.substring(0, end_index);
        }

        var distance_str = "";
        var distance_mi = 0;

        // check if the text includes a distance unit (km or mi)
        if (use_text.includes(" km ")){
            var start_index = use_text.indexOf("ed a ") // Just completed/posted a #.## mi/km run/walk/bike
            var end_index = use_text.indexOf(" km ");
            distance_str = use_text.substring(start_index + 5, end_index)
            distance_mi = parseFloat(distance_str) * 1.609;
        }
        else if (use_text.includes(" mi ")){
            var start_index = use_text.indexOf("ed a ") // Just completed/posted a #.## mi/km run/walk/bike
            var end_index = use_text.indexOf(" mi ");
            distance_str = use_text.substring(start_index + 5, end_index)
            distance_mi = parseFloat(distance_str)
        }
        return distance_mi;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}