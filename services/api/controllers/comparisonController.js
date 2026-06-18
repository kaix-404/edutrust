const driver = require('../db/neo4j');

const getCandidateMetrics = async (session, userName ) => {
  const result = await session.run(
    `
    MATCH (u:User {name:$userName})

    OPTIONAL MATCH (u)-[:HAS_SKILL]->(s:Skill)

    OPTIONAL MATCH (endorser:User)
                  -[:ENDORSES]->(u)

    WITH
      u,
      collect(DISTINCT s.name) AS skills,
      count(DISTINCT endorser) AS endorsements

    RETURN
      u.name AS name,
      skills,
      endorsements,
      endorsements * 10 AS trustScore
    `,
    { userName }
  );

  if (result.records.length === 0) {
    return null;
  }

  const record = result.records[0];

  const trustScore =
    Number(record.get('trustScore'));

  const influenceResult =
    await session.run(
      `
      MATCH (endorser:User)
            -[:ENDORSES]->
            (u:User {name:$userName})

      OPTIONAL MATCH (:User)
                     -[:ENDORSES]->
                     (endorser)

      RETURN
      count(*) * 10
      AS influenceScore
      `,
      { userName }
    );

  const influenceScore =
    influenceResult.records.length > 0
      ? Number(
          influenceResult.records[0].get(
            'influenceScore'
          )
        )
      : 0;

  return {
    name: record.get('name'),
    skills: record.get('skills') || [],
    skillCount:
      (record.get('skills') || []).length,
    endorsements: Number(
      record.get('endorsements')
    ),
    trustScore,
    influenceScore,
  };
};

const compareCandidates = async (req, res) => {
  const session = driver.session();

  const {
    candidate1,
    candidate2,
  } = req.params;

  try {
    const user1 =
      await getCandidateMetrics(
        session,
        candidate1
      );

    const user2 =
      await getCandidateMetrics(
        session,
        candidate2
      );

    if (!user1 || !user2) {
      return res.status(404).json({
        error:
          'One or both candidates not found',
      });
    }

    res.json({
      candidate1: user1,
      candidate2: user2,
    });

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
  compareCandidates,
};