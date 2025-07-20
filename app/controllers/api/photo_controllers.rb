class PhotoControllers < ApplicationController
  # GET /api/photos/:id/comments
  def comments
    photo = Photo.find(params[:id])
    render json: photo.comments
  end
end
