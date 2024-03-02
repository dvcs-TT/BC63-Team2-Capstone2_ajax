var phoneMgt = new PhoneMgt();
var validation = new Validation();

var idSelected = null;

var renderList = function () {
  showLoading();
  phoneMgt
    .get()
    .then((res) => {
      hideLoading();
      displayInfoOnTable(res.data);
    })
    .catch((err) => {
      displayNoti("Can't display Data Table");
    });
};

renderList();

getEle("addPhone").addEventListener("click", () => {
  // reset form
  $(".sp-noti").hide();
  $(":input", "#prodModal").val("").prop("selectedIndex", 0);
  $("#updateBtn").hide();
  getEle("addProdBtn").style.display = "inline-block";
});

var deleteProd = function (id) {
  showLoading();
  phoneMgt
    .delete(id)
    .then(function (res) {
      hideLoading();
      renderList(res.data);
      displayNoti("Delete sucessfully");
    })
    .catch(function (err) {
      displayNoti("Unable to delete");
    });
};

var editProd = function (id) {
  idSelected = id;
  $("#updateBtn").show();
  $("#addProdBtn").hide();
  $(".sp-noti").hide();
  showLoading();
  phoneMgt
    .getProdById(idSelected)
    .then(function (res) {
      hideLoading();
      displayInfoOnForm(res.data);
    })
    .catch(function (err) {
      displayNoti("Edit button is unable");
    });
};

// window.editProd = editProd;
// window.deleteProd = deleteProd;

getEle("addProdBtn").addEventListener("click", () => {
  var product = getProdInfo();
  var isValid = validation.validateForm();

  if (isValid) {
    phoneMgt
      .add(product)
      .then(function (res) {
        $("#prodModal").modal("hide");
        renderList(res.data);
        displayNoti("Add product successfully");
      })
      .catch(function (err) {
        displayNoti("Unable to add product");
      });
  } else {
    displayNoti("Failed to add product");
  }
});

getEle("updateBtn").addEventListener("click", () => {
  var product = getProdInfo();
  var isValid = validation.validateForm(true);
  if (isValid) {
    showLoading();
    phoneMgt
      .update(idSelected, product)
      .then(function (res) {
        $("#prodModal").modal("hide");
        hideLoading();
        renderList(res.data);
        displayNoti("Update successfully");
      })
      .catch(function (err) {
        displayNoti("Unable to update");
      });
  } else {
    displayNoti("Failed to update product");
  }
});

getEle("searchBtn").addEventListener("click", () => {
  var searchName = getEle("searchProduct")
    .value.toLowerCase()
    .replaceAll(" ", "");
  showLoading();
  phoneMgt
    .get()
    .then(function (res) {
      hideLoading();
      var products = res.data;
      var result = products.filter((product) => {
        var prodName = product.name.toLowerCase().replaceAll(" ", "");
        return searchName.length > 0 && prodName.includes(searchName);
      });
      if (result.length == 0) {
        displayInfoOnTable(products);
        displayNoti("No product was found");
      } else if (result.length == 1) {
        displayInfoOnTable(result);
        displayNoti(`Showing 1 result`);
      } else {
        displayInfoOnTable(result);
        displayNoti(`Showing ${result.length} results`);
      }
    })
    .catch(function (err) {
      displayNoti("Search error");
    });
});

getEle("priceColumn").addEventListener("click", () => {
  var currentIsAsc = getEle("priceColumn").classList.contains("th-sort-asc");
  sortTableByPrice(!currentIsAsc);
});
