'use strict'
//works in strict mode
const { TransactionProcessor } = require('sawtooth-sdk/processor')
const villaRegisterHandler = require('./villaRegisterHandler');

if (process.argv.length < 3) {
  console.log('missing a validator address')
  process.exit(1)
}

const address = process.argv[2]

const transactionProcessor = new TransactionProcessor(address);
// • The Transaction Processor receives the payload, decodes it and modifies the
// state to write the data.

transactionProcessor.addHandler(new villaRegisterHandler());
// addHandler method will add the given handler to the Transaction Processor so
// it can receive specific transaction processing request.
transactionProcessor.start();


// TransactionProcessor is a generic class for communicating with a validator.
// • It routes transaction processing requests to a registered handler class.
// • Multiple handlers can be connected to an instance of the processor class.
