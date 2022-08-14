import express from "express";
import {
  addOrder,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
  checkCapacity,
} from "../controllers/orderController.js";

const orderRoute = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - milkQuantity
 *         - shippingAddress
 *         - orderStatus
 *         - isDelivered
 *         - deliveredAt
 *       properties:
 *         milkQuantity:
 *           type: integer
 *           description: quantity of milk ordered
 *         shippingAddress:
 *           type: string
 *           description: shippingAddress of order
 *         orderStatus:
 *           type: string
 *           default: "placed"
 *           enum:
 *           - placed
 *           - packed
 *           - dispatched
 *           - delivered
 *           description: current status of order
 *         isDelivered:
 *           type: boolean
 *           default: false
 *           description: boolean field to flag if order is delivered
 *         deliveredAt:
 *           type: time
 *           description: boolean field to flag if order is delivered
 */

/**
 * @swagger
 *  tags:
 *    name: Orders
 *    description: orders for milk
 */

/**
 * @swagger
 * /:
 *   post:
 *     summary: Create a new order
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               milkQuantity:
 *                 type: integer
 *                 default: 10
 *               shippingAddress:
 *                 type: string
 *                 default: Anandam World City
 *     responses:
 *       200:
 *         description: The order was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Milk Capacity reached for the day!!
 */
orderRoute.route("/").post(addOrder);

/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: update order
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: order id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               milkQuantity:
 *                 type: integer
 *                 default: 10
 *               shippingAddress:
 *                 type: string
 *                 default: Anandam World City
 *     responses:
 *       200:
 *         description: The order was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: order was not found!!
 */
orderRoute.route("/:id").put(updateOrder);

/**
 * @swagger
 *  /{id}:
 *    delete:
 *      summary: removes order from database
 *      tags: [Order]
 *      parameters:
 *        - in: path
 *          name: id
 *          description: order id
 *          required: true
 *          schema:
 *            type: integer
 *      responses:
 *        200:
 *          description: The order was deleted
 *        404:
 *          description: The order was not found
 *
 */
orderRoute.route("/:id").delete(deleteOrder);

/**
 * @swagger
 * /updateStatus/{id}:
 *   put:
 *     summary: update order Status
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: order id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               orderStatus:
 *                 type: string
 *                 default: packed
 *     responses:
 *       200:
 *         description: The order status was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: order was not found!!
 */
orderRoute.route("/updateStatus/:id").put(updateOrderStatus);

/**
 * @swagger
 * /checkCapacity/{date}:
 *   get:
 *     summary: Returns capacity for date
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: date
 *         schema:
 *           type: string
 *         required: true
 *         description: pass date in YYYYMMDD format
 *         default: 20220814
 *     responses:
 *       200:
 *         description: the remaining capacity for day
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 milkCapacity:
 *                   type: integer
 *       404:
 *         description: No Orders placed for the given day.!!!
 */
orderRoute.route("/checkCapacity/:date").get(checkCapacity);

export default orderRoute;
