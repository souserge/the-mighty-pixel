# The Mighty Pixel
A collaborative drawing application

\**comprehensive description should go here*\*

*Server:* http://themightypixel.azurewebsites.net/ <br/>
*Status:* <span style='color:red'>DOWN</span>

## How to test on your local machine:
1. download and install nodejs and npm
2. clone the repo
3. open a terminal in the repo directory
4. run `npm install`
5. run `node server.js` or `npm start`
6. you should see `server is running on PORT: *PORT_NUMBRER*`
7. open `http://localhost:*PORT_NUMBRER*/` in your browser

*NOTE:* If step **4** throws too many errors, try this:
* update npm: `npm install -g npm`
* clean cache: `npm cache clean`

## A quick TODO list:
* [ ] Add a database
* [x] ~~Add a notion of an unfilled pixel (-1 colour value)~~
* [X] Add scaling and dragging instead of scrolling
* [ ] Add adequate UI on draw.html
* [ ] Add colour picker, colour history etc.
* [x] Optimize sending data
* [ ] Optimize drawing the canvas
* [ ] Refactor draw.js
* [ ] Add the possibility of changing palettes
* [ ] Add help messages
