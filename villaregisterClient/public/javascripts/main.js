

function login_user(event) {
  event.preventDefault();
  let p_key = document.getElementById("login_id").value;

  $.post(
    "/",
    { pri_key: p_key.trim() },
    (data, textStatus, jqXHR) => {
      if (data.done == 1) {
        sessionStorage.clear();
        sessionStorage.setItem("privatekey", data.privatekey);
        alert(data.message);
        window.location.href = "/selectfunction";
      } else {
        alert(data.message);
        // alert("Invalid Key!")
        window.location.href = "/";
      }
    },
    "json"
  );
}

function uploadFunction(event) {
  event.preventDefault();
  var file = event.target.files[0];
  var reader = new FileReader();
  reader.onload = function uploadFunction(event) {
    var Key = event.target.result;
    console.log("Key=" + Key);
    $.post(
      "/",
      { pri_key: Key.trim() },
      (data, textStatus, jqXHR) => {
        if (data.done == 1) {
          sessionStorage.clear();
          sessionStorage.setItem("privatekey", data.privatekey);
          alert(data.message);
          window.location.href = "/selectfunction";
        } else {
          alert(data.message);
          window.location.href = "/";
        }
      },
      "json"
    );
  };
  reader.readAsText(file);
}

function logout(event) {
  event.preventDefault();
  sessionStorage.clear();
  window.location.href = "/";
}

function addvilla(event) {
  event.preventDefault();
  //owner_name,houseNo,adhar,sq_ft,price_rs,currentstatus 
  const p_key = sessionStorage.getItem("privatekey"); 
  let houseNo = document.getElementById("houseNo").value; 
  let owner_name = document.getElementById("owner_name").value;
  let adhar = document.getElementById("adhar").value;
  let sq_ft = document.getElementById("sq_ft").value;
  let price_rs = document.getElementById("price_rs").value;
  if (owner_name != "" && houseNo != "" && adhar != "" && sq_ft != "" && price_rs != "") {
    $.post(
      "/villas",
      {
        pri_key: p_key,
      

        houseNo: houseNo.trim(),
        owner_name: owner_name.trim(),
        adhar: adhar.trim(),
        sq_ft: sq_ft.trim(),
        price_rs: price_rs.trim(),
        alloted: "false"
      },
      (data, textStatus, jqXHR) => {
        // alert(data.message);
      },
      "json"
    );
    setTimeout(function() {
      document.location.reload();
    }, 400);
  } else {
    alert("Incomplete data!");
  }
}




    // <button type="submit" style=" align:center" class="button" onclick= "validateVilla(event,'{{PRIce}}')" > Validate</button>
    function validateVilla(event,HouseNo) {
  console.log("1223--------",HouseNo)
  event.preventDefault();
console.log("1223--------",HouseNo)
  // const p_key = PRIKey;
  const houseNo = HouseNo;
//   const p_key = sessionStorage.getItem("privatekey");
//  const villapvt = PRIKey;
console.log("test",houseNo)
  $.post(
    "/validatevilla",
    { HouseNo: houseNo},
    (data, textStatus, jqXHR) => {
      // alert(data.message);
    },
    "json"
  );
  setTimeout(function() {
    document.location.reload();
  }, 200);
}


function rejectVilla(event,HouseNo) {
  event.preventDefault();

 
  const houseNo = HouseNo;
  $.post(
    "/reject",
    {  HouseNo: houseNo },
    (data, textStatus, jqXHR) => {
      // alert(data.message);
    },
    "json"
  );
  setTimeout(function() {
    document.location.reload();
  }, 200);
}




function validation(event) {
  event.preventDefault();

  const p_key = sessionStorage.getItem("privatekey");
  let owner_name = document.getElementById("acquirevillaname").value;
  // alert(owner_name);
  if (owner_name.trim() != "") {
    $.post(
      "/acquirevillas",
      { pri_key: p_key, hse_no: owner_name.trim() },
      (data, textStatus, jqXHR) => {
        // alert(data.message);
      },
      "json"
    );
    setTimeout(function() {
      document.location.reload();
    }, 400);
  } else {
    alert("Incomplete data!");
  }
}


