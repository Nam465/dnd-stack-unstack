import React from "react"
import { Stack } from "./grid"
import { Droppable, Draggable } from "react-beautiful-dnd"

function DraggableStack({ stack }: { stack: Stack }) {
    return (
        <div className="stack">
            <Droppable type="Droppable" droppableId={stack.id} isDropDisabled>
                {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                        <div className="stack-title">{stack.content}</div>

                        {/* Drappable item  */}
                        {stack.cards.map((card, index) => (
                            <Draggable
                                key={card.id}
                                index={index}
                                draggableId={card.id}
                            >
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.dragHandleProps}
                                        {...provided.draggableProps}
                                    >
                                        <div className="stack-item">
                                            <div className="stack-item-inner">
                                                {card.content}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}

                        {/* Placeholder  */}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    )
}

export default DraggableStack
