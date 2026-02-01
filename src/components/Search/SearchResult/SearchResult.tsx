'use client';

import React, { KeyboardEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';

import style from './SearchResult.module.scss';
import SearchCard from '../SearchCard/SearchCard';

import { ISearchResult } from '@/shared/types/searchResult';

const { searchResult, searchContainer, searchResultContainer, cardContainer } =
  style;

interface ISerachResultProps {
  searchResultData: ISearchResult[];
}

const SearchResult = ({ searchResultData }: ISerachResultProps) => {
  const router = useRouter();
  const handleSearchOnKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter') {
      if ((e.target as HTMLInputElement).value.length <= 3) {
        alert('Please enter more than 3 characters');
      }
      if ((e.target as HTMLInputElement).value.length >= 3) {
        router.push(`/search/${(e.target as HTMLInputElement).value}`);
      }
    }
  };

  const searchInput = useRef<HTMLInputElement | null>(null);
  const handleSearchOnClick = () => {
    const inputValue = searchInput.current?.value;

    if (inputValue && inputValue.length <= 3) {
      alert('Please enter more than 3 characters');
    } else if (inputValue && inputValue.length >= 3) {
      router.push(`/search/${inputValue}`);
    }
  };

  return (
    <div className={searchResult}>
      <div className={searchContainer}>
        <input
          ref={searchInput}
          type="text"
          placeholder="Search..."
          onKeyUp={handleSearchOnKeyUp}
        />
        <button onClick={() => handleSearchOnClick()}>Search</button>
      </div>
      <div className={searchResultContainer}>
        {searchResultData.length === 0 ? (
          <h1>No data found</h1>
        ) : (
          searchResultData.map((searchData) => (
            <div key={searchData.id} className={cardContainer}>
              <SearchCard data={searchData} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchResult;
