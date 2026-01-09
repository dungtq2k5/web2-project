<?php

class ErrorHandler
{

  public function handleException(Throwable $exception): void
  {
    if ($exception instanceof PDOException && $exception->getCode() == "23000") { // Handle some of MySQL's exceptions
      $error_msg = $exception->getMessage();

      // Handle duplicate exception:
      //  SQLSTATE[23000]: Integrity constraint violation: 1062 Duplicate entry 'samsung' for key 'name'
      if (preg_match("/Duplicate entry '(.*?)' for key '(.*?)'/", $error_msg, $matches)) {
        $entry_value = $matches[1]; // Value of field
        $key_name = $matches[2];    // Field name in db
        $usr_friendly_msg = "The value '$entry_value' for the field '$key_name' is already taken. Please try a different value.";

        $this->sendErrorResponse(409, $usr_friendly_msg);
        return;
      }

      // Handle FK constraint exception:
      //  SQLSTATE[23000]: Integrity constraint violation: 1452 Cannot add or update a child row:
      //  a foreign key constraint fails (`smartwatch_db`.`product_instances`,
      //  CONSTRAINT `product_instances_ibfk_2` FOREIGN KEY (`goods_receipt_note_id`) REFERENCES `goods_receipt_notes` (`id`))
      if (preg_match("/FOREIGN KEY \(`(.*?)`\) REFERENCES `(.*?)` \(`(.*?)`\)/", $error_msg, $matches)) {
        $child_table_field = $matches[1];   // Field name of child table in db
        $parent_table = $matches[2];        // Parent table name in db
        $parent_table_field = $matches[3];  // Parent table field name in db
        $usr_friendly_msg = "Invalid value provided for '$child_table_field'. The value must exist in the '$parent_table' table's '$parent_table_field' field.";

        $this->sendErrorResponse(400, $usr_friendly_msg);
        return;
      }
    }

    if ($exception instanceof Exception) { // Handle exceptions throw by gateway functions
      $this->sendErrorResponse($exception->getCode(), $exception->getMessage());
      return;
    }

    //Default error response for other exceptions
    $this->sendErrorResponse(500, $exception);
  }

  public function sendErrorResponse(int | string $statusCode, Throwable | string | array $exception): void
  {
    http_response_code((int)$statusCode);

    if ($exception instanceof Throwable) {
      echo json_encode([
        "success" => false,
        "code" => $exception->getCode(),
        "message" => $exception->getMessage(),
        "file" => $exception->getFile(),
        "line" => $exception->getLine()
      ]);
      return;
    }

    echo json_encode([
      "success" => false,
      "message" => $exception,
    ]);
  }
}
