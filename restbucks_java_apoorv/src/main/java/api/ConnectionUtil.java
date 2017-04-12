package api;


import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID ;


import com.datastax.driver.core.*;
import com.datastax.driver.core.Session;

import api.RestbucksAPI.OrderStatus;





public class ConnectionUtil {
	private static String connectionPoint1="52.53.62.62";
	private static String connectionPoint2="34.209.207.74";
	private static String connectionPoint3="52.53.122.6";

	Session session = null;
	Cluster cluster = null;
	final String KEYSPACE = "restbucks";
    final String TABLE_RESTBUCKS_ORDER_DATA = "restbucks_order";
   
    PreparedStatement insertorderPstmt = null;
    PreparedStatement  selectallorderStmt  = null;
    PreparedStatement deleteorderStmt       = null;
    PreparedStatement updateorderStmt      = null;
    PreparedStatement selectorderbyidStmt = null;
    
    String ORDER_DATA_INSERT_STMT = "INSERT INTO " + KEYSPACE   +"."+ TABLE_RESTBUCKS_ORDER_DATA +"(order_id,amount,location,items,status,message)values(?,?,?,?,?,?)";
    String ORDER_DATA_DELETE_STMT = "DELETE FROM " + KEYSPACE +"."+TABLE_RESTBUCKS_ORDER_DATA +" WHERE order_id = ?";                                                                               
    String ORDER_DATA_SELECT_STMT = "SELECT * FROM " + KEYSPACE +"."+TABLE_RESTBUCKS_ORDER_DATA;
    String ORDER_DATA_SELECT_ORDER_BY_ID_STMT = "SELECT * FROM " + KEYSPACE +"."+TABLE_RESTBUCKS_ORDER_DATA+" WHERE order_id = ?";
    String ORDER_DATA_UPDATE_STMT ="UPDATE "+ KEYSPACE +"."+TABLE_RESTBUCKS_ORDER_DATA+" SET amount = ? ,location = ? , items = ? , status = ?, message = ?   where order_id= ? ";
	
	public ConnectionUtil () {

		this.cluster = Cluster.builder().addContactPoint(connectionPoint1).addContactPoint(connectionPoint2).addContactPoint(connectionPoint3).withPort(9042).build();
		   
		this.session = cluster.connect("restbucks");
		
		 
	     
	     insertorderPstmt = session.prepare(ORDER_DATA_INSERT_STMT);
	     selectallorderStmt = session.prepare(ORDER_DATA_SELECT_STMT);
	     updateorderStmt = session.prepare(ORDER_DATA_UPDATE_STMT);
	     deleteorderStmt = session.prepare(ORDER_DATA_DELETE_STMT);
	     selectorderbyidStmt = session.prepare(ORDER_DATA_SELECT_ORDER_BY_ID_STMT);
	 
 }
	
	public void insertValues(api.Order order) {
		List<UDTValue> orders = new ArrayList<>();
		UserType oderItemType = cluster.getMetadata().getKeyspace(session.getLoggedKeyspace()).getUserType("order_items");
		System.out.println("before loop");
		for (Object obj : order.getItems())  
		{
			System.out.println("printing type:"+obj.getClass().getName());
			api.OrderItem item = (OrderItem) obj;
			System.out.println("inside loop");
		UDTValue orderItem = oderItemType.newValue()
		        .setInt("qty", item.getQty())
		        .setString("name", item.getName())
		        .setString("milk_type", item.getMilk_type())
		        .setString("size", item.getSize())
		        .setDecimal("price", BigDecimal.valueOf(item.getPrice()));
		
		
		orders.add(orderItem);
		}
		System.out.println("Inserting");
		
		
		try {
        session.execute(insertorderPstmt.bind(UUID.fromString(order.getOrder_id()),new BigDecimal(order.getAmount()),order.getLocation(),orders,order.getStatus().toString(),order.getMessage()));
		}
		catch(Exception e)
		{
			System.out.println("exception caught in UTIL class");
		}
        System.out.println("Succesfully inserted the data in cassandra table");
 }
	
