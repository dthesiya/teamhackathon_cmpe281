package api ;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
class OrderItem {

     public int qty ;  // How many coffees of this particular type
    public String name ;  // Coffee type - Latte, mocha, etc
    public String milk_type ;  // soy, whole, semi
    public String size ;  // small, medium, large
    public Double price;  // cost of the coffee
	public int getQty() {
		return qty;
	}
	public void setQty(int qty) {
		this.qty = qty;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getMilk_type() {
		return milk_type;
	}
	public void setMilk_type(String milk_type) {
		this.milk_type = milk_type;
	}
	public String getSize() {
		return size;
	}
	public void setSize(String size) {
		this.size = size;
	}
	public Double getPrice() {
		return price;
	}
	public void setPrice(Double price) {
		this.price = price;
	}

}