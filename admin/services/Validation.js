function Validation() {
  this.showMessage = function (status, notiId, message) {
    if (status == false) {
      getEle(notiId).style.display = "block";
      getEle(notiId).innerHTML = `${message}`;
      return false;
    } else if (status == true) {
      getEle(notiId).style.display = "none";
      return true;
    }
  };

  this.isNotEmpty = function (id, notiId) {
    var inputVal = getEle(id).value;

    return inputVal === ""
      ? this.showMessage(false, notiId, `(*)This field is required`)
      : this.showMessage(true, notiId);
  };

  this.isSelected = function (id, notiId) {
    var selectTag = getEle(id);
    return selectTag.selectedIndex == 0
      ? this.showMessage(false, notiId, `(*)Please select one option`)
      : this.showMessage(true, notiId);
  };

  this.isNumber = function (id, notiId) {
    var numRegex = /^[0-9]+$/;
    var inputVal = getEle(id).value;
    return !inputVal.match(numRegex)
      ? this.showMessage(
          false,
          notiId,
          `(*)This field is required and must be a number`
        )
      : this.showMessage(true, notiId);
  };

  this.isNotExisted = function (isUpdate) {
    var tBody = getEle("tableList");
    var rows = Array.from(tBody.querySelectorAll("tr"));
    var nameColIndex = 2;
    var tbNameArr = [];
    var prodNameInput = getEle("name");

    rows.forEach((row) => {
      var nameColText = row.querySelector(
        `td:nth-child(${nameColIndex})`
      ).textContent;
      tbNameArr.push(nameColText);
    });
    
    if (isUpdate) return this.showMessage(true, "nameNoti");
    var result = tbNameArr.filter((tbName) => {
      return (
        tbName.toLowerCase().replaceAll(" ", "") ==
        prodNameInput.value.toLowerCase().replaceAll(" ", "")
      );
    });
    return result.length > 0
      ? this.showMessage(false, "nameNoti", `(*)Product is existed`)
      : this.showMessage(true, "nameNoti");
  };

  this.validateForm = function (isUpdate) {
    var valid = true;
    valid &= this.isNotEmpty("name", "nameNoti") && this.isNotExisted(isUpdate);
    valid &= this.isNumber("price", "priceNoti");
    valid &= this.isNotEmpty("screen", "screenNoti");
    valid &= this.isNotEmpty("backCamera", "backCamNoti");
    valid &= this.isNotEmpty("frontCamera", "frontCamNoti");
    valid &= this.isNotEmpty("img", "imgNoti");
    valid &= this.isNotEmpty("desc", "descNoti");
    valid &= this.isSelected("type", "typeNoti");

    return valid;
  };
}
