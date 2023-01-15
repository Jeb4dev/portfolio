# FastApi and HTTP Server Setup with Docker Compose

## Deploy

- Edit `.env.prod` and `.env.prod.db` files.

## Development

### Build

- ``docker-compose up -d --build``
- ``docker-compose down -v``
- ``docker-compose logs -f``


## Production

### Build

- ``docker-compose -f docker-compose.prod.yml up -d --build``
- ``docker-compose -f docker-compose.prod.yml down``
- ``docker-compose -f docker-compose.prod.yml logs``

## Docker

- List Container IP Addresses
  - ``docker inspect -f '{{.Name}} - {{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $(docker ps -aq)``
- Go inside container
  - ``docker exec -it {{name}} bash``
