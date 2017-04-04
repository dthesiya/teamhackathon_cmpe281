package api;


import java.math.BigDecimal;
import java.util.List;
import java.util.UUID ;

import com.datastax.driver.core.*;
import com.datastax.driver.core.Session;





public class ConnectionUtil {
	Session session = null;
	
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

		Cluster cluster = Cluster.builder().addContactPoint("localhost").build();
		   
		session = cluster.connect("restbucks");
		
		 
	     
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
	
     
     
	
     
     
     
     
	
	public static void main(String[] args) {

		String order_id = UUID.randomUUID().toString() ;
		
		
		ConnectionUtil cu = new ConnectionUtil();
		
		//cu.retriveValues();
		//cu.retriveValue(UUID.fromString("e7ae5cf3-d358-4d99-b900-85902fda9bb0"));
		//cu.insertValues();
		
		// Connect to the cluster and keyspace "library"
	   
		
		//e7ae5cf3-d358-4d99-b900-85902fda9bb0 
		
		//session.execute(ORDER_DATA_SELECT_STMT)
		
		//session.execute("INSERT INTO restbucks_order (order_id,amount,location,items,status,message) VALUES (e7ae5cf3-d358-4d99-b900-85902fda9bb0, 5, 'San Jose', [{qty:2,name:'mocha',milk_type:'whole',size:'small',price:2.5}], 'PLACED','order is in process');");
		/*ResultSet results = session.execute("SELECT * FROM restbucks_order");
		for (Row row : results) {

			System.out.format("%s %s", row.getString("status"), row.getString("location"));

			}*/
	}
}
