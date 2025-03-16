import {
  getUsersList,
  createUser,
  getAuth,
  deleteUser,
  getUser,
  updateUser,
  getFilterUsersList
} from "../controllers/users.js";
import { getRolesList } from "../controllers/roles.js";
import {
  disableBgScroll,
  removeOddSpace,
  isValidEmail,
  isValidPassword,
  isValidVNPhoneNumber
} from "../utils.js";
import { closeForm, closePopup } from "./components.js";


const createUserBtn = $("#create-user-btn");
const crudUserMsg = $("#crud-user-msg");
const backdrop = $("#backdrop");

const resultCount = $("#result-count");

export default function renderUsersManagePage() {
  createUserBtn.click(async () => {
    createUserBtn.prop("disabled", true);
    await renderCreateUserForm();
    disableBgScroll();
  });

  const searchInput = $("#search-input");
  const searchBtn = $("#search-btn");
  searchBtn.click(async e => {
    e.preventDefault();
    searchBtn.prop("disabled", true);
    searchBtn.text("searching...");

    const valSearch = searchInput.val();
    const filteredUsersList = await getFilterUsersList(valSearch);
    renderUsersData(filteredUsersList);

    searchBtn.text("search");
    searchBtn.prop("disabled", false);
  });

  $("#clear-search-btn").click(e => {
    e.preventDefault();
    searchInput.val("");
    renderUsersData();
  });

  renderUsersData();
}

