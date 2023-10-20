## Application Overview

Our application is built using the Nest.js framework and uses PostgreSQL as its database. It provides various endpoints that you can interact with using the Swagger interface.

## Prerequisites

Before you begin, ensure you have the following software installed on your system:

- Node.js
- Yarn (or npm)
- Docker

## Environment Configuration
 To set up these variables, create an .env file in the root directory of the project. Inside this file, add the following environment variable:

COINMARKETCAP_API_KEY=your_api_key_here

## Setting up the Database

We use PostgreSQL as our database, and you can start it using Docker Compose. To do this, follow these steps:

1. Open a terminal window.

2. Navigate to the root directory of the project where the `docker-compose.yml` file is located.

3. Run the following command to start the PostgreSQL container:

   ```bash
   docker-compose up
   ```

   This command will start the PostgreSQL container

## Running the Application

To run the Nest.js application, follow these steps:

1. Open a terminal window.

2. Navigate to the root directory of the project.

3. Run the following command to install the project dependencies using Yarn:

   ```bash
   yarn install
   ```

4. Once the dependencies are installed, start the application with the following command:

   ```bash
   yarn run start
   ```

   This command will start the application, and it should be accessible at `http://localhost:3000`.

## Interacting with the Endpoints

We have integrated the Swagger plugin for easy interaction with our application's endpoints. You can access the Swagger documentation when the app is running at the following URL :

[Swagger Documentation](http://localhost:3000/api/)

This documentation will provide you with detailed information about the available endpoints and how to use them.
