<?php
  include_once "./components/header.php";
  include_once "./components/navbar.php";
?>

<main>
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h2>Products Variations Management</h2>
    <span id="crud-variation-msg" class="text-success"></span>
  </div>

  <div class="card mb-4">
    <div class="card-header">
      Search Variations
    </div>
    <div class="card-body">
      <form id="search-variation-form">
        <div class="row g-3 mb-3">
          <div class="col-md-4">
            <label for="search-product-id" class="form-label">Product ID:</label>
            <input
              type="number"
              id="search-product-id"
              name="product_id"
              min="1"
              placeholder="No filter"
              class="form-control"
            >
          </div>
          <div class="col-md-4">
            <label class="form-label">Price Range (¢):</label>
            <div class="input-group">
              <input type="number" name="price_from" id="search-price-from" min="1" placeholder="From" class="form-control">
              <span class="input-group-text">-</span>
              <input type="number" name="price_to" id="search-price-to" placeholder="To" class="form-control">
            </div>
          </div>
           <div class="col-md-4">
            <label for="search-stop-selling" class="form-label">Stop Selling:</label>
            <select name="stop_selling" id="search-stop-selling" class="form-select">
              <option value="">No filter</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>
        </div>

        <div class="row g-3 mb-3 align-items-end">
          <div class="col-md-6">
            <label class="form-label">Release Date Range:</label>
            <div class="input-group">
              <input type="datetime-local" name="release_from" id="search-release-from" class="form-control">
               <span class="input-group-text">to</span>
              <input type="datetime-local" name="release_to" id="search-release-to" class="form-control">
            </div>
          </div>
          <div class="col-md-6 d-flex justify-content-end gap-2 btn-group-sm">
            <button id="search-variation-form-search-btn" type="submit" class="btn btn-dark">
              Search
            </button>
            <button id="search-variation-form-clear-btn" type="reset" class="btn btn-outline-dark">
              Clear search
            </button>
          </div>
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
          <th>Product ID</th>
          <th title="Watch Specification">Watch Specs</th>
          <th title="Band Specification">Band Specs</th>
          <th title="Release At">Release At</th>
          <th>Base Price (¢)</th>
          <th>Sell Price (¢)</th>
          <th>Stock</th>
          <th>Stop Selling</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="tbody">
        <tr><td colspan="12" class="text-center">Loading...</td></tr>
      </tbody>
    </table>
  </div>
</main>

<div class="backdrop--g" id="backdrop" style="display: none;"></div>

<script type="module" src="./controllers/variations-management.js"></script>

<?php include_once "./components/footer.php"; ?>