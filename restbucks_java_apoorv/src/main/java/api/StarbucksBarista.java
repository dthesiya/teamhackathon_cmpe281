
package api ;

import java.util.concurrent.BlockingQueue;

public class RestbucksBarista implements Runnable {

	protected BlockingQueue<String> blockingQueue ;

	public RestbucksBarista(BlockingQueue<String> queue) {
		this.blockingQueue = queue;
	}

	@Override
	public void run() {
		while (true) {
			try {
				try { Thread.sleep(5000); } catch ( Exception e ) {}  
				String order_id = blockingQueue.take();
				Order order = RestbucksAPI.getOrder( order_id ) ;
        		if ( order != null && order.status == RestbucksAPI.OrderStatus.PAID ) {
					System.out.println(Thread.currentThread().getName() + " Processed Order: " + order_id );
					RestbucksAPI.setOrderStatus( order, RestbucksAPI.OrderStatus.PREPARING ) ;
					try { Thread.sleep(20000); } catch ( Exception e ) {}  
					RestbucksAPI.setOrderStatus( order, RestbucksAPI.OrderStatus.SERVED ) ;					
					try { Thread.sleep(10000); } catch ( Exception e ) {}  
					RestbucksAPI.setOrderStatus( order, RestbucksAPI.OrderStatus.COLLECTED ) ;				
				}
				else {
					blockingQueue.put( order_id ) ;
				}
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
	}

}