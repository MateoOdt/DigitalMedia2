import axios, { AxiosResponse } from 'axios';

// Set up API endpoint and authentication credentials
const baseUrl: string = "http://localhost:9596";
const apiKey: string = "your-api-key";  // Replace with your actual API key

// Example endpoint for retrieving ship data
const endpoint: string = "/ships";

// Set up request headers with API key
const headers = {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json"
};

// Function to retrieve ship data
async function getShipData(): Promise<void> {
    try {
        // Send GET request to retrieve ship data
        const response: AxiosResponse = await axios.get(`${baseUrl}${endpoint}`, { headers });

        // Check if request was successful (status code 200)
        if (response.status === 200) {
            // Print ship data
            console.log("Ship Data:");
            console.log(response.data);
        } else {
            console.error(`Error: ${response.status} - ${response.statusText}`);
        }
    } catch (error: any) {
        console.error(`Error: ${error?.message}`);
    }
}

// Call the function to retrieve ship data
getShipData();
