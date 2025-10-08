import mongoose from "mongoose";
import * as path from "path";
import { connectToDatabase } from "../../../src/config/database/mongo.config";
import { ApiException } from "../../../src/exceptions/api.exception";


jest.mock("mongoose", () => ({
    connect: jest.fn(),
    connection: {
        readyState: 0,
    },
}));
describe("connectToDatabase", () => {

    const originalEnv = process.env;
    beforeAll(() => {
        process.env.USER_MONGO = "testUser";
        process.env.PASS_MONGO = "testPass";
        process.env.HOST_MONGO = "testHost";
    });
    afterAll(() => {
        process.env = originalEnv;
    });
    const uri = `mongodb://${process.env.USER_MONGO}:${process.env.PASS_MONGO}@${process.env.HOST_MONGO}`;
    const caCertPath = path.resolve(__dirname, "../global-bundle.pem");
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it("should connect to the database successfully", async () => {
      (mongoose.connect as jest.Mock).mockResolvedValueOnce(mongoose);
      const dbConnection = await connectToDatabase();
      expect(dbConnection).toBe(mongoose);
    });
  
    it("should throw an ApiException when connection fails", async () => {
      (mongoose.connect as jest.Mock).mockRejectedValueOnce(new Error("Connection error"));
      await expect(connectToDatabase()).rejects.toThrow(ApiException);
    });
  
    it("should reuse the cached connection if already connected", async () => {
      Object.defineProperty(mongoose.connection, "readyState", {
        value: 1,
        writable: true,
      });
  
      const cachedConnection = await connectToDatabase();
  
      expect(mongoose.connect).not.toHaveBeenCalled()
      expect(cachedConnection).toBe(mongoose);
      Object.defineProperty(mongoose.connection, "readyState", {
        value: 0,
        writable: true,
      });
    });
  });