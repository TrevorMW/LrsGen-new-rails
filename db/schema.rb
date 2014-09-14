# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140913235821) do

  create_table "hotels", force: true do |t|
    t.string   "hotel_name"
    t.text     "hotel_street"
    t.string   "hotel_city",                                           default: "Charleston"
    t.string   "hotel_state",                                          default: "SC"
    t.integer  "hotel_zip"
    t.string   "hotel_phone"
    t.string   "hotel_email"
    t.float    "hotel_lat"
    t.float    "hotel_lng"
    t.string   "hotel_img_url"
    t.boolean  "hotel_pets",                                           default: false
    t.boolean  "hotel_smoking",                                        default: false
    t.boolean  "hotel_parking",                                        default: false
    t.decimal  "hotel_pet_fee",                precision: 4, scale: 2
    t.decimal  "hotel_smoking_fee",            precision: 4, scale: 2
    t.string   "hotel_type"
    t.decimal  "hotel_parking_fee",            precision: 4, scale: 2
    t.string   "hotel_current_rate", limit: 6
    t.string   "hotel_concierge"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "hotel_booked"
  end

  create_table "rates", force: true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "reports", force: true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "reservations", force: true do |t|
    t.integer  "rsrv_hotel_id"
    t.string   "rsrv_creator_id"
    t.string   "rsrv_guest_name"
    t.string   "rsrv_guest_street"
    t.string   "rsrv_guest_city"
    t.string   "rsrv_guest_state"
    t.string   "rsrv_guest_country",     default: "USA"
    t.string   "rsrv_guest_zip"
    t.string   "rsrv_guest_phone"
    t.string   "rsrv_guest_email"
    t.integer  "rsrv_guest_cc_stub"
    t.string   "rsrv_guest_cc_exp"
    t.integer  "rsrv_num_nights"
    t.integer  "rsrv_num_rooms"
    t.integer  "rsrv_num_occupants"
    t.string   "rsrv_room_type"
    t.boolean  "rsrv_smoking",           default: false
    t.boolean  "rsrv_pets",              default: false
    t.integer  "rsrv_hotel_pet_fee",     default: 0
    t.integer  "rsrv_hotel_smoking_fee", default: 0
    t.integer  "rsrv_hotel_parking_fee", default: 0
    t.integer  "rsrv_extra_fees",        default: 0
    t.integer  "rsrv_subtotal"
    t.string   "rsrv_hotel_concierge"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", force: true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
