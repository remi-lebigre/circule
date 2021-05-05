"use strict";

class BookingForm {
  form = document.querySelector("form");
  submit_cta = document.querySelector(".form_submit-button");

  constructor() {
    console.debug("New booking form");
    this.submit_cta.addEventListener("click", this.submit);
    this.success_message = document.querySelector(".form_success-message");
    document
      .querySelector('input[type="file"]')
      .addEventListener("change", this.onFileUpload);
  }

  onFileUpload = ({ target }) =>
    (document.querySelector('label[for="photo"]').innerHTML =
      target.files[0].name);

  submit = (e) => {
    e.preventDefault();
    e.target.classList.add("disabled");
    document.querySelector(".form_error-message").innerHTML = "";
    this.success_message.classList.add("hidden");
    this.success_message.classList.add("hidden-m");
    this.sendRequest();
  };

  sendRequest = () =>
    fetch("/api/mailer", {
      method: "POST",
      body: new FormData(this.form),
    })
      .then((response) => response.json())
      .then(({ error, details, success }) => {
        console.log("success", success);
        console.log("details", details);
        console.log("error", error);
        success ? this.onSuccess() : this.onError(error);
      })
      .finally(() => this.submit_cta.classList.remove("disabled"));

  onSuccess = () => {
    this.success_message.classList.remove("hidden");
    this.success_message.classList.remove("hidden-m");
  };

  onError = (error) =>
    (document.querySelector(".form_error-message").innerHTML = error);
}

export default BookingForm;
