import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="header">
        <p className="eyebrow">Blick Shopping</p>
        <h1>Shopping List</h1>
        <p className="subtitle">
          Add products, mark them as bought, and keep your list fresh.
        </p>
      </header>
      <main className="panel">
        <div className="input-row">
          <input
            aria-label="Product name"
            className="item-input"
            placeholder="Add a product (e.g., Butter)"
            type="text"
          />
          <button className="add-button" type="button">
            Add
          </button>
        </div>
        <div className="list">
          <p className="list-placeholder">No items yet.</p>
        </div>
      </main>
    </div>
  );
}

export default App;
