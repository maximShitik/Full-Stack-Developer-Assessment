import FilterableList from "./components/FilterableList.jsx";



const sampleItems = [
  { id: "1", title: "Project Alpha", category: "Development", status: "active", createdAt: "2024-01-15T10:00:00Z" },
  { id: "2", title: "Design Review", category: "Design", status: "pending", createdAt: "2024-01-14T09:00:00Z" },
  { id: "3", title: "API Documentation", category: "Documentation", status: "active", createdAt: "2024-01-13T14:00:00Z" },
  { id: "4", title: "Legacy System", category: "Development", status: "archived", createdAt: "2023-12-01T08:00:00Z" },
  { id: "5", title: "User Research", category: "Design", status: "pending", createdAt: "2024-01-10T11:00:00Z" },
];

const empty = []

function App() {


  return (
    <div style={{ minHeight: "100vh", padding: 20 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        

        <FilterableList
          items={sampleItems}
          loading={false}
          onItemClick={(item) => console.log("Clicked:", item.id)}
        />
      </div>
    </div>
  );
}

export default App
