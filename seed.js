require("dotenv").config();
const axios = require("axios");

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.BEARER_TOKEN;
const TOTAL = 20;
const CONCURRENT_WORKERS = 10;

const headers = {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
    RoutagAccess: "1",
};

const locationPairs = [
    {
        from: {
            address:
                "Rubels&Angels, Plot 24 Festac Access Rd, Amuwo Odofin, Lagos 102102, Lagos",
            latitude: 6.4701466,
            longitude: 3.3100149,
        },
        to: {
            address:
                "Rockview Hotel, Plot 33 23 Rd, Festac Town, Lagos 102102, Lagos",
            latitude: 6.4671063,
            longitude: 3.256691,
        },
        durationMin: 14,
        distanceKm: 6.9,
    },
    {
        from: {
            address:
                "Genesis Cinemas - Festac, Festival Hotel Festac Lagos, Amuwo Odofin Festival Mall, Festac Town, Lagos",
            latitude: 6.4682354,
            longitude: 3.300587,
        },
        to: {
            address:
                "Ikeja City Mall, Obafemi Awolowo Wy, Alausa, Ojodu 101233, Lagos",
            latitude: 6.6141824,
            longitude: 3.3582733,
        },
        durationMin: 39,
        distanceKm: 28.2,
    },
    {
        from: {
            address:
                "NYSC Secretariat, Old Census Office, 50 Babs Animashaun Rd, Surulere, Lagos 101241, Lagos",
            latitude: 6.491708,
            longitude: 3.3498809,
        },
        to: {
            address:
                "NYSC Orientation Camp Lagos, Ipaja Rd, Orile Agege, Lagos 102212, Lagos",
            latitude: 6.6249014,
            longitude: 3.3032931,
        },
        durationMin: 37,
        distanceKm: 23.7,
    },
    {
        from: {
            address:
                "Evercare Hospital Lekki, 1 Admiralty Wy, Bisola Durosinmi Etti Dr, Lekki Phase 1, Lagos 106104, Lagos",
            latitude: 6.4376394,
            longitude: 3.4570878,
        },
        to: {
            address:
                "Nike Art Gallery, 2 Nike Art Gallery Rd, Lekki Phase I, Lekki 106104, Lagos",
            latitude: 6.4315601,
            longitude: 3.4818886,
        },
        durationMin: 7,
        distanceKm: 3.7,
    },
    {
        from: {
            address:
                "HSE Gourmet, 25 Babatope Bejide Cres, Lekki Phase 1, Lagos 106104, Lagos",
            latitude: 6.4435991,
            longitude: 3.4759996,
        },
        to: {
            address:
                "Lagos Oriental Hotel, 3 Lekki - Epe Expy, Victoria Island, Lagos 106104, Lagos",
            latitude: 6.4359948,
            longitude: 3.4449057,
        },
        durationMin: 11,
        distanceKm: 6,
    },
    {
        from: {
            address:
                "Raji Rasaki Estate Rd, Amuwo Odofin Estate, Amuwo-Odofin Housing Estate, Mile 2 102102, Lagos",
            latitude: 6.4743791,
            longitude: 3.3032754,
        },
        to: {
            address:
                "Giwa Gardens, Ejike Street, Native Villa Off Ablag Road, Monastery Way Sangotedo, Lekki, Lagos",
            latitude: 6.4592439,
            longitude: 3.6275451,
        },
        durationMin: 76,
        distanceKm: 49.6,
    },
];

