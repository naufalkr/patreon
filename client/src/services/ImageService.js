// src/services/ImageService.js
import Api from '@/services/Api'

export default {
  // Get all images, potentially with query parameters
  getAll(params) {
    return Api().get('images', { params })
  },

  // Get a specific image by its ID
  getById(id) {
    return Api().get(`images/${id}`)
  },

  // Upload a new image
  uploadImage(data, optional) {
    return Api().post('images', data, optional)
  },

  // Update image data by ID
  updateImage(id, data) {
    return Api().put(`images/${id}`, data)
  },

  // Update image views (if applicable)
  updateViews(id) {
    return Api().put(`images/${id}/views`)
  },

  // Delete an image by ID
  deleteById(id) {
    return Api().delete(`images/${id}`)
  }
}
