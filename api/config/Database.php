<?php

class Database
{

  public function __construct(
    private string $host,
    private string $name,
    private string $user,
    private string $password
  ) {}

  public function getConnection(): PDO
  {
    $dsn = "mysql:host={$this->host};dbname={$this->name};charset=utf8";

    return new PDO($dsn, $this->user, $this->password, [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
      PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci, @@session.time_zone = "+00:00"' // By setting @@session.time_zone = "+00:00", any use of CURRENT_TIMESTAMP within that connection will be treated as UTC
    ]);
  }
}
