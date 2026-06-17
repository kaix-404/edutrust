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

const recommendSkills = async (req, res) => {
  const session = driver.session();

  const user = req.params.user;

  try {
    const result = await session.run(
      `
      MATCH (u:User {name:$user})
            -[:HAS_SKILL]->
            (s:Skill)
            <-[:HAS_SKILL]-
            (other:User)

      WHERE other <> u

      MATCH (other)
            -[:HAS_SKILL]->
            (recommended:Skill)

      WHERE NOT EXISTS {
        MATCH (u)-[:HAS_SKILL]->(recommended)
      }

      RETURN
      recommended.name AS skill,
      count(DISTINCT other) AS score

      ORDER BY score DESC
      LIMIT 10
      `,
      { user }
    );

    const recommendations =
      result.records.map(record => ({
        skill: record.get('skill'),
        score: Number(
          record.get('score')
        ),
      }));

    res.json(recommendations);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: error.message,
    });

  } finally {
    await session.close();
  }
};

module.exports = {
  getRecommendations,
  recommendSkills
};