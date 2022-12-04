import { Stock } from 'src/stock/stock.types.d';

function generateStoreId(): string {
  return String(100000 + Math.ceil(Math.random() * 400000));
}

function generateProductId(): string {
  return String(1000000000000 + Math.ceil(Math.random() * 1000000000000));
}

function generateQuantity(): string {
  return String(Math.floor(Math.random() * 11));
}

function generateStock(): Stock {
  const stock: Stock = {
    store: generateStoreId(),
    productId: generateProductId(),
    quantity: generateQuantity(),
  };
  return stock;
}

function generateStockCsv(stocks: Stock[]) {
  return [
    'store;product_id;quantity;quantity_in_transit;quantity_defective;quantity_reserved;quantity_to_return',
    stocks
      .map(({ store, productId, quantity }) => `${store};${productId};${quantity};0;;;`)
      .join('\n'),
  ].join('\n');
}

type FileContent = string;

const file1Stocks = Array.from({ length: 10 }, generateStock);
const file2Stocks = Array.from({ length: 10 }, generateStock);
const directory1File1Stocks = Array.from({ length: 10 }, generateStock);
const directory2File1Stocks = Array.from({ length: 10 }, generateStock);
const directory2File2Stocks = Array.from({ length: 10 }, generateStock);
const directory2File3Stocks = Array.from({ length: 10 }, generateStock);
const directory3File1Stocks = Array.from({ length: 10 }, generateStock);

export const allStocks = [
  ...file1Stocks,
  ...file2Stocks,
  ...directory1File1Stocks,
  ...directory2File1Stocks,
  ...directory2File2Stocks,
  ...directory2File3Stocks,
  ...directory3File1Stocks,
];

export type Directory = { [file: string]: Directory | FileContent };

export const rootDirectory: Directory = {
  file1: generateStockCsv(file1Stocks),
  file2: generateStockCsv(file2Stocks),
  directory1: {
    directory1File1: generateStockCsv(directory1File1Stocks),
  },
  directory2: {
    directory2File1: generateStockCsv(directory2File1Stocks),
    directory2File2: generateStockCsv(directory2File2Stocks),
    directory2File3: generateStockCsv(directory2File3Stocks),
    directory3: {
      directory3File1: generateStockCsv(directory3File1Stocks),
    },
  },
};
