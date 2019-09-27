function addMessage(user, message) {
  const msg = `<span><img src="/image/${user}.jpg">${message}</span>`;

  const output = this.document.getElementById("output");
  output.insertAdjacentHTML('beforeend', msg); // afterbegin
  output.scrollTop = output.scrollHeight;
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

  const output = this.document.getElementById("output");
  output.scrollTop = output.scrollHeight;
});
