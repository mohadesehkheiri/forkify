import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');

    addHandlerPagination(handler) {
        this._parentElement.addEventListener('click' , function(e){
            const btn = e.target.closest('.btn--inline');
            if(!btn) return;
            
           const goToPage = +btn.dataset.goto;


           handler(goToPage);
        });
    }



    _generateMarkup() {
        const curPage = this._data.page;
        const numPage = Math.ceil(this._data.results.length / this._data.resultPerPage);


        const createButton = (type, page) => `
            <button data-goto ="${page}" class="btn--inline pagination__btn--${type}">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-${type === 'prev' ? 'left' : 'right'}"></use>
                </svg>
                <span>Page ${page}</span>
            </button>
        `;

        //page1 and there are other pages
        if (curPage === 1 && numPage > 1) {
            return createButton('next', curPage + 1);
        }

        // last pages
        if (curPage === numPage && numPage > 1) {
            return createButton('prev', curPage - 1);
        }

        // other pages 
        if (curPage < numPage) {
            const prevButton = createButton('prev', curPage - 1);
            const nextButton = createButton('next', curPage + 1);
            return `${prevButton}${nextButton}`;
        }

        // page1 and there are no other pages
        return '';
    };

}


export default new PaginationView();