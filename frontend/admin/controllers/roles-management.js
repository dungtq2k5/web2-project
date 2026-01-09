import {
  getRolesList,
  createRole,
  deleteRole,
  getRole,
  updateRole,
} from "../../models/roles.js";
import { disableBgScroll, filterTextInputsInFormData } from "../../utils.js";
import { getPermissionsList } from "../../models/permissions.js";
import { closeForm, closePopup } from "./components.js";
import { DISPLAY_MSG_TIMEOUT } from "../../settings.js";
import { hasPermission } from "../../models/auth.js";

const crudRoleMsg = $("#crud-role-msg");
const backdrop = $("#backdrop");
const resultCount = $("#result-count");
const tbody = $("#tbody");

const canUpdate = hasPermission("UPDATE_ROLE");
const canDelete = hasPermission("DELETE_ROLE");

if (hasPermission("CREATE_ROLE")) {
  $("#create-role-btn").click(() => {
    renderCreateRoleForm();
  });
} else {
  $("#create-role-btn").remove();
}

async function renderRolesData(rolesList = null) {
  tbody.html(
    "<tr><td colspan='5' class='p-3 text-center'>Loading data...</td></tr>"
  );

  try {
    const roles = rolesList || (await getRolesList());

    const dataHTML = roles
      .map(
        (role, idx) =>
          `<tr
        class="align-middle"
        data-number="${idx + 1}"
        data-role-id="${role.id}"
      >
        <td data-cell="n.o" class="text-center p-2">${idx + 1}</td>
        <td data-cell="id" class="text-center p-2">${role.id}</td>
        <td data-cell="name" class="p-2">${role.name}</td>
        <td data-cell="user assigned" class="text-center p-2">${
          role.user_assigned
        }</td>
        <td data-cell="actions" class="text-center p-2" style="min-width: 150px;">
          <div class="d-flex justify-content-center btn-group-sm gap-2">
            ${
              canUpdate
                ? `<button
                    class='js-update-role-btn btn btn-info'
                  >
                    <i class='uil uil-pen'></i>
                  </button>`
                : ""
            }
            ${
              canDelete
                ? `<button
                    class='js-delete-role-btn btn btn-danger'
                  >
                    <i class='uil uil-trash'></i>
                  </button>`
                : ""
            }
            ${
              !canUpdate && !canDelete
                ? `<span class="text-muted">No actions</span>`
                : ""
            }
          </div>
        </td>
      </tr>`
      )
      .join("");

    tbody.html(
      dataHTML ||
        "<tr><td colspan='5' class='p-3 text-center'>No data found!</td></tr>"
    );

    if (canUpdate) {
      tbody.find(".js-update-role-btn").click((e) => {
        const row = $(e.currentTarget).closest("tr");
        const roleId = row.data("role-id");
        const roleNum = row.data("number");

        renderUpdateRoleForm(roleNum, roleId);
        console.log(`Update role id ${roleId}`);
      });
    }

    if (canDelete) {
      tbody.find(".js-delete-role-btn").click((e) => {
        const tr = $(e.currentTarget).closest("tr");
        const roleId = tr.data("role-id");
        const roleNum = tr.data("number");

        renderDeleteRolePopup(roleNum, roleId);
        console.log(`Delete role id ${roleId}`);
      });
    }

    resultCount.text(roles.length);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    tbody.html(
      `<tr><td colspan='5' class="p-3 text-center table-danger">Error loading data: ${error.message}</td></tr>`
    );
  }
}

