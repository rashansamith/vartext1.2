var express = require('express');
var multer = require('multer');
var path = require('path');
var mongoose =require('mongoose');
var  fs =require('fs');
var app = express();
var bodyParser = require('body-parser');
var port = 3000;
var Photo = require('./Schema');
var base64 = require('base-64');
var User = require('./userSchema');
mongoose.connect('mongodb://127.0.0.1:27017/Profile');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'uploads')));
// headers and content type
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


var path2;

var storage = multer.diskStorage({
  // destination
 
  destination: function (req, file, cb) {
    cb(null, './uploads/profile/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
    console.log('origina'+file.originalname);
    var path1 =   './uploads/profile/' + file.originalname;
   
    path2=path1;
    console.log('path'+path2);
  }
});
var upload = multer({ storage: storage });

//read imge file
function base64_encode(file) {
  // read binary data
  console.log(file);
  var bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return new Buffer(bitmap).toString('base64');
}

//calling upload url

app.post("/upload", upload.array("uploads[]", 12), function (req, res) {

  console.log('path'+path2);

  //save profile picture
  if(path2!=null){
    var newPhoto =new Photo();
    newPhoto.url=path2;
    
    
    newPhoto.save(function(err,result){

        if(err){
            console.log('err');
            res.sendStatus=500;
            res.json(
            {
                  "status": "err",
                  "message": "User not successfully created",
           }
        );
        }else{
            res.statusCode =200;
        
            console.log('saved');
           //console.log(result.json());


           Photo.findOne({url:path2},function(err,photo){
            //console.log(photo);
            if(err){
          
              res.statusCode = 404;
              res.json({
                "status": "error",
                "message": "404 Not Found"
              });
              console.log('photo err');
          
            } else{
          
              console.log('photo is '+ photo);
          var base64str = base64_encode(photo.url);
          
          res.statusCode = 200;
              res.json({
                "status": "success",
                "message": "fourd profile picture",
                
                "photodata": base64str
                
              });
            }
          });
    }
  });
}else{
console.log('path null');

}
});

//register api
app.post('/regsiter',function(req,res){
  
  console.log('in the api');
  var firstname =req.body.firstname; 
  var lastname = req.body.lastname;       
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var confirmpassword = req.body.confirmpassword;
  var usertype = req.body.usertype;
  var spcatagory = req.body.spcatagory;
         
            var newUser = new User();
            newUser.firstname =firstname;
            newUser.lastname = lastname;
            newUser.username = username;
            newUser.email = email;
            newUser.password =password;
            newUser.usertype = usertype;
            newUser.spcatagory = spcatagory;
   
newUser.save(function(err,result){

          if(err){
              res.statusCode =500;
              res.json({

                  "message":"register err"


              });


          }else{
            statusCode =200;
            res.json({

              "message":"register success"

            });



          }



});


});



var server = app.listen(port, function () {
  console.log("Listening on port %s...", port);
});