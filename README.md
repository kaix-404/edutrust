# EduTrust

## Overview

EduTrust is a graph-powered skill intelligence platform built using **Neo4j**, **Node.js**, **Express.js**, **React Native (Expo)**, and **TypeScript**. The platform helps learners, professionals, and recruiters analyze skills, endorsements, trust, career readiness, and personalized learning paths through graph relationships.

Instead of storing data in traditional relational tables, EduTrust models users, skills, roles, and endorsements as interconnected nodes, enabling powerful graph-based analytics and recommendations.

---

## Features

### User & Skill Management

* Create users and skills
* Assign skills to users
* Store relationships using Neo4j graph structures

### Skill Dependency Graph

* Define prerequisite relationships between skills
* Example:

  * Machine Learning → Python
  * Python → Data Structures
  * Data Structures → Problem Solving

### Career Role Management

* Create job roles and required skills
* Associate multiple skills with a role
* Example:

  * Backend Developer → Node.js, Express.js, MongoDB
  * ML Engineer → Python, Machine Learning

### Skill Gap Analysis

* Compare a user's skills against a target role
* Calculate:

  * Match Score
  * Matched Skills
  * Missing Skills

### Personalized Learning Roadmap

* Generate prerequisite-based learning paths
* Recommend the next skill to learn
* Uses graph traversal to determine dependency chains

### Endorsement System

* Users can endorse other users
* Prevents self-endorsement
* Prevents duplicate endorsements using Neo4j relationship merging

### Trust Score Engine

* Calculates trust scores based on endorsements
* Provides a simple reputation metric for users

### Recruiter Dashboard

Recruiters can:

* Search candidates
* View skills
* View endorsements
* View trust scores
* Assess profile strength

### Graph Explorer

Interactive visualization of:

* Users
* Skills
* Skill relationships

### Endorsement Network Visualization

Visual graph showing:

* Who endorsed whom
* Directional endorsement relationships
* Network statistics

### Influence Ranking

Graph-based reputation analytics inspired by network ranking concepts.

* Identifies influential users within the endorsement network
* Ranks users based on endorsement relationships

---

## Graph Model

```text
(User)-[:HAS_SKILL]->(Skill)

(Skill)-[:REQUIRES]->(Skill)

(Role)-[:REQUIRES]->(Skill)

(User)-[:ENDORSES]->(User)
```

---

## Tech Stack

### Frontend

* React Native
* Expo Router
* TypeScript
* React Native SVG
* Axios

### Backend

* Node.js
* Express.js
* Neo4j Driver

### Database

* Neo4j AuraDB

### Query Language

* Cypher

---

## Key Learning Outcomes

This project demonstrates:

* Graph database design
* Neo4j relationship modeling
* Cypher query development
* Graph traversal algorithms
* Recommendation systems
* Skill dependency analysis
* Reputation and trust modeling
* Full-stack application development
* Mobile application development using React Native

---

## Future Enhancements

* Neo4j Graph Data Science (PageRank)
* AI-powered skill recommendations
* Recruiter candidate ranking
* Trust-weighted endorsements
* Learning progress tracking
* Real-time graph updates
* Advanced network analytics

---

## Author

**Kai**

A graph-native learning, trust, and career intelligence platform built with Neo4j, React Native, and Node.js.
