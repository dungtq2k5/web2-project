<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
        crossorigin="anonymous"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="scripts/main.js"></script>
</head>

<body>
    <nav class="navbar navbar-expand-lg shadow-sm">
        <div class="container-fluid">
            <!-- BRAND LOGO -->
            <a class="navbar-brand" href="#">
                <h2 class="mb-0">GARMIN</h2>
            </a>

            <!-- TOGGLER BUTTON -->
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01"
                aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <!-- MENU -->
            <div class="collapse navbar-collapse" id="navbarColor01">
                <!-- ICONS (Mobile) -->
                <div class="d-lg-none mb-3 d-flex justify-content-start mt-3">
                    <div class="dropdown">
                        <i class="bi bi-person fs-3 me-3 cursor-pointer" id="userDropdown" data-bs-toggle="dropdown"
                            data-bs-display="static" aria-expanded="false"></i>
                        <ul class="dropdown-menu p-3" aria-labelledby="userDropdown">
                            <li><a class="dropdown-item nav-link" href="account">Account</a></li>
                            <li><a class="dropdown-item nav-link" href="account">Orders</a></li>
                            <li><a class="dropdown-item nav-link" href="#">Sign Out</a></li>
                        </ul>
                    </div>
                    <div class="position-relative">
                        <i class="bi bi-cart fs-3 cursor-pointer"></i>
                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark">
                            0 <!-- Số giỏ hàng -->
                        </span>
                    </div>
                </div>

                <!-- NAV LINKS -->
                <ul class="navbar-nav mx-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="home">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/products">Smartwatches</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="contact">Contact</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="about">About</a>
                    </li>
                </ul>

                <!-- SEARCH + ICONS (Desktop) -->
                <div class="d-flex align-items-center">
                    <form class="d-flex me-3 w-100" role="search">
                        <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search"
                            style="min-width: 200px">
                        <button class="btn btn-outline-dark" type="submit">Search</button>
                    </form>

                    <div class="header-icons d-flex d-none d-lg-flex">
                        <div class="dropdown">
                            <i class="bi bi-person fs-3 me-3 cursor-pointer" id="userDropdown" data-bs-toggle="dropdown"
                                data-bs-display="static" aria-expanded="false"></i>
                            <ul class="dropdown-menu dropdown-menu-end p-3" aria-labelledby="userDropdown">
                                <li><a class="dropdown-item nav-link" href="account">Account</a></li>
                                <li><a class="dropdown-item nav-link" href="account">Orders</a></li>
                                <li><a class="dropdown-item nav-link" href="#">Sign Out</a></li>
                            </ul>
                        </div>

                        <div class="position-relative">
                            <i class="bi bi-cart fs-3 cursor-pointer"></i>
                            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark">
                                0
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</body>

</html>