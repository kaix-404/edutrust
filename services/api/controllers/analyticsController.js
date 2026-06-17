const driver = require('../db/neo4j');

const getAnalytics = async (req, res) => {
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (u:User)
      WITH count(u) AS users

      MATCH (s:Skill)
      WITH users, count(s) AS skills

      MATCH (r:Role)
      WITH users, skills, count(r) AS roles

      MATCH ()-[e:ENDORSES]->()
      WITH users, skills, roles, count(e) AS endorsements

      RETURN
        users,
        skills,
        roles,
        endorsements
    `);

    const record =
      result.records[0];

    res.json({
      totalUsers:
        record.get('users').toNumber?.() ??
        record.get('users'),

      totalSkills:
        record.get('skills').toNumber?.() ??
        record.get('skills'),

      totalRoles:
        record.get('roles').toNumber?.() ??
        record.get('roles'),

      totalEndorsements:
        record
          .get('endorsements')
          .toNumber?.() ??
        record.get('endorsements'),
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
  getAnalytics,
};