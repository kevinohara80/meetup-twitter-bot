# meetup.com twitter follow bot

This is a simple node.js app that polls your [meetup.com](http://www.meetup.com) group and follows any of your members with a Twitter account from your Twitter account. The app contains the files necessary to run this on Heroku as well as locally.

## Setup

1. Clone this repo and install dependencies with `npm install`
2. [Register your app with Twitter.com](https://dev.twitter.com/apps/new)
3. [Get a meetup.com API key](http://www.meetup.com/meetup_api/key/)
4. Set the environment variables. See the env.sh file for the environment variables that need to be set. You can run this script once edited to set the variables.

## Running locally

After setting the environment variables...

```bash
$ node app.js -p 60
```

The `-p` flag specifies the polling interval in minutes.

## How to use on Heroku

1. Edit the heroku.sh file and enter the proper credentials and information for meetup.com and twitter
2. [Create your node.js app on Heroku using the cedar stack](https://devcenter.heroku.com/articles/nodejs)
3. Run the heroku.sh bash script
4. Deploy and scale up the bot process
