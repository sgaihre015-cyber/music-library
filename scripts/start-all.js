const fs = require('fs');
const path = require('path');
const { spawn, spawnSync } = require('child_process');

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const services = [
  { name: 'API', prefix: path.join(__dirname, '..', 'cet252', 'API') },
  { name: 'CLIENT', prefix: path.join(__dirname, '..', 'cet252', 'CLIENT') }
];

function installIfNeeded(service) {
  const nodeModulesPath = path.join(service.prefix, 'node_modules');

  if (fs.existsSync(nodeModulesPath)) {
    return;
  }

  console.log(`[${service.name}] Installing dependencies (npm ci)...`);
  const installResult = spawnSync(npmCmd, ['--prefix', service.prefix, 'ci'], {
    stdio: 'inherit',
    env: process.env
  });

  if (installResult.status !== 0) {
    process.exit(installResult.status || 1);
  }
}

services.forEach(installIfNeeded);

const children = services.map((service) => {
  const child = spawn(npmCmd, ['--prefix', service.prefix, 'run', 'start'], {
    stdio: 'inherit',
    env: process.env
  });

  child.on('exit', (code) => {
    if (code && code !== 0) {
      console.error(`${service.name} exited with code ${code}`);
      shutdown(code);
    }
  });

  return child;
});

let shuttingDown = false;

function shutdown(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  children.forEach((child) => {
    if (!child.killed) {
      child.kill('SIGTERM');
    }
  });

  process.exit(exitCode);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
