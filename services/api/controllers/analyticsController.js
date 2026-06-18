const driver = require('../db/neo4j');

const getAnalytics = async (req, res) => {
  const session = driver.session();

  try {
    // Total Users
    const usersResult =
      await session.run(`
        MATCH (u:User)
        RETURN count(u) AS totalUsers
      `);

    const totalUsers = Number(
      usersResult.records[0].get(
        'totalUsers'
      )
    );

    // Total Endorsements
    const endorsementsResult =
      await session.run(`
        MATCH ()-[e:ENDORSES]->()
        RETURN count(e) AS totalEndorsements
      `);

    const totalEndorsements =
      Number(
        endorsementsResult.records[0].get(
          'totalEndorsements'
        )
      );

    // Total Skills
    const skillsResult =
      await session.run(`
        MATCH (s:Skill)
        RETURN count(s) AS totalSkills
      `);

    const totalSkills = 
      Number(
        skillsResult.records[0].get(
          'totalSkills'
        )
    );

    // Total Roles
    const rolesResult =
      await session.run(`
        MATCH (r:Role)
        RETURN count(r) AS totalRoles
      `);

    const totalRoles =
      Number(
        rolesResult.records[0].get(
          'totalRoles'
        )
    );

    // Most Trusted User
    const trustedResult =
      await session.run(`
        MATCH (u:User)

        OPTIONAL MATCH
        (:User)-[:ENDORSES]->(u)

        RETURN
        u.name AS name,
        count(*) * 10 AS trustScore

        ORDER BY trustScore DESC
        LIMIT 1
      `);

    const mostTrustedUser = {
      name:
        trustedResult.records[0]?.get(
          'name'
        ) || 'N/A',

      trustScore: Number(
        trustedResult.records[0]?.get(
          'trustScore'
        ) || 0
      ),
    };

    // Most Popular Skill
    const skillResult =
      await session.run(`
        MATCH (u:User)-[:HAS_SKILL]->(s:Skill)

        RETURN
        s.name AS skill,
        count(*) AS count

        ORDER BY count DESC
        LIMIT 1
      `);

    const mostPopularSkill = {
      skill:
        skillResult.records[0]?.get(
          'skill'
        ) || 'N/A',

      count: Number(
        skillResult.records[0]?.get(
          'count'
        ) || 0
      ),
    };

    // Most Influential User
    const influenceResult =
      await session.run(`
        MATCH (u:User)

        OPTIONAL MATCH
        (endorser:User)-[:ENDORSES]->(u)

        WITH
        u,
        sum(
          size(
            [(:User)-[:ENDORSES]->(endorser) | 1]
          ) * 10
        ) AS influenceScore

        RETURN
        u.name AS user,
        coalesce(
          influenceScore,
          0
        ) AS influenceScore

        ORDER BY influenceScore DESC
        LIMIT 1
      `);

    const mostInfluentialUser = {
      name:
        influenceResult.records[0]?.get(
          'user'
        ) || 'N/A',

      influenceScore: Number(
        influenceResult.records[0]?.get(
          'influenceScore'
        ) || 0
      ),
    };

    res.json({
      totalUsers,
      totalEndorsements,
      mostTrustedUser,
      mostInfluentialUser,
      mostPopularSkill,
      totalSkills,
      totalRoles,
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