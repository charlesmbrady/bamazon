/*List a set of menu options:
View Products for Sale
View Low Inventory
Add to Inventory
Add New Product

If a manager selects View Products for Sale, 
the app should list every available item: 
the item IDs, names, prices, and quantities.

If a manager selects View Low Inventory, 
then it should list all items with an inventory count lower than five.

If a manager selects Add to Inventory, your app should 
display a prompt that will let the manager "add more" of any item 
currently in the store.

If a manager selects Add New Product, it should allow the manager 
to add a completely new product to the store.
*/

const inquirer = require("inquirer");
const mysql = require("mysql");
const Table = require("cli-table");

var table = new Table({
    head: ['ID', 'Product', 'Price', 'Quantity']
    , colWidths: [5, 20, 20, 6]
});

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "12345678",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log(`Connected to database id: ${connection.threadId}`);
});


//______________________________-Start-__________________________________//

displayMenu();

function displayMenu() {
    //ask what they want, and how much they want
    inquirer.prompt([{
        type: "list",
        message: "Pick a manager action:",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
        name: "managerAction"
    }
    ]).then(function (inquirerResponse) {
        //check to see if there is enough stock
        console.log(inquirerResponse.managerAction);

        switch(inquirerResponse.managerAction){
            case "View Products for Sale" : 
                listProducts();
                //code
            break;
            case "View Low Inventory" : 
                lowInventory();
                //code
            break;
            case "Add to Inventory" : 
                addInventory();
                //code
            break;
            case "Add New Product" : 
                newProduct();
                //code
            break;
            default:
                console.log("something went wrong");
                connection.end();
            break;
        }
    });
}

function listProducts(){
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function (err, data) {
        if (err) throw err;

        //loop through response and push each product's values to the table
        data.forEach(item => {
            table.push(
                [`${item.item_id}`, `${item.product_name}`, `${item.price}`, `${item.stock_quantity}`]
            );
        });

        //log the table and current items available to the console 
        //and their IDs, prices and stock quantity
        console.log(table.toString());
        
        //end database connection
        connection.end();
    });

}

function lowInventory(){//TODO:
    connection.query("SELECT id, price, product_name, stock_quantity FROM products WHERE ?", [stock_quantity], function (err, data) {
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

function addInventory(){//TODO:

}

function newProduct(){//TODO:

}