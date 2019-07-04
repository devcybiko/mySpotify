# Spotify Sample Code

This is a sample project for a simple Spotify API. The most difficult part is the oAuth authentication with Spotify. There are at least three scenarios for authenticating with Spotify - two of them are for server-side apps. This sample code works in the browser only.

See the Spotify Docs on [Implicit Grant Flow](https://developer.spotify.com/documentation/general/guides/authorization-guide/#implicit-grant-flow) for more details.

The `spotify.js` file in the `assets/js` folder is all you need to use Spotify in the browser.

You'll have to _white list_ your web pages (see ##spotify.login) and also run a local webserver to test your pages locally.

## Running the local `server.js`

Spotify won't allow files served directly from the file system to be _white listed_ (URLs that start with **file:///**, for example). So I've written a very small file server for you.

You have to initialize the software. If you haven't already, install _npm_ and _node_ on your computer. You can tell if you have them by typeing the following:

```bash
$ node --version
v12.4.0
```
If you don't have that go here: [Nodejs.org](https://nodejs.org/en/)

Next, you'll have to initialized the software:

```bash
$ npm install
```

Finally, run the local server:

```bash
$ node server.js
server is listening on 80
```

If you see errors like this:

```bash
$ node server.js
events.js:177
      throw er; // Unhandled 'error' event
      ^
Error: listen EADDRINUSE: address already in use :::80
```

You have a server already running on port 80. You can go into the `server.js` and change the `80` to some other port number (like `8888`) - but make sure `server.js` isn't running somewhere else on your machine first!

Now, you can access all the pages in your project (at the same directory folder as the `server.js` file) with the URL...

http://localhost/__yourfilename__.html

NOTE: If you are using a different port number (like `8888`) the URL will look like this:

http://localhost:__8888__/yourfilename.html


## spotify.js

`spotify.js` depends on JQuery to function. So be sure you've included `jquery.js` (see the `index.html` file included in the project as a sample).

Include the `spotify.js` file into your `.html` file using the usual way:

```html
<script type="text/javascript" src="assets/js/spotify.js"></script>
```

## spotify.login()

None of the `spotify.js` functions will work until the user logs in to Spotify.com. You can offer a Login Button on your app, or just call the login function at the start of the app.

You'll have to register as a developer at Spotify's website. And, you'll have to create an `app`. The instructions are at [Spotify's Developer](https://developer.spotify.com/documentation/general/guides/app-settings/#register-your-app) page.

You can use whatever app name you like (and create as many apps as you like). But you'll also have to _white list_ all your URLS. This is a [PITA](https://www.urbandictionary.com/define.php?term=pain%20in%20the%20ass) because you have to register EVERY URL - _both on your localhost and in your Github.io domain_.

When you create an app, you'll also get a `clientId` that is your ticket to use the Spotify API for free. You'll need to pass that into the spotify.login() function.

You'll also have to pass in the "callbackURL". This is any page in your website. But I recommend you just use the current page - which is the `window.location.href` as seen in the sample code below.

```html
<button onclick="myLogin()">Login</button><br />
```
```javascript
function myLogin() {
    var clientId = 'ae735174e6d74af294e078eeeaa6e5c6'; // from https://developer.spotify.com/dashboard/applications
    var callbackURL = window.location.href; // the current web page
    spotify.login(clientId, callbackURL);
}
```

**Don't be surprised when your webpage redirects to Spotify's login page.** Once the user logs in, the user will be redirected back to your site.

The `spotify.js` code will grab the `access_token` from the URL and store it in a cookie for safe keeping. From here on out, you're done with Spotify's oAuth authentication. The `spotify.js` will handle the oAuth details under the covers.

## spotify.logout()

You can force the user to logout of the app by calling `spotify.logout()`. It doesn't do much more than delete the `access_token` cookie so that all future calls will fail.

There's no need to call `spotify.logout()` unless you really want to.

```html
<button onclick="myLogout()">Logout</button><br />
```
```javascript
function myLogout() {
    spotify.logout();
}
```
## spotify.call()

The `spotify.call()` function is a very thin wrapper around the `$.ajax()` call that embeds the `access_token` into the Spotify API headers. You'll use this to call all the Spotify APIs.

You have to provide the `apiURL`, the `data` the api requires (as a JavaScript object) and a `callbackFunction` that will get the returned data as a parameter. If an error occurs, an `alert()` will be displayed showin you the error. 

_Alerts_ are frowned upon as part of the UI. If you like, you can edit the `spotify.js` code and comment out the `alert()` on line 81. But it does come in handy when the cookies expires or if the user forgets to login.

```html
<button onclick="mySearch('depeche mode')">Depeche Mode</button><br />
<button onclick="mySearch('weird al')">Weird Al</button><br />
```
```javascript
function myCallback(data) {
    $('#main').html('<p>' + JSON.stringify(data) + '</p>');
}

function mySearch(searchTerms) {
  $('#main').html('');
  spotify.call(
    'https://api.spotify.com/v1/search',
    { q: searchTerms, type: 'track,artist', market: 'US', limit: '10', offset: '0' },
   myCallback);
}
```

## Spotify APIs

The best way to fine the Spotify APIs is to check out the [Spotify Console](https://developer.spotify.com/console/) page. You can actually test each API and figure out what values to pass in and what results you'll get back.

## White Listing your URLs

### Local Host URLs

Go to the [Spotify Dashboard](https://developer.spotify.com/dashboard/applications) and click on your application. Then, click on the green `Edit Settings` in the upper-right corner of the screen. Under the "Redirect URIs" section you have to list every page that is going to call the Spotify API - **EXACTLY** as it will appear in the user's browser.

For example you should include this URL:

http://localhost/__yourfilename__.html

AND, if you are using a special port number (say `8888`)...

http://localhost:__8888__/yourfilename.html

You'll have to do this for EVERY page that will call Spotify APIs.

### Github Pages URLs, TOO!

You have to also include your Github Pages URLs, too. When you deploy your apps to production, your URLs change. So be sure to __White List__ them, too.

`https://devcybiko.github.io/mySpotify/`

as well as each page by name

`https://devcybiko.github.io/mySpotify/index.html`

### AN ALTERNATIVE:

The alternative would be to __white list__ only your github pages and constantly PUSH to your master branch. Worth thinking about.
