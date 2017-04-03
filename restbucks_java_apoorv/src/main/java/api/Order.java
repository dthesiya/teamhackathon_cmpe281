package api ;

import java.util.ArrayList ;
import java.util.HashMap;
import java.util.Random ;
import java.util.UUID ;
import java.util.concurrent.ConcurrentHashMap ;

class Order {

	public String order_id = UUID.randomUUID().toString() ; // generate unique id for orders
	public String location ;   // Which of the RESTBUCKS store is this order for? eg. San Jose, San Francisco, Los Angeles
    public ArrayList<OrderItem> items = new ArrayList<OrderItem>() ; // Individual coffees in an order
    public HashMap<String,String> links = new HashMap<String,String>(); // URL links for the order
    public RestbucksAPI.OrderStatus status ;  // Can be one of PLACED, PAID, PREPARING, SERVED, COLLECTED 
    public String message ;  // Details of the order status or response to the user's request
    public Double amount; // Total cost of the order
    
}
