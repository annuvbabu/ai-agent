const cities = {
    kochi: {
        latitude: 9.9312,
        longitude: 76.2673
    },
    delhi: {
        latitude: 28.6139,
        longitude: 77.2090
    },
    mumbai: {
        latitude: 19.0760,
        longitude: 72.8777
    },
    bangalore: {
        latitude: 12.9716,
        longitude: 77.5946
    }
};

export async function getWeather(city) {

    const location =
        cities[city.toLowerCase()];

    if (!location) {
        return "City not found";
    }

    const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m`;

    const response =
        await fetch(url);

    const data =
        await response.json();

    return data.current.temperature_2m;
}