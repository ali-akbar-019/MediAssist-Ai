import { Request, Response } from "express";
import { successResponse } from "../utils/helpers";

interface HospitalResult {
    placeId: string;
    name: string;
    address: string;
    location: { lat: number; lng: number };
    distance?: string;
    phone?: string;
    type: string;
    imageUrl?: string;
    city: string;
}

const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): string => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`;
};

const getHospitalImage = (name: string): string => {
    const seed = encodeURIComponent(name);
    return `https://picsum.photos/seed/${seed}/400/300`;
};

// Complete Pakistan Hospitals Database
const PAKISTAN_HOSPITALS: HospitalResult[] = [
    // ============ ISLAMABAD ============
    { placeId: "isb1", name: "Shifa International Hospital", address: "H-8/4, Islamabad", location: { lat: 33.6518, lng: 73.0089 }, phone: "051-8464646", type: "hospital", city: "Islamabad", imageUrl: getHospitalImage("Shifa") },
    { placeId: "isb2", name: "Pakistan Institute of Medical Sciences (PIMS)", address: "G-8/3, Islamabad", location: { lat: 33.6418, lng: 73.0256 }, phone: "051-9261170", type: "hospital", city: "Islamabad", imageUrl: getHospitalImage("PIMS") },
    { placeId: "isb3", name: "Kulsum International Hospital", address: "Main Murree Rd, Islamabad", location: { lat: 33.6481, lng: 73.0708 }, phone: "051-111-554-554", type: "hospital", city: "Islamabad", imageUrl: getHospitalImage("Kulsum") },
    { placeId: "isb4", name: "Ali Medical Centre", address: "F-8 Markaz, Islamabad", location: { lat: 33.7194, lng: 73.0849 }, phone: "051-111-465-465", type: "hospital", city: "Islamabad", imageUrl: getHospitalImage("Ali Medical") },
    { placeId: "isb5", name: "Quaid-e-Azam International Hospital", address: "Park Road, Islamabad", location: { lat: 33.7182, lng: 73.0896 }, phone: "051-111-555-666", type: "hospital", city: "Islamabad", imageUrl: getHospitalImage("Quaid-e-Azam") },
    { placeId: "isb6", name: "Maroof International Hospital", address: "F-10 Markaz, Islamabad", location: { lat: 33.6884, lng: 73.0315 }, phone: "051-111-627-663", type: "hospital", city: "Islamabad", imageUrl: getHospitalImage("Maroof") },

    // ============ RAWALPINDI ============
    { placeId: "rwp1", name: "Rawalpindi General Hospital", address: "Tipu Road, Rawalpindi", location: { lat: 33.5814, lng: 73.0379 }, phone: "051-9330225", type: "hospital", city: "Rawalpindi", imageUrl: getHospitalImage("Rawalpindi General") },
    { placeId: "rwp2", name: "Benazir Bhutto Hospital", address: "Murree Road, Rawalpindi", location: { lat: 33.5968, lng: 73.0443 }, phone: "051-9330225", type: "hospital", city: "Rawalpindi", imageUrl: getHospitalImage("Benazir Bhutto") },
    { placeId: "rwp3", name: "Holy Family Hospital", address: "Saddar, Rawalpindi", location: { lat: 33.5997, lng: 73.0443 }, type: "hospital", city: "Rawalpindi", imageUrl: getHospitalImage("Holy Family") },
    { placeId: "rwp4", name: "District Headquarters Hospital", address: "Rawalpindi", location: { lat: 33.6024, lng: 73.0450 }, type: "hospital", city: "Rawalpindi", imageUrl: getHospitalImage("DHQ Rawalpindi") },
    { placeId: "rwp5", name: "Bilal Hospital", address: "Chandni Chowk, Rawalpindi", location: { lat: 33.5954, lng: 73.0739 }, type: "hospital", city: "Rawalpindi", imageUrl: getHospitalImage("Bilal") },
    { placeId: "rwp6", name: "Bhatti International Hospital", address: "6th Road, Rawalpindi", location: { lat: 33.6102, lng: 73.0729 }, phone: "051-4851861", type: "hospital", city: "Rawalpindi", imageUrl: getHospitalImage("Bhatti") },
    { placeId: "rwp7", name: "Combined Military Hospital (CMH)", address: "Rawalpindi", location: { lat: 33.5935, lng: 73.0588 }, type: "hospital", city: "Rawalpindi", imageUrl: getHospitalImage("CMH") },

    // ============ LAHORE ============
    { placeId: "lhe1", name: "Mayo Hospital", address: "Mall Road, Lahore", location: { lat: 31.5546, lng: 74.3080 }, phone: "042-99211100", type: "hospital", city: "Lahore", imageUrl: getHospitalImage("Mayo") },
    { placeId: "lhe2", name: "Jinnah Hospital", address: "Jail Road, Lahore", location: { lat: 31.5204, lng: 74.3367 }, phone: "042-99262300", type: "hospital", city: "Lahore", imageUrl: getHospitalImage("Jinnah") },
    { placeId: "lhe3", name: "Services Hospital", address: "Jail Road, Lahore", location: { lat: 31.5540, lng: 74.3325 }, type: "hospital", city: "Lahore", imageUrl: getHospitalImage("Services") },
    { placeId: "lhe4", name: "Shaukat Khanum Hospital", address: "Johar Town, Lahore", location: { lat: 31.4854, lng: 74.3535 }, phone: "0800-74974", type: "hospital", city: "Lahore", imageUrl: getHospitalImage("Shaukat Khanum") },
    { placeId: "lhe5", name: "Doctors Hospital", address: "Johar Town, Lahore", location: { lat: 31.4680, lng: 74.2615 }, type: "hospital", city: "Lahore", imageUrl: getHospitalImage("Doctors") },
    { placeId: "lhe6", name: "Fatima Memorial Hospital", address: "Shadman, Lahore", location: { lat: 31.5289, lng: 74.3394 }, type: "hospital", city: "Lahore", imageUrl: getHospitalImage("Fatima Memorial") },
    { placeId: "lhe7", name: "Ittefaq Hospital", address: "Ferozepur Road, Lahore", location: { lat: 31.4598, lng: 74.3463 }, type: "hospital", city: "Lahore", imageUrl: getHospitalImage("Ittefaq") },
    { placeId: "lhe8", name: "National Hospital", address: "DHA, Lahore", location: { lat: 31.4265, lng: 74.3794 }, type: "hospital", city: "Lahore", imageUrl: getHospitalImage("National") },

    // ============ KARACHI ============
    { placeId: "khi1", name: "Aga Khan University Hospital", address: "Karachi", location: { lat: 24.8888, lng: 67.0782 }, phone: "021-111-911-911", type: "hospital", city: "Karachi", imageUrl: getHospitalImage("Aga Khan") },
    { placeId: "khi2", name: "Civil Hospital Karachi", address: "Karachi", location: { lat: 24.8586, lng: 67.0148 }, phone: "021-99215000", type: "hospital", city: "Karachi", imageUrl: getHospitalImage("Civil") },
    { placeId: "khi3", name: "Jinnah Postgraduate Medical Centre", address: "Karachi", location: { lat: 24.8481, lng: 67.0368 }, type: "hospital", city: "Karachi", imageUrl: getHospitalImage("JPMC") },
    { placeId: "khi4", name: "Liaquat National Hospital", address: "Karachi", location: { lat: 24.8925, lng: 67.0766 }, type: "hospital", city: "Karachi", imageUrl: getHospitalImage("Liaquat") },
    { placeId: "khi5", name: "South City Hospital", address: "Karachi", location: { lat: 24.8091, lng: 67.0296 }, type: "hospital", city: "Karachi", imageUrl: getHospitalImage("South City") },
    { placeId: "khi6", name: "Ziauddin Hospital", address: "Clifton, Karachi", location: { lat: 24.8079, lng: 67.0318 }, type: "hospital", city: "Karachi", imageUrl: getHospitalImage("Ziauddin") },
    { placeId: "khi7", name: "Indus Hospital", address: "Korangi, Karachi", location: { lat: 24.8432, lng: 67.1848 }, type: "hospital", city: "Karachi", imageUrl: getHospitalImage("Indus") },

    // ============ MULTAN ============
    { placeId: "mul1", name: "Nishtar Hospital", address: "Multan", location: { lat: 30.1914, lng: 71.4581 }, type: "hospital", city: "Multan", imageUrl: getHospitalImage("Nishtar") },
    { placeId: "mul2", name: "Children's Hospital Complex", address: "Multan", location: { lat: 30.1948, lng: 71.4722 }, type: "hospital", city: "Multan", imageUrl: getHospitalImage("Childrens Hospital") },
    { placeId: "mul3", name: "Chungi No. 9 Hospital", address: "Multan", location: { lat: 30.2006, lng: 71.4418 }, type: "hospital", city: "Multan", imageUrl: getHospitalImage("Chungi") },

    // ============ FAISALABAD ============
    { placeId: "fsb1", name: "Allied Hospital", address: "Faisalabad", location: { lat: 31.4180, lng: 73.0811 }, type: "hospital", city: "Faisalabad", imageUrl: getHospitalImage("Allied") },
    { placeId: "fsb2", name: "DHQ Hospital", address: "Faisalabad", location: { lat: 31.4301, lng: 73.0912 }, type: "hospital", city: "Faisalabad", imageUrl: getHospitalImage("DHQ Faisalabad") },
    { placeId: "fsb3", name: "Aziz Fatima Hospital", address: "Faisalabad", location: { lat: 31.4063, lng: 73.0725 }, type: "hospital", city: "Faisalabad", imageUrl: getHospitalImage("Aziz Fatima") },

    // ============ PESHAWAR ============
    { placeId: "psh1", name: "Lady Reading Hospital", address: "Peshawar", location: { lat: 34.0153, lng: 71.5797 }, type: "hospital", city: "Peshawar", imageUrl: getHospitalImage("Lady Reading") },
    { placeId: "psh2", name: "Hayatabad Medical Complex", address: "Peshawar", location: { lat: 33.9940, lng: 71.4593 }, type: "hospital", city: "Peshawar", imageUrl: getHospitalImage("Hayatabad") },
    { placeId: "psh3", name: "Khyber Teaching Hospital", address: "Peshawar", location: { lat: 34.0134, lng: 71.5617 }, type: "hospital", city: "Peshawar", imageUrl: getHospitalImage("Khyber") },

    // ============ QUETTA ============
    { placeId: "qta1", name: "Civil Hospital Quetta", address: "Quetta", location: { lat: 30.1924, lng: 67.0002 }, type: "hospital", city: "Quetta", imageUrl: getHospitalImage("Civil Quetta") },
    { placeId: "qta2", name: "Sandeman Provincial Hospital", address: "Quetta", location: { lat: 30.2051, lng: 67.0097 }, type: "hospital", city: "Quetta", imageUrl: getHospitalImage("Sandeman") },
    { placeId: "qta3", name: "Combined Military Hospital Quetta", address: "Quetta", location: { lat: 30.1971, lng: 67.0051 }, type: "hospital", city: "Quetta", imageUrl: getHospitalImage("CMH Quetta") },

    // ============ SIALKOT ============
    { placeId: "skt1", name: "Allama Iqbal Memorial Hospital", address: "Sialkot", location: { lat: 32.4961, lng: 74.5349 }, type: "hospital", city: "Sialkot", imageUrl: getHospitalImage("Allama Iqbal") },
    { placeId: "skt2", name: "Sialkot DHQ Hospital", address: "Sialkot", location: { lat: 32.5042, lng: 74.5456 }, type: "hospital", city: "Sialkot", imageUrl: getHospitalImage("DHQ Sialkot") },

    // ============ GUJRANWALA ============
    { placeId: "grw1", name: "DHQ Hospital Gujranwala", address: "Gujranwala", location: { lat: 32.1625, lng: 74.1962 }, type: "hospital", city: "Gujranwala", imageUrl: getHospitalImage("DHQ Gujranwala") },
    { placeId: "grw2", name: "Imran Idrees Hospital", address: "Gujranwala", location: { lat: 32.1531, lng: 74.1832 }, type: "hospital", city: "Gujranwala", imageUrl: getHospitalImage("Imran Idrees") },

    // ============ HYDERABAD ============
    { placeId: "hyd1", name: "Liaquat University Hospital", address: "Hyderabad", location: { lat: 25.3964, lng: 68.3665 }, type: "hospital", city: "Hyderabad", imageUrl: getHospitalImage("Liaquat Hyderabad") },
    { placeId: "hyd2", name: "Civil Hospital Hyderabad", address: "Hyderabad", location: { lat: 25.3816, lng: 68.3735 }, type: "hospital", city: "Hyderabad", imageUrl: getHospitalImage("Civil Hyderabad") },
];

