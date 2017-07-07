var request = require('request');
var express = require('express');
var router = express();
var certificate = require('ssl-root-cas').inject();
var bodyParser = require('body-parser'); 
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
var template = require('./views/template-main.js');//Template for displaying the contents of the webpage

var http_port = 8888;
router.listen(http_port);  
console.log('listening to http://127.0.0.1:' + http_port); 

// We have to provide configuration for our service
var service_ip;
var service_port;
var service_version;
var service_bearer;
var service_context_path;

var winston = require('winston');
 
winston.add(
  winston.transports.File, {
    filename: 'Logger.log',
    level: 'info',
    json: true,
    eol: 'rn',
    timestamp: true
  }
)

/*If you want to prevent the messages displayed in console then add the following*/
 winston.remove(winston.transports.Console);

//Listing All the methods in the API
router.get('/getAPI',function(req,res)
{
   winston.info("Pizza API console was selected...");
   res.writeHead(200, {
      'Content-Type': 'text/html'
   });
    winston.info("Displaying all the methods(1.GET-Menus)(2.GET-Order Details by orderID)(3.POST-Creating Order)...");
   res.write(template.build(""));
   res.end();
});

//Get all the menu items
router.get('/getAPI/listMenu',function(req, res) 
{  
   winston.info("1.GET-List Menu(Listing all the menu items) method is  selected...");
  //To connect with the insecured website
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  winston.info("Making the call to the service...");
  request({
        url: 'https://'+service_ip+':'+service_port+'/'+service_context_path+'/'+service_version+'/menu', //URL to hit
        method: 'GET',
        headers: { 
            'Authorization':'Bearer '+service_bearer+''
        },
      }, function(error, response, body) 
        {
              winston.info("Successfully got the response from the service...");
              if (!error && response.statusCode == 200) {
               
                  winston.info("No error in response and the StatusCode is ..."+response.statusCode);
                  
                  var data = JSON.parse(body);
                  winston.info("Creating the table to display the menus in table format...");
                  var str = "<br>";
                  str = str + "<table class=\"border\">"
                  str = str +"<tr>";
                  str = str +" <th>Name</th>";
                  str = str +"<th>Description</th> ";
                  str = str +"<th>Icon</th>";
                  str = str +"<th>Price</th>";
                  str = str +"</tr>";

                  winston.info("iterating through each row...");
                  for(var i = 0; i < data.length; i++) {
                  
                    str = str +"<tr>";
                    str = str +" <td>"+data[i].name+"</td>";
                    str = str +"<td>"+data[i].description+"</td> ";
                    str = str +"<td>"+data[i].icon+"</td>";
                    str = str +"<td>"+data[i].price+"</td>";
                    str = str +"</tr>";
                    
                  }
                  str = str +"</table>";

                  winston.info("Writing the contents in the response...");
                  res.writeHead(200, {
                    'Content-Type': 'text/html'
                  });
                  res.write(template.build("The menu items of the store as follows...<br>"+str));
                  res.end();
              } 
              else if(error)
              {
                  winston.info("ERROR occurs... The error was"+error);
                  res.writeHead(response.statusCode, {
                       'Content-Type': 'text/html'
                  });
                  res.write(template.build("Oh! There is error.. The following error was happened..."+error));
                  res.end();
              }
          });
   
});

//Displaying the controls to get the order id
router.get('/getAPI/getOrder',function(req,res)
{
    winston.info("2.GET-Order Details(by order id) method is  selected...");
    winston.info("Displaying the controls to get order-id from the user...");
        
    var str =  "<form id=\"orderno\" method=\"get\" action=\"/getAPI/getOrder/details\">";
    str = str + "<table class=\"noborders\">";
    str = str + "<tr>";
    str = str + "<td>Order id</td>";
    str = str + "<td><input type=\"textbox\" name=\"order_id\"></td>";
    str = str + "</tr>";
    str = str + "<tr><td><input type=\"submit\" value=\"SUBMIT\"></td></tr>";
    str = str + "</table>";
    str = str + "</form>";
    

    winston.info("Displaying the controls in the response...");

    res.writeHead(200, { 
        'Content-Type': 'text/html'
     });
     res.write(template.build("Give the order id which you want to be display..."+str));
     res.end();
});

