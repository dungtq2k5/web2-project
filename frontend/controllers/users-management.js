import {
  getUsersList,
  createUser,
  deleteUser,
  getUser,
  updateUser,
  getFilterUsersList
} from "../models/users.js";
import { getRolesList } from "../models/roles.js";
import {
  disableBgScroll,
  isValidEmail,
  isValidPassword,
  isValidVNPhoneNumber,
  formatAddress,
  filterTextInputsInFormData,
  convertUtcToLocalDatetime
} from "../utils.js";
import { closeForm, closePopup } from "./components.js";
import { DISPLAY_MSG_TIMEOUT } from "../settings.js";
import { hasPermission } from "../models/auth.js";

const crudUserMsg = $("#crud-user-msg");
const backdrop = $("#backdrop");
const resultCount = $("#result-count");
const tbody = $("#tbody");

const canUpdate = hasPermission("UPDATE_USER");
const canDelete = hasPermission("DELETE_USER");

export default function renderUsersManagePage() {
  if(hasPermission("CREATE_USER")) {
    $("#create-user-btn").click(() => {
      renderCreateUserForm();
    });
  } else {
    $("#create-user-btn").remove();
  }

  const searchForm = $("#search-user-form");
  const searchInput = searchForm.find("#search-user-form-input");
  const searchBtn = searchForm.find("#search-user-form-search-btn");
  const clearBtn = searchForm.find("#search-user-form-clear-btn");

  searchForm.submit(async e => {
    e.preventDefault();
    searchBtn.prop("disabled", true);
    searchBtn.text("Searching...");

    const filteredUsersList = await getFilterUsersList(searchInput.val());
    await renderUsersData(filteredUsersList);

    searchBtn.text("Search");
    searchBtn.prop("disabled", false);
  });

  clearBtn.click(async () => {
    clearBtn.prop("disabled", true);
    clearBtn.text("Clearing...");

    await renderUsersData();

    clearBtn.text("Clear search");
    clearBtn.prop("disabled", false);
  });

  renderUsersData();
}

async function renderUsersData(usersList=null) {
  tbody.html("<tr><td colspan='10' class='text-center'>Loading data...</td></tr>");

  try {
    const users = usersList || await getUsersList();

    tbody.html(() => {
      let dataHTML;

      users.forEach((user, idx) => {
        idx++;
        const addressesHTML = user.addresses.map(address => (
          `<li><address>${formatAddress(address)}</address></li>`
        )).join("");
        const rolesHTML = user.roles.map(role => (
          `<li>${role.name}</li>`
        )).join("");

        dataHTML += `
          <tr class="align-middle">
            <td data-cell="n.o" class="text-center">${idx}</td>
            <td data-cell="id" class="text-center">${user.id}</td>
            <td data-cell="full name" class="content__td--g">${user.full_name}</td>
            <td data-cell="email" class="content__td--g">${user.email}</td>
            <td data-cell="phone number" class="content__td--g">${user.phone_number}</td>
            <td data-cell="addresses" class="content__td--g">
              <ul class="list-unstyled mb-0">${addressesHTML || "<span class='text-muted'>none</span>"}</ul>
            </td>
            <td data-cell="roles" class="content__td--g">
              <ul class="list-unstyled mb-0">${rolesHTML || "<span class='text-muted'>none</span>"}</ul>
            </td>
            <td data-cell="created at" class="content__td--g">${convertUtcToLocalDatetime(user.created_at)}</td>
            <td data-cell="updated at" class="content__td--g">${convertUtcToLocalDatetime(user.updated_at)}</td>
            <td
              data-cell="actions"
              class="text-center"
              data-user-id="${user.id}"
              data-user-number="${idx}"
            >
              <div class="d-flex gap-1 btn-group-sm">
                ${canUpdate ? "<button class='js-update-user-btn btn btn-info'><i class='uil uil-pen'></i></button>" : ""}
                ${canDelete ? "<button class='js-delete-user-btn btn btn-danger'><i class='uil uil-trash'></i></button>" : ""}
                ${!canUpdate && !canDelete ? "span class='text-muted'>No actions</span>" : ""}
              </div>
            </td>
          </tr>
        `;
      });

      return dataHTML || "<tr><td colspan='10' class='text-center text-muted'>No data found!</td></tr>";
    });

    if(canDelete) {
      tbody.find(".js-delete-user-btn").click(e => {
        const td = $(e.currentTarget).closest("td");
        const userId = td.data("user-id");
        const userNum = td.data("user-number");

        renderDeleteUserPopup(userNum, userId);
      });
    }

    if(canUpdate) {
      tbody.find(".js-update-user-btn").click(e => {
        const td = $(e.currentTarget).closest("td");
        const userId = td.data("user-id");
        const userNum = td.data("user-number");

        renderUpdateUserForm(userNum, userId);
      });
    }

    resultCount.text(users.length);

  } catch(error) {
    console.error(`Error: ${error.message}`);
    tbody.html(`<tr><td colspan='10'>Error loading data: ${error.message}</td></tr>`);
  }
}

