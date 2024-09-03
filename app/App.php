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


function getTransactions(string $fileName): array
{
  if (!file_exists($fileName)) {
    trigger_error('File "' . $fileName . '" does not exist.', E_USER_ERROR);
  }

  $file = fopen($fileName, 'r');

  fgetcsv($file);

  $transactions = [];

  while (($transaction = fgetcsv($file)) !== false) {
    $transactions[] = extractTransaction($transaction);
  }

  return $transactions;
}


function extractTransaction(array $transaction): array
{
  [$date,  $checkNumber,   $description,  $amount] = $transaction;

  $amount = (float) str_replace(['$', ','], '', $amount);

  return [
    'date' => $date,
    'checkNumber' => $checkNumber,
    'amount' => $amount,
    'description' => $description
  ];
}
