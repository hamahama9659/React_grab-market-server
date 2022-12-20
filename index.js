const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8080;
const models = require("./models");
const multer = require("multer");
const upload = multer({
  storage: multer.diskStorage({
    // 업로드된 파일의 경로
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    // 파일이름을 원본 이름으로 처리
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  })
});

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.get("/banners", (req, res) => {
  models.Banner.findAll({
    limit: 2
  })
    .then(result => {
      res.send({
        banners: result
      });
    })
    .catch(error => {
      console.error(error);
      res.status(400).end("에러가 발생했습니다.");
    });
});

app.get("/products", (req, res) => {
  models.Product.findAll({
    order: [["createdAt", "DESC"]],
    attributes: [
      "id",
      "name",
      "price",
      "createdAt",
      "seller",
      "imageUrl",
      "soldout"
    ]
  })
    .then(result => {
      console.log("PRODUCTS : ", result);
      res.send({
        products: result
      });
    })
    .catch(error => {
      console.error(error);
      res.status(400).end("에러 발생");
    });
});

app.post("/products", (req, res) => {
  const body = req.body;
  const { name, price, description, seller, imageUrl } = body;
  if (!name || !price || !description || !seller || !imageUrl) {
    res.status(400).send("모든 필드를 입력해주세요");
  }
  models.Product.create({
    name,
    price,
    description,
    seller,
    imageUrl
  })
    .then(result => {
      console.log("상품 생성 결과 : ", result);
      res.send({
        result
      });
    })
    .catch(error => {
      console.error(error);
      res.status(400).end("상품 업로드에 문제가 생겼습니다.");
    });
});

app.get("/products/:id", (req, res) => {
  const params = req.params;
  const { id } = params;
  models.Product.findOne({
    where: {
      id: id
    }
  })
    .then(result => {
      console.log("PRODUCT : ", result);
      res.send({
        product: result
      });
    })
    .catch(error => {
      console.error(error);
      res.status(400).end("상품 조회에 오류가 발생했습니다.");
    });
});

//upload.single() : 파일이 1개 일때 쓰는 매소드
//그럼 2개는???
app.post("/image", upload.single("image"), (req, res) => {
  const file = req.file;
  console.log("file 정보 :: ", file);
  res.send({
    //파일경로 지정
    imageUrl: file.path
  });
});

app.post("/purchase/:id", (req, res) => {
  const { id } = req.params;
  models.Product.update(
    {
      soldout: 1
    },
    {
      where: {
        id
      }
    }
  )
    .then(reulst => {
      res.send({
        result: true
      });
    })
    .catch(error => {
      console.error(error);
      res.status(500).send("에러가 발생했습니다.");
    });
});

app.listen(port, () => {
  console.log("그랩 마켓의 서버가 돌아가고 있습니다.");
  models.sequelize
    .sync()
    .then(() => {
      console.log("✓ DB 연결 성공");
    })
    .catch(function (err) {
      console.error(err);
      console.log("✗ DB 연결 에러");
      process.exit();
    });
});
