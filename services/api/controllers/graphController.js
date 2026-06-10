const driver = require('../db/neo4j');

const getUserGraph = async (req, res) => {
  const session = driver.session();

  const userName = req.params.name;

  try {
    const result = await session.run(
      `
      MATCH (u:User {name:$userName})

      OPTIONAL MATCH
      (u)-[:HAS_SKILL]->(s:Skill)

      RETURN u.name AS user,
             collect(s.name) AS skills
      `,
      { userName }
    );

    if (result.records.length === 0) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    const record = result.records[0];

    const skills =
      record
        .get('skills')
        .filter(skill => skill !== null);

    res.json({
      user: record.get('user'),
      skills
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
  getUserGraph
};