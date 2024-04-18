export const fetchPlaces = async (query, key, maxResults = 20) => {
    const url = 'https://places.googleapis.com/v1/places:searchText';

    const params = {
        textQuery: query
    };

    const headers = {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': key,
        'X-Goog-FieldMask': 'places.name,places.id,places.nationalPhoneNumber,places.formattedAddress,places.rating,places.googleMapsUri,places.websiteUri,places.displayName,places.userRatingCount'
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(params)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.places.slice(0, maxResults);  // Assuming the data structure includes a 'places' key
    } catch (error) {
        console.error("Failed to fetch places: ", error);
        return [];  // Return empty array on error
    }
};

export const fetchPlaceDetails = async (placeId, key) => {
    const url = `https://places.googleapis.com/v1/places/${placeId}`;

    const headers = {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': key,
        'X-Goog-FieldMask': 'name,id,types,nationalPhoneNumber,internationalPhoneNumber,formattedAddress,addressComponents,plusCode,location,rating,googleMapsUri,regularOpeningHours,utcOffsetMinutes,adrFormatAddress,businessStatus,userRatingCount,photos,displayName,primaryTypeDisplayName,currentOpeningHours,primaryType,shortFormattedAddress,websiteUri'
    };

    try {
        const response = await fetch(url, { headers });

        if (response.status === 200) {  // corrected from `status_code` to `status`
            const data = await response.json();
            // Process and return detailed place information
            return {
                name: data.displayName.text,
                types: data.types,
                phone: {
                    national: data.nationalPhoneNumber,
                    international: data.internationalPhoneNumber
                },
                address: {
                    formatted: data.formattedAddress,
                    components: data.addressComponents,
                    plusCode: data.plusCode.compoundCode
                },
                location: data.location,
                openingHours: data.currentOpeningHours.periods.map(period => ({
                    open: period.open,
                    close: period.close
                })),
                rating: data.rating,
                userRatingCount: data.userRatingCount,
                googleMapsUri: data.googleMapsUri,
                status: data.businessStatus
            };
        } else {
            console.error(`Failed to fetch place details: HTTP status ${response.status}`);
            return {};  // Return empty object on error
        }
    } catch (error) {
        console.error("Error fetching place details: ", error);
        return {};  // Return empty object on error
    }
};
