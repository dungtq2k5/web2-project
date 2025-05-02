import {
  getUsersList,
  createUser,
  deleteUser,
  getUser,
  updateUser,
  getFilterUsersList
} from "../controllers/users.js";
import { getRolesList } from "../controllers/roles.js";
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


const crudUserMsg = $("#crud-user-msg");
const backdrop = $("#backdrop");
const resultCount = $("#result-count");
const tbody = $("#tbody");

export default function renderUsersManagePage() {
  $("#create-user-btn").click(async () => {
    await renderCreateUserForm();
  });

  const searchForm = $("#search-user-form");
  const searchInput = searchForm.find("#search-user-form-input");
  const searchBtn = searchForm.find("#search-user-form-search-btn");
  const clearBtn = searchForm.find("#search-user-form-clear-btn");

  searchForm.submit(async e => {
    e.preventDefault();
    searchBtn.prop("disabled", true);
    searchBtn.text("searching...");

    const filteredUsersList = await getFilterUsersList(searchInput.val());
    await renderUsersData(filteredUsersList);

    searchBtn.text("search");
    searchBtn.prop("disabled", false);
  });

  clearBtn.click(async () => {
    clearBtn.prop("disabled", true);
    clearBtn.text("clearing...");

    await renderUsersData();

    clearBtn.text("clear search");
    clearBtn.prop("disabled", false);
  });

  renderUsersData();
}

