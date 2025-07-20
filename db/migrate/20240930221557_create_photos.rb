class CreatePhotos < ActiveRecord::Migration[7.2]
  def change
    create_table :photos do |t|
      t.references :user, null: false, foreign_key: true
      t.text :image_path

      t.timestamps
    end
  end
end
