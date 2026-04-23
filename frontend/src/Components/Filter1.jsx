import { FaRegStar } from "react-icons/fa";
import {
  IoSearchOutline,
  IoLocationOutline,
  IoOptionsOutline,
  IoCloseCircle,
} from "react-icons/io5";

function Filter1(props) {
  const buttons = ["All Services", ...(props.servicesList || [])];

  const citiesList = [
    "Agadir",
    "Ahfir",
    "Ait Melloul",
    "Al Hoceima",
    "Asilah",
    "Azrou",
    "Beni Mellal",
    "Berkane",
    "Berrechid",
    "Casablanca",
    "Chefchaouen",
    "Dakhla",
    "El Jadida",
    "Errachidia",
    "Essaouira",
    "Fes",
    "Fnideq",
    "Guelmim",
    "Ifrane",
    "Kelaat Sraghna",
    "Kenitra",
    "Khemisset",
    "Khenifra",
    "Khouribga",
    "Laayoune",
    "Larache",
    "Marrakech",
    "Martil",
    "Meknes",
    "Mohammedia",
    "Nador",
    "Ouarzazate",
    "Oujda",
    "Rabat",
    "Safi",
    "Sale",
    "Sefrou",
    "Settat",
    "Sidi Kacem",
    "Sidi Slimane",
    "Skhirat",
    "Tangier",
    "Taroudant",
    "Taza",
    "Temara",
    "Tetouan",
    "Tiznit",
    "Youssoufia",
    "Zagora",
  ];
  const cities = ["All Cities", ...(citiesList || [])];

  return (
    <div className="sticky top-16 z-20 bg-white rounded-tl-2xl rounded-tr-2xl border-b border-gray-100 shadow-sm px-4 md:px-8 py-4 max-w-full">
      <div className="max-w-7xl mx-auto">
      {/* Search row */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        {/* Search input */}
        <div className="flex items-center gap-2.5 flex-1 bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-3 focus-within:border-[#0C8CE9] focus-within:ring-2 focus-within:ring-[#0C8CE9]/10 transition-all">
          <IoSearchOutline className="text-[#64748B] text-lg flex-shrink-0" />
          <input
            type="search"
            value={props.search}
            onChange={(e) => props.setSearch(e.target.value)}
            placeholder="Search laundry services..."
            className="w-full bg-transparent border-none outline-none text-sm text-[#0F172A] placeholder:text-[#64748B]/60"
          />
        </div>

        {/* City select */}
        <div className="flex items-center gap-2.5 bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-3 md:w-64 focus-within:border-[#0C8CE9] focus-within:ring-2 focus-within:ring-[#0C8CE9]/10 transition-all">
          <IoLocationOutline className="text-[#64748B] text-lg flex-shrink-0" />
          <select
            value={props.selectedCity || "All Cities"}
            onChange={(e) =>
              props.setSelectedCity && props.setSelectedCity(e.target.value)
            }
            className="w-full bg-transparent border-none outline-none text-sm text-[#0F172A] cursor-pointer appearance-none"
          >
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          <svg
            className="w-4 h-4 text-[#64748B] flex-shrink-0 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {/* Filters button */}
        <button
          className="flex items-center justify-center gap-2 bg-[#0C8CE9] text-white rounded-xl px-6 py-3 text-sm font-semibold hover:bg-[#0a78c8] transition-colors whitespace-nowrap"
          onClick={props.onhandleFilter}
        >
          <IoOptionsOutline className="text-base" />
          Filters
        </button>
      </div>

      {/* Filter pills */}
      <div className="flex flex-nowrap sm:flex-wrap items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
        {buttons.map((btn) => (
          <button
            key={btn}
            onClick={() => props.setFilter(btn)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              props.filter === btn
                ? "bg-[#0C8CE9] text-white shadow-sm"
                : "bg-[#F8FAFC] text-[#0F172A] border border-gray-200 hover:border-[#0C8CE9]/40 hover:text-[#0C8CE9]"
            }`}
          >
            {btn}
          </button>
        ))}

        <div className="w-px h-5 bg-gray-200 mx-1 flex-shrink-0" />

        <button
          className="flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium bg-[#F8FAFC] text-[#0F172A] border border-gray-200 hover:border-[#0C8CE9]/40 hover:text-[#0C8CE9] transition-all"
          onClick={() =>
            props.setSortType(
              props.sortType === "rating" ? "reviews" : "rating",
            )
          }
        >
          <FaRegStar className="text-xs" /> Sort by{" "}
          {props.sortType === "rating" ? "Reviews" : "Rating"}
        </button>

        {props.isDirty && (
          <button
            className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium text-red-500 hover:bg-red-50 border border-red-100 transition-colors ml-1"
            onClick={() => props.handleClear()}
          >
            <IoCloseCircle className="text-base" /> Clear All
          </button>
        )}
      </div>
      </div>
    </div>
  );
}

export default Filter1;
