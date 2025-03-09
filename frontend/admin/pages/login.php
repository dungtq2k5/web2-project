<?php
session_start();
if (isset($_SESSION["admin"])) {
    header("Location: dashboard.php");
    exit;
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = $_POST["email"];
    $password = $_POST["password"];

    if ($email == "admin@gmail.com" && $password == "admin123") {
        $_SESSION["admin"] = $email;
        header("Location: dashboard.php");
        exit;
    } else {
        $error = "Invalid Email or Password";
    }
}
?>

<form method="POST">
    <h2>Admin Login</h2>
    <input type="email" name="email" placeholder="Email" required>
    <input type="password" name="password" placeholder="Password" required>
    <button type="submit">Login</button>
    <?php if (isset($error)) echo "<p>$error</p>"; ?>
</form>
