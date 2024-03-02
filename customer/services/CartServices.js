function CartServices() {
  this.feBaseUrl = "https://643a58ba90cd4ba563f77326.mockapi.io/cart";

  this.getList = function () {
    return axios({
      url: this.feBaseUrl,
      method: "GET",
    });
  };
  
  this.remove = function (id) {
    return axios({
      url: `${this.feBaseUrl}/${id}`,
      method: "DELETE",
    });
  };

  this.create = function (data) {
    return axios({
      url: this.feBaseUrl,
      method: "POST",
      data: data,
    });
  };

  this.update = function (id, cartItem) {
    return axios({
      url: `${this.feBaseUrl}/${id}`,
      method: "PUT",
      data: cartItem,
    });
  };
}
