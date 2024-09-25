
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

WIP
- Fix error in which, upon registration/app start and subsequent initial main page load, UserId is not being sent in payload in creation or update requests. Likely something to do with state being set in App.tsx. It is undefined on initial page load, after refresh is fine
- Add sorting to main page - all tiles sorting currently works, category sorting does not


TODO
- Add button to collapse all category sections, if it is sorted as such
- Add list view
- Add smaller tiles toggle
- Add favorites
- ensure that clicking on box takes user to website. When you hover over the tile, shows a launch button
- Add sharing functionality
- Ability to add attachments
- Ability to delete multiple items at once