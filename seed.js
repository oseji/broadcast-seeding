require("dotenv").config();
const axios = require("axios");

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.BEARER_TOKEN;
const TOTAL = 10;

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
            "Legal documents, Contracts, Certificates",
            "Invoices, Receipts, Letters",
            "Academic transcripts, ID copies, Passports",
        ],
    },
    {
        type: "electronics",
        tags: ["fragile", "no_stack", "high_value"],
        descriptions: [
            "Laptop, Charger, Mouse, Keyboard",
            "Smart TV, Remote, Cables",
            "Camera, Lens, Memory cards",
        ],
    },
    {
        type: "mobile_devices",
        tags: ["fragile", "high_value"],
        descriptions: [
            "iPhone, Case, Charger, Earphones",
            "Android phone, Screen protector, Cable",
            "Tablet, Stylus, Cover",
        ],
    },
    {
        type: "computer_accessories",
        tags: ["fragile", "no_stack"],
        descriptions: [
            "Monitor, HDMI cable, Stand",
            "External hard drive, USB hub, Cables",
            "Mechanical keyboard, Mouse pad, Wrist rest",
        ],
    },
    {
        type: "appliances_small",
        tags: ["fragile", "bulky"],
        descriptions: [
            "Blender, Toaster, Kettle",
            "Iron, Hair dryer, Curling wand",
            "Air fryer, Electric cooker, Thermos",
        ],
    },
    {
        type: "fashion_clothing",
        tags: ["no_stack"],
        descriptions: [
            "Ankara dress, Blazer, Trousers",
            "Native wear, Agbada, Cap",
            "Casual shirts, Jeans, Shorts",
        ],
    },
    {
        type: "shoes_bags",
        tags: ["no_stack", "fragile"],
        descriptions: [
            "Sneakers, Dress shoes, Sandals",
            "Handbag, Backpack, Clutch",
            "Loafers, Heels, Slippers",
        ],
    },
    {
        type: "cosmetics_personal_care",
        tags: ["liquid", "fragile"],
        descriptions: [
            "Perfume, Body lotion, Face cream",
            "Makeup kit, Foundation, Brushes",
            "Shampoo, Conditioner, Body wash",
        ],
    },
    {
        type: "groceries_dry",
        tags: ["no_stack"],
        descriptions: [
            "Rice, Beans, Semolina, Spaghetti",
            "Flour, Sugar, Salt, Seasoning cubes",
            "Oats, Cornflakes, Milk powder, Tea bags",
        ],
    },
    {
        type: "groceries_fresh",
        tags: ["perishable", "cold_chain"],
        descriptions: [
            "Tomatoes, Peppers, Onions, Vegetables",
            "Fish, Chicken, Beef, Turkey",
            "Fruits, Yoghurt, Fresh milk, Eggs",
        ],
    },
    {
        type: "prepared_food",
        tags: ["hot_food", "perishable"],
        descriptions: [
            "Jollof rice, Fried chicken, Coleslaw, Plantain",
            "Egusi soup, Pounded yam, Assorted meat",
            "Pepper soup, Goat meat, Bread rolls",
        ],
    },
    {
        type: "bakery_items",
        tags: ["perishable", "no_stack"],
        descriptions: [
            "Fish pie, Eggrolls, Jam, Donut, Buns",
            "Cupcakes, Croissant, Bread loaf, Cookies",
            "Doughnuts, Cinnamon roll, Bagel, Muffins",
        ],
    },
    {
        type: "pharmaceuticals_otc",
        tags: ["fragile", "upright_only"],
        descriptions: [
            "Paracetamol, Vitamin C, Cough syrup",
            "Antacid, Pain relief gel, Eye drops",
            "Multivitamins, Zinc tablets, Nasal spray",
        ],
    },
    {
        type: "prescription_medicine",
        tags: ["fragile", "upright_only", "high_value"],
        descriptions: [
            "Antibiotics, Blood pressure meds, Insulin",
            "Asthma inhaler, Diabetic supplies, Syringes",
            "Chemotherapy drugs, Immunosuppressants",
        ],
    },
    {
        type: "medical_supplies",
        tags: ["fragile", "no_stack"],
        descriptions: [
            "Surgical gloves, Syringes, Bandages",
            "Blood pressure monitor, Glucometer, Strips",
            "Face masks, Hand sanitizer, Thermometer",
        ],
    },
    {
        type: "flowers_plants",
        tags: ["fragile", "perishable", "upright_only"],
        descriptions: [
            "Roses, Lilies, Baby breath, Ribbon",
            "Potted orchid, Succulent, Fertilizer",
            "Sunflowers, Tulips, Wrapped bouquet",
        ],
    },
    {
        type: "books_stationery",
        tags: ["no_stack"],
        descriptions: [
            "Textbooks, Notebooks, Pens, Highlighters",
            "Novel, Journal, Sticky notes, Markers",
            "Engineering drawing set, Ruler, Calculator",
        ],
    },
    {
        type: "furniture_small",
        tags: ["bulky", "no_stack"],
        descriptions: [
            "Study chair, Lamp, Side table",
            "Shelving unit, Wall clock, Mirror",
            "Bean bag, Floor mat, Ottoman",
        ],
    },
    {
        type: "home_decor",
        tags: ["fragile", "no_stack"],
        descriptions: [
            "Picture frames, Vases, Candles, Figurines",
            "Wall art, Decorative bowls, Table runner",
            "Throw pillows, Curtain rods, Artificial flowers",
        ],
    },
    {
        type: "household_items",
        tags: ["bulky"],
        descriptions: [
            "Plates, Cups, Cutlery, Pot",
            "Bedsheets, Pillowcases, Duvet, Towels",
            "Cleaning supplies, Mop, Dustpan, Broom",
        ],
    },
    {
        type: "automobile_parts",
        tags: ["bulky", "no_stack"],
        descriptions: [
            "Car battery, Wipers, Brake pads",
            "Side mirror, Headlight bulb, Fuse box",
            "Engine oil, Filter, Spark plugs",
        ],
    },
    {
        type: "laundry",
        tags: ["no_stack"],
        descriptions: [
            "Washed shirts, Trousers, Suits",
            "Dry cleaned gowns, Native wear, Jackets",
            "Folded bedsheets, Duvet, Pillowcases",
        ],
    },
    {
        type: "alcohol_beverages",
        tags: ["liquid", "fragile", "upright_only"],
        descriptions: [
            "Red wine, White wine, Champagne",
            "Whiskey, Vodka, Gin, Rum",
            "Beer pack, Cider, Craft drinks",
        ],
    },
    {
        type: "jewelry_valuables",
        tags: ["fragile", "high_value"],
        descriptions: [
            "Gold necklace, Earrings, Bracelet",
            "Diamond ring, Wristwatch, Cufflinks",
            "Silver chain, Anklet, Brooch",
        ],
    },
    {
        type: "toys_games",
        tags: ["fragile", "no_stack"],
        descriptions: [
            "Action figures, Board game, Puzzle",
            "Remote control car, Drone, Lego set",
            "Doll, Play kitchen, Toy blocks",
        ],
    },
    {
        type: "sports_equipment",
        tags: ["bulky"],
        descriptions: [
            "Football boots, Jersey, Shin guards",
            "Yoga mat, Resistance bands, Jump rope",
            "Tennis racket, Badminton set, Shuttlecock",
        ],
    },
    {
        type: "pet_food",
        tags: ["perishable"],
        descriptions: [
            "Dog food, Dog treats, Chew bones",
            "Cat food, Cat milk, Hairball remedy",
            "Fish flakes, Turtle food, Bird seed",
        ],
    },
    {
        type: "returns_parcel",
        tags: ["returns_parcel"],
        descriptions: [
            "Returned clothing item, Original packaging",
            "Defective electronics return, Accessories",
            "Wrong item return, Invoice copy",
        ],
    },
    {
        type: "mixed_goods",
        tags: ["no_stack", "fragile"],
        descriptions: [
            "Groceries, Toiletries, Stationery, Snacks",
            "Electronics, Clothing, Documents, Accessories",
            "Food items, Drinks, Personal care, Books",
        ],
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

    const productValue = randomInt(6, 30) * 500;
    const offerPrice =
        Math.round((productValue * (0.2 + Math.random() * 0.15)) / 50) * 50;
    const weight = randomInt(1, 30) * 0.5;
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);
    const phone = `${randomItem(phonePrefixes)}${randomInt(1000000, 9999999)}`;

    return {
        description,
        from: location.from,
        isFragile: selectedTags.includes("fragile"),
        packageType: profile.type,
        handlingTags: selectedTags,
        noOfPackages: randomInt(1, 10),
        offerPrice,
        productImage: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
        productValue,
        receiver: {
            name: `${firstName} ${lastName}`,
            phone,
        },
        to: location.to,
        weightOfPackages: weight,
        durationMin: location.durationMin,
        distanceKm: location.distanceKm,
    };
};

const createAndBroadcast = async (index) => {
    const payload = generatePayload(index);

    // 1. Create delivery
    const createRes = await axios.post(`${BASE_URL}/deliveries/init`, payload, {
        headers,
    });

    const deliveryId = createRes.data.data.deliveryId;
    console.log(`[${index}/${TOTAL}] ✅ Created:     ${deliveryId}`);

    // 2. Broadcast delivery
    await axios.post(
        `${BASE_URL}/deliveries/${deliveryId}/publish`,
        {},
        { headers },
    );

    console.log(`[${index}/${TOTAL}] 📡 Broadcasted: ${deliveryId}`);
};

const run = async () => {
    console.log(`Starting — ${TOTAL} deliveries to create and broadcast\n`);

    let successCount = 0;
    let failCount = 0;

    for (let i = 1; i <= TOTAL; i++) {
        try {
            await createAndBroadcast(i);
            successCount++;
        } catch (err) {
            failCount++;
            const message = err.response
                ? `HTTP ${err.response.status} — ${JSON.stringify(err.response.data)}`
                : err.message;
            console.error(`[${i}/${TOTAL}] ❌ Failed: ${message}`);
        }
    }

    console.log(`\n✅ Done — ${successCount} succeeded, ${failCount} failed`);
};

run();
