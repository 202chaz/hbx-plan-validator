## Setup
Plan Validator is a Dockerized project.  You will need to download and install the [Docker Desktop for Mac](https://docs.docker.com/docker-for-mac/install/) in order to use and develop the code.

In the directory where you have cloned the repo, run the following command to create the docker containers for the service dependencies:

```
$ docker-compose build
```

To start the containers run the following command:

```
$ docker-compose up
```

If you want to start the containers as a background process run the following command:

```
$ docker-compose up -d
```

You can stop the serices with the following command:

```
docker-compose down
```

## Frontend UI

```
  Visit http://localhost:3000 from your browser.
```