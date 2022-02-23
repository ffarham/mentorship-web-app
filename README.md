# cs261_GroupProject

## Prerequisites

Install [Node.js v14](https://nodejs.org/download/release/v14.17.5/). Ensure you check the checkbox which lets the system install neccessary build tools. Check Node.js is installed by running `node -v` in terminal.  
  
(Only back-end) Install [PostgreSQL](https://www.postgresql.org/download/). During installation, ensure the following holds for consistency:  
- Username: postgres  
- Password: postgres  
- Default port: 5432  
 
 Run `psql -U postgres` in terminal to check if it has been installed successfully.

### Docker:
Enable virtualisation in your BIOS
Go into **Turn Windows Features On and Off** (search this in the start menu) and tick virtual machine platform, windows subsystem for linux and HyperV
Install Docker, and WSL if prompted:
https://docs.docker.com/desktop/windows/install/


## Start-up
- Run `npm install --global yarn` to install Yarn. Check Yarn is installed by running `yarn -v`.
- (Front-End) Run `yarn install` in client directory to install dependencies.
- (Back-end) Run `yarn install` in server directory to install dependencies.

## Server
In the /backend directory:
Build:
Run `docker-compose build`

Start:   
`docker-compose up` or `docker-compose up -d ` to run in the background. Add `--build` to build at the same time.  
Stop:  
`docker-compose down`  
If you ctrl+c then the images and volumes won't be removed.  
Clean restart:  
`docker rm -f $(docker ps -a -q)` (removes stopped containers)  
`docker volume rm $(docker volume ls -q)` (removes volumems)  
View current containers:  
`docker ps -al`  
View Current Images:  
`docker images`  
Remove image (not usually necessary):  
`docker rmi <imagename>`  
Remove any dangling images (run this if `docker images` displays images with a tag of <none>):  
`docker rmi $(docker images -f “dangling=true” -q)`  
Start and build the docker instance with a compose file not named 'docker-compose.yml':  
`docker-compose -f <filename> --build`  

### Database connection  
Run:  
`docker exec -it backend-db-1 psql -U postgres`  

You can connect to the server with https://localhost:5000 as usual  

## Development
The project follows the git model described [here](https://nvie.com/posts/a-successful-git-branching-model/). Ensure you have read and understood the model before starting. 

### Front-End
- Run `yarn start` in client directory to launch the website on localhost:3000. 
- Check client/src/index.js for implemented pages.

### Back-End
Run `yarn start` in server directory to get the server running.

The stack being used is:  
- [REACT](https://reactjs.org/docs/hello-world.html) 
- Node.js + Express.js
- PostgreSQL

## Troubleshooting
- If `yarn install` complains about Python. Remove Python3 PATH in the system environment variables. Install Pyhton2 v2.7 and add the "C:\...\Python27" and "C:\...\Python27\Scripts" to the system environment variable PATH.
- If yarn complains about nodemon not being installed, try running `yarn global add nodemon`.
- If Powershell doesn't want to run yarn because it doesn't like scripts, open powershell as an administrator and run `Set-ExecutionPolicy Unrestricted`. 
- If Postman is not getting a response and isn't saying why, turn off `SSL Certificate Verification` in settings.




