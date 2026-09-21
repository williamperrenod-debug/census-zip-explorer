exports.handler = async function (event) {

    const zipCode = event.queryStringParameters.zip;

    // Validate ZIP code
    if (!zipCode || !/^\d{5}$/.test(zipCode)) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: "Please provide a valid 5-digit ZIP code."
            })
        };
    }

    // Get Census API key from Netlify environment variable
    const apiKey = process.env.CENSUS_API_KEY;

    if (!apiKey) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: "Census API key is not configured."
            })
        };
    }

    // Build Census API request
    const censusUrl =
    `https://api.census.gov/data/2024/acs/acs5` +
    `?get=NAME,B01003_001E,B01002_001E,B19013_001E,B02001_002E,B02001_003E,B02001_005E` +
    `&for=zip%20code%20tabulation%20area:${zipCode}` +
    `&key=${apiKey}`;

    try {

        const response = await fetch(censusUrl);

        const data = await response.json();

        if (!response.ok) {
            return {
                statusCode: response.status,
                body: JSON.stringify({
                    error: "Census API request failed.",
                    details: data
                })
            };
        }

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };

    } catch (error) {

        return {
            statusCode: 500,
            body: JSON.stringify({
                error: "Unable to connect to the Census API."
            })
        };
    }
};
