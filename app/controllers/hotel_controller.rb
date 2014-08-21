class HotelController < ApplicationController

  helper HotelHelper


  # SHOW ALL HOTELS ON DASHBOARD
  def index
    @hotels = Hotel.all().order(:hotel_name)

  end


  # SHOW INDIVIDUAL HOTEL PAGE
  def show
    h = Hotel.find( params[:id] )
    @hotel = h
    @coords = Hotel.hotelJsonCoords( h )
  end


  # FORM PAGE TO CREATE NEW HOTEL
  def new
    @hotel = Hotel.new
    @hotelCats = Hotel.get_hotel_categories

  end


  # CREATE METHOD
  def create
    h = Hotel.create( hotel_params )
    if h.save
      flash[:success] = "#{h.hotel_name} was created successfully!";
      redirect_to action: :index
    else
      flash[:error] = "Your hotel could not be created!";
      redirect_to action: :new
    end
  end


  # EDIT HOTEL
  def edit
    h = Hotel.find( request.params[:id] )
    @hotel = h
    @coords = { :lat => h.hotel_lat, :lng => h.hotel_lng }.to_json

  end


  def update
    h = Hotel.find( params[:id] )
    if( h.update( hotel_params ) )
      flash[:success] = "#{h.hotel_name} sucessfully updated"
      redirect_to action: :index
    else
      flash[:danger] = "Update unsuccessful"
      redirect_to action: :edit
    end
  end


  # DESTROY METHOD
  def destroy
    id = request.params[:id]
    h = Hotel.find(id).destroy
		flash[:warning] = "Client #{ id } was successfully deleted."
		redirect_to action: :index
  end


  # CHECK TO SEE IF HOTEL NAME EXISTS
  def checkHotel
    h = Hotel.checkHotel( params[:hotel] )
    if h != 0
      render :nothing => true, :status => 409
    else
      render :nothing => true, :status => 200
    end
    return
  end


  private

  def hotel_params
      params.require(:hotel).permit(:hotel_name,:hotel_street,:hotel_city,:hotel_state,:hotel_zip,:hotel_phone,
                                    :hotel_email,:hotel_lat,:hotel_lng,:hotel_img_url,:hotel_pets,
                                    :hotel_pet_fee,:hotel_smoking,:hotel_smoking_fee,:hotel_type,
                                    :hotel_region,:hotel_parking_fee )
  end

end
