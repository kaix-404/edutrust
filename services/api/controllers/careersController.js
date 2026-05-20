const driver = require('../db/neo4j');

const getCareerPath = async (req, res) => {
  const session = driver.session();

  const { startSkill, goalSkill } = req.params;

  try {
    const result = await session.run(
      `
      MATCH p = shortestPath(
        (start:Skill {name:$startSkill})
        -[:REQUIRES*]->
        (goal:Skill {name:$goalSkill})
      )

      RETURN p
      `,
      {
        startSkill,
        goalSkill
      }
    );

    if (result.records.length === 0) {
      return res.status(404).json({
        error: 'No path found'
      });
    }

    const path = result.records[0]
      .get('p')
      .segments;

    const skills = [];

    if (path.length > 0) {
      skills.push(
        path[0].start.properties.name
      );

      path.forEach(segment => {
        skills.push(
          segment.end.properties.name
        );
      });
    }

    res.json({
      success: true,
      path: skills
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
  getCareerPath
};