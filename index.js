import { menuArray } from "./data.js";

let totalPrice = 0;
let orderInstanceId = 1; /*TO KEEP TRACK OF TOTAL ORDERS*/
let itemsCount = {}; /*TO KEEP TRACK OF INDIVIDUAL ITEM ORDERS*/

document.addEventListener("click", function (e) {
        if (e.target.dataset.id) {
                handleAddClick(e.target.dataset.id);
        } else if (e.target.dataset.removeId) {
                handleRemoveClick(e.target.dataset.removeId);
        } else if (e.target.id === "complete-order-btn") {
                handleOrderBtn();
        } else if (e.target.id === "pay-btn") {
                handlePayBtn(e);
        }
});

function resetOrder() {
        /*Close the Modal*/

        const orderModal = document.getElementById("modal-overlay");
        orderModal.classList.add("hidden");

        /*Close Order Container*/

        const orderContainer = document.getElementById("order-container");
        orderContainer.classList.add("hidden");

        /*Reset Order Container*/

        document.getElementById("ordered-items-container").innerHTML = "";
        
        /*Reset Global Variables*/

        totalPrice = 0;
        orderInstanceId = 1;
        itemsCount = {};

        /*Reset Form*/

        document.getElementById("payment-form").reset();
}

function handlePayBtn(click) {
        
        /*To make sure that the entered data is not visible in the toolbar*/
        click.preventDefault();

        /*Check if the form is Filled*/
        const paymentForm = document.getElementById("payment-form");

        if (!paymentForm.checkValidity()) {
                alert("Please Fill In");
                return;
        }

        /*Show Confirmation*/

        const confirmOrder = document.getElementById("confirm-order");

        const confirmPara = document.createElement("p");

        const fullName = document.getElementById("name-input").value.trim();
        
        const firstName = fullName.split(" ")[0];
        //console.log(firstName);

        confirmPara.textContent = `Thank you ${firstName}! Your order is on its way`;

        confirmOrder.append(confirmPara);

        resetOrder();
}

function handleOrderBtn() {
        const orderModal = document.getElementById("modal-overlay");
        orderModal.classList.remove("hidden");
}

function handleRemoveClick(item) {
        
        
        const orderDiv = document.querySelector(`[data-order-id="${item}"]`);
        if (!orderDiv) return; /*Becasue it there is not item returns null*/

        const menuId = orderDiv.getAttribute("data-menu-id");
        if (menuId === null) return;
        
        const itemPrice = menuArray[Number(menuId)].price;
        
        /*Update Global Vars*/
        
        if (itemsCount[menuId]) {
                itemsCount[menuId] = itemsCount[menuId] - 1;
        } else return;

        totalPrice -= itemPrice;

        /*Update UI*/
        
        /*How many items ordered*/
        
        const displayQuantity = orderDiv.querySelector("h2:first-child");
        
        if (itemsCount[menuId] === 1) {
                
                displayQuantity.textContent = `${menuArray[menuId].name}`; 
        } else {
                displayQuantity.textContent = `${menuArray[menuId].name} X ${itemsCount[menuId]}`;
        }
        
        /*Item Display Price*/
        
        const displayPrice = orderDiv.querySelector("h2:last-child");
        
        //console.log(displayPrice);
        
        let priceEl = parseFloat(displayPrice.textContent.replace("$", ""));
        
        //console.log(priceEl);
        
        priceEl -= itemPrice;
        
        //console.log(priceEl);
        
        displayPrice.textContent = `$ ${priceEl}`;
        
        if (priceEl === 0) {
                orderDiv.remove();
        }
       
        /*Total Price*/
        
        const totalPriceSpan = document.getElementById("total-price-span");
        totalPriceSpan.textContent = "$" + totalPrice;
        
        //console.log(orderDiv);

        if (totalPrice === 0) {
                document.getElementById("order-container").classList.add("hidden");
                
        }
}

