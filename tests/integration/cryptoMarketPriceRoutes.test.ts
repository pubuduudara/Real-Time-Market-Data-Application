import request from "supertest";
import app from "../../src/main.rest";
import { AppDataSource } from "../../config/database";
import { CryptoTradeEntity } from "../../src/models/entities/cryptoTrade.entity";

beforeAll(async () => {
  await AppDataSource.initialize();
});

afterAll(async () => {
  await AppDataSource.destroy();
});

beforeEach(async () => {
  const entities = AppDataSource.entityMetadatas;
  for (const entity of entities) {
    const repository = AppDataSource.getRepository(entity.name);
    await repository.clear();
  }
});

describe("GET /crypto/prices", () => {
  it("should return 400 if required parameters are missing", async () => {
    const response = await request(app)
      .get("/crypto/prices")
      .set("x-api-key", "valid-key");
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      errors: [{ message: '"startDate" is required', field: "startDate" }],
    });
  });

  it("should return 400 for invalid date format", async () => {
    const response = await request(app)
      .get("/crypto/prices?startDate=invalid-date")
      .set("x-api-key", "valid-key");
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      errors: [
        {
          message: "startDate must be in the format YYYY-MM-DD.",
          field: "startDate",
        },
      ],
    });
  });

  it("should return 200 and data for valid inputs", async () => {
    // Seed the database with test data
    const trade = new CryptoTradeEntity();
    trade.ticker = "usdcusdt";
    trade.timeStamp = new Date("2024-12-24T16:21:13.000Z");
    trade.exchange = "curvefipolygon";
    trade.lastSize = 1.0009762439607752;
    trade.lastPrice = 7617.377724;
    await AppDataSource.getRepository(CryptoTradeEntity).save(trade);

    const response = await request(app)
      .get(
        "/crypto/prices?startDate=2024-12-23&endDate=2024-12-25&page=1&pageSize=10"
      )
      .set("x-api-key", "valid-key");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.trades.length).toBeGreaterThan(0);
  });

  it("should return paginated results", async () => {
    const response = await request(app)
      .get(
        "/crypto/prices?startDate=2024-12-23&endDate=2024-12-25&page=1&pageSize=1"
      )
      .set("x-api-key", "valid-key");

    expect(response.status).toBe(200);
    expect(response.body.data.pageSize).toBe(1);
    expect(response.body.data.trades.length).toBe(1);
  });

  it("should return 401 if API key is missing", async () => {
    const response = await request(app)
      .get("/crypto/prices?startDate=2024-12-23")
      .set("x-api-key", "");

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Unauthorized: API key is missing");
  });
});
