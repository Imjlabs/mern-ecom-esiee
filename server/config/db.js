const mongoose = require("mongoose");
try {
  mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  console.log("Connexion à la base de données réussie");
} catch (err) {
  console.log("Base de données non connectée");
}
