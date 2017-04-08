package api ;

import org.json.* ;
import org.restlet.representation.* ;
import org.restlet.ext.json.* ;
import org.restlet.resource.* ;
import org.restlet.ext.jackson.* ;
import org.restlet.data.Tag ;
import org.restlet.data.Form ;
import org.restlet.data.Header ;
import org.restlet.data.Digest ;
import org.restlet.util.Series ;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import jdk.nashorn.internal.parser.JSONParser;

import org.restlet.ext.crypto.DigestUtils ;
import java.io.IOException ;
import java.util.List;

public class OrderResource extends ServerResource {

    @Get
    public Representation get_action() throws JSONException {  // GET API to retrive a particular order
    	
    	System.out.println("Resource Get request called");

        //caching to check if the request has updated
        Series<Header> headers = (Series<Header>) getRequest().getAttributes().get("org.restlet.http.headers");
        if ( headers != null ) {
            String etag = headers.getFirstValue("If-None-Match") ;  //store the etag as first value of header
            System.out.println( "HEADERS: " + headers.getNames() ) ;
            System.out.println( "ETAG: " + etag ) ;            
        }
        

        String order_id = getAttribute("order_id") ;  // get the order id from URL 
       /* Order order = RestbucksAPI.getOrder( order_id ) ;  // get the individual order for the above order id.*/ 

        if ( order_id == null || order_id.equals("") ) {        //client sent invalid order id on the GET call

            setStatus( org.restlet.data.Status.CLIENT_ERROR_NOT_FOUND ) ;
            api.Status api = new api.Status() ;
            api.status = "error" ;
            api.message = "Order not found." ;

            return new JacksonRepresentation<api.Status>(api) ;   // send response with the order not found error
        }
        else {
        	System.out.println("retriving order for get method");
            Order existing_order = RestbucksAPI.getOrder( order_id ) ; //get the individual order for the given order id.
            if ( order_id == null || order_id.equals("")  || existing_order == null ) {   // exception handling
                setStatus( org.restlet.data.Status.CLIENT_ERROR_NOT_FOUND ) ;
                api.Status api = new api.Status() ;
                api.status = "error" ;
                api.message = "Order not found." ;
                return new JacksonRepresentation<api.Status>(api) ;
            }                
            else {
                Representation result = new JacksonRepresentation<Order>(existing_order) ;  // create a respresentation for order response
                try { 
                    System.out.println( "Get Text: " + result.getText() ) ;  //pring order as text on server console
                    String  hash = DigestUtils.toMd5 ( result.getText() ) ;  // generate hash for etagging
                    System.out.println( "Get Hash: " + hash ) ; //print hash
                    result.setTag( new Tag( hash ) ) ; // set the etag for this request to cache for future requests
                    JSONObject json = new JSONObject();
                    json.put("status", "200");
                    json.put("order", new JSONObject(new ObjectMapper().writeValueAsString(existing_order)));
                    Representation resp = new JsonRepresentation(json);
                    return resp ; //send response to client
                    
                    //return result ;  //send response to client
                }
                catch ( IOException e ) {  //exception handling
                    setStatus( org.restlet.data.Status.SERVER_ERROR_INTERNAL ) ;
                    api.Status api = new api.Status() ;
                    api.status = "400" ;
                    api.message = "Server Error, Try Again Later." ;
                    return new JacksonRepresentation<api.Status>(api) ;
                }
            }
        }
    }


    @Post
    public Representation post_action (Representation rep) throws IOException {  // POST API to place an order

        JacksonRepresentation<Order> orderRep = new JacksonRepresentation<Order> ( rep, Order.class ) ;  // create order respresentation, map the given details or order in "rep" to a POJO of Order class. 

        Order order = orderRep.getObject() ; // get the pojo from above representation
        ObjectMapper mapper = new ObjectMapper();
        order.setItems(mapper.convertValue(order.getItems(), new TypeReference<List<OrderItem>>() {}));
        RestbucksAPI.setOrderStatus( order, getReference().toString(), RestbucksAPI.OrderStatus.PLACED ) ; // Set the order as Placed by default once client sends the request
       

        Representation result = new JacksonRepresentation<Order>(order) ; // creating a response representation to client
        try { 
        	 RestbucksAPI.placeOrder( order.order_id, order ) ;  // Process the order and store in database
                System.out.println( "Text: " + result.getText() ) ; 
                System.out.println("done");
                String  hash = DigestUtils.toMd5 ( result.getText() ) ;
                result.setTag( new Tag( hash ) ) ; //tagging the response for future caching
                System.out.println("success");
                JSONObject json = new JSONObject();
                json.put("status", "200");
                json.put("order_id", order.getOrder_id());
                Representation resp = new JsonRepresentation(json);
                return resp ; //send response to client
        }
        catch ( Exception e ) { // exception handling
               // setStatus( org.restlet.data.Status.SERVER_ERROR_INTERNAL ) ;
                System.out.println("In catch of order resource post");
                api.RestbucksError myerror = new RestbucksError();
                myerror.setErr("Sorry could not place order");
                myerror.setStatus("404");
               /* api.Status api = new api.Status() ;
                api.status = "error" ;
                api.message = "Server Error, Try Again Later." ;
                System.out.println("error");*/
                return new JacksonRepresentation<api.RestbucksError>(myerror) ;
        }
    }


