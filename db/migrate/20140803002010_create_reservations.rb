class CreateReservations < ActiveRecord::Migration
  def change
    create_table :reservations do |t|

      t.integer   :rsrv_hotel_id
      t.string    :rsrv_creator_id
      t.string    :rsrv_guest_name
      t.string    :rsrv_guest_street
      t.string    :rsrv_guest_city
      t.string    :rsrv_guest_state
      t.string    :rsrv_guest_country, default: "USA"
      t.string    :rsrv_guest_zip
      t.string    :rsrv_guest_phone
      t.string    :rsrv_guest_email
      t.integer   :rsrv_guest_cc_stub
      t.string    :rsrv_guest_cc_exp
      t.integer   :rsrv_num_nights
      t.integer   :rsrv_num_rooms
      t.integer   :rsrv_num_occupants
      t.string    :rsrv_room_type
      t.boolean   :rsrv_smoking, default:false
      t.boolean   :rsrv_pets, default:false
      t.integer   :rsrv_hotel_pet_fee, default:0, precision:4, scale:2
      t.integer   :rsrv_hotel_smoking_fee, default:0, precision:4, scale:2
      t.integer   :rsrv_hotel_parking_fee, default:0, precision:4, scale:2
      t.integer   :rsrv_extra_fees, default:0, precision:5, scale:2
      t.integer   :rsrv_subtotal
      t.string    :rsrv_hotel_concierge

      t.timestamps
    end
  end
end
