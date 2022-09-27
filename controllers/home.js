module.exports = {
  getIndex: (req, res) => {
    res.render("index.ejs", { url: req.url });
  },
};
