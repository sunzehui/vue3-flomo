import request from '@/utils/request'

export function ApiUploadFile(file) {
  const formData = new FormData()
  formData.append('file', file)
  return request<any>({
    url: '/api/files',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
