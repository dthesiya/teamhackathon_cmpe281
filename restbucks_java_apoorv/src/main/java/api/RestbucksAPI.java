package api ;

import java.util.concurrent.BlockingQueue ;
import java.util.concurrent.LinkedBlockingQueue ;
import java.util.concurrent.ConcurrentHashMap ;
import java.util.ArrayList;
import java.util.Collection ;
import java.util.HashMap;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.BlockingQueue;

public class RestbucksAPI {
	 static ConnectionUtil myconn = new ConnectionUtil();

    public enum OrderStatus { PLACED, PAID, PREPARING, SERVED, COLLECTED  }
    private static BlockingQueue<String> orderQueue = new LinkedBlockingQueue<String>();  // order queue
    //private static HashMap<String,Order> orders = new HashMap<String,Order>(); // list of orders

    public static void placeOrder(String order_id, Order order) {
    
    		
    	
    	// Insert order in database
        try { 
        
         myconn.insertValues(order);
           RestbucksAPI.orderQueue.put( order_id ) ; // Insert order order queue 

           

        } catch (Exception e) {
        	
        	System.out.println(e);
        }


        /*RestbucksAPI.orders.put( order_id, order ) ;*/ // insert order in database
        System.out.println( "Order Placed: " + order_id ) ;
    }
    

    public static void startOrderProcessor() {   //Start queues for the Barista to process the orders
        RestbucksBarista barista = new RestbucksBarista( orderQueue ) ;
        new Thread(barista).start();
    }

    public static void updateOrder(String key, Order order) {  // update the order
        /*RestbucksAPI.orders.replace( key, order ) ;*/ // update order in the database
    	
    	
    	myconn.updateValue(key,order);
    }

    public static Order getOrder(String key) {
    	
    	System.out.println("API get order called");
    	return myconn.retriveValue(UUID.fromString(key));
    	
    	
		 // retrive individual order
        // return RestbucksAPI.orders.get( key ) ; - fetch order from database using order id
    }

    public static void removeOrder(String key) { // cancel order
        //RestbucksAPI.orders.remove( key ) ; // cancel order from database
    	
    	myconn.removeValue(key);
    	
    	
    	
        RestbucksAPI.orderQueue.remove( key ) ; // remove the order from queue as it is pending to be processed.
    }

    public static void setOrderStatus( Order order, String URI, OrderStatus status ) { //set the status and update the order in database
        switch ( status ) {  
            case PLACED: // update the order status
                order.status = OrderStatus.PLACED ;  
                order.message = "Order has been placed." ;
               // order.links.put ("order", URI+"/"+order.id ) ;
              //  order.links.put ("payment",URI+"/"+order.id+"/pay" ) ;*/




            break;
                    
            case PAID: // update the order status

                order.status = RestbucksAPI.OrderStatus.PAID ;
                order.message = "Payment Accepted." ;
               // order.links.remove ( "payment" ) ;*/
            break;                        
        }
    }

    public static void setOrderStatus( Order order, OrderStatus status ) { // set the status and update the order in datbase 
        switch ( status ) {
            case PREPARING: 
                order.status = RestbucksAPI.OrderStatus.PREPARING ;
                
                order.message = "Order preparations in progress." ;
                myconn.updateValue(order.getOrder_id(), order);
                break;

            case SERVED: 
                order.status = RestbucksAPI.OrderStatus.SERVED ;
                order.message = "Order served, wating for Customer pickup." ; 
                myconn.updateValue(order.getOrder_id(), order);
                break;

            case COLLECTED: 
                order.status = RestbucksAPI.OrderStatus.COLLECTED;
               order.message = "Order retrived by Customer." ; 
               myconn.updateValue(order.getOrder_id(), order);
                break;   
        }
    }


    public static Collection<Order> getOrders() {
    	
    		Collection<Order> orders = new ArrayList<Order>();
    		
    		orders = myconn.retriveValues();
    	
		return orders; // get all orders from the database for this store
        // return orders.values() ;
    }

}


