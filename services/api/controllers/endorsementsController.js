const driver = require('../db/neo4j');

const endorseUser = async (req, res) => {
  const session = driver.session();

  const { fromUser, toUser } = req.body;

  try {
    await session.run(
      `
      MATCH (a:User {name:$fromUser})
      MATCH (b:User {name:$toUser})

      CREATE (a)-[:ENDORSED]->(b)
      `,
      { fromUser, toUser }
    );

    res.json({
      message:'User endorsed successfully'
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      error:'Failed to endorse user'
    });

  } finally {
    await session.close();
  }
};

module.exports = {
  endorseUser
};