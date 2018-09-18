# Truper

__A simple tool to compile vyper contracts to truffle compatible artifacts.__

This is a somewhat hacky approach to working with vyper in truffle. You need to have the `vyper` compiler installed and available in your terminal's environment. If you can't run `$ vyper -h` this tool will be useless to you. 

This is a bit of a stop-gap, as truffle will likely include this functionality in the future.

## Installation

`npm i -g truper`

## Usage

Compile all `.v.py` files found in `./contracts` or an immediate child directory:

$ `truper`

Compile all `.v.py` files in a specified directory:

$ `truper /path/to/contracts`

The compiled output is always written to `./build/contracts`.

If the contract file name was `myContract.v.py`, the compiler output will be written to `myContract.json`.

## Importing for use in Truffle tests

`const MyContract = artifacts.require('myContract');`

The contract can then be used in truffle just as any other solidity contracts compiled by truffle, (though I have not tested with migrations at all).
