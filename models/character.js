module.exports = function(sequelize, DataTypes) {
  var Character = sequelize.define("Character", {
    // The email cannot be null, and must be a proper email before creation

    character_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [1, 40],
      },
    },
    // The password cannot be null
    character_pic_filename: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  Character.associate = (models) => {
    Character.belongsTo(models.Student);
  }
  return Character;
};
