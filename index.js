const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")
const qrcode = require("qrcode-terminal")
const express = require("express")

// SERVIDOR HTTP (OBRIGATÓRIO PARA O RENDER)
const app = express()
const PORT = process.env.PORT || 3000

app.get("/", (req, res) => {
  res.send("🤖 Atlas Finance está rodando!")
})

app.listen(PORT, () => {
  console.log("🌐 Servidor HTTP ativo na porta", PORT)
})

async function iniciarBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth")

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("connection.update", (update) => {
    const { connection, qr } = update

    if (qr) {
      console.log("📲 Escaneie o QR Code abaixo:")
      qrcode.generate(qr, { small: true })
    }

    if (connection === "open") {
      console.log("✅ Atlas Finance conectado com sucesso!")
    }
  })
}

iniciarBot()
