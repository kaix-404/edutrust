const driver = require('../db/neo4j');

const getRecommendations = async (req, res) => {
  const session = driver.session();

  const skill = req.params.skill;

  try {
    const result = await session.run(
      `
      MATCH (s:Skill {name:$skill})
      -[:REQUIRES]->
      (next:Skill)

      RETURN next.name AS recommendation
      `,
      { skill }
    );

    const recommendations =
      result.records.map(record =>
        record.get('recommendation')
      );

    res.json({
      currentSkill: skill,
      recommendedSkills: recommendations
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: error.message
    });

  } finally {
    await session.close();
  }
};

module.exports = {
  getRecommendations
};