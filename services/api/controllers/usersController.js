const driver = require('../db/neo4j');

const createUser = async (req, res) => {

  const session = driver.session();

  try {

    const result = await session.run(
      `
      CREATE (u:User {
        name: $name,
        trustScore: 0
      })
      RETURN u
      `,
      {
        name: req.body.name
      }
    );

    res.json({
      success: true,
      user: result.records[0].get('u').properties
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      error: error.message
    });

  } finally {
    await session.close();
  }
};

const addSkillToUser = async (req, res) => {
  const session = driver.session();

  const userName = req.params.name;
  const { skill } = req.body;

  try {
    await session.run(
      `
      MATCH (u:User {name:$userName})
      MERGE (s:Skill {name:$skill})
      
      MERGE (u)-[:HAS_SKILL]->(s)

      RETURN u, s
      `,
      { userName, skill }
    );

    res.json({
      message:'Skill added successfully'
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      error:'Failed to add skill'
    });

  } finally {
    await session.close();
  }
};

const getUserSkills = async (req, res) => {
  const session = driver.session();

  const userName = req.params.name;

  try {
    const result = await session.run(
      `
      MATCH (u:User {name:$userName})
      -[:HAS_SKILL]->
      (s:Skill)

      RETURN s.name AS skill
      `,
      { userName }
    );

    const skills = result.records.map(record => ({
      skill: record.get('skill')
    }));

    res.json(skills);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      error:'Failed to fetch user skills'
    });

  } finally {
    await session.close();
  }
};

module.exports = {
  createUser,
  addSkillToUser,
  getUserSkills
};