const packageProfiles = [
    {
        type: "documents",
        tags: ["no_stack", "high_value"],
        descriptions: [
            "Legal documents",
            "Contracts",
            "Certificates",
            "Invoices",
            "Academic transcripts",
            "Passport",
            "ID copies",
        ],
        valuePerUnit: { min: 500, max: 2000 },
        weightPerUnit: { min: 0.1, max: 0.5 },
    },
    {
        type: "electronics",
        tags: ["fragile", "no_stack", "high_value"],
        descriptions: [
            "Laptop",
            "Smart TV",
            "Camera",
            "Gaming console",
            "Bluetooth speaker",
            "Projector",
        ],
        valuePerUnit: { min: 50000, max: 400000 },
        weightPerUnit: { min: 1.5, max: 8 },
    },
    {
        type: "mobile_devices",
        tags: ["fragile", "high_value"],
        descriptions: ["iPhone", "Android smartphone", "Tablet", "Smartwatch"],
        valuePerUnit: { min: 80000, max: 1000000 },
        weightPerUnit: { min: 0.2, max: 0.8 },
    },
    {
        type: "computer_accessories",
        tags: ["fragile", "no_stack"],
        descriptions: [
            "Monitor",
            "Mechanical keyboard",
            "External hard drive",
            "Webcam",
            "USB hub",
            "Mouse",
        ],
        valuePerUnit: { min: 5000, max: 80000 },
        weightPerUnit: { min: 0.2, max: 4 },
    },
    {
        type: "appliances_small",
        tags: ["fragile", "bulky"],
        descriptions: [
            "Blender",
            "Air fryer",
            "Electric kettle",
            "Toaster",
            "Hair dryer",
            "Iron",
        ],
        valuePerUnit: { min: 8000, max: 60000 },
        weightPerUnit: { min: 1, max: 5 },
    },
    {
        type: "fashion_clothing",
        tags: ["no_stack"],
        descriptions: [
            "Ankara dress",
            "Agbada set",
            "Blazer",
            "Native wear",
            "Casual shirt",
            "Jeans",
        ],
        valuePerUnit: { min: 3000, max: 30000 },
        weightPerUnit: { min: 0.3, max: 1 },
    },
    {
        type: "shoes_bags",
        tags: ["no_stack", "fragile"],
        descriptions: [
            "Sneakers",
            "Dress shoes",
            "Heels",
            "Handbag",
            "Backpack",
            "Sandals",
        ],
        valuePerUnit: { min: 5000, max: 80000 },
        weightPerUnit: { min: 0.5, max: 1.5 },
    },
    {
        type: "cosmetics_personal_care",
        tags: ["liquid", "fragile"],
        descriptions: [
            "Perfume",
            "Body lotion",
            "Face cream",
            "Shampoo",
            "Makeup kit",
            "Body wash",
        ],
        valuePerUnit: { min: 2000, max: 25000 },
        weightPerUnit: { min: 0.2, max: 1 },
    },
    {
        type: "groceries_dry",
        tags: ["no_stack"],
        descriptions: [
            "Rice (5kg bag)",
            "Beans",
            "Semolina",
            "Flour",
            "Oats",
            "Cornflakes",
        ],
        valuePerUnit: { min: 2000, max: 8000 },
        weightPerUnit: { min: 1, max: 5 },
    },
    {
        type: "groceries_fresh",
        tags: ["perishable", "cold_chain"],
        descriptions: [
            "Fresh tomatoes",
            "Chicken",
            "Fresh fish",
            "Beef",
            "Mixed vegetables",
            "Fresh fruits",
        ],
        valuePerUnit: { min: 1500, max: 10000 },
        weightPerUnit: { min: 0.5, max: 3 },
    },
    {
        type: "prepared_food",
        tags: ["hot_food", "perishable"],
        descriptions: [
            "Jollof rice",
            "Egusi soup",
            "Pepper soup",
            "Fried chicken",
            "Pounded yam",
            "Ofada rice",
        ],
        valuePerUnit: { min: 1500, max: 8000 },
        weightPerUnit: { min: 0.5, max: 2 },
    },
    {
        type: "bakery_items",
        tags: ["perishable", "no_stack"],
        descriptions: [
            "Fish pie",
            "Meat pie",
            "Puff puff",
            "Doughnut",
            "Chin chin",
            "Bread loaf",
            "Cupcake",
        ],
        valuePerUnit: { min: 500, max: 3000 },
        weightPerUnit: { min: 0.1, max: 0.5 },
    },
    {
        type: "pharmaceuticals_otc",
        tags: ["fragile", "upright_only"],
        descriptions: [
            "Paracetamol",
            "Vitamin C tablets",
            "Cough syrup",
            "Eye drops",
            "Antacid",
            "Nasal spray",
        ],
        valuePerUnit: { min: 500, max: 5000 },
        weightPerUnit: { min: 0.05, max: 0.3 },
    },
    {
        type: "prescription_medicine",
        tags: ["fragile", "upright_only", "high_value"],
        descriptions: [
            "Antibiotics",
            "Blood pressure medication",
            "Insulin",
            "Asthma inhaler",
            "Antidiabetic medication",
        ],
        valuePerUnit: { min: 3000, max: 30000 },
        weightPerUnit: { min: 0.05, max: 0.5 },
    },
    {
        type: "medical_supplies",
        tags: ["fragile", "no_stack"],
        descriptions: [
            "Surgical gloves (box)",
            "Syringes (pack)",
            "Blood pressure monitor",
            "Glucometer",
            "Face masks (box)",
            "Thermometer",
        ],
        valuePerUnit: { min: 1000, max: 20000 },
        weightPerUnit: { min: 0.1, max: 1 },
    },
    {
        type: "flowers_plants",
        tags: ["fragile", "perishable", "upright_only"],
        descriptions: [
            "Rose bouquet",
            "Potted orchid",
            "Sunflower bouquet",
            "Succulent plant",
            "Tulip bouquet",
        ],
        valuePerUnit: { min: 2000, max: 15000 },
        weightPerUnit: { min: 0.3, max: 2 },
    },
    {
        type: "books_stationery",
        tags: ["no_stack"],
        descriptions: [
            "Textbook",
            "Novel",
            "Journal",
            "Stationery set",
            "Engineering drawing set",
        ],
        valuePerUnit: { min: 500, max: 8000 },
        weightPerUnit: { min: 0.2, max: 1 },
    },
    {
        type: "furniture_small",
        tags: ["bulky", "no_stack"],
        descriptions: [
            "Study chair",
            "Side table",
            "Wall shelf",
            "Floor lamp",
            "Bean bag",
        ],
        valuePerUnit: { min: 10000, max: 80000 },
        weightPerUnit: { min: 3, max: 15 },
    },
    {
        type: "home_decor",
        tags: ["fragile", "no_stack"],
        descriptions: [
            "Picture frame",
            "Decorative vase",
            "Wall art",
            "Scented candle",
            "Throw pillow",
        ],
        valuePerUnit: { min: 1500, max: 20000 },
        weightPerUnit: { min: 0.2, max: 2 },
    },
    {
        type: "household_items",
        tags: ["bulky"],
        descriptions: [
            "Cooking pot",
            "Bedsheet set",
            "Duvet",
            "Cutlery set",
            "Towel set",
        ],
        valuePerUnit: { min: 2000, max: 20000 },
        weightPerUnit: { min: 0.5, max: 4 },
    },
    {
        type: "automobile_parts",
        tags: ["bulky", "no_stack"],
        descriptions: [
            "Car battery",
            "Brake pads",
            "Side mirror",
            "Engine oil (4L)",
            "Spark plugs (set)",
        ],
        valuePerUnit: { min: 5000, max: 80000 },
        weightPerUnit: { min: 1, max: 15 },
    },
    {
        type: "laundry",
        tags: ["no_stack"],
        descriptions: [
            "Dry cleaned suit",
            "Washed shirts (pack)",
            "Dry cleaned gown",
            "Folded bedsheets",
            "Dry cleaned native wear",
        ],
        valuePerUnit: { min: 1000, max: 8000 },
        weightPerUnit: { min: 0.3, max: 2 },
    },
    {
        type: "alcohol_beverages",
        tags: ["liquid", "fragile", "upright_only"],
        descriptions: [
            "Red wine bottle",
            "Whiskey bottle",
            "Champagne bottle",
            "Beer pack (12)",
            "Vodka bottle",
        ],
        valuePerUnit: { min: 3000, max: 50000 },
        weightPerUnit: { min: 0.5, max: 5 },
    },
    {
        type: "jewelry_valuables",
        tags: ["fragile", "high_value"],
        descriptions: [
            "Gold necklace",
            "Diamond ring",
            "Wristwatch",
            "Gold bracelet",
            "Silver earrings",
        ],
        valuePerUnit: { min: 20000, max: 500000 },
        weightPerUnit: { min: 0.05, max: 0.3 },
    },
    {
        type: "toys_games",
        tags: ["fragile", "no_stack"],
        descriptions: [
            "Remote control car",
            "Lego set",
            "Board game",
            "Action figure",
            "Drone",
        ],
        valuePerUnit: { min: 3000, max: 50000 },
        weightPerUnit: { min: 0.3, max: 2 },
    },
    {
        type: "sports_equipment",
        tags: ["bulky"],
        descriptions: [
            "Football boots",
            "Yoga mat",
            "Tennis racket",
            "Dumbbell (pair)",
            "Badminton set",
        ],
        valuePerUnit: { min: 3000, max: 40000 },
        weightPerUnit: { min: 0.5, max: 5 },
    },
    {
        type: "pet_food",
        tags: ["perishable"],
        descriptions: [
            "Dog food (5kg)",
            "Cat food (3kg)",
            "Dog treats",
            "Bird seed",
            "Fish flakes",
        ],
        valuePerUnit: { min: 2000, max: 15000 },
        weightPerUnit: { min: 0.5, max: 5 },
    },
    {
        type: "returns_parcel",
        tags: ["returns_parcel"],
        descriptions: [
            "Returned clothing item",
            "Defective electronics return",
            "Wrong item return",
        ],
        valuePerUnit: { min: 1000, max: 50000 },
        weightPerUnit: { min: 0.2, max: 3 },
    },
    {
        type: "mixed_goods",
        tags: ["no_stack", "fragile"],
        descriptions: [
            "Groceries",
            "Toiletries",
            "Stationery",
            "Personal care items",
            "Household supplies",
        ],
        valuePerUnit: { min: 2000, max: 20000 },
        weightPerUnit: { min: 0.5, max: 3 },
    },
];

