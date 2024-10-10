
Completed
- Reformat edit/new/view dialogue boxes - done for now
- add grouping by category to main page - done
- Add displaying items by type - done
- Add folders - Done, categories are basically folders
- Fix tile loading - Done
- Fix entity validation on 
- Ensure that models are more accepting of different user inputs like blanks, wrong types etc.
- Add user authentication 
- fix scroll issue with tables
- Create single file for CreationUpdate modal formatting
- Fix issue in which first category selection has an ID of 0 and is causing a FK constraint error
- Fix issue in which tiles are not displaying in categories
- Fix grid issue when only tiles are displayed and there are not enough tiles for two rows. Large gap between first and second row
- Fix length of note content error
- Fix null reference error that ModelBindingErrorLogger is throwing - needed to instantiate ControllerResponse class with new list, otherwise it was looking for a list and finding nothing
- Fix error in which, upon registration/app start and subsequent initial main page load, UserId is not being sent in payload in creation or update requests. Likely something to do with state being set in App.tsx. It is undefined on initial page load, after refresh of main, is fine
- fix tiles to show appropriate image
- Fix tile coloring
- Fix arrow direction
- Add hover button to tiles
- Fix type filtering. Going from all items to any other is correct, going from say passwords to notes does not work, nothing shows. Problem is that new request for all items is not performed when currentType is changed, your continuing to filter down the same set of data
- Fix tile icons. One is a password that is displaying as a note. Somthing wrong with GetCategoryIcon logic
- Add persistent storage.

WIP

TODO
- Add password reset and password confirmation
	- Reset:
		- Will require email service.
			- Need an SMTP server (possibly). Can set up on localhost, but this won't work when I deploy. Need a third party smtp service
			- Could also use the Gmail API it seems. Can use Gmail.Builder() with supplied credentials as the service to send the email. This will send an email from one address to another. 
				- Think this is the way to go. 
				- Created an app password that allows another service to access my gmail, will use this to access smtp.gmail.com with my email account. Could maybe create a separate account solely for this purpose
				- According to Google, "If you connect using SSL or TLS, you can send email to anyone inside or outside of your organization using smtp.gmail.com as your SMTP server.".
		- User provides email and hits reset button, request hits a route that first checks if the email exists in the database, then generates a token/guid using the userId associated with email, and sends that token to the users email in a link to the change password page. This token will be stored in a table along with its expiration datatime
		- Link will hit another route that verifies the token is still valid by checking the database and its expiration, and sends it back. Frontend will have the secret required to decode the key, use that to decode, this will grant access to the change password page.
		- Change password page 
- Add sorting to main page - need most recent. This will require adding creation/update dates to entities on backend, and modifying frontend to send back update dates/times
- Refactor main page
- Add account settings
- Add configuration file to store things like URLs
- Update formatting of loading page. Add nice animation
- Add button to collapse all category sections, if it is sorted as such
- Add list view
- Add smaller tiles toggle
- Add favorites
- ensure that clicking on box takes user to website. When you hover over the tile, shows a launch button
- Add sharing functionality
- Ability to add attachments
- Ability to delete multiple items at once