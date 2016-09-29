
# Custom Field Automator 

A tiny Movable Type Plugin to create automatically your custom fields from 
a Google Spreadsheet. Nothing amazing, just retrieving data from Google API, 
storing them in HTML5 Storage and triggering the control panel via javascript.

It's working well, still in alpha. Some translations sentences are missing, can't set 
default value for item stuff, etc... And no message when the process is completed.

[![](http://img.youtube.com/vi/cIKjVE96_S8/0.jpg)](https://www.youtube.com/watch?v=cIKjVE96_S8)

## Install

Just clone the project or download / extract it inside your movable type cgi-bin.

The spreadsheet used in the demo is [available here](https://docs.google.com/spreadsheets/d/15cetnUS8m0ud3iCGuHo5bDEEGzXq0Vl45CF7_G0iFIE/edit?usp=sharing)  
The spreadsheet is in read-only mode so just duplicate it. (Option from the File menu).


## Howto

It's working per blog / website.

1. Select the blog
2. From the left sidebar select _Tools_ then _Plugins_
3. Click _CustomFieldAutomator_ then _Settings_
4. Check _One Time Activation_ and copy-paste your SpreadSheet ID, then save.
5. A confirm panel should appear, choose OK and Rock And Roll

## Troubleshooting

The plugin is just using the browser HTML5 Session Storage. If something is going 
wrong, just close the tab / window and clear your session by typing _sessionStorage.clear()_ 
in the developer console or by restarting your browser or by emptying your history data 
whatever.