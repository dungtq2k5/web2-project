<?php
  include_once "./components/header.php";
  include_once "./components/navbar.php";
?>

<main>
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h2>Products Instances Management</h2>
    <span id="crud-instance-msg" class="text-success"></span>
  </div>

  <div class="card mb-4">
    <div class="card-header">
      Search Instances
    </div>
    <div class="card-body">
      <form id="search-instances-form">
        <div class="row g-3 mb-3">
          <div class="col-md-4">
            <label for="search-receipt-id" class="form-label" title="Leave blank for no filter">Receipt ID:</label>
            <input
              type="text"
              id="search-receipt-id"
              name="receipt_id"
              placeholder="Not filtered"
              class="form-control"
            >
          </div>
          <div class="col-md-4">
            <label for="search-variation-id" class="form-label" title="Leave blank for no filter">Variation ID:</label>
            <input
              type="number"
              id="search-variation-id"
              name="variation_id"
              min="1"
              placeholder="Not filtered"
              class="form-control"
            >
          </div>
          <div class="col-md-4">
            <label for="search-is-sold" class="form-label">Is Sold:</label>
            <select name="is_sold" id="search-is-sold" class="form-select">
              <option value="">Not filtered</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>
        </div>

        <div class="d-flex justify-content-end btn-group-sm gap-2">
          <button id="search-instances-form-search-btn" type="submit" class="btn btn-dark">Search</button>
          <button id="search-instances-form-clear-btn" type="reset" class="btn btn-outline-dark">Clear search</button>
        </div>
      </form>
      <p class="mt-2 mb-0">Result: <span id="result-count">0</span></p>
    </div>
  </div>

  <div class="table-responsive">
    <table class="table table-striped table-hover table-bordered">
      <thead class="table-dark">
        <tr>
          <th title="Number">#</th>
          <th>SKU</th>
          <th>Variation Image</th>
          <th>Variation ID</th>
          <th>Serial Number</th>
          <th>IMEI Number</th>
          <th>Receipt Note ID</th>
          <th>Is Sold</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="tbody">
        <tr><td colspan="9" class="text-center">Loading...</td></tr>
      </tbody>
    </table>
  </div>
</main>

<div class="backdrop--g" id="backdrop" style="display: none;"></div>

<script type="module" src="./controllers/instances-management.js"></script>

<?php include_once "./components/footer.php"; ?>