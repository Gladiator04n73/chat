class AddUserDetailsToUsers < ActiveRecord::Migration[7.2]
  def change
    add_column :users, :description, :text
    add_column :users, :gender, :string, default: ""
  end
end