export const getNearbyHospitals = async (req: Request, res: Response): Promise<void> => {
    try {
        const { lat, lng, radius = 20000, type = "all" } = req.query;

        if (!lat || !lng) {
            res.status(400).json({ success: false, message: "Latitude and longitude are required" });
            return;
        }

        const latitude = parseFloat(lat as string);
        const longitude = parseFloat(lng as string);
        const radiusKm = parseInt(radius as string) / 1000;

        // Calculate distance for all hospitals and filter by radius
        let hospitals = PAKISTAN_HOSPITALS
            .map(hospital => ({
                ...hospital,
                distance: calculateDistance(latitude, longitude, hospital.location.lat, hospital.location.lng)
            }))
            .filter(h => {
                const dist = parseFloat(h.distance?.replace(/[^0-9.]/g, "") ?? "999999");
                return dist <= radiusKm;
            });

        // Filter by type if specified
        if (type !== "all") {
            hospitals = hospitals.filter(h => h.type === type);
        }

        // Sort by distance (closest first)
        hospitals.sort((a, b) => {
            const distA = parseFloat(a.distance?.replace(/[^0-9.]/g, "") ?? "999999");
            const distB = parseFloat(b.distance?.replace(/[^0-9.]/g, "") ?? "999999");
            return distA - distB;
        });

        res.status(200).json(successResponse({
            hospitals: hospitals.slice(0, 25),
            total: hospitals.length,
            center: { lat: latitude, lng: longitude },
            source: "Pakistan Healthcare Database"
        }, `Found ${hospitals.length} medical facilities near you`));

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Error fetching hospitals" });
    }
};

