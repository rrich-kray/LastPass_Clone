
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
- Add password reset
- Password hashing


WIP
- Password confirmation.
	- Backend:
		- Add account confirmed property to user model.
	- To current login/register route: if AccountConfirmed = false, redirect user to a page that tells them this. Or can add another table with UserId and Account confirmed flag
		- Will require a component that governs access to Main Page. Maybe could use current AccessLoginRegister component
	- Enter information, hits route that sends email. Can create an email service from existing reset password code to do this
	- User hits link, 

TODO
- Improve security of app
	- Hash password prior to entry into the Db - Done
- Refactor
	- Make application faster
	- Make application more scalable
- 2FA authentication.
- If it wouldn't be a security concern, can add exporting functionality. Export the passwords as CSV, Excel, etc...
- Most recent sorting. This will require adding creation/update dates to entities on backend, and modifying frontend to send back update dates/times
- Refactor main page. Tile creation in particular
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