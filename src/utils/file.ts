import * as SparkMD5 from 'spark-md5' // Import SparkMD5 library
import { compress as ImageCompress } from 'image-conversion'

export const calculateMD5 = (file): Promise<string> => {
  return new Promise((resolve, reject) => {
    const chunkSize = 2097152 // Read in chunks of 2MB
    const chunks = Math.ceil(file.size / chunkSize)
    let currentChunk = 0
    const spark = new SparkMD5.ArrayBuffer()
    const fileReader = new FileReader()

    fileReader.onload = function (e) {
      spark.append(e.target.result) // Append array buffer
      currentChunk++

      if (currentChunk < chunks)
        loadNext()

      else
        resolve(spark.end()) // Return calculated MD5
    }

    fileReader.onerror = function () {
      reject(new Error('Error reading file'))
    }

    function loadNext() {
      const start = currentChunk * chunkSize
      const end = start + chunkSize >= file.size ? file.size : start + chunkSize
      fileReader.readAsArrayBuffer(file.slice(start, end))
    }

    loadNext()
  })
}

export const isValidImageType = (file) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
  return allowedTypes.includes(file.type)
}

export const isValidImageSize = (file) => {
  const maxSize = 5 * 1024 * 1024 // 5MB in bytes
  return file.size <= maxSize
}
function checkImageConversionSupport() {
  const supportsCanvas = !!window.CanvasRenderingContext2D;
  const supportsBlob = !!window.Blob;

  return supportsCanvas && supportsBlob;
}
export const compress = async (file: File, q: number = 0.4) => {
  if (!checkImageConversionSupport()) {
    return file
  }
  const compressdImg = await ImageCompress(file, q)
  return compressdImg as File
}
