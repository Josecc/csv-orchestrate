require('dotenv').config()
let db = require('orchestrate')(process.env.API_KEY)
let csv = require("fast-csv");
let async = require('async');

let members = [];                       // Will contain all the member's UIDs.
let upload = (memberId) => {            // To be executed for every member UID.
  db.put('Valid Members', memberId, {   // Creates an item in orchestrate that
    "UID": memberId,                    //  has a uniue UID and has the created
    "created": "false"                  //  flag off.
  });
};

csv
  .fromPath(process.env.FILE_LOCATION)  // Specifies the CSV file location.
  .on('data', (data) => {               // When a row is read, then it adds
    members.push(data[0]);              //  it to the array.
  })
  .on('end', () => {                    // When all the rows are added to the array --
    async.map(members, upload, function(err, results){
        console.log(results);           // the array is mapped to upload every item.
    });
  });