async function renderCreateUserForm() {
  disableBgScroll();
  backdrop.html("<p class='text-center p-5'>Loading create user form...</p>");
  backdrop.show();

  try {
    const roles = await getRolesList();

    backdrop.html(() => {
      const rolesHTML = roles.map(role => (`
        <li class="list-group-item">
          <input type="checkbox" id="${role.id}" class="form-check-input me-1">
          <label for="${role.id}" class="form-check-label">${role.name}</label>
        </li>
      `)).join("");

      return `
        <form class="form--g card p-4 shadow-lg" id="create-user-form" style="max-width: 600px; margin: 2rem auto;">
          <button type="button" class="btn-close position-absolute top-0 end-0 m-3 js-create-user-form-close-btn" aria-label="Close"></button>
          <h2 class="form__title--g mb-4">Create user form</h2>

          <div class="mb-3">
        <div class="form__field--g">
          <label for="fullname" class="form-label">Full name</label>
          <input
            type="text"
            name="full_name"
            id="fullname"
            placeholder="Elon Musk"
            class="form-control form__input--g"
          >
        </div>
        <span id="fullname-msg" class="text-danger d-block mt-1"></span>
          </div>

          <div class="mb-3">
        <div class="form__field--g">
          <label for="email" class="form-label">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="info@tesla.com"
            class="form-control form__input--g"
          >
        </div>
        <span id="email-msg" class="text-danger d-block mt-1"></span>
          </div>

          <div class="mb-3">
        <div class="form__field--g">
          <label for="phone" class="form-label">Phone number</label>
          <input
            type="tel"
            name="phone_number"
            id="phone"
            placeholder="0392018660"
            class="form-control form__input--g"
          >
          <small class="form-text text-muted">Only accept VN phone number.</small>
        </div>
        <span id="phone-msg" class="text-danger d-block mt-1"></span>
          </div>

          <div class="mb-3">
        <div class="form__field--g">
          <label for="password" class="form-label">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="password123456789"
            class="form-control form__input--g"
          >
          <small class="form-text text-muted">Password must be at least 8 characters long and contain at least one letter or number.</small>
        </div>
        <span id="password-msg" class="text-danger d-block mt-1"></span>
          </div>

          <div class="form__field--g mb-3">
        <p class="form-label">Roles:</p>
        <ul id="create-user-form-roles" class="list-group">${rolesHTML}</ul>
          </div>

          <div class="d-grid gap-2 d-md-flex justify-content-md-end">
        <button type="submit" id="create-user-form-submit-btn" class="btn btn-dark btn-sm">create</button>
        <button type="button" class="js-create-user-form-close-btn btn btn-outline-dark btn-sm">cancel</button>
          </div>

          <span id="submit-msg" class="text-danger d-block mt-3 text-center"></span>
        </form>
      `
    });

    const form = backdrop.find("#create-user-form");

    form.find(".js-create-user-form-close-btn").click(() => closeForm(backdrop));

    form.submit(async e => {
      e.preventDefault();

      const submitBtn = form.find("#create-user-form-submit-btn");
      submitBtn.prop("disabled", true);
      submitBtn.text("creating user...");

      const formData = filterTextInputsInFormData(new FormData(form[0]));

      const fullnameMsg = form.find("#fullname-msg");
      const emailMsg = form.find("#email-msg");
      const phoneNumberMsg = form.find("#phone-msg");
      const passwordMsg = form.find("#password-msg");

      const validateForm = () => {
        let allValid = true;

        if(!formData.get("full_name")) {
          fullnameMsg.text("* required");
          allValid = false;
        } else fullnameMsg.text("");

        if(!formData.get("email")) {
          emailMsg.text("* required");
          allValid = false;
        } else if(!isValidEmail(formData.get("email"))) {
          emailMsg.text("invalid email");
          allValid = false;
        } else emailMsg.text("");

        if(!formData.get("phone_number")) {
          phoneNumberMsg.text("* required");
          allValid = false;
        } else if(!isValidVNPhoneNumber(formData.get("phone_number"))) {
          phoneNumberMsg.text("invalid phone number");
          allValid = false;
        } else phoneNumberMsg.text("");

        if(!formData.get("password")) {
          passwordMsg.text("* required");
          allValid = false;
        } else if(!isValidPassword(formData.get("password"))) {
          passwordMsg.text("invalid password");
          allValid = false;
        } else passwordMsg.text("");

        return allValid;
      }

      if(validateForm()) {
        const rolesId= [];
        form.find("#create-user-form-roles input[type='checkbox']:checked").each((idx, e) => {
          rolesId.push($(e).attr("id"));
        });

        const res = await createUser({...Object.fromEntries(formData), roles_id: rolesId}); // FormData only accept string

        if(res.success) {
          crudUserMsg.text("* new user was created");
          setTimeout(() => {
            crudUserMsg.text("");
          }, DISPLAY_MSG_TIMEOUT);
          renderUsersData(); // Re-render
          closeForm(backdrop);
          return;
        }

        form.find("#submit-msg").text(res.message);
      }

      submitBtn.text("create");
      submitBtn.prop("disabled", false);
    });

  } catch(error) {
    console.error(`Error: ${error.message}`);
    backdrop.html(`<p>Error loading form: ${error.message}</p>`);
  }
}