const firstNames = [
    "Chidi",
    "Amaka",
    "Tunde",
    "Ngozi",
    "Emeka",
    "Kemi",
    "Bola",
    "Sola",
    "Yemi",
    "Tobi",
    "Ify",
    "Uche",
    "Dami",
    "Seun",
    "Femi",
    "Ada",
    "Nkem",
    "Eze",
    "Chioma",
    "Lanre",
    "Bukola",
    "Zainab",
    "Fatima",
    "Musa",
];

const lastNames = [
    "Okafor",
    "Adeleke",
    "Nwosu",
    "Babatunde",
    "Eze",
    "Adeyemi",
    "Ibrahim",
    "Obi",
    "Afolabi",
    "Chukwu",
    "Olawale",
    "Madu",
    "Salami",
    "Okonkwo",
    "Bello",
    "Abubakar",
    "Ogundipe",
    "Nwachukwu",
    "Adebayo",
    "Onyekachi",
];

const phonePrefixes = [
    "0803",
    "0806",
    "0810",
    "0813",
    "0816",
    "0703",
    "0706",
    "0901",
    "0906",
    "0905",
];

const randomItem = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
};

const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generatePayload = (index) => {
    const profile = packageProfiles[index % packageProfiles.length];
    const location = locationPairs[index % locationPairs.length];

    const shuffledTags = [...profile.tags].sort(() => Math.random() - 0.5);
    const tagCount = Math.min(shuffledTags.length, randomInt(1, 2));
    const selectedTags = shuffledTags.slice(0, tagCount);

    const description = randomItem(profile.descriptions);

    const noOfPackages = randomInt(1, 10);

    // Value scales with number of packages + random variance per unit
    const valuePerUnit = randomInt(
        profile.valuePerUnit.min,
        profile.valuePerUnit.max,
    );
    const productValue = valuePerUnit * noOfPackages;

    // Offer price is 20–35% of product value, rounded to nearest 50
    const offerPrice =
        Math.round((productValue * (0.2 + Math.random() * 0.15)) / 50) * 50;

    // Weight scales with number of packages + random variance per unit
    const weightPerUnit =
        profile.weightPerUnit.min +
        Math.random() * (profile.weightPerUnit.max - profile.weightPerUnit.min);
    const weightOfPackages = Math.min(
        Math.round(weightPerUnit * noOfPackages * 10) / 10,
        20,
    );
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);
    const phone = `${randomItem(phonePrefixes)}${randomInt(1000000, 9999999)}`;

    return {
        description,
        from: location.from,
        isFragile: selectedTags.includes("fragile"),
        packageType: profile.type,
        handlingTags: selectedTags,
        noOfPackages,
        offerPrice,
        productImage: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
        productValue,
        receiver: {
            name: `${firstName} ${lastName}`,
            phone,
        },
        to: location.to,
        weightOfPackages,
        durationMin: location.durationMin,
        distanceKm: location.distanceKm,
    };
};

