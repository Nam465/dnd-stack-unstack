import React, { useState } from "react"
import { Card, instanceOfStack, Stack } from "./grid"
import DraggableStack from "./draggable-stack"
import Input from "@material-ui/core/Input"

function DraggableItem({ item }: { item: Card | Stack }) {
    const [content, setContent] = useState(item.content)

    return (
        <div className="drag-item">
            <div className="drag-item-inner">
                {instanceOfStack(item) ? (
                    <DraggableStack stack={item as Stack} />
                ) : (
                    <Input
                        multiline
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                )}
            </div>
        </div>
    )
}

export default DraggableItem
