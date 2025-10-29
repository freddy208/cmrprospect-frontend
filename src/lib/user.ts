// src/lib/user.ts
import api from "./api";
import { ICreateUser, IUpdateUser, IUser, IUserFilter } from "@/types/user";

const ENDPOINT = "/users";

export const userApi = {
  async getAll(filters?: IUserFilter): Promise<IUser[]> {
    const response = await api.get(ENDPOINT, { params: filters });
    return response.data;
  },

  async getById(id: string): Promise<IUser> {
    const response = await api.get(`${ENDPOINT}/${id}`);
    return response.data;
  },

  async create(data: ICreateUser): Promise<IUser> {
    const response = await api.post(ENDPOINT, data);
    return response.data;
  },

  async update(id: string, data: IUpdateUser): Promise<IUser> {
    const response = await api.put(`${ENDPOINT}/${id}`, data);
    return response.data;
  },

  async remove(id: string): Promise<IUser> {
    const response = await api.delete(`${ENDPOINT}/${id}`);
    return response.data;
  },
};
