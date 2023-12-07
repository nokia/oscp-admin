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
npx devcert-cli generate localhost
```

The `npx devcert-cli generate localhost` command generates `localhost.cert` and
`localhost.key` files that are used as SSL certificates for https during local
development.


Also, adding a `.env` file to the root of the project is required. The format
looks like this:
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

If you want to use The Google Drive Picker to select files, you
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
