import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MapPin,
    Search,
    Star,
    Clock,
    Navigation,
    Loader2,
    Hospital,
    AlertCircle,
} from "lucide-react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useLocation } from "../../hooks/useLocation";
import type { Hospital as HospitalType } from "../../types";
import api from "../../services/api";
import { cn, debounce } from "../../lib/utils";

const HospitalFinder = () => {
    const [hospitals, setHospitals] = useState<HospitalType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState
        <"hospital" | "clinic" | "pharmacy"
        >("hospital");

    const { location, isLoading: isLocating, getLocation, permissionStatus } =
        useLocation();

    const filters = [
        { value: "hospital", label: "Hospitals" },
        { value: "clinic", label: "Clinics" },
        { value: "pharmacy", label: "Pharmacies" },
    ] as const;

    const fetchNearbyHospitals = async (
        lat: number,
        lng: number,
        type: string
    ) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await api.get("/api/hospitals/nearby", {
                params: { lat, lng, radius: 20000, type },
            });
            setHospitals(response.data.data.hospitals);
        } catch {
            setError("Failed to fetch nearby hospitals. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGetLocation = async () => {
        const loc = await getLocation();
        if (loc) {
            await fetchNearbyHospitals(loc.lat, loc.lng, activeFilter);
        }
    };

    const handleSearch = debounce(async (query: any) => {
        if (!query.trim()) return;
        try {
            setIsLoading(true);
            setError(null);
            const response = await api.get("/api/hospitals/search", {
                params: {
                    query,
                    ...(location && { lat: location.lat, lng: location.lng }),
                },
            });
            setHospitals(response.data.data.hospitals);
        } catch {
            setError("Search failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, 600);

    useEffect(() => {
        if (location) {
            fetchNearbyHospitals(location.lat, location.lng, activeFilter);
        }
    }, [activeFilter]);

    const openInMaps = (hospital: HospitalType) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${hospital.location.lat},${hospital.location.lng}&query_place_id=${hospital.placeId}`;
        window.open(url, "_blank");
    };

    return (
        <div className="space-y-6">
            {/* Search Console */}
            <div className="space-y-4">
                <div className="text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-700 mb-2">
                        Live Location Search
                    </p>
                    <p className="text-sm text-medical-muted max-w-xl mx-auto">
                        Search by name or use your location to surface nearby care options.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-medical-muted" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                handleSearch(e.target.value);
                            }}
                            placeholder="Search hospitals, clinics, pharmacies..."
                            className="pl-10 h-14 rounded-2xl border-medical-border bg-white/70 text-navy-900 placeholder:text-slate-400 focus-visible:ring-emerald-500/20"
                        />
                    </div>
                    <Button
                        onClick={handleGetLocation}
                        disabled={isLocating}
                        className="h-14 px-7 rounded-2xl bg-navy-900 hover:bg-navy-950 text-white shrink-0 font-semibold shadow-navy"
                    >
                        {isLocating ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Navigation className="w-4 h-4" />
                        )}
                        <span className="ml-2 hidden sm:inline">Near Me</span>
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {filters.map((filter) => (
                    <button
                        key={filter.value}
                        onClick={() => setActiveFilter(filter.value)}
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                            activeFilter === filter.value
                                ? "bg-navy-900 text-white border-navy-900 shadow-sm"
                                : "border-medical-border text-medical-muted hover:border-navy-900 hover:text-navy-900 hover:bg-navy-50"
                        )}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Permission Denied */}
            {permissionStatus === "denied" && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-2xl"
                >
                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-amber-800">
                            Location access denied
                        </p>
                        <p className="text-xs text-amber-700 mt-0.5">
                            Please enable location access in your browser settings to find
                            nearby hospitals, or use the search bar above.
                        </p>
                    </div>
                </motion.div>
            )}

            {/* Error */}
            {error && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 p-4 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-600"
                >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                </motion.div>
            )}

            {/* Loading */}
            {isLoading && (
                <div className="flex items-center justify-center py-14">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-navy-900" />
                        <p className="text-sm text-medical-muted">
                            Finding nearby hospitals...
                        </p>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!isLoading && hospitals.length === 0 && !error && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                >
                    <div className="w-16 h-16 rounded-2xl bg-navy-50 border border-navy-100 flex items-center justify-center mb-5">
                        <Hospital className="w-8 h-8 text-navy-900" />
                    </div>
                    <h3 className="font-heading font-semibold text-navy-900 mb-2 text-xl">
                        Find Nearby Hospitals
                    </h3>
                    <p className="text-medical-muted text-sm max-w-sm leading-relaxed">
                        Click "Near Me" to find hospitals and clinics near your current
                        location, or search by name above.
                    </p>
                </motion.div>
            )}

            {/* Hospital Cards */}
            <AnimatePresence>
                {!isLoading && hospitals.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        {hospitals.map((hospital, index) => (
                            <motion.div
                                key={hospital.placeId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="medical-card p-4 space-y-3"
                            >
                                {/* Hospital Header */}
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-navy-50 border border-navy-100 flex items-center justify-center shrink-0">
                                        <Hospital className="w-5 h-5 text-navy-900" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-semibold text-navy-900 truncate">
                                            {hospital.name}
                                        </h3>
                                        <div className="flex items-start gap-1 mt-0.5">
                                            <MapPin className="w-3 h-3 text-medical-muted shrink-0 mt-0.5" />
                                            <p className="text-xs text-medical-muted line-clamp-2">
                                                {hospital.address}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Hospital Info Row */}
                                <div className="flex items-center gap-3 flex-wrap pt-1">
                                    {/* Rating */}
                                    {hospital.rating && (
                                        <div className="flex items-center gap-1">
                                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                            <span className="text-xs font-medium text-medical-text">
                                                {hospital.rating.toFixed(1)}
                                            </span>
                                            {hospital.totalRatings && (
                                                <span className="text-xs text-medical-muted">
                                                    ({hospital.totalRatings.toLocaleString()})
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Open Status */}
                                    {hospital.isOpen !== undefined && (
                                        <div
                                            className={cn(
                                                "flex items-center gap-1",
                                                hospital.isOpen ? "text-emerald-600" : "text-red-500"
                                            )}
                                        >
                                            <Clock className="w-3 h-3" />
                                            <span className="text-xs font-medium">
                                                {hospital.isOpen ? "Open Now" : "Closed"}
                                            </span>
                                        </div>
                                    )}

                                    {/* Distance */}
                                    {hospital.distance && (
                                        <div className="flex items-center gap-1 text-medical-muted">
                                            <Navigation className="w-3 h-3" />
                                            <span className="text-xs">{hospital.distance}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Get Directions Button */}
                                <button
                                    onClick={() => openInMaps(hospital)}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-navy-900 text-navy-900 text-xs font-medium hover:bg-navy-50 transition-colors"
                                >
                                    <Navigation className="w-3.5 h-3.5" />
                                    Get Directions
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Results Count */}
            {!isLoading && hospitals.length > 0 && (
                <p className="text-xs text-medical-muted text-center pt-1">
                    Showing {hospitals.length} results
                    {location && " near your location"}
                </p>
            )}
        </div>
    );
};

export default HospitalFinder;