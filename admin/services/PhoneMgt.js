function PhoneMgt() {
  this.beBaseUrl = "https://643a58ba90cd4ba563f77326.mockapi.io/admin";

  this.get = function () {
    return axios({
      url: this.beBaseUrl,
      method: "GET",
    });
  };

  this.getProdById = function (id) {
    return axios({
      url: `${this.beBaseUrl}/${id}`,
      method: "GET",
    });
  };

  this.delete = function (id) {
    return axios({
      url: `${this.beBaseUrl}/${id}`,
      method: "DELETE",
    });
  };

  this.add = function (data) {
    return axios({
      url: this.beBaseUrl,
      method: "POST",
      data: data,
    });
  };

  this.update = function (id, data) {
    return axios({
      url: `${this.beBaseUrl}/${id}`,
      method: "PUT",
      data: data,
    });
  };
}
