class Hotel < ActiveRecord::Base

  def self.get_hotel_categories
    @hotelCats = Hotel.select(:hotel_type).uniq.order(:hotel_type)
  end

  def self.checkHotel( hotel_name )
    return Hotel.where("hotel_name = :hotel", {:hotel => hotel_name } ).count
  end

  def self.hotelJsonCoords( hotel )
    return { :lat => hotel.hotel_lat, :lng => hotel.hotel_lng }.to_json
  end

end
