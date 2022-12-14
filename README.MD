
# Chat App
## Github Link - https://github.com/ChristopherLinnett/SoftwareFrameworksChatApp
---
## Git

## Git Layout
The git repository contains the project folder, a readme file and the server folder. The default branch is called master.

## Version Control Approach
When developing, a commit is added whenever a small feature is added, a milestone or functionality of a new function has been implemented. For most of the project, this was done in the main branch but for a few larger features, seperate branches were created then merged back into the main branch. These were the selection screen, this was a large feature that displayed the groups/channels and empowered group assistants, then had its own modal. Then the admin functions. This constituted most of the functionality for this project, next was the chat selection page. This routed the user to the correct room and displayed its information, Then the addition of image functionality, which allwed for users to add image messaging as well as updating the profile image.
then finally for adding peer, which allowed for video chatting functionality.
___
## Data Structures


The main data structures in this app are users, groups, rooms, superuser, groupuser.

Users is an object that is callable by the username. You will be able to access a user object by using the property that is equal to the name of that user.

Groups is an array of group objects. These objects contain a name, id, a rooms array, a list of userids that have permission to access and an array of userids that are assistants for that group.

Rooms is an array of room objects that consists of a name, id and a userid list of allowed users

Message is an object that contains the message text, user info, the room it was sent in, the profile picture of the sender, its date being sent.

Image message is similar to message, except it contains an image filename instead of message text.

GroupAdmins is a database collection containing the IDs of all Users who are groupadmins
SuperAdmins is a database collection containing the IDs of all users who are superadmins


___
## REST API
___
### usercheck
this POST method has the purpose of taking either a username or email, (finding the username from the database if its an email) getting all the users details including the channels/groups they have access to, then sending it back. This method is for admins accessing/modifying user roles
___
### auth
this POST method accepts a username and password, checks them against entries in the database. If they match, sends back relevant user information including which groups/rooms they have access to.
___
### newuser
this POST method accepts a username and email. It takes, these. generates a unique user ID, then saves the user to the database before sending back a success/fail message.
___
### deleteuser
This POST method accepts a username, it deletes that user from the database then sends back a success message
___
### updaterole
this POST method accepts a username, the old role, and the new role. It modifies the role for the user in the database then sends back a success message
___
### getgroups
this GET method returns the groups object. This is for admin use when doing user/group editing.
___
### inviteremoveuser
this POST method accepts a username, groupid and add boolean. if this add boolean is true, the method adds this user to that group. If it is false, it will remove this user from that group
___
### newordeletegroup
this POST method accepts a groupid, groupname and add boolean. If the boolean is true, the group name will be combined with a new unique id to generate a new group. If the boolean is false, the group id will be used to delete the group. then send back a success message
___
### newordeleteroom
this POST method accepts a creator, room name, room id, groupid and add boolean. If the boolean is true, a new room will be created within the group with the corresponding groupid. the room name will be assigned, a unique ID will be assigned, the creator will be added its users then a success message will be sent back
___
### inviteremoveroom
this POST method accepts a username, groupid, roomid, and add boolean. if the boolean is true, the user will be added to that room within that group. sends back a success message
___
### createordeleteassist
this POST method accepts a userid, groupid and add boolean. If the boolean is true, the user corresponding to the id, will be added to the group that corresponds with that group. They will then have access to the group assistant privelidges for that group only.
if add is false, the user will be removed instead of added, taking away those privelidges.
___
### getroomusers
this POST requests accepts a groupid and roomid, it uses them to build an array of objects holding corresponding userids and usernames that have access to that room. This is used for the assistant managing users from their user management modal.
___
### Photoupload
This route parses an incoming image buffer and builds an image from it. The image is then assigned a unique filename and saved to the server image directory. The API checks whether it was a chat message or a profile image. If its a chatmessage, the file name is sent back to be displayed by the front end and further processing.
If its a profile image, the database users profile image is updated to the new file name from this file
___
### Getroommessages
this route queries the database for all messages within the room passed in with the request. It then returns an array with the last 10 messages sent in that room.
___
___
## Socket Events
### Message/Image
sends back a message containing either a chat message or image message datatype
### JoinRoom/LeaveRoom
sends a message to the room with the username and join/leave status
### Disconnect
triggers a leaveroom

### ChatReq 
sends a users name and id to another user in the room. The front end handles this, sending back a ConfirmChat if successful

### ConfirmChat
returns information back to the sender about the response. Front end triggers a call for both the sender and receiver of this request.

## Angular Architecture
___
# Pages/Components
This Angular app has four main pages. They are as follows 

## Admin
This page contains the controls for super and group level admins to do all their tasks. They are able to access all users, groups, channels and make changes from this page. It conditionally renders different controls based on their selections and is updated from the server after every change is made. 
___
## Auth
This page holds the login screen, it is the simplest page within the application, holding only the form that will upon successful login remove the AUTHGUARD blocking the next page's access.
___
## Chat
This page holds the chat window. It has a logout button, admin button for admins, and chat controls at the bottom. It programatically displays different messages that are sent and managed through the socket service. 
## VideoChat
This is a child of the chat page. This page is solely hosts the two videos of the caller and recipient for use within PeerJs
___
## Selection
This page holds the navigation options for the user. Upon logging in the use will be directed to this page where they will see dropdown boxes that are corresponding to their access. They will only see groups they are connected to, then within those groups they will see rooms they have access to.  This page also has a login button.
If the user is a group assistant for any pages, they will have a a button to enable the creation or deletion of rooms after expanding the group. 
### For each room they will also have a button that enables a modal for adding and removing users from this room.
When clicking on the name of any of the rooms, the user will be directed to the chat page for the corresponding room.

## Profile
This page allows for the editing of user details. In its current form it shows the current users unique information and allows for the updating of the profile image.

___
# Services
This app has few shared services for use by multiple pages/components. These are as follows

### Auth Service
this service logs in the user then holds relevant data about this user as well as the logged in status. This holds functions for logging out as well as methods for getting specific pieces of data about the logged in user

### Socket Service
This service provides a connection the server's websocket. It manages the initialisation and the sending of messages as well as receiving the new messages from the server and providing a method to other pages for taking this information.

### Auth Guard
This guard prevents navigation to other pages while the user has not been logged in. Until the authservice returns a loggedin status this guard will route a user back to the authentication page.

### Image Service
Handles everything image related. It connects to the device's camera. Saves the image to base64 in local storage. also handles uploading to the server to be handled there, and sends prompts as to the purpose of the image, ie. for chat message or profile picture upload

## HttpService
Handles all the backend routes, sends and receives requests to the server. This holds the current IP address and is sourced by all services and pages that require access to any backend

## Peer Service
This service acts as the pathfinder between two users with the app. It will connect video chat between the two without actually directing the chat through the server.