async function renderUsersData(usersList=null) {
  tbody.html("<tr><td colspan='10'>Loading data...</td></tr>");
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
        <tr class="content__tr--g">
          <td data-cell="n.o" class="content__td--g">${idx}</td>
          <td data-cell="id" class="content__td--g">${user.id}</td>
          <td data-cell="full name" class="content__td--g">${user.full_name}</td>
          <td data-cell="email" class="content__td--g">${user.email}</td>
          <td data-cell="phone number" class="content__td--g">${user.phone_number}</td>
          <td data-cell="addresses" class="content__td--g">
            <ul>${addressesHTML || "none"}</ul>
          </td>
          <td data-cell="roles" class="content__td--g">
            <ul>${rolesHTML || "none"}</ul>
          </td>
          <td data-cell="created at" class="content__td--g">${convertUtcToLocalDatetime(user.created_at)}</td>
          <td data-cell="updated at" class="content__td--g">${convertUtcToLocalDatetime(user.updated_at)}</td>
          <td
            data-cell="actions"
            class="content__td--g js-action-btns"
            data-user-id="${user.id}"
            data-user-number="${idx}"
          >
            <button class="js-update-user-btn">update</button>
            <button class="js-delete-user-btn">delete</button>
          </td>
        </tr>
      `;
    });

    return dataHTML || "<tr><td colspan='10'>No data found!</td></tr>";
  });

  tbody.find(".js-action-btns").on("click", ".js-delete-user-btn", e => {
    const td = $(e.currentTarget).parent();
    const userId = td.data("user-id");
    const userNum = td.data("user-number");
    renderDeleteUserPopup(userNum, userId);
  });

  tbody.find(".js-action-btns").on("click", ".js-update-user-btn", e => {
    const td = $(e.currentTarget).parent();
    const userId = td.data("user-id");
    const userNum = td.data("user-number");
    renderUpdateUserForm(userNum, userId);
  });

  resultCount.text(users.length);
}

async function renderCreateUserForm() {
  disableBgScroll();
  backdrop.html("<p>Loading create user form...</p>");
  backdrop.show();
  const roles = await getRolesList();

  backdrop.html(() => {
    const rolesHTML = roles.map(role => (
      `
        <li>
          <input type="checkbox" id="${role.id}">
          <label for="${role.id}">${role.name}</label>
        </li>
      `
    )).join("");

    return `
      <form class="form--g" id="create-user-form">
        <button type="button" class="form__close--g js-create-user-form-close-btn"><i class="uil uil-times"></i></button>
        <h2 class="form__title--g">Create user form</h2>

        <div>
          <div class="form__field--g">
            <label for="fullname">Full name</label>
            <input
              type="text"
              name="full_name"
              id="fullname"
              placeholder="Elon Musk"
              class="form__input--g"
            >
          </div>
          <span id="fullname-msg"></span>
        </div>

        <div>
          <div class="form__field--g">
            <label for="email">Email * unique</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="info@tesla.com"
              class="form__input--g"
            >
          </div>
          <span id="email-msg"></span>
        </div>

        <div>
          <div class="form__field--g">
            <label for="phone">Phone number</label>
            <input
              type="tel"
              name="phone_number"
              id="phone"
              placeholder="0392018660"
              title="Only accept VN phone number."
              class="form__input--g"
            >
          </div>
          <span id="phone-msg"></span>
        </div>

        <div>
          <div class="form__field--g">
            <label for="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="password123456789"
              title="Password must be at least 8 characters long and contain at least one letter or number."
              class="form__input--g"
            >
          </div>
          <span id="password-msg"></span>
        </div>

        <div class="form__field--g">
          <p title="If not select any roles, user will be restricted">Roles:</p>
          <ul id="create-user-form-roles">${rolesHTML}</ul>
        </div>

        <div>
          <button type="submit" id="create-user-form-submit-btn">create</button>
          <button type="button" class="js-create-user-form-close-btn">cancel</button>
        </div>

        <span id="submit-msg"></span>
      </form>
    `
  });

  const form = backdrop.find("#create-user-form");

  form.find(".js-create-user-form-close-btn").click(() => closeForm(backdrop));

  form.submit(async e => {
    e.preventDefault();

    const submitBtn = backdrop.find("#create-user-form-submit-btn");
    submitBtn.prop("disabled", true);
    submitBtn.text("creating user...");

    const formData = filterTextInputsInFormData(new FormData(form[0]));

    const fullnameMsg = backdrop.find("#fullname-msg");
    const emailMsg = backdrop.find("#email-msg");
    const phoneNumberMsg = backdrop.find("#phone-msg");
    const passwordMsg = backdrop.find("#password-msg");

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
      backdrop.find("#create-user-form-roles input[type='checkbox']:checked").each((idx, e) => {
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

      submitBtn.text("create");
      submitBtn.prop("disabled", false);
      backdrop.find("#submit-msg").text(res.message);
    }
  });
}

function renderDeleteUserPopup(number, id) {
  disableBgScroll();

  backdrop.html(`
    <div class="form--g">
      <button class="form__close--g js-delete-user-popup-close-btn"><i class="uil uil-times"></i></button>
      <h2 class="form__title--g">Confirm delete user id ${id} - number ${number}?</h2>

      <div>
        <button id="delete-user-popup-submit-btn">delete</button>
        <button class="js-delete-user-popup-close-btn">cancel</button>
      </div>

      <span id="delete-user-popup-msg"></span>
    </div>
  `);

  backdrop.find(".js-delete-user-popup-close-btn").click(() => closePopup(backdrop));

  const submitBtn = backdrop.find("#delete-user-popup-submit-btn");
  submitBtn.click(async () => {
    submitBtn.prop("disabled", true);
    submitBtn.text("deleting...");

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
  backdrop.html("<p>Loading update user form...</p>");
  backdrop.show();

  try {
    const user = await getUser(id);
    const roles = await getRolesList();

    backdrop.html(() => {
      const rolesHTML = roles.map(role => {
        const isChecked = user.roles.some(userRole => userRole.id == role.id);
        return `
          <li>
            <input
              type="checkbox"
              id="${role.id}"
              ${isChecked && "checked"}
            >
            <label for="${role.id}">${role.name}</label>
          </li>
        `
      }).join("");

      return `
        <form class="form--g" id="update-user-form">
          <button type="button" class="form__close--g js-update-user-form-close-btn"><i class="uil uil-times"></i></button>
          <h2 class="form__title--g">Update user id ${id} - number ${number} form</h2>

          <div>
            <div class="form__field--g">
              <label for="fullname">Full name</label>
              <input
                type="text"
                name="full_name"
                id="fullname"
                placeholder="${user.full_name}"
                value="${user.full_name}"
                class="form__input--g"
              >
            </div>
            <span id="fullname-msg"></span>
          </div>

          <div>
            <div class="form__field--g">
              <label for="email">Email * unique</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="${user.email}"
                value="${user.email}"
                class="form__input--g"
              >
            </div>
            <span id="email-msg"></span>
          </div>

          <div>
            <div class="form__field--g">
              <label for="phone">Phone number</label>
              <input
                type="tel"
                name="phone_number"
                id="phone"
                placeholder="${user.phone_number}"
                value="${user.phone_number}"
                title="Only accept VN phone number."
                class="form__input--g"
              >
            </div>
            <span id="phone-msg"></span>
          </div>

          <div>
            <div class="form__field--g">
              <label for="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="password123456789"
                title="Password must be at least 8 characters long and contain at least one letter or number."
                class="form__input--g"
              >
            </div>
            <span id="password-msg"></span>
          </div>

          <div class="form__field--g">
            <p title="If not select any roles, user will be restricted">Roles:</p>
            <ul id="update-user-form-roles">${rolesHTML}</ul>
          </div>

          <div>
            <button type="submit" id="update-user-form-submit-btn">update</button>
            <button type="button" class="js-update-user-form-close-btn">cancel</button>
          </div>

          <span id="submit-msg"></span>
        </form>
      `
    });

    const form = backdrop.find("#update-user-form");

    form.find(".js-update-user-form-close-btn").click(() => closeForm(backdrop));

    form.submit(async e => {
      e.preventDefault();

      const submitBtn = backdrop.find("#update-user-form-submit-btn");
      submitBtn.prop("disabled", true);
      submitBtn.text("updating user...");

      const formData = filterTextInputsInFormData(new FormData(form[0]));

      const fullnameMsg = backdrop.find("#fullname-msg");
      const emailMsg = backdrop.find("#email-msg");
      const phoneNumberMsg = backdrop.find("#phone-msg");
      const passwordMsg = backdrop.find("#password-msg");

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
        backdrop.find("#update-user-form-roles input[type='checkbox']:checked").each((idx, e) => {
          rolesId.push($(e).attr("id"));
        });

        if(!formData.get("password")) formData.delete("password"); // Only update password if field is provided

        const res = await updateUser(
          id,
          {...Object.fromEntries(formData), roles_id: rolesId} // FormData only accept string
        );

        if(res.success) {
          crudUserMsg.text(`* user id ${id} - number ${number} was updated`);
          setTimeout(() => {
            crudUserMsg.text("");
          }, DISPLAY_MSG_TIMEOUT);
          renderUsersData(); // Re-render
          closeForm(backdrop);
          return;
        }

        backdrop.find("#submit-msg").text(`Error: ${res.message}`);
      }

      submitBtn.text("update");
      submitBtn.prop("disabled", false);
    });

  } catch(error) {
    console.error(`Error: ${error.message}`);
    backdrop.html(`<p>Error loading update user form: ${error.message}</p>`);
  }
}
