<?php

declare(strict_types=1);

require_once "./config/settings.php";

$classMap = require_once "./classmap.php";
spl_autoload_register(function ($class) use ($classMap): void {
    if (isset($classMap[$class])) {
        require_once $classMap[$class];
    }
});

set_exception_handler("ErrorHandler::handleException");

header("Content-Type: application/json; charset=UTF-8");

// Lấy thông tin từ request
$method = $_SERVER["REQUEST_METHOD"];
$uri = parse_url($_SERVER["REQUEST_URI"])["path"];
$usr_email = $_SERVER["PHP_AUTH_USER"] ?? null;
$usr_pwd = $_SERVER["PHP_AUTH_PW"] ?? null;
$limit = isset($_GET["limit"]) ? abs((int) $_GET["limit"]) : null;
$offset = isset($_GET["offset"]) ? abs((int) $_GET["offset"]) : null;
$segments = explode("/", trim($uri, "/"));
$id = is_numeric(end($segments)) ? end($segments) : null;


// Khởi tạo database và auth
$db = new Database("localhost", "smartwatch_db", "root", "");
$auths = new Auths($db, $usr_email, $usr_pwd);

// Xác định endpoint và gọi controller tương ứng
try {
    switch (true) {
        case str_contains($uri, SOURCE_URI . "/products"):
            $controller = new ProductController(new ProductGateway($db), $auths);
            break;

        case str_contains($uri, SOURCE_URI . "/product_os"):
            $controller = new ProductOSController(new ProductOSGateway($db), $auths);
            break;

        case str_contains($uri, SOURCE_URI . "/product_brands"):
            $controller = new ProductBrandController(new ProductBrandGateway($db), $auths);
            break;

        case str_contains($uri, SOURCE_URI . "/product_categories"):
            $controller = new ProductCategoryController(new ProductCategoryGateway($db), $auths);
            break;

        case str_contains($uri, SOURCE_URI . "/product_instances"):
            $controller = new ProductInstanceController(new ProductInstanceGateway($db), $auths);
            $id = $_GET["sku"] ?? null; // Đổi ID thành SKU nếu là product_instances
            break;

        case str_contains($uri, SOURCE_URI . "/product_variations"):
            $controller = new ProductVariationController(new ProductVariationGateway($db), $auths, new Utils());
            break;

        case str_contains($uri, SOURCE_URI . "/orders"):
            $controller = new OrdersController(new OrdersGateway($db), $auths);
            break;

        case str_contains($uri, SOURCE_URI . "/order_delivery_states"):
            $controller = new OrderDeliveryStateController(new OrderDeliveryStateGateway($db), $auths);
            break;

        case str_contains($uri, SOURCE_URI . "/order_items"):
          $controller = new OrderItemsController(new OrderItemsGateway($db), $auths);
          break;
          
        default:
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "Request not found!"]);
            exit;
    }

    // Gọi hàm xử lý request
    $controller->processRequest($method, $id, $limit, $offset);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Internal Server Error", "error" => $e->getMessage()]);
}