async function renderUsersData(usersList=null) {
  const tbody = $("#tbody");
  tbody.html("<tr><td colspan='10'>Loading data...</td></tr>");
  const users = usersList || await getUsersList();

  tbody.html(() => {
    let dataHTML;

    users.forEach((user, idx) => {
      idx++;
      //TODO format address
      const addressesHTML = user.addresses.map(address => (
        `<li title="${address.name}"><address>${address.name}</address></li>`
      )).join("");
      const rolesHTML = user.roles.map(role => (
        `<li title="${role.name}">${role.name}</li>`
      )).join("");

      dataHTML += `
        <tr class="content__tr--g">
          <td data-cell="n.o" class="content__td--g" title="${idx}">${idx}</td>
          <td data-cell="id" class="content__td--g" title="${user.id}">${user.id}</td>
          <td data-cell="full name" class="content__td--g" title="${user.full_name}">${user.full_name}</td>
          <td data-cell="email" class="content__td--g" title="${user.email}">${user.email}</td>
          <td data-cell="phone number" class="content__td--g" title="${user.phone_number}">${user.phone_number}</td>
          <td data-cell="addresses" class="content__td--g">
            <ul>${addressesHTML}</ul>
          </td>
          <td data-cell="roles" class="content__td--g">
            <ul>${rolesHTML}</ul>
          </td>
          <td data-cell="created at" class="content__td--g" title="${user.created_at}">${user.created_at}</td>
          <td data-cell="updated at" class="content__td--g" title="${user.updated_at}">${user.updated_at}</td>
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
          <button id="create-user-form-submit-btn">create</button>
          <button type="button" class="js-create-user-form-close-btn">cancel</button>
        </div>

        <span id="submit-msg"></span>
      </form>
    `
  });

  const form = $("#create-user-form");

  form.find(".js-create-user-form-close-btn").click(() => closeForm(backdrop));

  const submitBtn = form.find("#create-user-form-submit-btn");
  submitBtn.click(async e => {
    e.preventDefault();
    const fullnameMsg = form.find("#fullname-msg");
    const emailMsg = form.find("#email-msg");
    const phoneNumberMsg = form.find("#phone-msg");
    const passwordMsg = form.find("#password-msg");

    const fullname = removeOddSpace(form.find("#fullname").val());
    const email = removeOddSpace(form.find("#email").val());
    const phoneNumber = removeOddSpace(form.find("#phone").val());
    const password = removeOddSpace(form.find("#password").val());

    const validateForm = () => {
      let allValid = true;

      if(!fullname) {
        fullnameMsg.text("* required");
        allValid = false;
      } else fullnameMsg.text("");

      if(!email) {
        emailMsg.text("* required");
        allValid = false;
      } else if(!isValidEmail(email)) {
        emailMsg.text("invalid email");
        allValid = false;
      } else emailMsg.text("");

      if(!phoneNumber) {
        phoneNumberMsg.text("* required");
        allValid = false;
      } else if(!isValidVNPhoneNumber(phoneNumber)) {
        phoneNumberMsg.text("invalid phone number");
        allValid = false;
      } else phoneNumberMsg.text("");

      if(!password) {
        passwordMsg.text("* required");
        allValid = false;
      } else if(!isValidPassword(password)) {
        passwordMsg.text("invalid password");
        allValid = false;
      } else passwordMsg.text("");

      return allValid;
    }

    if(validateForm()) {
      submitBtn.prop("disabled", true);
      submitBtn.text("creating user...");

      const rolesId= [];
      form.find("#create-user-form-roles input[type='checkbox']:checked").each((idx, e) => {
        rolesId.push($(e).attr("id"));
      });
      const user = {
        full_name: fullname,
        email: email,
        phone_number: phoneNumber,
        password: password,
        roles_id: rolesId,
      }
      const res = await createUser(user, getAuth());

      if(!res.success) {
        submitBtn.text("create");
        form.find("#submit-msg").text(res.message);
        return;
      }

      crudUserMsg.text("* new user was created");
      setTimeout(() => {
        crudUserMsg.text("");
      }, 2000);
      renderUsersData(); //re-render
      closeForm(backdrop);
    }
  });
}

function renderDeleteUserPopup(number, id) {
  disableBgScroll();

  backdrop.html(`
    <div class="form--g" id="delete-user-popup">
      <button type="button" class="form__close--g js-delete-user-popup-close-btn"><i class="uil uil-times"></i></button>
      <h2 class="form__title--g">Confirm delete user id ${id} - number ${number}?</h2>

      <div>
        <button id="delete-user-popup-submit-btn">delete</button>
        <button type="button" class="js-delete-user-popup-close-btn">cancel</button>
      </div>

      <span id="delete-user-popup-msg"></span>
    </div>
  `);

  const popup = $("#delete-user-popup");

  popup.find(".js-delete-user-popup-close-btn").click(() => closePopup(backdrop));

  const submitBtn = popup.find("#delete-user-popup-submit-btn");
  submitBtn.click(async () => {
    submitBtn.prop("disabled", true);
    submitBtn.text("deleting...");

    const res = await deleteUser(id, getAuth());
    if(!res.success) {
      submitBtn.text("delete");
      popup.find("#delete-user-popup-msg").text(`Error: ${res.message}`);
      return;
    }

    crudUserMsg.text(`* user id ${id} number ${number} was deleted`);
    setTimeout(() => {
      crudUserMsg.text("");
    }, 2000);
    renderUsersData(); //re-render
    closePopup(backdrop);
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
        const isChecked = user.roles.some(userRole => userRole.id === role.id);
        return `
          <li>
            <input
              type="checkbox"
              id="${role.id}"
              ${isChecked || "checked"}
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
            <button id="update-user-form-submit-btn">update</button>
            <button type="button" class="js-update-user-form-close-btn">cancel</button>
          </div>

          <span id="submit-msg"></span>
        </form>
      `
    });

    const form = $("#update-user-form");

    form.find(".js-update-user-form-close-btn").click(() => closeForm(backdrop));

    const submitBtn = form.find("#update-user-form-submit-btn");
    submitBtn.click(async e => {
      e.preventDefault();
      const fullnameMsg = form.find("#fullname-msg");
      const emailMsg = form.find("#email-msg");
      const phoneNumberMsg = form.find("#phone-msg");
      const passwordMsg = form.find("#password-msg");

      const fullname = removeOddSpace(form.find("#fullname").val());
      const email = removeOddSpace(form.find("#email").val());
      const phoneNumber = removeOddSpace(form.find("#phone").val());
      const password = removeOddSpace(form.find("#password").val());

      const validateForm = () => {
        let allValid = true;

        if(!fullname) {
          fullnameMsg.text("* required");
          allValid = false;
        } else fullnameMsg.text("");

        if(!email) {
          emailMsg.text("* required");
          allValid = false;
        } else if(!isValidEmail(email)) {
          emailMsg.text("invalid email");
          allValid = false;
        } else emailMsg.text("");

        if(!phoneNumber) {
          phoneNumberMsg.text("* required");
          allValid = false;
        } else if(!isValidVNPhoneNumber(phoneNumber)) {
          phoneNumberMsg.text("invalid phone number");
          allValid = false;
        } else phoneNumberMsg.text("");

        if(password && !isValidPassword(password)) {
          passwordMsg.text("invalid password");
          allValid = false;
        } else passwordMsg.text("");

        return allValid;
      }

      if(validateForm()) {
        submitBtn.prop("disabled", true);
        submitBtn.text("updating user...");

        const rolesId= [];
        form.find("#update-user-form-roles input[type='checkbox']:checked").each((idx, e) => {
          rolesId.push($(e).attr("id"));
        });

        const user = {
          full_name: fullname,
          email: email,
          phone_number: phoneNumber,
          ...(password && {password: password}), //provide if has password
          roles_id: rolesId,
        }
        const res = await updateUser(id, user, getAuth());

        if(!res.success) {
          submitBtn.text("update");
          form.find("#submit-msg").text(`Error: ${res.message}`);
          return;
        }

        crudUserMsg.text(`* user id ${id} - number ${number} was updated`);
        setTimeout(() => {
          crudUserMsg.text("");
        }, 2000);
        renderUsersData(); //re-render
        closeForm(backdrop);
      }
    });

  } catch(error) {
    console.error(`Error: ${error.message}`);
    backdrop.html(`<p>Error loading update user form: ${error.message}</p>`);
  }
}
