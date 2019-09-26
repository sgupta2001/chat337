function addMessage(user, message) {
  const msg = `<span><img src="/image/${user}.jpg">${message}</span>`;
  document.getElementById("output").insertAdjacentHTML('afterbegin', msg);
}

function sendMessage(event) {
  event.preventDefault();
  const input = document.getElementById("chat-message-input");

  addMessage("Stefan-Marr", input.value);
  input.value = "";
}

window.addEventListener("load", function () {
  const form = document.getElementById("chat-message");
  form.addEventListener("submit", sendMessage);
});
