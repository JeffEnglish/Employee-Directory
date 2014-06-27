Employee-Directory
==================

**(WORK IN PROGRESS)**

Sample project utilizing angularJS, node.js, and mongodb. Eventually utilizing ionic framework for the
mobile application.

Based on the excellent tutorial and application created by Sahat Yalkabov:
http://www.tweetganic.com/a/225759

Setup server:

	1. Install node modules
		npm install
	2. Start mongo server
		mongod
	3. Start server
		node server.js

Setup web site:

	1. Change to public folder
		cd public
	2. Install components
		bower install

*NOTE* angular-messages is required but is only available as a beta at this time. So you will need to install it separately.

		bower install angular-messages

Display home page:

	1. Open browser and navigate to localhost at port 3001
		http://localhost:3001
		
