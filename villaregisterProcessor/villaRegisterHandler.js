// Handler class contains:
// 1. A constructor
// 2. An apply method

'use strict'
const { TransactionHandler } = require('sawtooth-sdk/processor/handler');

const {
  InvalidTransaction,
  InternalError
} = require('sawtooth-sdk/processor/exceptions')
const crypto = require('crypto')
const {TextEncoder, TextDecoder} = require('text-encoding/lib/encoding')

var encoder = new TextEncoder('utf8')
var decoder = new TextDecoder('utf8')

var _FAMILY_NAME = 'villaregister';
var _NAMESPACE = _hash(_FAMILY_NAME).substring(0,6);

function _hash(data) {
  return crypto.createHash('sha512').update(data).digest('hex');
}

function getvillaAddress(houseNo){
  let nameHash = _hash(_FAMILY_NAME)
  let villaHash = _hash(houseNo)
  let field ="00"
  return nameHash.slice(0,6) +field+villaHash.slice(0,62)
}

function getEmployeevillaAddress(houseNo,userPublicKey){
   let nameHash = _hash(_FAMILY_NAME)
   let villaHash = _hash(houseNo)
   let pubKeyHash = _hash(userPublicKey)
   let field ="01"
   return nameHash.slice(0,6) +field+pubKeyHash.slice(0,32)+villaHash.slice(0,30)
}

// function writeToStore(context, address, data){
//   let dataBytes = encoder.encode(data)
//   let entries = {
//     [address]: dataBytes
//   }
//   return context.setState(entries);
// }

function writeToStore(context, address, data){
  let data_len = data.length
  //message bytes
  let dataB = encoder.encode(data)
  //event attribute
  let attribute = [['message_length',data_len.toString()]]
  let dataBytes = encoder.encode(data);
  //adding event
  context.addEvent('villaregister/WordLength',attribute,dataB)
  
  let entries = {
      [address]: dataBytes 
    }
    return context.setState(entries);
  }
  // The setState() requests that each address in the provided dictionary be set in
  // validator state to its corresponding value.
  // setState(entries)



//houseNo,owner_name,adhar,sq_ft,price_rs,currentstatus
function addvilla (context,owner_name,houseNo,adhar,sq_ft,price_rs,currentstatus) {
  console.log("add house",houseNo)
  let villa_Address = getvillaAddress(houseNo)
  console.log("Address check",villa_Address)
  let villa_detail =[houseNo,owner_name,adhar,sq_ft,price_rs,currentstatus]
  //console.log("villa name already exists!")

  return context.getState([villa_Address]).then(function(data){
    if(data[villa_Address] == null || data[villa_Address] == "" || data[villa_Address] == [] || data[villa_Address] == null || data[villa_Address] == "" || data[villa_Address] == []){
   console.log("villa name already exists1!",villa_detail)

      return writeToStore(context,villa_Address,villa_detail);
    }else{
     console.log("villa name already exists23")
      throw new InvalidTransaction("villa name already exists!");
    }
  })
}
// The getState() method takes an array of state addresses and returns an
// object with the fetched state
function validateVilla(context,houseNo,status){
  console.log("isnide tpvalidatio",houseNo)
  let address = getvillaAddress(houseNo)
  let validateData=status
  console.log("validateData",validateData)
  console.log("Address check",address)
  return context.getState([address]).then(function(data){
    if(data[address] == null || data[address] == "" || data[address] == []){
        console.log("villa details not available or invalid public key!")
        
    }
    else{
      let stateJSON = decoder.decode(data[address])
      let villaDetailsd =[ stateJSON.split(',')+","+ validateData]
      console.log("villaDetailsd",villaDetailsd)
      let newData = villaDetailsd
      console.log("validate",validateData)
      let status= validateData
      if(status=="rejected"){
        return context.deleteState([address]).then(function(data){
            console.log("checkDelete",data[address])

        })
    }
//     deleteState() requests that each of the provided addresses be unset in
// validator state.
// deleteState(addresses)
      writeToStore(context,address,newData);
    }
  }) 
}



function addEmployeevilla(context,houseNo,userPublicKey){
  let address = getvillaAddress(houseNo)
  return context.getState([address]).then(function(data){
    // console.log("data",data)
    if(data[address] == null || data[address] == "" || data[address] == []){
      throw new InvalidTransaction("Invalid villa name!");
      // console.log("Invalid villa name!")
    }
    else{
      let stateJSON = decoder.decode(data[address])
      let villaDetails = stateJSON.split(',');
      if(villaDetails[2] == "false"){
        let newData = [villaDetails[0],villaDetails[1],"true"];
        writeToStore(context,address,newData);
        let empAddress = getEmployeevillaAddress(villaDetails[0],userPublicKey);
        let empvilla =[villaDetails[0],villaDetails[1]];
        writeToStore(context,empAddress,empvilla);
      } 
      else{
        throw new InvalidTransaction("villa is not free!");
        // console.log("villa is not free!")
      }
    }
  }) 
}

//function to display the errors
var _toInternalError = function (err) {
  console.log(" in error message block");
  var message = err.message ? err.message : err;
  throw new InternalError(message);
};


//transaction handler class
// The constructor uses “super” keyword to register a handler class with a
// validator by sending it information about what kinds of transactions it can
// handle
class villaRegisterHandler extends TransactionHandler{
  constructor(){
      super(_FAMILY_NAME, ['1.0'], [_NAMESPACE]);
  }
//apply function
//Apply is the single method that defines all the business logic for a transaction family.
// Apply gets called with two arguments, transactionProcessRequest and context.
// • apply() method is called for each transaction.
// • apply() is the execution entry point to Transaction processor.
// • transactionProcessRequest holds the valid transactions send by the client .
// • context stores information about the current state of the validator. All validator
// interactions by a handler should be through a context instance.



  apply(transactionProcessRequest, context){
    //The transaction consists of a header, header signature and a payload.
// • The header contains the signer’s public key, which can be used to identify the
// current transactor and the Address generation.Context provides an interface for getting , setting and deleting validators
//state.
// • All validator interactions by a handler should be through a Context instance.
    try{
      var header = transactionProcessRequest.header;
      var userPublicKey = header.signerPublicKey;
      let PayloadBytes = decoder.decode(transactionProcessRequest.payload)
      let Payload = PayloadBytes.toString().split(',')
      console.log("Payload------",Payload)
      let action = Payload[0]
      console.log("Payload[1]------",Payload[1])
      if (action === "add"){
        return addvilla(context,Payload[1],Payload[2],Payload[3],Payload[4],Payload[5],Payload[6])
      }
      else if(action === "validate"){
        return validateVilla(context,Payload[1],'validated');
    }
    else if(action === "reject"){
        return validateVilla(context,Payload[1],'rejected');
    }
      else if(action === "acquire"){
        return addEmployeevilla(context,Payload[1],userPublicKey);
      }  
      if (action === "Update-details") {
        return updatedetails(context, Payload[1], Payload[2], Payload[3], Payload[4], Payload[5], Payload[6])
      }
    }
    catch(err){
      _toInternalError(err);
    }   
  }
}

module.exports = villaRegisterHandler;