import {
  filterTextInputsInFormData,
  isValidEmail,
  isValidPassword,
  isValidVNPhoneNumber
} from "../../utils.js";
import { signup } from "../../models/auth.js";


function signupForm() {
  const form = $("#signup-form");

  const submitBtn = form.find("#submit");

  const fullNameMsg = form.find("#full-name-msg");
  const emailMsg = form.find("#email-msg");
  const phoneMsg = form.find("#phone-msg");
  const passwordMsg = form.find("#password-msg");

  form.submit(async e => {
    e.preventDefault();
    submitBtn.prop("disabled", true);
    submitBtn.text("Validating...");

    const formData = filterTextInputsInFormData(new FormData(form[0]));

    const validateForm = () => {
      let allValid = true;

      if(!formData.get("full_name")) {
        fullNameMsg.text("* required");
        allValid = false;
      } else {
        fullNameMsg.text("");
      }

      if(!formData.get("email")) {
        emailMsg.text("* required");
        allValid = false;
      } else if(!isValidEmail(formData.get("email"))) {
        emailMsg.text("* invalid email");
        allValid = false;
      } else {
        emailMsg.text("");
      }

      if(!formData.get("phone_number")) {
        phoneMsg.text("* required");
        allValid = false;
      } else if(!isValidVNPhoneNumber(formData.get("phone_number"))) {
        phoneMsg.text("* invalid phone number");
        allValid = false;
      } else {
        phoneMsg.text("");
      }

      if(!formData.get("password")) {
        passwordMsg.text("* required");
        allValid = false;
      } else if(!isValidPassword(formData.get("password"))) {
        passwordMsg.text("* invalid password");
        allValid = false;
      } else {
        passwordMsg.text("");
      }

      return allValid;
    }

    if(validateForm()) {
      const res = await signup(Object.fromEntries(formData));

      if(res.success) {
        console.log("Signup successful");
        window.location.href = "./index.php?page=signin";
        return;
      }

      $("#signup-form-msg").text(res.message);
    }

    submitBtn.prop("disabled", false);
    submitBtn.text("Sign Up");
  });
}

signupForm();