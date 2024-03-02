// SERVICES | CUSTOMER UI
var phoneServices = new PhoneServices();

// SERVICES | CART
var cartServices = new CartServices();


// CUSTOMER UI
// Get an element by its ID
function getEle(id) {
  return document.getElementById(id);
}

// Render the phone list
function renderList(phoneList) {
  var content = "";
  for (var i = 0; i < phoneList.length; i++) {
    var phone = phoneList[i];
    content += ` <div class="col-lg-3 col-md-6">
      <div class="card text-black h-100">
      <div class="content-overlay"></div>
        <img src=${phone.img} class="card-img" alt="Phone Image" />
        <div class="content-details fadeIn-top">
        <h3 class ='pb-5'>Specifications</h3>
              <div class="d-flex justify-content-start py-1">
            <span class='text-light'><b>Screen:</b></span>
            <span class='text-light'>&nbsp ${phone.screen}</span>
          </div>
          <div class="d-flex justify-content-start py-1">
            <span class='text-light'><b>Back Camera:</b> ${
              phone.backCamera
            }</span>
          </div>
          <div class="d-flex justify-content-start py-1">
            <span class='text-light'><b>Front Camera:</b> ${
              phone.frontCamera
            }</span>
          </div>
  
          <p class = 'pt-5'><u>click here for more details</u></p>
        </div>
        <div class="card-body">
          <div class="text-center">
            <h5 class="card-title pt-3">${phone.name}</h5>
            <span class="text-muted mb-2">$${phone.price}</span>
            <span class="text-danger"><s>$${
              Number(phone.price) + 300
            }</s></span>
          </div>
          <div class="mt-3 brand-box text-center">
            <span>${phone.type}</span>
          </div>
          <div class="d-flex justify-content-start pt-3">
            <span><b>Description:</b> ${phone.desc}</span>
          </div>
          <div class="d-flex justify-content-between pt-3">
            <div class="text-warning">
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
            </div>
            <span class = 'text-success'><b>In Stock</b></span>
          </div>
          <button type="button" class="btn btn-block w-50" onclick ="btnAddToCart('${
            phone.id
          }')">Add to cart</button>
        </div>
      </div>
    </div>`;
  }
  getEle("phoneList").innerHTML = content;
}

// Fetch the phone list
function fetchPhoneList() {
  phoneServices.getPhones().then(function (res) {
    renderList(res.data.reverse());
  });

  fetchCart();
}

fetchPhoneList();

// Filter phones out by brands
function brandFilter() {
  phoneServices.getPhones().then(function (res) {
    var phones = res.data;

    var selectedValue = getEle("selectList").value;

    var filterData = [];
    if (selectedValue == "all") {
      filterData = phones;
    } else {
      filterData = phones.filter(function (phone) {
        return phone.type == selectedValue;
      });
    }

    renderList(filterData);
  });
}



// CART
// Render the content of cart
function renderCart(cart) {
  var content = "";
  for (var i = 0; i < cart.length; i++) {
    var cartItem = cart[i];
    content += `<div class="product">
    <div class="product__1">
      <div class="product__thumbnail">
        <img src=${cartItem.product.img} 
          alt="Italian Trulli">
      </div>
      <div class="product__details">
        <div style="margin-bottom: 8px;"><b>${cartItem.product.name}</b></div>
        <div style="font-size: 90%;">Screen: <span class="tertiary">${
          cartItem.product.screen
        }</span></div>
        <div style="font-size: 90%;">Back Camera: <span class="tertiary">${
          cartItem.product.backCamera
        }</span></div>
        <div style="font-size: 90%;">Front Camera: <span class="tertiary">${
          cartItem.product.frontCamera
        }</span></div>
        <div style="margin-top: 8px;"><a href="#!" onclick ="btnRemove('${
          cartItem.id
        }')">Remove</a></div>
      </div>
    </div>
    <div class="product__2">
      <div class="qty">
        <span><b>Quantity:</b> </span> &nbsp &nbsp
        <span class="minus bg-dark" onclick ="btnMinus('${
          cartItem.product.id
        }')">-</span>
        <span class="quantityResult mx-2">${cartItem.quantity}</span>
        <span class="plus bg-dark" onclick ="btnAdd('${
          cartItem.product.id
        }')">+</span>
      </div>
      <div class="product__price"><b>$${
        cartItem.quantity * cartItem.product.price
      }</b></div>
    </div>
  </div>`;
  }
  getEle("cartList").innerHTML = content;

  // Count of the products in cart
  var cartCount = 0;
  cartServices.getList().then(function (res) {
    var cart = res.data;

    for (var i = 0; i < cart.length; i++) {
      var cartItem = cart[i];
      cartCount += cartItem.quantity;
    }

    var subTotal = calculateSubTotal(cart);
    var shipping = subTotal > 0 ? 10 : 0;
    getEle("cartCount").innerHTML = cartCount;
    getEle("shipping").innerHTML = "$" + shipping;
    getEle("subTotal").innerHTML = "$" + subTotal;
    getEle("tax").innerHTML = "$" + Math.floor(subTotal * 0.1);
    getEle("priceTotal").innerHTML =
      "$" + Math.floor(subTotal * 1.1 + shipping);
  });
}

