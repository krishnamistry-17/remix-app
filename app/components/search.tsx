const Search = ({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (search: string) => void;
}) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  return (
    <div className="mx-2 my-2 flex justify-center">
      <input
        type="search"
        placeholder="Search"
        value={search}
        className="w-full rounded-md border border-gray-300  px-3 py-2 focus:outline-none focus:ring-0 max-w-md "
        onChange={handleSearch}
      />
    </div>
  );
};
export default Search;
