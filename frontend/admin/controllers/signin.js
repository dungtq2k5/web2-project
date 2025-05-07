import { signin, getSigninUser } from "../../models/auth.js";
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
    submitBtn.text("Validating...");

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
        console.log("Sign in success");
        console.log(getSigninUser());
        window.location.href = "index.php?page=users-management"; // Redirect to admin page
        return;
      }

      msg.text(errorMsg);
    }

    submitBtn.text("Sign Me In");
    submitBtn.prop("disabled", false);
  });
}

signinForm();
