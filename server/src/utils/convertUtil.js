const convertToArray = (data) => {
  Array.isArray(data) ? data : [data];
}

const convertBitToBoolean = (bit) => {

  switch (bit) {
    case 1:
      return true
    case 0:
      return false
    default: return null
  }

}

module.exports = { convertToArray, convertBitToBoolean }
