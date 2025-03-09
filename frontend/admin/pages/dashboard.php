<?php
session_start();
if (!isset($_SESSION["admin"])) {
    header("Location: login.php");
    exit;
}
echo "Welcome Admin!";
?>
<a href="logout.php">Logout</a>
