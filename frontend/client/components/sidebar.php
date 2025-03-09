<!-- 🏗️ Nút Toggle -->
<button class="btn btn-dark m-3 d-md-none" id="toggleSidebar">
    <i class="bi bi-list"></i> Account
</button>

<!-- 🏗️ Sidebar -->
<div class="d-flex flex-column collapse justify-content-start" id="sidebar">
    <ul class="nav nav-pills flex-column mb-auto">
        <li class="border p-2">
            <a href="#" class="nav-link link-dark underline-hover">Profile</a>
        </li>
        <li class="border p-2">
            <a href="#" class="nav-link link-dark underline-hover">Orders</a>
        </li>
        <li class="border p-2">
            <a href="#" class="nav-link link-dark underline-hover">Cart</a>
        </li>
    </ul>
</div>

<!-- 🏗️ Overlay (Dùng để đóng sidebar trên mobile) -->
<div class="overlay" id="overlay"></div>

<style>
    /* Hiệu ứng gạch chân khi hover */
    .underline-hover:hover {
        text-decoration: underline;
    }

    /* Sidebar thiết lập mặc định */
    #sidebar {
        width: 400px;
    }

    /* Mobile Sidebar - Ẩn mặc định */
    @media (max-width: 768px) {

        #toggleSidebar {
            display: block;
        }

        #sidebar {
            position: fixed;
            top: 0;
            left: 0;
            width: 250px;
            height: 100vh;
            background-color: white;
            transform: translateX(-100%);
            transition: transform 0.3s ease-in-out;
            z-index: 1050;
        }
        #sidebar.show {
            transform: translateX(0);
        }
        .overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1049;
        }
        .overlay.show {
            display: block;
        }
    }
</style>

<script>
    document.getElementById("toggleSidebar").addEventListener("click", function(){
        document.getElementById("sidebar").classList.toggle("show");
        document.getElementById("overlay").classList.toggle("show");
    });

    // Đóng sidebar khi nhấn vào overlay
    document.getElementById("overlay").addEventListener("click", function(){
        document.getElementById("sidebar").classList.remove("show");
        document.getElementById("overlay").classList.remove("show");
    });
</script>
