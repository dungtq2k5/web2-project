<?php
  include_once "./components/header.php";
  include_once "./components/navbar.php";
?>

<main>
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h2>Users Management</h2>
    <div>
      <button id="create-user-btn" class="btn btn-dark btn-sm"><i class="uil uil-plus me-1"></i>Create User</button>
      <span id="crud-user-msg" class="ms-2 text-success"></span>
    </div>
  </div>

  <div class="card mb-3">
    <div class="card-body">
      <form id="search-user-form" class="row g-3 align-items-center">
        <div class="col-auto">
          <label for="search-user-form-input" class="col-form-label">Search User:</label>
        </div>
        <div class="col">
          <input type="text" id="search-user-form-input" class="form-control">
        </div>
        <div class="col-auto">
          <button id="search-user-form-search-btn" type="submit" class="btn btn-dark btn-sm">Search</button>
        </div>
        <div class="col-auto">
          <button id="search-user-form-clear-btn" type="reset" class="btn btn-outline-dark btn-sm">Clear Search</button>
        </div>
      </form>
      <p class="mt-2 mb-0">Result: <span id="result-count">0</span></p>
    </div>
  </div>

  <div class="table-responsive">
    <table class="table table-striped table-hover table-bordered">
      <thead class="table-dark">
        <tr>
          <th>#</th>
          <th>ID</th>
          <th>Full Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Addresses</th>
          <th>Roles</th>
          <th>Created At</th>
          <th>Updated At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="tbody">
        <!-- User data will be loaded here by JS -->
        <tr><td colspan="10" class="text-center">Loading...</td></tr>
      </tbody>
    </table>
  </div>
</main>

<div class="backdrop--g" id="backdrop" style="display: none;"></div>

<!-- Make sure the path to main.js is correct relative to this file -->
<script type="module" src="./controllers/users-management.js"></script>

<?php include_once "./components/footer.php"; ?>
