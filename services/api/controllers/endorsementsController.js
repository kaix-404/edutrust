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

const getEndorsementNetwork = async (req, res) => {
  const session = driver.session();

  try {
    // Get endorsement connections
    const connectionResult = await session.run(`
      MATCH (a:User)-[:ENDORSES]->(b:User)

      RETURN
        a.name AS source,
        b.name AS target
    `);

    const connections =
      connectionResult.records.map(record => ({
        source: record.get('source'),
        target: record.get('target')
      }));

    // Get all users + trust scores
    const nodeResult = await session.run(`
      MATCH (u:User)

      OPTIONAL MATCH (endorser:User)-[:ENDORSES]->(u)

      RETURN
        u.name AS name,
        count(endorser) * 10 AS trustScore
    `);

    const nodes =
      nodeResult.records.map(record => ({
        name: record.get('name'),
        trustScore: Number(
          record.get('trustScore')
        )
      }));

    res.json({
      nodes,
      connections
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

const getInfluenceRanking = async (req, res) => {
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (u:User)

      OPTIONAL MATCH (endorser:User)-[:ENDORSES]->(u)

      OPTIONAL MATCH (grandEndorser:User)-[:ENDORSES]->(endorser)

      RETURN
        u.name AS user,
        count(DISTINCT endorser)
        +
        count(DISTINCT grandEndorser) * 2
        AS influenceScore

      ORDER BY influenceScore DESC
    `);

    const rankings =
      result.records.map(record => ({
        user: record.get('user'),
        influenceScore: Number(
          record.get('influenceScore')
        )
      }));

    res.json(rankings);

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
  endorseUser,
  getEndorsements,
  getEndorsementNetwork,
  getInfluenceRanking
};