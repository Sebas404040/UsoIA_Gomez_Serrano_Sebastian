const API_URL = `https://693393c24090fe3bf01d804d.mockapi.io/api/v1`;

async function fetchAPI(endpoint, method = 'GET', body = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (body) {
            options.body = JSON.stringify(body);
        }
        const response = await fetch(`${API_URL}/${endpoint}`, options);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Error al cargar los datos", error);
    }
}