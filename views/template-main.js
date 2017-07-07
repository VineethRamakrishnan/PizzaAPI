exports.build = function(content) {  
  return ['<!doctype html>',
  '<html lang="en"><meta charset="utf-8"><title>Pizza API</title>',
  '<style>',
  'table {',
        'border-collapse: collapse;',
     '}',
  
  'td,th {',
        'margin: 0px;',
        'padding: 5px;',
        'border:1px solid #080808;',
    '}',

  'td {',
        'text-align: left;',
    '}',
    
  '.border {',
        'border: 1px solid #080808;',
    '}',

  '.noborders td {',
        'border:0px;',
   '}',

  '* {',
    'background-color: #99ccff;',
   '}',
  '</style>',
'<center>',
  '<h1>Welcome to Pizza App</h1>',
  '<form method="get" action="/getAPI/listMenu"><input type="submit" value="Pizza Menu"></form><br>',
  '<form method="get" action="/getAPI/createOrder"><input type="submit" value="Place Order"></form><br>',
  '<form method="get" action="/getAPI/getOrder"><input type="submit" value="Get order"></form>',
  '<br><br>',
  '<div id="content">{content}</div></center>']
  .join('')
  .replace(/{content}/g, content);
};

