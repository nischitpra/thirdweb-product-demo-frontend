export const getElementValue = (id, valueSelector) => {
  const element = document.getElementById(id);
  if (valueSelector) return element?.[valueSelector];
  return element?.value;
};
