package api;


import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID ;

import com.datastax.driver.core.*;
import com.datastax.driver.core.Session;





public class ConnectionUtil {
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

		this.cluster = Cluster.builder().addContactPoint("localhost").build();
		   
		this.session = cluster.connect("restbucks");
		
		 
	     
	     insertorderPstmt = session.prepare(ORDER_DATA_INSERT_STMT);
	     selectallorderStmt = session.prepare(ORDER_DATA_SELECT_STMT);
	     updateorderStmt = session.prepare(ORDER_DATA_UPDATE_STMT);
	     deleteorderStmt = session.prepare(ORDER_DATA_DELETE_STMT);
	     selectorderbyidStmt = session.prepare(ORDER_DATA_SELECT_ORDER_BY_ID_STMT);
	 
 }
	
	public void insertValues() {
		System.out.println("Inserting");
		
		
		
        session.execute(insertorderPstmt.bind(UUID.randomUUID(),new BigDecimal("4"),"Santa Clara","[{qty:2,name:'mocha',milk_type:'whole',size:'small',price:2.5}]","PLACED","in process"));
        System.out.println("Succesfully inserted the data in cassandra table");
 }
	
	public void retriveValues() {
        try {
               ResultSet rs = session.execute(selectallorderStmt.bind());
               if(rs != null) {
                     List<Row> rows =rs.all();
                     if(rows != null) {
                            for(Row row : rows) {
                            	System.out.println("Printing all rows");
                                   System.out.println(row);
                            }
                     }
               }
        } catch(Exception e) {
               System.out.println("Exception in select Stament"+e.getMessage());
        }
 }
	
	public void retriveValue(UUID uid) {
        try {
        	  
               ResultSet rs = session.execute(selectorderbyidStmt.bind(uid));
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
               System.out.println("Exception in select Stament"+e.getMessage());
        }
 }
	public void removeValue(UUID uid) {
        try {
        	  
               ResultSet rs = session.execute(deleteorderStmt.bind(uid));
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
	
	public void updateValue(UUID uid, BigDecimal amount, String location,UDTValue item, String status, String message ) {
        try {
        	List<UDTValue> orders = new ArrayList<>();
    		orders.add(item);
        	  
               ResultSet rs = session.execute(updateorderStmt.bind( amount, location, orders, status, message,uid));
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
     
	
     
     
     
     
	
	public static void main(String[] args) {
System.out.println("In main method");
		String order_id = UUID.randomUUID().toString() ;
		
		
		ConnectionUtil cu = new ConnectionUtil();
		
		
		
		//cu.retriveValues();
		//cu.retriveValue(UUID.fromString("e7ae5cf3-d358-4d99-b900-85902fda9bb0"));
		//cu.insertValues();
		UserType oderItemType = cu.cluster.getMetadata().getKeyspace(cu.session.getLoggedKeyspace()).getUserType("order_items");
		
		
		UDTValue orderItem = oderItemType.newValue()
		        .setInt("qty", 2)
		        .setString("name", "mocha")
		        .setString("milk_type", "whole")
		        .setString("size", "small")
		        .setDecimal("price", new BigDecimal(2.5));
		
		List<UDTValue> orders = new ArrayList<>();
		orders.add(orderItem);
		// Connect to the cluster and keyspace "library"
	   
		//PreparedStatement insertorderPstmt = cu.session.prepare("insert into restbucks.restbucks_order(order_id,amount,location,items,status,message) values(?, ?, ?, ?, ?, ?)");
		//cu.session.execute(insertorderPstmt.bind(UUID.randomUUID(), new BigDecimal("4"), "Santa Clara", orders, "PLACED", "in process"));
		//cu.retriveValues();
		//System.out.println("Deleting values");
		//cu.removeValue(UUID.fromString("3da49db9-aea2-4fd7-b39e-5dc68c7499a9"));
		//cu.retriveValues();
		
		
		cu.updateValue(UUID.fromString("e7ae5cf3-d358-4d99-b900-85902fda9bb0"),new BigDecimal("3"),"San Jose improve 3rd st", orderItem, "Updated","in process");
		System.out.println("after update");
	
		
		//e7ae5cf3-d358-4d99-b900-85902fda9bb0 
		
		//session.execute(ORDER_DATA_SELECT_STMT)
		
		//session.execute("INSERT INTO restbucks_order (order_id,amount,location,items,status,message) VALUES (e7ae5cf3-d358-4d99-b900-85902fda9bb0, 5, 'San Jose', [{qty:2,name:'mocha',milk_type:'whole',size:'small',price:2.5}], 'PLACED','order is in process');");
		/*ResultSet results = session.execute("SELECT * FROM restbucks_order");
		for (Row row : results) {

			System.out.format("%s %s", row.getString("status"), row.getString("location"));

			}*/
	}
}
