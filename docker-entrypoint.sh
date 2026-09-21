#!/bin/sh
set -e

CONFIG=/usr/share/nginx/html/config.js

js_escape() {
    printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'
}

pick() {
    for value in "$@"; do
        if [ -n "$value" ]; then
            printf '%s' "$value"
            return 0
        fi
    done
    return 0
}

ssd_url=$(pick "$OSCP_SSD_URL" "$VITE_OSCP_SSD_URL")
scd_url=$(pick "$OSCP_SCD_URL" "$VITE_OSCP_SCD_URL")
auth_disabled=$(pick "$AUTH_DISABLED" "$VITE_AUTH_DISABLED")

cat > "$CONFIG" <<EOF
window.__OSCP_CONFIG__ = {
  VITE_OSCP_SSD_URL: "$(js_escape "$ssd_url")",
  VITE_OSCP_SCD_URL: "$(js_escape "$scd_url")",
  OSCP_SSD_URL: "$(js_escape "$ssd_url")",
  OSCP_SCD_URL: "$(js_escape "$scd_url")",
  VITE_AUTH_DISABLED: "$(js_escape "$auth_disabled")",
  AUTH_DISABLED: "$(js_escape "$auth_disabled")",
  VITE_AUTH0_SSD_DOMAIN: "$(js_escape "$VITE_AUTH0_SSD_DOMAIN")",
  VITE_AUTH0_SSD_CLIENTID: "$(js_escape "$VITE_AUTH0_SSD_CLIENTID")",
  VITE_AUTH0_SSD_AUDIENCE: "$(js_escape "$VITE_AUTH0_SSD_AUDIENCE")",
  VITE_AUTH0_SSD_SCOPE: "$(js_escape "$VITE_AUTH0_SSD_SCOPE")",
  VITE_AUTH0_SSD_PROVIDER: "$(js_escape "$VITE_AUTH0_SSD_PROVIDER")",
  VITE_AUTH0_SCD_DOMAIN: "$(js_escape "$VITE_AUTH0_SCD_DOMAIN")",
  VITE_AUTH0_SCD_CLIENTID: "$(js_escape "$VITE_AUTH0_SCD_CLIENTID")",
  VITE_AUTH0_SCD_AUDIENCE: "$(js_escape "$VITE_AUTH0_SCD_AUDIENCE")",
  VITE_AUTH0_SCD_SCOPE: "$(js_escape "$VITE_AUTH0_SCD_SCOPE")",
  VITE_AUTH0_SCD_TENANT: "$(js_escape "$VITE_AUTH0_SCD_TENANT")",
  VITE_GOOGLE_PROJECT_ID: "$(js_escape "$VITE_GOOGLE_PROJECT_ID")",
  VITE_GOOGLE_PICKER_KEY: "$(js_escape "$VITE_GOOGLE_PICKER_KEY")",
  VITE_GOOGLE_CLIENT_ID: "$(js_escape "$VITE_GOOGLE_CLIENT_ID")",
  VITE_PEERJS_HOST: "$(js_escape "$VITE_PEERJS_HOST")",
  VITE_PEERJS_PORT: "$(js_escape "$VITE_PEERJS_PORT")",
  VITE_PEERJS_KEY: "$(js_escape "$VITE_PEERJS_KEY")",
  VITE_PEERJS_PATH: "$(js_escape "$VITE_PEERJS_PATH")",
  VITE_PEERJS_CLIENT_URL: "$(js_escape "$VITE_PEERJS_CLIENT_URL")"
};
EOF

exec nginx -g 'daemon off;'
