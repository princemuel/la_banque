<?php

declare(strict_types=1);

// Your Code
function getTransactionFiles(string $dirPath): array
{
  $files = [];

  foreach (scandir($dirPath) as $value) {
    if (is_dir($value)) {
      continue;
    }

    $files[] = $dirPath . $value;
  }

  return $files;
}


function getTransactions(string $fileName, ?callable $transactionHandler = null): array
{
  if (!file_exists($fileName)) {
    trigger_error('File "' . $fileName . '" does not exist.', E_USER_ERROR);
  }

  $file = fopen($fileName, 'r');

  fgetcsv($file);

  $transactions = [];

  while (($transaction = fgetcsv($file)) !== false) {
    if ($transactionHandler !== null) {
      $transaction = $transactionHandler($transaction);
    }

    $transactions[] = $transaction;
  }

  return $transactions;
}


function extractTransaction(array $transactionRow): array
{
  [$date,  $checkNumber,   $description,  $amount] = $transactionRow;

  $amount = (float) str_replace(['$', ','], '', $amount);

  return [
    'date' => $date,
    'checkNumber' => $checkNumber,
    'amount' => $amount,
    'description' => $description
  ];
}
