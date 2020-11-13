<!--
    (c) 2020 Open AR Cloud
    This code is licensed under MIT license (see LICENSE.md for details)
-->

<style>
    #connect {
        text-align: center;
    }

    #qrcode {
        width: 350px;
        height: 300px;
        object-fit: cover;
    }
</style>


<script>
    import {createEventDispatcher} from 'svelte';

    import { geoPose, contentRefs } from "../../core/store.js";

    import Peer from 'peerjs';
    import QRCode from 'qrcode';


    const peer = new Peer({  // TODO: Introduce .env parameters
        debug: 2,
        host: 'rtc.oscp.cloudpose.io',
        port: 5678,
        key: 'peerjs-mvtest',
        path: '/'
    });

    // const clientUrl = 'https://192.168.1.103:5001/dev/geoposeremote';
    const clientUrl = 'https://client.browsar.app/dev/geoposeremote';
    const idParameter = 'peerid';
    const dispatch = createEventDispatcher();

    let localPeerId = '';
    let lastPeerId = null;

    let connection = null;
    let connectionStatus = 'mada';

    let qrCodeUrl;


    peer.on('open', () => {
        // Workaround for peer.reconnect deleting previous id
        if (peer.id === null) {
            console.log('Received null id from peer open');
            peer.id = lastPeerId;
        } else {
            lastPeerId = peer.id;
        }

        console.log('ID: ' + peer.id);
        connectionStatus = "Awaiting connection...";

        localPeerId = peer.id;
        createQrCode(peer.id);
    });

    peer.on('connection', (c) => {
        if (connection && connection.open) {
            c.on('open', () => {
                c.send("Already connected to another client");
                setTimeout(function() { c.close(); }, 500);
            });
            return;
        }

        connection = c;
        console.log("Connected to: " + connection.peer);
        connectionStatus = "Connected";

        dispatch('connected', connection.peer);

        ready();
    });

    peer.on('call', (call) => {
        call.answer();
        // TODO: Handle calls from remote to receive changes to geopose from client
    });

    peer.on('error', function (err) {
        console.log(err);
        dispatch('disconnected');
    });

    function ready() {
        connection.on('data', (data) => {
            console.log("Data recieved");

            switch (data) {
                case 'locationdata':
                    console.log(data);

                    // TODO: Define the data to send outside of this component
                    sendMessage({
                        type: 'location',
                        geopose: $geoPose,
                        refs: $contentRefs,
                        service: 'name and url of service'
                    })
                    break;
                default:
                    console.log("Peer: " + data);
                    break;
            }
        });

        connection.on('close', () => {
            connectionStatus = "Connection reset<br>Awaiting connection...";
            connection = null;
            dispatch('disconnected');
        });
    }

    function sendMessage(message) {
        if (connection && connection.open) {
            connection.send(JSON.stringify(message));
            console.log("Sent: " + JSON.stringify(message))
        } else {
            console.log('Connection is closed');
        }
    }

    function createQrCode(localId) {
        const data = `${clientUrl}?${idParameter}=${localId}`;
        QRCode.toDataURL(data)
            .then(url => {
                qrCodeUrl = url;
            })
            .catch(err => {
                console.error(err);
            })
    }

    function sendToPeer() {
        sendMessage($geoPose);
    }
</script>


{#if connectionStatus !== 'Connected'}
    <p>
        Scan the QR-Code with an AR capable mobile device to verify that the entered GeoPose values are correct. Once
        a connection is established and an AR session successfully started, the GeoPose values can be edited here.
    </p>

    {#if localPeerId !== ''}
        <ul id="connect">
            <li><img id="qrcode" src="{qrCodeUrl}" alt="QR-Code for viewer" /></li>
            <li>ID: {localPeerId}</li>
            <li>{connectionStatus}</li>
        </ul>
    {:else}
        <p>Waiting for RTC Signaling server...</p>
    {/if}
{:else}
    <button on:click={sendToPeer}>Send to AR Viewer</button>
{/if}