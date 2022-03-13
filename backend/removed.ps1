docker-compose down
docker rm -f $(docker ps -a -q)
docker volume rm $(docker volume ls -q)
docker rmi backend_server
docker rmi $(docker images -f "dangling=true" -q) 