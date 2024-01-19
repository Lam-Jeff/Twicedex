import { useState } from 'react';

import Footer from './footer';
import { Pagination } from './pagination';

import { TNewsProps } from './types/news';
import { TSubjectProps } from './types/subject';

import news from './files/news.json';



export const Home = () => {
  const [newsArray, setNewsArray] = useState<TNewsProps[]>(news)
  const [sizePage, setSizePage] = useState(5)

  /**
   * Filter news array.
   * 
   * @param {TSubjectProps} filter - filter's name
   */
  const handleFilterNewsArray = (filter: TSubjectProps) => {
    if (filter === 'All') setNewsArray(news)
    else setNewsArray(news.filter(object => object.subject === filter))
    setSizePage(5)
  }
  return (
    <>
      <div className="home-container">
        <section className='news'>
          <h2 className='home-title__news'>News</h2>
          <div className="home-container__filter-button-box">
            <button onClick={() => handleFilterNewsArray('All')}
              disabled={!(news.length > 0)}>
              All
            </button>
            <button onClick={() => handleFilterNewsArray('Game')}
              disabled={!(news.filter(object => object.subject === 'Game').length > 0)}>
              Game
            </button>
            <button onClick={() => handleFilterNewsArray('Collection')}
              disabled={!(news.filter(object => object.subject === 'Collection').length > 0)}
            >
              Collection
            </button>
          </div>
          <Pagination sizePage={sizePage}
            data={newsArray} />
        </section>
      </div>
      <Footer />
    </>

  )
}