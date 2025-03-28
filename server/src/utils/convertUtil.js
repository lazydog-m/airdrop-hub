const convertToArray = (data) => {
  Array.isArray(data) ? data : [data];
}

module.exports = { convertToArray }
