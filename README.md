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

Auth0 stays optional. When `VITE_AUTH_DISABLED` is not `true`, fill in the `VITE_AUTH0_*` variables from `.env.example`. The scope values request the discovery-service permissions:

```
VITE_AUTH0_SSD_SCOPE="read:ssrs create:ssrs delete:ssrs update:ssrs"
VITE_AUTH0_SCD_SCOPE="read:scrs delete:scrs update:scrs create:scrs"
```

For local HTTPS, uncomment `basicSsl()` in `vite.config.js`, then run `npm run dev`.

Google Drive picker and the PeerJS geopose check stay disabled until their `VITE_GOOGLE_*` and `VITE_PEERJS_*` values are set.

Start the dev server. It listens on port **8033** (`http://localhost:8033`):

```
npm run dev
```

`npm start` runs the same dev server. Build and preview a production bundle on the same port:

```
npm run build
npm run preview
```

## Docker

SSD and SCD are not started by this compose file. Run them separately (their own compose files, or already deployed hosts) and pass their browser-reachable URLs.

Copy `.env.example` to `.env`. `.dockerignore` excludes `.env`, and the image build does not bake `VITE_*` values into the bundle. At container start, `docker-entrypoint.sh` writes `/usr/share/nginx/html/config.js` from the process environment. Nginx listens on port **80** inside the container.

For each setting, the entrypoint uses the first non-empty value:

| Written into `config.js` | First choice | Second choice |
|---|---|---|
| SSD URL | `OSCP_SSD_URL` | `VITE_OSCP_SSD_URL` |
| SCD URL | `OSCP_SCD_URL` | `VITE_OSCP_SCD_URL` |
| Auth disabled | `AUTH_DISABLED` | `VITE_AUTH_DISABLED` |
| Auth0, Google Drive, PeerJS | the matching `VITE_*` name from `.env.example` | none |

Those SSD and SCD URLs are used by the **browser**, so they must be reachable from the machine that opens the admin UI, not from inside the admin container. `http://localhost:8031` is correct when the browser and the discovery services are on the same host.

`AUTH_DISABLED=true` (or `VITE_AUTH_DISABLED=true`) skips Auth0. The discovery services must then run with `AUTH_REQUIRED=false`. When auth is enabled, the `VITE_AUTH0_*` variables must be in the container environment or the login redirects have empty client ids.

### docker compose

From the project directory (the folder that contains `docker-compose.yaml` and `.env`):

```
docker compose up --build -d
```

That build is tagged `oscp/oscp-admin:latest`.

Compose reads `.env` twice:

- `env_file: .env` injects every variable into the container, including the `VITE_AUTH0_*`, `VITE_GOOGLE_*`, and `VITE_PEERJS_*` values.
- The `environment` block sets `OSCP_SSD_URL`, `OSCP_SCD_URL`, and `AUTH_DISABLED`. Each one prefers an `OSCP_` / `AUTH_DISABLED` value from `.env`, then the `VITE_*` name, then `http://localhost:8031`, `http://localhost:8032`, and `true`. A value set here overrides the same name coming from `env_file`.

`ADMIN_PORT` is only the host port mapped to container port 80. It defaults to **8033** and is not read by the app. Override it in the shell or in `.env` (`ADMIN_PORT=8080`), then run `docker compose up --build -d` again.

`npm run build:docker` and `npm run start:docker` are `docker compose build` and `docker compose up -d`.

To point the UI at discovery services on another host, set the URLs in `.env` and recreate:

```
OSCP_SSD_URL=https://ssd.example.com
OSCP_SCD_URL=https://scd.example.com
AUTH_DISABLED=true
```

```
docker compose up --build --force-recreate -d
```

### docker run

```
docker build -t oscp/oscp-admin:latest .
docker run -d --name oscp-admin --env-file .env -p 8033:80 oscp/oscp-admin:latest
```

`--env-file .env` is required. A `.env` that only uses the `VITE_*` names from `.env.example` is enough: the entrypoint accepts those names. `-e` overrides one variable from the file, which is how to point at other hosts without editing `.env`:

```
docker run -d --name oscp-admin --env-file .env -e OSCP_SSD_URL=https://ssd.example.com -e OSCP_SCD_URL=https://scd.example.com -e AUTH_DISABLED=true -p 8033:80 oscp/oscp-admin:latest
```

The published host port is the left side of `-p`. The right side stays `80`. Stop and remove the container with `docker rm -f oscp-admin`.

App contains icons from <a href="https://www.zondicons.com/" title="zondicons">Zondicons</a>
