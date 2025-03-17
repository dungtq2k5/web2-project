<?php
require_once 'libs/php-jwt-main/src/JWT.php';
require_once 'libs/php-jwt-main/src/Key.php';
require_once 'libs/php-jwt-main/src/SignatureInvalidException.php';
require_once 'libs/php-jwt-main/src/JWTExceptionWithPayloadInterface.php';
require_once 'libs/php-jwt-main/src/ExpiredException.php';
require_once 'libs/php-jwt-main/src/BeforeValidException.php';
require_once 'config/settings.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JWTHandler
{

    public function generateJWT(int $user_id)
    {
        date_default_timezone_set('Asia/Ho_Chi_Minh');
        $issuedAt = time();
        $payload = [
            "user_id" => $user_id,
            "iat" => $issuedAt,
            "exp" => $issuedAt + JWT_EXP
        ];
        return JWT::encode($payload, JWT_SECRET, JWT_ALG);
    }

    public function verifyJWT(string $jwt)
    {
        try {
            return JWT::decode($jwt, new Key(JWT_SECRET, JWT_ALG));
        } catch (Exception $e) {
            return null;
        }
    }
}
?>