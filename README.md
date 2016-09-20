![Gull-twitch-utility](https://raw.githubusercontent.com/mick0n/gull-twitch-utility/master/src/public/gull.png "Gull-twitch-utility")
# Gull - Twitch utility
This is a utility that should be used when streaming to show notifications and chat.  
In its current state it's not meant to be a general purpose tool, but that may change in the future.  

## Installation
### Prerequisites
* Node.js version >4.0.0
* A streaming tool capable of showing web content (For example Open Broadcaster Software)

### Configuration
Configuration is done in the file `config.js`. You need to create an application clientID through twitch.tv as well as generate an oauth token for twitch IRC.

## Index-page
Used on stream to show notifications and chat messages. Keep in mind that when using it on stream it should cover the entire screen. (this is to ensure correct centering)

## Util-page
This page is meant to be used on a secondary screen, preferably a tablet or mobile phone.  
It will display all events in a descending list to easily see what's going on in your stream.  
To remove an event from the list, simply swipe it off screen.