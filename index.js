const express = require("express");
const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const qrcode = require("qrcode-terminal");

const app = express();

// 🔴 CORREÇÃO AQUI
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Atlas Finance online 🚀");
});

app.listen(PORT, () => {
  console.log("🌐 Servidor HTTP ativo na porta", PORT);
});

async function iniciarBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth");

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    browser: ["Atlas Finance", "Chrome", "1.0"]
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, qr } = update;

    if (qr) {
      console.log("📲 ESCANEIE O QR CODE:");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "open") {
      console.log("✅ Atlas Finance conectado com sucesso!");
    }
  });
}

iniciarBot();
