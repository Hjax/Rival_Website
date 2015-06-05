/******************************************************************************
This script file is fully document to teach the reader exactly how login and 
logout procedures using the twitch api work.
By William Banks
******************************************************************************/

// Applications must be first registered with twitch to retrieve the below clientId.
// Applications are authorized at this url. http://www.twitch.tv/kraken/oauth2/clients/new
window.CLIENT_ID = 'j06jxud39h2oh61i3l2sy22onmqq712'

// ensure that the DOM is fully loaded before attempting to do any jQuery else will result in 'undefined' errors
// as jQuery would be attempting to access DOM elements that have not been rendered yet. The Twitch API has a 
// dependency on jQuery and will not function without it.
$(document).ready(function(){
	// initialize the twitch api with the authorized client ID
	Twitch.init({clientId: CLIENT_ID}, function(error, status){
		checkAuthStatus() // refer to the method below
	}); // Twitch.init()
	
	// using jQuery this will, on click, call the login method from the twitch api
	// prompting the user to log into their twitch account and authorize our "application"
	// to make twitch api calls on the users behalf. 

	$('.twitch-connect').click(function(){ // this line is like an event listener and handler combined into one line.
		Twitch.login({
			scope: ['user_read', 'channel_read']
		}); // Twitch.login()
		checkAuthStatus()
	}) // click()
	
	$('.logout').click(function(){
		Twitch.logout(function(error){
			// you can do stuff in here, like if there's an error you could log it / catch it so the user doesn't see some fucked up shit, I'm just going to disable the logout button and re-enable the login button here.
			$('.twitch-connect').show()
			$('.logout').hide()
			checkAuthStatus()
		}); // Twitch.logout()
	}) // click()
	
	
	// Reusable method for checking the authentication status of a user, mostly self-describing.'
	// Quick note about twitch authentication, once the user has authenticated for the first time,
	// an auth token is generated and stored in their local session storage. As long as that token
	// is present they will not have to re-enter their login information when clicking the connect
	// button. The 'Twitch.getToken' method can retrieve their auth token from storage.
	function checkAuthStatus()
	{
		var status = false;
		// get the status object
		Twitch.getStatus(function(err, status) {
			
			// check the status object and respond appropriately
			if(status.authenticated)
			{
				$('.twitch-connect').hide()
				$('.logout').show()
				$('.loginStatus').text("Login Status: Authenticated");
				status = true;
			}
			else
			{
				$('.twitch-connect').show()
				$('.logout').hide()
				$('.loginStatus').text("Login Status: Unauthenticated");
				status = false;
			}
		}); // Twitch.getStatus()
		
		// return status if context sensitive action(s) are required.
		return status;
	} // checkAuthStatus()
}); // (document).ready 