function renderDeleteUserPopup(number, id) {
  disableBgScroll();

  backdrop.html(`
    <div class="form--g card p-4 shadow-lg text-center" style="max-width: 500px; margin: 2rem auto;">
      <button class="btn-close position-absolute top-0 end-0 m-3 js-delete-user-popup-close-btn" aria-label="Close"></button>
      <h2 class="form__title--g mb-4">Confirm delete user id ${id} - number ${number}?</h2>

      <div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
        <button id="delete-user-popup-submit-btn" class="btn btn-dark btn-sm">Delete</button>
        <button class="js-delete-user-popup-close-btn btn btn-outline-dark btn-sm">Cancel</button>
      </div>

      <span id="delete-user-popup-msg" class="text-danger d-block mt-3"></span>
    </div>
  `);

  backdrop.find(".js-delete-user-popup-close-btn").click(() => closePopup(backdrop));

  const submitBtn = backdrop.find("#delete-user-popup-submit-btn");
  submitBtn.click(async () => {
    submitBtn.prop("disabled", true);
    submitBtn.text("deleting user...");

    const res = await deleteUser(id);
    if(res.success) {
      crudUserMsg.text(`* user id ${id} - number ${number} was deleted`);
      setTimeout(() => {
        crudUserMsg.text("");
      }, DISPLAY_MSG_TIMEOUT);
      renderUsersData(); // Re-render
      closePopup(backdrop);
      return;
    }

    submitBtn.text("delete");
    submitBtn.prop("disabled", false);
    backdrop.find("#delete-user-popup-msg").text(`Error: ${res.message}`);
  });

  backdrop.show();
}

