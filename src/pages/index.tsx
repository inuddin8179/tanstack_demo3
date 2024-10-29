import { useEffect, useState,useRef } from 'react';

interface Item {
  id: number;
  name: string;
}

const Home = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const inputele=useRef<HTMLInputElement>(null);
  useEffect(() => {
   
    const fetchItems = async () => {
      const res = await fetch('/api/items');
      const data = await res.json();
      setItems(data);
    };

    fetchItems();
    inputele.current?.focus()
  }, []);

  const handleAddItem = async () => {
    if (!name) return;
    const res = await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    const newItem = await res.json();
    setItems([...items, newItem]);
    setName('');
  };

  const handleEditItem = (item: Item) => {
    setName(item.name);
    setEditingId(item.id);
  };

  const handleUpdateItem = async () => {
    if (!editingId || !name) return;
    await fetch('/api/items', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingId, name }),
    });
    setItems(items.map(item => (item.id === editingId ? { ...item, name } : item)));
    setEditingId(null);
    setName('');
  };

  const handleDeleteItem = async (id: number) => {
    await fetch(`/api/items?id=${id}`, {
      method: 'DELETE',
    });
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Simple CRUD App</h1>
      <input
        ref={inputele}
        type="text"
        value={name}
        placeholder="Item Name"
        onChange={(e) => setName(e.target.value)}
        className="border rounded p-2 mr-2"
      />
      <button
        onClick={editingId ? handleUpdateItem : handleAddItem}
        className="bg-blue-500 text-white rounded px-4 py-2"
      >
        {editingId ? 'Update' : 'Add'}
      </button>

      <ul className="mt-4">
        {items.map(item => (
          <li key={item.id} className="flex justify-between items-center border-b py-2">
            <span>{item.name}</span>
            <div>
              <button
                onClick={() => handleEditItem(item)}
                className="bg-yellow-500 text-white rounded px-2 py-1 mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="bg-red-500 text-white rounded px-2 py-1"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
