- Create a free tier EC2 Linux instance (data property I put `yum install nodejs` but didn't work, maybe I should have used `sudo yum install nodejs`)
- Connect to instance using AWS terminal and install nodejs using command from previous step
- Install express on EC2
- [To copy a file to EC2 instance](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/connect-linux-inst-ssh.html#linux-file-transfer-scp), use key-pair-name private key (generated from EC2 launch) and use `scp` command. Copy a simple server.mjs file to launch an express server replying with a simple `hello world` message
- Launch Node.js app using `sudo PORT=80 node server.mjs` (sudo to be able to run on port 80)
- Test EC2 public IP to see if app is responding properly
- Create a [Remix](https://remix.run/docs/en/main/start/quickstart#installation) app 
- Use an environment variable for [port](https://remix.run/docs/en/main/other-api/serve#port-environment-variable)
- Install Remix Express adapter on EC2 instance `npm i @remix-run/express`. Also install the following packages `npm i @remix-run/node @remix-run/react isbot@4 react react-dom` (or copy package.json from the code repository to EC2 without `@remix-run/serve` or put it as a dev dependency since using express server)
- Copy the build and public folders to EC2 instance. Command example for build folder: `scp -i /path/key-pair-name.pem -r /path/build ec2-user@instance-public-dns-name:path/`
- Modify package.json on EC2 with `{"type":"module"}`
- Launch Node.js app and check in browser if it responds correctly (using EC2 public IPV4 address)
- Change or create Record from Route 53 to point to IPV4 address
- Encountered difficulty, how to keep the Node app running after closing terminal. After some investigations (googling how to keep Node.js server running on EC2), I discovered [PM2](https://pm2.keymetrics.io/) which helped to run in background the application.
- Connect to EC2 instance and type the following command in the app folder `sudo PORT=80 npx pm2 start server.mjs`. This command does not seem to work as is on startup when included in the user data script.
- Attach an elastic IP address to EC2 instance so that the IP does not change every time EC2 is stopped and restarted.
- Install as dev dependency `@remix-run/serve` to avoid having it on EC2 server as I am using `express` instead. Use npm `install --production` only the required dependencies (i.e no devDependencies installed).
- When pushing new modifications, be careful about the hash versioning into the files. Also, we need to kill old app [listening on port 80](https://www.cyberciti.biz/faq/find-linux-what-running-on-port-80-command/) and restart the app again using `sudo PORT=80 npx pm2 start server.mjs`
- I could also try to use an API to reboot EC2 instance if I don't know how to kill and restart app.
- I found a [gist](https://gist.github.com/raviagheda/c69ae5e884f4490b1af656dbd80c00dd) on how to SSH to an EC2 instance using [GitHub actions](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions). As prerequisite, I had to install git using `sudo yum install git` on EC2 instance.
- I did a first git clone of the repository in a specific folder on EC2 instance: `git clone https://github.com/pfongkye/my-learnings.git`
- I added pm2 as dependency to project to be able to run the application on EC2 instance using a script
- There could be conflicting instances running due to previous pm2 start. I tried to stop all processes managed by pm2 first before running a new one.

# Development Experience (DX)

- Use [TypeScript](https://remix.run/docs/en/main/guides/typescript) for better tooling and to catch some bugs earlier and add a [GitHub action](https://docs.github.com/en/actions/using-workflows/about-workflows) for type checking.
- Add some [ADRs](https://adr.github.io/) for decision logs.