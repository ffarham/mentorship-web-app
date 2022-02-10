# cs261_GroupProject

## Prerequisites

Install [Node.js](https://nodejs.org/en/download/). Check Node.js is installed by running `node -v` in terminal.  
  
Install [PostgreSQL](https://www.postgresql.org/download/). During installation, ensure the following holds for consistency:  
- Username: postgres  
- Password: postgres  
- Default port: 5432  
 
 Run `psql -U postgres` in terminal to check if it has been installed successfully.

### Docker:
Enable virtualisation in your BIOS
Go into Turn Windows Features On and Off` (search this in the start menu) and tick virtual machine platform, windows subsystem for linux and HyperV
Install Docker, and WSL if prompted:
https://docs.docker.com/desktop/windows/install/


## Start-up
- Run `npm install --global yarn` to install Yarn. Check Yarn is installed by running `yarn -v`.
- Run `yarn install` in both client and server directories to install dependencies.

## Server
Build:
Run `docker-compose build` in the /server directory

Start: 
`docker-compose up` or `docker-compose up -d ` to run in the background. Add `--build` to build at the same time.
Stop:
`docker-compose down`
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

You can connect to the server with https://localhost:5000 as usual

## Development
The project follows the git model described [here](https://nvie.com/posts/a-successful-git-branching-model/). Ensure you have read and understood the model before starting. 

The stack being used is:  
- [REACT](https://reactjs.org/docs/hello-world.html) + [TypeScript](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html) + [Next.js](https://nextjs.org/docs/getting-started)
- Node.js + Express.js
- PostgreSQL

## Troubleshooting
- If yarn complains about any dependencies in `packages.json` not being installed (e.g. express), run `yarn install` to install them.
- If yarn complains about nodemon not being installed, try running `yarn global add nodemon`.
- If Powershell doesn't want to run yarn because it doesn't like scripts, open powershell as an administrator and run `Set-ExecutionPolicy Unrestricted`. 