export const searchHospitals = async (req: Request, res: Response): Promise<void> => {
    try {
        const { query, lat, lng } = req.query;

        if (!query) {
            res.status(400).json({ success: false, message: "Search query is required" });
            return;
        }

        const searchTerm = (query as string).toLowerCase();

        let hospitals = PAKISTAN_HOSPITALS.filter(h =>
            h.name.toLowerCase().includes(searchTerm) ||
            h.address.toLowerCase().includes(searchTerm) ||
            h.city.toLowerCase().includes(searchTerm)
        );

        if (lat && lng) {
            const latitude = parseFloat(lat as string);
            const longitude = parseFloat(lng as string);
            hospitals = hospitals.map(h => ({
                ...h,
                distance: calculateDistance(latitude, longitude, h.location.lat, h.location.lng)
            }));
            hospitals.sort((a, b) => {
                const distA = parseFloat(a.distance?.replace(/[^0-9.]/g, "") ?? "999999");
                const distB = parseFloat(b.distance?.replace(/[^0-9.]/g, "") ?? "999999");
                return distA - distB;
            });
        }

        res.status(200).json(successResponse({
            hospitals,
            total: hospitals.length,
            searchedFor: query
        }, `Found ${hospitals.length} hospitals matching "${query}"`));

    } catch (error) {
        res.status(500).json({ success: false, message: "Error searching hospitals" });
    }
};

export const getHospitalPhoto = async (req: Request, res: Response): Promise<void> => {
    try {
        const { photoReference } = req.params;
        const placeholderUrl = `https://picsum.photos/seed/${photoReference}/400/300`;
        res.status(200).json(successResponse({
            photoUrl: placeholderUrl,
            photoReference: photoReference
        }, "Photo URL generated"));
    } catch (error) {
        res.status(500).json({ success: false, message: "Error" });
    }
};