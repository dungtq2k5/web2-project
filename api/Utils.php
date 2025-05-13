<?php

class Utils {

  public function genProductSKU(
    string $category,
    string $brand,
    string $model,
    string $watch_size_mm,
    string $watch_color,
    string $band_material
  ): string { // cate-brand-model-watch_size-watch_color-band_material-millisecs: sw-app-s8-45-000000-sil-1746033627

    $category = substr(trim($category), 0, 2);
    $brand = substr(trim($brand), 0, 3);
    $model = substr(trim($model), 0, 2);
    $watch_size = substr(trim($watch_size_mm), 0, 2);
    $watch_color = substr(trim($watch_color), 1); // Remove # sign of hex color
    $band_material = substr(trim($band_material), 0, 3);
    $milisecs = (string) $this->getCurrentTime(); // Make sure unique

    return strtolower(implode('-', [$category, $brand, $model, $watch_size, $watch_color, $band_material, $milisecs]));
  }

  public function isValidProductSKU(string $sku): bool { // AI gen
    // Regex to match the expected SKU format
    $skuRegex = '/^[a-z]{2}-[a-z]{3}-[a-z0-9]{2}-[0-9]{2}-[0-9a-f]{3,6}-[a-z]{3}-\d+$/';

    return (bool) preg_match($skuRegex, $sku);
  }

  private function getCurrentTime(): float { // return milisecs
    return round(microtime(true) * 1000);
  }

  public function isValidDateTimeFormat(string $dateTimeString): bool { // AI gen: check is valid MySQL datetime format
    $format = 'Y-m-d H:i:s'; // The format you want to check

    try {
      $dateTime = DateTime::createFromFormat($format, $dateTimeString);

      // Check if the DateTime object was created successfully AND if the formatted date matches the original string
      return $dateTime && $dateTime->format($format) === $dateTimeString;

    } catch (Exception $e) {
      return false; // Invalid date/time string or format mismatch
    }
  }

  public function getCurrentMySQLDateTime(): string {
    return (new DateTime('now', new DateTimeZone('UTC')))->format('Y-m-d H:i:s');
  }

  public function isValidEmail(string $email): bool {
    // Remove all illegal characters from email
    $email = filter_var($email, FILTER_SANITIZE_EMAIL);

    // Validate e-mail
    return filter_var($email, FILTER_VALIDATE_EMAIL) ? true : false;
  }
  public function isValidEmailRobust(string $email): bool { // AI gen: More robust, but potentially overkill (and slower):
    $email = filter_var($email, FILTER_SANITIZE_EMAIL);  // Sanitize first

    if(!filter_var($email, FILTER_VALIDATE_EMAIL)) return false;

    // Check for DNS records (MX or A) - more thorough but slower
    $domain = explode('@', $email)[1];
    return (checkdnsrr($domain, 'MX') || checkdnsrr($domain, 'A')) ? true : false;
  }

  public function isValidVNPhoneNumber(string $phoneNumber): bool { // AI gen
    // 1. Remove all non-numeric characters (except the leading '+')
    $phoneNumber = preg_replace('/[^0-9+]/', '', $phoneNumber);

    // 2. Check for the leading '+' (for international numbers)
    $isInternational = str_starts_with($phoneNumber, '+');

    $isInternational
      ? $pattern = '/^\+84[0-9]{9}$/' //International format (e.g., +84901234567), +84 followed by 9 digits
      : $pattern = '/^0[0-9]{9}$/'; //Domestic format (e.g., 0901234567 or 0321234567), 0 followed by 9 digits


    // 3. Perform the regex match
    return (bool) preg_match($pattern, $phoneNumber);
  }

  public function isValidPassword(string $password, int $minLength=15): bool { // AI gen
    // password contains at least a letter + a number + length >= minLength
    return (strlen($password) >= $minLength && preg_match('/[a-zA-Z]/', $password)) && preg_match('/\d/', $password) ? true : false;
  }

  public function isListOfNumber(array $list): bool {
    foreach($list as $ele) {
      if(!is_numeric($ele)) return false;
    }

    return true;
  }

  public function removeOddSpace(string $str): string { // AI help
    return trim(preg_replace('/\s+/', ' ', $str));
  }

  private function genFileName(string $original_name): string {
    $extension = pathinfo($original_name, PATHINFO_EXTENSION);
    return uniqid() . "." . $extension;
  }

