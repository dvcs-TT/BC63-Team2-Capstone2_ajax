var formInputs = [
  "name",
  "price",
  "screen",
  "backCamera",
  "frontCamera",
  "img",
  "desc",
  "type",
];

var usdFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

var getEle = function (id) {
  return document.getElementById(id);
};

var getProdInfo = function () {
  var inputValues = formInputs.map((input) => {
    return getEle(input).value;
  });
  var product = new Product("", ...inputValues);

  return product;
};

var displayInfoOnForm = function (product) {
  var objKeysAndValues = Object.entries(product);
  for (var i = 0; i < objKeysAndValues.length; i++) {
    for (var j = 0; j < formInputs.length; j++) {
      if (objKeysAndValues[i][0] == formInputs[j]) {
        getEle(formInputs[j]).value = objKeysAndValues[i][1];
      }
    }
  }
};

var displayInfoOnTable = function (dataArr) {
  var HTMLContent = "";
  for (var i = 0; i < dataArr.length; i++) {
    var product = dataArr[i];
    var trContent = `<tr>
      <td>${product.id}</td>
      <td><strong>${product.name}</strong></td>
      <td>${usdFormat.format(product.price)}</td>
      <td style="text-align: center"><img src=${
        product.img
      } alt="phone-img" width="80" height="80"></td>
      <td>${product.desc}</td>
      <td class='action-button pt-0' style="text-align: center"><button class="btn btn-warning my-3 me-1" data-toggle="modal"
      data-target="#prodModal" onclick="editProd(${product.id})" id='editBtn'>
      <span id="hide">Edit</span><i class="fa fa-pencil-alt ms-2"></i>
      </button><button class="btn btn-danger" onclick="deleteProd(${
        product.id
      })" id='deleteBtn'>
      <span id="hide">Delete</span><i class="fa fa-trash-alt ms-2"></i></i>
      </button></td>
      </tr>`;
    HTMLContent += trContent;
  }
  getEle("tableList").innerHTML = HTMLContent;
};

var showLoading = function () {
  getEle("loading").style.display = "flex";
};

var hideLoading = function () {
  getEle("loading").style.display = "none";
};

var displayNoti = function (message) {
  Toastify({
    text: message,
    offset: {
      x: 40,
    },
  }).showToast();
};

var sortTableByPrice = function (asc = true) {
  var dirModifier = asc ? 1 : -1;
  var tBody = getEle("tableList");
  var rows = Array.from(tBody.querySelectorAll("tr"));
  var specialCharaRegex = /[^a-zA-Z0-9 ]/g;
  var priceColIndex = 3;
  var sortedRows = rows.sort((a, b) => {
    var aColText = parseInt(
      a
        .querySelector(`td:nth-child(${priceColIndex})`)
        .textContent.replace(specialCharaRegex, "")
    );
    var bColText = parseInt(
      b
        .querySelector(`td:nth-child(${priceColIndex})`)
        .textContent.replace(specialCharaRegex, "")
    );
    return aColText > bColText ? 1 * dirModifier : -1 * dirModifier;
  });

  while (tBody.firstChild) {
    tBody.removeChild(tBody.firstChild);
  }

  tBody.append(...sortedRows);

  getEle("priceColumn").classList.toggle("th-sort-asc", asc);
  getEle("priceColumn").classList.toggle("th-sort-desc", !asc);
};
