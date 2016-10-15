# Votingapp with Node, Riot and Docker

Welcome to the Votingapp example project.

## Prerequisites

* [Docker](https://www.docker.com/)
* [Node](https://nodejs.org/)

## Installation

    docker-compose build

## Running

    docker-compose up -d

## Testing (backend)

    cd backend
    npm install
    npm test

## Run commands

### Prepare database

    psql -c "CREATE ROLE votingapp WITH CREATEDB LOGIN PASSWORD 'votingapp'"
    psql -c "CREATE DATABASE votingapp WITH OWNER votingapp"
    psql -c "CREATE DATABASE votingapp_test WITH OWNER votingapp"

### Running (Backend & Frontend)

    npm start

## Rancher

### Build

    dc build

### Tag

    docker tag votingapp_frontend mrako/votingapp_frontend
    docker tag votingapp_backend mrako/votingapp_backend

### Push to registry

    docker push mrako/votingapp_frontend
    docker push mrako/votingapp_backend

### Upgrade

    rancher-compose -f docker-compose.swarm.yml up --force-upgrade --pull

### Confirm

    rancher-compose -f docker-compose.swarm.yml up --confirm-upgrade

### Rollback

    rancher-compose -f docker-compose.swarm.yml up --rollback

