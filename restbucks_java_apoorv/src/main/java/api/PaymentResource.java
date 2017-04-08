package api ;

import org.json.* ;
import org.restlet.representation.* ;
import org.restlet.ext.json.* ;
import org.restlet.resource.* ;
import org.restlet.ext.jackson.* ;

import java.io.IOException ;

public class PaymentResource extends ServerResource {

    @Post
    public Representation post_action (Representation rep) throws IOException { // Mark the order as paid

        String order_id = getAttribute("order_id") ;
        Order order = RestbucksAPI.getOrder( order_id ) ;
        
        if ( order == null ) { //exception handling
            setStatus( org.restlet.data.Status.CLIENT_ERROR_NOT_FOUND ) ;
            api.Status api = new api.Status() ; 
            api.status = "404" ;
            api.message = "Order Not Found" ;
            return new JacksonRepresentation<api.Status>(api) ;
        }
        if ( order != null && order.status != RestbucksAPI.OrderStatus.PLACED ) { // Payment cannot be done as it has already been paid for
            setStatus( org.restlet.data.Status.CLIENT_ERROR_PRECONDITION_FAILED ) ;
            api.Status api = new api.Status() ;
            api.status = "404" ;
            api.message = "Order Payment Rejected! Order already paid for" ;
            return new JacksonRepresentation<api.Status>(api) ;
        }
        else { // Mark the order as paid
            order.order_id = order_id ;
            RestbucksAPI.setOrderStatus( order, getReference().toString(), RestbucksAPI.OrderStatus.PAID ) ;
            RestbucksAPI.updateOrder( order.order_id, order ) ; 
            JSONObject json = new JSONObject();
            json.put("status", "200");
            json.put("order_id", order.getOrder_id());
            Representation resp = new JsonRepresentation(json);
            return resp ; //send response to client
           // return new JacksonRepresentation<Order>(order) ;           
        }

    }


}


