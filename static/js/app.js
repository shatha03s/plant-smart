const form = document.getElementById("chatForm");
const input = document.getElementById("input");
const messages = document.getElementById("messages");
const cameraInput = document.getElementById("cameraInput");
const imageInput = document.getElementById("imageInput");
const selectedFile = document.getElementById("selectedFile");

let selectedImage = null;

function addMessage(text, type = "bot") {
  const div = document.createElement("div");
  div.className = `msg ${type}`;
  div.innerText = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function handleFile(file) {
  if (!file) return;

  selectedImage = file;
  selectedFile.innerText = "تم اختيار الصورة: " + file.name;
}

cameraInput.addEventListener("change", (e) => {
  handleFile(e.target.files[0]);
});

imageInput.addEventListener("change", (e) => {
  handleFile(e.target.files[0]);
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = input.value.trim();

  if (!message && !selectedImage) return;

  if (message) {
    addMessage(message, "user");
  } else {
    addMessage("تحليل صورة النبات", "user");
  }

  input.value = "";
  selectedFile.innerText = "";

  try {
    let response;

    if (selectedImage) {
      const formData = new FormData();
      formData.append("message", message || "حلل صورة النبات");
      formData.append("image", selectedImage);

      response = await fetch("/api/analyze-image", {
        method: "POST",
        body: formData
      });

      selectedImage = null;
      cameraInput.value = "";
      imageInput.value = "";

    } else {
      response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });
    }

    const data = await response.json();
    addMessage(data.reply || "لم أتمكن من معالجة الطلب.", "bot");

  } catch (error) {
    addMessage("حدث خطأ مؤقت. أعد المحاولة.", "bot");
  }
});
