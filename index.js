import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("SERVIDOR OK");
});

app.post("/analyze", (req, res) => {
  console.log("CHEGOU NO /analyze");
  res.json({ result: "ROTA /analyze FUNCIONANDO" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ONLINE na porta ${PORT}`);
});
