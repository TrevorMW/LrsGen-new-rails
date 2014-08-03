class CreateHotels < ActiveRecord::Migration
  def change
    create_table :hotels do |t|

      t.string      :hotel_name
      t.text        :hotel_street
      t.string      :hotel_city, default:"Charleston"
      t.string      :hotel_state, default:"SC"
      t.integer     :hotel_zip
      t.string      :hotel_phone
      t.string      :hotel_email
      t.float       :hotel_lat
      t.float       :hotel_lng
      t.string      :hotel_img_url
      t.boolean     :hotel_pets, default: false
      t.boolean     :hotel_smoking, default: false
      t.boolean     :hotel_parking, default:false
      t.decimal     :hotel_pet_fee, precision:4, scale:2
      t.decimal     :hotel_smoking_fee, precision:4, scale:2
      t.string      :hotel_type
      t.decimal     :hotel_parking_fee, precision:4, scale:2
      t.decimal     :hotel_current_rate, precision:6, scale:2
      t.string      :hotel_concierge

      t.timestamps
    end
  end
end
