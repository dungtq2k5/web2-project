import { signin, getSigninUser, isBuyer } from "../../models/auth.js";
import {
  filterTextInputsInFormData,
  isValidEmail,
  isValidPassword
} from "../../utils.js";


function signinForm() {
  const form = $("#signin-form");

  const submitBtn = form.find("#submit");
  const emailMsg = form.find("#email-msg");
  const passwordMsg = form.find("#password-msg");
  const msg = form.find("#signin-form-msg");

  form.submit(async e => {
    e.preventDefault();
    submitBtn.prop("disabled", true);
    submitBtn.html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Validating...`);

    const formData = filterTextInputsInFormData(new FormData(form[0]));

    const validateForm = () => {
      let allValid = true;

      if(!formData.get("email")) {
        emailMsg.text("* required");
        allValid = false;
      } else {
        emailMsg.text("");
      }

      if(!formData.get("password")) {
        passwordMsg.text("* required");
        allValid = false;
      } else{
        passwordMsg.text("");
      }

      return allValid;
    }

    if(validateForm()) {
      let success = true;
      let errorMsg = "Invalid credentials";

      if(!isValidEmail(formData.get("email")) || !isValidPassword(formData.get("password"))) {
        success = false;
      } else {
        const res = await signin(formData.get("email"), formData.get("password"));
        success = res.success;
        errorMsg = res.message;
      }

      if(success) {
        if(!isBuyer()) {
          msg.text("Sorry, you have been blocked by the admin");
          submitBtn.html(`<i class="uil uil-arrow-right"></i> Sign Me In`); // Reset button text
          submitBtn.prop("disabled", false); // Re-enable button
          return;
        }
        console.log("Sign in success");
        console.log(getSigninUser());
        submitBtn.html(`<i class="uil uil-check-circle"></i> Success! Redirecting...`);
        window.location.href = "./index.php?page=home";
        return;
      }

      msg.text(errorMsg);
    }

    submitBtn.html(`<i class="uil uil-arrow-right"></i> Sign Me In`);
    submitBtn.prop("disabled", false);
  });
}

signinForm();
