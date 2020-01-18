const {createHash} = require('crypto')//create the hash for a specific data
const {CryptoFactory, createContext } = require('sawtooth-sdk/signing')//importing two functions called ​ CryptoFactory​ and createContext​ from swtooth-sdk/signing.
//These are used for creating a private key and creating a signer object for the corresponding key
const protobuf = require('sawtooth-sdk/protobuf')//​ protobuf​ is imported from the sdk for serializing the data in a specific format
const fs = require('fs')
const fetch = require('node-fetch');//node-fetch is used to send http request​ to API servers. 
const {Secp256k1PrivateKey} = require('sawtooth-sdk/signing/secp256k1')	
const {TextEncoder, TextDecoder} = require('text-encoding/lib/encoding')
var encoder =new TextEncoder('utf8');

var FAMILY_NAME = 'villaregister';
// the   first   six   characters   are   reserved   for   a   namespace   for   the  
// transaction family. The remaining 64 characters are up to each family to define. 

function hash(v) {//The function hash is used to generate a SHA-512 hash of the value passed. 
  return createHash('sha512').update(v).digest('hex');
}

function createTransaction(familyName,inputList,outputList,signer,payload,familyVersion = '1.0')
{
  const payloadBytes = encoder.encode(payload)
    //create transaction header
    const transactionHeaderBytes = protobuf.TransactionHeader.encode({
//       Transaction   Header   is   encoded using the TransactionHeader protobuf(available  
// in  the sawtooth sdk)to create transactionHeaderBytes.  
      familyName: familyName,
      familyVersion: familyVersion,
      inputs: inputList,
      // The input address says which are the addresses that are 
      // allowed to read from the transaction
      outputs: outputList,
//       output address says which addresses are 
// allowed to write to the transaction.better give the TP’s address which makes every data readable and writable
      signerPublicKey: signer.getPublicKey().asHex(),//Signer Public Key, who is signing the transaction
      nonce: "" + Math.random(),
//       nonce, which says the uniqueness of the transaction. Sawtooth will not execute a 
// transaction if there was any other transaction with the same header. Thus this will 
// help us to make the transaction unique.
      batcherPublicKey: signer.getPublicKey().asHex(),
//       who is signing this batch of transaction. In our example both are same
      dependencies: [],
//       Dependencies are any other transactions that current transaction is depending on, so 
// this will be in queue until others are completed.
      payloadSha512: hash(payloadBytes),
     // SHA512 Hash of the payload in order to verify if the payload is received properly at TP. 

    }).finish();
    // create transaction
//     Once   the   TransactionHeader   is   constructed,   its   bytes   are   then   used   to   create   a  
// signature.   Resulting   signature   is   stored   in   the   header   signature   which   also   act   as   an  
// Id of the transaction
    const transaction = protobuf.Transaction.create({
      header: transactionHeaderBytes,
      headerSignature: signer.sign(transactionHeaderBytes),
      payload: payloadBytes
    });
    const transactions = [transaction];
    //create batch header
//     a BatchHeader needs only the public key of the signer and the list of Transaction IDs, in the same order they are 
//     listed in the Batch
    const  batchHeaderBytes = protobuf.BatchHeader.encode({
      signerPublicKey: signer.getPublicKey().asHex(),
      transactionIds: transactions.map((txn) => txn.headerSignature),
    }).finish();
    const batchSignature = signer.sign(batchHeaderBytes);
    //create batch 

    const batch = protobuf.Batch.create({
      header: batchHeaderBytes,//BatchHeader bytes is signed by the signer
///      resulting signature is the headerSignature. It also acts as an Id of the batch. 
      headerSignature: batchSignature,
      transactions: transactions,
    });
    //create batchlist
    const batchListBytes = protobuf.BatchList.encode({
      batches: [batch]
    }).finish();
    sendTransaction(batchListBytes);	
  }
  
  /*
  function to submit the batchListBytes to validator
  */
  async function sendTransaction(batchListBytes){
    let resp =await fetch('http://rest-api:8008/batches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream'},
      body: batchListBytes
    })
    console.log("response", resp);
  }

//2  
class UserClient{//create a class and name it ​ UserClient. Our methods and functions will be written inside this class. 
  constructor(Key){
    const context = createContext('secp256k1');
    const secp256k1pk = Secp256k1PrivateKey.fromHex(Key.trim());
    this.signer = new CryptoFactory(context).newSigner(secp256k1pk);
    this.publicKey = this.signer.getPublicKey().asHex();
    this.address = hash(FAMILY_NAME).slice(0, 6) ;
  }
//   createContext returns a context instance by algorithm name. Secp256k1PrivateKey is used 
// to get the privateKey. We use the CryptoFactory class to create a new signer for the private 
// key. ​ this.signer​ is then used to derive the public key as hexadecimal.  

  //  houseNo,owner_name,adhar,sq_ft,price_rs,currentstatus   --}}

  async addvilla(action,houseNo,owner_name,adhar,sq_ft,price_rs,currentstatus){
    console.log("inside addvilla");
    try{
      var address = this.address;
      var signer = this.signer;
      console.log("inside addvilla");
      var inputAddressList = [address];
      var outputAddressList = [address];
      console.log("inside addvilla");

      let payload = [action,houseNo,owner_name,adhar,sq_ft,price_rs,currentstatus].join(',')
      createTransaction(FAMILY_NAME,inputAddressList,outputAddressList,signer,payload);
    }
    catch(error) {
      console.error(error);
    } 	
  
  }
  async validation(action,HouseNo){
    try{
        console.log("validateVilla function");
        var address = this.address;
        console.log("validateVilla function1111");
      var signer = this.signer;
      console.log("validateVilla function2222222");
        var inputAddressList = [address];
        console.log("validateVilla function333333");
        var outputAddressList = [address];
        console.log("validateVilla function44444");
        let payload = [action,HouseNo].join(',')
        console.log("PAYLOAD-------",payload)
        createTransaction(FAMILY_NAME,inputAddressList,outputAddressList,signer,payload);

    }
    catch(error) {
      console.error(error);
    } 
  }


  /**
   * Get state from the REST API
   * @param {*} address The state address to get
   * @param {*} isQuery Is this an address space query or full address
   */
  async getState (address, isQuery) {
    let stateRequest = 'http://rest-api:8008/state';
    if(address) {
      if(isQuery) {
        stateRequest += ('?address=')
      } else {
        stateRequest += ('/address/');
      }
      stateRequest += address;
    }
    let stateResponse = await fetch(stateRequest);
    let stateJSON = await stateResponse.json();
    return stateJSON;
  }

  async getvillaListings() {
    let villaAddress = hash(FAMILY_NAME).slice(0, 6) + "00";
    return this.getState(villaAddress, true);
  }

  async getEmpvillaListings() {
    let keyHash  = hash(this.publicKey);
    let villaAddress = hash(FAMILY_NAME).slice(0, 6) + "01" + keyHash.slice(0,32);
    return this.getState(villaAddress, true);
  }

}

module.exports.UserClient = UserClient;