function PhoneServices() {
  this.beBaseUrl = "https://643a58ba90cd4ba563f77326.mockapi.io/admin";

  this.getPhones = function () {
    return axios({
      url: this.beBaseUrl,
      method: "GET",
    });
  };

  this.getPhoneById = function (id) {
    return axios({
      url: `${this.beBaseUrl}/${id}`,
      method: "GET",
    });
  };
}
