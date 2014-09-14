class RatesController < ApplicationController

  def index
    @hotels = Hotel.all()

  end


  def show


  end


  def saveCells
    h = Rates.saveCells( request.params )
    if h == 0
      render :nothing => true, :status => 409
    else
      render json: h, :status => 200
    end
  end

end
