const driver = require('../db/neo4j');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const session = driver.session();

  const {
    name,
    email,
    password,
  } = req.body;

  try {
    const existing =
      await session.run(
        `
        MATCH (u:User {email:$email})
        RETURN u
        `,
        { email }
      );

    if (existing.records.length > 0) {
      return res.status(400).json({
        error: 'Email already exists',
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    await session.run(
      `
      CREATE (u:User {
        name:$name,
        email:$email,
        password:$password
      })
      `,
      {
        name,
        email,
        password: hashedPassword,
      }
    );

    res.json({
      success: true,
      message:
        'User registered successfully',
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

const login = async (req, res) => {
  const session = driver.session();

  const {
    email,
    password,
  } = req.body;

  try {
    const result =
      await session.run(
        `
        MATCH (u:User {email:$email})

        RETURN
          u.name AS name,
          u.email AS email,
          u.password AS password
        `,
        { email }
      );

    if (result.records.length === 0) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    const user =
      result.records[0];

    const isMatch =
      await bcrypt.compare(
        password,
        user.get('password')
      );

    if (!isMatch) {
      return res.status(401).json({
        error: 'Invalid credentials',
      });
    }

    const token =
      jwt.sign(
        {
          name:
            user.get('name'),
          email:
            user.get('email'),
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '7d',
        }
      );

    res.json({
      token,
      user: {
        name:
          user.get('name'),
        email:
          user.get('email'),
      },
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
  register,
  login,
};