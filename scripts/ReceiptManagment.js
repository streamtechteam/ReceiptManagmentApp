class Receipt {
    constructor(id,invoiceNumber, clientName, date, amount, status, product) {
        this.id = id;
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
const resetFields =  document.querySelectorAll(".reset-control");

// function $ (query){
//     return document.querySelector(query)
// }

function onStart() {
    document.getElementById("dialogDate").valueAsDate = new Date();


    dialogProducts.innerHTML = "";
    for (let product of Products) {
        dialogProducts.innerHTML += `<option>${product}</option>`;
    }
    RenderReceiptTable();
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

function RenderReceiptTable(...receipts) {
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
    if (receipts.length !== 0) {
        for (let receipt of receipts) {
            if (receipt != undefined || receipt != null) {
                let tableElement = `
                    <tr id="${receipt.id}">
                        <td>${receipt.invoiceNumber}</td>
                        <td>${receipt.clientName}</td>
                        <td>${receipt.date}</td>
                        <td>${receipt.amount}</td>
                        <td>${receipt.status}</td>
                        <td>${receipt.product}</td>
                        <td><button class="btn btn-primary" onclick="editReceipt('${receipt.id}')">Edit</button></td>
                        <td><button class="btn btn-primary" onclick="deleteReceipt('${receipt.id}')">Delete</button></td>
                    </tr>
                    `;
                receiptTable.innerHTML += tableElement;
            }
        }
    }
}

function addReceipt(receiptNumber, clientName, date, amount, status, product) {
    let id = crypto.randomUUID().substring(0, 8);
    console.log(id);
    localReceipts.push(
        new Receipt(id,receiptNumber, clientName, date, amount, status, product),
    );
    sendDataToServer();
    RenderReceiptTable(...localReceipts);
}
function deleteReceipt(id){
    let result = localReceipts.filter(receipt => receipt.id != id);
    localReceipts = result;
    sendDataToServer();
    RenderReceiptTable(...localReceipts);
    console.log(localReceipts);
}

function editReceipt(receiptId){
    console.log(receiptId);
    let receipt = localReceipts.filter(receipt => receipt.id == receiptId)[0];
    console.log(receipt);
    setDialogValues(receipt , "Edit Receipt");
    dialog.classList.remove("visually-hidden");

    
}

function setDialogValues(receipt , title){
    if (receipt != null || receipt != undefined) {
        document.getElementById("receiptDialog").dataset.id = receipt.id;
        document.getElementById("dialogSaveButton").setAttribute("onclick", "onSaveChangesClick('"+ receipt.id + "')");   
        document.getElementById("dialogInvoiceNumber").value = receipt.invoiceNumber;
        document.getElementById("dialogClientName").value = receipt.clientName;
        document.getElementById("dialogDate").value = receipt.date;
        document.getElementById("dialogAmount").value = receipt.amount;
        document.getElementById("dialogStatus").value = receipt.status;
        document.getElementById("dialogProduct").value = receipt.product;
    }
    if(title != null || title !== undefined){
        document.getElementById("dialogTitle").innerHTML = title;
    }

}

function getDialogValues(){
    let invoiceNumber = document.getElementById("dialogInvoiceNumber").value;
    let clientName = document.getElementById("dialogClientName").value;
    let date = document.getElementById("dialogDate").value;
    let amount = document.getElementById("dialogAmount").value;
    let status = document.getElementById("dialogStatus").value;
    let product = document.getElementById("dialogProduct").value;
    return new Receipt(null,invoiceNumber, clientName, date, amount, status, product);
}


//Dialog functions

function onAddReceiptClick() {
    resetFields.forEach(input => {
        input.addEventListener("focus" , function handler (){
            input.value = "";
            input.removeEventListener("focus" , handler);
        });
    });
    setDialogValues(null, "Add Receipt");
    dialog.classList.remove("visually-hidden");
}

function onSaveChangesClick() {
    let receipt = getDialogValues();

    if (arguments.length != 0) {
        let id = arguments[0];
        let editedReceipt = localReceipts.filter(receipt => receipt.id == id)[0];
        editedReceipt.invoiceNumber = receipt.invoiceNumber;
        editedReceipt.clientName = receipt.clientName;
        editedReceipt.date = receipt.date;
        editedReceipt.amount = receipt.amount;
        editedReceipt.status = receipt.status;
        editedReceipt.product = receipt.product;
        sendDataToServer();
        RenderReceiptTable(...localReceipts);
    }
    else if(arguments.length == 0){
        addReceipt(receipt.invoiceNumber, receipt.clientName, receipt.date, receipt.amount, receipt.status, receipt.product);
    }

    onCloseClick();
}

function onCloseClick() {
    dialog.classList.add("visually-hidden");
}


function fixingESlint() {
    let fix = false
    if (fix == true) {
        editReceipt()
        onAddReceiptClick()
        onSaveChangesClick()
        deleteReceipt()
    }
}

onStart();





fixingESlint()