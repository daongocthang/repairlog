const Service = require('node-windows').Service;

const svc = new Service({
    name: 'EpressJS Server',
    description: 'Run ExpressJS on Windows Service.',
    script: 'F:\\CodeLabs\\NodeJS\\repairlog\\build\\index.js',
});

svc.on('uninstall', function () {
    console.log('Uninstall complete.');
    console.log('The service exists: ', svc.exists);
});

svc.uninstall();
