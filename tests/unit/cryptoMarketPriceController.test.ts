// import { CryptoMarketPriceController } from "../../src/controllers/cryptoMarketPrice.controller";

// describe("CryptoMarketPriceController", () => {
//   it("should throw an error for invalid tickers", async () => {
//     const controller = new CryptoMarketPriceController();
//     const req = {
//       query: {
//         tickers: "invalidTicker",
//         startDate: "2024-12-01",
//       },
//     };

//     const res = {
//       json: jest.fn(),
//       status: jest.fn().mockReturnThis(),
//     };

//     await expect(controller.getPrices(req, res)).rejects.toThrow(
//       "Invalid ticker: invalidTicker"
//     );
//   });

//   it("should handle valid requests successfully", async () => {
//     const controller = new CryptoMarketPriceController();
//     const req = {
//       query: {
//         startDate: "2024-12-01",
//         endDate: "2024-12-24",
//         page: "1",
//         pageSize: "5",
//       },
//     };

//     const res = {
//       json: jest.fn(),
//       status: jest.fn().mockReturnThis(),
//     };

//     await controller.getPrices(req, res);
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith(
//       expect.objectContaining({ success: true })
//     );
//   });
// });
