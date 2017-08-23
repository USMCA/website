module.exports = (success, message, httpCode, data = {}) => {                            
  return (req, res) => {                                                            
    return res.status(httpCode).json(Object.assign({                                              
      success: success,
      message: message
    }, data));
  };
};
