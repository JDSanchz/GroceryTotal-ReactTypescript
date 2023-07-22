import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { GroceryItem } from './types';

function App() {
  const savedItems = JSON.parse(localStorage.getItem('groceryItems') || '[]');
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>(savedItems);
  const [itemName, setItemName] = useState<string>('');
  const [itemPrice, setItemPrice] = useState<string>('');

  const handleAddItem = () => {
    if (itemName && itemPrice) {
      const newItem: GroceryItem = {
        id: Date.now(),
        name: itemName,
        price: parseFloat(itemPrice),
      };

      setGroceryItems([...groceryItems, newItem]);
      setItemName('');
      setItemPrice('');
    }
  };

  const handleDeleteItem = (id: number) => {
    const updatedItems = groceryItems.filter(item => item.id !== id);
    setGroceryItems(updatedItems);
  };

  useEffect(() => {
    localStorage.setItem('groceryItems', JSON.stringify(groceryItems));
  }, [groceryItems]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(groceryItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setGroceryItems(items);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="groceryItems">
        {(provided) => (
          <ul {...provided.droppableProps} ref={provided.innerRef}>
            {groceryItems.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                {(provided) => (
                  <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    {item.name} - ${item.price.toFixed(2)}
                    <button className="delete-button" onClick={() => handleDeleteItem(item.id)} style={{marginLeft: '10px'}}>❌</button>
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
      <div>
        <input
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder="Item Name"
        />
        <input
          type="number"
          value={itemPrice}
          onChange={(e) => setItemPrice(e.target.value)}
          placeholder="Item Price"
        />
        <button onClick={handleAddItem}>Add Item</button>
      </div>
      <p>Total: ${groceryItems.reduce((acc, item) => acc + item.price, 0).toFixed(2)}</p>
    </DragDropContext>
  );
}

export default App;
