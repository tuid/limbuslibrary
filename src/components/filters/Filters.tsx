import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { filterResetAllAction } from "../../store/reducers/filter-reducer";
import { Search } from "../search/Search";
import { ClearFilterSVG } from "../svg/ClearFilterSVG";
import { FilterSVG } from "../svg/FilterSVG";
import { FiltersList } from "./filters-list/FiltersList";
import { FiltersSection2 } from "./filters-section2/FiltersSection2";
import "./Filters.css";

export const Filters:React.FC = () => {
    const location =useLocation().pathname;
    const dispatch = useDispatch();
    return (
        <div className={"filters"}>
                <FiltersList/>
                <button onClick={()=>filterResetAllAction(dispatch)} className="clear-filters"><ClearFilterSVG/> Очистить фильтры</button>
                {!location.includes("/teambuilder") && <Search/>}
                <FiltersSection2/>
                
        </div>
    )
}