async function renderUpdateRoleForm(number, id) {
  disableBgScroll();
  backdrop.html(
    "<div class='d-flex justify-content-center align-items-center' style='height: 100vh;'><div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading update role form...</span></div></div>"
  );
  backdrop.show();

  try {
    const role = await getRole(id);
    const permissions = await getPermissionsList();

    const permissionsHTML = permissions
      .map((permission) => {
        const isChecked = role.permissions.some(
          (rp) => rp.id === permission.id
        );
        return `
        <div class="form-check col-md-6 col-lg-4 mb-2">
          <input
            class="form-check-input"
            type="checkbox"
            value="${permission.id}"
            id="permission-${permission.id}"
            name="permission_ids[]"
            ${isChecked ? "checked" : ""}
          >
          <label class="form-check-label small" for="permission-${
            permission.id
          }">
            ${permission.action_name}
          </label>
        </div>
      `;
      })
      .join("");

    backdrop.html(`
      <div class="card shadow-lg m-3 m-md-5 mx-auto" style="max-width: 800px;">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h2 class="h5 mb-0">Update Role #${number} (ID: ${id})</h2>
          <button type="button" class="btn-close js-update-role-form-close-btn" aria-label="Close"></button>
        </div>
        <form id="update-role-form">
          <div class="card-body" style="max-height: 75vh; overflow-y: auto;">
            <div class="mb-3">
              <label for="name" class="form-label">Role Name <span class="text-danger">*</span></label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter role name"
                value="${role.name}"
                class="form-control"
                required
              >
              <small id="name-msg" class="text-danger"></small>
            </div>

            <fieldset class="mb-3">
              <legend class="h6">Assign Permissions</legend>
              <div class="row p-2 border rounded">
                ${
                  permissionsHTML ||
                  '<p class="text-muted text-center">No permissions available.</p>'
                }
              </div>
            </fieldset>

            <div id="submit-msg" class="text-danger"></div>
          </div>
          <div class="card-footer d-flex justify-content-end btn-group-sm gap-2">
            <button type="submit" id="update-role-form-submit-btn" class="btn btn-dark">
              Update
            </button>
            <button type="button" class="btn btn-outline-dark js-update-role-form-close-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    `);

    const form = backdrop.find("#update-role-form");

    backdrop
      .find(".js-update-role-form-close-btn")
      .click(() => closeForm(backdrop));

    form.submit(async (e) => {
      e.preventDefault();

      const submitBtn = form.find("#update-role-form-submit-btn");
      submitBtn.prop("disabled", true);
      submitBtn.text("Updating...");

      const formData = filterTextInputsInFormData(new FormData(form[0]));

      const nameMsg = form.find("#name-msg");

      const validateForm = () => {
        if (!formData.get("name")) {
          nameMsg.text("* required");
          return false;
        }

        nameMsg.text("");
        return true;
      };

      if (validateForm()) {
        const permissionsId = [];
        form.find("input[name='permission_ids[]']:checked").each((idx, e) => {
          permissionsId.push($(e).val());
        });

        const res = await updateRole(id, {
          ...Object.fromEntries(formData),
          permissions_id: permissionsId,
        });

        if (res.success) {
          crudRoleMsg.text(`* role id ${id} - number ${number} was updated`);
          setTimeout(() => {
            crudRoleMsg.text("");
          }, DISPLAY_MSG_TIMEOUT);
          renderRolesData(); // Re-render
          closeForm(backdrop);
          return;
        }

        form.find("#submit-msg").text(res.message);
      }

      submitBtn.text("Update");
      submitBtn.prop("disabled", false);
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    backdrop.html(
      `<div class="alert alert-danger m-3">Error loading role data: ${error.message}</div>`
    );
  }
}

function renderDeleteRolePopup(number, id) {
  disableBgScroll();

  backdrop.html(`
    <div class="card shadow-lg m-3 m-md-5 mx-auto" style="max-width: 500px;">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h2 class="h5 mb-0">Confirm Deletion</h2>
        <button type="button" class="btn-close js-delete-role-popup-close-btn" aria-label="Close"></button>
      </div>
      <div class="card-body">
        <p>Are you sure you want to delete role #${number} (ID: <strong>${id}</strong>)?</p>
        <div id="delete-role-popup-msg" class="text-danger mt-2"></div>
      </div>
      <div class="card-footer d-flex justify-content-end btn-group-sm gap-2">
        <button id="delete-role-popup-submit-btn" class="btn btn-danger">
          Delete
        </button>
        <button type="button" class="btn btn-outline-dark js-delete-role-popup-close-btn">
          Cancel
        </button>
      </div>
    </div>
  `);

  backdrop.show();

  backdrop
    .find(".js-delete-role-popup-close-btn")
    .click(() => closePopup(backdrop));

  const submitBtn = backdrop.find("#delete-role-popup-submit-btn");
  submitBtn.click(async () => {
    submitBtn.prop("disabled", true);
    submitBtn.text("Deleting...");

    const res = await deleteRole(id);

    if (res.success) {
      crudRoleMsg.text(`* role id ${id} - number ${number} was deleted`);
      setTimeout(() => {
        crudRoleMsg.text("");
      }, DISPLAY_MSG_TIMEOUT);
      renderRolesData(); // Re-render
      closePopup(backdrop);
      return;
    }

    submitBtn.text("Delete");
    submitBtn.prop("disabled", false);
    backdrop.find("#delete-role-popup-msg").text(`Error: ${res.message}`);
  });
}

async function renderCreateRoleForm() {
  disableBgScroll();
  backdrop.html(
    "<div class='d-flex justify-content-center align-items-center' style='height: 100vh;'><div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Loading create role form...</span></div></div>"
  );
  backdrop.show();

  try {
    const permissions = await getPermissionsList();

    const permissionsHTML = permissions
      .map(
        (permission) =>
          `
        <div class="form-check col-md-6 col-lg-4 mb-2">
          <input
            class="form-check-input"
            type="checkbox"
            value="${permission.id}"
            id="permission-${permission.id}"
            name="permission_ids[]"
          >
          <label class="form-check-label small" for="permission-${permission.id}">
            ${permission.action_name}
          </label>
        </div>
      `
      )
      .join("");

    backdrop.html(`
      <div class="card shadow-lg m-3 m-md-5 mx-auto" style="max-width: 800px;">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h2 class="h5 mb-0">Create New Role</h2>
          <button type="button" class="btn-close js-create-role-form-close-btn" aria-label="Close"></button>
        </div>
        <form id="create-role-form">
          <div class="card-body" style="max-height: 75vh; overflow-y: auto;">
            <div class="mb-3">
              <label for="name" class="form-label">Role Name <span class="text-danger">*</span></label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter role name"
                class="form-control"
                required
              >
              <small id="name-msg" class="text-danger"></small>
            </div>

            <fieldset class="mb-3">
              <legend class="h6">Assign Permissions</legend>
              <div class="row p-2 border rounded">
                ${
                  permissionsHTML ||
                  '<p class="text-muted text-center">No permissions available.</p>'
                }
              </div>
            </fieldset>

            <div id="submit-msg" class="text-danger"></div>
          </div>
          <div class="card-footer d-flex justify-content-end btn-group-sm gap-2">
            <button type="submit" id="create-role-form-submit-btn" class="btn btn-dark">
              Create
            </button>
            <button type="button" class="btn btn-outline-dark js-create-role-form-close-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    `);

    const form = backdrop.find("#create-role-form");

    backdrop
      .find(".js-create-role-form-close-btn")
      .click(() => closeForm(backdrop));

    form.submit(async (e) => {
      e.preventDefault();

      const submitBtn = form.find("#create-role-form-submit-btn");
      submitBtn.prop("disabled", true);
      submitBtn.text("Creating...");

      const formData = filterTextInputsInFormData(new FormData(form[0]));

      const nameMsg = form.find("#name-msg");

      const validateForm = () => {
        if (!formData.get("name")) {
          nameMsg.text("* required");
          return false;
        }

        nameMsg.text("");
        return true;
      };

      if (validateForm()) {
        const permissionsId = [];
        form.find("input[name='permission_ids[]']:checked").each((idx, e) => {
          permissionsId.push($(e).val());
        });

        const res = await createRole({
          ...Object.fromEntries(formData),
          permissions_id: permissionsId,
        });

        if (res.success) {
          crudRoleMsg.text("* new role was created");
          setTimeout(() => {
            crudRoleMsg.text("");
          }, DISPLAY_MSG_TIMEOUT);
          renderRolesData(); // Re-render
          closeForm(backdrop);
          return;
        }

        form.find("#submit-msg").text(res.message);
      }

      submitBtn.text("Create");
      submitBtn.prop("disabled", false);
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    backdrop.html(
      `<div class="alert alert-danger m-3">Error loading create role form: ${error.message}</div>`
    );
  }
}

renderRolesData();
