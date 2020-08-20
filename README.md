# **Sample OSCP Admin**

Sample client for _Open Spatial Computing Platform_ (OSCP) spatial service and 
spatial content discovery administration.

The spatial service discovery (SSD) allows finding spatial services around the 
current location of the device. One of such services could be a GeoPose service, 
providing the GeoPose of the current device.

The spatial content discovery (SCD) can be used to find geolocated content 
available around the current location of the device. 

While this application is written using svelte, the main functional elements
will also be available as web components, directly usable in many other web 
frameworks and plain HTML pages. The aim is, that it's possible to use these
components in as many content management environments as possible.

What's available so far is in a very early stage, missing most of the planned
functionality. Feedback, suggestions and (any sort of) contributions are very welcome.

To run this app locally, you need to copy SSL certificates to the root folder
of the project, named localhost.key and localhost.cert. The information on
this site might be halpful to generate these keys: 
https://matthewhoelter.com/2019/10/21/how-to-setup-https-on-your-local-development-environment-localhost-in-minutes.html
