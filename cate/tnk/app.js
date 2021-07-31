let xhr = new XMLHttpRequest();
console.log(xhr);

xhr.addEventListener("progress", updateProgress, false);
xhr.addEventListener("load", transferComplete, false);

xhr.open('GET', '/tnk/obrigado');

function updateProgress (oEvent) {
  console.log(oEvent);
  if (oEvent.lengthComputable) {
    var percentComplete = oEvent.loaded / oEvent.total;
    // ...
  } else {
    // Não é possível calcular informações de progresso uma vez que a dimensão total é desconhecida
  }
}

function transferComplete(evt) {
  console.log(evt);
  alert("A transferência foi concluída.");
}