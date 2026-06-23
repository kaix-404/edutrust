# EduTrust AI

EduTrust AI is a graph-powered career intelligence platform built using **Neo4j**, **Node.js**, **Express**, **React Native (Expo)**, and **JWT Authentication**.

The platform helps students, professionals, recruiters, and organizations understand skills, trust, endorsements, role fit, and career progression using connected graph data.

---

## Features

### Authentication

* User Registration
* User Login
* JWT-based Authentication
* Protected API Routes
* Persistent Login using AsyncStorage

### Skill Graph Management

* Create Users
* Create Skills
* Connect Users with Skills
* Visualize User Skill Networks

### Career Intelligence

* Role Recommendation Engine
* Skill Gap Analysis
* Personalized Learning Roadmaps
* Career Path Discovery
* Skill Recommendations

### Trust & Endorsements

* Endorse Users
* Trust Score Calculation
* Endorsement Network Visualization
* Influence Score Ranking
* Community-Based Credibility Metrics

### Recruiter Dashboard

* Candidate Skill Analysis
* Trust & Endorsement Evaluation
* Influence Measurement
* Candidate Comparison
* Recruiter-Friendly Profile Insights

### Analytics

* Platform Statistics
* User Rankings
* Role Rankings
* Network Insights

---

## Tech Stack

### Frontend

* React Native
* Expo Router
* TypeScript
* Axios
* AsyncStorage
* React Native SVG

### Backend

* Node.js
* Express.js
* Neo4j Graph Database
* JWT Authentication
* bcrypt.js

---

## Graph Model

### Nodes

* User
* Skill
* Role

### Relationships

* HAS_SKILL
* RELATED_TO
* REQUIRES
* ENDORSES

---

## Trust Algorithm

Trust Score is calculated using endorsements:

Trust Score = Number of Endorsements × 10

Influence Score is calculated using the trust scores of endorsers:

Influence Score = Sum of Endorser Trust Scores

This enables trust propagation through the professional network.

---

## Recruiter Metrics

Each candidate profile includes:

* Verified Skills
* Skill Count
* Endorsement Count
* Trust Score
* Influence Score

These metrics help recruiters evaluate both technical capability and community credibility.

---

## Future Enhancements

* AI-Powered Career Counsellor
* Resume Parsing
* Job Matching Engine
* Learning Resource Recommendations
* Graph-Based Fraud Detection
* Real-Time Notifications
* Organization Dashboards

---

## Running the Project

### Backend

```bash
npm install
npm run dev
```

### Frontend

```bash
npm install
npx expo start
```

### Environment Variables

```env
JWT_SECRET=your_secret_key
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password
```

---

## Team

Built as a hackathon project to demonstrate how graph databases can power trust-aware career intelligence and recruiter decision-making systems.
