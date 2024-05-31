const body = document.querySelector("body");
const iconCart = document.querySelector(".icon");
const closeCart = document.querySelector(".close");
const productList = document.querySelector(".list-product");
const addToList = document.querySelector(".listCart");
const totalNumber = document.querySelector(".icon span ");
const addToCart = document.querySelector(".add-cart");
const finalCost = document.querySelector(".finalPrice span");
let products = [];
let cart = [];
iconCart.addEventListener("click", () => {
  body.classList.add("showCart");
});
closeCart.addEventListener("click", () => {
  body.classList.remove("showCart");
});
const addProductToHTML = () => {
  if (products.length > 0) {
    products.forEach((product) => {
      productList.innerHTML += `<div class="item" id="${product.id}">
      <img src="${product.image}" alt="${product.image}" />

              <h3>${product.name}</h3>
              <p class  ="price">$${product.price} </p>
              <button class="add-cart">
              Add to cart</button>
            </div>`;
    });
  }
};

const changeProductList = (event) => {
  const posisionClick = event.target;
  console.log(event.target);
  if (posisionClick.classList.contains("add-cart")) {
    const productId = posisionClick.parentElement.id;
    console.log(productId);

    addCart(productId);
    posisionClick.classList.add("newbutton");
    posisionClick.innerHTML = `
    <div class="quantity">
                              <span class="minus">-</span>
                              <span class="number"> 1 </span>
                              <span class="plus">+</span>
                            </div>
    `;
  }
  if (posisionClick.classList.contains("plus")) {
    const productId =
      posisionClick.parentElement.parentElement.parentElement.id;
    // console.log(productId);
    addOne(productId);
    addCartToHTML();
    updateCartItemQuantity(productId);
  } else if (posisionClick.classList.contains("minus")) {
    const productId =
      posisionClick.parentElement.parentElement.parentElement.id;
    minusOne(productId);
    addCartToHTML();
    updateCartItemQuantity(productId);
  }
};

productList.addEventListener("click", changeProductList);

const addCart = (productId) => {
  let productAddToCart = cart.findIndex((item) => item.id === productId);
  const findProduct = products.find((product) => product.id == productId);
  if (cart.length <= 0) {
    cart = [
      {
        id: productId,
        quantity: 1,
        price: findProduct.price,
        name: findProduct.name,
        image: findProduct.image,
        totalPrice: findProduct.price,
      },
    ];
  } else if (productAddToCart < 0) {
    cart.push({
      id: productId,
      quantity: 1,
      price: findProduct.price,
      name: findProduct.name,
      image: findProduct.image,
      totalPrice: findProduct.price,
    });
  } else {
    cart[productAddToCart].quantity += 1;
    cart[productAddToCart].totalPrice =
      cart[productAddToCart].price * cart[productAddToCart].quantity;
  }
  addCartToHTML();
  addCartToMemory();
};
const addCartToMemory = () => {
  localStorage.setItem("cart", JSON.stringify(cart));
};
const addCartToHTML = () => {
  addToList.innerHTML = "";
  let totalQuantity = 0;
  let finalPrice = 0;
  cart.forEach((item) => {
    totalQuantity += item.quantity;
    finalPrice += item.totalPrice;
    console.log(finalPrice);
    addToList.innerHTML += `
                          <div class="item" id="${item.id}">
                            <div class="image">
                              <img src="${item.image}" alt="product-one" />
                            </div>
                            <div class="name">${item.name}</div>
                            <p class="totalPrice">$${item.totalPrice}</p>
                            <div class="quantity">
                              <span class="minus">-</span>
                              <span>${item.quantity}</span>
                              <span class="plus">+</span>
                            </div>
                          </div>`;
  });
  totalNumber.innerHTML = totalQuantity;
  finalCost.innerHTML = finalPrice;
};
addToList.addEventListener("click", (e) => {
  const changeQuantity = e.target;
  let listId = changeQuantity.parentElement.parentElement.id;
  if (changeQuantity.classList.contains("plus")) {
    addOne(listId);
  } else if (changeQuantity.classList.contains("minus")) {
    minusOne(listId);
  }
  addCartToHTML();
  updateCartItemQuantity(listId);
});
const addOne = (listId) => {
  const indexProduct = cart.findIndex((item) => item.id === listId);
  console.log(cart);
  cart[indexProduct].quantity += 1;
  cart[indexProduct].totalPrice =
    cart[indexProduct].price * cart[indexProduct].quantity;

  addCartToMemory();
};
const minusOne = (listId) => {
  const indexProduct = cart.findIndex((item) => item.id === listId);
  // console.log(indexProduct);
  if (cart[indexProduct].quantity === 1) {
    cart.splice(indexProduct, 1);
  } else {
    cart[indexProduct].quantity -= 1;
    cart[indexProduct].totalPrice =
      cart[indexProduct].price * cart[indexProduct].quantity;
    addCartToMemory();
  }
  // console.log(cart);
};
const updateCartItemQuantity = (productId) => {
  const productElement = document.getElementById(productId);
  const changeNumber = productElement.querySelector(".number");
  const itemInCart = cart.find((item) => item.id === productId);
  if (itemInCart) {
    changeNumber.textContent = itemInCart.quantity;
  } else {
    const addButton = productElement.querySelector(".add-cart");
    addButton.classList.remove("newbutton");
    addButton.innerHTML = "Add to cart";
  }

  addCartToMemory();
};
const showProduct = () => {
  fetch("products.json")
    .then((res) => res.json())
    .then((product) => {
      console.log(product);
      products = product;
      addProductToHTML();
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
        cart.forEach((item) => {
          // console.log(item.id);
          const productElement = document.getElementById(item.id);
          const changeNumber = productElement.querySelector(".add-cart");
          changeNumber.classList.add("newbutton");
          changeNumber.innerHTML = `
            <div class="quantity">
                                      <span class="minus">-</span>
                                      <span class="number"> ${item.quantity} </span>
                                      <span class="plus">+</span>
                                    </div>
            `;
        });
        addCartToHTML();
      }
    });
};

showProduct();