function handleAddClick(item) {
        /*RESET PRIOR PURCHASE*/

        document.getElementById("confirm-order").innerHTML = "";
        
        itemsCount[item] = (itemsCount[item] || 0) + 1;
        
        console.log(itemsCount[item]);
        

        /*Update UI*/

        const orderedItems = document.getElementById("ordered-items-container");

        const alreadyOrderedDiv = document.querySelector(`[data-menu-id='${item}']`);

        if (alreadyOrderedDiv) {
                
                
                const displayQuantity = alreadyOrderedDiv.querySelector("h2:first-child");
                displayQuantity.textContent = `${menuArray[item].name} X ${itemsCount[item]}`;
                

                const displayPrice = alreadyOrderedDiv.querySelector("h2:last-child");

                let priceEl = parseFloat(displayPrice.textContent.replace("$", ""));

                priceEl += menuArray[Number(item)].price;

                displayPrice.textContent = "$" + priceEl;

                /*Update Price*/

                totalPrice += menuArray[Number(item)].price;

                /*Update Order Instance*/

                orderInstanceId++;
        } else {
                const singleOrderContainer = document.createElement("div");
                singleOrderContainer.className = "single-order-container";
                singleOrderContainer.setAttribute("data-order-id", orderInstanceId);
                singleOrderContainer.setAttribute("data-menu-id", item);
                //console.log(singleOrderContainer.dataset.orderId);

                        const itemName = document.createElement("h2");
                        itemName.className = "ordered-item-name";
                        itemName.textContent = menuArray[Number(item)].name;

                        //const removeSpan = document.createElement("span");
                        //removeSpan.className = "remove-btn-span";

                        const removeBtn = document.createElement("button");
                        removeBtn.className = "remove-btn";
                        removeBtn.textContent = "remove";
                        removeBtn.setAttribute("data-remove-id", orderInstanceId);

                        //removeSpan.append(removeBtn); // append button inside span

                        const itemPrice = document.createElement("h2");
                        itemPrice.textContent = "$" + menuArray[Number(item)].price;
                        itemPrice.className = "item-price";

                singleOrderContainer.append(itemName, removeBtn, itemPrice);

                orderedItems.append(singleOrderContainer);

                /*Update Price*/

                totalPrice += menuArray[Number(item)].price;

                /*Update Order Instance*/

                orderInstanceId++;
        }

        const totalPriceSpan = document.getElementById("total-price-span");
        totalPriceSpan.textContent = "$" + totalPrice;

        /*Show order modal*/

        const orderContainer = document.getElementById("order-container");
        //console.log(orderContainer);
        orderContainer.classList.remove("hidden");
        orderContainer.scrollIntoView({ behavior: "smooth" });
}

function appendItemHtml(dataArr) {
        const itemsSection = document.getElementById("render-items");

        dataArr.forEach(function (item) {
                const article = document.createElement("article");
                article.className = "item-container";

                        const itemPicDiv = document.createElement("div");
                        itemPicDiv.className = "item-pic";
                        itemPicDiv.textContent = item.emoji;

                        const itemDetailsDiv = document.createElement("div");
                        itemDetailsDiv.className = "item-details";

                                const itemName = document.createElement("h3");
                                itemName.textContent = item.name;

                                const itemDetails = document.createElement("p");
                                itemDetails.textContent = item.ingredients.join(", ");

                                const itemPrice = document.createElement("h3");
                                itemPrice.textContent = "$" + item.price;

                        itemDetailsDiv.append(itemName, itemDetails, itemPrice);

                        const addItemBtn = document.createElement("button");
                        addItemBtn.setAttribute("data-id", item.id);

                        addItemBtn.className = "add-item-btn";
                        addItemBtn.textContent = "+";

                article.append(itemPicDiv, itemDetailsDiv, addItemBtn);

                itemsSection.append(article);
        });
}

appendItemHtml(menuArray);
