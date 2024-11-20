import React from "react";
import '../../style/pagination.css';

//COMPONENTE DE PAGINACION
const Pagination=({currentPage,totalPages,onPageChange})=>{
    //ARREGLO PARA ALMACENAR LOS NUMEROS DE LA PAGINA
    const pageNumbers=[];
    //GENERA LOS NUMEROS DE LA PAGINA HASTA TOTAL PAGES
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return(
        <div className="pagination">
            {pageNumbers.map((number)=>(
                <button 
                    key={number}
                    onClick={()=>onPageChange(number)}  //CAMBIA A LA PAGINA CUANDO SE HACE CLICK EN EL NUMERO   
                    className={number===currentPage?'active':''} //APLICA LA CLASE ACTIVE A LA PAGINA ACTUAL, ES PARA DESTACAR LA PAGINA ACTUAL
                >
                    {number}
                </button>
            ))}
        </div>
    )
}

export default Pagination;