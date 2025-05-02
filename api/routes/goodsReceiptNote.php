<?php

switch(true) {
  case $uri === SOURCE_URI . "/goods_receipt_notes":
    $gateway = new GoodsReceiptNoteGateway($db_conn);
    $controller = new GoodsReceiptNoteController($gateway, $auths);
    $controller->processRequest($method, $id, $limit, $offset);
    break;

  default:
    $error_handler->sendErrorResponse(404, "Request not found");
}