  public function isValidImg(
    array $file,
    array $allowed_types = ["image/webp"],
    int $max_file_size = 5 * 1024 * 1024,
    int $max_width = 2400,
    int $max_height = 2400
  ): array {
    $errors = [];

    if(!in_array($file["type"], $allowed_types)) {
      $errors[] = "Invalid file type. Allowed types are: " . implode(", ", $allowed_types);
    }
    if($file["size"] > $max_file_size) {
      $errors[] = "File size exceeds the maximum of ".($max_file_size / (1024 * 1024))."MB";
    }
    //check image dimensions
    $image_info = getimagesize($file["tmp_name"]);
    if($image_info) {
      if($image_info[0] > $max_width || $image_info[1] > $max_height) {
        $errors[] = "Image dimensions exceed the maximum allowed size of {$max_width}x{$max_height}px";
      }
    } else {
      $errors[] = "Uploaded file is not a valid image";
    }

    return $errors;
  }

  public function saveFile(array $file, string $upload_dir="../uploads"): string { // upload_dir relative to index.php
    $new_filename = $this->genFileName($file["name"]);
    $destination = "$upload_dir/$new_filename";

    if(!file_exists($upload_dir) && !mkdir($upload_dir, 0777, true)) { // Create folder if not exist
      throw new Exception("Failed to create folder $upload_dir", 500);
      // $this->error_handler->sendErrorResponse(500, "Failed to create folder $upload_dir");
      // die;
    }

    if(!move_uploaded_file($file["tmp_name"], $destination)) {
      throw new Exception("Failed to uploaded file", 500);
      // $this->error_handler->sendErrorResponse(500, "Failed to uploaded file");
      // die;
    }

    return $new_filename;
  }

  public function removeFile(string $filename, string $upload_dir="../uploads"): bool {
    if(!unlink("$upload_dir/$filename")) {
      throw new Exception("Failed to remove file", 500);
      // $this->error_handler->sendErrorResponse(500, "Failed to remove file");
      // die;
    }

    return true;
  }

  public function isInterpretableBool($value): bool {
    if(is_bool($value)) return true;
    if(is_numeric($value)) {
      return $value == 1 || $value == 0;
    }
    if(is_string($value)) {
      $value = strtolower($value);
      return $value === "true" || $value === "false";
    }

    return false;
  }

  public function toBool($value): bool { // Convert from interpretable bool to bool, otherwise false if isn't interpretable
    if(is_bool($value)) return $value;

    if(is_numeric($value)) {
      if($value == 1) return true;
      if($value == 0) return false;
    }

    if(is_string($value)) {
      $value = strtolower($value);
      if($value === "true") return true;
      if($value === "false") return false;
    }

    return false;
  }

  public function isInterpretableNull($value): bool {
    if($value === null) return true;

    if(is_string($value)) return strtolower($value) === "null";

    return false;
  }

  public function toNull($value): mixed { // Convert from interpretable null to null, otherwise return the value
    if($value === null) return null;

    if(is_string($value) && strtolower($value) === "null") return null;

    return $value;
  }

  // Serial number format depends on the manufacturers so this function implements basic checks
  public function isValidSerialNum(string $serial_num, int $min_length = 5): bool { // AI help
    if(strlen($serial_num) < $min_length) return false;

    $is_serial_format = preg_match('/^[a-zA-Z0-9_-]+$/', $serial_num);
    if(!$is_serial_format) return false;

    return true;
  }

  // Basic IMEI check only contains numbers and has a length not smaller than 15
  public function isValidIMEI(string $imei): bool {
    $cleaned_IMEI = preg_replace('/[^0-9]/', '', $imei); // Remove non-numeric characters

    if(strlen($cleaned_IMEI) < 15 || !ctype_digit($cleaned_IMEI)) return false;

    return true;
  }

  public function hasRoleWithId(array $roles, int $role_id): bool { // Check if a role exist in list of roles
    foreach($roles as $role) {
      if(isset($role["id"]) && $role["id"] == $role_id) return true;
    }

    return false;
  }

  public function compareArrays(array $arrayA, array $arrayB): bool { // Compare of two array are equal no matter the order of elements
    if(count($arrayA) !== count($arrayB)) return false; // Check if both arrays have the same length

    // Count the frequency of elements in both arrays
    $frequencyA = array_count_values($arrayA);
    $frequencyB = array_count_values($arrayB);

    return $frequencyA == $frequencyB;  // Compare the frequency maps using loose equality (no matter the ordering)
}
}
