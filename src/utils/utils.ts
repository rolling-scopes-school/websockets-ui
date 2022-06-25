export const crop = (base64: string) => {
  let base64Crop: string | string[] = base64.split(',');
  base64Crop.shift();
  base64Crop = base64Crop.join();
  
  return base64Crop;
} 