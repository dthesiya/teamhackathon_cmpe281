/**
 * Created by vicky on 4/3/2017.
 */
var config = {};
config.cassandra = {};
config.cassandra.contactPoints = '127.0.0.1';
config.cassandra.keyspace = 'restbucks';

config.priceCatalog = {};
config.priceCatalog.cappuccino = 3.65;
config.priceCatalog.latte = 3.75;
config.priceCatalog.mochaccino = 3.85;
config.priceCatalog.medium = 0.5;
config.priceCatalog.large = 1.0;

config.orderStatus = {};
config.orderStatus.placed = 'PLACED';
config.orderStatus.paid = 'PAID';
config.orderStatus.preparing = 'PREPARING';
config.orderStatus.served = 'SERVED';
config.orderStatus.collected = 'COLLECTED';

config.queries = {};
config.queries.place_order = "INSERT INTO restbucks_order JSON ?";
config.queries.get_orderby_id = "SELECT * FROM restbucks_order WHERE order_id = ?";
config.queries.get_orders = "SELECT * FROM restbucks_order";
config.queries.update_order = "INSERT INTO restbucks_order JSON ?";
config.queries.cancel_order = "DELETE FROM restbucks_order WHERE order_id=?";
config.queries.pay_order = "UPDATE restbucks_order SET status=? where order_id = ? IF EXISTS";
config.queries.update_status = "UPDATE restbucks_order SET status=? where order_id = ? IF EXISTS"


config.message = {};
config.message.err_place = "Error in placing new order";
config.message.err_getOrderById = "Error in getting requested order";
config.message.err_getOrders = "Error in getting all orders";
config.message.err_update = "Error in updating requested order";
config.message.err_cancel = "Error in canceling requested order";
config.message.err_pay = "Error in paying requested order";
config.message.err_update_paid = "Can't update order.Requested order is already in progress";
config.message.err_cancel_paid = "Can't cancel order.Requested order is already in progress";

config.message.success_place = "New order placed";
config.message.success_update = "Requested order updated";
config.message.success_cancel = "Requested order cancelled";
config.message.success_pay = "Requested order paid";

config.responde_status = {};
config.responde_status.err = 404;
config.responde_status.success = 200;


module.exports = config;