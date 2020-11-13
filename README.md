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

Also, adding a .env file to the root of the project is required. The format
looks like this:

## Usage

```
git clone https://github.com/OpenArCloud/oscp-admin
cd oscp-admin
npm install
```

Create .env file with required parameters, ex.
```
AUTH0_DOMAIN = 
AUTH0_CLIENTID = 
AUTH0_AUDIENCE = 
AUTH0_SCOPE = 
```

When you want to use The Google Drive Picker to select files, you
need to add this to your .env file
```
GOOGLE_PROJECT_ID = 
GOOGLE_PICKER_KEY = 
```

Start the local server for development

```
npm run dev
```

Start the server for production
```
npm start
```

Further information about the discovery services can be found here:
- https://github.com/OpenArCloud/oscp-spatial-service-discovery
- https://github.com/OpenArCloud/oscp-spatial-content-discovery


App contains icons from <a href="https://www.zondicons.com/" title="zondicons">Zondicons</a>