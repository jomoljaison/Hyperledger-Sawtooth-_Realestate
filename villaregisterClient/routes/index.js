var express = require("express");
var router = express.Router();
var { UserClient } = require("./UserClient");
var fs = require("fs");

var prvKey = "";

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index");
});

router.post("/", async (req, res, next) => {
  let Key = req.body.pri_key;
  prvKey = Key;
  let isCorrect = 0;
  let msg = "";
  try {
    var client = new UserClient(prvKey);
    isCorrect = 1;
    msg = "Successfully Login";
  } catch (error) {
    msg = "Invalid Key";
  }
  res.send({ privatekey: Key, done: isCorrect, message: msg });
});

router.post("/villas", (req, res, next) => {
  //  create.hbs  houseNo,owner_name,adhar,sq_ft,price_rs,currentstatus   --}}

  let pri_key = req.body.pri_key;
  let houseNo = req.body.houseNo;

  let owner_name = req.body.owner_name;
  let adhar = req.body.adhar;
  let sq_ft = req.body.sq_ft;
  let price_rs = req.body.pricer_s;
  let currentstatus = req.body.alloted;
  var client = new UserClient(pri_key);
  console.log("inside index.js")
  //  houseNo,owner_name,adhar,sq_ft,price_rs,currentstatus   --}}

  client.addvilla("add",pri_key,houseNo,sq_ft,price_rs,owner_name,adhar,currentstatus);
  console.log("success")
  msg = "Successfully added";
  //res.send({ message: "Successfully Added" });
});

router.post("/acquirevillas", (req, res, next) => {
  let pri_key = req.body.pri_key;
  let houseNo = req.body.houseNo;
  console.log("route houseNo---" + houseNo);
  var client = new UserClient(pri_key);
  client.acquirevilla("acquire", houseNo);
  // console.log("route acquirevillas");
  res.send({ message: "Successfully Added" });
});

router.get("/acquirevilla", async (req, res) => {
  var villaClient = new UserClient(prvKey);

  let stateData = await villaClient.getvillaListings();
  // console.log("listings-----", stateData);
  let villaList = [];
  let freevillaList = [];
  stateData.data.forEach(villas => {
    if (!villas.data) return;
    let decodedvillas = Buffer.from(villas.data, "base64").toString();
    let villaDetails = decodedvillas.split(",");

    villaList.push({
      HouseNo: villaDetails[0],
      SQFTt: villaDetails[1],
      PRIce: villaDetails[2],
      status: villaDetails[3] == "false" ? "Free" : "Alloted"
    });

    if (villaDetails[3] == "false") {
      freevillaList.push({
        HouseNo: villaDetails[0]
      });
    }
  });
  res.render("acquirevilla", {
    listings: villaList,
    freevillas: freevillaList
  });
});

router.get("/selectfunction", (req, res) => {
  res.render("selectfunction");
});


router.get("/viewvilla", (req, res) => {
  res.render("viewvilla");
});

router.get("/createvilla", async (req, res) => {
  var villaClient = new UserClient(prvKey);
  let stateData = await villaClient.getvillaListings();
  // console.log("stateData---", stateData);
  let villaList = [];
  stateData.data.forEach(villas => {
    if (!villas.data) return;
    let decodedvillas = Buffer.from(villas.data, "base64").toString();
    let villaDetails = decodedvillas.split(",");

    villaList.push({
      PRIKey: villaDetails[0], 
      HouseNo: villaDetails[1],
      SQFTt: villaDetails[2],
      PRIce: villaDetails[3],
      status: villaDetails[4]  == "false" ? "Free" : "Alloted"
    });
  });
  res.render("createvilla", { listings: villaList });
});

router.get("/viewvilla", async (req, res) => {
  // console.log("inside viewvilla-----");
  var villaClient = new UserClient(prvKey);
  let stateData = await villaClient.getEmpvillaListings();
  let empvillaList = [];
  stateData.data.forEach(villas => {
    if (!villas.data) return;
    let decodedvillas = Buffer.from(villas.data, "base64").toString();
    let empvillaDetails = decodedvillas.split(",");

    empvillaList.push({
      HouseNo: empvillaDetails[0],
      SQFTt: empvillaDetails[1],
      PRIce: empvillaDetails[2]
     
    });
  });
  let villaData = await villaClient.getvillaListings();
  let villaList = [];
  villaData.data.forEach(villas => {
    if (!villas.data) return;
    let decodedvillas = Buffer.from(villas.data, "base64").toString();
    let villaDetails = decodedvillas.split(",");

    if (villaDetails[3] == "false") {
      villaList.push({
        HouseNo: villaDetails[0],
        SQFTt: villaDetails[1],
        PRIce: villaDetails[2]
       
      });
    }
  });
  res.render("viewvilla", {
    empListings: empvillaList,
    villaListings: villaList
  });
});



router.post('/validatevilla',(req,res,next)=>{
console.log("@index-----")
// let HouseNopri_key= prvKey;
const HouseNos=req.body.HouseNo;
console.log("house-----", req.body.HouseNo);
 
  var client = new UserClient(prvKey);
  client.validation("validate",HouseNos);
  console.log("validate--------")
  res.send({message: "Successfully Added"});
});

router.post('/reject',(req,res,next)=>{
  const HouseNos=req.body.HouseNo;
  var client = new UserClient(prvKey);
  client.validation("reject",HouseNos);
  console.log("reject--------")
  res.send({message: "Successfully Added"});
});



router.get('/validation', async (req,res)=>{
  var villaClient = new UserClient(prvKey);

  let stateData = await villaClient.getvillaListings();
  // console.log("listings-----", stateData);
  let villaList = [];
  let freevillaList = [];
  stateData.data.forEach(villas => {
    if (!villas.data) return;
    let decodedvillas = Buffer.from(villas.data, "base64").toString();
    let villaDetails = decodedvillas.split(",");
console.log("data------",villaDetails)
    villaList.push({
      // HouseNo: villaDetails[0],
      HouseNo: villaDetails[0],
      PRIce: villaDetails[2],
      status: villaDetails[3] == "false" ? "Free" : "Alloted"
    });

    if (villaDetails[3] == "false") {
      freevillaList.push({
        HouseNo: villaDetails[0]
      });
    }
  });
  res.render("validation", {
    listings: villaList,
    freevillas: freevillaList
  });
});





module.exports = router;