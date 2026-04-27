from flask import Flask, render_template, request, jsonify
app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    msg = data.get("message", "").strip()

    if not msg:
        return jsonify({"reply": "اكتب سؤالك عن النباتات 🌿"})

    if "ماء" in msg or "ري" in msg:
        reply = "💧 اسقي النبات عند جفاف أول 2 سم من التربة."
    elif "شمس" in msg or "اضاءة" in msg:
        reply = "☀️ أغلب النباتات تحتاج إضاءة غير مباشرة."
    else:
        reply = "🌿 اكتب اسم النبات أو المشكلة وسأساعدك."

    return jsonify({"reply": reply})

if __name__ == "__main__":
    app.run()
