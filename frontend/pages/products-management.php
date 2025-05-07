<?php
  include_once "./components/header.php";
  include_once "./components/navbar.php";
?>

<main>
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h2>Products Management</h2>
    <div>
      <button id="create-product-btn" class="btn btn-dark btn-sm"><i class="uil uil-plus me-1"></i>Create Product</button>
      <span id="crud-product-msg" class="ms-2 text-success"></span>
    </div>
  </div>

  <div class="card mb-3">
    <div class="card-body">
      <form id="search-product-form" class="row g-3 align-items-center">
        <div class="col-auto">
          <label for="search-product-form-input" class="col-form-label">Search Product:</label>
        </div>
        <div class="col">
          <input type="text" id="search-product-form-input" class="form-control">
        </div>
        <div class="col-auto">
          <button id="search-product-form-search-btn" type="submit" class="btn btn-dark btn-sm">Search</button>
        </div>
        <div class="col-auto">
          <button id="search-product-form-clear-btn" type="reset" class="btn btn-outline-dark btn-sm">Clear search</button>
        </div>
      </form>
      <p class="mt-2 mb-0">Result: <span id="result-count">0</span></p>
    </div>
  </div>

  <div class="table-responsive">
    <table class="table table-striped table-hover table-bordered align-middle">
      <thead class="table-dark">
        <tr>
          <th title="Number">#</th>
          <th>ID</th>
          <th>Image</th>
          <th>Name</th>
          <th>Model</th>
          <th>Brand</th>
          <th>Category</th>
          <th>Description</th>
          <th>Stop Selling</th>
          <th>Total Variations</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="tbody">
        <tr><td colspan="11" class="text-center">Loading...</td></tr>
      </tbody>
    </table>
  </div>
</main>

<div class="backdrop--g" id="backdrop" style="display: none;"></div>

<script type="module" src="./controllers/products-management.js"></script>

<?php include_once "./components/footer.php"; ?>