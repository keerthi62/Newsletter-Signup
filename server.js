const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req,res){
	res.sendFile(__dirname + "/index.html");
});

app.post("/",function(req,res){
	const fname = req.body.Fname;
	const lname = req.body.Lname;
	const email = req.body.email;
	
	const data = {
		members: [
		   {
		   	   email_address: email,
		   	   status: "subscribed",
		   	   merge_fields: {
		   	   	   FNAME: fname,
		   	   	   LNAME: lname
		   	   }
		    }       
		]
	};

    const jsonData = JSON.stringify(data);

    const url = "https://us10.api.mailchimp.com/3.0/lists/99e1122b3a";

    const options = {
    	method: "POST",
    	auth: "keerthi:4d27209b6e3097c86efa095c9da459e7-us10"
    }

    const request = https.request(url, options, function(response){
    
        if (response.statusCode === 200) {
        	res.sendFile(__dirname + "/success.html");
        }
        else {
        	res.sendFile(__dirname + "/failure.html");
        }


    	response.on("data",function(data){
    		console.log(JSON.parse(data));
    	})
    })
    request.write(jsonData);
    request.end();

});

app.post("/failure",function(req,res){
	res.redirect("/");
});

app.listen(3000 ,function(){
	console.log("Server started on port 3000");
});

