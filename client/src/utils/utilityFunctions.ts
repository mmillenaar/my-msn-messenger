export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = sessionStorage.getItem('token')

    const authOptions = {
        ...options,
        headers: {
            ...options.headers,
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
        }
    }

    const response = await fetch(url, authOptions)

    return response
}