module.exports = {
  firstError: (res, v, s) => {
    return res.status(s).json({ success: false, message: v.array()[0].msg });
  },
};
