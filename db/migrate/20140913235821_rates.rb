class Rates < ActiveRecord::Migration
  def change
    add_column :hotels, :hotel_booked, :boolean
    change_column :hotels, :hotel_current_rate, :string

  end
end
