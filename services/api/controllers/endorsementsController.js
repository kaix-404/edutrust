const driver = require('../db/neo4j');

const endorseUser = async (req, res) => {
  const session = driver.session();

  const { endorser, endorsee } = req.body;

  if (endorser === endorsee) {
    return res.status(400).json({
      error: 'Users cannot endorse themselves'
    });
  }

  try {
    await session.run(
      `
      MATCH (a:User {name:$endorser})
      MATCH (b:User {name:$endorsee})

      MERGE (a)-[:ENDORSES]->(b)
      `,
      {
        endorser,
        endorsee
      }
    );

    res.json({
      success: true,
      message: 'Endorsement created'
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

const getEndorsements = async (req, res) => {
  const session = driver.session();

  const userName = req.params.user;

  try {
    const result = await session.run(
      `
      MATCH (endorser:User)-[:ENDORSES]->(u:User {name:$userName})

      RETURN collect(endorser.name) AS endorsers
      `,
      { userName }
    );

    const endorsers =
      result.records[0]?.get('endorsers') || [];

    res.json({
      user: userName,
      endorsements: endorsers.length,
      endorsedBy: endorsers,
      trustScore: endorsers.length * 10
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: error.message
    });

  } finally {
    await session.close();
  }
}

module.exports = {
  endorseUser,
  getEndorsements
};