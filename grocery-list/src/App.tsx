import React, { useState, useEffect } from 'react'; // Added useEffect import
import { GroceryItem } from './types';

function App() {
  // Retrieve items from localStorage on initial load
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

  // UseEffect to save items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('groceryItems', JSON.stringify(groceryItems));
  }, [groceryItems]);

  return (
    <div className="App">
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
      <ul>
        {groceryItems.map((item) => (
          <li key={item.id}>
            {item.name} - ${item.price.toFixed(2)}
            <button className="delete-button" onClick={() => handleDeleteItem(item.id)} style={{marginLeft: '10px'}}>❌</button>
          </li>
        ))}
      </ul>
      <p>Total: ${groceryItems.reduce((acc, item) => acc + item.price, 0).toFixed(2)}</p>
    </div>
  );
}

export default App;