const createAndBroadcast = async (index) => {
    const payload = generatePayload(index);

    // create delivery
    const createRes = await axios.post(`${BASE_URL}/deliveries/init`, payload, {
        headers,
    });

    // extract deliveryID from response
    const deliveryId = createRes.data.data.deliveryId;
    console.log(`[${index}/${TOTAL}] ✅ Created:     ${deliveryId}`);

    // broadcast delivery
    await axios.post(
        `${BASE_URL}/deliveries/${deliveryId}/publish`,
        {},
        { headers },
    );

    console.log(`[${index}/${TOTAL}] 📡 Broadcasted: ${deliveryId}`);
};

const run = async () => {
    console.log(
        `🚀 Starting — ${TOTAL} deliveries across ${CONCURRENT_WORKERS} workers\n`,
    );

    let successCount = 0;
    let failCount = 0;
    let currentIndex = 1;

    // Each worker keeps picking the next available index until TOTAL is reached
    const worker = async (workerId) => {
        while (true) {
            const index = currentIndex++;
            if (index > TOTAL) break;

            try {
                await createAndBroadcast(index);
                successCount++;
            } catch (err) {
                failCount++;
                const message = err.response
                    ? `HTTP ${err.response.status} — ${JSON.stringify(err.response.data)}`
                    : err.message;
                console.error(
                    `[worker-${workerId}] [${index}/${TOTAL}] ❌ Failed: ${message}`,
                );
            }
        }
    };

    // Spin up all workers and run them in parallel
    const workers = Array.from({ length: CONCURRENT_WORKERS }, (_, i) =>
        worker(i + 1),
    );
    await Promise.all(workers);

    console.log(`\n✅ Done — ${successCount} succeeded, ${failCount} failed`);
};

run();
