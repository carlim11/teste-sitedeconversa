const express = require("express");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.static("public"));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/api/chat", async (req, res) => {

  try {

    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        error: "Pergunta não informada."
      });
    }

    const response = await client.responses.create({
      model: "gpt-5",
      input: `
Você é um assistente de inteligência artificial.

Responda à pergunta do usuário de forma:
- completa
- clara
- organizada
- útil
- em português do Brasil

Pergunta do usuário:

${question}
`
    });

    res.json({
      answer: response.output_text
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Erro ao consultar a inteligência artificial."
    });

  }

});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
