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

const getRecommendations = async (
  req,
  res
) => {
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

module.exports = {
  createRole,
  connectRoleSkill,
  getSkillGap,
  getRecommendations
};