import React from "react";
import Filter1 from "./Filter1";
import { IoSearchOutline } from "react-icons/io5";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import Item1 from "./Item1";

function List1({
  laundries,
  currentPage,
  totalPages,
  total,
  onPageChange,
  loading,
  servicesList,
  citiesList,
  filter,
  setFilter,
  selectedCity,
  setSelectedCity,
  search,
  setSearch,
  sortType,
  setSortType,
  handleClear,
}) {

  const isDirty =
    filter !== "All Services" ||
    selectedCity !== "All Cities" ||
    sortType !== "rating" ||
    search !== "";

  return (
    <div className="main-content mx-auto">
      <div>
        <Filter1
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
          sortType={sortType}
          setSortType={setSortType}
          isDirty={isDirty}
          handleClear={handleClear}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          servicesList={servicesList}
          citiesList={citiesList}
        />
      </div>

      <div className="px-4 md:px-8 pt-8 pb-10 max-w-7xl mx-auto">
        <div className="mb-6">
          {search ? (
            <h2 className="text-2xl font-bold text-[#0F172A]">
              Results for "<span className="text-[#0C8CE9]">{search}</span>"
            </h2>
          ) : (
            <h2 className="text-2xl font-bold text-[#0F172A]">
              All <span className="text-[#0C8CE9]">Laundry Shops</span>
            </h2>
          )}
          <p className="text-sm text-[#64748B] mt-1">
            {total} shops found{" "}
            {totalPages > 1 && `— Page ${currentPage} of ${totalPages}`}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-3 border-[#0C8CE9] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
              {laundries?.map((re) => (
                <div key={re.id} className="col-span-1">
                  <Item1 {...re} />
                </div>
              ))}

              {laundries.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                    <IoSearchOutline className="text-2xl text-[#64748B]" />
                  </div>
                  <h2 className="text-xl font-bold text-[#0F172A] mb-2">
                    No shops found
                  </h2>
                  <p className="text-[#64748B] text-sm mb-5 max-w-sm">
                    Try adjusting your filters or search query to find what
                    you're looking for
                  </p>
                  <button
                    className="px-6 py-2.5 rounded-xl bg-[#0C8CE9] text-white text-sm font-semibold hover:bg-[#0C8CE9]/90 transition-colors"
                    onClick={handleClear}
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <button
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-lg flex items-center justify-center border border-gray-200 text-[#0F172A] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                >
                  <MdNavigateBefore size={22} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 1,
                  )
                  .reduce((acc, page, idx, arr) => {
                    if (idx > 0 && page - arr[idx - 1] > 1) acc.push("...");
                    acc.push(page);
                    return acc;
                  }, [])
                  .map((page, idx) =>
                    page === "..." ? (
                      <span key={`dots-${idx}`} className="px-1 text-[#64748B]">
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`w-10 h-10 rounded-lg text-sm font-semibold transition-colors ${
                          currentPage === page
                            ? "bg-[#0C8CE9] text-white"
                            : "border border-gray-200 text-[#0F172A] hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}

                <button
                  onClick={() =>
                    onPageChange(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-lg flex items-center justify-center border border-gray-200 text-[#0F172A] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                >
                  <MdNavigateNext size={22} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default List1;
