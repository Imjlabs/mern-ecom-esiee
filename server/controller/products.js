const productModel = require("../models/products");
const fs = require("fs");
const path = require("path");

class Product {
  // Delete Image from uploads -> products folder
  static deleteImages(images, mode) {
    var basePath =
      path.resolve(__dirname + "../../") + "/public/uploads/products/";
    console.log(basePath);
    for (var i = 0; i < images.length; i++) {
      let filePath = "";
      if (mode == "file") {
        filePath = basePath + `${images[i].filename}`;
      } else {
        filePath = basePath + `${images[i]}`;
      }
      console.log(filePath);
      if (fs.existsSync(filePath)) {
        console.log("Image déja éxistante");
      }
      fs.unlink(filePath, (err) => {
        if (err) {
          return err;
        }
      });
    }
  }

  async getAllProduct(req, res) {
    try {
      let Products = await productModel
        .find({})
        .populate("pCategory", "_id cName")
        .sort({ _id: -1 });
      if (Products) {
        return res.json({ Products });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async postAddProduct(req, res) {
    let { pName, pDescription, pPrice, pQuantity, pCategory, pOffer, pStatus } =
      req.body;
    let images = req.files;
    if (
      !pName |
      !pDescription |
      !pPrice |
      !pQuantity |
      !pCategory |
      !pOffer |
      !pStatus
    ) {
      Product.deleteImages(images, "file");
      return res.json({ error: "Tous les renseignements sont obligatoires" });
    }
    else if (pName.length > 255 || pDescription.length > 3000) {
      Product.deleteImages(images, "file");
      return res.json({
        error: "Le nom et la description ne doivent pas comporter 3 000 caractères.",
      });
    }
    else if (images.length !== 2) {
      Product.deleteImages(images, "file");
      return res.json({ error: "Il faut deux images au minimun" });
    } else {
      try {
        let allImages = [];
        for (const img of images) {
          allImages.push(img.filename);
        }
        let newProduct = new productModel({
          pImages: allImages,
          pName,
          pDescription,
          pPrice,
          pQuantity,
          pCategory,
          pOffer,
          pStatus,
        });
        let save = await newProduct.save();
        if (save) {
          return res.json({ success: "Création de produit réussi" });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  async postEditProduct(req, res) {
    let {
      pId,
      pName,
      pDescription,
      pPrice,
      pQuantity,
      pCategory,
      pOffer,
      pStatus,
      pImages,
    } = req.body;
    let editImages = req.files;

    if (
      !pId |
      !pName |
      !pDescription |
      !pPrice |
      !pQuantity |
      !pCategory |
      !pOffer |
      !pStatus
    ) {
      return res.json({ error: "Tous les renseignements sont obligatoires" });
    }
    else if (pName.length > 255 || pDescription.length > 3000) {
      return res.json({
        error: "Le nom et la description ne doivent pas comporter 3 000 caractères.",
      });
    }
    else if (editImages && editImages.length == 1) {
      Product.deleteImages(editImages, "file");
      return res.json({ error: "Must need to provide 2 images" });
    } else {
      let editData = {
        pName,
        pDescription,
        pPrice,
        pQuantity,
        pCategory,
        pOffer,
        pStatus,
      };
      if (editImages.length == 2) {
        let allEditImages = [];
        for (const img of editImages) {
          allEditImages.push(img.filename);
        }
        editData = { ...editData, pImages: allEditImages };
        Product.deleteImages(pImages.split(","), "string");
      }
      try {
        let editProduct = productModel.findByIdAndUpdate(pId, editData);
        editProduct.exec((err) => {
          if (err) console.log(err);
          return res.json({ success: "Mis à jour du produit réussi !" });
        });
      } catch (err) {
        console.log(err);
      }
    }
  }

  async getDeleteProduct(req, res) {
    let { pId } = req.body;
    if (!pId) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let deleteProductObj = await productModel.findById(pId);
        let deleteProduct = await productModel.findByIdAndDelete(pId);
        if (deleteProduct) {
          Product.deleteImages(deleteProductObj.pImages, "string");
          return res.json({ success: "Product deleted successfully" });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  async getSingleProduct(req, res) {
    let { pId } = req.body;
    if (!pId) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let singleProduct = await productModel
          .findById(pId)
          .populate("pCategory", "cName")
          .populate("pRatingsReviews.user", "name email userImage");
        if (singleProduct) {
          return res.json({ Product: singleProduct });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  async getProductByCategory(req, res) {
    let { catId } = req.body;
    if (!catId) {
      return res.json({ error: "Tous les champs sont requis" });
    } else {
      try {
        let products = await productModel
          .find({ pCategory: catId })
          .populate("pCategory", "cName");
        if (products) {
          return res.json({ Products: products });
        }
      } catch (err) {
        return res.json({ error: "Erreur de recherche de produit "});
      }
    }
  }

  async getProductByPrice(req, res) {
    let { price } = req.body;
    if (!price) {
      return res.json({ error: "Tous les champs sont requis !" });
    } else {
      try {
        let products = await productModel
          .find({ pPrice: { $lt: price } })
          .populate("pCategory", "cName")
          .sort({ pPrice: -1 });
        if (products) {
          return res.json({ Products: products });
        }
      } catch (err) {
        return res.json({ error: "Filtre produit incorrect" });
      }
    }
  }

  async getWishProduct(req, res) {
    let { productArray } = req.body;
    if (!productArray) {
      return res.json({ error: "Tous les champs sont requis" });
    } else {
      try {
        let wishProducts = await productModel.find({
          _id: { $in: productArray },
        });
        if (wishProducts) {
          return res.json({ Products: wishProducts });
        }
      } catch (err) {
        return res.json({ error: "Filtre produits incorrect" });
      }
    }
  }

  async getCartProduct(req, res) {
    let { productArray } = req.body;
    if (!productArray) {
      return res.json({ error: "Tous les champs sont requis !" });
    } else {
      try {
        let cartProducts = await productModel.find({
          _id: { $in: productArray },
        });
        if (cartProducts) {
          return res.json({ Products: cartProducts });
        }
      } catch (err) {
        return res.json({ error: "Panier produit incorrect" });
      }
    }
  }

  async postAddReview(req, res) {
    let { pId, uId, rating, review } = req.body;
    if (!pId || !rating || !review || !uId) {
      return res.json({ error: "Tous les champs sont requis" });
    } else {
      let checkReviewRatingExists = await productModel.findOne({ _id: pId });
      if (checkReviewRatingExists.pRatingsReviews.length > 0) {
        checkReviewRatingExists.pRatingsReviews.map((item) => {
          if (item.user === uId) {
            return res.json({ error: "Tu as déja publié un commentaire pour ce produit" });
          } else {
            try {
              let newRatingReview = productModel.findByIdAndUpdate(pId, {
                $push: {
                  pRatingsReviews: {
                    review: review,
                    user: uId,
                    rating: rating,
                  },
                },
              });
              newRatingReview.exec((err, result) => {
                if (err) {
                  console.log(err);
                }
                return res.json({ success: "Merci pour le commentaire" });
              });
            } catch (err) {
              return res.json({ error: "Produit panier incorrect" });
            }
          }
        });
      } else {
        try {
          let newRatingReview = productModel.findByIdAndUpdate(pId, {
            $push: {
              pRatingsReviews: { review: review, user: uId, rating: rating },
            },
          });
          newRatingReview.exec((err, result) => {
            if (err) {
              console.log(err);
            }
            return res.json({ success: "Merci pour le commentaire" });
          });
        } catch (err) {
          return res.json({ error: "Produit panier incorrect" });
        }
      }
    }
  }

  async deleteReview(req, res) {
    let { rId, pId } = req.body;
    if (!rId) {
      return res.json({ message: "Tous les champs sont requis" });
    } else {
      try {
        let reviewDelete = productModel.findByIdAndUpdate(pId, {
          $pull: { pRatingsReviews: { _id: rId } },
        });
        reviewDelete.exec((err, result) => {
          if (err) {
            console.log(err);
          }
          return res.json({ success: "Ton commentaire à été supprimé" });
        });
      } catch (err) {
        console.log(err);
      }
    }
  }
}

const productController = new Product();
module.exports = productController;
