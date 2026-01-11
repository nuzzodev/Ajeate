class UsersController < ApplicationController
  #/users
  def index
    @users = User.all
    render json:@users
  end
  #/users/:id
  def show
    @user = User.find(params[:id])
    render json:@user
  end

  #/users
  def create
    @user = User.new(user_params)
    if @user.save
      render json:@user, status: :created
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def login
    @user = User.find_by(name: params[:name])


    if @user && @user.authenticate(params[:password])
      render json: @user, status: :ok
    else
      render json: { error: "Credenciales inválidas" }, status: :unauthorized
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :level, :password)
  end
end