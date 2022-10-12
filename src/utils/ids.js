let lastId = 0;
module.exports = {
  generate() {
    lastId++;
    return lastId;
  }
};