import React, { useState, useEffect } from "react";

// Define types for the acronym data
interface Acronym {
  abbreviation: string;
  source_id: number;
  acronym_id: number;
  expansion: string;
  source: string;
}

// Import the acronyms JSON data from the 'src/data' folder
import acronymsData from "./data/acronyms.json";

const AcronymSearch: React.FC = () => {
  // Initialize state as empty
  const [acronyms, setAcronyms] = useState<Acronym[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredAcronyms, setFilteredAcronyms] = useState<Acronym[]>([]);

  // Load the acronyms data when the component mounts
  useEffect(() => {
    const loadAcronyms = () => {
      const acronymsDatabase = JSON.parse(JSON.stringify(acronymsData));

      const uniqueAcronyms: Acronym[] = Array.from(
        new Map(
          acronymsDatabase.map((a: Acronym) => [a.acronym_id, a])
        ).values()
      ) as Acronym[];

      setAcronyms(uniqueAcronyms);
    };

    loadAcronyms();
  }, []); // Empty dependency array ensures this runs once on mount

  // Filter acronyms as the user types in the search bar
  useEffect(() => {
    if (searchTerm.length >= 1) {
      const words = searchTerm.toLowerCase().trim().split(/\s+/); // Split into words
      const filtered = acronyms
        .filter((acronym) =>
          words.every(
            (word) =>
              acronym.abbreviation.toLowerCase().includes(word) ||
              acronym.expansion.toLowerCase().includes(word)
          )
        )
        .sort((a, b) => a.abbreviation.localeCompare(b.abbreviation)) // Sort alphabetically
        .slice(0, 20); // Limit to 20 results
      setFilteredAcronyms(filtered);
    } else {
      setFilteredAcronyms([]); // Clear results if less than 2 characters
    }
  }, [searchTerm, acronyms]);

  return (
    <div className="container">
      <h1>NASA Acronyms Search</h1>
      <input
        type="text"
        placeholder="Search for an acronym"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />
      <div className="acronym-list">
        {filteredAcronyms.length === 0 ? (
          <p>No acronyms found.</p>
        ) : (
          filteredAcronyms.map((acronym) => (
            <div key={acronym.acronym_id} className="acronym-item">
              <p>
                <strong>{acronym.abbreviation}</strong> = {acronym.expansion} (
                {acronym.source})
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AcronymSearch;
