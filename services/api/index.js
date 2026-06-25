require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const skillsRoutes = require('./routes/skills');
const usersRoutes = require('./routes/users');
const endorsementsRoutes = require('./routes/endorsements');
const careersRoutes = require('./routes/careers');
const graphRoutes = require('./routes/graph');
const recommendationRoutes = require('./routes/recommendation');
const roleRoutes = require('./routes/role');
const analyticsRoutes = require('./routes/analytics');
const comparisonRoutes = require('./routes/comparison');
// const aiRoutes = require('./routes/ai');
const badgeRoutes = require('./routes/badge');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/skills', skillsRoutes);
app.use('/users', usersRoutes);
app.use('/endorsements', endorsementsRoutes);
app.use('/careers', careersRoutes);
app.use('/graph', graphRoutes);
app.use('/recommendations', recommendationRoutes);
app.use('/roles', roleRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/compare', comparisonRoutes);
// app.use('/ai',aiRoutes);
app.use('/badges',badgeRoutes);

app.get('/', (req, res) => {
  res.json({
    message:'EduTrust API Running'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
}); 