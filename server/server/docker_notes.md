
Build services (i.e. containers):

docker-compose build

Start the docker instance (-d )

docker-compose up -d

Start and build:

docker-compose up --build

Clean restart:

docker-compose down
docker rm -f $(docker ps -a -q)
docker volume rm $(docker volume ls -q) 
docker-compose up -d```

Remove server_server image:

Docker remove dangling images:
docker rmi $(docker images -f “dangling=true” -q)

Start the docker instance with a differently named compose file:
docker-compose -f docker-compose.yml up --build


If you need to drop a database

select 'drop database "'||datname||'";'
from pg_database
where datistemplate=false;

Generates commands for dropping all databases
Then run whichever one you need



