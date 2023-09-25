
# Plantings

A simple e-commerce site that was developed using a microservice architecture. On the site a user you can sign up, sign in, and post any kind of plant for sale. The website supports a payment service run by the Stripe API. This website is running on a kubernetes cluster with pods built using Docker containers and is hosted by digital ocean. This repository is connected to my account on digital ocean and will initiate an action whenever there is push/merge to the Master repository using github actions. 
- Website URL: https://www.plantings.page/ (Must type thisisunsafe after clicking on the page since https protocals haven't been created yet) (This website is no longer up since it cost money to run)

## Overview
- The frontend used React and Next.js to present content to the user.
- Each service is created using Node and Express.
- Data for each service is stored in a instance of MongoDB or Redis.
- The entire application is deployed and run in Docker Containers that are executed in a Kubernetes cluster.
- All Services are written in Typescript except for the Webpages served to the client with Next.js that are written in Javascript.

## Main Objectives
- Implement a multi-service architectural design.
- Solve the challenge of async, event based communication between services. (Nats-Streaming)
- Use Docker Containers within a Kubernetes cluster and deploy it to digital ocean using github actions.
- Develop reusuable code in for other large project.

## Some of what I learned
- Patterns for creating scalable microservices for a variety of app domains.
- Build Server-Side-Rendered React application using Hooks and Next.js.
- Custom implementation of event bus.
- Create a consistent strutured responses from the different API's.
- Best Practices for communication between different services (limit single points of failureand dependencies)
- Configure and scale a service with Kubernetes Deployments.
- Document and enforce structural constraints on events shared across microservice.
- Limit access to my API's with JWT-based authentication.
## Installation

1. Clone the repo
   ```sh
   git clone https://github.com/KyleJGlover/plantings_production.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
Couple of preperations for a developer:
- The developer will need to change the baseURL in client service's build-client file
- Read through the infra/k8s since there are two special files called Nginx-ingress, one for the dev (develoment) and one for prod (production). 
- In the bottom of your ingress-srv.yaml there are URL hostnames that can be customized to change the URL.
## Tech Stack
1. Front-End 
- [React.js](https://reactjs.org/)
- [Next.js](https://nextjs.org/)
- [Bootstrap](https://getbootstrap.com)
2. Back-End
- [Express](https://expressjs.com/en/starter/installing.html)
- [Kubernetes](https://kubernetes.io/)
- [Docker](https://www.docker.com/)
- [Nginx-Ingress](https://kubernetes.github.io/ingress-nginx/)
- [Nats-Streaming]([https://docs.nats.io/nats-streaming-concepts/intro](https://docs.nats.io/))
- [MongoDB](https://www.mongodb.com/)
4. Hosting 
- [Digital-Ocean](https://www.digitalocean.com/)
5. Development
- [Skaffold](https://skaffold.dev/)

  
## Screenshot

![App Screenshot](https://raw.githubusercontent.com/KyleJGlover/plantings_production/dev2/Plantings-Main.png)

  
