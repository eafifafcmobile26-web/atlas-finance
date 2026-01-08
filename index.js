const express = require("express");
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const qrcode = require("qrcode-terminal");

const app = express();
const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Atlas Finance online 🚀");
});

app.listen(PORT, () => {
  console.log("🌐 Servidor ativo na porta", PORT);
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
    const { connection, qr, lastDisconnect } = update;

    if (qr) {
      console.log("📲 QR CODE GERADO — ESCANEIE:");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "open") {
      console.log("✅ Atlas Finance conectado com sucesso!");
    }

    if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode;
      console.log("⚠️ Conexão fechada. Motivo:", reason);
      iniciarBot(); // reconecta automaticamente
    }
  });
}

iniciarBot();
