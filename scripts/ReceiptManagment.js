class Receipt {
    constructor(invoiceNumber, clientName, date, amount, status, product) {
        this.invoiceNumber = invoiceNumber;
        this.clientName = clientName;
        this.date = date;
        this.amount = amount;
        this.status = status;
        this.product = product;
    }
}

let Products = [
    "Logitech G15 Gaming Mouse",
    "Microsoft Surface Pro 7",
    "Lenovo Legion 3",
    "Lenovo Legion 5",
    "Asus ROG Strix Scar",
    "HP Pavilion Gaming Laptop",
    "Dell XPS 13",
    "Lenovo IdeaPad Gaming 3",
    "Logitech Gaming Keyboard",
    "PlayStation 5 Pro",
    "PlayStation 5 Slim",
    "PlayStation 4 Slim",
    "Poco X6 Pro 512 12",
];

let localReceipts = [];

//DOM Elements
const receiptTable = document.getElementById("receiptTable");
const dialog = document.getElementById("receiptDialog");
const dialogProducts = document.getElementById("dialogProduct");

// function $ (query){
//     return document.querySelector(query)
// }
function onStart() {
    dialogProducts.innerHTML = "";
    for (let product of Products) {
        dialogProducts.innerHTML += `<option>${product}</option>`;
    }

    getDataFromServer();
}

function getDataFromServer() {
    if (!localStorage.getItem("receipts")) {
        localStorage.setItem("receipts", localReceipts);
    } else if (localStorage.getItem("receipts") == "[]") {
        RenderReceiptTable();
    } else {
        localReceipts = JSON.parse(localStorage.getItem("receipts"));
        RenderReceiptTable(...localReceipts);
    }
}

function sendDataToServer() {
    localStorage.setItem("receipts", JSON.stringify(localReceipts));
}

function RenderReceiptTable() {
    receiptTable.innerHTML = `
            <tr>
                <th class="col-1">Invoice Number</th>
                <th class="col-2">Client Name</th>
                <th class="col-2">Date</th>
                <th class="col-1">Amount</th>
                <th class="col-1">Status</th>
                <th class="col-1">Product</th>
                <th class="col-1">Edit</th>
                <th class="col-1">Delete</th>

            </tr>
    `;
    if (arguments.length != 0) {
        for (let receipt of arguments) {
            if (receipt != undefined || receipt != null) {
                let tableElement = `
                    <tr>
                        <td>${receipt.invoiceNumber}</td>
                        <td>${receipt.clientName}</td>
                        <td>${receipt.date}</td>
                        <td>${receipt.amount}</td>
                        <td>${receipt.status}</td>
                        <td>${receipt.product}</td>
                        <td><button class="btn btn-primary">Edit</button></td>
                        <td><button class="btn btn-primary">Delete</button></td>
                    </tr>
                    `;
                receiptTable.innerHTML += tableElement;
            }
        }
    }
}

function addReceipt(receiptNumber, clientName, date, amount, status, product) {
    localReceipts.push(
        new Receipt(receiptNumber, clientName, date, amount, status, product),
    );
    sendDataToServer();
    RenderReceiptTable(...localReceipts);
}

//Dialog functions

function onAddReceiptClick() {
    dialog.classList.remove("visually-hidden");
}

function onSaveChangesClick() {
    let invoiceNumber = document.getElementById("dialogInvoiceNumber").value;
    let clientName = document.getElementById("dialogClientName").value;
    let date = document.getElementById("dialogDate").value;
    let amount = document.getElementById("dialogAmount").value;
    let status = document.getElementById("dialogStatus").value;
    let product = document.getElementById("dialogProduct").value;

    console.log(invoiceNumber, clientName, date, amount, status, product);

    addReceipt(invoiceNumber, clientName, date, amount, status, product);
    onCloseClick();
}

function onCloseClick() {
    dialog.classList.add("visually-hidden");
}

onStart();
