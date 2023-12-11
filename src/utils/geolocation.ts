export function getLocation(coords: any) {
  //if (navigator.geolocation) {
  // navigator.geolocation.getCurrentPosition(position);

  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function success(pos) {
    const crd = pos.coords;

    coords.lat = crd.latitude;
    coords.lng = crd.longitude;

    console.log('Your current position is:');
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error, options);
  }
}
