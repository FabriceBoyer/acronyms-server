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
      acronymsDatabase.sort((a: Acronym, b: Acronym) =>
        a.abbreviation.localeCompare(b.abbreviation)
      ); // Sort alphabetically
      setAcronyms(acronymsDatabase);
      console.log(acronymsDatabase.length + " acronyms loaded");
    };

    loadAcronyms();
  }, []); // Empty dependency array ensures this runs once on mount

  // Filter acronyms as the user types in the search bar
  useEffect(() => {
    if (searchTerm.length >= 1) {
      const words = searchTerm.toLowerCase().trim().split(/\s+/); // Split into words
      const abbreviations = acronyms.filter((acronym) =>
        words.every((word) => acronym.abbreviation.toLowerCase().includes(word))
      );
      const expansions = acronyms.filter((acronym) =>
        words.every((word) => acronym.expansion.toLowerCase().includes(word))
      );
      // abbreviations first
      const filtered = abbreviations.concat(expansions).slice(0, 100); // Limit results
      setFilteredAcronyms(filtered);
    } else {
      setFilteredAcronyms([]); // Clear results if less than 2 characters
    }
  }, [searchTerm, acronyms]);

  // Function to highlight matched words
  const highlightMatch = (text: string, words: string[]) => {
    if (!text) return text; // If no text, return as is
    const regex = new RegExp(`(${words.join("|")})`, "gi"); // Create a regex from search words
    return text.split(regex).map((part, index) =>
      words.includes(part.toLowerCase()) ? (
        <span key={index} className="highlight">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="container">
      <h1>Acronyms Search</h1>
      <input
        type="text"
        placeholder="Search for an acronym"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
        autoFocus
      />
      <div className="acronym-list">
        {filteredAcronyms.length === 0 ? (
          <div style={{ textAlign: "center" }}>
            <p>No acronyms found</p>
          </div>
        ) : (
          filteredAcronyms.map((acronym: Acronym) => {
            const searchWords = searchTerm.toLowerCase().trim().split(/\s+/);
            return (
              <div
                key={
                  acronym.abbreviation + acronym.acronym_id + acronym.source_id
                }
                className="acronym-item"
              >
                <p>
                  <strong>
                    {highlightMatch(acronym.abbreviation, searchWords)}
                  </strong>{" "}
                  = {highlightMatch(acronym.expansion, searchWords)} (
                  {acronym.source})
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AcronymSearch;
