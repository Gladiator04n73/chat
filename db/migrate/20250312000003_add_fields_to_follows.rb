class AddFieldsToFollows < ActiveRecord::Migration[7.2]
  def change
    add_reference :follows, :follower, null: false, foreign_key: { to_table: :users }
    add_reference :follows, :followed, null: false, foreign_key: { to_table: :users }
  end
end
