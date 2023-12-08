
export function getLocation(position) {

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position);

}
