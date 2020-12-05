// const referenceImageUrl = '/taggedimages/helsinki/img_3634.png';
const referenceImageUrl = '/taggedimages/helsinki/img_6416.png';
const referenceLocalisationUrl = 'https://api.immersal.com/fcgi?21';
const referenceLocalisationParameters = {
    radius: 50,
    // latitude: 60.171592,
    // longitude: 24.951608,
    latitude: 60.167483,
    longitude: 24.954467,
    b64: null,
    token: '',
    ox: 1668.87585,     // iPhone 4/5
    oy: 1226.19712,
    fx: 3288.47697,
    fy: 3078.59787,
}

const mapEcefUrl = 'https://api.immersal.com/fcgi?23';
const mapEcefParameters = {
    id: '',
    token: ''
}

/* eslint-disable no-unused-vars */
const sparseMapUrl = 'https://api.immersal.com/fcgi?5';
// const denseMapUrl = '/content/8058-FromGateRight-dense.ply';
// const denseMapUrl = 'https://api.immersal.com/fcgi?14';


export async function getLocalisationData() {
    // Get map and GeoLocations from GeoPose provider
    const refRelativeEcef = await getReferenceImage(referenceImageUrl)
        .then(image => getReferenceImageEcef(image))

    const mapEcef = await getMapEcef(refRelativeEcef.map);
    const refEcef = getAbsoluteEcef(mapEcef, [refRelativeEcef.px, refRelativeEcef.py, refRelativeEcef.pz]);

    return [sparseMapUrl, mapEcef, refEcef];
}

function getReferenceImage() {
    return fetch(referenceImageUrl)
        .then((response) => response.arrayBuffer())
        .then((buffer) => btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')));
}

function getReferenceImageEcef(image) {
    referenceLocalisationParameters.b64 = image;

        return fetch(referenceLocalisationUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: JSON.stringify(referenceLocalisationParameters)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => data)
            .catch(error => {
                console.error('Error:', error);
            });
}

function getMapEcef(mapId) {
    mapEcefParameters.id = mapId;

        return fetch(mapEcefUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: JSON.stringify(mapEcefParameters)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(json => json.ecef);
}

function getAbsoluteEcef(reference, relative) {
    const mp = [-relative[1], -relative[0], relative[2], 1.0];
    const s = reference[12];
    const m = [[s * reference[3], s * reference[6], s * reference[9], 0.0],
        [s * reference[4], s * reference[7], s * reference[10], 0.0],
        [s * reference[5], s * reference[8], s * reference[11], 0.0],
        [reference[0], reference[1], reference[2], 1.0]];
    /* eslint-disable no-undef */
    return nj.dot(mp, m).selection.data;
}