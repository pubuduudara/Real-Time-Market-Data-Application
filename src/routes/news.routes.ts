import express from "express";
import { validateRequest } from "../middlewares/requestValidator";
import { NewsController } from "../controllers/news.controller";
import {
  getAllNewsSchema,
  getNewsByAuthorSchema,
  getNewsByTopicSchema,
} from "../requestSchemas/news.schema";

class NewsRoutes {
  public router: express.Router;
  private newsController: NewsController;

  constructor() {
    this.router = express.Router();
    this.newsController = new NewsController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    /**
     * @swagger
     * /news:
     *   get:
     *     summary: Retrieve all news articles
     *     description: Fetch a paginated list of news articles. Requires an API key for authorization.
     *     security:
     *       - ApiKeyAuth: []
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           minimum: 1
     *           default: 1
     *         required: false
     *         description: The page number for pagination (must be at least 1).
     *       - in: query
     *         name: pageSize
     *         schema:
     *           type: integer
     *           minimum: 1
     *           default: 10
     *         required: false
     *         description: The number of results per page (must be at least 1).
     *     responses:
     *       200:
     *         description: Successfully retrieved news articles.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   type: object
     *                   properties:
     *                     news:
     *                       type: array
     *                       items:
     *                         type: object
     *                         properties:
     *                           id:
     *                             type: string
     *                           title:
     *                             type: string
     *                           url:
     *                             type: string
     *                           timePublished:
     *                             type: string
     *                             format: date-time
     *                             nullable: true
     *                           summary:
     *                             type: string
     *                           bannerImage:
     *                             type: string
     *                             nullable: true
     *                           source:
     *                             type: string
     *                           categoryWithinSource:
     *                             type: string
     *                           sourceDomain:
     *                             type: string
     *                           overallSentimentScore:
     *                             type: number
     *                           overallSentimentLabel:
     *                             type: string
     *                           createdAt:
     *                             type: string
     *                             format: date-time
     *                     total:
     *                       type: integer
     *                     page:
     *                       type: integer
     *                     pageSize:
     *                       type: integer
     *       401:
     *         description: Unauthorized - API key is missing or invalid.
     *       500:
     *         description: Internal server error.
     */
    this.router.get(
      "/news",
      validateRequest(getAllNewsSchema, "query"),
      (req, res) => this.newsController.getAll(req, res)
    );
    /**
     * @swagger
     * /news/by-topic:
     *   get:
     *     summary: Retrieve news articles by topic
     *     description: Fetch a paginated list of news articles filtered by topics. Requires an API key for authorization.
     *     security:
     *       - ApiKeyAuth: []
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           minimum: 1
     *           default: 1
     *         required: false
     *         description: The page number for pagination (must be at least 1).
     *       - in: query
     *         name: pageSize
     *         schema:
     *           type: integer
     *           minimum: 1
     *           default: 10
     *         required: false
     *         description: The number of results per page (must be at least 1).
     *       - in: query
     *         name: topics
     *         schema:
     *           type: string
     *           pattern: "^[a-zA-Z,]+$"
     *         required: true
     *         description: A comma-separated list of topics to filter by.
     *     responses:
     *       200:
     *         description: Successfully retrieved news articles by topic.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   type: object
     *                   properties:
     *                     news:
     *                       type: array
     *                       items:
     *                         type: object
     *                         properties:
     *                           id:
     *                             type: string
     *                           title:
     *                             type: string
     *                           url:
     *                             type: string
     *                           timePublished:
     *                             type: string
     *                             format: date-time
     *                             nullable: true
     *                           summary:
     *                             type: string
     *                           bannerImage:
     *                             type: string
     *                             nullable: true
     *                           source:
     *                             type: string
     *                           categoryWithinSource:
     *                             type: string
     *                           sourceDomain:
     *                             type: string
     *                           overallSentimentScore:
     *                             type: number
     *                           overallSentimentLabel:
     *                             type: string
     *                           createdAt:
     *                             type: string
     *                             format: date-time
     *                           authors:
     *                             type: array
     *                             items:
     *                               type: object
     *                               properties:
     *                                 id:
     *                                   type: string
     *                                 name:
     *                                   type: string
     *                           tickerSentiments:
     *                             type: array
     *                             items:
     *                               type: object
     *                               properties:
     *                                 id:
     *                                   type: string
     *                                 ticker:
     *                                   type: string
     *                                 relevanceScore:
     *                                   type: number
     *                                 tickerSentimentScore:
     *                                   type: number
     *                                 tickerSentimentLabel:
     *                                   type: string
     *                     total:
     *                       type: integer
     *                     page:
     *                       type: integer
     *                     pageSize:
     *                       type: integer
     *       401:
     *         description: Unauthorized - API key is missing or invalid.
     *       500:
     *         description: Internal server error.
     */
    this.router.get(
      "/news/by-topic",
      validateRequest(getNewsByTopicSchema, "query"),
      (req, res) => this.newsController.getByTopic(req, res)
    );

    /**
     * @swagger
     * /news/by-author:
     *   get:
     *     summary: Retrieve news articles by a specific author
     *     description: Fetch a paginated list of news articles authored by the specified author. Requires an API key for authorization.
     *     security:
     *       - ApiKeyAuth: []
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           minimum: 1
     *           default: 1
     *         required: false
     *         description: The page number for pagination (must be at least 1).
     *       - in: query
     *         name: pageSize
     *         schema:
     *           type: integer
     *           minimum: 1
     *           default: 10
     *         required: false
     *         description: The number of results per page (must be at least 1).
     *       - in: query
     *         name: author
     *         schema:
     *           type: string
     *         required: true
     *         description: The name of the author to filter news articles by.
     *     responses:
     *       200:
     *         description: Successfully retrieved news articles by the author.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   type: object
     *                   properties:
     *                     news:
     *                       type: array
     *                       items:
     *                         type: object
     *                         properties:
     *                           id:
     *                             type: string
     *                             example: "16fd2454-8fb7-4410-b625-e312b08b8837"
     *                           title:
     *                             type: string
     *                             example: "Sample news title"
     *                           url:
     *                             type: string
     *                             example: "https://example.com"
     *                           timePublished:
     *                             type: string
     *                             format: date-time
     *                             example: "2024-12-24T05:13:32.093Z"
     *                           summary:
     *                             type: string
     *                             example: "This is a summary of the article."
     *                           bannerImage:
     *                             type: string
     *                             nullable: true
     *                             example: "https://example.com/image.png"
     *                           source:
     *                             type: string
     *                             example: "Example Source"
     *                           categoryWithinSource:
     *                             type: string
     *                             example: "News"
     *                           sourceDomain:
     *                             type: string
     *                             example: "example.com"
     *                           overallSentimentScore:
     *                             type: number
     *                             example: 0.316253
     *                           overallSentimentLabel:
     *                             type: string
     *                             example: "Somewhat-Bullish"
     *                           createdAt:
     *                             type: string
     *                             format: date-time
     *                             example: "2024-12-24T05:13:32.093Z"
     *                     total:
     *                       type: integer
     *                       example: 50
     *                     page:
     *                       type: integer
     *                       example: 1
     *                     pageSize:
     *                       type: integer
     *                       example: 10
     *       400:
     *         description: Invalid input parameters.
     *       401:
     *         description: Unauthorized - API key is missing or invalid.
     *       500:
     *         description: Internal server error.
     * components:
     *   securitySchemes:
     *     ApiKeyAuth:
     *       type: apiKey
     *       in: header
     *       name: x-api-key
     */
    this.router.get(
      "/news/by-author",
      validateRequest(getNewsByAuthorSchema, "query"),
      (req, res) => this.newsController.getByAuthor(req, res)
    );
  }
}

export default new NewsRoutes().router;
