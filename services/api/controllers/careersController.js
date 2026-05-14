const driver = require('../db/neo4j');

const getCareerPath = async (req, res) => {
  const session = driver.session();

  const { skill1, skill2 } = req.params;

  try {
    const result = await session.run(
      `
      MATCH p = shortestPath(
        (a:Skill {name:$skill1})
        -[:REQUIRES*]-
        (b:Skill {name:$skill2})
      )

      RETURN p
      `,
      { skill1, skill2 }
    );

    res.json({
      message:'Career path calculated',
      pathsFound: result.records.length
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      error:'Failed to calculate path'
    });

  } finally {
    await session.close();
  }
};

module.exports = {
  getCareerPath
};