	public ArrayList<api.Order> retriveValues() {
		ArrayList<api.Order> existing_orders = new ArrayList<api.Order>();
		
		String status = null;
		
        try {
               ResultSet rs = session.execute(selectallorderStmt.bind());
               if(rs != null) {
                     List<Row> rows =rs.all();
                     if(rows != null) {
                    	
                            for(Row row : rows) {
                            	api.Order result = new api.Order();
                            	
                            	result.setOrder_id(row.getUUID("order_id").toString());
                            	result.setAmount(row.getDecimal("amount").doubleValue());
                            	
                            	List<UDTValue> mylist = row.getList("items", UDTValue.class);
                            	List<OrderItem> ordritmlist = new ArrayList<OrderItem>();
                            	
                            	for(UDTValue val : mylist){
                            		OrderItem item = new OrderItem();
                            		item.setQty(val.getInt("qty"));
                            		item.setName(val.getString("name"));
                            		item.setMilk_type(val.getString("milk_type"));
                            		item.setSize(val.getString("size"));
                            		item.setPrice((val.getDecimal(("price")).doubleValue()));
                            		ordritmlist.add(item);
                            	}
                            	result.setItems(ordritmlist);
                                
                            	//result.setItems(row.getList("items", UDTValue.class));
                            	
                            	result.setLocation(row.getString("location"));
                            	result.setMessage(row.getString("message"));
                            	status= row.getString("status");
                            	
                            	switch(status)
                            	{
                            	case "PLACED":
                            		result.setStatus(OrderStatus.PLACED) ;
                            		break;
                            	case "PAID":
                            		result.setStatus(OrderStatus.PAID);
                            		break;
                            	case "PREPARING":
                            		result.setStatus(OrderStatus.PREPARING);
                            		break;
                            	case "SERVED":
                            		result.setStatus(OrderStatus.SERVED);
                            		break;
                            	case "COLLECTED":
                            		result.setStatus(OrderStatus.COLLECTED);
                            		break;
                            		default :
                            			result.setStatus(OrderStatus.PLACED);
                            			
                            	}
                            	
                            	existing_orders.add(result);
                            	//System.out.println("Added order_id :"+result.getOrder_id());
                            	
                            	
                            	
                            	System.out.println("Printing all rows");
                                   System.out.println(row);
                            }
                            
                     }
               }
        
        } catch(Exception e) {
               System.out.println("Exception in select Stament for all orders"+e.getMessage());
        }
       
        
        return existing_orders;
 }
	
	public api.Order retriveValue(UUID uid) {
		
		api.Order result = new api.Order();
		String status = null;
		
        try {      	
        	  ResultSet rs = session.execute(selectorderbyidStmt.bind(uid));
               if(rs != null) {
                     List<Row> rows =rs.all();
                     if(rows != null) {
                            for(Row row : rows) {
                            	
                            	result.setOrder_id(row.getUUID("order_id").toString());
                            	result.setAmount(row.getDecimal("amount").doubleValue());
                  	
                            	List<UDTValue> mylist = row.getList("items", UDTValue.class);
                            	List<OrderItem> ordritmlist = new ArrayList<OrderItem>();
                            	
                            	for(UDTValue val : mylist){
                            		OrderItem item = new OrderItem();
                            		item.setQty(val.getInt("qty"));
                            		item.setName(val.getString("name"));
                            		item.setMilk_type(val.getString("milk_type"));
                            		item.setSize(val.getString("size"));
                            		item.setPrice((val.getDecimal(("price")).doubleValue()));
                            		ordritmlist.add(item);
                            	}
                            	result.setItems(ordritmlist);
                            	result.setLocation(row.getString("location"));
                            	result.setMessage(row.getString("message"));
                            	status= row.getString("status");
                            	
                            	switch(status)
                            	{
                            	case "PLACED":
                            		result.setStatus(OrderStatus.PLACED) ;
                            		break;
                            	case "PAID":
                            		result.setStatus(OrderStatus.PAID);
                            		break;
                            	case "PREPARING":
                            		result.setStatus(OrderStatus.PREPARING);
                            		break;
                            	case "SERVED":
                            		result.setStatus(OrderStatus.SERVED);
                            		break;
                            	case "COLLECTED":
                            		result.setStatus(OrderStatus.COLLECTED);
                            		break;
                            		default :
                            			result.setStatus(OrderStatus.PLACED);
                            			
                            	}
                            	System.out.println("Printing value");
                                  System.out.println(row);
                                   
                            }
                     }
               }
               
        } catch(Exception e) {
               System.out.println("Exception in select Stament"+e.getMessage());
        }
		return result;
 }
	public void removeValue(String uid) {
        try {
        	  
               ResultSet rs = session.execute(deleteorderStmt.bind(UUID.fromString(uid)));
               if(rs != null) {
                     List<Row> rows =rs.all();
                     if(rows != null) {
                            for(Row row : rows) {
                            	System.out.println("Printing value");
                                   System.out.println(row);
                            }
                     }
               }
        } catch(Exception e) {
               System.out.println("Exception in delete Stament"+e.getMessage());
        }
 }
	
