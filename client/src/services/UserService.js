import Api from '@/services/Api'

export default {
  getAll(filters) {
    return Api().get(`user/?${filters}`)
  },
  getById(id) {
    return Api().get(`user/${id}`)
  },
  updateUser(data, id) {
    return Api().put(`users/${id}`, data)
  },
  deleteById(id) {
    return Api().delete(`users/${id}`)
  }
}
