const https = require("https");

// ─── LANDMARKS ────────────────────────────────────────────────────────────────
const landmarks = [
    "Maryland Mall, Lagos",
    "Lagos University Teaching Hospital, Idi-Araba",
    "Federal College of Education, Akoka",
    "Computer Village, Ikeja",
    "Radisson Blu Anchorage Hotel, Victoria Island",
    "Sheraton Lagos Hotel, Ikeja",
    "Chevron Nigeria Limited, Lekki",
    "Freedom Park, Lagos Island",
    "Nike Art Gallery, Lekki",
    "Landmark Centre, Victoria Island",
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const get = (url) =>
    new Promise((resolve, reject) => {
        const options = {
            headers: {
                "User-Agent": "routag-location-fetcher/1.0",
            },
        };
        https
            .get(url, options, (res) => {
                let data = "";
                res.on("data", (chunk) => (data += chunk));
                res.on("end", () => {
                    try {
                        resolve(JSON.parse(data));
                    } catch {
                        reject(new Error(`Failed to parse: ${data}`));
                    }
                });
            })
            .on("error", reject);
    });

// ─── STEP 1: Geocode all landmarks via Nominatim ─────────────────────────────
async function geocode(name) {
    const encoded = encodeURIComponent(name);
    const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`;
    const results = await get(url);
    if (!results || results.length === 0) {
        throw new Error(`No results for: ${name}`);
    }
    return {
        name,
        address: results[0].display_name,
        latitude: parseFloat(results[0].lat),
        longitude: parseFloat(results[0].lon),
    };
}

// ─── STEP 2: Get route between two points via OSRM ───────────────────────────
async function getRoute(from, to) {
    const url = `https://router.project-osrm.org/route/v1/driving/${from.longitude},${from.latitude};${to.longitude},${to.latitude}?overview=false`;
    const result = await get(url);
    if (result.code !== "Ok" || !result.routes || result.routes.length === 0) {
        throw new Error(`No route found between ${from.name} and ${to.name}`);
    }
    const route = result.routes[0];
    return {
        distanceKm: Math.round((route.distance / 1000) * 10) / 10,
        durationMin: Math.round(route.duration / 60),
    };
}

// ─── STEP 3: Generate pairs and build locationPairs array ────────────────────
async function run() {
    console.log("📍 Geocoding landmarks...\n");

    const geocoded = [];

    for (let i = 0; i < landmarks.length; i++) {
        try {
            const result = await geocode(landmarks[i]);
            geocoded.push(result);
            console.log(`✅ [${i + 1}/${landmarks.length}] ${result.name}`);
            console.log(`   → ${result.latitude}, ${result.longitude}`);
            await sleep(1100); // Nominatim rate limit: 1 req/sec
        } catch (err) {
            console.error(
                `❌ Failed to geocode: ${landmarks[i]} — ${err.message}`,
            );
        }
    }

    console.log(`\n🗺️  Fetching routes for all pairs...\n`);

    // Generate sequential pairs: 0→1, 1→2, 2→3, etc. + a few cross pairs
    const pairs = [];
    for (let i = 0; i < geocoded.length - 1; i++) {
        pairs.push([geocoded[i], geocoded[i + 1]]);
    }
    // Add a few cross-area pairs for variety
    pairs.push([geocoded[0], geocoded[4]]); // Lekki → Airport
    pairs.push([geocoded[2], geocoded[11]]); // Balogun → Giwa Gardens
    pairs.push([geocoded[6], geocoded[1]]); // NYSC Secretariat → Ikeja Mall
    pairs.push([geocoded[3], geocoded[12]]); // Oriental Hotel → Festac
    pairs.push([geocoded[7], geocoded[13]]); // HSE Gourmet → Boho VI

    const locationPairs = [];

    for (let i = 0; i < pairs.length; i++) {
        const [from, to] = pairs[i];
        try {
            const route = await getRoute(from, to);
            locationPairs.push({ from, to, ...route });
            console.log(
                `✅ [${i + 1}/${pairs.length}] ${from.name.split(",")[0]} → ${to.name.split(",")[0]}`,
            );
            console.log(`   → ${route.distanceKm}km, ${route.durationMin}min`);
            await sleep(500);
        } catch (err) {
            console.error(`❌ Route failed: ${err.message}`);
        }
    }

    // ─── OUTPUT ───────────────────────────────────────────────────────────────
    console.log(
        "\n\n// ─── PASTE THIS INTO YOUR seed.js ───────────────────────\n",
    );
    console.log("const locationPairs = [");

    for (const pair of locationPairs) {
        console.log(`    {`);
        console.log(`        from: {`);
        console.log(
            `            address: ${JSON.stringify(pair.from.name.split(",").slice(0, 3).join(",").trim())},`,
        );
        console.log(`            latitude: ${pair.from.latitude},`);
        console.log(`            longitude: ${pair.from.longitude},`);
        console.log(`        },`);
        console.log(`        to: {`);
        console.log(
            `            address: ${JSON.stringify(pair.to.name.split(",").slice(0, 3).join(",").trim())},`,
        );
        console.log(`            latitude: ${pair.to.latitude},`);
        console.log(`            longitude: ${pair.to.longitude},`);
        console.log(`        },`);
        console.log(`        durationMin: ${pair.durationMin},`);
        console.log(`        distanceKm: ${pair.distanceKm},`);
        console.log(`    },`);
    }

    console.log("];");
    console.log(`\n// Total pairs generated: ${locationPairs.length}`);
}

run();
