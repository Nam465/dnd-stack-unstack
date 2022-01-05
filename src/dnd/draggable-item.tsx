import React from "react"
import { Card, instanceOfStack, Stack } from "./grid"
import DraggableStack from "./draggable-stack"

function DraggableItem({ item }: { item: Card | Stack }) {
    return (
        <div className="drag-item">
            <div className="drag-item-inner">
                {instanceOfStack(item) ? (
                    <DraggableStack stack={item as Stack} />
                ) : (
                    <div>{item.content}</div>
                )}
            </div>
        </div>
    )
}

export default DraggableItem