async function renderUpdateUserForm(number, id) {
  disableBgScroll();
  backdrop.html("<p class='text-center p-5'>Loading update user form...</p>");
  backdrop.show();

  try {
    const user = await getUser(id);
    const roles = await getRolesList();

    backdrop.html(() => {
      const rolesHTML = roles.map(role => {
        const isChecked = user.roles.some(userRole => userRole.id == role.id);

        return `
          <li class="list-group-item">
            <input
              type="checkbox"
              id="${role.id}"
              class="form-check-input me-1"
              ${isChecked ? "checked" : ""}
            >
            <label for="${role.id}" class="form-check-label">${role.name}</label>
          </li>
        `
      }).join("");

      return `
        <form class="form--g card p-4 shadow-lg" id="update-user-form" style="max-width: 600px; margin: 2rem auto;">
          <button type="button" class="btn-close position-absolute top-0 end-0 m-3 js-update-user-form-close-btn" aria-label="Close"></button>
          <h2 class="form__title--g mb-4">Update user id ${id} - number ${number} form</h2>

          <div class="mb-3">
        <div class="form__field--g">
          <label for="fullname" class="form-label">Full name</label>
          <input
            type="text"
            name="full_name"
            id="fullname"
            placeholder="${user.full_name}"
            value="${user.full_name}"
            class="form-control form__input--g"
          >
        </div>
        <span id="fullname-msg" class="text-danger d-block mt-1"></span>
          </div>

          <div class="mb-3">
        <div class="form__field--g">
          <label for="email" class="form-label">Email * unique</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="${user.email}"
            value="${user.email}"
            class="form-control form__input--g"
          >
        </div>
        <span id="email-msg" class="text-danger d-block mt-1"></span>
          </div>

          <div class="mb-3">
        <div class="form__field--g">
          <label for="phone" class="form-label">Phone number</label>
          <input
            type="tel"
            name="phone_number"
            id="phone"
            placeholder="${user.phone_number}"
            value="${user.phone_number}"
            class="form-control form__input--g"
          >
          <small class="form-text text-muted">Only accept VN phone number.</small>
        </div>
        <span id="phone-msg" class="text-danger d-block mt-1"></span>
          </div>

          <div class="mb-3">
        <div class="form__field--g">
          <label for="password" class="form-label">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="password123456789"
            class="form-control form__input--g"
          >
          <small class="form-text text-muted">
            Password must be at least 8 characters long and contain at least one letter or number.
            Leave blank if you don't want to change the password.
          </small>
        </div>
        <span id="password-msg" class="text-danger d-block mt-1"></span>
          </div>

          <div class="form__field--g mb-3">
        <p class="form-label">Roles:</p>
        <ul id="update-user-form-roles" class="list-group">${rolesHTML}</ul>
          </div>

          <div class="d-grid gap-2 d-md-flex justify-content-md-end">
        <button type="submit" id="update-user-form-submit-btn" class="btn btn-dark btn-sm">update</button>
        <button type="button" class="js-update-user-form-close-btn btn btn-outline-dark btn-sm">cancel</button>
          </div>

          <span id="submit-msg" class="text-danger d-block mt-3 text-center"></span>
        </form>
      `
    });

    const form = backdrop.find("#update-user-form");

    form.find(".js-update-user-form-close-btn").click(() => closeForm(backdrop));

    form.submit(async e => {
      e.preventDefault();

      const submitBtn = form.find("#update-user-form-submit-btn");
      submitBtn.prop("disabled", true);
      submitBtn.text("updating user...");

      const formData = filterTextInputsInFormData(new FormData(form[0]));

      const fullnameMsg = form.find("#fullname-msg");
      const emailMsg = form.find("#email-msg");
      const phoneNumberMsg = form.find("#phone-msg");
      const passwordMsg = form.find("#password-msg");

      const validateForm = () => {
        let allValid = true;

        if(!formData.get("full_name")) {
          fullnameMsg.text("* required");
          allValid = false;
        } else fullnameMsg.text("");

        if(!formData.get("email")) {
          emailMsg.text("* required");
          allValid = false;
        } else if(!isValidEmail(formData.get("email"))) {
          emailMsg.text("invalid email");
          allValid = false;
        } else emailMsg.text("");

        if(!formData.get("phone_number")) {
          phoneNumberMsg.text("* required");
          allValid = false;
        } else if(!isValidVNPhoneNumber(formData.get("phone_number"))) {
          phoneNumberMsg.text("invalid phone number");
          allValid = false;
        } else phoneNumberMsg.text("");

        if(formData.get("password") && !isValidPassword(formData.get("password"))) {
          passwordMsg.text("invalid password");
          allValid = false;
        } else passwordMsg.text("");

        return allValid;
      }

      if(validateForm()) {
        const rolesId= [];
        form.find("#update-user-form-roles input[type='checkbox']:checked").each((idx, e) => {
          rolesId.push($(e).attr("id"));
        });

        if(!formData.get("password")) formData.delete("password");

        const res = await updateUser(
          id,
          {...Object.fromEntries(formData), roles_id: rolesId}
        );

        if(res.success) {
          crudUserMsg.text(`* user id ${id} - number ${number} was updated`);
          setTimeout(() => {
            crudUserMsg.text("");
          }, DISPLAY_MSG_TIMEOUT);
          renderUsersData();
          closeForm(backdrop);
          return;
        }

        form.find("#submit-msg").text(`Error: ${res.message}`);
      }

      submitBtn.text("update");
      submitBtn.prop("disabled", false);
    });

  } catch(error) {
    console.error(`Error: ${error.message}`);
    backdrop.html(`<p>Error loading update user form: ${error.message}</p>`);
  }
}

renderUsersManagePage();