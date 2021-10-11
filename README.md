
# Plantings

A simple e-commerce site that was developed using a microservice architecture. On the site a user you can sign up, sign in, and post any kind of plant for sale. The website supports a payment service run by the Stripe API. This website is running on a kubernetes cluster with pods built using Docker containers and is hosted by digital ocean. This repository is connected to my account on digital ocean and will initiate an action whenever there is push/merge to the Master repository using github actions. 


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
- Read through the infra/k8s since there are two files special Nginx-ingress files, one for the dev (develoment) and one for prod (production). 
- In the bottom of your ingress-srv.yaml there are URL hostnames that can be customized to change the URL.
## Tech Stack
Front-End 
- [React.js](https://reactjs.org/)
- [Next.js](https://nextjs.org/)
- [Bootstrap](https://getbootstrap.com)
Back-End
- [Kubernetes](https://kubernetes.io/)
- [Docker](https://www.docker.com/)
- [Nginx-Ingress](https://kubernetes.github.io/ingress-nginx/)
- [Nats-Streaming](https://docs.nats.io/nats-streaming-concepts/intro)
Hosting 
- [Digital-Ocean](https://www.digitalocean.com/)

  
## Screenshot

![App Screenshot](https://raw.githubusercontent.com/KyleJGlover/plantings_production/dev2/Plantings-Main.png)

  