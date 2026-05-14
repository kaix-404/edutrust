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

module.exports = {
  getSkills
};