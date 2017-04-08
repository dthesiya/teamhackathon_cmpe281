package api ;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.ArrayList ;
import java.util.HashMap;
import java.util.List;
import java.util.Random ;
import java.util.UUID ;
import java.util.concurrent.ConcurrentHashMap ;

class Order implements Serializable{

	public String order_id = UUID.randomUUID().toString() ; // generate unique id for orders
	public String location ;   // Which of the RESTBUCKS store is this order for? eg. San Jose, San Francisco, Los Angeles
    public List<OrderItem> items = new ArrayList<OrderItem>() ; // Individual coffees in an order
    public HashMap<String,String> links = new HashMap<String,String>(); // URL links for the order
    public RestbucksAPI.OrderStatus status ;  // Can be one of PLACED, PAID, PREPARING, SERVED, COLLECTED 
    public String message ;  // Details of the order status or response to the user's request
    public Double amount; // Total cost of the order
	public String getOrder_id() {
		return order_id;
	}
	public void setOrder_id(String order_id) {
		this.order_id = order_id;
	}
	public String getLocation() {
		return location;
	}
	public void setLocation(String location) {
		this.location = location;
	}
	public List<OrderItem> getItems() {
		return items;
	}
	public void setItems(List mylist) {
		this.items =  mylist;
	}
	public HashMap<String, String> getLinks() {
		return links;
	}
	public void setLinks(HashMap<String, String> links) {
		this.links = links;
	}
	public RestbucksAPI.OrderStatus getStatus() {
		return status;
	}
	public void setStatus(RestbucksAPI.OrderStatus status) {
		this.status = status;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public Double getAmount() {
		return amount;
	}
	public void setAmount(double d) {
		this.amount = d;
	}
	public Order() {
		// TODO Auto-generated constructor stub
	}
    
}
