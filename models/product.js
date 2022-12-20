//Article 테이블을 모델링하는 파일
module.exports = function (sequelize, DataTypes) {
  const product = sequelize.define("Product", {
    name: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER(10),
      allowNull: false
    },
    imageUrl: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    seller: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
    soldout: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: 0
    }
  });
  return product;
};
