const getSecondLastItem = (array: any[]): any | undefined => {
  if (array.length < 3) {
    // Return undefined if the array doesn't have enough items
    return undefined;
  }
  return array[array.length - 3];
};

export { getSecondLastItem };
