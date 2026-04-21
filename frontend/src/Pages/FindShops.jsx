import React, { useEffect, useState, useCallback } from 'react'
import List1 from '../Components/List1'
import ShopMap from '../Components/ShopMap'
import { useParams } from 'react-router-dom'
import { FaMap, FaList } from 'react-icons/fa'
import { IoLocationOutline } from 'react-icons/io5'
import API from '../utils/api';

const FindShops = () => {
    const { service: serviceParam } = useParams();

    const [laundries, setLaundries] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState('list');
    const [mapBounds, setMapBounds] = useState(null);
    const [servicesList, setServicesList] = useState([]);
    const [citiesList, setCitiesList] = useState([]);
    const [myLocation, setMyLocation] = useState(null);
    const [locating, setLocating] = useState(false);
    const [mapError, setMapError] = useState('');

    // Filter state (lifted here so API calls include them)
    const [filter, setFilter] = useState(serviceParam || "All Services");
    const [selectedCity, setSelectedCity] = useState("All Cities");
    const [search, setSearch] = useState("");
    const [sortType, setSortType] = useState("rating");

    // Fetch available filters from DB
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const res = await API.get("/laundries/filters");
                setServicesList(res.data.services || []);
                setCitiesList(res.data.cities || []);
            } catch (error) {
                console.error("Error fetching filters:", error);
            }
        };
        fetchFilters();
    }, []);

    const buildBoundsAround = (lat, lng, radiusKm = 10) => {
        const latDelta = radiusKm / 111;
        const lngDelta = radiusKm / (111 * Math.max(Math.cos((lat * Math.PI) / 180), 0.2));
        return {
            sw_lat: lat - latDelta,
            sw_lng: lng - lngDelta,
            ne_lat: lat + latDelta,
            ne_lng: lng + lngDelta,
        };
    };

    const fetchLaundries = useCallback(async (page = 1, bounds = null) => {
        try {
            setLoading(true);
            const params = { page, per_page: viewMode === 'map' ? 100 : 9 };
            if (bounds) {
                params.sw_lat = bounds.sw_lat;
                params.sw_lng = bounds.sw_lng;
                params.ne_lat = bounds.ne_lat;
                params.ne_lng = bounds.ne_lng;
            }
            if (filter !== "All Services") {
                params.service = filter;
            }
            if (selectedCity !== "All Cities") {
                params.address = selectedCity;
            }
            if (search.trim()) {
                params.name = search.trim();
            }
            const res = await API.get("/laundries", { params });
            setLaundries(res.data.data);
            setCurrentPage(res.data.current_page);
            setTotalPages(res.data.last_page);
            setTotal(res.data.total);
        } catch (error) {
            console.error("Error fetching laundries:", error);
        } finally {
            setLoading(false);
        }
    }, [filter, selectedCity, search, viewMode]);

    // Refetch when filters change
    useEffect(() => {
        fetchLaundries(1, mapBounds);
    }, [fetchLaundries]);

    const handlePageChange = (page) => {
        fetchLaundries(page, mapBounds);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleMapBoundsChange = (bounds) => {
        setMapBounds(bounds);
        fetchLaundries(1, bounds);
    };

    const handleClearMapFilter = () => {
        setMapBounds(null);
        fetchLaundries(1, null);
    };

    const handleClearAll = () => {
        setFilter("All Services");
        setSelectedCity("All Cities");
        setSearch("");
        setSortType("rating");
    };

    const handleOpenMap = () => {
        setViewMode('map');
        setMapError('');
    };

    const handleOpenMapNearMe = () => {
        setViewMode('map');
        setMapError('');

        if (!navigator.geolocation) {
            setMapError('Geolocation is not supported by your browser.');
            return;
        }

        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                const location = { lat: coords.latitude, lng: coords.longitude };
                const nearbyBounds = buildBoundsAround(coords.latitude, coords.longitude, 10);
                setMyLocation(location);
                setMapBounds(nearbyBounds);
                fetchLaundries(1, nearbyBounds);
                setLocating(false);
            },
            () => {
                setMapError('Unable to access your location. Please allow location permission and try again.');
                setLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    return (
        <main>
            <div className='container mx-auto'>
                {/* View toggle */}
                <div className='flex justify-between items-center px-4 md:px-8 pt-4 gap-3 flex-wrap'>
                    <div className='flex items-center gap-2'>
                        <button
                            onClick={handleOpenMap}
                            className='flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-[#0C8CE9] text-white hover:bg-[#0a78c8] transition-colors'
                        >
                            <FaMap size={14} /> Open Map
                        </button>
                        <button
                            onClick={handleOpenMapNearMe}
                            disabled={locating}
                            className='flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border border-[#0C8CE9]/30 text-[#0C8CE9] hover:bg-sky-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            <IoLocationOutline size={16} /> {locating ? 'Locating...' : 'Near Me'}
                        </button>
                    </div>
                    <div className='flex bg-gray-100 rounded-xl p-1 gap-1'>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                viewMode === 'list'
                                    ? 'bg-white text-[#0C8CE9] shadow-sm'
                                    : 'text-[#64748B] hover:text-[#0F172A]'
                            }`}
                        >
                            <FaList size={14} /> List
                        </button>
                        <button
                            onClick={() => setViewMode('map')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                viewMode === 'map'
                                    ? 'bg-white text-[#0C8CE9] shadow-sm'
                                    : 'text-[#64748B] hover:text-[#0F172A]'
                            }`}
                        >
                            <FaMap size={14} /> Map
                        </button>
                    </div>
                </div>

                {mapError && (
                    <div className='px-4 md:px-8 pt-3'>
                        <p className='text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2'>
                            {mapError}
                        </p>
                    </div>
                )}

                {viewMode === 'map' ? (
                    <ShopMap
                        laundries={laundries}
                        onBoundsChange={handleMapBoundsChange}
                        onClearFilter={handleClearMapFilter}
                        mapBounds={mapBounds}
                        loading={loading}
                        focusLocation={myLocation}
                    />
                ) : (
                    <List1
                        laundries={laundries}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        total={total}
                        onPageChange={handlePageChange}
                        loading={loading}
                        servicesList={servicesList}
                        citiesList={citiesList}
                        filter={filter}
                        setFilter={setFilter}
                        selectedCity={selectedCity}
                        setSelectedCity={setSelectedCity}
                        search={search}
                        setSearch={setSearch}
                        sortType={sortType}
                        setSortType={setSortType}
                        handleClear={handleClearAll}
                    />
                )}
            </div>
        </main>
    )
}

export default FindShops
