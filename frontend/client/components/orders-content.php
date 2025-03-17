<div class="p-3">
    <h1>Orders</h1>
    <!-- <div class="dont-have-orders">
        <h2>We did not find any orders for your account.</h2>
        <div class="banner py-4 px-3 d-flex gap-5 justify-content-between" style="background-color:#7ed0fb">
            <div class="left-content d-flex flex-column justify-content-center">
                <h2 class="text-wrap">FIND THE PERFECT <br>SMARTWATCH</h2>
                <a href="products" class="btn btn-outline-dark mt-3 w-50">SHOP</a>
            </div>
            <div class="right-content d-flex flex-column justify-content-center">
                <img src="https://www.pngmart.com/files/13/Smartwatch-PNG-Pic.png" alt="Smartwatches" class="img-fluid"
                    style="max-height:220px">
            </div>
        </div>
    </div> -->
    <div class="have-orders">
        <div class="search-orders-bar d-flex justify-content-between">
            <div class="d-flex me-3 w-100 search-bar" role="search" style="max-width:400px">
                <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search"
                    style="min-width: 200px">
                <button class="btn btn-outline-dark" type="submit">Search</button>
            </div>

            <div class="icons d-flex justify-content-center">
                <button class="btn"><i class="bi bi-filter-circle fs-4"></i></button>
                <button class="btn"><i class="bi bi-sort-down fs-4"></i></button>
            </div>
        </div>

        <div class="table-responsive mt-4 w-100">
            <table class="table table-hover table-bordered ">
                <thead class="table-dark">
                    <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Address</th>
                        <th>Delivered At</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="orders-table-body">
                </tbody>
            </table>
        </div>
    </div>

    <!-- Order Detail Modal -->
    <div class="modal fade" id="order-modal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="orderModalLabel">Order Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="modal-content">
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    const orders = [
        { id: "#1001", date: "2025-03-10", items: "1", total: "$1200", address: "123 Street, City", deliveredAt: "2025-03-12", status: "Delivered" },
        { id: "#1002", date: "2025-03-09", items: "2", total: "$800", address: "456 Avenue, Town", deliveredAt: "2025-03-11", status: "Shipped" },
        { id: "#1003", date: "2025-03-08", items: "3", total: "$400", address: "789 Boulevard, Village", deliveredAt: "2025-03-10", status: "Pending" }
    ];

    const tableBody = document.getElementById("orders-table-body");
    orders.forEach((order, index) => {
        const row = `<tr>
                <td>${order.id}</td>
                <td>${order.date}</td>
                <td>${order.items}</td>
                <td>${order.total}</td>
                <td>${order.address}</td>
                <td>${order.deliveredAt}</td>
                <td>${order.status}</td>
                <td>
                    <button class="btn btn-sm me-1 order-detail-icon" onclick="openOrderModal(${index})"><i class="bi bi-info-circle fw-bold"></i></button>
                    <button class="btn btn-sm"><i class="bi bi-download"></i></button>
                </td>
            </tr>`;
        tableBody.innerHTML += row;
    });

    function openOrderModal(index) {
        const order = orders[index];
        document.getElementById('modal-content').innerHTML = `
                <p><strong>Order ID:</strong> ${order.id}</p>
                <p><strong>Date:</strong> ${order.date}</p>
                <p><strong>Items:</strong> ${order.items}</p>
                <p><strong>Total:</strong> ${order.total}</p>
                <p><strong>Address:</strong> ${order.address}</p>
                <p><strong>Delivered At:</strong> ${order.deliveredAt}</p>
                <p><strong>Status:</strong> ${order.status}</p>
            `;
        const orderModal = new bootstrap.Modal(document.getElementById('order-modal'));
        orderModal.show();
    }
</script>