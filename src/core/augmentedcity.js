export function getLocalisationData({lat, lon, refUrl}) {
    // TODO: Find out when to actually call prepare
    return fetch(`https://developer.augmented.city/api/v2/localizer/prepare?lat=${lat}&lon=${lon}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Prepare response was not ok');
            }

            return response.json();
        })
        .then(status => {
            if (status.code === 1) {
                throw new Error('Cant localize: ' + status.message);
            }
        })
        .then(() => fetch(refUrl))
        .then(response => response.arrayBuffer())
        .then(image => fetch('https://developer.augmented.city/api/v2/localizer/localize', {
                method: 'POST',
                body: image,
                headers: {
                    'Content-Type': 'image/jpeg'
                }
            })
        )
        .catch(error => {
            console.error('Error:', error);
        });
}

export function getobjectPoses() {

}