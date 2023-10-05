const Service = require('node-windows').Service;

const svc = new Service({
    name: 'EpressJS Server',
    description: 'Run ExpressJS on Windows Service.',
    script: 'F:\\CodeLabs\\NodeJS\\repairlog\\build\\index.js',
});

svc.on('install', function () {
    svc.start();
});

svc.install();
