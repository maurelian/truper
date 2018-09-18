#!/usr/bin/env node

const fs = require('fs');
const shell = require('shelljs');
const colors = require('colors'); // eslint-disable-line

const contractsPath = process.argv[2];

if (contractsPath) {
  // a path was specified on the command line, build only the vyper files in this dir.
  build(contractsPath);
} else {
  // no path was specified, build all vyper files in contracts dir and immediate child dirs
  build();
  const dirs = fs.readdirSync('./contracts').filter(item => fs.statSync(`./contracts/${item}`).isDirectory());
  for (index in dirs){
    build(`./contracts/${dirs[index]}`);
  }
}

/**
 * Builds all files in a directory
 * @param  {string} contractsPath The immediate parent directory of contract files to be compiled
 * @param  {string} buildPath     The directory to write the output to.
 */
function build(contractsPath = './contracts', buildPath = './build/contracts') {
  // find vyper files:
  const files = fs.readdirSync(contractsPath);
  const vyperFiles = files.filter(file => file.slice(-5) == '.v.py');

  // check that the buildPath exists
  if(!fs.existsSync(buildPath)){
    throw new Error('The specified build directory does not exists. Default is ./build/contracts')
  }

  for (const file of vyperFiles) {
    const filePath = `${contractsPath}/${file}`;
    buildWithVyper(filePath, buildPath);
  };
};

// compiles a single vyper file
function buildWithVyper(source, buildPath) {
  console.log(`Compiling vyper from source code: ${source}`.yellow); // eslint-disable-line

  // These property names are chosen to match the Truffle contract schema
  // https://github.com/trufflesuite/truffle-contract-schema
  const abi = JSON.parse(shell.exec(`vyper -f json ${source}`, { silent: true })
    .stdout.replace('\n', ''));
  const bytecode = shell.exec(`vyper -f bytecode ${source}`, { silent: true })
    .stdout.replace('\n', '');
  const deployedBytecode = shell.exec(`vyper -f bytecode_runtime ${source}`, { silent: true })
    .stdout.replace('\n', '');

  // modify from 'path/to/contract_name.v.py' to 'contract_name'
  const contractName = source.split('/').pop().split('.')[0];

  const contractDefinition = {
    contractName, abi, bytecode, deployedBytecode,
  };

  fs.writeFileSync(
    `${buildPath}/${contractName}.json`,
    JSON.stringify(contractDefinition, null, '  '),
  );
  console.log(`Writing output to: ${buildPath}/${contractName}.json`.green); // eslint-disable-line
}

