<header>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Admin Panel</a>
      <button class="navbar-toggler p-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon" style="width: 1rem; height: 1rem;"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item"><a class="nav-link" href="./pages/users-management.php">Users</a></li>
          <li class="nav-item"><a class="nav-link" href="./pages/carts-management.php">Carts</a></li>
          <li class="nav-item"><a class="nav-link" href="./pages/orders-management.php">Orders</a></li>
          <li class="nav-item"><a class="nav-link" href="./pages/products-management.php">Products</a></li>
          <li class="nav-item"><a class="nav-link" href="./pages/variations-management.php">Variations</a></li>
          <li class="nav-item"><a class="nav-link" href="./pages/instances-management.php">Instances</a></li>
          <li class="nav-item"><a class="nav-link" href="./pages/roles-management.php">Roles</a></li>
          <li class="nav-item"><a class="nav-link" href="./pages/analysis.php">Analysis</a></li>
        </ul>
        <div class="d-flex align-items-center gap-4">
          <p class="navbar-text mb-0">
            Currently signin as <span id="signin-as">N/A</span>.
          </p>
          <button class="btn btn-danger btn-sm" id="signout-btn">
            <i class="uil uil-signout"></i> Signout
          </button>
        </div>
      </div>
    </div>
  </nav>
</header>

<script type="module" src="./controllers/header.js"></script>