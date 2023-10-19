import React, {useRef} from "react";
import { useIntersectionObserver } from "../../../hooks/useIntersectionObserver";
import { useTypedSelector } from "../../../hooks/useTypedSelector";
import { EGOInterface } from "../../../store/reducers/ego-reducer";
import { IdentityInterface } from "../../../store/reducers/ids-reducer";
import { ItemEntity } from "../../item-entity/ItemEntity";
import "./EntitySection.css"
interface EntitySectionBarProps {
    section:{
        date: string;
        data: Array<IdentityInterface | EGOInterface>;
    }
}
export const EntitySection:React.FC = () => {
    const {ego} = useTypedSelector(state => state.egoReducer);
    const {ids} = useTypedSelector(state => state.idsReducer);
    
    function dateToExcel(jsDate:Date) {
        const excelStartDate = new Date(1899, 11, 30);
        const millisecondsPerDay = 24 * 60 * 60 * 1000;
        const daysDifference = (jsDate.getTime() - excelStartDate.getTime()) / millisecondsPerDay;
        return daysDifference;
      }
      function excelToDate(excelDate:number) {
        const excelStartDate = new Date(1899, 11, 30);
        const millisecondsPerDay = 24 * 60 * 60 * 1000;
        const date = new Date(excelStartDate.getTime() + excelDate * millisecondsPerDay);
        return date;
      }
      
      const formateDate = (date:string|number) =>{
        const newDate = (typeof date === "string" )  ? new Date(date) : excelToDate(date);
        return `${newDate.getDate()}.${newDate.getMonth()+1}.${newDate.getFullYear()}`
      }
    const findNLatestDates = (ids:IdentityInterface[], egos:EGOInterface[] , N:number) =>{
        const allData: Array<IdentityInterface | EGOInterface> = Array.from(ids);
        allData.concat(egos);
        allData.sort((a, b) =>{
            const dateA = (typeof a.releaseDate === "string" )  ? dateToExcel(new Date(a.releaseDate)) : a.releaseDate;
            const dateB = (typeof b.releaseDate === "string" )  ? dateToExcel(new Date(b.releaseDate)) : b.releaseDate;
            return dateB - dateA;
        } );

        const result:Array<{date:string,data:Array<IdentityInterface|EGOInterface>}> = [] ;
        for (let i = 0; i < allData.length; i++) {
            const currentData = allData[i];
            const date = currentData.releaseDate;
            if(!result.length){
                result.push({date,data:[currentData]});
                continue;
            } 

            let isPushed = false;
            for(let r = 0 ; r <result.length;r++){
                if(result[r].date === date){
                    result[r].data.push(currentData);
                    isPushed = true;
                    break;
                } 
            }
            if(!isPushed && result.length < N){
                result.push({date,data:[currentData]});
                continue;
            }
            if(!isPushed && result.length === N) break;
            
        }
        return result;
    }
    const EntitySectionBar:React.FC<EntitySectionBarProps> = ({section}) => {
        const containerRef = useRef(null);
        const {isVisible} = useIntersectionObserver(containerRef,0.1);
        return <article ref={containerRef} className={`entity-section-bar ${isVisible && "entity-section-bar--animated"}`}>
        <div className="release-date"> 
            <span className="date"> {formateDate(section.date)} </span>
            <hr></hr>
        </div>
        <div className="entities-list"> 
            {   
            section.data.map((entity)=>{
                return <ItemEntity key={entity.name} entity={entity} /> ;
            })
            }
        </div>
        
    </article>
    }
    
    return <section className="entity-section"> 
        <h2> Недавно вышедшие Личности и ЭГО </h2>
        { ids && ego && findNLatestDates(ids,ego,5).map((section,index)=>{
                return <EntitySectionBar key={index} section={section}/>
            })
        }
    </section>
}