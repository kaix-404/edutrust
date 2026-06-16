const driver = require('../db/neo4j');

const createRole = async (req, res) => {
  const session = driver.session();

  const { roleName } = req.body;

  try {
    await session.run(
      `
      MERGE (r:Role {name:$roleName})
      `,
      { roleName }
    );

    res.json({
      success: true,
      message: 'Role created'
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

const connectRoleSkill = async (req, res) => {
  const session = driver.session();

  const { roleName, skillName } = req.body;

  try {
    await session.run(
      `
      MATCH (r:Role {name:$roleName})
      MATCH (s:Skill {name:$skillName})

      MERGE (r)-[:REQUIRES]->(s)
      `,
      {
        roleName,
        skillName
      }
    );

    res.json({
      success: true,
      message: 'Role connected to skill'
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

const getSkillGap = async (req, res) => {
  const session = driver.session();

  const { role, user } = req.params;

  try {
    const roleSkillsResult =
      await session.run(
        `
        MATCH (r:Role {name:$role})
        -[:REQUIRES]->
        (s:Skill)

        RETURN collect(s.name)
        AS roleSkills
        `,
        { role }
      );

    const userSkillsResult =
      await session.run(
        `
        MATCH (u:User {name:$user})
        -[:HAS_SKILL]->
        (s:Skill)

        RETURN collect(s.name)
        AS userSkills
        `,
        { user }
      );

    const roleSkills =
      roleSkillsResult.records[0]?.get('roleSkills') || [];

    const userSkills =
      userSkillsResult.records[0]?.get('userSkills') || [];

    const matchedSkills =
      roleSkills.filter(
        skill => userSkills.includes(skill)
      );

    const missingSkills =
      roleSkills.filter(
        skill => !userSkills.includes(skill)
      );

    const matchScore =
      roleSkills.length === 0
        ? 0
        : Math.round(
            (matchedSkills.length /
              roleSkills.length) *
              100
          );

    res.json({
      role,
      user,
      matchedSkills,
      missingSkills,
      matchScore
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

const getRecommendations = async (req, res) => {
  const session = driver.session();

  const { role, user } = req.params;

  try {
    const roleSkillsResult =
      await session.run(
        `
        MATCH (r:Role {name:$role})
        -[:REQUIRES]->
        (s:Skill)

        RETURN collect(s.name)
        AS roleSkills
        `,
        { role }
      );

    const userSkillsResult =
      await session.run(
        `
        MATCH (u:User {name:$user})
        -[:HAS_SKILL]->
        (s:Skill)

        RETURN collect(s.name)
        AS userSkills
        `,
        { user }
      );

    const roleSkills =
      roleSkillsResult.records[0]?.get(
        'roleSkills'
      ) || [];

    const userSkills =
      userSkillsResult.records[0]?.get(
        'userSkills'
      ) || [];

    const recommendations =
      roleSkills.filter(
        skill =>
          !userSkills.includes(skill)
      );

    res.json({
      user,
      role,
      recommendations,
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

const getRoadmapForRole = async (req, res) => {
  const session = driver.session();

  const { role, user } = req.params;

  try {
    const pathResult =
      await session.run(
        `
        MATCH (r:Role {name:$role})
        -[:REQUIRES]->
        (target:Skill)

        OPTIONAL MATCH path=
        (target)-[:REQUIRES*0..]->(prereq)

        RETURN path
        `,
        { role }
      );

    const roadmap = [];

    pathResult.records.forEach(
      record => {
        const path =
          record.get('path');

        if (!path) return;

        path.segments.forEach(
          segment => {
            roadmap.push(
              segment.start.properties.name
            );

            roadmap.push(
              segment.end.properties.name
            );
          }
        );
      }
    );

    const uniqueRoadmap =
      [...new Set(roadmap)].reverse();

    const userResult =
      await session.run(
        `
        MATCH (u:User {name:$user})
        -[:HAS_SKILL]->
        (s:Skill)

        RETURN collect(s.name)
        AS userSkills
        `,
        { user }
      );

    const userSkills =
      userResult.records[0]?.get(
        'userSkills'
      ) || [];

    const remainingRoadmap =
      uniqueRoadmap.filter(
        skill =>
          !userSkills.includes(skill)
      );
    
    const roleSkills =
      await session.run(
        `
        MATCH (r:Role {name:$role})
        -[:REQUIRES]->
        (s:Skill)

        RETURN collect(s.name)
        AS roleSkills
        `,
        { role }
      );

    const requiredSkills =
      roleSkills.records[0]?.get(
        'roleSkills'
      ) || [];

    const roleSatisfied =
      requiredSkills.every(
        skill => userSkills.includes(skill)
      );

    if (roleSatisfied) {
      return res.json({
        role,
        user,
        roadmap: [],
        nextSkill: null,
      });
    }  

    res.json({
      role,
      user,
      roadmap: remainingRoadmap,
      nextSkill:
        remainingRoadmap[0] || null,
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

const getRoleRanking = async (req, res) => {
  const session = driver.session();

  const role = req.params.role;

  try {
    // Get role skills
    const roleResult = await session.run(
      `
      MATCH (r:Role {name:$role})
      -[:REQUIRES]->
      (s:Skill)

      RETURN collect(s.name)
      AS roleSkills
      `,
      { role }
    );

    const roleSkills =
      roleResult.records[0]?.get(
        'roleSkills'
      ) || [];

    if (!roleSkills.length) {
      return res.status(404).json({
        error: 'Role not found'
      });
    }

    // Get all users and their skills
    const usersResult = await session.run(`
      MATCH (u:User)

      OPTIONAL MATCH
      (u)-[:HAS_SKILL]->(s:Skill)

      RETURN
      u.name AS user,
      collect(s.name) AS skills
    `);

    const rankings = [];

    for (
      const record
      of usersResult.records
    ) {
      const user =
        record.get('user');

      const userSkills =
        record.get('skills') || [];

      const matchedSkills =
        roleSkills.filter(
          skill =>
            userSkills.includes(
              skill
            )
        );

      const matchScore =
        Math.round(
          (matchedSkills.length /
            roleSkills.length) *
            100
        );

      const trustResult =
        await session.run(
          `
          MATCH (endorser:User)
          -[:ENDORSES]->
          (u:User {name:$user})
          
          RETURN count(endorser)
          AS endorsements
          `,
          { user }
        );
        
      const endorsements =
        trustResult.records[0]?.get(
          'endorsements'
        ) || 0;
        
      const trustScore =
        Number(endorsements) * 10;
        
      const influenceResult =
        await session.run(
          `
          MATCH (u:User {name:$user})
          
          OPTIONAL MATCH
          (endorser:User)
          -[:ENDORSES]->
          (u)
          
          OPTIONAL MATCH
          (grandEndorser:User)
          -[:ENDORSES]->
          (endorser)
          
          RETURN
          count(DISTINCT endorser)
          +
          count(DISTINCT grandEndorser)*2
          AS influence
          `,
          { user }
        );
        
      const influenceScore =
        Number(
          influenceResult.records[0]?.get(
            'influence'
          ) || 0
        );
        
      const finalScore =
        matchScore * 0.7 +
        trustScore * 0.2 +
        influenceScore * 0.1;

      rankings.push({
        user,
        matchScore,
        trustScore,
        influenceScore,
        finalScore
      });
      }

    rankings.sort(
      (a, b) =>
        b.finalScore -
        a.finalScore
    );

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

const recommendRoles = async (req, res) => {
  const session = driver.session();

  const user = req.params.user;

  try {
    // Get user skills
    const userResult = await session.run(
      `
      MATCH (u:User {name:$user})
      -[:HAS_SKILL]->
      (s:Skill)

      RETURN collect(s.name)
      AS userSkills
      `,
      { user }
    );

    const userSkills =
      userResult.records[0]?.get(
        'userSkills'
      ) || [];

    if (!userSkills.length) {
      return res.json({
        user,
        recommendations: [],
        message:
          'No skills found for this user'
      });
    }

    // Get all roles
    const roleResult = await session.run(`
      MATCH (r:Role)
      -[:REQUIRES]->
      (s:Skill)

      RETURN
        r.name AS role,
        collect(s.name)
        AS roleSkills
    `);

    const recommendations =
      roleResult.records.map(record => {
        const role =
          record.get('role');

        const roleSkills =
          record.get('roleSkills');

        const matchedSkills =
          roleSkills.filter(skill =>
            userSkills.includes(skill)
          );

        const matchScore =
          Math.round(
            (matchedSkills.length /
              roleSkills.length) *
              100
          );

        return {
          role,
          matchScore,
          matchedSkills,
          missingSkills:
            roleSkills.filter(
              skill =>
                !userSkills.includes(
                  skill
                )
            ),
        };
      });

    recommendations.sort(
      (a, b) =>
        b.matchScore -
        a.matchScore
    );

    res.json(recommendations);

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
  createRole,
  connectRoleSkill,
  getSkillGap,
  getRecommendations,
  getRoadmapForRole,
  getRoleRanking,
  recommendRoles
};