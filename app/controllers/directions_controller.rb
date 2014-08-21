class DirectionsController < ApplicationController

  def index
    h = Hotel.find( params[:hotel_id] )
    @hotel = h
    @coords = Hotel.hotelJsonCoords(h)
    @address = "#{ h.hotel_street } #{h.hotel_city}, #{ h.hotel_state } #{ h.hotel_zip} "
  end



end
