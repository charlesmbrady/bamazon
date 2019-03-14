/*Running this application will first display all of the items available 
for sale. Include the ids, names, and prices of products for sale.
The app should then prompt users with two messages.

The first should ask them the ID of the product they would like to buy.
The second message should ask how many units of the product they would 
like to buy.

Once the customer has placed the order, your application should check 
if your store has enough of the product to meet the customer's request.

If not, the app should log a phrase like Insufficient quantity!, 
and then prevent the order from going through.

However, if your store does have enough of the product, you should 
fulfill the customer's order.

This means updating the SQL database to reflect the remaining quantity.
Once the update goes through, show the customer the total cost of their 
purchase.
*/

const inquirer = require("inquirer");
const mysql = require("mysql");
const Table = require("cli-table");

//npm package for making easy formatted console tables
var table = new Table({
    head: ['ID', 'Product', 'Price']
    , colWidths: [5, 20, 20]
});

//connection config
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "12345678",
    database: "bamazon_db"
});

//establishes database connection



//starts the app by displaying the available items
displayItems();





function displayItems() {
    connection.connect(function (err) {
        if (err) throw err;
    });

    connection.query("SELECT item_id, product_name, price FROM products", function (err, data) {
        if (err) throw err;
        data.forEach(item => {
            table.push(
                [`${item.item_id}`, `${item.product_name}`, `${item.price}`]
            );
        });

        //log the current items available to the console 
        //and their IDs and prices
        console.log(table.toString());

        //ask which one they want and quantity
        askProductIdQuantity();     
    });
    
}

function askProductIdQuantity() {
    //ask what they want, and how much they want
    inquirer.prompt([{ 
        type: "input",
        message: "What is the ID of the product you want?",
        name: "productId"
    },
    {
        type: "input",
        message: "how many do you want?",
        name: "quantity"
    }
    ]).then(function (inquirerResponse) {
        //check to see if there is enough stock
        checkStock(inquirerResponse.quantity,inquirerResponse.productId);

    });
}

function checkStock(selectedQuantity,id){
    connection.query("SELECT price, product_name, stock_quantity FROM products WHERE item_id = ?", [`${id}`], function (err, data) {
        if (err) throw err;

        //if there isn't enough, tell them so
        if(data[0].stock_quantity < parseInt(selectedQuantity)){
            console.log(`Unable to fulfill your request! We only have ${data[0].stock_quantity} ${data[0].product_name}(s) in stock :(`);
            connection.end();
        }
        else{
            //else fulfill order and update database
            fulfillOrder(selectedQuantity, id, data[0].price, data[0].stock_quantity);
        }
    });
}

function fulfillOrder(selectedQuantity, id, price, stock){
    connection.query("UPDATE products SET ? WHERE ?",[
        {
            stock_quantity: stock-= selectedQuantity
        },
        {
            item_id: id
        }
    ], function(err){
        if(err) throw err;
        const total = price * selectedQuantity;

        //report total cost and that order completed
        console.log(`Your order is complete! it cost ${total}`);
        connection.end();
    });
}