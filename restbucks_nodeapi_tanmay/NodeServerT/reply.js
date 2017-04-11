reply = {};
reply.message = {};

reply.message.err_place  = "Sorry could not place order"
reply.message.err_getOrderById = "Order not found";
reply.message.err_getOrders = "Orders not found"
reply.message.err_update = "Order not found"
reply.message.err_paidAlready = "Order Payment rejected! Order already paid for"
reply.message.err_calcelPaid = "Order Cancelling Rejected"
reply.message.err_cancel = "Couldn't cancel order"
reply.message.err_cancel = "Couldn't complete payment"

reply.contactPoint1 = '192.168.99.100';
reply.contactPoint2 = ''

reply.success_status = "200";
reply.error_status = "404";

module.exports = reply;
