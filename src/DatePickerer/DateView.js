import React, { useRef, useState } from "react";
require("./date.css");

export default function DateView(props){
    const currentDate= new Date();
    // const DAYS= ['Sunday', 'Monday', 'Tuesday', 'Wednesday',  'Thursday', 'Friday', 'Saturday'];
    // const WEEKEND= ['Sunday', 'Saturday'];
    const [startDate, setStartDate]= useState(null);
    const selectedDatePairs= useRef([]);

    


    const InitialGrid= [
        [1,2,3,4,5,6],
        [7,8,9,10,11, 12],
        [13,14,15,16,17,18]
    ]

    function prepareGrid(){
        return InitialGrid.map(itemList=>
            itemList.map(item=>({value: item, selected: false, startsFromHere: false, endsHere: false}))
        )
    }

    const [grid, setGrid]=  useState(prepareGrid(InitialGrid));

    function handleSelectedDate(event){
        debugger
        if(event.target.classList.contains('cell')){
            const id= event.target.id;
            const [start, end]= id.split("-").map(Number);
            const endDate= grid[start][end];
            if(startDate >= endDate.value){
                alert("end date cannot be smaller than start date");
                return
            }
            if(startDate){
                selectedDatePairs.current= [...selectedDatePairs.current, {start:startDate, end: endDate}];
                updateGrid(start, end, false, true);
                setStartDate(null);
            }else{
                setStartDate(endDate);
                updateGrid(start, end, true);
            }
        }

    }

    function iterateOverDays(newGrid, endDate){
        return newGrid.map((rows)=>(
            rows.map((item)=>{
                if(item.value > startDate.value && item.value <endDate.value){
                    console.log(item.value);
                    return {...item, selected: true}
                }
                return item
            })
        ))
    }

    function updateGrid(start, end, isStart=false, isEnd= false){
        let newGrid= JSON.parse(JSON.stringify(grid));
        newGrid[start][end]= {...newGrid[start][end], selected: true, startsFromHere: isStart}
        if(isEnd){
            newGrid= iterateOverDays(newGrid, newGrid[start][end])
            newGrid[start][end]= {...newGrid[start][end], selected: true, startsFromHere: isStart, endsHere: true}
        }
        setGrid(()=> newGrid);
    }

    const checkIfDateIsSelected= (incomingDate)=>{
        if(incomingDate.startsFromHere){
            return 'start'
        }else if(incomingDate.endsHere){
            return 'end'
        }else if(incomingDate.selected){
            return 'selected'
        }else{
            return 'cell'
        }
    }

    

    const CalendarDateCellView = (value, cellIndex, rowIndex)=>{
        const classKey= checkIfDateIsSelected(value);
        return(
            <div className={classKey} id={`${rowIndex}-${cellIndex}`} key={`cell-${cellIndex}`}>{value.value}</div>
        )
    }

    const CalendarGrid = () => {
        return (
            <>
                {
                    grid.map((row, rowIndex)=>(
                        <div className="rows" id={`row-${rowIndex}`} key={`row-${rowIndex}`}>
                            {
                                row.map((value, cellIndex)=>(
                                   CalendarDateCellView(value, cellIndex, rowIndex)
                                ))
                            }
                        </div>
                    ))
                }
            </>
        )
    }

    return (
        <div className="date-container">
            <div className="current-year">{currentDate.getFullYear()}</div>
            <div className="selected-dates">
                <div className="start-date"> Start Date: {}</div>
                <div className="end-date"> End Date: {}</div>
            </div>
            <div className="calendar-grid" onClick={handleSelectedDate}>
                <CalendarGrid/>
            </div>
        </div>
    )
}