// Fetch the phone list from the front-end & render the cart
function fetchCart() {
  cartServices.getList().then(function (res) {
    renderCart(res.data.reverse());
  });
}

// Find item(s) in the cart by product ID (return: cart item)
function findItemById(id) {
  return cartServices.getList().then(function (res) {
    var cartItems = res.data;

    for (var i = 0; i < cartItems.length; i++) {
      if (cartItems[i].product.id === id) {
        return cartItems[i];
      }
    }

    // If no match is found, return undefined
    return undefined;
  });
}

// Add item(s) to the cart
function btnAddToCart(productId) {
  phoneServices.getPhoneById(productId).then(function (res) {
    var phoneData = res.data;
    
    var product = new Product(
      phoneData.id,
      phoneData.name,
      phoneData.price,
      phoneData.screen,
      phoneData.backCamera,
      phoneData.frontCamera,
      phoneData.img,
      phoneData.desc,
      phoneData.type
    );

    var newCartItem = new CartItem(undefined, product, 1);

    findItemById(newCartItem.product.id).then(function (cartItem) {
      if (!cartItem) {
        cartServices.create(newCartItem).then(function (res) {
          fetchCart();
        });
      } else {
        cartItem.quantity++;
        cartServices.update(cartItem.id, cartItem).then(function (res) {
          fetchCart();
        });
      }
    });
  });

  Toastify({
    text: "A new item is added to the cart",
    offset: {
      x: 50, // horizontal axis - can be a number or a string indicating unity. eg: '2em'
      y: 10, // vertical axis - can be a number or a string indicating unity. eg: '2em'
    },
  }).showToast();
}

// increase the quantity of an item in the cart
function btnAdd(id) {
  findItemById(id).then(function (cartItem) {
    if (cartItem) {
      cartItem.quantity++;
      cartServices.update(cartItem.id, cartItem).then(function (res) {
        fetchCart();
      });
    }
  });
}

// decrease the quantity of an item in the cart
function btnMinus(id) {
  findItemById(id).then(function (cartItem) {
    if (cartItem) {
      cartItem.quantity--;

      if (cartItem.quantity > 0) {
        cartServices.update(cartItem.id, cartItem).then(function (res) {
          fetchCart();
        });
      } else {
        cartServices.remove(cartItem.id).then(function (res) {
          fetchCart();
        });
      }
    }
  });
}

// Remove item(s) from the cart
function btnRemove(id) {
  cartServices.remove(id).then(function (res) {
    fetchCart();
  });
}

// Empty the cart
function emptyCart() {
  cartServices
    .getList()
    .then(function (res) {
      var cart = res.data;
      
      for (var i = 0; i < cart.length; i++) {
        var cartItem = cart[i];
        cartServices.remove(cartItem.id);
      }
    })
    .then(function () {
      setTimeout(() => {
        fetchCart();
      }, 1000);
    });
}

// Total cost of the cart
function calculateSubTotal(cart) {
  var subTotal = 0;
  for (var i = 0; i < cart.length; i++) {
    var cartItem = cart[i];
    subTotal += cartItem.product.price * cartItem.quantity;
  };
  return subTotal;
}

// Pay for item(s) in the cart
function payNow() {
  cartServices.getList().then(function (res) {
    var cart = res.data;

    if (cart.length > 0) {
      Swal.fire({
        // position: 'top-end',
        icon: "success",
        title: "Your order is completed",
        showConfirmButton: false,
        timer: 1500,
      });
      emptyCart();
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Your cart is empty",
      });
    }
  });
}
