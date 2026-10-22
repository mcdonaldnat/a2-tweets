class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        var tweetText = this.text;

        if (this.text == null){
            return "unknown"; // ASK IN SLACK what to return on error
        }
        else if (tweetText.includes("completed") || tweetText.includes("posted")){ // Just completed/posted ...
            return "completed_event";
        }
        else if (tweetText.includes("right now")){ // Watch my run/walk right now ...
            return "live_event";
        }
        else if (tweetText.startsWith("Achieved")){ // Achieved a ...
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
    // Acitvities possibly returned: walk, run, bike, workout, other
    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }

        var use_text = this.text.toLowerCase();

        // if it's user-written, strip the written part of the tweet in case it messes with the activity type
        if (this.written){
            var end_index = this.text.indexOf(" - ");
            use_text = this.text.substring(0, end_index + 3);
        }

        // distance measurement
        if (!(use_text.includes(" km ") || use_text.includes(" mi "))){
            return "unknown"; // exit if we can't find either
        }

        // returns the word in between "km/mi" and "-/with @Runkeeper"
        var start_index = 0;
        var end_index = 0;

        if (use_text.includes(" km ")){
            start_index = use_text.indexOf(" km ");
        }
        else if (use_text.includes(" mi ")){
            start_index = use_text.indexOf(" mi "); 
        }

        if (use_text.includes(" - ")){
            end_index = use_text.indexOf(" - ");
        }
        else if (use_text.includes(" with ")){
            end_index = use_text.indexOf(" with "); 
        }

        if (start_index > end_index){
            return "unknown";
        }

        return use_text.substring(start_index + 4, end_index);
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
        if (distance_mi > 1000){
            //console.log(this.text);
        }
        return distance_mi;
    }

    // returns the day of the week as a string ("Mon, Tue", etc.)
    get dayOfWeek():string{
        // use what we wrote in about.js
        const options:Intl.DateTimeFormatOptions = {
            weekday: "short"
        };

        return this.time.toLocaleDateString("en-US", options); 
    }

    // parse and return just the link portion from the text
    get textLink():string{
        var start_index = this.text.indexOf("https:");
        var end_index = this.text.indexOf("#Run");

        return this.text.substring(start_index, end_index);
    }

    getHTMLTableRow(rowNumber:number):string {
        var link = this.textLink;
        var end_index = this.text.indexOf("https:");
        var last_index = this.text.indexOf("#Run");


        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return `<td>${rowNumber}</td><td>${this.activityType}</td><td>${this.text.substring(0, end_index)}<a href = ${link}>${link}</a>${this.text.substring(last_index)}</td>`;
    }
}