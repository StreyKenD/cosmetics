let xhr = new XMLHttpRequest();
console.log(xhr);

xhr.onload = function() {
  console.log(xhr);
  alert(`Loaded: ${xhr.status} ${xhr.response}`);
};

xhr.onprogress = function(event) { // triggers periodically
  console.log(xhr);
  // event.loaded - how many bytes downloaded
  // event.lengthComputable = true if the server sent Content-Length header
  // event.total - total number of bytes (if lengthComputable)
  alert(`Received ${event.loaded} of ${event.total}`);
};