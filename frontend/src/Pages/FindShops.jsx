import React, { useEffect, useState, useCallback } from 'react'
import List1 from '../Components/List1'
import ShopMap from '../Components/ShopMap'
import { useParams } from 'react-router-dom'
import { FaMap, FaList } from 'react-icons/fa'
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

    const fetchLaundries = useCallback(async (page = 1, bounds = null) => {
        try {
            setLoading(true);
            const params = { page, per_page: 9 };
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
    }, [filter, selectedCity, search]);

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

    return (
        <main>
            <div className='container mx-auto'>
                {/* View toggle */}
                <div className='flex justify-end px-4 md:px-8 pt-4'>
                    <div className='flex bg-gray-100 rounded-xl p-1 gap-1'>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                viewMode === 'list'
                                    ? 'bg-white text-[#0EA5C9] shadow-sm'
                                    : 'text-[#62707D] hover:text-[#1E2A36]'
                            }`}
                        >
                            <FaList size={14} /> List
                        </button>
                        <button
                            onClick={() => setViewMode('map')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                viewMode === 'map'
                                    ? 'bg-white text-[#0EA5C9] shadow-sm'
                                    : 'text-[#62707D] hover:text-[#1E2A36]'
                            }`}
                        >
                            <FaMap size={14} /> Map
                        </button>
                    </div>
                </div>

                {viewMode === 'map' ? (
                    <ShopMap
                        laundries={laundries}
                        onBoundsChange={handleMapBoundsChange}
                        onClearFilter={handleClearMapFilter}
                        mapBounds={mapBounds}
                        loading={loading}
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
