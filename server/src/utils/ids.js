let lastId = 0;

export default {
  generate() {
    lastId++;
    return lastId;
  }
};
