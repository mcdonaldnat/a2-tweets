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
        else if (tweetText.startsWith("watch my run")){ // Watch my run right now ...
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
        //TODO: identify whether the tweet is written
        return false;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        return "";
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        return "";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}