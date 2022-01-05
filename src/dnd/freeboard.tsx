import React, { useState } from "react"
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
    Combine,
    DraggableLocation,
} from "react-beautiful-dnd"
import initialData, {
    Grid,
    instanceOfCard,
    instanceOfStack,
    Stack,
} from "./grid"
import DraggableItem from "./draggable-item"
import uniqid from "uniqid"

function Freeboard() {
    const [grid, setGrid] = useState(initialData)

    /**
     * Place Item to empty space
     * Item come from Column
     * @param {DraggableLocation} destination
     * @param {DraggableLocation} source
     * @param {string} draggableId
     */
    const placeItemToEmptySpace = (
        destination: DraggableLocation,
        source: DraggableLocation,
        draggableId: string
    ) => {
        const destinationIndex = destination.index
        const destinationDroppableId = parseInt(destination.droppableId)
        const sourceDroppableId = parseInt(source.droppableId)
        const sourceIndex = source.index

        // Find the target card
        const draggableItem = findItemInGrid(draggableId, grid)

        if (!draggableItem) throw new Error("No draggable item")

        // Delete target card in source column
        grid[sourceDroppableId].splice(sourceIndex, 1)
        // Add target card to destination
        grid[destinationDroppableId].splice(destinationIndex, 0, draggableItem)
    }

    /**
     * Drop a card on another card or a stack. 
     * source Card come from Column
     * @param {Combine} combine
     * @param {DraggableLocation} source
     * @param {string} draggableId
     * @returns {void}
     */
    const combineItem = (
        combine: Combine,
        source: DraggableLocation,
        draggableId: string
    ) => {
        const { draggableId: combineDraggableId, droppableId } = combine
        const { droppableId: sourceDroppableId, index } = source

        const combineItem = findItemInGrid(combineDraggableId, grid)
        const draggableItem = findItemInGrid(draggableId, grid)
        if (!combineItem) throw new Error("Combine item is not exsit")
        if (!draggableItem) throw new Error("Draggable item is not exsit")

        // Card combine card
        if (!instanceOfStack(draggableItem) && !instanceOfStack(combineItem)) {
            grid[Number(sourceDroppableId)].splice(index, 1)
            const combineIndex = grid[Number(droppableId)].findIndex(
                (item) => item.id === combineDraggableId
            )
            if (combineIndex === -1)
                throw new Error("Index of combine item is not exsit")
            grid[Number(droppableId)].splice(combineIndex, 1)

            const id = uniqid()
            const stack: Stack = {
                id,
                content: "stack" + id,
                column: 0,
                row: 0,
                cards: [combineItem, draggableItem],
            }

            grid[Number(droppableId)].splice(combineIndex, 0, stack)

            setGrid(grid)
        }
        // Card combine Stack
        else if (
            !instanceOfStack(draggableItem) &&
            instanceOfStack(combineItem)
        ) {
            ;(combineItem as Stack).cards.push(draggableItem)
            grid[Number(sourceDroppableId)].splice(index, 1)
            setGrid(grid)
        }
    }

    /**
     * Drag Card from Stack and drop to tempty space or another card
     * @param {Combine | undefined} combine
     * @param {DraggableLocation} source
     * @param {DraggableLocation} destination
     * @param {string} draggableId
     * @returns
     */
    const unStack = (
        combine: Combine | undefined | null,
        source: DraggableLocation,
        destination: DraggableLocation,
        draggableId: string
    ) => {
        if (!combine) {
            const { droppableId: sourceDroppableId, index: sourceIndex } =
                source
            const { droppableId, index } = destination

            const sourceItem = findItemInGrid(sourceDroppableId, grid)
            if (!sourceItem) throw new Error("Source item is not exsit")
            const draggableItem = (sourceItem as Stack).cards.find(
                (item) => item.id === draggableId
            )
            if (!draggableItem) throw new Error("Draggable item is not exsit")
            ;(sourceItem as Stack).cards.splice(sourceIndex, 1)

            grid[Number(droppableId)].splice(index, 0, draggableItem)

            setGrid(grid)
        }
    }

    const findItemInGrid = (id: string, grid: Grid) => {
        return grid
            .reduce((total, currentValue) => [...total, ...currentValue], [])
            .find((item) => item.id === id)
    }

    const onDragEnd = (result: DropResult) => {
        try {
            const {
                combine,
                destination,
                draggableId,
                mode,
                reason,
                source,
                type,
            } = result

            // Drag Card from Stack and drop to tempty space or another card
            if (
                isNaN(Number(source.droppableId)) &&
                destination &&
                isNaN(Number(destination.droppableId)) == false
            ) {
                return unStack(combine, source, destination, draggableId)
            }

            if (!isNaN(Number(source.droppableId)) && combine) {
                return combineItem(combine, source, draggableId)
            }

            // Move card or stack to empty space
            if (!isNaN(Number(source.droppableId)) && destination) {
                placeItemToEmptySpace(destination, source, draggableId)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="cols">
                {grid.map((col, index) => (
                    <Droppable
                        type="Droppable"
                        key={index}
                        droppableId={String(index)}
                        isCombineEnabled
                    >
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="col"
                            >
                                {/* Draggable item  */}
                                {col.map((item, dragIndex) => (
                                    <Draggable
                                        key={String(item.id)}
                                        draggableId={String(item.id)}
                                        index={dragIndex}
                                    >
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.dragHandleProps}
                                                {...provided.draggableProps}
                                            >
                                                <DraggableItem item={item} />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}

                                {/* Placeholder  */}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                ))}
            </div>
        </DragDropContext>
    )
}

export default Freeboard
