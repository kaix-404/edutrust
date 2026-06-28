# EduTrust

**AI-Powered Skill Verification & Trust Network**

EduTrust is a graph-based credential verification platform that helps learners, recruiters, and institutions establish trust in skills and achievements.

Instead of relying solely on self-reported resumes, EduTrust combines:

* Knowledge Graphs (Neo4j)
* Peer Endorsements
* Trust & Influence Analytics
* AI-Powered Skill Interviews
* Verified Skill Badges

to create a verifiable skill ecosystem.

---

## Problem

Traditional resumes rely heavily on self-declared skills.

Recruiters often struggle to determine:

* Whether a candidate truly possesses a skill
* How trustworthy endorsements are
* What skills are missing for a target role
* How candidates compare against each other

This creates a trust gap between learners and employers.

---

## Solution

EduTrust creates a graph-based trust network where:

* Users build verified skill profiles
* Peers endorse skills
* Neo4j calculates trust relationships
* AI conducts technical interviews
* Verified badges are awarded automatically
* Recruiters gain deeper insight into candidate credibility

---

## Key Features

### Authentication

* JWT-based authentication
* Secure login and registration
* Protected API routes
* Persistent sessions using AsyncStorage

### Knowledge Graph

Powered by Neo4j.

Relationships include:

* User → Skill
* User → User endorsements
* User → Badge
* Role → Skill

This enables advanced graph analytics and recommendations.

### Skill Management

Users can:

* Create profiles
* Add skills
* View verified skills
* Build professional knowledge graphs

### Endorsements

Users can endorse one another.

Each endorsement contributes to:

* Trust Score
* Influence Score
* Network Reputation

### Recruiter Dashboard

Recruiters can:

* Analyze candidates
* View skills
* Review endorsements
* Check trust metrics
* View verified badges
* Compare candidates

### Candidate Comparison

Side-by-side comparison based on:

* Skills
* Endorsements
* Trust Score
* Influence Score

### Career Pathing

Uses graph traversal to:

* Suggest learning paths
* Identify missing skills
* Recommend career transitions

### Skill Gap Analysis

Compare:

Target Role ↔ Current User Skills

and identify missing competencies.

### Role Recommendations

Recommend roles based on:

* Existing skills
* Skill overlap
* Knowledge graph relationships

### AI Skill Interviews

Powered by Puter AI.

Workflow:

1. User selects a skill
2. AI generates technical questions
3. User submits answers
4. AI evaluates responses
5. Score is generated
6. Badge is awarded automatically

### Verified Badges

Badges are awarded after successful AI verification.

Example:

* Node.js Verified
* React Verified
* Python Verified

Badges are stored in Neo4j and visible to recruiters.

---

## Tech Stack

### Frontend

* React Native
* Expo Router
* TypeScript
* AsyncStorage

### Backend

* Node.js
* Express.js
* JWT Authentication

### Database

* Neo4j Graph Database

### AI

* Puter AI

---

## Architecture

React Native (Expo)
↓
Express API
↓
JWT Authentication
↓
Neo4j Graph Database
↓
Graph Analytics
↓
Puter AI Evaluation

---

## AI Verification Flow

User Selects Skill
↓
AI Generates Interview
↓
Candidate Answers
↓
AI Evaluates Responses
↓
Score Generated
↓
Verified Badge Awarded
↓
Stored in Neo4j

---

## Recruiter Workflow

Recruiter
↓
Candidate Search
↓
Trust Analysis
↓
Influence Analysis
↓
Skill Verification
↓
Badge Validation
↓
Hiring Decision

---

## Future Enhancements

* Self-Sovereign Identity (SSI)
* Zero-Knowledge Proof Verification
* Verified Job Marketplace
* AI Career Coach
* Institutional Credential Issuance
* QR-Based Credential Sharing

---

## Authors

Built by Kai for hackathon submission (HACKHAZARDS'26).

EduTrust aims to bridge the trust gap between education and employment through graph intelligence and AI-powered verification.
