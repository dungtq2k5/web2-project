document.addEventListener("DOMContentLoaded", function () {
    function loadPage(route) {
        fetch(`index.php?route=${route}&ajax=true`)
            .then(response => response.text())
            .then(html => {
                document.getElementById("app").innerHTML = html;
                history.pushState({ route }, "", `/${route}`);
            })
            .catch(() => {
                document.getElementById("app").innerHTML = "<h2>404 - Page Not Found</h2>";
            });
    }

    // Gán sự kiện cho tất cả thẻ <a> có data-route
    document.body.addEventListener("click", function (event) {
        if (event.target.tagName === "A" && event.target.dataset.route) {
            event.preventDefault();
            loadPage(event.target.dataset.route);
        }
    });

    // Xử lý khi bấm nút Back/Forward của trình duyệt
    window.onpopstate = function (event) {
        if (event.state && event.state.route) {
            loadPage(event.state.route);
        }
    };
});

