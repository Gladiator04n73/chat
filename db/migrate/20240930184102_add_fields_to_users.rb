class AddFieldsToUsers < ActiveRecord::Migration[7.2]
  def change
    add_column :users, :nickname, :string, null: false, default: ""
    add_index :users, :nickname, unique: true
  end
end