//Displaying the details of the particular order-id
router.get('/getAPI/getOrder/details',function(req,res)
{
    //To connect with the insecured website
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    var orderidtemp = req.query.order_id;
    winston.info("Making the call to the service...");
    request({
        url: 'https://'+service_ip+':'+service_port+'/'+service_context_path+'/'+service_version+'/order/'+orderidtemp+'', //URL to hit
        method: 'GET',
        headers: { 
            'Authorization':'Bearer '+service_bearer+''
        },
      }, function(error, response, body)
        {
            winston.info("Successfully got the response from the service...");

            var data = JSON.parse(body);
            if (!error && response.statusCode == 200) {
               winston.info("No error in response and the StatusCode is ..."+response.statusCode);

                var str = "<table class=\"border\">";
                str = str + "<tr>";
                str = str + "<td><b>Address</b></td>";
                str = str + "<td>"+data.address+"</td>";
                str = str + "</tr>";
                 str = str + "<tr>";
                str = str + "<td><b>Order Id</b></td>";
                str = str + "<td>"+data.orderId+"</td>";
                str = str + "</tr>";
                 str = str + "<tr>";
                str = str + "<td><b>Credit Card No</b></td>";
                str = str + "<td>"+data.creditCardNumber+"</td>";
                str = str + "</tr>";
                 str = str + "<tr>";
                str = str + "<td><b>Pizza-Type</b></td>";
                str = str + "<td>"+data.pizzaType+"</td>";
                str = str + "</tr>";
                 str = str + "<tr>";
                str = str + "<td><b>Quantity</b></td>";
                str = str + "<td>"+data.quantity+"</td>";
                str = str + "</tr>";
                 str = str + "<tr>";
                str = str + "<td><b>Delivered</b></td>";
                str = str + "<td>"+data.delivered+"</td>";
                str = str + "</tr>";
                 str = str + "<tr>";
                str = str + "<td><b>Customer Name</b></td>";
                str = str + "<td>"+data.customerName+"</td>";
                str = str + "</tr>";
                str = str + "</table>";

                 winston.info("Writing the response..."+response.statusCode);
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                 });
                 res.write(template.build("Details of your order:<br>"+str));
                 res.end();
             }
             else if(!error && response.statusCode == 404)
             {
               winston.info("Order is not present in the table and the statusCode is..."+response.statusCode);

               res.writeHead(404, {
                  'Content-Type': 'text/html'
               });
               res.write(template.build(" Sorry, "+data.description+" in the orders table... Please enter the correct one..!!!"));
               res.end();
             }
             else if(error)
             {
               winston.info("ERROR occurs... The error was"+error);

               res.writeHead(response.statusCode, {
                  'Content-Type': 'text/html'
               });
               res.write(template.build("Oh! There is error.. The following error was happened..."+error));
               res.end();
             }
        });
});

