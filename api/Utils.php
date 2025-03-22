<?php

class Utils {

  public function genProductSKU(
    string $category,
    string $brand,
    string $model,
    string $watch_size_mm,
    string $watch_color,
    string $band_material
  ): string { //cate-brand-model-watch_size-color-band_mater: SW-APL-S8-45-BLK-SIL-TIME_MILI

    $category = trim($category);
    $brand = trim($brand);
    $model = trim($model);
    $watch_size = trim($watch_size_mm);
    $watch_color = trim($watch_color);
    $band_material = trim($band_material);
    $milisecs = (string) $this->getCurrentTime(); //make sure unique

    return strtolower(implode('-', [$category, $brand, $model, $watch_size, $watch_color, $band_material, $milisecs]));
  }

  public function isValidProductSKU(string $sku): bool { //AI gen
    // Regular expression to match the SKU format
    $pattern = '/^[a-z]+-[a-z]+-[a-z0-9]+-[0-9]+-[a-z]+-[a-z]+-[0-9]+$/'; // Improved regex
    $test_pattern = '/^[a-z]+-[0-9]+-[a-z]+$/'; //TODO temp for dev
    return preg_match($test_pattern, $sku);
    // return true;
  }

  public function getCurrentTime(): float { // return milisecs
    return round(microtime(true) * 1000);
  }

  public function isValidDateTimeFormat(string $dateTimeString): bool { //AI gen
    $format = 'Y-m-d H:i:s'; // The format you want to check

    try {
      $dateTime = DateTime::createFromFormat($format, $dateTimeString);

      // Check if the DateTime object was created successfully AND if the formatted date matches the original string
      return $dateTime && $dateTime->format($format) === $dateTimeString;

    } catch (Exception $e) {
      return false; // Invalid date/time string or format mismatch
    }
  }

  public function isValidEmail(string $email): bool {
    // Remove all illegal characters from email
    $email = filter_var($email, FILTER_SANITIZE_EMAIL);

    // Validate e-mail
    return filter_var($email, FILTER_VALIDATE_EMAIL) ? true : false;
  }
  public function isValidEmailRobust(string $email): bool { //AI gen: More robust, but potentially overkill (and slower):
    $email = filter_var($email, FILTER_SANITIZE_EMAIL);  // Sanitize first

    if(!filter_var($email, FILTER_VALIDATE_EMAIL)) return false;

    // Check for DNS records (MX or A) - more thorough but slower
    $domain = explode('@', $email)[1];
    return (checkdnsrr($domain, 'MX') || checkdnsrr($domain, 'A')) ? true : false;
  }

  public function isValidVNPhoneNumber(string $phoneNumber): bool { //AI gen
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

  public function isValidPassword(string $password, int $minLength=8): bool { //AI gen
    // password contains at least a letter + a number + length >= minLength
    return (strlen($password) >= $minLength && preg_match('/[a-zA-Z]/', $password)) && preg_match('/\d/', $password) ? true : false;
  }

  public function isListOfNumber(array $list): bool {
    foreach($list as $ele) {
      if(!is_numeric($ele)) return false;
    }

    return true;
  }

  public function removeOddSpace(string $str): string { //AI help
    return trim(preg_replace('/\+s/', ' ', $str));
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
      $errors[] = "File size exceeds the maximum of " . ($max_file_size / (1024 * 1024)) . " MB";
    }
    //check image dimensions
    $image_info = getimagesize($file["tmp_name"]);
    if($image_info) {
      if($image_info[0] > $max_width || $image_info[1] > $max_height) {
        $errors[] = "Image dimensions exceed the maximum allowed size of " . $max_width . "x" . $max_height ." px";
      }
    } else {
      $errors[] = "Uploaded file is not a valid image";
    }

    return $errors;
  }

  /**
   * Save the image file to a specify path, if path is not exist then create a new one
   * @param array $file from $_FILE
   * @param string $upload_dir path to store the image and relative to index.php
   * @throws \Exception throw exception if couldn't upload or couldn't create a path
   * @return string file name with extension
   */
  public function saveImage(array $file, string $upload_dir="../uploads"): string { //upload_dir relative to index.php
    $new_filename = $this->genFileName($file["name"]);
    $destination = "$upload_dir/$new_filename";

    if(!file_exists($upload_dir) && !mkdir($upload_dir, 0777, true)) { //create folder if not exist
      throw new Exception("Failed to create folder $upload_dir");
    }

    if(!move_uploaded_file($file["tmp_name"], $destination)) {
      throw new Exception("Failed to move uploaded file");
    }

    return $new_filename;
  }

  /**
   * Remove the image from a specify path
   * @param string $filename full name of file with extension
   * @param string $upload_dir path that store the file
   * @return bool
   */
  public function removeImage(string $filename, string $upload_dir="../uploads"): bool {
    return unlink("$upload_dir/$filename");
  }

  public function is_interpretable_bool($value): bool {
      if(is_bool($value)) return true;
      if(is_numeric($value)) {
        return $value == 0 || $value == 1;
      }
      if(is_string($value)) {
        $value = strtolower($value);
        return $value === "true" || $value === "false";
      }

      return false;
  }
}
