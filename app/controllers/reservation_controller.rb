class ReservationController < ApplicationController

  helper ReservationHelper


  def new
    @hotel = Hotel.find( params[:hotel_id] )
    @reservation = Reservation.new

  end



  private

  def reservation_params
    params.require(:reservation).permit(
       :rsrv_hotel_id,
       :rsrv_creator_id,
       :rsrv_guest_name,
       :rsrv_guest_street,
       :rsrv_guest_city,
       :rsrv_guest_state,
       :rsrv_guest_country,
       :rsrv_guest_zip,
       :rsrv_guest_phone,
       :rsrv_guest_email,
       :rsrv_guest_cc_stub,
       :rsrv_guest_cc_exp,
       :rsrv_num_nights,
       :rsrv_num_rooms,
       :rsrv_num_occupants,
       :rsrv_room_type,
       :rsrv_smoking,
       :rsrv_pets,
       :rsrv_hotel_pet_fee,
       :rsrv_hotel_smoking_fee,
       :rsrv_hotel_parking_fee,
       :rsrv_extra_fees,
       :rsrv_subtotal,
       :rsrv_hotel_concierge,
    )

  end

end