	public void updateValue(String order_id,api.Order order ) {
        try {
        	List<UDTValue> orders = new ArrayList<>();
    		UserType oderItemType = cluster.getMetadata().getKeyspace(session.getLoggedKeyspace()).getUserType("order_items");
    		
    		for (api.OrderItem item : order.getItems())  
    		{
    		UDTValue orderItem = oderItemType.newValue()
    		        .setInt("qty", item.getQty())
    		        .setString("name", item.getName())
    		        .setString("milk_type", item.getMilk_type())
    		        .setString("size", item.getSize())
    		        .setDecimal("price", BigDecimal.valueOf(item.getPrice()));
    		
    		
    		orders.add(orderItem);
    		}
        	  
               ResultSet rs = session.execute(updateorderStmt.bind( new BigDecimal(order.getAmount()), order.getLocation(), orders, order.getStatus().toString(), order.getMessage(),UUID.fromString(order_id)));
               if(rs != null) {
                     List<Row> rows =rs.all();
                     if(rows != null) {
                            for(Row row : rows) {
                            	System.out.println("Printing value");
                                   System.out.println(row);
                            }
                     }
               }
        } catch(Exception e) {
               System.out.println("Exception in update Stament"+e.getMessage());
        }
 }
     
	
     
     
     
     
	
	/*public static void main(String[] args) {
System.out.println("In main method");
		String order_id = UUID.randomUUID().toString() ;
		
		
		ConnectionUtil cu = new ConnectionUtil();
		
		
		
		//cu.retriveValues();
		//cu.retriveValue(UUID.fromString("e7ae5cf3-d358-4d99-b900-85902fda9bb0"));
		//cu.insertValues();
		
		// Connect to the cluster and keyspace "library"
	   
		//PreparedStatement insertorderPstmt = cu.session.prepare("insert into restbucks.restbucks_order(order_id,amount,location,items,status,message) values(?, ?, ?, ?, ?, ?)");
		//cu.session.execute(insertorderPstmt.bind(UUID.randomUUID(), new BigDecimal("4"), "Santa Clara", orders, "PLACED", "in process"));
		//cu.retriveValues();
		//System.out.println("Deleting values");
		//cu.removeValue(UUID.fromString("3da49db9-aea2-4fd7-b39e-5dc68c7499a9"));
		//cu.retriveValues();
		
		
		//cu.updateValue(UUID.fromString("e7ae5cf3-d358-4d99-b900-85902fda9bb0"),new BigDecimal("3"),"San Jose improve 3rd st", orderItem, "Updated","in process");
		System.out.println("after update");
	
		
		//e7ae5cf3-d358-4d99-b900-85902fda9bb0 
		
		//session.execute(ORDER_DATA_SELECT_STMT)
		
		//session.execute("INSERT INTO restbucks_order (order_id,amount,location,items,status,message) VALUES (e7ae5cf3-d358-4d99-b900-85902fda9bb0, 5, 'San Jose', [{qty:2,name:'mocha',milk_type:'whole',size:'small',price:2.5}], 'PLACED','order is in process');");
		ResultSet results = session.execute("SELECT * FROM restbucks_order");
		for (Row row : results) {

			System.out.format("%s %s", row.getString("status"), row.getString("location"));

			}
	}*/
}
