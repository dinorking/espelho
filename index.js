import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("SERVIDOR OK");
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