   @Put
    public Representation put_action (Representation rep) throws IOException { // API to update order if it is still in PLACED state

        JacksonRepresentation<Order> orderRep = new JacksonRepresentation<Order> ( rep, Order.class ) ; // Represenation to store details sent by the client
        Order order = orderRep.getObject() ;  
        ObjectMapper mapper = new ObjectMapper();
        order.setItems(mapper.convertValue(order.getItems(), new TypeReference<List<OrderItem>>() {}));
        String order_id = getAttribute("order_id") ; // retrive orderid from the request
       System.out.println("Retriving order for put method");
        Order existing_order = RestbucksAPI.getOrder( order_id ) ;

        if ( order_id == null || order_id.equals("")  || existing_order == null ) {  //exception handling

            setStatus( org.restlet.data.Status.CLIENT_ERROR_NOT_FOUND ) ;
            api.Status api = new api.Status() ;
            api.status = "404" ;
            api.message = "Order not found." ;

            return new JacksonRepresentation<api.Status>(api) ;

        }                
        else if ( existing_order != null && existing_order.status != RestbucksAPI.OrderStatus.PLACED ) { // order is already in one of PAID, PREPARED or SERVED states, hence reject the update request

            setStatus( org.restlet.data.Status.CLIENT_ERROR_PRECONDITION_FAILED ) ; 
            api.Status api = new api.Status() ;
            api.status = "404" ;
            api.message = "Order Update Rejected." ;

            return new JacksonRepresentation<api.Status>(api) ;
        }
        else {
            // Order is still in placed status, we can safely update it

            RestbucksAPI.setOrderStatus( order, getReference().toString(), RestbucksAPI.OrderStatus.PLACED ) ;
            order.order_id = existing_order.order_id ;
            RestbucksAPI.updateOrder( order.order_id, order ) ;  // call the update order method and update details in database
            Representation result = new JacksonRepresentation<Order>(order) ; // representation object for response
            try { 
                    System.out.println( "Text: " + result.getText() ) ; //caching  using etags
                    String  hash = DigestUtils.toMd5 ( result.getText() ) ;
                    result.setTag( new Tag( hash ) ) ;
                    JSONObject json = new JSONObject();
                    json.put("status", "200");
                    json.put("order_id", order.getOrder_id());
                    Representation resp = new JsonRepresentation(json);
                    return resp ; //send response to client
                    
                  //  return result ;
            }
            catch ( IOException e ) { // exception handling
                    setStatus( org.restlet.data.Status.SERVER_ERROR_INTERNAL ) ;
                    api.Status api = new api.Status() ;
                    api.status = "404" ;
                    api.message = "Server Error, Try Again Later." ;
                    return new JacksonRepresentation<api.Status>(api) ;
            }
        }
    }

    @Delete
    public Representation delete_action (Representation rep) throws IOException { // API to Cancel the order

        String order_id = getAttribute("order_id") ; // get the order id from request.
        System.out.println("Retriving order for Delete API");
        Order existing_order = RestbucksAPI.getOrder( order_id ) ; // retrive order if it exists
        
        if ( order_id == null || order_id.equals("")  || existing_order == null ) { // exception handling

            setStatus( org.restlet.data.Status.CLIENT_ERROR_NOT_FOUND ) ;
            api.Status api = new api.Status() ;
            api.status = "404" ;
            api.message = "Order not found." ;

            return new JacksonRepresentation<api.Status>(api) ;

        }        
        else if ( existing_order.status != RestbucksAPI.OrderStatus.PLACED ) {  // if the order status is not PLACED, it cannot be cancelled

            setStatus( org.restlet.data.Status.CLIENT_ERROR_PRECONDITION_FAILED ) ;
            api.Status api = new api.Status() ;
            api.status = "404" ;
            api.message = "Order Cancelling Rejected." ;

            return new JacksonRepresentation<api.Status>(api) ;
        }
        else {

            RestbucksAPI.removeOrder( order_id ) ; // cancel the order
            JSONObject json = new JSONObject();
            json.put("status", "200");
            json.put("order_id", existing_order.getOrder_id());
            Representation resp = new JsonRepresentation(json);
            return resp ; //send response to client;    
        }

    }

}



