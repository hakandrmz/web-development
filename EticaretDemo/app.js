require("dotenv/config");
const express = require("express");
const bodyParser = require("body-parser");
var mongoose = require("mongoose");
const app = express();
var Schema = mongoose.Schema;
var fs = require("fs");
var path = require("path");
var multer = require("multer");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(bodyParser.json());
/* const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate"); */   /*  Hesap işlemlerinde kullanacağım */


mongoose.connect("mongodb://localhost:27017/Eticaret", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const itemSchema = {
  urunAdi: String,
  urunFiyati: Number,
  urunAciklamasi: String,
  urunKategorisi: String,
  urunResmi: {
    data: Buffer,
    contentType: String,
  },
};
const sepetSchema = {
  urunId: String,
  urunAd: String,
  urunFiyati: Number,
  urunAciklama: String,
  urunKategorisi: String,
  urunResmi: {
    data: Buffer,
    contentType: String,
  },
};
const userSchema = ({
  email: String,
  password: String,
});
/* const siparisSchema = {
  alttoplam: Number,
  vergi: Number,
  kargo: Number,
  toplamfiyat: Number,
}; */
const yoneticiSchema = {
  email: String,
  password: String,
};

const Item = mongoose.model("Item", itemSchema);
const Sepet = mongoose.model("Sepet", sepetSchema);
const User = mongoose.model("User", userSchema);
const Yonetici = mongoose.model("Yonetici", yoneticiSchema);

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

var upload = multer({ storage: storage });

app.post("/sepeteekle", function (req, res) {
  const selectedItem = new Sepet({
    urunId: req.body.itemId,
    urunAd: req.body.itemAd,
    urunAciklama: req.body.itemAciklama,
    urunFiyati: req.body.itemFiyati,
  });
  Sepet.create(selectedItem, (err, item) => {
    if (err) {
      console.log(err);
    } else {
      // item.save();
      res.redirect("/");
    }
  });
});

app.post("/sepettenkaldir", function (req, res) {
  console.log(req.body.itemId);
  Sepet.findByIdAndDelete(req.body.itemId, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/sepet");
    }
  });
});

app.post("/urunekle", upload.single("image"), function (req, res) {
  const item = {
    urunAdi: req.body.urunadi,
    urunFiyati: req.body.urunfiyati,
    urunAciklamasi: req.body.urunaciklamasi,
    urunKategorisi: req.body.kategori,
    urunResmi: {
      data: fs.readFileSync(
        path.join(__dirname + "/uploads/" + req.file.filename)
      ),
      contentType: "image/png",
    },
  };
  Item.create(item, (err, item) => {
    if (err) {
      console.log(err);
    } else {
      // item.save();
      res.redirect("/");
    }
  });
});

app.get("/", function (req, res) {
  Item.find({}, function (err, items) {
    res.render("home", {
      items: items,
    });
  });
});

app.get("/home", function (req, res) {
  Item.find({}, function (err, items) {
    res.render("home", {
      items: items,
    });
  });
});

app.post("/odemeyegec", function (req, res) {
  var siparis = {
    alttoplam: req.body.subtotal,
    vergi: req.body.tax,
    kargo: req.body.shipping,
    toplamfiyat: req.body.total,
  };

  console.log(req.body.subtotal);
  console.log(req.body.tax);
  console.log(req.body.shipping);
  console.log(siparis.alttoplam);

  var alttoplam = req.body.subtotal;
  var vergi = req.body.tax;
  var kargo = req.body.shipping;
  var toplamfiyat = req.body.total;

  res.render("checkout", { data: siparis });
});

app.get("/hesabim", function (req, res) {
  res.render("login");
});

app.get("/admin", function (req, res) {
  res.render("admin");
});

app.get("/sepet", function (req, res) {
  Sepet.find({}, function (err, sepets) {
    res.render("sepet", {
      sepets: sepets,
    });
  });
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.get("/onay", function (req, res) {
  res.render("onay");
});

app.post("/register", function (req, res) {
  let newUser = new User({
    email: req.body.username,
    password: req.body.password,
  });
  console.log(req.body.username);
  console.log(req.body.password);
  newUser.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.render("hesabim")
    }
  });
});

app.post("/login", function (req, res) {
  const email = req.body.username;
  const password = req.body.password;
  console.log(email);
  User.findOne({ email: email }, function (err, foundUser) {
    if (err) {
      console.log(err);
      console.log("şifre hatali");
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          Item.find({}, function (err, items) {
            res.render("home", {
              items: items,
            });
          });

          console.log("basariyla giris yapildi");
        }
      }
      else{
        res.send("Şifre veya kullanıcı adı hatalı.")
      }
    }
  });
});

app.post("/adminlogin", function (req, res) {
  const email = req.body.username;
  const password = req.body.password;
  console.log(email);
  Yonetici.findOne({ email: email }, function (err, foundUser) {
    if (err) {
      console.log(err);
      console.log("şifre hatali");
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("urunekle");
          console.log("basariyla giris yapildi");
        }
      }
    }
  });
});

app.route("/:kategori").get(function (req, res) {
  Item.find(
    { urunKategorisi: req.params.kategori },
    function (err, foundItems) {
      /*    console.log(foundItems);*/
      res.render("home", {
        items: foundItems,
      });
    }
  );
});

app.listen(3000, function () {
  console.log("server started");
});
