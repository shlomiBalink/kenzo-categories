export interface EnvironmentVariables {
  /**
   * @param string The directory at the remote SFTP server that contains
   * the stocks CSV files.
   *
   * Example: `/stocks`
   */
  SFTP_STOCKS_FOLDER_PATH: string;

  STOCK_CSV_DELIMITER: string;
}

export interface Stock {
  store: string;
  productId: string;
  quantity: string;
}

export interface CsvStock extends Record<string, string> {
  store: string;
  product_id: string;
  quantity: string;
  quantity_in_transit: string;
  quantity_defective: string;
  quantity_reserved: string;
  quantity_to_return: string;
}
