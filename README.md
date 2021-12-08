# **Sample OSCP Admin**

Sample client for _Open Spatial Computing Platform_ (OSCP) for administration 
of spatial service discovery and spatial content discovery.

The OSCP [spatial service discovery (SSD)](https://github.com/OpenArCloud/oscp-spatial-service-discovery)
allows finding spatial services around the current location of the device.
With this tol you can new register services and edit existing services.

The OSCP [spatial content discovery (SCD)](https://github.com/OpenArCloud/oscp-spatial-content-discovery)
can be used to find geolocated content available around the current location of the device.
With this tool, you can add new contents and edit existing contents.

While this application is written using Svelte, the main functional elements
will also be available as Web components, directly usable in many other Web 
frameworks and plain HTML pages. The aim is to use these
components in as many content management environments as possible.

To run this app locally, you need to copy SSL certificates to the root folder
of the project, named `localhost.key` and `localhost.cert`. The information on
this site might be helpful to generate these keys: 
https://matthewhoelter.com/2019/10/21/how-to-setup-https-on-your-local-development-environment-localhost-in-minutes.html

Also, adding a .env file to the root of the project is required. The format
looks like this:

## Usage

```
git clone https://github.com/OpenArCloud/oscp-admin
cd oscp-admin
npm install
```

Create `.env` file with required parameters:
```
OSCP_SSD_URL=
OSCP_SCD_URL=
AUTH0_SSD_DOMAIN= 
AUTH0_SSD_SCOPE= 
AUTH0_SSD_PROVIDER=
AUTH0_SSD_AUDIENCE=
AUTH0_SSD_CLIENTID=
AUTH0_SCD_DOMAIN= 
AUTH0_SCD_SCOPE= 
AUTH0_SCD_PROVIDER=
AUTH0_SCD_AUDIENCE=
AUTH0_SCD_CLIENTID
```

When you want to use The Google Drive Picker to select files, you
need to add this to your .env file
```
GOOGLE_PROJECT_ID = 
GOOGLE_PICKER_KEY = 
```

Start a local server for development
```
npm run dev
```

Start a local server for production
```
npm run startlocal
```

Start a server for production
```
npm run start
```

App contains icons from <a href="https://www.zondicons.com/" title="zondicons">Zondicons</a>
