package api;


import java.util.UUID ;

import com.datastax.driver.core.*;
import com.datastax.driver.core.Session;





public class ConnectionUtil {
	public String order_id = UUID.randomUUID().toString() ;
	
	public static void main(String[] args) {

		 
		// Connect to the cluster and keyspace "library"
	   
		Cluster cluster = Cluster.builder().addContactPoint("localhost").build();
	   
		Session session = cluster.connect("restbucks");
		
		
		session.execute("INSERT INTO restbucks_order (order_id,amount,location,items,status,message) VALUES (e7ae5cf3-d358-4d99-b900-85902fda9bb0, 5, 'San Jose', [{qty:2,name:'mocha',milk_type:'whole',size:'small',price:2.5}], 'PLACED','order is in process');");
		ResultSet results = session.execute("SELECT * FROM restbucks_order");
		for (Row row : results) {

			System.out.format("%s %s", row.getString("status"), row.getString("amount"));

			}
	}
}