//Creating the new order
router.get('/getAPI/createOrder',function(req,res)
{
    winston.info("2.GET-Order Details(by order id) method is  selected...");
    winston.info("Displaying the controls to get order-id from the user...");

    var str = "<br>Enter the details";
    
    str = str + "<form method=\"post\" action=\"/getAPI/createOrder/result\">";
    str = str + "<table class=\"noborders\">";
    str = str + "<tr><td>CustomerName</td>";
    str = str + "<td><input type=\"textbox\" name=\"customerName\" default value=\"String\"></td></tr>";
    str = str + "<tr><td>Delivered</td>";
    str = str + "<td><input type=\"textbox\" name=\"delivered\" default value=\"false\"></td></tr>";
    str = str + "<tr><td>Address</td>"
    str = str + "<td><input type=\"textbox\" name=\"address\" default value=\"String\"></td></tr>";
    str = str + "<tr><td>Pizza Type</td>"
    str = str + "<td><input type=\"textbox\" name=\"pizzaType\" default value=\"String\"></td></tr>";
    str = str + "<tr><td>Creditcard Number</td>"
    str = str + "<td><input type=\"textbox\" name=\"creditCardNumber\" default value=\"String\"></td></tr>";
    str = str + "<tr><td>Quantity</td>"
    str = str + "<td><input type=\"textbox\" name=\"quantity\" default value=0></td></tr>";
    str = str + "<tr><td>Order Id</td>"
    str = str + "<td><input type=\"textbox\" name=\"orderId\" default value=0></td></tr>";
    str = str + "<tr><td><input type=\"submit\" value=\"SUBMIT\"></td><tr>";
    str = str + "</table>";
    str = str + "</form>";
    
   
     winston.info("Displaying the controls in the response...");
     res.writeHead(200, {
        'Content-Type': 'text/html'
     });
     res.write(template.build(""+str));
     res.end();
});

//Display the response after creating the order
router.post('/getAPI/createOrder/result',function(req,res)
{
    //To connect with the insecured website
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    winston.info("Making the call to the service by including the values given by the user...");
    request({
        url: 'https://'+service_ip+':'+service_port+'/'+service_context_path+'/'+service_version+'/order', //URL to hit
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization':'Bearer '+service_bearer+''
        },
        json: {
            "customerName":  req.body.customerName,
            "delivered":  req.body.delivered,
            "address":  req.body.address,
            "pizzaType":  req.body.pizzaType,
            "creditCardNumber":  req.body.creditCardNumber,
            "quantity":  req.body.quantity,
            "orderId":  req.body.orderId
        }
    }, function(error, response, body){
    
        winston.info("Successfully got the response from the service...");

        if (!error && response.statusCode == 201) 
        {
            winston.info("No error in response and the StatusCode is ..."+response.statusCode);
           
            var temp = JSON.stringify(body);
            var data = JSON.parse(temp);
            var str = "<table class=\"border\">";
            str = str + "<tr>";
            str = str + "<td><b>Address</b></td>";
            str = str + "<td>"+data.address+"</td>";
            str = str + "</tr>";
             str = str + "<tr>";
            str = str + "<td><b>Order Id</b></td>";
            str = str + "<td>"+data.orderId+"</td>";
            str = str + "</tr>";
             str = str + "<tr>";
            str = str + "<td><b>Credit Card No</b></td>";
            str = str + "<td>"+data.creditCardNumber+"</td>";
            str = str + "</tr>";
             str = str + "<tr>";
            str = str + "<td><b>Pizza-Type</b></td>";
            str = str + "<td>"+data.pizzaType+"</td>";
            str = str + "</tr>";
             str = str + "<tr>";
            str = str + "<td><b>Quantity</b></td>";
            str = str + "<td>"+data.quantity+"</td>";
            str = str + "</tr>";
             str = str + "<tr>";
            str = str + "<td><b>Delivered</b></td>";
            str = str + "<td>"+data.delivered+"</td>";
            str = str + "</tr>";
             str = str + "<tr>";
            str = str + "<td><b>Customer Name</b></td>";
            str = str + "<td>"+data.customerName+"</td>";
            str = str + "</tr>";
            str = str + "</table>";

            winston.info("Writing the response..."+response.statusCode);
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.write(template.build("Details of your order <br>"+str));
            res.end();
         }
        else if(error)
         {
           winston.info("ERROR occurs... The error was"+error);

           res.writeHead(response.statusCode, {
              'Content-Type': 'text/html'
           });
           res.write(template.build("Oh! There is error.. The following error was happened..."+error));
           res.end();
         }
    });
});