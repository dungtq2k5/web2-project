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

  public function getCurrentTime() { // return milisecs
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
}