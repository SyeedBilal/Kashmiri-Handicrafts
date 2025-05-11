const Products=require("../models/productModel")

exports.getProducts = async (req, res) => {
  await Products.find()
    .then((products) => {
      // console.log(products);
      res.status(200).json(products); 
    })
    .catch((err) => {
      console.log("error in getProducts", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
};
exports.getProductsBySearch = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Search query is required" });
  }

  try {
    // Split query into words and remove empty strings
    const searchTerms = query.split(/[\s\-]+/).filter(term => term.length > 0);
    
    // Create regex patterns for each term (case insensitive, with word boundaries)
    const regexPatterns = searchTerms.map(term => new RegExp(term, 'i'));
    
    // Search across multiple fields with all terms
    const products = await Products.find({
      $or: [
        { name: { $all: regexPatterns } },
        { description: { $all: regexPatterns } },
        { category: { $all: regexPatterns } }
      ]
    });

    // Alternative: Search with any term matching (broader results)
    // const products = await Products.find({
    //   $or: [
    //     { name: { $in: regexPatterns } },
    //     { description: { $in: regexPatterns } },
    //     { category: { $in: regexPatterns } }
    //   ]
    // });

    res.status(200).json(products);
  } catch (err) {
    console.error("Error in getProductsBySearch:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
