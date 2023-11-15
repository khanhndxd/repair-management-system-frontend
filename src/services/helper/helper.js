export function convertToVND(price) {
  const VND = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  return VND.format(price);
}

export function convertFromVND(formattedPrice) {
  const numericString = formattedPrice.replace(/[^\d.,]/g, "");

  const numericValue = parseFloat(numericString.replace(",", "."));

  return numericValue;
}

export function isContainValueInArray(arr, value) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === value) {
      return true;
    }
  }
  return false;
}

export function isContainValueInArrayOfObject(arr, prop, value) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][prop] === value) {
      return true;
    }
  }
  return false;
}
