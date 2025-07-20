class CreateSubscriptions < ActiveRecord::Migration[7.2]
  def change
    create_table :subscriptions do |t|
      t.integer :subscriber_id
      t.integer :author_id

      t.timestamps
    end
  end
end
