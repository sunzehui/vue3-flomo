import { calculateMD5 } from '@/utils/file'
import request from '@/utils/request'
interface FileResult {
  'id': number
  'filename': string
  'filePath': string
  'md5': string
}
export function ApiUploadFile(file) {
  const formData = new FormData()
  formData.append('file', file)
  return request<FileResult>({
    url: '/api/files',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export function ApiIsFileExist(md5: string) {
  return request<FileResult>({
    url: `/api/files/is-exist/${md5}`,
    method: 'get',
  })
}

export const checkFileExistOnServer = async (file: File) => {
  // Replace with your API call to check if file exists on the server
  const md5 = await calculateMD5(file)
  return await ApiIsFileExist(md5)
}
