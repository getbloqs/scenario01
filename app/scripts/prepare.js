var fs = require('fs');

var mode = 'dev';
var target = 'www';

if (mode == 'dev') {
    target = 'www';
}

var pathConfigDev = __dirname + '/../contract.config.json';
var pathTargetDev = __dirname + '/../' + target + '/contract.config.json';
var pathWeb3Source = __dirname + '/../node_modules/web3/dist/web3.min.js';
var pathWeb3Target = __dirname + '/../' + target + '/web3.min.js';
var pathContractsTargetDir = __dirname + '/../' + target + '/contracts';
var pathContractsSourcedir = __dirname + '/../../contract/build/contracts';

fs.createReadStream(pathConfigDev).pipe(fs.createWriteStream(pathTargetDev));
fs.createReadStream(pathWeb3Source).pipe(fs.createWriteStream(pathWeb3Target));

if (!fs.existsSync(pathContractsTargetDir)) {
    fs.mkdirSync(pathContractsTargetDir);
}

var jsonFiles = fs.readdirSync(pathContractsSourcedir);
for (var i = 0; i < jsonFiles.length; i++) {
    var file = pathContractsSourcedir + '/' + jsonFiles[i];
    var stat = fs.statSync(file);

    if (stat.isFile()) {
        fs.createReadStream(file).pipe(fs.createWriteStream(pathContractsTargetDir + '/' + jsonFiles[i]));
    }
}
