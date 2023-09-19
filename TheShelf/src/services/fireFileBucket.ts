import { useFirebaseStorage } from 'vuefire'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

export async function uploadUserImage(imageName: string, file: File) {
  const storage = useFirebaseStorage()
  const imageRef = ref(storage, `/ProfilePictures/${imageName}`)
  await uploadBytes(imageRef, file)
  const url = await getDownloadURL(imageRef)

  return url
}

export async function deleteUserImage(imageName: string) {
  const storage = useFirebaseStorage()
  const imageRef = ref(storage, `/ProfilePictures/${imageName}`)
  return deleteObject(imageRef)
}
