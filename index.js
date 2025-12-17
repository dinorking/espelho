import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/analyze", (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Texto ausente" });
  }

  res.json({
    result: `RECEBIDO COM SUCESSO:\n${text}`
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ONLINE na porta ${PORT}`);
});
