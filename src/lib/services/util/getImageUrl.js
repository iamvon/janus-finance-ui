export const getImageUrl =  (url, defaultValue = '') => {
    const DEFAULT_URL = defaultValue && defaultValue.trim() !== '' ? defaultValue.trim() : 'https://aina.vn/wp-content/uploads/2021/08/default-image-620x600-1.jpg'
    return url && url.trim() !== '' ? url.trim() : DEFAULT_URL
}