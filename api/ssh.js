const fs = require('fs');
const Client = require('ssh2').Client;
let sftpClient = require('ssh2-sftp-client');
const colorRegex = /\[[^m]+m/gm;
const { cleanString } = require('./helpers');

function SSH(config) {
  const ssh = this;
  ssh.debug = false;
  ssh.connectConfig = {
    host: config.host,
    port: config.port,
    username: config.user,
    privateKey: fs.readFileSync(config.keyFile),
    readyTimeout: 3000,
  };

  ssh.exec = async function(command) {
    const response = {
      success: true,
      stdOut: [],
      stdErr: [],
      errors: [],
      warnings: [],
      messages: []
    };
    return new Promise( (resolve, reject) => {   
      var conn = new Client();
      conn.on('ready', function() { 
        conn.exec(command, function(err, stream) {
          if (err) throw err;
          stream.on('close', function(code, signal) {
            conn.end();
          }).on('data', data => {
            let stdOut = [];
            ('' + data).trim().split("\n").forEach((line, i) => {
              if (line.trim()) {
                if (line.indexOf('WARNING:') > -1) {
                  response.warnings.push(line.replace('WARNING:', '').trim());
                } else if (line.indexOf('MESSAGE:') > -1) {
                  response.messages.push(line.replace('MESSAGE:', '').trim());
                } else {
                  stdOut.push(line.trim());
                }
              }
            });
            response.stdOut = response.stdOut.concat(stdOut);
          }).stderr.on('data', data => {
            const stdErr = ('' + data).trim().split("\n").filter((value, i) => {
              return value.trim();
            });

            stdErr.forEach(errMSG => {
              let err = errMSG.trim();
              if (err.indexOf('ERROR') > -1) {
                response.success = false;
                var errRegex = new RegExp("ERROR [(0-9):\s]+ (E:)*", 'g');
                err = err.replace(errRegex, '');
                response.stdErr.push(err.trim());
                var bashRegex = new RegExp('bash: line [0-9]+: ','g');
                err = err.replace(bashRegex, '');
                response.errors.push(err.trim());
              } else if (err.indexOf('WARNING:') > -1) {
                response.warnings.push(err.replace('WARNING:', '').trim());
              } else if (err.indexOf('MESSAGE:') > -1) {
                response.messages.push(err.replace('MESSAGE:', '').trim());
              } else {
                response.stdErr.push(err.trim());
              }
            });
          });
        });
      })
      .on('end', function() {
        if (response.success){
          resolve(response);
        } else {
          reject(response);
        }
      })
      .on('error', function(err){
        switch(err.errno){
          case -61:
            errMsg =`Connection refused at ${err.level}`;
            break;
          default:
            errMsg = err.message;
            break;
        }
        response.errors.push(errMsg);
        response.success = false;
        conn.end();
      })
      .connect(ssh.connectConfig);
    })
  }

  ssh.getFile = function(remotePath, localPath) {
    if (localPath[0] !== '/'){
      localPath = '/' + localPath;
    }
    localPath = process.cwd() + localPath;
    var path = localPath.split('/');
    path.pop();
    var dir = path.join('/');
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
    return new Promise( function(resolve, reject){
      var conn = new sftpClient();
      conn
      .connect(ssh.connectConfig)
      .then(() => {
        conn.fastGet(remotePath, localPath).then(result => {
          conn.end();
          resolve(localPath);
        })
        .catch(err => {
          reject(err);
        });
      });
    });
  }

  ssh.putFile = function(localPath, remotePath) {
    return new Promise( function(resolve, reject){
      var conn = new sftpClient();
      conn
      .connect(ssh.connectConfig)
      .then(() => {
        conn.fastPut(localPath, remotePath).then(result => {
          conn.end();
          resolve(remotePath);
        })
        .catch(err => {
          console.error(err.message);
          reject(err.message);
        });
      });
    });
  }
}
module.exports = SSH;
