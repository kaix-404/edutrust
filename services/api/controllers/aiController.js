const OpenAI = require('openai');

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const verifySkill = async (req, res) => {
  try {
    const { skill, answer } = req.body;

    const prompt = `
You are a technical interviewer.

Skill: ${skill}

Candidate Answer:
${answer}

Evaluate the answer.

Return ONLY JSON:

{
  "score": number,
  "feedback": "string",
  "verified": boolean
}

verified should be true if score >= 7.
`;

    const response =
      await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

    const result =
      JSON.parse(
        response.choices[0].message.content
      );

    res.json(result);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  verifySkill,
};