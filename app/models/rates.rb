class Rates < ActiveRecord::Base

  def self.saveCells( params )
    h = Hotel.find( params[:id] )
    h.hotel_booked = params[:hotel_booked]
    h.hotel_concierge = params[:hotel_concierge]
    h.hotel_current_rate = params[:hotel_rates]
    h.save()
    return h.new_record?
  end


end
