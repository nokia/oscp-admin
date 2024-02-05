# **Sample OSCP Admin**

Sample client for _Open Spatial Computing Platform_ (OSCP) for administration
of spatial service discovery and spatial content discovery.

The OSCP [spatial service discovery (SSD)](https://github.com/OpenArCloud/oscp-spatial-service-discovery)
allows finding spatial services around the current location of the device.
With this tool you can register new services and edit existing services.

The OSCP [spatial content discovery (SCD)](https://github.com/OpenArCloud/oscp-spatial-content-discovery)
can be used to find geolocated content available around the current location of the device.
With this tool, you can add new contents and edit existing contents.

While this application is written using Svelte, the main functional elements
will also be available as Web components, directly usable in many other Web
frameworks and plain HTML pages. The aim is to use these
components in as many content management environments as possible.


## Usage
```
git clone https://github.com/OpenArCloud/oscp-admin
cd oscp-admin
npm install
```

Also, adding a `.env` file to the root of the project is required. The format
looks like this:
```
VITE_OSCP_SSD_URL=
VITE_OSCP_SCD_URL=
VITE_AUTH0_SSD_DOMAIN=
VITE_AUTH0_SSD_SCOPE=
VITE_AUTH0_SSD_PROVIDER=
VITE_AUTH0_SSD_AUDIENCE=
VITE_AUTH0_SSD_CLIENTID=
VITE_AUTH0_SCD_DOMAIN=
VITE_AUTH0_SCD_SCOPE=
VITE_AUTH0_SCD_PROVIDER=
VITE_AUTH0_SCD_AUDIENCE=
VITE_AUTH0_SCD_CLIENTID
```

For local development uncomment the line containing `//basicSsl(),` in `vite.config.js`. This enables https when running the service locally using `npm run dev`

If you want to use The Google Drive Picker to select files, you
need to add this to your .env file
```
VITE_GOOGLE_PROJECT_ID =
VITE_GOOGLE_PICKER_KEY =
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
