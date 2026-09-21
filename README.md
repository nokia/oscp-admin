# **Sample OSCP Admin**

Sample client for _Open Spatial Computing Platform_ (OSCP) for administration
of spatial service discovery and spatial content discovery.

The OSCP [spatial service discovery (SSD)](https://github.com/OpenArCloud/oscp-spatial-service-discovery)
allows finding spatial services around the current location of the device.
With this tool you can register new services and edit existing services.

The OSCP [spatial content discovery (SCD)](https://github.com/OpenArCloud/oscp-spatial-content-discovery)
can be used to find geolocated content available around the current location of the device.
With this tool, you can add new contents and edit existing contents.

This application is a Svelte app. It uses the published `@oarc/ssd-access` and `@oarc/scd-access` packages for HTTP access to the discovery services.

## Usage

```
git clone https://github.com/OpenArCloud/oscp-admin
cd oscp-admin
npm install
```

Copy `.env.example` to `.env`. For local development without Auth0:

```
VITE_AUTH_DISABLED=true
VITE_OSCP_SSD_URL=http://localhost:8031
VITE_OSCP_SCD_URL=http://localhost:8032
```

Auth0 stays optional. When `VITE_AUTH_DISABLED` is not `true`, fill in the `VITE_AUTH0_*` variables from `.env.example`.

For local HTTPS, uncomment `basicSsl()` in `vite.config.js`, then run `npm run dev`.

Google Drive picker and the PeerJS geopose check stay disabled until their `VITE_GOOGLE_*` and `VITE_PEERJS_*` values are set.


Start the dev server:

```
npm run dev
```

`npm start` runs the same dev server. Build and preview a production bundle:

```
npm run build
npm run preview
```

App contains icons from <a href="https://www.zondicons.com/" title="zondicons">Zondicons</a>
