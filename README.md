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

Copy `.env.example` to `.env`. For local development without Auth0, point the
app at **browser-reachable** SSD and SCD URLs (they do not have to run on this
machine):

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

## Docker

SSD and SCD are **not** started by this compose file. Run them separately (their
own compose files, or already deployed hosts) and pass their public URLs.

```
docker compose up --build
```

The image is nginx serving the SPA on port 8081 (override with `ADMIN_PORT`).
At container start, `docker-entrypoint.sh` writes `/config.js` from:

- `OSCP_SSD_URL` or `VITE_OSCP_SSD_URL`
- `OSCP_SCD_URL` or `VITE_OSCP_SCD_URL`
- `AUTH_DISABLED` or `VITE_AUTH_DISABLED`

Those URLs are used by the **browser**, so they must be reachable from the
machine that opens the admin UI, not from inside the admin container.

Example against discovery services on another host:

```
OSCP_SSD_URL=https://ssd.example.com OSCP_SCD_URL=https://scd.example.com AUTH_DISABLED=true docker compose up --build
```

`npm run build:docker` / `npm run start:docker` wrap `docker compose build` and
`docker compose up -d`.

App contains icons from <a href="https://www.zondicons.com/" title="zondicons">Zondicons</a>
