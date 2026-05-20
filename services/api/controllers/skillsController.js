const driver = require('../db/neo4j');

const getSkills = async (req, res) => {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (s:Skill)
      RETURN s.name AS name
      `
    );

    const skills = result.records.map(record => ({
      name: record.get('name')
    }));

    res.json(skills);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: 'Failed to fetch skills'
    });

  } finally {
    await session.close();
  }
};


const connectSkills = async (req, res) => {
  const session = driver.session();

  const {
    parentSkill,
    childSkill
  } = req.body;

  try {
    await session.run(
      `
      MERGE (a:Skill {name:$parentSkill})
      MERGE (b:Skill {name:$childSkill})

      MERGE (a)-[:REQUIRES]->(b)

      RETURN a, b
      `,
      {
        parentSkill,
        childSkill
      }
    );

    res.json({
      success: true,
      message: 'Skills connected'
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      error: error.message
    });

  } finally {
    await session.close();
  }
};

module.exports = {
  getSkills,
  connectSkills
};