# fridgeHub-api

fridgeHub-api is a back-end application designed to help users find and create recipes based on the ingredients they have in their fridge. It is built using Node.js, Express, and TypeScript.

## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Description

Cooking application that finds recipes and creates recipes depending on what the user has in their fridge.

## Installation

To get started with the project, clone the repository and install the dependencies:

Once in the folder back-end
```bash
npm install
```
then 
```bash
npm start
```
In the env file this is what you can add : 

```env
PORT=8000
API_VERSION=api/v1
CLIENT_URL=http://localhost:8081
# Database
# For François
# MONGO_URL=mongodb+srv://Frenchua:EPIt3q!P4naM4@fridgehub.rudbzax.mongodb.net/
# For Lekrikri
#MONGO_URL=mongodb+srv://lekrikri:MXNHmjEfT6LvwfwD@fridgehub.rudbzax.mongodb.net/
# For MK
# For Jean
MONGO_URL=mongodb+srv://Jin:lQ0MytPqCqsImbeB@fridgehub.rudbzax.mongodb.net/
JWT_SECRET=secret123
OPENAI_API_KEY=sk-DmmZpKtzz0YdyItHoGNaxwgsolf2lNBL1XbRjuel4LT3BlbkFJHgfJMKp6rMd8Wgupr7T7O3F42xU93ew3tTtKH73TcA
```
