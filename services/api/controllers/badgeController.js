const driver = require('../db/neo4j');

const createBadge = async (req, res) => {
  const session = driver.session();

  const {
    user,
    badge,
    score,
  } = req.body;

  try {
    await session.run(
      `
      MATCH (u:User {name:$user})

      MERGE (b:Badge {
        name:$badge
      })

      MERGE (u)-[r:EARNED]->(b)

      SET r.score = $score,
          r.earnedAt = datetime()
      `,
      {
        user,
        badge,
        score,
      }
    );

    res.json({
      success: true,
      message: 'Badge awarded',
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

const getUserBadges = async (req, res) => {
  const session = driver.session();

  const { user } = req.params;

  try {
    const result = await session.run(
      `
      MATCH
      (u:User {name:$user})
      -[r:EARNED]->
      (b:Badge)

      RETURN
      b.name AS badge,
      r.score AS score,
      r.earnedAt AS earnedAt

      ORDER BY r.score DESC
      `,
      {
        user,
      }
    );

    const badges =
      result.records.map(
        record => ({
          badge:
            record.get('badge'),

          score: Number(
            record.get('score')
          ),

          earnedAt:
            record.get('earnedAt')
              ?.toString(),
        })
      );

    res.json(badges);

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
  createBadge,
  getUserBadges,
};