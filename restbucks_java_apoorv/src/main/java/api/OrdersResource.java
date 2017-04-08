package api ;

import org.json.* ;
import org.restlet.representation.* ;
import org.restlet.ext.json.* ;
import org.restlet.resource.* ;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.restlet.ext.jackson.* ;

import java.awt.List;
import java.io.IOException ;
import java.util.ArrayList;
import java.util.Collection ;

public class OrdersResource extends ServerResource {

    @Get
    public Representation get_action (Representation rep) throws IOException { // get all orders for this store
        ArrayList<Order> orders = new ArrayList<Order>(RestbucksAPI.getOrders());
        Collection<JSONObject> jsonorders = new ArrayList<>();
      
       for (int i = 0; i < orders.size(); i++) {  // **line 2**
             JSONObject individual_order = new JSONObject(new ObjectMapper().writeValueAsString(orders.get(i)));
             jsonorders.add(individual_order);
             
       }
        
  
        
        JSONObject json = new JSONObject();
        json.put("status", "200");
        json.put("orders",jsonorders);
        		//json.put("order", new JSONObject(new ObjectMapper().writeValueAsString(existing_order)));
        
        
        Representation resp = new JsonRepresentation(json);
        return resp ; //send response to client
        
        
       // return new JacksonRepresentation<Collection<Order>>(orders) ;           
    }


}


