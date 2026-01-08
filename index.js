const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const qrcode = require("qrcode-terminal");

async function iniciarBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth");

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, qr } = update;

    if (qr) {
      console.log("📲 Escaneie o QR Code abaixo:");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "open") {
      console.log("✅ Atlas Finance conectado com sucesso!");
    }
  });
}

iniciarBot();
