<?php
  $default_page = "users-management";

  $page = isset($_GET["page"]) && !empty($_GET["page"])
    ? $_GET["page"]
    : $default_page;
?>

<script type="module">
  import { getSigninUser } from "../models/auth.js";

  const defaultPhpPage = "<?php echo $default_page; ?>";
  const currentPhpPage = "<?php echo $page ?>"; // Magic happen here...
  const signinPage = "signin";

  if(getSigninUser()) {
    if(currentPhpPage === signinPage) {
      window.location.href = `index.php?page=${defaultPhpPage}`;
    }
  } else {
    if(currentPhpPage !== signinPage) {
      window.location.href = `index.php?page=${signinPage}`;
    }
  }
</script>

<?php
  $page_path = "./pages/{$page}.html";

  include_once "./components/header.html";

  if($page !== "signin") include_once "./components/navbar.html";

  if(file_exists($page_path)) {
    include_once $page_path;

  } else { // 404 not found page
    echo "
      <main class='text-center'>
        <h1>Page Not Found</h1>
        <p>The page you requested (<code>" . htmlspecialchars($page) . "</code>) could not be found.</p>
        <a href='index.php?page=$default_page' class='btn btn-dark btn-sm'>Go to Homepage</a>
      </main>
    ";
  }

  include_once "./components/footer.html";
