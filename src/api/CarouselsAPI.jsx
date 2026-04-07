import { api } from "./api";

export const getCarousels = async () => {
  const response = await api.get("carousels");
  return response.data;
};

export const getCarousel = async (id) => {
  const response = await api.get("carousels/" + id);
  return response.data;
};

export const postCarousel = async () => {
  const response = await api.post("carousels");
  return response;
};
export const updateCarousel = async (id) => {
  const response = await api.put("carousels/" + id);
  return response;
};
export const deleteCarousel = async (id) => {
  const response = await api.delete("carousels/" + id);
  return response;
};
