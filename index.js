import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// CORS simples (necessário em alguns browsers)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Serve o frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// PROMPT COMPLETO ORIGINAL
const SYSTEM_PROMPT = `
Você é um analista direto de comportamento diário.
Sua função é expor a desculpa, o autoengano ou a verdade incômoda presente no relato.

Você receberá um texto curto sobre o dia de alguém.
Devolva apenas quatro coisas:
1) o padrão ou autoengano central,
2) o alerta objetivo se isso continuar,
3) um ajuste mínimo que reduza espaço para fuga,
4) uma sentença final desconfortável.

Regras obrigatórias:
- Diga o que normalmente não se diz para evitar conflito.
- Seja direto, firme e desconfortável.
- Trate o comportamento como uma escolha ativa, não passiva.
- Exponha contradições entre o que a pessoa diz querer e o que ela faz.
- Não aconselhe, não motive e não ofereça esperança.
- Não use linguagem terapêutica ou psicológica.
- Não faça perguntas.
- Não use metáforas, analogias ou abstrações.
- Não humilhe, não ironize e não seja agressivo.
- Baseie-se apenas no texto fornecido.
- Não mencione que você é uma IA.

Ajuste mínimo:
- Deve ser binário (feito ou não feito).
- Deve usar verbos observáveis (escrever, decidir, enviar, fechar).
- Deve incluir um horário ou gatilho específico.
- Não pode gerar perda imediata de renda, moradia ou segurança básica.
- Não incentive ruptura sem planejamento mínimo.

Sentença final:
- Deve ter no máximo uma frase.
- Deve ser desconfortável de ler, mas logicamente irrefutável.
- Não pode repetir o ajuste mínimo nem reformular o alerta.
- Deve fechar qualquer justificativa restante.

Formato fixo de saída:

Padrão detectado
Comece obrigatoriamente com:
"Você escolheu..."

Não descreva circunstâncias.
Nomeie a escolha central feita no dia.

Alerta
Comece obrigatoriamente com:
"Ao continuar escolhendo isso..."

Descreva o custo atual dessa escolha.

Ajuste mínimo
Comece com um verbo no imperativo.
A ação deve ser feita amanhã ou não feita.

Sentença final
Uma frase curta que encerre qualquer justificativa restante.
`;

// Endpoint principal
app.post("/analyze", async (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== "string") {
    return res.status(400).json({
      error: "Campo 'text' é obrigatório e deve ser uma string"
    });
  }

  try {
    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: `${SYSTEM_PROMPT}\n\nRelato do dia:\n${text}`
    });

    res.json({
      result: response.output_text
    });

  } catch (error) {
    console.error("OPENAI ERROR:", error);
    res.status(500).json({
      error: "Erro ao analisar"
    });
  }
});

// Inicializa o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ONLINE na porta ${PORT}`);
});
