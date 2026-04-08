const { spawn } = require('child_process');

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const services = [
  { name: 'API', args: ['--prefix', 'cet252/API', 'start'] },
  { name: 'CLIENT', args: ['--prefix', 'cet252/CLIENT', 'start'] }
];

const children = services.map((service) => {
  const child = spawn(npmCmd, service.args, {
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
