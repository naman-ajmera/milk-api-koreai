import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import orderRoute from "./routes/orderRoutes.js";
import connectDB from "./config/db.js";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

const PORT = process.env.PORT || 3000;
dotenv.config();
connectDB();
const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use("/", orderRoute);
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Milk API",
      version: "1.0.0",
      description: "Dairy Milk distributor API",
      termsOfService: "http://example.com/terms/",
      contact: {
        name: "API Support",
        url: "http://www.exmaple.com/support",
        email: "support@example.com",
      },
    },

    servers: [
      {
        url: "http://localhost:3000",
        description: "My API Documentation",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

export default app;
